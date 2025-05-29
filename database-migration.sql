-- Database migration to support token categorization and narrative analysis
-- Run this to update the schema for the new psychological analysis features

-- 1. Update token_metadata table to include categorization
ALTER TABLE token_metadata 
ADD COLUMN IF NOT EXISTS primary_category TEXT,
ADD COLUMN IF NOT EXISTS secondary_categories TEXT[],
ADD COLUMN IF NOT EXISTS category_confidence DECIMAL(3,2),
ADD COLUMN IF NOT EXISTS category_source TEXT;

-- 2. Create wallet_narratives table for trading narrative analysis
CREATE TABLE IF NOT EXISTS wallet_narratives (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  dominant_narrative TEXT,
  narrative_diversity INTEGER,
  narrative_loyalty JSONB,
  category_stats JSONB,
  analyzed_transactions INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address)
);

-- 3. Create token_transfers table if it doesn't exist (for detailed analysis)
CREATE TABLE IF NOT EXISTS token_transfers (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  token_amount DECIMAL,
  price_usd DECIMAL,
  usd_value DECIMAL,
  from_address TEXT,
  to_address TEXT,
  transfer_type TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create sol_transfers table if it doesn't exist
CREATE TABLE IF NOT EXISTS sol_transfers (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  amount_sol DECIMAL,
  from_address TEXT,
  to_address TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create token_prices table if it doesn't exist
CREATE TABLE IF NOT EXISTS token_prices (
  id SERIAL PRIMARY KEY,
  mint_address TEXT NOT NULL,
  price_usd DECIMAL,
  source TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create wallet_behavior table if it doesn't exist
CREATE TABLE IF NOT EXISTS wallet_behavior (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  risk_score INTEGER,
  fomo_score INTEGER,
  patience_score INTEGER,
  conviction_score INTEGER,
  archetype TEXT,
  confidence DECIMAL(3,2),
  emotional_states TEXT[],
  behavioral_traits TEXT[],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address)
);

-- 7. Create wallet_logins table if it doesn't exist
CREATE TABLE IF NOT EXISTS wallet_logins (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- 8. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_token_metadata_mint ON token_metadata(mint_address);
CREATE INDEX IF NOT EXISTS idx_token_metadata_category ON token_metadata(primary_category);
CREATE INDEX IF NOT EXISTS idx_wallet_narratives_address ON wallet_narratives(wallet_address);
CREATE INDEX IF NOT EXISTS idx_token_transfers_wallet ON token_transfers(wallet_address);
CREATE INDEX IF NOT EXISTS idx_token_transfers_mint ON token_transfers(mint_address);
CREATE INDEX IF NOT EXISTS idx_wallet_behavior_address ON wallet_behavior(wallet_address);

-- 9. Update wallet_scores to include enriched data tracking
ALTER TABLE wallet_scores 
ADD COLUMN IF NOT EXISTS data_sources TEXT DEFAULT 'helius_moralis_gecko',
ADD COLUMN IF NOT EXISTS enriched_data_points INTEGER DEFAULT 0;

COMMENT ON TABLE wallet_narratives IS 'Stores token category analysis and trading narrative insights';
COMMENT ON TABLE token_transfers IS 'Detailed token transfer data for behavioral analysis';
COMMENT ON COLUMN token_metadata.primary_category IS 'Main token category (Meme, Utility, Infra, etc.)';
COMMENT ON COLUMN token_metadata.secondary_categories IS 'Additional category tags (Animal, AI, DEX, etc.)';