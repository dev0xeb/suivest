module suivest::prize_manager {
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

    use suivest::errors;
    use suivest::events;
    use suivest::types::{Self, VaultConfig, Round, Winner, TokenType};
    use suivest::vrf::{Self, VRFRegistry, VRFRequest, VRFResponse, VRFOracleCap};
    use suivest::yield_adapter::{Self, YieldAdapter, MockYieldGenerator};

    /// Prize manager that coordinates multiple vaults
    public struct PrizeManager has key {
        id: UID,
        admin: address,
        treasury: address,
        
        // Vault management
        vaults: Table<address, address>, // vault_id -> token_type
        active_vaults: vector<address>,
        
        // VRF management
        vrf_registry: &mut VRFRegistry,
        
        // Yield management
        yield_adapters: Table<address, address>, // token_type -> adapter_id
        
        // Prize pool management
        global_prize_pool: Balance<Coin<0x2::sui::SUI>>, // Using SUI as base currency
        total_prizes_distributed: u64,
        
        // Configuration
        min_prize_pool: u64,
        max_prizes_per_round: u8,
        auto_harvest_enabled: bool,
        
        // External dependencies
        clock: &Clock,
    }

    /// Prize manager admin capability
    public struct PrizeManagerCap has key, store {
        id: UID,
        manager_id: address,
    }

    /// Prize distribution event
    public struct PrizeDistributed has copy, drop {
        pub manager_id: address,
        pub vault_id: address,
        pub round_id: u64,
        pub total_prize: u64,
        pub winner_count: u8,
        pub timestamp: u64,
    }

    /// Vault registered event
    public struct VaultRegistered has copy, drop {
        pub manager_id: address,
        pub vault_id: address,
        pub token_type: address,
        pub timestamp: u64,
    }

    // ========== Initialization ==========

    /// Initialize prize manager
    public fun new(
        admin: address,
        treasury: address,
        vrf_registry: &mut VRFRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ): (PrizeManager, PrizeManagerCap) {
        let manager = PrizeManager {
            id: object::new(ctx),
            admin,
            treasury,
            vaults: table::new<address, address>(ctx),
            active_vaults: vector::empty<address>(),
            vrf_registry,
            yield_adapters: table::new<address, address>(ctx),
            global_prize_pool: balance::zero<Coin<0x2::sui::SUI>>(),
            total_prizes_distributed: 0,
            min_prize_pool: 1000000, // 0.001 SUI
            max_prizes_per_round: 3,
            auto_harvest_enabled: true,
            clock,
        };

        let cap = PrizeManagerCap {
            id: object::new(ctx),
            manager_id: object::uid_to_address(&manager.id),
        };

        (manager, cap)
    }

    // ========== Vault Management ==========

    /// Register a new vault with the prize manager
    public entry fun register_vault(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        vault_id: address,
        token_type: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        assert!(!table::contains(&manager.vaults, &vault_id), errors::E_INVALID_ADDRESS);

        table::add(&mut manager.vaults, vault_id, token_type);
        vector::push_back(&mut manager.active_vaults, vault_id);

        event::emit(VaultRegistered {
            manager_id: object::uid_to_address(&manager.id),
            vault_id,
            token_type,
            timestamp: clock::timestamp_ms(manager.clock),
        });
    }

    /// Unregister a vault
    public entry fun unregister_vault(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        vault_id: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&manager.vaults, &vault_id), errors::E_INVALID_ADDRESS);

        table::remove(&mut manager.vaults, &vault_id);
        
        // Remove from active vaults
        let i = 0;
        while (i < vector::length(&manager.active_vaults)) {
            if (*vector::borrow(&manager.active_vaults, i) == vault_id) {
                vector::remove(&mut manager.active_vaults, i);
                break;
            };
            i = i + 1;
        };
    }

    // ========== Round Management ==========

    /// Start a new round for all active vaults
    public entry fun start_round_all_vaults(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);

        let i = 0;
        while (i < vector::length(&manager.active_vaults)) {
            let vault_id = *vector::borrow(&manager.active_vaults, i);
            // In production, this would call the vault's start_round function
            // For now, we'll just emit an event
            i = i + 1;
        };
    }

    /// End round for a specific vault and select winners
    public entry fun end_vault_round(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        vault_id: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&manager.vaults, &vault_id), errors::E_INVALID_ADDRESS);

        // Request randomness for winner selection
        let round_id = 1; // In production, get from vault
        let seed = b"round_seed";
        vrf::request_randomness(manager.vrf_registry, round_id, seed, manager.clock, ctx);
    }

    /// Finalize round with VRF randomness
    public entry fun finalize_round_with_vrf(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        vault_id: address,
        vrf_request_id: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&manager.vaults, &vault_id), errors::E_INVALID_ADDRESS);

        // Check if VRF request is fulfilled
        assert!(vrf::is_request_fulfilled(manager.vrf_registry, vrf_request_id), errors::E_INVALID_TIMESTAMP);

        // Get randomness
        let randomness_opt = vrf::get_randomness(manager.vrf_registry, vrf_request_id);
        assert!(option::is_some(&randomness_opt), errors::E_INVALID_TIMESTAMP);

        let randomness = option::extract(&mut randomness_opt);
        let randomness_u128 = vrf::randomness_to_u128(&randomness);

        // In production, call vault's end_round function with randomness
        // For now, we'll just emit an event
        event::emit(PrizeDistributed {
            manager_id: object::uid_to_address(&manager.id),
            vault_id,
            round_id: 1, // In production, get from vault
            total_prize: 0, // In production, get from vault
            winner_count: manager.max_prizes_per_round,
            timestamp: clock::timestamp_ms(manager.clock),
        });
    }

    // ========== Yield Management ==========

    /// Register yield adapter for a token type
    public entry fun register_yield_adapter(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        token_type: address,
        adapter_id: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        
        if (table::contains(&manager.yield_adapters, &token_type)) {
            table::borrow_mut(&mut manager.yield_adapters, &token_type).* = adapter_id;
        } else {
            table::add(&mut manager.yield_adapters, token_type, adapter_id);
        };
    }

    /// Harvest yield from all adapters
    public entry fun harvest_all_yields(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);

        // In production, this would iterate through all yield adapters
        // and harvest yield into the global prize pool
        // For now, we'll just emit an event
        event::emit(events::YieldHarvested {
            vault_id: object::uid_to_address(&manager.id),
            token_type: @0x2::sui::SUI,
            yield_amount: 0,
            timestamp: clock::timestamp_ms(manager.clock),
        });
    }

    /// Distribute yield to vault prize pools
    public entry fun distribute_yield_to_vaults(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);

        let global_prize_amount = balance::value(&manager.global_prize_pool);
        if (global_prize_amount < manager.min_prize_pool) {
            return;
        };

        let vault_count = vector::length(&manager.active_vaults);
        if (vault_count == 0) {
            return;
        };

        // Distribute equally among active vaults
        let per_vault_amount = global_prize_amount / vault_count;
        
        let i = 0;
        while (i < vault_count) {
            let vault_id = *vector::borrow(&manager.active_vaults, i);
            // In production, transfer yield to vault's prize pool
            i = i + 1;
        };

        // Clear global prize pool
        balance::join(&mut manager.global_prize_pool, balance::zero<Coin<0x2::sui::SUI>>());
    }

    // ========== Prize Distribution ==========

    /// Distribute prizes for a specific vault round
    public entry fun distribute_prizes(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        vault_id: address,
        winners: vector<address>,
        prize_amounts: vector<u64>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&manager.vaults, &vault_id), errors::E_INVALID_ADDRESS);
        assert!(vector::length(&winners) == vector::length(&prize_amounts), errors::E_INVALID_WINNER_COUNT);
        assert!(vector::length(&winners) <= manager.max_prizes_per_round, errors::E_INVALID_WINNER_COUNT);

        let total_prize = 0u64;
        let i = 0;
        while (i < vector::length(&prize_amounts)) {
            let prize_amount = *vector::borrow(&prize_amounts, i);
            let winner = *vector::borrow(&winners, i);
            
            // In production, transfer prize to winner
            // For now, just track total
            total_prize = total_prize + prize_amount;
            
            // Emit prize claimed event
            event::emit(events::PrizeClaimed {
                vault_id: object::uid_to_address(&manager.id),
                round_id: 1, // In production, get from vault
                winner,
                prize_amount,
                position: (i + 1) as u8,
                timestamp: clock::timestamp_ms(manager.clock),
            });
            
            i = i + 1;
        };

        manager.total_prizes_distributed = manager.total_prizes_distributed + total_prize;
    }

    // ========== View Functions ==========

    /// Get all active vaults
    public fun get_active_vaults(manager: &PrizeManager): &vector<address> {
        &manager.active_vaults
    }

    /// Get vault token type
    public fun get_vault_token_type(manager: &PrizeManager, vault_id: address): Option<address> {
        if (table::contains(&manager.vaults, &vault_id)) {
            option::some(*table::borrow(&manager.vaults, &vault_id))
        } else {
            option::none<address>()
        }
    }

    /// Get yield adapter for token type
    public fun get_yield_adapter(manager: &PrizeManager, token_type: address): Option<address> {
        if (table::contains(&manager.yield_adapters, &token_type)) {
            option::some(*table::borrow(&manager.yield_adapters, &token_type))
        } else {
            option::none<address>()
        }
    }

    /// Get prize manager statistics
    public fun get_manager_stats(manager: &PrizeManager): (u64, u64, u64, u64) {
        (
            vector::length(&manager.active_vaults),
            balance::value(&manager.global_prize_pool),
            manager.total_prizes_distributed,
            table::length(&manager.yield_adapters)
        )
    }

    // ========== Admin Functions ==========

    /// Update prize manager configuration
    public entry fun update_config(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        new_min_prize_pool: u64,
        new_max_prizes: u8,
        auto_harvest: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        
        manager.min_prize_pool = new_min_prize_pool;
        manager.max_prizes_per_round = new_max_prizes;
        manager.auto_harvest_enabled = auto_harvest;
    }

    /// Emergency pause all vaults
    public entry fun emergency_pause(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);

        // In production, pause all registered vaults
        event::emit(events::EmergencyAction {
            vault_id: object::uid_to_address(&manager.id),
            action: b"emergency_pause",
            admin: tx_context::sender(ctx),
            affected_users: vector::length(&manager.active_vaults),
            timestamp: clock::timestamp_ms(manager.clock),
        });
    }

    /// Transfer admin rights
    public entry fun transfer_admin(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        manager.admin = new_admin;
    }

    /// Transfer treasury rights
    public entry fun transfer_treasury(
        manager: &mut PrizeManager,
        _cap: &PrizeManagerCap,
        new_treasury: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == manager.admin, errors::E_UNAUTHORIZED);
        manager.treasury = new_treasury;
    }
} 