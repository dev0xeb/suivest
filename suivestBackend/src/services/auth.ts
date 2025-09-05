import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types';
import { databaseService } from './database';
import { logger } from '@/utils/logger';

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;
  private jwtRefreshExpiresIn: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '24h';
    this.jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
  }

  // ========== JWT Token Management ==========

  generateToken(user: User): string {
    const payload = {
      userId: user.id,
      walletAddress: user.wallet_address,
      email: user.email,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    });
  }

  generateRefreshToken(user: User): string {
    const payload = {
      userId: user.id,
      walletAddress: user.wallet_address,
      type: 'refresh',
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtRefreshExpiresIn,
    });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
  }

  // ========== Authentication Methods ==========

  async authenticateUser(loginRequest: LoginRequest): Promise<AuthResponse | null> {
    try {
      const { wallet_address, signature, message } = loginRequest;

      // Verify wallet signature (simplified - in production, use proper signature verification)
      const isValidSignature = await this.verifyWalletSignature(wallet_address, signature, message);
      
      if (!isValidSignature) {
        logger.warn(`Invalid signature for wallet: ${wallet_address}`);
        return null;
      }

      // Get or create user
      let user = await databaseService.getUser(wallet_address);
      
      if (!user) {
        // Create new user
        user = await databaseService.createUser({
          wallet_address,
          is_active: true,
        });
        logger.info(`New user created: ${wallet_address}`);
      } else {
        // Update last login
        await databaseService.updateUser(user.id, {
          last_login_at: new Date(),
        });
      }

      // Generate tokens
      const token = this.generateToken(user);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

      return {
        user,
        token,
        expires_at: expiresAt,
      };
    } catch (error) {
      logger.error('Authentication failed:', error);
      return null;
    }
  }

  async registerUser(registerRequest: RegisterRequest): Promise<AuthResponse | null> {
    try {
      const { wallet_address, email, username } = registerRequest;

      // Check if user already exists
      const existingUser = await databaseService.getUser(wallet_address);
      if (existingUser) {
        logger.warn(`User already exists: ${wallet_address}`);
        return null;
      }

      // Create new user
      const user = await databaseService.createUser({
        wallet_address,
        email,
        username,
        is_active: true,
      });

      logger.info(`New user registered: ${wallet_address}`);

      // Generate tokens
      const token = this.generateToken(user);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      return {
        user,
        token,
        expires_at: expiresAt,
      };
    } catch (error) {
      logger.error('User registration failed:', error);
      return null;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse | null> {
    try {
      const decoded = this.verifyToken(refreshToken);
      if (!decoded || decoded.type !== 'refresh') {
        return null;
      }

      const user = await databaseService.getUser(decoded.walletAddress);
      if (!user || !user.is_active) {
        return null;
      }

      // Generate new tokens
      const token = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      return {
        user,
        token,
        expires_at: expiresAt,
      };
    } catch (error) {
      logger.error('Token refresh failed:', error);
      return null;
    }
  }

  // ========== Wallet Signature Verification ==========

  private async verifyWalletSignature(walletAddress: string, signature: string, message: string): Promise<boolean> {
    try {
      // In production, implement proper signature verification using Sui SDK
      // For now, we'll use a simplified approach
      
      // Generate expected message
      const expectedMessage = this.generateAuthMessage(walletAddress);
      
      // Verify signature (placeholder implementation)
      // In production, use: verifyMessage(message, signature, walletAddress)
      
      return message === expectedMessage;
    } catch (error) {
      logger.error('Signature verification failed:', error);
      return false;
    }
  }

  private generateAuthMessage(walletAddress: string): string {
    const timestamp = Date.now();
    return `Sign this message to authenticate with Suivest.\n\nWallet: ${walletAddress}\nTimestamp: ${timestamp}`;
  }

  // ========== Password Management ==========

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  // ========== User Management ==========

  async getUserFromToken(token: string): Promise<User | null> {
    try {
      const decoded = this.verifyToken(token);
      if (!decoded) {
        return null;
      }

      const user = await databaseService.getUser(decoded.walletAddress);
      if (!user || !user.is_active) {
        return null;
      }

      return user;
    } catch (error) {
      logger.error('Error getting user from token:', error);
      return null;
    }
  }

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User | null> {
    try {
      const user = await databaseService.updateUser(userId, updates);
      return user;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      return null;
    }
  }

  async deactivateUser(userId: string): Promise<boolean> {
    try {
      await databaseService.updateUser(userId, { is_active: false });
      logger.info(`User deactivated: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error deactivating user:', error);
      return false;
    }
  }

  // ========== Session Management ==========

  async validateSession(token: string): Promise<boolean> {
    try {
      const user = await this.getUserFromToken(token);
      return user !== null;
    } catch (error) {
      logger.error('Session validation failed:', error);
      return false;
    }
  }

  async logoutUser(userId: string): Promise<boolean> {
    try {
      // In a more sophisticated implementation, you might want to:
      // 1. Add the token to a blacklist
      // 2. Update user's last logout time
      // 3. Clear any active sessions
      
      await databaseService.updateUser(userId, {
        last_login_at: null,
      });
      
      logger.info(`User logged out: ${userId}`);
      return true;
    } catch (error) {
      logger.error('Error logging out user:', error);
      return false;
    }
  }

  // ========== Security Utilities ==========

  generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  generateSecureToken(): string {
    const crypto = require('crypto');
    return crypto.randomBytes(32).toString('hex');
  }

  // ========== Rate Limiting ==========

  private loginAttempts = new Map<string, { count: number; lastAttempt: number }>();

  async checkLoginAttempts(walletAddress: string): Promise<boolean> {
    const attempts = this.loginAttempts.get(walletAddress);
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxAttempts = 5;

    if (!attempts) {
      this.loginAttempts.set(walletAddress, { count: 1, lastAttempt: now });
      return true;
    }

    if (now - attempts.lastAttempt > windowMs) {
      // Reset attempts after window
      this.loginAttempts.set(walletAddress, { count: 1, lastAttempt: now });
      return true;
    }

    if (attempts.count >= maxAttempts) {
      return false; // Too many attempts
    }

    attempts.count++;
    attempts.lastAttempt = now;
    return true;
  }

  resetLoginAttempts(walletAddress: string): void {
    this.loginAttempts.delete(walletAddress);
  }
}

// Export singleton instance
export const authService = new AuthService(); 