module suivest::events {
    use sui::event;
    use sui::object::ID;

    /// Emitted when a user deposits tokens into the vault
    public struct Deposited has copy, drop {
        pub vault_id: ID,
        pub user: address,
        pub token_type: address,
        pub amount: u64,
        pub tickets_minted: u128,
        pub round_id: u64,
        pub timestamp: u64,
    }

    /// Emitted when a user withdraws tokens from the vault
    public struct Withdrawn has copy, drop {
        pub vault_id: ID,
        pub user: address,
        pub token_type: address,
        pub amount: u64,
        pub tickets_burned: u128,
        pub round_id: u64,
        pub timestamp: u64,
    }

    /// Emitted when a new round starts
    public struct RoundStarted has copy, drop {
        pub vault_id: ID,
        pub round_id: u64,
        pub start_time: u64,
        pub end_time: u64,
        pub total_participants: u64,
        pub total_tickets: u128,
        pub prize_pool: u64,
    }

    /// Emitted when a round ends and winners are selected
    public struct RoundEnded has copy, drop {
        pub vault_id: ID,
        pub round_id: u64,
        pub end_time: u64,
        pub total_prize_distributed: u64,
        pub winner_count: u64,
        pub randomness_seed: u128,
    }

    /// Emitted when a winner claims their prize
    public struct PrizeClaimed has copy, drop {
        pub vault_id: ID,
        pub round_id: u64,
        pub winner: address,
        pub prize_amount: u64,
        pub position: u8, // 1st, 2nd, 3rd place
        pub timestamp: u64,
    }

    /// Emitted when yield is harvested into the prize pool
    public struct YieldHarvested has copy, drop {
        pub vault_id: ID,
        pub token_type: address,
        pub yield_amount: u64,
        pub timestamp: u64,
    }

    /// Emitted when a user's streak is updated
    public struct StreakUpdated has copy, drop {
        pub vault_id: ID,
        pub user: address,
        pub old_streak: u64,
        pub new_streak: u64,
        pub round_id: u64,
    }

    /// Emitted when the vault is paused/unpaused
    public struct VaultPaused has copy, drop {
        pub vault_id: ID,
        pub paused: bool,
        pub timestamp: u64,
    }

    /// Emitted when admin functions are called
    public struct AdminAction has copy, drop {
        pub vault_id: ID,
        pub action: vector<u8>,
        pub admin: address,
        pub timestamp: u64,
    }

    /// Emitted when emergency actions are taken
    public struct EmergencyAction has copy, drop {
        pub vault_id: ID,
        pub action: vector<u8>,
        pub admin: address,
        pub affected_users: u64,
        pub timestamp: u64,
    }
} 