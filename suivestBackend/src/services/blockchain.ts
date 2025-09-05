import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { fromB64 } from '@mysten/sui.js/utils';
import {
  VaultState,
  UserVaultState,
  BlockchainService,
  SuiTransaction,
} from '@/types';
import { logger } from '@/utils/logger';

export class BlockchainServiceImpl implements BlockchainService {
  private client: SuiClient;
  private keypair: Ed25519Keypair;
  private packageId: string;
  private adminAddress: string;
  private treasuryAddress: string;
  private oracleAddress: string;

  constructor() {
    const network = process.env.SUI_NETWORK || 'testnet';
    this.client = new SuiClient({ url: getFullnodeUrl(network) });
    
    // Initialize keypair from environment or generate new one
    const privateKey = process.env.ADMIN_PRIVATE_KEY;
    if (privateKey) {
      this.keypair = Ed25519Keypair.fromSecretKey(fromB64(privateKey));
    } else {
      this.keypair = new Ed25519Keypair();
    }

    this.packageId = process.env.SUI_PACKAGE_ID || '';
    this.adminAddress = process.env.ADMIN_ADDRESS || this.keypair.getPublicKey().toSuiAddress();
    this.treasuryAddress = process.env.TREASURY_ADDRESS || this.adminAddress;
    this.oracleAddress = process.env.ORACLE_ADDRESS || this.adminAddress;

    if (!this.packageId) {
      throw new Error('SUI_PACKAGE_ID environment variable is required');
    }
  }

  // ========== Vault State Queries ==========

  async getVaultState(vaultId: string): Promise<VaultState> {
    try {
      const vaultObject = await this.client.getObject({
        id: vaultId,
        options: {
          showContent: true,
          showDisplay: true,
        },
      });

      if (!vaultObject.data?.content) {
        throw new Error(`Vault not found: ${vaultId}`);
      }

      const content = vaultObject.data.content as any;
      
      return {
        vault_id: vaultId,
        token_type: content.token_type?.coin_type || '',
        total_deposits: content.total_deposits || '0',
        total_withdrawals: content.total_withdrawals || '0',
        total_prizes_distributed: content.total_prizes_distributed || '0',
        active_participants: content.active_participants || 0,
        current_round: {
          round_id: content.current_round?.round_id || 0,
          is_active: content.current_round?.is_active || false,
          total_tickets: content.current_round?.total_tickets || '0',
          prize_pool: content.current_round?.prize_pool || '0',
        },
      };
    } catch (error) {
      logger.error('Error getting vault state:', error);
      throw new Error(`Failed to get vault state: ${error}`);
    }
  }

  async getUserVaultState(userId: string, vaultId: string): Promise<UserVaultState> {
    try {
      // Get user's ticket balance
      const ticketsBalance = await this.getUserTickets(userId, vaultId);
      
      // Get user's participation history
      const participationHistory = await this.getUserParticipationHistory(userId, vaultId);
      
      // Get user's prizes won
      const prizesWon = await this.getUserPrizesWon(userId, vaultId);
      
      // Get user's streak
      const currentStreak = await this.getUserStreak(userId, vaultId);

      return {
        user_id: userId,
        vault_id: vaultId,
        tickets_balance: ticketsBalance,
        total_deposited: '0', // Would be calculated from deposits
        total_withdrawn: '0', // Would be calculated from withdrawals
        prizes_won: prizesWon,
        current_streak: currentStreak,
        participation_history: participationHistory,
      };
    } catch (error) {
      logger.error('Error getting user vault state:', error);
      throw new Error(`Failed to get user vault state: ${error}`);
    }
  }

  // ========== Transaction Submission ==========

  async submitDeposit(vaultId: string, amount: string, userAddress: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Get user's coins
      const coins = tx.splitCoins(tx.gas, [tx.pure(amount)]);
      
      // Call deposit function
      tx.moveCall({
        target: `${this.packageId}::vault::deposit`,
        arguments: [
          tx.object(vaultId), // vault
          coins, // funds
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Deposit successful: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Deposit failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error submitting deposit:', error);
      throw new Error(`Failed to submit deposit: ${error}`);
    }
  }

  async submitWithdrawal(vaultId: string, yieldShares: string, userAddress: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call withdraw function
      tx.moveCall({
        target: `${this.packageId}::vault::withdraw`,
        arguments: [
          tx.object(vaultId), // vault
          tx.pure(yieldShares), // yield shares
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Withdrawal successful: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Withdrawal failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error submitting withdrawal:', error);
      throw new Error(`Failed to submit withdrawal: ${error}`);
    }
  }

  async startDrawRound(vaultId: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call start_draw_round function (admin only)
      tx.moveCall({
        target: `${this.packageId}::vault::start_draw_round`,
        arguments: [
          tx.object(vaultId), // vault
          tx.object('ADMIN_CAP_ID'), // admin_cap (would be actual admin cap ID)
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Round started: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Round start failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error starting round:', error);
      throw new Error(`Failed to start round: ${error}`);
    }
  }

  async endDrawRound(vaultId: string, randomnessSeed: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call end_draw_round function (admin only)
      tx.moveCall({
        target: `${this.packageId}::vault::end_draw_round`,
        arguments: [
          tx.object(vaultId), // vault
          tx.object('ADMIN_CAP_ID'), // admin_cap (would be actual admin cap ID)
          tx.pure(randomnessSeed), // randomness_seed
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Round ended: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Round end failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error ending round:', error);
      throw new Error(`Failed to end round: ${error}`);
    }
  }

  async claimPrize(vaultId: string, userAddress: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call claim_prize function
      tx.moveCall({
        target: `${this.packageId}::vault::claim_prize`,
        arguments: [
          tx.object(vaultId), // vault
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Prize claimed: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Prize claim failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error claiming prize:', error);
      throw new Error(`Failed to claim prize: ${error}`);
    }
  }

  // ========== Event Listening ==========

  listenToEvents(callback: (event: any) => void): void {
    // Subscribe to events
    this.client.subscribeEvent({
      filter: {
        Package: this.packageId,
      },
      onMessage: (event) => {
        try {
          logger.info('Received event:', event);
          callback(event);
        } catch (error) {
          logger.error('Error processing event:', error);
        }
      },
    });
  }

  // ========== Helper Methods ==========

  private async getUserTickets(userId: string, vaultId: string): Promise<string> {
    try {
      // This would call the vault's tickets_of function
      // For now, return a placeholder
      return '0';
    } catch (error) {
      logger.error('Error getting user tickets:', error);
      return '0';
    }
  }

  private async getUserParticipationHistory(userId: string, vaultId: string): Promise<any[]> {
    try {
      // This would query the blockchain for user's participation history
      // For now, return empty array
      return [];
    } catch (error) {
      logger.error('Error getting user participation history:', error);
      return [];
    }
  }

  private async getUserPrizesWon(userId: string, vaultId: string): Promise<string> {
    try {
      // This would query the blockchain for user's prizes won
      // For now, return '0'
      return '0';
    } catch (error) {
      logger.error('Error getting user prizes won:', error);
      return '0';
    }
  }

  private async getUserStreak(userId: string, vaultId: string): Promise<number> {
    try {
      // This would query the blockchain for user's streak
      // For now, return 0
      return 0;
    } catch (error) {
      logger.error('Error getting user streak:', error);
      return 0;
    }
  }

  // ========== Transaction Utilities ==========

  async getTransaction(digest: string): Promise<SuiTransaction | null> {
    try {
      const tx = await this.client.getTransactionBlock({
        digest,
        options: {
          showEffects: true,
          showInput: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      return tx as SuiTransaction;
    } catch (error) {
      logger.error('Error getting transaction:', error);
      return null;
    }
  }

  async waitForTransaction(digest: string, timeout: number = 30000): Promise<SuiTransaction> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      const tx = await this.getTransaction(digest);
      if (tx) {
        return tx;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Transaction not found within ${timeout}ms: ${digest}`);
  }

  // ========== VRF Integration ==========

  async requestRandomness(roundId: number): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call VRF request function
      tx.moveCall({
        target: `${this.packageId}::vrf::request_randomness`,
        arguments: [
          tx.object('VRF_REGISTRY_ID'), // registry (would be actual registry ID)
          tx.pure(roundId), // round_id
          tx.pure('round_seed'), // seed
          tx.object('CLOCK_ID'), // clock (would be actual clock ID)
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Randomness requested: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Randomness request failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error requesting randomness:', error);
      throw new Error(`Failed to request randomness: ${error}`);
    }
  }

  // ========== Yield Management ==========

  async harvestYield(vaultId: string, yieldAmount: string): Promise<string> {
    try {
      const tx = new TransactionBlock();
      
      // Call harvest_yield function (admin only)
      tx.moveCall({
        target: `${this.packageId}::vault::harvest_yield`,
        arguments: [
          tx.object(vaultId), // vault
          tx.object('ADMIN_CAP_ID'), // admin_cap (would be actual admin cap ID)
          tx.pure(yieldAmount), // yield_amount
        ],
      });

      const result = await this.client.signAndExecuteTransactionBlock({
        signer: this.keypair,
        transactionBlock: tx,
        options: {
          showEffects: true,
          showObjectChanges: true,
        },
      });

      if (result.effects?.status.status === 'success') {
        logger.info(`Yield harvested: ${result.digest}`);
        return result.digest;
      } else {
        throw new Error(`Yield harvest failed: ${result.effects?.status.error}`);
      }
    } catch (error) {
      logger.error('Error harvesting yield:', error);
      throw new Error(`Failed to harvest yield: ${error}`);
    }
  }
}

// Export singleton instance
export const blockchainService = new BlockchainServiceImpl(); 