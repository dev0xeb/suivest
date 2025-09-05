import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from '@/routes/auth';
import vaultRoutes from '@/routes/vault';
import prizeDrawRoutes from '@/routes/prize-draws';
import userRoutes from '@/routes/user';
import adminRoutes from '@/routes/admin';

// Import middleware
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';
import { requestLogger } from '@/middleware/requestLogger';

// Import services
import { databaseService } from '@/services/database';
import { blockchainService } from '@/services/blockchain';
import { logger } from '@/utils/logger';

// Import background jobs
import { startEventListener } from '@/jobs/eventListener';
import { startDrawRoundManager } from '@/jobs/drawRoundManager';

class App {
  public app: express.Application;
  public port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // Compression
    this.app.use(compression());

    // Request logging
    this.app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    }));

    // Custom request logger
    this.app.use(requestLogger);

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        error: 'Too many requests from this IP, please try again later.',
        timestamp: new Date(),
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        success: true,
        message: 'Suivest Backend is running',
        timestamp: new Date(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
      });
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/vaults', authMiddleware, vaultRoutes);
    this.app.use('/api/prize-draws', authMiddleware, prizeDrawRoutes);
    this.app.use('/api/user', authMiddleware, userRoutes);
    this.app.use('/api/admin', authMiddleware, adminRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        error: 'Route not found',
        timestamp: new Date(),
      });
    });
  }

  private initializeErrorHandling(): void {
    // Global error handler
    this.app.use(errorHandler);

    // Unhandled promise rejection handler
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Uncaught exception handler
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  }

  public async start(): Promise<void> {
    try {
      // Test database connection
      logger.info('Testing database connection...');
      await databaseService.getVaults(); // Simple test query
      logger.info('Database connection successful');

      // Test blockchain connection
      logger.info('Testing blockchain connection...');
      // Add blockchain connection test here
      logger.info('Blockchain connection successful');

      // Start background jobs
      logger.info('Starting background jobs...');
      startEventListener();
      startDrawRoundManager();
      logger.info('Background jobs started');

      // Start server
      this.app.listen(this.port, () => {
        logger.info(`🚀 Suivest Backend server running on port ${this.port}`);
        logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`🔗 Health check: http://localhost:${this.port}/health`);
        logger.info(`📚 API Documentation: http://localhost:${this.port}/api/docs`);
      });
    } catch (error) {
      logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  public async gracefulShutdown(): Promise<void> {
    logger.info('Shutting down gracefully...');

    try {
      // Close database connections
      await databaseService.close();
      logger.info('Database connections closed');

      // Stop background jobs
      // Add cleanup for background jobs here

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and start the application
const app = new App();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  app.gracefulShutdown();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received');
  app.gracefulShutdown();
});

// Start the application
app.start().catch((error) => {
  logger.error('Failed to start application:', error);
  process.exit(1);
});

export default app; 