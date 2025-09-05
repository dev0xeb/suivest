# Suivest Backend API

A comprehensive backend system for the Suivest no-loss savings vault platform, built with Node.js, TypeScript, and Express.js, designed to interact with Sui blockchain smart contracts.

## 🏗️ Architecture

### Tech Stack
- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Blockchain**: Sui SDK for smart contract interactions
- **Authentication**: JWT with wallet-based auth
- **Security**: Helmet, CORS, Rate limiting
- **Logging**: Winston
- **Testing**: Jest
- **Deployment**: Docker

### Core Components
1. **Authentication Service** - JWT-based auth with wallet signature verification
2. **Database Service** - PostgreSQL operations with Knex.js
3. **Blockchain Service** - Sui smart contract interactions
4. **API Controllers** - RESTful endpoints for all operations
5. **Background Jobs** - Event listening and round management
6. **Middleware** - Auth, validation, error handling

## 🚀 Features

### Core Functionality
- ✅ **Wallet Authentication** - Secure wallet-based login
- ✅ **User Management** - Registration, profiles, sessions
- ✅ **Savings Vault Operations** - Deposit, withdrawal, balance queries
- ✅ **Prize Draw Management** - Weekly draws from yield pool, winner selection
- ✅ **Streak Tracking** - User participation rewards
- ✅ **Event Monitoring** - Real-time blockchain event processing
- ✅ **Admin Controls** - Vault management, yield harvesting

### Security Features
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Rate Limiting** - API abuse prevention
- ✅ **Input Validation** - Comprehensive request validation
- ✅ **CORS Protection** - Cross-origin request security
- ✅ **Helmet Security** - HTTP header protection
- ✅ **SQL Injection Prevention** - Parameterized queries

### Monitoring & Logging
- ✅ **Structured Logging** - Winston-based logging
- ✅ **Request Tracking** - Request/response logging
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Health Checks** - Application health monitoring
- ✅ **Metrics** - Performance monitoring

## 📦 Installation

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- Docker (optional)
- Sui CLI (for blockchain interactions)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd suivestBackend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create database
   createdb suivest_dev
   
   # Run migrations
   npm run db:migrate
   
   # Seed data (optional)
   npm run db:seed
   ```

5. **Build the application**
   ```bash
   npm run build
   ```

6. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 🔧 Configuration

### Environment Variables

#### Required Variables
```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=suivest_dev
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Sui Blockchain
SUI_NETWORK=testnet
SUI_PACKAGE_ID=0x...
ADMIN_ADDRESS=0x...
ADMIN_PRIVATE_KEY=your-admin-private-key
```

#### Optional Variables
```bash
# Application
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
LOG_FILE=logs/suivest.log
```

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/login`
Authenticate user with wallet signature.

**Request:**
```json
{
  "wallet_address": "0x...",
  "signature": "signature_string",
  "message": "auth_message"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "wallet_address": "0x...",
      "email": "user@example.com"
    },
    "token": "jwt_token",
    "expires_at": "2024-01-01T00:00:00Z"
  }
}
```

#### POST `/api/auth/register`
Register new user.

**Request:**
```json
{
  "wallet_address": "0x...",
  "email": "user@example.com",
  "username": "username"
}
```

### Vault Endpoints

#### GET `/api/vaults`
Get all available vaults.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "token_type": "0x2::sui::SUI",
      "token_symbol": "SUI",
      "total_deposits": "1000000",
      "active_participants": 50
    }
  ]
}
```

#### POST `/api/vaults/:vaultId/deposit`
Deposit tokens into vault.

**Request:**
```json
{
  "amount": "1000000",
  "token_type": "0x2::sui::SUI"
}
```

#### POST `/api/vaults/:vaultId/withdraw`
Withdraw tokens from vault.

**Request:**
```json
{
  "tickets": "500000",
  "token_type": "0x2::sui::SUI"
}
```

### Prize Draw Endpoints

#### GET `/api/prize-draws/rounds/:vaultId`
Get current draw round information.

**Response:**
```json
{
  "success": true,
  "data": {
    "round_id": 1,
    "start_time": "2024-01-01T00:00:00Z",
    "end_time": "2024-01-08T00:00:00Z",
    "total_participants": 50,
    "total_tickets": "10000000",
    "prize_pool": "500000",
    "is_active": true,
    "time_remaining": 604800
  }
}
```

#### GET `/api/prize-draws/winners/:roundId`
Get winners for a specific draw round.

**Response:**
```json
{
  "success": true,
  "data": {
    "round_id": 1,
    "winners": [
      {
        "position": 1,
        "wallet_address": "0x...",
        "prize_amount": "250000",
        "has_claimed": false
      }
    ]
  }
}
```

### User Endpoints

#### GET `/api/user/profile`
Get user profile.

#### PUT `/api/user/profile`
Update user profile.

#### GET `/api/user/balance/:vaultId`
Get user balance for specific vault.

#### GET `/api/user/streak/:vaultId`
Get user streak information.

### Admin Endpoints

#### POST `/api/admin/vaults/:vaultId/start-draw`
Start a new prize draw round (admin only).

#### POST `/api/admin/vaults/:vaultId/end-draw`
End current draw round (admin only).

#### POST `/api/admin/vaults/:vaultId/harvest-yield`
Harvest yield from vault (admin only).

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── services/
│   ├── controllers/
│   └── middleware/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    └── blockchain/
```

## 🚀 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t suivest-backend .
   ```

2. **Run container**
   ```bash
   docker run -p 3000:3000 \
     -e DB_HOST=your-db-host \
     -e DB_PASSWORD=your-db-password \
     -e JWT_SECRET=your-jwt-secret \
     suivest-backend
   ```

### Docker Compose

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - DB_PASSWORD=password
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=suivest_prod
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Production Deployment

1. **Environment setup**
   ```bash
   NODE_ENV=production
   DB_SSL=true
   JWT_SECRET=your-production-secret
   ```

2. **Database migration**
   ```bash
   npm run db:migrate
   ```

3. **Start application**
   ```bash
   npm start
   ```

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

### Logs
```bash
# Application logs
tail -f logs/suivest.log

# Docker logs
docker logs suivest-backend
```

### Metrics
- Request rate
- Response times
- Error rates
- Database connection status
- Blockchain connection status

## 🔒 Security

### Best Practices
- Use strong JWT secrets
- Enable HTTPS in production
- Regular security updates
- Database connection encryption
- Rate limiting
- Input validation
- CORS configuration

### Security Headers
- Helmet.js for security headers
- CORS protection
- Rate limiting
- Request size limits

## 🤝 Contributing

### Development Setup
```bash
# Fork repository
git clone <your-fork>
cd suivestBackend

# Create feature branch
git checkout -b feature/your-feature

# Install dependencies
npm install

# Run tests
npm test

# Submit pull request
```

### Code Standards
- Follow TypeScript best practices
- Add comprehensive tests
- Include API documentation
- Use proper error handling
- Follow ESLint rules

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [Sui SDK Documentation](https://docs.sui.io/build/sui-typescript-sdk)
- [Knex.js Documentation](https://knexjs.org/)

### Community
- [Discord](https://discord.gg/sui)
- [Telegram](https://t.me/sui_network)
- [Twitter](https://twitter.com/SuiNetwork)

### Issues
Report bugs and feature requests on GitHub Issues.

## 💰 How Suivest Works

### No-Loss Savings Concept
1. **Deposit Savings** - Users deposit their savings into Suivest vaults
2. **Generate Yield** - Deposits are used in DeFi strategies to generate yield
3. **Prize Draws** - Weekly draws distribute yield as prizes to lucky participants
4. **No Risk** - Users never lose their principal deposits
5. **Keep Everything** - Non-winners keep their full deposits + earned yield

### Key Benefits
- **Principal Protection** - Your savings are never at risk
- **Yield Generation** - Earn returns through DeFi strategies
- **Prize Opportunities** - Chance to win additional yield as prizes
- **Transparent** - All operations on blockchain for full transparency

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. The developers are not responsible for any financial losses.

---

**Built with ❤️ for Suivest** 