// ========== Database Types ==========

export interface User {
  id: string;
  wallet_address: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface Vault {
  id: string;
  token_type: string;
  token_symbol: string;
  token_name: string;
  token_decimals: number;
  vault_address: string;
  is_active: boolean;
  total_deposits: string;
  total_withdrawals: string;
  total_prizes_distributed: string;
  active_participants: number;
  created_at: Date;
  updated_at: Date;
}

export interface UserDeposit {
  id: string;
  user_id: string;
  vault_id: string;
  transaction_hash: string;
  savings_amount: string;
  yield_shares_minted: string;
  round_id: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: Date;
  confirmed_at?: Date;
}

export interface UserWithdrawal {
  id: string;
  user_id: string;
  vault_id: string;
  transaction_hash: string;
  savings_amount: string;
  yield_shares_burned: string;
  round_id: number;
  status: 'pending' | 'confirmed' | 'failed';
  created_at: Date;
  confirmed_at?: Date;
}

export interface PrizeDrawRound {
  id: string;
  vault_id: string;
  round_id: number;
  start_time: Date;
  end_time: Date;
  total_participants: number;
  total_savings: string;
  yield_pool: string;
  is_active: boolean;
  is_finalized: boolean;
  randomness_seed?: string;
  created_at: Date;
  finalized_at?: Date;
}

export interface PrizeWinner {
  id: string;
  round_id: string;
  user_id: string;
  wallet_address: string;
  position: number; // 1, 2, or 3
  prize_amount: string;
  has_claimed: boolean;
  claimed_at?: Date;
  created_at: Date;
}

export interface UserStreak {
  id: string;
  user_id: string;
  vault_id: string;
  current_streak: number;
  longest_streak: number;
  rounds_participated: number;
  last_participation_round: number;
  created_at: Date;
  updated_at: Date;
}

export interface ContractEvent {
  id: string;
  event_type: 'deposited' | 'withdrawn' | 'round_started' | 'round_ended' | 'prize_claimed' | 'yield_harvested';
  vault_id?: string;
  user_id?: string;
  round_id?: string;
  transaction_hash: string;
  event_data: Record<string, any>;
  processed: boolean;
  created_at: Date;
  processed_at?: Date;
}

// ========== API Request/Response Types ==========

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Auth Types
export interface LoginRequest {
  wallet_address: string;
  signature: string;
  message: string;
}

export interface RegisterRequest {
  wallet_address: string;
  email?: string;
  username?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  expires_at: Date;
}

// Deposit/Withdrawal Types
export interface DepositRequest {
  vault_id: string;
  amount: string;
  token_type: string;
}

export interface WithdrawalRequest {
  vault_id: string;
  tickets: string;
  token_type: string;
}

export interface BalanceResponse {
  wallet_address: string;
  vault_id: string;
  token_type: string;
  token_symbol: string;
  savings_amount: string;
  yield_shares_balance: string;
  available_for_withdrawal: string;
  current_round_id: number;
}

// Lottery Types
export interface DrawRoundInfo {
  round_id: number;
  vault_id: string;
  token_symbol: string;
  start_time: Date;
  end_time: Date;
  total_participants: number;
  total_savings: string;
  yield_pool: string;
  is_active: boolean;
  time_remaining: number; // seconds
  user_savings?: string;
  user_participation?: boolean;
}

export interface PrizeWinnerInfo {
  round_id: number;
  vault_id: string;
  token_symbol: string;
  winners: Array<{
    position: number;
    wallet_address: string;
    prize_amount: string;
    has_claimed: boolean;
  }>;
  total_prize_distributed: string;
  finalized_at: Date;
}

// Streak Types
export interface StreakInfo {
  user_id: string;
  vault_id: string;
  token_symbol: string;
  current_streak: number;
  longest_streak: number;
  rounds_participated: number;
  next_round_start: Date;
  streak_multiplier: number;
}

// ========== Blockchain Types ==========

export interface SuiTransaction {
  digest: string;
  transaction: {
    data: {
      gasData: {
        owner: string;
        price: string;
        budget: string;
      };
      sender: string;
      gasConfig: {
        budget: string;
        price: string;
      };
    };
    txSignatures: string[];
  };
  transactionEffects: {
    status: {
      status: 'success' | 'failure';
      error?: string;
    };
    gasUsed: {
      computationCost: string;
      storageCost: string;
      storageRebate: string;
    };
    objectChanges: Array<{
      type: 'created' | 'mutated' | 'deleted';
      sender?: string;
      objectId?: string;
      objectType?: string;
      packageId?: string;
    }>;
    events: Array<{
      type: string;
      packageId: string;
      transactionModule: string;
      sender: string;
      data: Record<string, any>;
    }>;
  };
}

export interface VaultState {
  vault_id: string;
  token_type: string;
  total_deposits: string;
  total_withdrawals: string;
  total_prizes_distributed: string;
  active_participants: number;
  current_round: {
    round_id: number;
    is_active: boolean;
    total_tickets: string;
    prize_pool: string;
  };
}

export interface UserVaultState {
  user_id: string;
  vault_id: string;
  tickets_balance: string;
  total_deposited: string;
  total_withdrawn: string;
  prizes_won: string;
  current_streak: number;
  participation_history: Array<{
    round_id: number;
    tickets: string;
    won_prize: boolean;
    prize_amount?: string;
  }>;
}

// ========== Configuration Types ==========

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
  pool: {
    min: number;
    max: number;
  };
}

export interface SuiConfig {
  network: 'testnet' | 'mainnet' | 'devnet';
  rpcUrl: string;
  packageId: string;
  adminAddress: string;
  treasuryAddress: string;
  oracleAddress: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export interface AppConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  rateLimit: {
    windowMs: number;
    max: number;
  };
  database: DatabaseConfig;
  sui: SuiConfig;
  jwt: JwtConfig;
}

// ========== Service Types ==========

export interface BlockchainService {
  getVaultState(vaultId: string): Promise<VaultState>;
  getUserVaultState(userId: string, vaultId: string): Promise<UserVaultState>;
  submitDeposit(vaultId: string, amount: string, userAddress: string): Promise<string>;
  submitWithdrawal(vaultId: string, tickets: string, userAddress: string): Promise<string>;
  startRound(vaultId: string): Promise<string>;
  endRound(vaultId: string, randomnessSeed: string): Promise<string>;
  claimPrize(vaultId: string, userAddress: string): Promise<string>;
  listenToEvents(callback: (event: any) => void): void;
}

export interface DatabaseService {
  getUser(walletAddress: string): Promise<User | null>;
  createUser(userData: Partial<User>): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  
  getVault(vaultId: string): Promise<Vault | null>;
  getVaults(): Promise<Vault[]>;
  updateVault(vaultId: string, updates: Partial<Vault>): Promise<Vault>;
  
  createDeposit(depositData: Omit<UserDeposit, 'id' | 'created_at'>): Promise<UserDeposit>;
  updateDeposit(depositId: string, updates: Partial<UserDeposit>): Promise<UserDeposit>;
  getUserDeposits(userId: string, vaultId?: string): Promise<UserDeposit[]>;
  
  createWithdrawal(withdrawalData: Omit<UserWithdrawal, 'id' | 'created_at'>): Promise<UserWithdrawal>;
  updateWithdrawal(withdrawalId: string, updates: Partial<UserWithdrawal>): Promise<UserWithdrawal>;
  getUserWithdrawals(userId: string, vaultId?: string): Promise<UserWithdrawal[]>;
  
  getCurrentDrawRound(vaultId: string): Promise<PrizeDrawRound | null>;
  getDrawRound(roundId: string): Promise<PrizeDrawRound | null>;
  createDrawRound(roundData: Omit<PrizeDrawRound, 'id' | 'created_at'>): Promise<PrizeDrawRound>;
  updateDrawRound(roundId: string, updates: Partial<PrizeDrawRound>): Promise<PrizeDrawRound>;
  getDrawRounds(vaultId: string, limit?: number, offset?: number): Promise<PrizeDrawRound[]>;
  
  createPrizeWinner(winnerData: Omit<PrizeWinner, 'id' | 'created_at'>): Promise<PrizeWinner>;
  updatePrizeWinner(winnerId: string, updates: Partial<PrizeWinner>): Promise<PrizeWinner>;
  getDrawRoundWinners(roundId: string): Promise<PrizeWinner[]>;
  getUserPrizeWinners(userId: string): Promise<PrizeWinner[]>;
  
  getUserStreak(userId: string, vaultId: string): Promise<UserStreak | null>;
  createUserStreak(streakData: Omit<UserStreak, 'id' | 'created_at' | 'updated_at'>): Promise<UserStreak>;
  updateUserStreak(streakId: string, updates: Partial<UserStreak>): Promise<UserStreak>;
  
  createEvent(eventData: Omit<ContractEvent, 'id' | 'created_at'>): Promise<ContractEvent>;
  updateEvent(eventId: string, updates: Partial<ContractEvent>): Promise<ContractEvent>;
  getUnprocessedEvents(): Promise<ContractEvent[]>;
}

// ========== Error Types ==========

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
  }
}

export class BlockchainError extends AppError {
  constructor(message: string) {
    super(message, 500);
  }
}

// ========== Utility Types ==========

export type TokenType = 'SUI' | 'USDC' | 'suiUSDC' | 'WALRUS' | 'DEEP';

export type TransactionStatus = 'pending' | 'confirmed' | 'failed';

export type EventType = 'deposited' | 'withdrawn' | 'round_started' | 'round_ended' | 'prize_claimed' | 'yield_harvested';

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  vault_id?: string;
  user_id?: string;
  status?: string;
  date_from?: Date;
  date_to?: Date;
}

export type QueryParams = PaginationParams & SortParams & FilterParams; 