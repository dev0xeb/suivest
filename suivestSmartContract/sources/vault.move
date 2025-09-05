module suivest::vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::option::{Self, Option};

    use pyth::price_info::{Self, PriceInfoObject};

    use suivest::errors;
    use suivest::events;
    use suivest::types::{Self, VaultConfig, UserParticipation, Round, Winner, UserStats, ReentrancyGuard, TokenRegistry, UserRegistry, RoundRegistry, TokenType};

    /// Main vault object storing all state for a specific token type
    public struct Vault<T> has key {
        id: UID,
        config: VaultConfig,
        token_type: TokenType,
        
        // Current round state
        current_round: Option<Round>,
        participants: Table<address, UserParticipation>,
        
        // Vault balances
        principal_balance: Balance<T>,
        yield_balance: Balance<T>,
        prize_pool: Balance<T>,
        
        // Statistics
        total_deposits: u64,
        total_withdrawals: u64,
        total_prizes_distributed: u64,
        active_participants: u64,
        total_usd_value: u64,
        
        // Security
        reentrancy_guard: ReentrancyGuard,
        
        // External registries
        token_registry: &mut TokenRegistry,
        user_registry: &mut UserRegistry,
        round_registry: &mut RoundRegistry,
        clock: &Clock,
    }

    /// Capability for admin functions
    public struct AdminCap has key, store {
        id: UID,
        vault_id: address,
    }

    /// Capability for treasury functions
    public struct TreasuryCap has key, store {
        id: UID,
        vault_id: address,
    }

    // ========== Initialization ==========

    /// Initialize a new vault for a specific token type
    public fun new<T>(
        admin: address,
        treasury: address,
        token_type: TokenType,
        token_registry: &mut TokenRegistry,
        user_registry: &mut UserRegistry,
        round_registry: &mut RoundRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ): (Vault<T>, AdminCap, TreasuryCap) {
        let vault_id = object::new(ctx);
        
        let config = types::VaultConfig {
            admin,
            treasury,
            round_duration: types::DEFAULT_ROUND_DURATION,
            min_deposit: if (token_type.decimals == 6) { types::MIN_DEPOSIT_USDC } else { types::MIN_DEPOSIT_SUI },
            max_deposit: types::MAX_DEPOSIT,
            withdrawal_cooldown: types::DEFAULT_WITHDRAWAL_COOLDOWN,
            max_participants: types::DEFAULT_MAX_PARTICIPANTS,
            prize_distribution: vector[50, 30, 20],
            yield_fee_percentage: types::YIELD_FEE_BASIS_POINTS,
            is_paused: false,
        };

        let vault = Vault<T> {
            id: vault_id,
            config,
            token_type,
            current_round: option::none<Round>(),
            participants: table::new<address, UserParticipation>(ctx),
            principal_balance: balance::zero<T>(),
            yield_balance: balance::zero<T>(),
            prize_pool: balance::zero<T>(),
            total_deposits: 0,
            total_withdrawals: 0,
            total_prizes_distributed: 0,
            active_participants: 0,
            reentrancy_guard: types::new_reentrancy_guard(ctx),
            token_registry,
            user_registry,
            round_registry,
            clock,
        };

        let admin_cap = AdminCap {
            id: object::new(ctx),
            vault_id: object::uid_to_address(&vault_id),
        };

        let treasury_cap = TreasuryCap {
            id: object::new(ctx),
            vault_id: object::uid_to_address(&vault_id),
        };

        (vault, admin_cap, treasury_cap)
    }

    // ========== Deposit & Withdrawal ==========

    /// Deposit tokens into the vault and receive tickets
    public entry fun deposit<T>(
        vault: &mut Vault<T>,
        funds: Coin<T>,
        price_info: &PriceInfoObject,
        ctx: &mut TxContext
    ) {
        // Reentrancy protection
        assert!(!vault.reentrancy_guard.locked, errors::E_REENTRANCY_GUARD);
        vault.reentrancy_guard.locked = true;

        // Validate vault state
        assert!(!vault.config.is_paused, errors::E_VAULT_PAUSED);
        assert!(table::length(&vault.participants) < vault.config.max_participants, errors::E_MAX_PARTICIPANTS_REACHED);

        let amount = coin::value(&funds);
        assert!(amount >= vault.config.min_deposit, errors::E_INVALID_AMOUNT);
        assert!(amount <= vault.config.max_deposit, errors::E_DEPOSIT_LIMIT_EXCEEDED);

        // Get price from Pyth oracle
        let price = price_info::get_price(price_info);
        let price_expo = price_info::get_exponent(price_info);

        // Check for stale price
        let current_time = clock::timestamp_ms(vault.clock);
        let price_timestamp = price_info::get_timestamp(price_info);
        assert!(current_time - price_timestamp < 60000, errors::E_PRICE_TOO_OLD);

        // Calculate USD value of the deposit
        let amount128 = amount as u128;
        let price128 = price as u128;
        let token_decimal_factor = 10u128.pow(vault.token_type.decimals as u32);
        let price_decimal_factor = 10u128.pow((-price_expo) as u32);

        let usd_value = (amount128 * price128) / (token_decimal_factor * price_decimal_factor);

        // Calculate tickets ($1 = 1 ticket), rounding down.
        let tickets = usd_value;
        assert!(tickets > 0, errors::E_INVALID_AMOUNT);

        let sender = tx_context::sender(ctx);

        // Add to principal balance
        balance::join(&mut vault.principal_balance, coin::into_balance(funds));

        // Update or create user participation
        if (table::contains(&vault.participants, &sender)) {
            let participation = table::borrow_mut(&mut vault.participants, &sender);
            participation.tickets = participation.tickets + tickets;
            participation.usd_value = participation.usd_value + (usd_value as u64);
        } else {
            let participation = types::new_user_participation(
                tickets,
                usd_value as u64,
                current_time,
                0 // Will be updated based on previous rounds
            );
            table::add(&mut vault.participants, sender, participation);
            vault.active_participants = vault.active_participants + 1;
        };

        // Update user stats
        update_user_stats(vault.user_registry, sender, amount, 0, current_time, true);

        vault.total_deposits = vault.total_deposits + amount;
        vault.total_usd_value = vault.total_usd_value + (usd_value as u64);

        // Emit event
        event::emit(events::Deposited {
            vault_id: object::uid_to_address(&vault.id),
            user: sender,
            token_type: vault.token_type.coin_type,
            amount,
            tickets_minted: tickets,
            round_id: get_current_round_id(vault),
            timestamp: current_time,
        });

        // Release reentrancy guard
        vault.reentrancy_guard.locked = false;
    }

    /// Withdraw tokens from the vault by burning tickets
    public entry fun withdraw<T>(
        vault: &mut Vault<T>,
        tickets: u128,
        ctx: &mut TxContext
    ) {
        // Reentrancy protection
        assert!(!vault.reentrancy_guard.locked, errors::E_REENTRANCY_GUARD);
        vault.reentrancy_guard.locked = true;

        // Validate vault state
        assert!(!vault.config.is_paused, errors::E_VAULT_PAUSED);
        assert!(tickets > 0, errors::E_INVALID_AMOUNT);

        let sender = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(vault.clock);

        // Check user participation
        assert!(table::contains(&vault.participants, &sender), errors::E_INSUFFICIENT_BALANCE);
        let participation = table::borrow_mut(&mut vault.participants, &sender);
        assert!(participation.tickets >= tickets, errors::E_INSUFFICIENT_BALANCE);

        // Check withdrawal cooldown
        let time_since_deposit = current_time - participation.deposit_time;
        assert!(time_since_deposit >= vault.config.withdrawal_cooldown, errors::E_WITHDRAWAL_COOLDOWN);

        // Calculate withdrawal amount (1:1 ratio)
        let withdrawal_amount = (tickets as u64);

        // Validate sufficient balance
        assert!(balance::value(&vault.principal_balance) >= withdrawal_amount, errors::E_INSUFFICIENT_BALANCE);

        // Update participation
        participation.tickets = participation.tickets - tickets;
        if (participation.tickets == 0) {
            table::remove(&mut vault.participants, &sender);
            vault.active_participants = vault.active_participants - 1;
        };

        // Transfer tokens
        let payout = coin::from_balance(balance::split(&mut vault.principal_balance, withdrawal_amount), ctx);
        transfer::transfer(payout, sender);

        // Update user stats
        update_user_stats(vault.user_registry, sender, 0, withdrawal_amount, current_time, false);

        vault.total_withdrawals = vault.total_withdrawals + withdrawal_amount;

        // Emit event
        event::emit(events::Withdrawn {
            vault_id: object::uid_to_address(&vault.id),
            user: sender,
            token_type: vault.token_type.coin_type,
            amount: withdrawal_amount,
            tickets_burned: tickets,
            round_id: get_current_round_id(vault),
            timestamp: current_time,
        });

        // Release reentrancy guard
        vault.reentrancy_guard.locked = false;
    }

    // ========== Round Management ==========

    /// Start a new round (admin only)
    public entry fun start_round<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        assert!(!vault.config.is_paused, errors::E_VAULT_PAUSED);

        // Check if current round is active
        if (option::is_some(&vault.current_round)) {
            let current_round = option::borrow(&vault.current_round);
            assert!(!current_round.is_active, errors::E_ROUND_ALREADY_STARTED);
        };

        let current_time = clock::timestamp_ms(vault.clock);
        let round_id = get_current_round_id(vault) + 1;
        let end_time = current_time + vault.config.round_duration;

        // Create new round
        let new_round = types::Round {
            round_id,
            start_time: current_time,
            end_time,
            total_participants: vault.active_participants,
            total_tickets: get_total_tickets(vault),
            prize_pool: balance::value(&vault.prize_pool),
            is_active: true,
            is_finalized: false,
            randomness_seed: 0,
            winners: vector::empty<Winner>(),
        };

        vault.current_round = option::some(new_round);

        // Emit event
        event::emit(events::RoundStarted {
            vault_id: object::uid_to_address(&vault.id),
            round_id,
            start_time: current_time,
            end_time,
            total_participants: vault.active_participants,
            total_tickets: get_total_tickets(vault),
            prize_pool: balance::value(&vault.prize_pool),
        });
    }

    /// End the current round and select winners (admin only)
    public entry fun end_round<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        randomness_seed: u128,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        assert!(option::is_some(&vault.current_round), errors::E_DRAW_NOT_ACTIVE);

        let current_round = option::borrow_mut(&mut vault.current_round);
        assert!(current_round.is_active, errors::E_DRAW_NOT_ACTIVE);

        let current_time = clock::timestamp_ms(vault.clock);
        assert!(current_time >= current_round.end_time, errors::E_ROUND_NOT_ENDED);

        // Finalize round
        current_round.is_active = false;
        current_round.is_finalized = true;
        current_round.randomness_seed = randomness_seed;

        // Select winners
        let winners = select_winners(vault, randomness_seed);
        current_round.winners = winners;

        // Store round in registry
        let round_copy = *current_round;
        table::add(&mut vault.round_registry.rounds, round_copy.round_id, round_copy);
        vault.round_registry.current_round_id = round_copy.round_id;

        // Emit event
        event::emit(events::RoundEnded {
            vault_id: object::uid_to_address(&vault.id),
            round_id: round_copy.round_id,
            end_time: current_time,
            total_prize_distributed: 0, // Will be updated when prizes are claimed
            winner_count: vector::length(&round_copy.winners),
            randomness_seed,
        });
    }

    // ========== Prize Management ==========

    /// Claim prize for the current user
    public entry fun claim_prize<T>(
        vault: &mut Vault<T>,
        ctx: &mut TxContext
    ) {
        assert!(option::is_some(&vault.current_round), errors::E_DRAW_NOT_ACTIVE);

        let current_round = option::borrow(&vault.current_round);
        assert!(current_round.is_finalized, errors::E_DRAW_NOT_ACTIVE);

        let sender = tx_context::sender(ctx);
        let current_time = clock::timestamp_ms(vault.clock);

        // Find winner
        let mut prize_amount = 0u64;
        let mut position = 0u8;
        let mut winner_index = 0u64;

        let winners = &current_round.winners;
        let i = 0;
        while (i < vector::length(winners)) {
            let winner = vector::borrow(winners, i);
            if (winner.address == sender && !winner.has_claimed) {
                prize_amount = winner.prize_amount;
                position = winner.position;
                winner_index = i;
                break;
            };
            i = i + 1;
        };

        assert!(prize_amount > 0, errors::E_NOT_WINNER);

        // Transfer prize
        let payout = coin::from_balance(balance::split(&mut vault.prize_pool, prize_amount), ctx);
        transfer::transfer(payout, sender);

        // Mark as claimed
        let current_round_mut = option::borrow_mut(&mut vault.current_round);
        let winners_mut = &mut current_round_mut.winners;
        let winner_mut = vector::borrow_mut(winners_mut, winner_index);
        winner_mut.has_claimed = true;

        vault.total_prizes_distributed = vault.total_prizes_distributed + prize_amount;

        // Update user stats
        update_user_stats(vault.user_registry, sender, 0, 0, current_time, false);
        let user_stats = table::borrow_mut(&mut vault.user_registry.users, &sender);
        user_stats.prizes_won = user_stats.prizes_won + 1;

        // Emit event
        event::emit(events::PrizeClaimed {
            vault_id: object::uid_to_address(&vault.id),
            round_id: current_round.round_id,
            winner: sender,
            prize_amount,
            position,
            timestamp: current_time,
        });
    }

    // ========== Yield Management ==========

    /// Harvest yield into the prize pool (admin only)
    public entry fun harvest_yield<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        yield_amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        assert!(yield_amount > 0, errors::E_INVALID_AMOUNT);

        let current_time = clock::timestamp_ms(vault.clock);

        // Calculate fee
        let fee_amount = (yield_amount * vault.config.yield_fee_percentage) / 10000;
        let net_yield = yield_amount - fee_amount;

        // Add to prize pool
        balance::join(&mut vault.prize_pool, balance::zero<T>()); // Placeholder - would add actual yield

        // Emit event
        event::emit(events::YieldHarvested {
            vault_id: object::uid_to_address(&vault.id),
            token_type: vault.token_type.coin_type,
            yield_amount: net_yield,
            timestamp: current_time,
        });
    }

    // ========== Admin Functions ==========

    /// Pause the vault (admin only)
    public entry fun pause_vault<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        vault.config.is_paused = true;

        event::emit(events::VaultPaused {
            vault_id: object::uid_to_address(&vault.id),
            paused: true,
            timestamp: clock::timestamp_ms(vault.clock),
        });
    }

    /// Unpause the vault (admin only)
    public entry fun unpause_vault<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        vault.config.is_paused = false;

        event::emit(events::VaultPaused {
            vault_id: object::uid_to_address(&vault.id),
            paused: false,
            timestamp: clock::timestamp_ms(vault.clock),
        });
    }

    /// Update vault configuration (admin only)
    public entry fun update_config<T>(
        vault: &mut Vault<T>,
        _admin_cap: &AdminCap,
        new_config: VaultConfig,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.config.admin, errors::E_UNAUTHORIZED);
        vault.config = new_config;

        event::emit(events::AdminAction {
            vault_id: object::uid_to_address(&vault.id),
            action: b"config_updated",
            admin: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(vault.clock),
        });
    }

    // ========== View Functions ==========

    /// Get user's ticket balance
    public fun get_user_tickets<T>(vault: &Vault<T>, user: address): u128 {
        if (table::contains(&vault.participants, &user)) {
            let participation = table::borrow(&vault.participants, &user);
            participation.tickets
        } else {
            0
        }
    }

    /// Get total tickets in current round
    public fun get_total_tickets<T>(vault: &Vault<T>): u128 {
        let mut total = 0u128;
        let participants = &vault.participants;
        let i = 0;
        while (i < table::length(participants)) {
            let participation = table::borrow(participants, &table::borrow_key(participants, i));
            total = total + participation.tickets;
            i = i + 1;
        };
        total
    }

    /// Get current round ID
    public fun get_current_round_id<T>(vault: &Vault<T>): u64 {
        if (option::is_some(&vault.current_round)) {
            let current_round = option::borrow(&vault.current_round);
            current_round.round_id
        } else {
            0
        }
    }

    /// Get vault statistics
    public fun get_vault_stats<T>(vault: &Vault<T>): (u64, u64, u64, u64, u64) {
        (
            vault.total_deposits,
            vault.total_withdrawals,
            vault.total_prizes_distributed,
            vault.active_participants,
            balance::value(&vault.principal_balance)
        )
    }

    // ========== Internal Functions ==========

    /// Select winners based on randomness seed
    fun select_winners<T>(vault: &Vault<T>, randomness_seed: u128): vector<Winner> {
        let winners = vector::empty<Winner>();
        let total_tickets = get_total_tickets(vault);
        
        if (total_tickets == 0) {
            return winners;
        };

        // Simple weighted random selection (can be improved)
        let mut seed = randomness_seed;
        let participants = &vault.participants;
        let participant_count = table::length(participants);

        if (participant_count == 0) {
            return winners;
        };

        // Select 3 winners
        let i = 0;
        while (i < types::MAX_WINNERS) {
            if (participant_count == 0) break;
            
            // Simple random selection (replace with proper VRF)
            let winner_index = (seed % (participant_count as u128)) as u64;
            let winner_address = *table::borrow_key(participants, winner_index);
            
            // Calculate prize amount
            let prize_percentage = if (i == 0) { types::FIRST_PLACE_PERCENTAGE }
                                 else if (i == 1) { types::SECOND_PLACE_PERCENTAGE }
                                 else { types::THIRD_PLACE_PERCENTAGE };
            
            let prize_amount = (balance::value(&vault.prize_pool) * prize_percentage) / 10000;
            
            let winner = types::Winner {
                address: winner_address,
                position: (i + 1) as u8,
                prize_amount,
                has_claimed: false,
            };
            
            vector::push_back(&mut winners, winner);
            
            // Update seed for next selection
            seed = seed + 1;
            i = i + 1;
        };

        winners
    }

    /// Update user statistics
    fun update_user_stats(
        user_registry: &mut UserRegistry,
        user: address,
        deposit_amount: u64,
        withdrawal_amount: u64,
        timestamp: u64,
        is_deposit: bool
    ) {
        if (!table::contains(&user_registry.users, &user)) {
            let stats = types::new_user_stats();
            table::add(&mut user_registry.users, user, stats);
            user_registry.user_count = user_registry.user_count + 1;
        };

        let stats = table::borrow_mut(&mut user_registry.users, &user);
        
        if (is_deposit) {
            stats.total_deposits = stats.total_deposits + deposit_amount;
            stats.current_streak = stats.current_streak + 1;
            if (stats.current_streak > stats.longest_streak) {
                stats.longest_streak = stats.current_streak;
            };
        } else {
            stats.total_withdrawals = stats.total_withdrawals + withdrawal_amount;
            stats.current_streak = 0;
        };

        stats.last_activity = timestamp;
    }
} 