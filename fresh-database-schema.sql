-- Fresh Database Schema for Wallet Whisperer with Token Categorization
-- This replaces the existing schema with a clean, optimized structure

-- Drop existing tables if you want a fresh start
-- DROP TABLE IF EXISTS wallet_activity, wallet_behavior, wallet_behavior_tags, wallet_connections, wallet_holdings, wallet_label_history, wallet_labels, wallet_logins, wallet_network, wallet_scores, wallet_trades CASCADE;

-- 1. Core wallet analysis data
CREATE TABLE wallet_scores (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  whisperer_score INTEGER,
  degen_score INTEGER,
  roi_score INTEGER,
  influence_score INTEGER,
  timing_score INTEGER,
  data_sources TEXT DEFAULT 'helius_moralis_gecko',
  enriched_data_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Behavioral analysis and psychology
CREATE TABLE wallet_behavior (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  risk_score INTEGER,
  fomo_score INTEGER,
  patience_score INTEGER,
  conviction_score INTEGER,
  archetype TEXT,
  confidence DECIMAL(3,2),
  emotional_states TEXT[],
  behavioral_traits TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Token metadata with categorization
CREATE TABLE token_metadata (
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

-- 4. Trading narrative analysis
CREATE TABLE wallet_narratives (
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

-- 5. Raw transaction data
CREATE TABLE wallet_trades (
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

-- 6. Detailed token transfers
CREATE TABLE token_transfers (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SOL transfers
CREATE TABLE sol_transfers (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  amount_sol DECIMAL,
  from_address TEXT,
  to_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Token price data
CREATE TABLE token_prices (
  id SERIAL PRIMARY KEY,
  mint_address TEXT NOT NULL,
  price_usd DECIMAL,
  source TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Wallet login tracking
CREATE TABLE wallet_logins (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  logged_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  user_agent TEXT,
  ip_address TEXT
);

-- Performance indexes
CREATE INDEX idx_wallet_scores_address ON wallet_scores(wallet_address);
CREATE INDEX idx_wallet_behavior_address ON wallet_behavior(wallet_address);
CREATE INDEX idx_token_metadata_mint ON token_metadata(mint_address);
CREATE INDEX idx_token_metadata_category ON token_metadata(primary_category);
CREATE INDEX idx_wallet_narratives_address ON wallet_narratives(wallet_address);
CREATE INDEX idx_wallet_trades_address ON wallet_trades(wallet_address);
CREATE INDEX idx_wallet_trades_signature ON wallet_trades(signature);
CREATE INDEX idx_token_transfers_wallet ON token_transfers(wallet_address);
CREATE INDEX idx_token_transfers_mint ON token_transfers(mint_address);
CREATE INDEX idx_sol_transfers_wallet ON sol_transfers(wallet_address);
CREATE INDEX idx_token_prices_mint ON token_prices(mint_address);
CREATE INDEX idx_wallet_logins_address ON wallet_logins(wallet_address);

-- Table comments
COMMENT ON TABLE wallet_scores IS 'Core wallet scoring and analysis metrics';
COMMENT ON TABLE wallet_behavior IS 'Psychological and behavioral analysis data';
COMMENT ON TABLE token_metadata IS 'Token information with categorization for narrative analysis';
COMMENT ON TABLE wallet_narratives IS 'Trading narrative insights and token category analysis';
COMMENT ON TABLE wallet_trades IS 'Raw transaction data from Helius API';
COMMENT ON TABLE token_transfers IS 'Detailed token transfer data for behavioral analysis';
COMMENT ON TABLE sol_transfers IS 'SOL transfer data';
COMMENT ON TABLE token_prices IS 'Token price data from Gecko Terminal';
COMMENT ON TABLE wallet_logins IS 'Wallet connection and session tracking';