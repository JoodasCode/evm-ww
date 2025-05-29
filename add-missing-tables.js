// Add missing tables that weren't in the initial setup
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  ssl: { rejectUnauthorized: false }
});

async function addMissingTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Adding missing tables...');
    
    // Trading patterns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS trading_patterns (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        avg_hold_time INTERVAL,
        avg_position_size DECIMAL(20,8),
        position_size_variance DECIMAL(8,4),
        trade_frequency DECIMAL(8,4),
        preferred_trading_hours INTEGER[],
        momentum_trading_score DECIMAL(3,2),
        contrarian_trading_score DECIMAL(3,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Portfolio snapshots
    await client.query(`
      CREATE TABLE IF NOT EXISTS portfolio_snapshots (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        snapshot_date DATE NOT NULL,
        total_value_usd DECIMAL(20,2),
        total_value_sol DECIMAL(20,9),
        token_count INTEGER,
        top_5_holdings JSONB,
        diversification_score DECIMAL(3,2),
        risk_score DECIMAL(3,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(wallet_address, snapshot_date)
      );
    `);
    
    // Performance metrics
    await client.query(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        time_period TEXT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_return_percentage DECIMAL(8,4),
        win_rate DECIMAL(5,2),
        total_trades INTEGER,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(wallet_address, time_period, start_date, end_date)
      );
    `);
    
    // Wallet holdings for current positions
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_holdings (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        mint_address TEXT NOT NULL,
        balance DECIMAL(20,8),
        balance_usd DECIMAL(20,2),
        percentage_of_portfolio DECIMAL(5,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(wallet_address, mint_address)
      );
    `);
    
    // Add indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_trading_patterns_address ON trading_patterns(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_portfolio_snapshots_wallet ON portfolio_snapshots(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_performance_metrics_wallet ON performance_metrics(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_wallet_holdings_address ON wallet_holdings(wallet_address);
    `);
    
    // Add signature column to wallet_trades if missing
    await client.query(`
      ALTER TABLE wallet_trades 
      ADD COLUMN IF NOT EXISTS signature TEXT;
    `);
    
    // Create unique constraint on signature
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_wallet_trades_signature ON wallet_trades(signature);
    `);
    
    console.log('✅ Missing tables added successfully!');
    console.log('📊 Added tables:');
    console.log('  - trading_patterns');
    console.log('  - portfolio_snapshots');
    console.log('  - performance_metrics');
    console.log('  - wallet_holdings');
    
  } catch (error) {
    console.error('❌ Failed to add missing tables:', error);
  } finally {
    client.release();
  }
}

addMissingTables().catch(console.error);