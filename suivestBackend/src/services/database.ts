import knex, { Knex } from 'knex';
import config from '../../knexfile';
import {
  User,
  Vault,
  UserDeposit,
  UserWithdrawal,
  LotteryRound,
  Winner,
  UserStreak,
  ContractEvent,
  DatabaseService,
  PaginationParams,
  SortParams,
  FilterParams,
} from '@/types';

export class DatabaseServiceImpl implements DatabaseService {
  private db: Knex;

  constructor() {
    const environment = process.env.NODE_ENV || 'development';
    this.db = knex(config[environment]);
  }

  // ========== User Operations ==========

  async getUser(walletAddress: string): Promise<User | null> {
    const user = await this.db('users')
      .where('wallet_address', walletAddress)
      .first();
    
    return user || null;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const [user] = await this.db('users')
      .insert({
        wallet_address: userData.wallet_address!,
        email: userData.email,
        username: userData.username,
        avatar_url: userData.avatar_url,
        is_active: userData.is_active ?? true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    
    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const [user] = await this.db('users')
      .where('id', userId)
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .returning('*');
    
    return user;
  }

  // ========== Vault Operations ==========

  async getVault(vaultId: string): Promise<Vault | null> {
    const vault = await this.db('vaults')
      .where('id', vaultId)
      .first();
    
    return vault || null;
  }

  async getVaults(): Promise<Vault[]> {
    return await this.db('vaults')
      .where('is_active', true)
      .orderBy('created_at', 'desc');
  }

  async updateVault(vaultId: string, updates: Partial<Vault>): Promise<Vault> {
    const [vault] = await this.db('vaults')
      .where('id', vaultId)
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .returning('*');
    
    return vault;
  }

  // ========== Deposit Operations ==========

  async createDeposit(depositData: Omit<UserDeposit, 'id' | 'created_at'>): Promise<UserDeposit> {
    const [deposit] = await this.db('user_deposits')
      .insert({
        user_id: depositData.user_id,
        vault_id: depositData.vault_id,
        transaction_hash: depositData.transaction_hash,
        amount: depositData.amount,
        tickets_minted: depositData.tickets_minted,
        round_id: depositData.round_id,
        status: depositData.status,
        created_at: new Date(),
      })
      .returning('*');
    
    return deposit;
  }

  async updateDeposit(depositId: string, updates: Partial<UserDeposit>): Promise<UserDeposit> {
    const [deposit] = await this.db('user_deposits')
      .where('id', depositId)
      .update({
        ...updates,
        ...(updates.status === 'confirmed' && { confirmed_at: new Date() }),
      })
      .returning('*');
    
    return deposit;
  }

  async getUserDeposits(userId: string, vaultId?: string): Promise<UserDeposit[]> {
    let query = this.db('user_deposits')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
    
    if (vaultId) {
      query = query.where('vault_id', vaultId);
    }
    
    return await query;
  }

  // ========== Withdrawal Operations ==========

  async createWithdrawal(withdrawalData: Omit<UserWithdrawal, 'id' | 'created_at'>): Promise<UserWithdrawal> {
    const [withdrawal] = await this.db('user_withdrawals')
      .insert({
        user_id: withdrawalData.user_id,
        vault_id: withdrawalData.vault_id,
        transaction_hash: withdrawalData.transaction_hash,
        amount: withdrawalData.amount,
        tickets_burned: withdrawalData.tickets_burned,
        round_id: withdrawalData.round_id,
        status: withdrawalData.status,
        created_at: new Date(),
      })
      .returning('*');
    
    return withdrawal;
  }

  async updateWithdrawal(withdrawalId: string, updates: Partial<UserWithdrawal>): Promise<UserWithdrawal> {
    const [withdrawal] = await this.db('user_withdrawals')
      .where('id', withdrawalId)
      .update({
        ...updates,
        ...(updates.status === 'confirmed' && { confirmed_at: new Date() }),
      })
      .returning('*');
    
    return withdrawal;
  }

  async getUserWithdrawals(userId: string, vaultId?: string): Promise<UserWithdrawal[]> {
    let query = this.db('user_withdrawals')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
    
    if (vaultId) {
      query = query.where('vault_id', vaultId);
    }
    
    return await query;
  }

  // ========== Round Operations ==========

  async getCurrentRound(vaultId: string): Promise<LotteryRound | null> {
    const round = await this.db('lottery_rounds')
      .where('vault_id', vaultId)
      .where('is_active', true)
      .first();
    
    return round || null;
  }

  async getRound(roundId: string): Promise<LotteryRound | null> {
    const round = await this.db('lottery_rounds')
      .where('id', roundId)
      .first();
    
    return round || null;
  }

  async createRound(roundData: Omit<LotteryRound, 'id' | 'created_at'>): Promise<LotteryRound> {
    const [round] = await this.db('lottery_rounds')
      .insert({
        vault_id: roundData.vault_id,
        round_id: roundData.round_id,
        start_time: roundData.start_time,
        end_time: roundData.end_time,
        total_participants: roundData.total_participants,
        total_tickets: roundData.total_tickets,
        prize_pool: roundData.prize_pool,
        is_active: roundData.is_active,
        is_finalized: roundData.is_finalized,
        randomness_seed: roundData.randomness_seed,
        created_at: new Date(),
      })
      .returning('*');
    
    return round;
  }

  async updateRound(roundId: string, updates: Partial<LotteryRound>): Promise<LotteryRound> {
    const [round] = await this.db('lottery_rounds')
      .where('id', roundId)
      .update({
        ...updates,
        ...(updates.is_finalized && { finalized_at: new Date() }),
      })
      .returning('*');
    
    return round;
  }

  async getRounds(vaultId: string, limit: number = 10, offset: number = 0): Promise<LotteryRound[]> {
    return await this.db('lottery_rounds')
      .where('vault_id', vaultId)
      .orderBy('round_id', 'desc')
      .limit(limit)
      .offset(offset);
  }

  // ========== Winner Operations ==========

  async createWinner(winnerData: Omit<Winner, 'id' | 'created_at'>): Promise<Winner> {
    const [winner] = await this.db('winners')
      .insert({
        round_id: winnerData.round_id,
        user_id: winnerData.user_id,
        wallet_address: winnerData.wallet_address,
        position: winnerData.position,
        prize_amount: winnerData.prize_amount,
        has_claimed: winnerData.has_claimed,
        created_at: new Date(),
      })
      .returning('*');
    
    return winner;
  }

  async updateWinner(winnerId: string, updates: Partial<Winner>): Promise<Winner> {
    const [winner] = await this.db('winners')
      .where('id', winnerId)
      .update({
        ...updates,
        ...(updates.has_claimed && { claimed_at: new Date() }),
      })
      .returning('*');
    
    return winner;
  }

  async getRoundWinners(roundId: string): Promise<Winner[]> {
    return await this.db('winners')
      .where('round_id', roundId)
      .orderBy('position', 'asc');
  }

  async getUserWinners(userId: string): Promise<Winner[]> {
    return await this.db('winners')
      .where('user_id', userId)
      .orderBy('created_at', 'desc');
  }

  // ========== Streak Operations ==========

  async getUserStreak(userId: string, vaultId: string): Promise<UserStreak | null> {
    const streak = await this.db('user_streaks')
      .where('user_id', userId)
      .where('vault_id', vaultId)
      .first();
    
    return streak || null;
  }

  async createUserStreak(streakData: Omit<UserStreak, 'id' | 'created_at' | 'updated_at'>): Promise<UserStreak> {
    const [streak] = await this.db('user_streaks')
      .insert({
        user_id: streakData.user_id,
        vault_id: streakData.vault_id,
        current_streak: streakData.current_streak,
        longest_streak: streakData.longest_streak,
        rounds_participated: streakData.rounds_participated,
        last_participation_round: streakData.last_participation_round,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');
    
    return streak;
  }

  async updateUserStreak(streakId: string, updates: Partial<UserStreak>): Promise<UserStreak> {
    const [streak] = await this.db('user_streaks')
      .where('id', streakId)
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .returning('*');
    
    return streak;
  }

  // ========== Event Operations ==========

  async createEvent(eventData: Omit<ContractEvent, 'id' | 'created_at'>): Promise<ContractEvent> {
    const [event] = await this.db('contract_events')
      .insert({
        event_type: eventData.event_type,
        vault_id: eventData.vault_id,
        user_id: eventData.user_id,
        round_id: eventData.round_id,
        transaction_hash: eventData.transaction_hash,
        event_data: eventData.event_data,
        processed: eventData.processed,
        created_at: new Date(),
      })
      .returning('*');
    
    return event;
  }

  async updateEvent(eventId: string, updates: Partial<ContractEvent>): Promise<ContractEvent> {
    const [event] = await this.db('contract_events')
      .where('id', eventId)
      .update({
        ...updates,
        ...(updates.processed && { processed_at: new Date() }),
      })
      .returning('*');
    
    return event;
  }

  async getUnprocessedEvents(): Promise<ContractEvent[]> {
    return await this.db('contract_events')
      .where('processed', false)
      .orderBy('created_at', 'asc');
  }

  // ========== Utility Operations ==========

  async getPaginatedResults<T>(
    table: string,
    params: PaginationParams & SortParams & FilterParams,
    baseQuery?: Knex.QueryBuilder
  ): Promise<{ data: T[]; total: number; pagination: any }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let query = baseQuery || this.db(table);

    // Apply filters
    if (params.vault_id) {
      query = query.where('vault_id', params.vault_id);
    }
    if (params.user_id) {
      query = query.where('user_id', params.user_id);
    }
    if (params.status) {
      query = query.where('status', params.status);
    }
    if (params.date_from) {
      query = query.where('created_at', '>=', params.date_from);
    }
    if (params.date_to) {
      query = query.where('created_at', '<=', params.date_to);
    }

    // Get total count
    const totalResult = await query.clone().count('* as count').first();
    const total = parseInt(totalResult?.count as string || '0');

    // Apply sorting
    if (params.sortBy) {
      const sortOrder = params.sortOrder || 'desc';
      query = query.orderBy(params.sortBy, sortOrder);
    } else {
      query = query.orderBy('created_at', 'desc');
    }

    // Apply pagination
    const data = await query.limit(limit).offset(offset);

    return {
      data,
      total,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async transaction<T>(callback: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return await this.db.transaction(callback);
  }

  async close(): Promise<void> {
    await this.db.destroy();
  }
}

// Export singleton instance
export const databaseService = new DatabaseServiceImpl(); 