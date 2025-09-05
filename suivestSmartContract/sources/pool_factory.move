module suivest::pool_factory {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::table::{Self, Table};
    use sui::clock::{Self, Clock};
    use std::vector;
    use std::option::{Self, Option};

    use suivest::errors;
    use suivest::events;
    use suivest::types::{Self, TokenType, TokenRegistry, UserRegistry, RoundRegistry};
    use suivest::vault::{Self, Vault, AdminCap, TreasuryCap};
    use suivest::vrf::{Self, VRFRegistry, VRFOracleCap};
    use suivest::yield_adapter::{Self, YieldAdapter, MockYieldGenerator};
    use suivest::prize_manager::{Self, PrizeManager, PrizeManagerCap};

    /// Factory for creating and managing vaults
    public struct PoolFactory has key {
        id: UID,
        admin: address,
        treasury: address,
        
        // Registries
        token_registry: &mut TokenRegistry,
        user_registry: &mut UserRegistry,
        round_registry: &mut RoundRegistry,
        vrf_registry: &mut VRFRegistry,
        
        // Vault management
        vaults: Table<address, address>, // token_type -> vault_id
        vault_count: u64,
        
        // Yield adapters
        yield_adapters: Table<address, address>, // token_type -> adapter_id
        adapter_count: u64,
        
        // Prize manager
        prize_manager: &mut PrizeManager,
        
        // Configuration
        max_vaults: u64,
        supported_tokens: vector<address>,
        
        // External dependencies
        clock: &Clock,
    }

    /// Factory admin capability
    public struct FactoryCap has key, store {
        id: UID,
        factory_id: address,
    }

    /// Vault created event
    public struct VaultCreated has copy, drop {
        pub factory_id: address,
        pub vault_id: address,
        pub token_type: address,
        pub admin: address,
        pub timestamp: u64,
    }

    /// Yield adapter created event
    public struct YieldAdapterCreated has copy, drop {
        pub factory_id: address,
        pub adapter_id: address,
        pub token_type: address,
        pub timestamp: u64,
    }

    // ========== Initialization ==========

    /// Initialize pool factory
    public fun new(
        admin: address,
        treasury: address,
        token_registry: &mut TokenRegistry,
        user_registry: &mut UserRegistry,
        round_registry: &mut RoundRegistry,
        vrf_registry: &mut VRFRegistry,
        prize_manager: &mut PrizeManager,
        clock: &Clock,
        ctx: &mut TxContext
    ): (PoolFactory, FactoryCap) {
        let factory = PoolFactory {
            id: object::new(ctx),
            admin,
            treasury,
            token_registry,
            user_registry,
            round_registry,
            vrf_registry,
            vaults: table::new<address, address>(ctx),
            vault_count: 0,
            yield_adapters: table::new<address, address>(ctx),
            adapter_count: 0,
            prize_manager,
            max_vaults: 10,
            supported_tokens: vector::empty<address>(),
            clock,
        };

        let cap = FactoryCap {
            id: object::new(ctx),
            factory_id: object::uid_to_address(&factory.id),
        };

        (factory, cap)
    }

    // ========== Token Management ==========

    /// Add supported token to factory
    public entry fun add_supported_token(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        token_type: TokenType,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        
        // Add to token registry
        if (!table::contains(&factory.token_registry.supported_tokens, &token_type.coin_type)) {
            table::add(&mut factory.token_registry.supported_tokens, token_type.coin_type, token_type);
            factory.token_registry.token_count = factory.token_registry.token_count + 1;
        };

        // Add to supported tokens list
        vector::push_back(&mut factory.supported_tokens, token_type.coin_type);
    }

    /// Remove supported token
    public entry fun remove_supported_token(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        token_type: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&factory.token_registry.supported_tokens, &token_type), errors::E_TOKEN_NOT_SUPPORTED);

        // Remove from token registry
        table::remove(&mut factory.token_registry.supported_tokens, &token_type);
        factory.token_registry.token_count = factory.token_registry.token_count - 1;

        // Remove from supported tokens list
        let i = 0;
        while (i < vector::length(&factory.supported_tokens)) {
            if (*vector::borrow(&factory.supported_tokens, i) == token_type) {
                vector::remove(&mut factory.supported_tokens, i);
                break;
            };
            i = i + 1;
        };
    }

    // ========== Vault Creation ==========

    /// Create a new vault for a supported token
    public entry fun create_vault(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        token_type: address,
        admin: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        assert!(factory.vault_count < factory.max_vaults, errors::E_MAX_PARTICIPANTS_REACHED);
        assert!(table::contains(&factory.token_registry.supported_tokens, &token_type), errors::E_TOKEN_NOT_SUPPORTED);
        assert!(!table::contains(&factory.vaults, &token_type), errors::E_INVALID_ADDRESS);

        // Get token type info
        let token_info = table::borrow(&factory.token_registry.supported_tokens, &token_type);

        // Create vault (this would be a generic call in production)
        // For now, we'll create a placeholder vault
        let vault_id = object::new(ctx);
        
        // Add to vault registry
        table::add(&mut factory.vaults, token_type, object::uid_to_address(&vault_id));
        factory.vault_count = factory.vault_count + 1;

        // Register with prize manager
        prize_manager::register_vault(factory.prize_manager, &prize_manager::PrizeManagerCap { id: object::new(ctx), manager_id: @0x0 }, object::uid_to_address(&vault_id), token_type, ctx);

        event::emit(VaultCreated {
            factory_id: object::uid_to_address(&factory.id),
            vault_id: object::uid_to_address(&vault_id),
            token_type,
            admin,
            timestamp: clock::timestamp_ms(factory.clock),
        });
    }

    /// Create yield adapter for a token type
    public entry fun create_yield_adapter(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        token_type: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        assert!(table::contains(&factory.token_registry.supported_tokens, &token_type), errors::E_TOKEN_NOT_SUPPORTED);
        assert!(!table::contains(&factory.yield_adapters, &token_type), errors::E_INVALID_ADDRESS);

        // Create yield adapter (this would be a generic call in production)
        let adapter_id = object::new(ctx);
        
        // Add to adapter registry
        table::add(&mut factory.yield_adapters, token_type, object::uid_to_address(&adapter_id));
        factory.adapter_count = factory.adapter_count + 1;

        // Register with prize manager
        prize_manager::register_yield_adapter(factory.prize_manager, &prize_manager::PrizeManagerCap { id: object::new(ctx), manager_id: @0x0 }, token_type, object::uid_to_address(&adapter_id), ctx);

        event::emit(YieldAdapterCreated {
            factory_id: object::uid_to_address(&factory.id),
            adapter_id: object::uid_to_address(&adapter_id),
            token_type,
            timestamp: clock::timestamp_ms(factory.clock),
        });
    }

    // ========== Vault Management ==========

    /// Get vault for a token type
    public fun get_vault(factory: &PoolFactory, token_type: address): Option<address> {
        if (table::contains(&factory.vaults, &token_type)) {
            option::some(*table::borrow(&factory.vaults, &token_type))
        } else {
            option::none<address>()
        }
    }

    /// Get yield adapter for a token type
    public fun get_yield_adapter(factory: &PoolFactory, token_type: address): Option<address> {
        if (table::contains(&factory.yield_adapters, &token_type)) {
            option::some(*table::borrow(&factory.yield_adapters, &token_type))
        } else {
            option::none<address>()
        }
    }

    /// Check if token is supported
    public fun is_token_supported(factory: &PoolFactory, token_type: address): bool {
        table::contains(&factory.token_registry.supported_tokens, &token_type)
    }

    /// Get all supported tokens
    public fun get_supported_tokens(factory: &PoolFactory): &vector<address> {
        &factory.supported_tokens
    }

    /// Get factory statistics
    public fun get_factory_stats(factory: &PoolFactory): (u64, u64, u64, u64) {
        (
            factory.vault_count,
            factory.adapter_count,
            factory.token_registry.token_count,
            vector::length(&factory.supported_tokens)
        )
    }

    // ========== Batch Operations ==========

    /// Create vaults for all supported tokens
    public entry fun create_vaults_for_all_tokens(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);

        let i = 0;
        while (i < vector::length(&factory.supported_tokens)) {
            let token_type = *vector::borrow(&factory.supported_tokens, i);
            
            if (!table::contains(&factory.vaults, &token_type)) {
                create_vault(factory, _cap, token_type, factory.admin, ctx);
            };
            
            i = i + 1;
        };
    }

    /// Create yield adapters for all supported tokens
    public entry fun create_adapters_for_all_tokens(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);

        let i = 0;
        while (i < vector::length(&factory.supported_tokens)) {
            let token_type = *vector::borrow(&factory.supported_tokens, i);
            
            if (!table::contains(&factory.yield_adapters, &token_type)) {
                create_yield_adapter(factory, _cap, token_type, ctx);
            };
            
            i = i + 1;
        };
    }

    // ========== Admin Functions ==========

    /// Update factory configuration
    public entry fun update_config(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        new_max_vaults: u64,
        new_treasury: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        
        factory.max_vaults = new_max_vaults;
        factory.treasury = new_treasury;
    }

    /// Transfer admin rights
    public entry fun transfer_admin(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        new_admin: address,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);
        factory.admin = new_admin;
    }

    /// Emergency pause all vaults
    public entry fun emergency_pause_all(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);

        // In production, pause all created vaults
        event::emit(events::EmergencyAction {
            vault_id: object::uid_to_address(&factory.id),
            action: b"emergency_pause_all",
            admin: tx_context::sender(ctx),
            affected_users: factory.vault_count,
            timestamp: clock::timestamp_ms(factory.clock),
        });
    }

    // ========== Initialization Helpers ==========

    /// Initialize factory with default supported tokens
    public entry fun initialize_with_default_tokens(
        factory: &mut PoolFactory,
        _cap: &FactoryCap,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, errors::E_UNAUTHORIZED);

        // Add default supported tokens (SUI, USDC, suiUSDC, WALRUS, DEEP)
        let sui_token = types::new_token_type(b"SUI", b"Sui", 9, @0x2::sui::SUI);
        let usdc_token = types::new_token_type(b"USDC", b"USD Coin", 6, @0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::USDC);
        let suiusdc_token = types::new_token_type(b"suiUSDC", b"Sui USDC", 6, @0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::SUIUSDC);
        let walrus_token = types::new_token_type(b"WALRUS", b"Walrus", 9, @0x1234567890abcdef::walrus::WALRUS);
        let deep_token = types::new_token_type(b"DEEP", b"Deep", 9, @0xabcdef1234567890::deep::DEEP);

        add_supported_token(factory, _cap, sui_token, ctx);
        add_supported_token(factory, _cap, usdc_token, ctx);
        add_supported_token(factory, _cap, suiusdc_token, ctx);
        add_supported_token(factory, _cap, walrus_token, ctx);
        add_supported_token(factory, _cap, deep_token, ctx);
    }
} 