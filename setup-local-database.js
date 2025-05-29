// Setup local database for Wallet Whisperer with direct connection
import pkg from 'pg';
const { Pool } = pkg;

// Use environment variable for database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function setupWalletWhispererDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🗄️ Setting up Wallet Whisperer database...');
    
    // Create core tables for wallet analysis
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_scores (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        whisperer_score INTEGER CHECK (whisperer_score >= 0 AND whisperer_score <= 100),
        degen_score INTEGER CHECK (degen_score >= 0 AND degen_score <= 100),
        roi_score INTEGER CHECK (roi_score >= 0 AND roi_score <= 100),
        influence_score INTEGER CHECK (influence_score >= 0 AND influence_score <= 100),
        timing_score INTEGER CHECK (timing_score >= 0 AND timing_score <= 100),
        portfolio_value DECIMAL(20,8),
        total_transactions INTEGER DEFAULT 0,
        data_sources TEXT[] DEFAULT ARRAY['helius', 'moralis', 'gecko_terminal'],
        enriched_data_points INTEGER DEFAULT 0,
        last_analyzed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Behavioral analysis table
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_behavior (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
        fomo_score INTEGER CHECK (fomo_score >= 0 AND fomo_score <= 100),
        patience_score INTEGER CHECK (patience_score >= 0 AND patience_score <= 100),
        conviction_score INTEGER CHECK (conviction_score >= 0 AND conviction_score <= 100),
        impulse_control_score INTEGER CHECK (impulse_control_score >= 0 AND impulse_control_score <= 100),
        archetype TEXT,
        confidence DECIMAL(3,2) CHECK (confidence >= 0 AND confidence <= 1),
        emotional_states TEXT[],
        behavioral_traits TEXT[],
        trading_style TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Token metadata with categorization
    await client.query(`
      CREATE TABLE IF NOT EXISTS token_metadata (
        id SERIAL PRIMARY KEY,
        mint_address TEXT UNIQUE NOT NULL,
        name TEXT,
        symbol TEXT,
        decimals INTEGER,
        logo_uri TEXT,
        description TEXT,
        source TEXT,
        metadata JSONB,
        primary_category TEXT,
        secondary_categories TEXT[],
        category_confidence DECIMAL(3,2),
        category_source TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Wallet narratives for trading psychology
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_narratives (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT UNIQUE NOT NULL,
        dominant_narrative TEXT,
        narrative_diversity INTEGER,
        narrative_loyalty JSONB,
        category_stats JSONB,
        analyzed_transactions INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Raw transaction data
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_trades (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        signature TEXT NOT NULL,
        block_time TIMESTAMP WITH TIME ZONE,
        transaction_type TEXT,
        data_sources TEXT,
        enriched BOOLEAN DEFAULT FALSE,
        raw_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Token transfers for detailed analysis
    await client.query(`
      CREATE TABLE IF NOT EXISTS token_transfers (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        signature TEXT NOT NULL,
        mint_address TEXT NOT NULL,
        token_amount DECIMAL(20,8),
        price_usd DECIMAL(20,8),
        usd_value DECIMAL(20,2),
        from_address TEXT,
        to_address TEXT,
        transfer_type TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // SOL transfers
    await client.query(`
      CREATE TABLE IF NOT EXISTS sol_transfers (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        signature TEXT NOT NULL,
        amount_sol DECIMAL(20,9),
        from_address TEXT,
        to_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Token prices
    await client.query(`
      CREATE TABLE IF NOT EXISTS token_prices (
        id SERIAL PRIMARY KEY,
        mint_address TEXT NOT NULL,
        price_usd DECIMAL(20,8),
        source TEXT,
        timestamp TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    
    // Wallet logins
    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_logins (
        id SERIAL PRIMARY KEY,
        wallet_address TEXT NOT NULL,
        logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        session_id TEXT,
        user_agent TEXT,
        ip_address TEXT
      );
    `);
    
    // Create indexes for performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_wallet_scores_address ON wallet_scores(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_wallet_behavior_address ON wallet_behavior(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_token_metadata_mint ON token_metadata(mint_address);
      CREATE INDEX IF NOT EXISTS idx_token_metadata_category ON token_metadata(primary_category);
      CREATE INDEX IF NOT EXISTS idx_wallet_narratives_address ON wallet_narratives(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_wallet_trades_address ON wallet_trades(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_token_transfers_wallet ON token_transfers(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_token_transfers_mint ON token_transfers(mint_address);
      CREATE INDEX IF NOT EXISTS idx_sol_transfers_wallet ON sol_transfers(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_token_prices_mint ON token_prices(mint_address);
      CREATE INDEX IF NOT EXISTS idx_wallet_logins_address ON wallet_logins(wallet_address);
    `);
    
    console.log('✅ Database setup complete!');
    console.log('📊 Created tables:');
    console.log('  - wallet_scores (core metrics)');
    console.log('  - wallet_behavior (psychology)');
    console.log('  - token_metadata (categorization)');
    console.log('  - wallet_narratives (trading insights)');
    console.log('  - wallet_trades (raw transactions)');
    console.log('  - token_transfers (detailed transfers)');
    console.log('  - sol_transfers (SOL movements)');
    console.log('  - token_prices (price data)');
    console.log('  - wallet_logins (sessions)');
    console.log('🚀 Ready for token categorization and behavioral analysis!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
  } finally {
    client.release();
  }
}

// Run setup
setupWalletWhispererDatabase().catch(console.error);