# Suivest Smart Contracts

A decentralized no-loss lottery vault system built on Sui blockchain, supporting multiple tokens with yield generation and fair prize distribution.

## 🏗️ Architecture

### Core Components

1. **Vault** (`vault.move`) - Main lottery vault for each token type
2. **VRF** (`vrf.move`) - Verifiable Random Function for fair winner selection
3. **Yield Adapter** (`yield_adapter.move`) - Yield generation strategies
4. **Prize Manager** (`prize_manager.move`) - Coordinates multiple vaults and prize distribution
5. **Pool Factory** (`pool_factory.move`) - Factory for creating and managing vaults
6. **Types** (`types.move`) - Shared data structures and constants
7. **Events** (`events.move`) - Event definitions for tracking
8. **Errors** (`errors.move`) - Error codes and constants

### Supported Tokens

- **SUI** - Native Sui token
- **USDC** - USD Coin
- **suiUSDC** - Sui USDC
- **WALRUS** - Walrus token
- **DEEP** - Deep token

## 🚀 Features

### Core Functionality
- ✅ **No-loss deposits** - Users keep their principal
- ✅ **Weekly lottery rounds** - Automated prize distribution
- ✅ **Multiple token support** - 5 supported tokens
- ✅ **Yield generation** - Simulated yield strategies
- ✅ **Fair randomness** - VRF-based winner selection
- ✅ **Streak tracking** - User participation rewards
- ✅ **Admin controls** - Pause/unpause, configuration updates

### Security Features
- ✅ **Reentrancy protection** - Prevents reentrancy attacks
- ✅ **Input validation** - Comprehensive parameter checks
- ✅ **Access control** - Admin-only functions
- ✅ **Emergency pause** - Quick response to issues
- ✅ **Rate limiting** - Prevents spam attacks

### Prize Distribution
- 🥇 **1st Place**: 50% of prize pool
- 🥈 **2nd Place**: 30% of prize pool  
- 🥉 **3rd Place**: 20% of prize pool

## 📦 Installation

### Prerequisites
- [Sui CLI](https://docs.sui.io/build/install) v1.0+
- Node.js v18+
- TypeScript

### Setup
```bash
# Clone repository
git clone <repository-url>
cd suivestSmartContract

# Install dependencies
npm install

# Build contracts
sui move build

# Run tests
sui move test
```

## 🚀 Deployment

### Environment Variables
```bash
export SUI_NETWORK=testnet
export ADMIN_ADDRESS=0x...
export TREASURY_ADDRESS=0x...
export ORACLE_ADDRESS=0x...
```

### Deploy to Testnet
```bash
# Run deployment script
npm run deploy:testnet

# Or manually
sui client publish --gas-budget 100000000
```

### Deploy to Mainnet
```bash
# Set network to mainnet
export SUI_NETWORK=mainnet

# Run deployment
npm run deploy:mainnet
```

## 📋 Usage

### Creating a Vault
```typescript
import { TransactionBlock } from '@mysten/sui.js/transactions';

const tx = new TransactionBlock();

// Create vault for SUI
tx.moveCall({
    target: `${PACKAGE_ID}::pool_factory::create_vault`,
    arguments: [
        tx.object(FACTORY_ID),
        tx.pure('0x2::sui::SUI'),
        tx.pure(ADMIN_ADDRESS),
    ],
});
```

### Depositing Tokens
```typescript
const tx = new TransactionBlock();

// Deposit SUI into vault
tx.moveCall({
    target: `${PACKAGE_ID}::vault::deposit`,
    arguments: [
        tx.object(VAULT_ID),
        tx.object(SUI_COIN_ID),
    ],
});
```

### Starting a Round
```typescript
const tx = new TransactionBlock();

// Start new lottery round
tx.moveCall({
    target: `${PACKAGE_ID}::vault::start_round`,
    arguments: [
        tx.object(VAULT_ID),
        tx.object(ADMIN_CAP_ID),
    ],
});
```

### Claiming Prizes
```typescript
const tx = new TransactionBlock();

// Claim prize if winner
tx.moveCall({
    target: `${PACKAGE_ID}::vault::claim_prize`,
    arguments: [
        tx.object(VAULT_ID),
    ],
});
```

## 🧪 Testing

### Run All Tests
```bash
sui move test
```

### Run Specific Tests
```bash
# Test vault functionality
sui move test --filter test_vault

# Test VRF functionality  
sui move test --filter test_vrf

# Test yield generation
sui move test --filter test_yield
```

### Test Coverage
```bash
# Generate coverage report
sui move test --coverage
```

## 🔧 Configuration

### Vault Configuration
```move
pub struct VaultConfig {
    pub admin: address,
    pub treasury: address,
    pub round_duration: u64, // seconds
    pub min_deposit: u64,
    pub max_deposit: u64,
    pub withdrawal_cooldown: u64, // seconds
    pub max_participants: u64,
    pub prize_distribution: vector<u8>, // [50, 30, 20]
    pub yield_fee_percentage: u64, // basis points
    pub is_paused: bool,
}
```

### Default Values
- **Round Duration**: 1 week (604,800 seconds)
- **Min Deposit**: 0.001 tokens
- **Max Deposit**: 1,000,000 tokens
- **Withdrawal Cooldown**: 1 day (86,400 seconds)
- **Max Participants**: 10,000
- **Yield Fee**: 5% (500 basis points)

## 🔒 Security

### Access Control
- **Admin Functions**: Only callable by admin address
- **Oracle Functions**: Only callable by authorized oracle
- **Treasury Functions**: Only callable by treasury address

### Emergency Controls
- **Pause/Unpause**: Admin can pause all operations
- **Emergency Withdraw**: Admin can trigger emergency withdrawals
- **Configuration Updates**: Admin can update parameters

### Reentrancy Protection
All state-changing functions use reentrancy guards to prevent attacks.

## 📊 Events

### Core Events
- `Deposited` - User deposits tokens
- `Withdrawn` - User withdraws tokens
- `RoundStarted` - New lottery round begins
- `RoundEnded` - Round ends with winners selected
- `PrizeClaimed` - Winner claims prize
- `YieldHarvested` - Yield generated and distributed

### Admin Events
- `VaultPaused` - Vault paused/unpaused
- `AdminAction` - Admin function called
- `EmergencyAction` - Emergency action taken

## 🔄 Upgradeability

The system is designed to be upgradeable:
- **Package Upgrade**: Admin can upgrade the entire package
- **Strategy Updates**: Yield strategies can be updated
- **VRF Integration**: Can be upgraded to use real VRF services

## 📈 Yield Strategies

### Current Strategies
1. **Conservative** - 3% APY, Low risk
2. **Moderate** - 8% APY, Balanced risk
3. **Aggressive** - 15% APY, High risk

### Future Integrations
- Navi Protocol
- Cetus Protocol
- Turbos Finance
- Other DeFi protocols

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Core vault functionality
- ✅ Basic yield simulation
- ✅ Mock VRF implementation
- ✅ Multi-token support

### Phase 2 (Next)
- 🔄 Real VRF integration (Pyth Network)
- 🔄 Actual yield strategies
- 🔄 Advanced analytics
- 🔄 Governance mechanisms

### Phase 3 (Future)
- 🔄 Cross-chain bridges
- 🔄 Layer 2 scaling
- 🔄 Advanced DeFi integrations
- 🔄 DAO governance

## 🤝 Contributing

### Development Setup
```bash
# Fork repository
git clone <your-fork>
cd suivestSmartContract

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
sui move test

# Submit pull request
```

### Code Standards
- Follow Move coding conventions
- Add comprehensive tests
- Include documentation
- Use proper error handling

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- [Sui Move Book](https://move-book.com/)
- [Sui Documentation](https://docs.sui.io/)
- [Move Language Reference](https://move-language.github.io/move/)

### Community
- [Discord](https://discord.gg/sui)
- [Telegram](https://t.me/sui_network)
- [Twitter](https://twitter.com/SuiNetwork)

### Issues
Report bugs and feature requests on GitHub Issues.

## ⚠️ Disclaimer

This software is provided "as is" without warranty. Use at your own risk. The developers are not responsible for any financial losses.

---

**Built with ❤️ on Sui** 