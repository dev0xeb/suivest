module suivest::yield_adapter {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::transfer;
    use sui::event;
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::option::{Self, Option};

    use suivest::errors;
    use suivest::events;

    /// Yield strategy configuration
    public struct YieldStrategy has store, drop {
        pub name: vector<u8>,
        pub description: vector<u8>,
        pub apy_target: u64, // basis points (e.g., 500 = 5%)
        pub risk_level: u8, // 1-5 scale
        pub is_active: bool,
        pub min_deposit: u64,
        pub max_deposit: u64,
    }

    /// Yield adapter for a specific token type
    public struct YieldAdapter<T> has key {
        id: UID,
        token_type: address,
        strategies: vector<YieldStrategy>,
        active_strategy_index: u64,
        
        // Balances
        total_deposited: Balance<T>,
        total_yield_generated: Balance<T>,
        pending_yield: Balance<T>,
        
        // Statistics
        total_deposits: u64,
        total_withdrawals: u64,
        last_yield_harvest: u64,
        
        // Configuration
        yield_fee_percentage: u64, // basis points
        min_yield_threshold: u64,
        auto_harvest_enabled: bool,
        
        // External dependencies
        clock: &Clock,
    }

    /// Mock yield generator for testing
    public struct MockYieldGenerator<T> has key {
        id: UID,
        token_type: address,
        mock_apy: u64, // basis points
        last_update: u64,
        total_generated: Balance<T>,
    }

    /// Yield harvest event
    public struct YieldHarvested has copy, drop {
        pub adapter_id: address,
        pub token_type: address,
        pub yield_amount: u64,
        pub fee_amount: u64,
        pub net_yield: u64,
        pub timestamp: u64,
    }

    /// Strategy updated event
    public struct StrategyUpdated has copy, drop {
        pub adapter_id: address,
        pub strategy_name: vector<u8>,
        pub old_apy: u64,
        pub new_apy: u64,
        pub timestamp: u64,
    }

    // ========== Initialization ==========

    /// Initialize a new yield adapter
    public fun new<T>(
        token_type: address,
        clock: &Clock,
        ctx: &mut TxContext
    ): YieldAdapter<T> {
        let strategies = vector::empty<YieldStrategy>();
        
        // Add default strategies
        let default_strategy = YieldStrategy {
            name: b"Conservative",
            description: b"Low-risk yield generation",
            apy_target: 300, // 3% APY
            risk_level: 1,
            is_active: true,
            min_deposit: 1000000, // 0.001 tokens
            max_deposit: 1000000000000, // 1M tokens
        };
        vector::push_back(&mut strategies, default_strategy);

        let moderate_strategy = YieldStrategy {
            name: b"Moderate",
            description: b"Balanced risk-reward yield",
            apy_target: 800, // 8% APY
            risk_level: 3,
            is_active: true,
            min_deposit: 1000000,
            max_deposit: 1000000000000,
        };
        vector::push_back(&mut strategies, moderate_strategy);

        let aggressive_strategy = YieldStrategy {
            name: b"Aggressive",
            description: b"High-risk high-reward yield",
            apy_target: 1500, // 15% APY
            risk_level: 5,
            is_active: true,
            min_deposit: 1000000,
            max_deposit: 1000000000000,
        };
        vector::push_back(&mut strategies, aggressive_strategy);

        YieldAdapter<T> {
            id: object::new(ctx),
            token_type,
            strategies,
            active_strategy_index: 0,
            total_deposited: balance::zero<T>(),
            total_yield_generated: balance::zero<T>(),
            pending_yield: balance::zero<T>(),
            total_deposits: 0,
            total_withdrawals: 0,
            last_yield_harvest: clock::timestamp_ms(clock),
            yield_fee_percentage: 500, // 5%
            min_yield_threshold: 100000, // 0.0001 tokens
            auto_harvest_enabled: true,
            clock,
        }
    }

    /// Initialize mock yield generator for testing
    public fun new_mock_generator<T>(
        token_type: address,
        mock_apy: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ): MockYieldGenerator<T> {
        MockYieldGenerator<T> {
            id: object::new(ctx),
            token_type,
            mock_apy,
            last_update: clock::timestamp_ms(clock),
            total_generated: balance::zero<T>(),
        }
    }

    // ========== Yield Generation ==========

    /// Deposit funds into yield generation
    public entry fun deposit_for_yield<T>(
        adapter: &mut YieldAdapter<T>,
        funds: Coin<T>,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&funds);
        assert!(amount > 0, errors::E_INVALID_AMOUNT);

        // Validate against active strategy
        let active_strategy = vector::borrow(&adapter.strategies, adapter.active_strategy_index);
        assert!(active_strategy.is_active, errors::E_INVALID_TOKEN);
        assert!(amount >= active_strategy.min_deposit, errors::E_INVALID_AMOUNT);
        assert!(amount <= active_strategy.max_deposit, errors::E_DEPOSIT_LIMIT_EXCEEDED);

        // Add to total deposited
        balance::join(&mut adapter.total_deposited, coin::into_balance(funds));
        adapter.total_deposits = adapter.total_deposits + amount;

        // Generate yield based on time elapsed
        generate_yield(adapter);
    }

    /// Withdraw funds from yield generation
    public entry fun withdraw_from_yield<T>(
        adapter: &mut YieldAdapter<T>,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, errors::E_INVALID_AMOUNT);
        assert!(balance::value(&adapter.total_deposited) >= amount, errors::E_INSUFFICIENT_BALANCE);

        // Generate yield before withdrawal
        generate_yield(adapter);

        // Split from total deposited
        let withdrawal = coin::from_balance(balance::split(&mut adapter.total_deposited, amount), ctx);
        transfer::transfer(withdrawal, tx_context::sender(ctx));

        adapter.total_withdrawals = adapter.total_withdrawals + amount;
    }

    /// Harvest generated yield
    public entry fun harvest_yield<T>(
        adapter: &mut YieldAdapter<T>,
        ctx: &mut TxContext
    ): Coin<T> {
        // Generate yield first
        generate_yield(adapter);

        let yield_amount = balance::value(&adapter.pending_yield);
        assert!(yield_amount >= adapter.min_yield_threshold, errors::E_INVALID_AMOUNT);

        // Calculate fee
        let fee_amount = (yield_amount * adapter.yield_fee_percentage) / 10000;
        let net_yield = yield_amount - fee_amount;

        // Transfer fee to treasury (placeholder)
        if (fee_amount > 0) {
            let fee_coin = coin::from_balance(balance::split(&mut adapter.pending_yield, fee_amount), ctx);
            // In production, transfer to treasury address
            transfer::delete(fee_coin);
        };

        // Return net yield
        let yield_coin = coin::from_balance(balance::split(&mut adapter.pending_yield, net_yield), ctx);
        
        // Update statistics
        balance::join(&mut adapter.total_yield_generated, coin::into_balance(coin::zero<T>()));
        adapter.last_yield_harvest = clock::timestamp_ms(adapter.clock);

        // Emit event
        event::emit(YieldHarvested {
            adapter_id: object::uid_to_address(&adapter.id),
            token_type: adapter.token_type,
            yield_amount,
            fee_amount,
            net_yield,
            timestamp: clock::timestamp_ms(adapter.clock),
        });

        yield_coin
    }

    /// Auto-harvest yield if enabled and threshold met
    public entry fun auto_harvest<T>(
        adapter: &mut YieldAdapter<T>,
        ctx: &mut TxContext
    ): Option<Coin<T>> {
        if (!adapter.auto_harvest_enabled) {
            return option::none<Coin<T>>();
        };

        generate_yield(adapter);
        let yield_amount = balance::value(&adapter.pending_yield);
        
        if (yield_amount >= adapter.min_yield_threshold) {
            let yield_coin = harvest_yield(adapter, ctx);
            option::some(yield_coin)
        } else {
            option::none<Coin<T>>()
        }
    }

    // ========== Strategy Management ==========

    /// Switch to a different yield strategy
    public entry fun switch_strategy<T>(
        adapter: &mut YieldAdapter<T>,
        strategy_index: u64,
        ctx: &mut TxContext
    ) {
        assert!(strategy_index < vector::length(&adapter.strategies), errors::E_INVALID_TOKEN);
        
        let strategy = vector::borrow(&adapter.strategies, strategy_index);
        assert!(strategy.is_active, errors::E_INVALID_TOKEN);

        let old_apy = if (adapter.active_strategy_index < vector::length(&adapter.strategies)) {
            let old_strategy = vector::borrow(&adapter.strategies, adapter.active_strategy_index);
            old_strategy.apy_target
        } else {
            0
        };

        adapter.active_strategy_index = strategy_index;

        // Emit event
        event::emit(StrategyUpdated {
            adapter_id: object::uid_to_address(&adapter.id),
            strategy_name: strategy.name,
            old_apy,
            new_apy: strategy.apy_target,
            timestamp: clock::timestamp_ms(adapter.clock),
        });
    }

    /// Add a new yield strategy
    public entry fun add_strategy<T>(
        adapter: &mut YieldAdapter<T>,
        strategy: YieldStrategy,
        ctx: &mut TxContext
    ) {
        vector::push_back(&mut adapter.strategies, strategy);
    }

    /// Update existing strategy
    public entry fun update_strategy<T>(
        adapter: &mut YieldAdapter<T>,
        strategy_index: u64,
        new_apy: u64,
        new_risk_level: u8,
        is_active: bool,
        ctx: &mut TxContext
    ) {
        assert!(strategy_index < vector::length(&adapter.strategies), errors::E_INVALID_TOKEN);
        
        let strategy = vector::borrow_mut(&mut adapter.strategies, strategy_index);
        let old_apy = strategy.apy_target;
        
        strategy.apy_target = new_apy;
        strategy.risk_level = new_risk_level;
        strategy.is_active = is_active;

        // Emit event
        event::emit(StrategyUpdated {
            adapter_id: object::uid_to_address(&adapter.id),
            strategy_name: strategy.name,
            old_apy,
            new_apy,
            timestamp: clock::timestamp_ms(adapter.clock),
        });
    }

    // ========== Mock Yield Generation ==========

    /// Generate mock yield for testing
    public entry fun generate_mock_yield<T>(
        generator: &mut MockYieldGenerator<T>,
        adapter: &mut YieldAdapter<T>,
        ctx: &mut TxContext
    ) {
        let current_time = clock::timestamp_ms(generator.clock);
        let time_elapsed = current_time - generator.last_update;
        
        if (time_elapsed == 0) return;

        // Calculate yield based on APY and time elapsed
        let total_deposited = balance::value(&adapter.total_deposited);
        if (total_deposited == 0) return;

        // Convert APY to per-millisecond rate (simplified)
        let apy_rate = generator.mock_apy as u128;
        let time_factor = (time_elapsed as u128) * 1000000 / (365 * 24 * 60 * 60 * 1000); // Convert to year fraction
        let yield_amount = (total_deposited as u128 * apy_rate * time_factor) / 100000000; // Basis points adjustment

        if (yield_amount > 0) {
            // Create mock yield coins (in production, this would come from actual yield sources)
            let mock_yield = coin::mint_for_testing<T>((yield_amount as u64), ctx);
            balance::join(&mut adapter.pending_yield, coin::into_balance(mock_yield));
            balance::join(&mut generator.total_generated, coin::into_balance(coin::mint_for_testing<T>((yield_amount as u64), ctx)));
        };

        generator.last_update = current_time;
    }

    // ========== View Functions ==========

    /// Get current yield strategy
    public fun get_active_strategy<T>(adapter: &YieldAdapter<T>): &YieldStrategy {
        vector::borrow(&adapter.strategies, adapter.active_strategy_index)
    }

    /// Get all available strategies
    public fun get_strategies<T>(adapter: &YieldAdapter<T>): &vector<YieldStrategy> {
        &adapter.strategies
    }

    /// Get yield statistics
    public fun get_yield_stats<T>(adapter: &YieldAdapter<T>): (u64, u64, u64, u64) {
        (
            balance::value(&adapter.total_deposited),
            balance::value(&adapter.pending_yield),
            balance::value(&adapter.total_yield_generated),
            adapter.last_yield_harvest
        )
    }

    /// Get pending yield amount
    public fun get_pending_yield<T>(adapter: &YieldAdapter<T>): u64 {
        balance::value(&adapter.pending_yield)
    }

    // ========== Internal Functions ==========

    /// Generate yield based on current strategy and time elapsed
    fun generate_yield<T>(adapter: &mut YieldAdapter<T>) {
        let current_time = clock::timestamp_ms(adapter.clock);
        let time_elapsed = current_time - adapter.last_yield_harvest;
        
        if (time_elapsed == 0) return;

        let total_deposited = balance::value(&adapter.total_deposited);
        if (total_deposited == 0) return;

        let active_strategy = vector::borrow(&adapter.strategies, adapter.active_strategy_index);
        let apy_rate = active_strategy.apy_target as u128;
        
        // Calculate yield (simplified calculation)
        let time_factor = (time_elapsed as u128) * 1000000 / (365 * 24 * 60 * 60 * 1000); // Convert to year fraction
        let yield_amount = (total_deposited as u128 * apy_rate * time_factor) / 100000000; // Basis points adjustment

        if (yield_amount > 0) {
            // In production, this would interact with actual yield sources
            // For now, we'll simulate yield generation
            let mock_yield = coin::mint_for_testing<T>((yield_amount as u64), adapter.clock);
            balance::join(&mut adapter.pending_yield, coin::into_balance(mock_yield));
        };

        adapter.last_yield_harvest = current_time;
    }

    // ========== Admin Functions ==========

    /// Update yield adapter configuration
    public entry fun update_config<T>(
        adapter: &mut YieldAdapter<T>,
        new_yield_fee: u64,
        new_min_threshold: u64,
        auto_harvest: bool,
        ctx: &mut TxContext
    ) {
        // In production, add admin authorization
        adapter.yield_fee_percentage = new_yield_fee;
        adapter.min_yield_threshold = new_min_threshold;
        adapter.auto_harvest_enabled = auto_harvest;
    }
} 