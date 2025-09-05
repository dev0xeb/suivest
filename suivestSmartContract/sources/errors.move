module suivest::errors {
    // Core vault errors
    const E_VAULT_PAUSED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_DRAW_ACTIVE: u64 = 4;
    const E_DRAW_NOT_ACTIVE: u64 = 5;
    const E_ALREADY_CLAIMED: u64 = 6;
    const E_NOT_WINNER: u64 = 7;
    const E_INVALID_TOKEN: u64 = 8;
    const E_UNAUTHORIZED: u64 = 9;
    const E_INVALID_ROUND: u64 = 10;
    const E_ROUND_NOT_ENDED: u64 = 11;
    const E_ROUND_ALREADY_STARTED: u64 = 12;
    const E_INSUFFICIENT_PRIZE_POOL: u64 = 13;
    const E_INVALID_WINNER_COUNT: u64 = 14;
    const E_REENTRANCY_GUARD: u64 = 15;
    const E_INVALID_ADDRESS: u64 = 16;
    const E_TOKEN_NOT_SUPPORTED: u64 = 17;
    const E_YIELD_HARVEST_FAILED: u64 = 18;
    const E_INVALID_TIMESTAMP: u64 = 19;
    const E_MAX_PARTICIPANTS_REACHED: u64 = 20;
    const E_INVALID_STREAK: u64 = 21;
    const E_WITHDRAWAL_COOLDOWN: u64 = 22;
    const E_DEPOSIT_LIMIT_EXCEEDED: u64 = 23;
    const E_INVALID_PRIZE_DISTRIBUTION: u64 = 24;
} 