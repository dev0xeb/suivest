#!/usr/bin/env tsx

import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const NETWORK = process.env.SUI_NETWORK || 'testnet';
const PACKAGE_NAME = 'suivest_noloss_vaults';
const ADMIN_ADDRESS = process.env.ADMIN_ADDRESS || '';
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS || '';
const ORACLE_ADDRESS = process.env.ORACLE_ADDRESS || '';

// Initialize Sui client
const client = new SuiClient({ url: getFullnodeUrl(NETWORK) });

// Initialize keypair (in production, use proper key management)
const keypair = new Ed25519Keypair();
const sender = keypair.getPublicKey().toSuiAddress();

console.log(`🚀 Deploying Suivest to ${NETWORK.toUpperCase()}`);
console.log(`📦 Package: ${PACKAGE_NAME}`);
console.log(`👤 Sender: ${sender}`);
console.log(`🔧 Admin: ${ADMIN_ADDRESS || sender}`);
console.log(`💰 Treasury: ${TREASURY_ADDRESS || sender}`);
console.log(`🔮 Oracle: ${ORACLE_ADDRESS || sender}`);

async function buildPackage(): Promise<string> {
    console.log('\n📦 Building package...');
    
    try {
        // Build the package
        execSync('sui move build', { 
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });
        
        // Get the built package path
        const buildPath = path.join(__dirname, '../build', PACKAGE_NAME);
        if (!fs.existsSync(buildPath)) {
            throw new Error(`Build directory not found: ${buildPath}`);
        }
        
        console.log('✅ Package built successfully');
        return buildPath;
    } catch (error) {
        console.error('❌ Build failed:', error);
        throw error;
    }
}

async function deployPackage(buildPath: string): Promise<string> {
    console.log('\n🚀 Deploying package...');
    
    try {
        const tx = new TransactionBlock();
        
        // Publish the package
        const [upgradeCap] = tx.publish({
            modules: [
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/errors.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/events.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/types.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/vault.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/vrf.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/yield_adapter.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/prize_manager.mv')),
                fs.readFileSync(path.join(buildPath, 'bytecode_modules/pool_factory.mv')),
            ],
            dependencies: [
                '0x2', // Sui framework
            ],
        });
        
        // Transfer upgrade capability to admin
        tx.transferObjects([upgradeCap], tx.pure(ADMIN_ADDRESS || sender));
        
        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        
        if (result.effects?.status.status === 'success') {
            const packageId = result.objectChanges?.find(
                change => change.type === 'published'
            )?.packageId;
            
            if (packageId) {
                console.log(`✅ Package deployed successfully: ${packageId}`);
                return packageId;
            } else {
                throw new Error('Package ID not found in transaction result');
            }
        } else {
            throw new Error(`Deployment failed: ${result.effects?.status.error}`);
        }
    } catch (error) {
        console.error('❌ Deployment failed:', error);
        throw error;
    }
}

async function initializeSystem(packageId: string): Promise<void> {
    console.log('\n🔧 Initializing system...');
    
    try {
        const tx = new TransactionBlock();
        
        // Get clock object
        const clock = tx.object('0x6');
        
        // Initialize VRF registry
        const [vrfRegistry, oracleCap] = tx.moveCall({
            target: `${packageId}::vrf::init_vrf_registry`,
            arguments: [
                tx.pure(ORACLE_ADDRESS || sender), // oracle_address
                tx.pure(1), // min_confirmations
                tx.pure(3600000), // request_timeout (1 hour)
            ],
        });
        
        // Initialize prize manager
        const [prizeManager, prizeManagerCap] = tx.moveCall({
            target: `${packageId}::prize_manager::new`,
            arguments: [
                tx.pure(ADMIN_ADDRESS || sender), // admin
                tx.pure(TREASURY_ADDRESS || sender), // treasury
                vrfRegistry, // vrf_registry
                clock, // clock
            ],
        });
        
        // Initialize registries
        const tokenRegistry = tx.moveCall({
            target: `${packageId}::types::new_token_registry`,
        });
        
        const userRegistry = tx.moveCall({
            target: `${packageId}::types::new_user_registry`,
        });
        
        const roundRegistry = tx.moveCall({
            target: `${packageId}::types::new_round_registry`,
        });
        
        // Initialize pool factory
        const [factory, factoryCap] = tx.moveCall({
            target: `${packageId}::pool_factory::new`,
            arguments: [
                tx.pure(ADMIN_ADDRESS || sender), // admin
                tx.pure(TREASURY_ADDRESS || sender), // treasury
                tokenRegistry, // token_registry
                userRegistry, // user_registry
                roundRegistry, // round_registry
                vrfRegistry, // vrf_registry
                prizeManager, // prize_manager
                clock, // clock
            ],
        });
        
        // Initialize with default tokens
        tx.moveCall({
            target: `${packageId}::pool_factory::initialize_with_default_tokens`,
            arguments: [factory],
        });
        
        // Transfer capabilities to admin
        tx.transferObjects([oracleCap, prizeManagerCap, factoryCap], tx.pure(ADMIN_ADDRESS || sender));
        
        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        
        if (result.effects?.status.status === 'success') {
            console.log('✅ System initialized successfully');
            
            // Extract object IDs from transaction
            const objectChanges = result.objectChanges || [];
            const vrfRegistryId = objectChanges.find(
                change => change.type === 'created' && change.objectType?.includes('vrf::VRFRegistry')
            )?.objectId;
            
            const prizeManagerId = objectChanges.find(
                change => change.type === 'created' && change.objectType?.includes('prize_manager::PrizeManager')
            )?.objectId;
            
            const factoryId = objectChanges.find(
                change => change.type === 'created' && change.objectType?.includes('pool_factory::PoolFactory')
            )?.objectId;
            
            console.log('\n📋 Deployment Summary:');
            console.log(`Package ID: ${packageId}`);
            console.log(`VRF Registry: ${vrfRegistryId}`);
            console.log(`Prize Manager: ${prizeManagerId}`);
            console.log(`Pool Factory: ${factoryId}`);
            
            // Save deployment info
            const deploymentInfo = {
                network: NETWORK,
                packageId,
                vrfRegistryId,
                prizeManagerId,
                factoryId,
                adminAddress: ADMIN_ADDRESS || sender,
                treasuryAddress: TREASURY_ADDRESS || sender,
                oracleAddress: ORACLE_ADDRESS || sender,
                deployedAt: new Date().toISOString(),
            };
            
            fs.writeFileSync(
                path.join(__dirname, '../deployment.json'),
                JSON.stringify(deploymentInfo, null, 2)
            );
            
            console.log('\n💾 Deployment info saved to deployment.json');
        } else {
            throw new Error(`Initialization failed: ${result.effects?.status.error}`);
        }
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        throw error;
    }
}

async function createInitialVaults(packageId: string): Promise<void> {
    console.log('\n🏦 Creating initial vaults...');
    
    try {
        const tx = new TransactionBlock();
        
        // Create vaults for supported tokens
        const supportedTokens = [
            { symbol: 'SUI', address: '0x2::sui::SUI' },
            { symbol: 'USDC', address: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::USDC' },
            { symbol: 'suiUSDC', address: '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::SUIUSDC' },
            { symbol: 'WALRUS', address: '0x1234567890abcdef::walrus::WALRUS' },
            { symbol: 'DEEP', address: '0xabcdef1234567890::deep::DEEP' },
        ];
        
        for (const token of supportedTokens) {
            console.log(`Creating vault for ${token.symbol}...`);
            
            // Create vault
            tx.moveCall({
                target: `${packageId}::pool_factory::create_vault`,
                arguments: [
                    tx.object('FACTORY_ID'), // factory (will be replaced with actual ID)
                    tx.pure(token.address), // token_type
                    tx.pure(ADMIN_ADDRESS || sender), // admin
                ],
            });
            
            // Create yield adapter
            tx.moveCall({
                target: `${packageId}::pool_factory::create_yield_adapter`,
                arguments: [
                    tx.object('FACTORY_ID'), // factory (will be replaced with actual ID)
                    tx.pure(token.address), // token_type
                ],
            });
        }
        
        const result = await client.signAndExecuteTransactionBlock({
            signer: keypair,
            transactionBlock: tx,
            options: {
                showEffects: true,
                showObjectChanges: true,
            },
        });
        
        if (result.effects?.status.status === 'success') {
            console.log('✅ Initial vaults created successfully');
        } else {
            throw new Error(`Vault creation failed: ${result.effects?.status.error}`);
        }
    } catch (error) {
        console.error('❌ Vault creation failed:', error);
        throw error;
    }
}

async function runTests(): Promise<void> {
    console.log('\n🧪 Running tests...');
    
    try {
        execSync('sui move test', { 
            cwd: path.join(__dirname, '..'),
            stdio: 'inherit'
        });
        console.log('✅ All tests passed');
    } catch (error) {
        console.error('❌ Tests failed:', error);
        throw error;
    }
}

async function main(): Promise<void> {
    try {
        // Validate environment
        if (!ADMIN_ADDRESS && !TREASURY_ADDRESS && !ORACLE_ADDRESS) {
            console.log('⚠️  No admin/treasury/oracle addresses provided, using sender address');
        }
        
        // Run tests first
        await runTests();
        
        // Build package
        const buildPath = await buildPackage();
        
        // Deploy package
        const packageId = await deployPackage(buildPath);
        
        // Initialize system
        await initializeSystem(packageId);
        
        // Create initial vaults (commented out for now as it requires actual factory ID)
        // await createInitialVaults(packageId);
        
        console.log('\n🎉 Deployment completed successfully!');
        console.log('\n📚 Next steps:');
        console.log('1. Fund the admin account with SUI for gas fees');
        console.log('2. Create initial vaults using the factory');
        console.log('3. Configure yield strategies');
        console.log('4. Start the first lottery round');
        
    } catch (error) {
        console.error('\n💥 Deployment failed:', error);
        process.exit(1);
    }
}

// Run deployment
if (require.main === module) {
    main().catch(console.error);
}

export { main as deploy }; 