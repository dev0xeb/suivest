import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '@/services/auth';
import { ApiResponse, LoginRequest, RegisterRequest } from '@/types';
import { logger } from '@/utils/logger';

export class AuthController {
  // ========== Validation Rules ==========

  static loginValidation = [
    body('wallet_address')
      .isString()
      .isLength({ min: 42, max: 66 })
      .withMessage('Valid wallet address is required'),
    body('signature')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Signature is required'),
    body('message')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Message is required'),
  ];

  static registerValidation = [
    body('wallet_address')
      .isString()
      .isLength({ min: 42, max: 66 })
      .withMessage('Valid wallet address is required'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Valid email is required'),
    body('username')
      .optional()
      .isString()
      .isLength({ min: 3, max: 50 })
      .withMessage('Username must be between 3 and 50 characters'),
  ];

  static refreshTokenValidation = [
    body('refresh_token')
      .isString()
      .isLength({ min: 1 })
      .withMessage('Refresh token is required'),
  ];

  // ========== Controller Methods ==========

  static async login(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      const { wallet_address, signature, message } = req.body as LoginRequest;

      // Check rate limiting
      const canAttempt = await authService.checkLoginAttempts(wallet_address);
      if (!canAttempt) {
        res.status(429).json({
          success: false,
          error: 'Too many login attempts. Please try again later.',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Authenticate user
      const authResponse = await authService.authenticateUser({
        wallet_address,
        signature,
        message,
      });

      if (!authResponse) {
        res.status(401).json({
          success: false,
          error: 'Authentication failed. Invalid signature or wallet address.',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Reset login attempts on successful login
      authService.resetLoginAttempts(wallet_address);

      logger.info(`User logged in: ${wallet_address}`);

      res.status(200).json({
        success: true,
        data: authResponse,
        message: 'Login successful',
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      const { wallet_address, email, username } = req.body as RegisterRequest;

      // Register user
      const authResponse = await authService.registerUser({
        wallet_address,
        email,
        username,
      });

      if (!authResponse) {
        res.status(409).json({
          success: false,
          error: 'User already exists with this wallet address',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      logger.info(`User registered: ${wallet_address}`);

      res.status(201).json({
        success: true,
        data: authResponse,
        message: 'Registration successful',
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      const { refresh_token } = req.body;

      // Refresh token
      const authResponse = await authService.refreshToken(refresh_token);

      if (!authResponse) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired refresh token',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      res.status(200).json({
        success: true,
        data: authResponse,
        message: 'Token refreshed successfully',
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Logout user
      const success = await authService.logoutUser(user.id);

      if (!success) {
        res.status(500).json({
          success: false,
          error: 'Logout failed',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      logger.info(`User logged out: ${user.wallet_address}`);

      res.status(200).json({
        success: true,
        message: 'Logout successful',
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Remove sensitive information
      const { id, wallet_address, email, username, avatar_url, created_at, updated_at } = user;

      res.status(200).json({
        success: true,
        data: {
          id,
          wallet_address,
          email,
          username,
          avatar_url,
          created_at,
          updated_at,
        },
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      const { email, username, avatar_url } = req.body;

      // Validate input
      if (email && !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        res.status(400).json({
          success: false,
          error: 'Invalid email format',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      if (username && (username.length < 3 || username.length > 50)) {
        res.status(400).json({
          success: false,
          error: 'Username must be between 3 and 50 characters',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Update profile
      const updatedUser = await authService.updateUserProfile(user.id, {
        email,
        username,
        avatar_url,
      });

      if (!updatedUser) {
        res.status(500).json({
          success: false,
          error: 'Profile update failed',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      logger.info(`Profile updated: ${user.wallet_address}`);

      res.status(200).json({
        success: true,
        data: {
          id: updatedUser.id,
          wallet_address: updatedUser.wallet_address,
          email: updatedUser.email,
          username: updatedUser.username,
          avatar_url: updatedUser.avatar_url,
          updated_at: updatedUser.updated_at,
        },
        message: 'Profile updated successfully',
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async getAuthMessage(req: Request, res: Response): Promise<void> {
    try {
      const { wallet_address } = req.params;

      if (!wallet_address || wallet_address.length < 42 || wallet_address.length > 66) {
        res.status(400).json({
          success: false,
          error: 'Valid wallet address is required',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Generate auth message
      const message = `Sign this message to authenticate with Suivest.\n\nWallet: ${wallet_address}\nTimestamp: ${Date.now()}`;
      const nonce = authService.generateNonce();

      res.status(200).json({
        success: true,
        data: {
          message,
          nonce,
          wallet_address,
        },
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Get auth message error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }

  static async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.body;

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'Token is required',
          timestamp: new Date(),
        } as ApiResponse);
        return;
      }

      // Validate token
      const isValid = await authService.validateSession(token);

      res.status(200).json({
        success: true,
        data: {
          valid: isValid,
        },
        timestamp: new Date(),
      } as ApiResponse);
    } catch (error) {
      logger.error('Validate token error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date(),
      } as ApiResponse);
    }
  }
} 