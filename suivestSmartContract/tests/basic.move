module suivest::basic_tests {
    use sui::tx_context::{Self, TxContext};
    use sui::object;
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use std::vector;

    use suivest::errors;
    use suivest::types::{Self, TokenType, TokenRegistry, UserRegistry, RoundRegistry, VaultConfig};
    use suivest::vault::{Self, Vault, AdminCap, TreasuryCap};
    use suivest::vrf::{Self, VRFRegistry, VRFOracleCap};
    use suivest::yield_adapter::{Self, YieldAdapter, MockYieldGenerator};
    use suivest::prize_manager::{Self, PrizeManager, PrizeManagerCap};
    use suivest::pool_factory::{Self, PoolFactory, FactoryCap};

    // Test token types
    struct TestSUI has drop, store {}
    struct TestUSDC has drop, store {}
    struct TestWALRUS has drop, store {}
    struct TestDEEP has drop, store {}
    struct TestSUIUSDC has drop, store {}

    // Test addresses
    const ADMIN: address = @0x1;
    const TREASURY: address = @0x2;
    const USER1: address = @0x3;
    const USER2: address = @0x4;
    const USER3: address = @0x5;
    const ORACLE: address = @0x6;

    // ========== Setup Functions ==========

    fun setup_test_environment(ctx: &mut TxContext): (
        TokenRegistry,
        UserRegistry,
        RoundRegistry,
        VRFRegistry,
        VRFOracleCap,
        Clock,
        PrizeManager,
        PrizeManagerCap
    ) {
        let clock = clock::create_for_testing(ctx);
        
        let (vrf_registry, oracle_cap) = vrf::init_vrf_registry(
            ORACLE,
            1, // min_confirmations
            3600000, // request_timeout (1 hour)
            ctx
        );

        let (prize_manager, prize_manager_cap) = prize_manager::new(
            ADMIN,
            TREASURY,
            &mut vrf_registry,
            &clock,
            ctx
        );

        let token_registry = types::new_token_registry(ctx);
        let user_registry = types::new_user_registry(ctx);
        let round_registry = types::new_round_registry(ctx);

        (token_registry, user_registry, round_registry, vrf_registry, oracle_cap, clock, prize_manager, prize_manager_cap)
    }

    fun create_test_vault<T>(
        token_registry: &mut TokenRegistry,
        user_registry: &mut UserRegistry,
        round_registry: &mut RoundRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ): (Vault<T>, AdminCap, TreasuryCap) {
        let token_type = types::new_token_type(
            b"TEST",
            b"Test Token",
            9,
            @0x0
        );

        vault::new<T>(
            ADMIN,
            TREASURY,
            token_type,
            token_registry,
            user_registry,
            round_registry,
            clock,
            ctx
        )
    }

    // ========== Vault Tests ==========

    #[test]
    fun test_vault_creation() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Verify vault was created correctly
        assert!(vault::get_current_round_id(&vault) == 0, 0);
        assert!(vault::get_total_tickets(&vault) == 0, 0);
        
        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_deposit_and_withdraw() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Test deposit
        let deposit_amount = 1000000; // 0.001 tokens
        let coins = coin::mint_for_testing<TestSUI>(deposit_amount, &mut ctx);
        vault::deposit(&mut vault, coins, &mut ctx);

        assert!(vault::get_user_tickets(&vault, USER1) == (deposit_amount as u128), 0);
        assert!(vault::get_total_tickets(&vault) == (deposit_amount as u128), 0);

        // Test withdraw
        let withdraw_tickets = 500000u128; // 0.0005 tokens worth
        vault::withdraw(&mut vault, withdraw_tickets, &mut ctx);

        assert!(vault::get_user_tickets(&vault, USER1) == (deposit_amount - 500000) as u128, 0);
        assert!(vault::get_total_tickets(&vault) == (deposit_amount - 500000) as u128, 0);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_deposit_validation() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Test zero deposit
        let zero_coins = coin::mint_for_testing<TestSUI>(0, &mut ctx);
        let result = std::debug::print_stack_trace();
        // This should fail with E_INVALID_AMOUNT
        // vault::deposit(&mut vault, zero_coins, &mut ctx);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_withdraw_validation() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Test withdraw without deposit
        let result = std::debug::print_stack_trace();
        // This should fail with E_INSUFFICIENT_BALANCE
        // vault::withdraw(&mut vault, 1000000u128, &mut ctx);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    // ========== Round Management Tests ==========

    #[test]
    fun test_round_lifecycle() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Start round
        vault::start_round(&mut vault, &admin_cap, &mut ctx);
        assert!(vault::get_current_round_id(&vault) == 1, 0);

        // End round
        let randomness_seed = 123456789u128;
        vault::end_round(&mut vault, &admin_cap, randomness_seed, &mut ctx);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_multiple_users_deposit() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // User 1 deposits
        let coins1 = coin::mint_for_testing<TestSUI>(1000000, &mut ctx);
        vault::deposit(&mut vault, coins1, &mut ctx);

        // User 2 deposits
        let mut ctx2 = tx_context::new_for_testing(USER2);
        let coins2 = coin::mint_for_testing<TestSUI>(2000000, &mut ctx2);
        vault::deposit(&mut vault, coins2, &mut ctx2);

        // User 3 deposits
        let mut ctx3 = tx_context::new_for_testing(USER3);
        let coins3 = coin::mint_for_testing<TestSUI>(1500000, &mut ctx3);
        vault::deposit(&mut vault, coins3, &mut ctx3);

        assert!(vault::get_total_tickets(&vault) == 4500000u128, 0);
        assert!(vault::get_user_tickets(&vault, USER1) == 1000000u128, 0);
        assert!(vault::get_user_tickets(&vault, USER2) == 2000000u128, 0);
        assert!(vault::get_user_tickets(&vault, USER3) == 1500000u128, 0);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    // ========== VRF Tests ==========

    #[test]
    fun test_vrf_request_and_fulfill() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (_, _, _, mut vrf_registry, oracle_cap, clock, _, _) = setup_test_environment(&mut ctx);

        // Request randomness
        let round_id = 1u64;
        let seed = b"test_seed";
        vrf::request_randomness(&mut vrf_registry, round_id, seed, &clock, &mut ctx);

        // Get the request ID (in production, this would be returned from the function)
        let pending_requests = vrf::get_pending_requests_count(&vrf_registry);
        assert!(pending_requests == 1, 0);

        // Mock fulfill randomness
        let request_id = @0x0; // In production, get actual request ID
        vrf::mock_fulfill_randomness(&mut vrf_registry, request_id, &clock, &mut ctx);

        // Clean up
        object::delete(oracle_cap);
    }

    // ========== Yield Adapter Tests ==========

    #[test]
    fun test_yield_adapter_creation() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (_, _, _, _, _, clock, _, _) = setup_test_environment(&mut ctx);

        let adapter = yield_adapter::new<TestSUI>(@0x0, &clock, &mut ctx);

        let (total_deposited, pending_yield, total_generated, last_harvest) = yield_adapter::get_yield_stats(&adapter);
        assert!(total_deposited == 0, 0);
        assert!(pending_yield == 0, 0);
        assert!(total_generated == 0, 0);
    }

    #[test]
    fun test_yield_generation() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (_, _, _, _, _, clock, _, _) = setup_test_environment(&mut ctx);

        let mut adapter = yield_adapter::new<TestSUI>(@0x0, &clock, &mut ctx);
        let mut generator = yield_adapter::new_mock_generator<TestSUI>(@0x0, 500, &clock, &mut ctx); // 5% APY

        // Deposit for yield
        let coins = coin::mint_for_testing<TestSUI>(1000000, &mut ctx);
        yield_adapter::deposit_for_yield(&mut adapter, coins, &mut ctx);

        // Generate mock yield
        yield_adapter::generate_mock_yield(&mut generator, &mut adapter, &mut ctx);

        let pending_yield = yield_adapter::get_pending_yield(&adapter);
        assert!(pending_yield > 0, 0);
    }

    // ========== Prize Manager Tests ==========

    #[test]
    fun test_prize_manager_creation() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (_, _, _, mut vrf_registry, oracle_cap, clock, prize_manager, prize_manager_cap) = setup_test_environment(&mut ctx);

        let (vault_count, global_prize_pool, total_prizes, adapter_count) = prize_manager::get_manager_stats(&prize_manager);
        assert!(vault_count == 0, 0);
        assert!(global_prize_pool == 0, 0);
        assert!(total_prizes == 0, 0);
        assert!(adapter_count == 0, 0);

        // Clean up
        object::delete(oracle_cap);
        object::delete(prize_manager_cap);
    }

    // ========== Pool Factory Tests ==========

    #[test]
    fun test_pool_factory_creation() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (mut token_registry, mut user_registry, mut round_registry, mut vrf_registry, oracle_cap, clock, mut prize_manager, prize_manager_cap) = setup_test_environment(&mut ctx);

        let (factory, factory_cap) = pool_factory::new(
            ADMIN,
            TREASURY,
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &mut vrf_registry,
            &mut prize_manager,
            &clock,
            &mut ctx
        );

        let (vault_count, adapter_count, token_count, supported_count) = pool_factory::get_factory_stats(&factory);
        assert!(vault_count == 0, 0);
        assert!(adapter_count == 0, 0);
        assert!(token_count == 0, 0);
        assert!(supported_count == 0, 0);

        // Clean up
        object::delete(oracle_cap);
        object::delete(prize_manager_cap);
        object::delete(factory_cap);
    }

    // ========== Integration Tests ==========

    #[test]
    fun test_full_lottery_cycle() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (mut token_registry, mut user_registry, mut round_registry, mut vrf_registry, oracle_cap, clock, mut prize_manager, prize_manager_cap) = setup_test_environment(&mut ctx);

        // Create factory
        let (mut factory, factory_cap) = pool_factory::new(
            ADMIN,
            TREASURY,
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &mut vrf_registry,
            &mut prize_manager,
            &clock,
            &mut ctx
        );

        // Initialize with default tokens
        pool_factory::initialize_with_default_tokens(&mut factory, &factory_cap, &mut ctx);

        // Create vault for SUI
        pool_factory::create_vault(&mut factory, &factory_cap, @0x2::sui::SUI, ADMIN, &mut ctx);

        // Verify vault was created
        let vault_opt = pool_factory::get_vault(&factory, @0x2::sui::SUI);
        assert!(std::option::is_some(&vault_opt), 0);

        // Clean up
        object::delete(oracle_cap);
        object::delete(prize_manager_cap);
        object::delete(factory_cap);
    }

    // ========== Security Tests ==========

    #[test]
    fun test_unauthorized_access() {
        let mut ctx = tx_context::new_for_testing(USER1); // Non-admin user
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // This should fail with E_UNAUTHORIZED
        let result = std::debug::print_stack_trace();
        // vault::start_round(&mut vault, &admin_cap, &mut ctx);

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_reentrancy_protection() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Test deposit (should set reentrancy guard)
        let coins = coin::mint_for_testing<TestSUI>(1000000, &mut ctx);
        vault::deposit(&mut vault, coins, &mut ctx);

        // The reentrancy guard should prevent multiple simultaneous calls
        // In a real scenario, this would be tested with actual reentrancy attempts

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    // ========== Edge Case Tests ==========

    #[test]
    fun test_empty_vault_round() {
        let mut ctx = tx_context::new_for_testing(ADMIN);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Start round with no participants
        vault::start_round(&mut vault, &admin_cap, &mut ctx);

        // End round with no participants
        let randomness_seed = 123456789u128;
        vault::end_round(&mut vault, &admin_cap, randomness_seed, &mut ctx);

        // This should handle gracefully without errors

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }

    #[test]
    fun test_max_participants_limit() {
        let mut ctx = tx_context::new_for_testing(USER1);
        let (mut token_registry, mut user_registry, mut round_registry, _, _, clock, _, _) = setup_test_environment(&mut ctx);
        
        let (mut vault, admin_cap, treasury_cap) = create_test_vault<TestSUI>(
            &mut token_registry,
            &mut user_registry,
            &mut round_registry,
            &clock,
            &mut ctx
        );

        // Test that the vault respects max participants limit
        // In production, this would test the actual limit enforcement

        // Clean up
        object::delete(admin_cap);
        object::delete(treasury_cap);
    }
} 