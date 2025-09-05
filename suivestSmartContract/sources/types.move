module suivest::types {
    use sui::object::{Self, UID};
    use sui::table::{Self, Table};
    use std::vector;

    /// Supported token types in the vault
    public struct TokenType has store, drop, copy {
        pub symbol: vector<u8>,
        pub name: vector<u8>,
        pub decimals: u8,
        pub coin_type: address,
    }

    /// User participation data for a specific round
    public struct UserParticipation has store, drop {
        pub tickets: u128,
        pub usd_value: u64,
        pub deposit_time: u64,
        pub has_claimed: bool,
        pub streak_count: u64,
    }

    /// Winner information for a round
    public struct Winner has store, drop {
        pub address: address,
        pub position: u8, // 1, 2, or 3
        pub prize_amount: u64,
        pub has_claimed: bool,
    }

    /// Round information and state
    public struct Round has store, drop {
        pub round_id: u64,
        pub start_time: u64,
        pub end_time: u64,
        pub total_participants: u64,
        pub total_tickets: u128,
        pub prize_pool: u64,
        pub is_active: bool,
        pub is_finalized: bool,
        pub randomness_seed: u128,
        pub winners: vector<Winner>,
    }

    /// Global vault configuration
    public struct VaultConfig has store, drop {
        pub admin: address,
        pub treasury: address,
        pub round_duration: u64, // in seconds
        pub min_deposit: u64,
        pub max_deposit: u64,
        pub withdrawal_cooldown: u64, // in seconds
        pub max_participants: u64,
        pub prize_distribution: vector<u8>, // [50, 30, 20] for 1st, 2nd, 3rd
        pub yield_fee_percentage: u64, // basis points (e.g., 500 = 5%)
        pub is_paused: bool,
    }

    /// User statistics and streak tracking
    public struct UserStats has store, drop {
        pub total_deposits: u64,
        pub total_withdrawals: u64,
        pub current_streak: u64,
        pub longest_streak: u64,
        pub rounds_participated: u64,
        pub prizes_won: u64,
        pub last_activity: u64,
    }

    /// Reentrancy guard for security
    public struct ReentrancyGuard has key {
        id: UID,
        locked: bool,
    }

    /// Token registry for supported tokens
    public struct TokenRegistry has key {
        id: UID,
        supported_tokens: Table<address, TokenType>,
        token_count: u64,
    }

    /// User registry for tracking all participants
    public struct UserRegistry has key {
        id: UID,
        users: Table<address, UserStats>,
        user_count: u64,
    }

    /// Round registry for historical data
    public struct RoundRegistry has key {
        id: UID,
        rounds: Table<u64, Round>,
        current_round_id: u64,
    }

    // Constants
    public const WEEK_IN_SECONDS: u64 = 604800;
    public const DAY_IN_SECONDS: u64 = 86400;
    public const HOUR_IN_SECONDS: u64 = 3600;
    
    public const MAX_WINNERS: u8 = 3;
    public const MAX_ROUNDS_HISTORY: u64 = 100;
    
    public const DEFAULT_ROUND_DURATION: u64 = WEEK_IN_SECONDS;
    public const DEFAULT_WITHDRAWAL_COOLDOWN: u64 = DAY_IN_SECONDS;
    public const DEFAULT_MAX_PARTICIPANTS: u64 = 10000;
    
    public const MIN_DEPOSIT_SUI: u64 = 1000000; // 0.001 SUI (6 decimals)
    public const MIN_DEPOSIT_USDC: u64 = 1000;   // 0.001 USDC (6 decimals)
    public const MAX_DEPOSIT: u64 = 1000000000000; // 1M tokens
    
    public const YIELD_FEE_BASIS_POINTS: u64 = 500; // 5%
    
    // Prize distribution percentages (basis points)
    public const FIRST_PLACE_PERCENTAGE: u64 = 5000;  // 50%
    public const SECOND_PLACE_PERCENTAGE: u64 = 3000; // 30%
    public const THIRD_PLACE_PERCENTAGE: u64 = 2000;  // 20%

    /// Create a new reentrancy guard
    public fun new_reentrancy_guard(ctx: &mut TxContext): ReentrancyGuard {
        ReentrancyGuard {
            id: object::new(ctx),
            locked: false,
        }
    }

    /// Create a new token registry
    public fun new_token_registry(ctx: &mut TxContext): TokenRegistry {
        TokenRegistry {
            id: object::new(ctx),
            supported_tokens: table::new<address, TokenType>(ctx),
            token_count: 0,
        }
    }

    /// Create a new user registry
    public fun new_user_registry(ctx: &mut TxContext): UserRegistry {
        UserRegistry {
            id: object::new(ctx),
            users: table::new<address, UserStats>(ctx),
            user_count: 0,
        }
    }

    /// Create a new round registry
    public fun new_round_registry(ctx: &mut TxContext): RoundRegistry {
        RoundRegistry {
            id: object::new(ctx),
            rounds: table::new<u64, Round>(ctx),
            current_round_id: 0,
        }
    }

    /// Create a new token type
    public fun new_token_type(
        symbol: vector<u8>,
        name: vector<u8>,
        decimals: u8,
        coin_type: address
    ): TokenType {
        TokenType {
            symbol,
            name,
            decimals,
            coin_type,
        }
    }

    /// Create a new user participation record
    public fun new_user_participation(
        tickets: u128,
        usd_value: u64,
        deposit_time: u64,
        streak_count: u64
    ): UserParticipation {
        UserParticipation {
            tickets,
            usd_value,
            deposit_time,
            has_claimed: false,
            streak_count,
        }
    }

    /// Create a new winner record
    public fun new_winner(
        address: address,
        position: u8,
        prize_amount: u64
    ): Winner {
        Winner {
            address,
            position,
            prize_amount,
            has_claimed: false,
        }
    }

    /// Create a new round
    public fun new_round(
        round_id: u64,
        start_time: u64,
        end_time: u64
    ): Round {
        Round {
            round_id,
            start_time,
            end_time,
            total_participants: 0,
            total_tickets: 0,
            prize_pool: 0,
            is_active: false,
            is_finalized: false,
            randomness_seed: 0,
            winners: vector::empty<Winner>(),
        }
    }

    /// Create default user stats
    public fun new_user_stats(): UserStats {
        UserStats {
            total_deposits: 0,
            total_withdrawals: 0,
            current_streak: 0,
            longest_streak: 0,
            rounds_participated: 0,
            prizes_won: 0,
            last_activity: 0,
        }
    }
} 