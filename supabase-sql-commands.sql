-- Run these commands in your Supabase SQL Editor to add token categorization support

-- 1. Create token_metadata table for storing token info with categories
CREATE TABLE token_metadata (
  id SERIAL PRIMARY KEY,
  mint_address TEXT UNIQUE NOT NULL,
  name TEXT,
  symbol TEXT,
  decimals INTEGER,
  logo_uri TEXT,
  source TEXT,
  metadata JSONB,
  primary_category TEXT,
  secondary_categories TEXT[],
  category_confidence DECIMAL(3,2),
  category_source TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create wallet_narratives table for trading narrative analysis
CREATE TABLE wallet_narratives (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  dominant_narrative TEXT,
  narrative_diversity INTEGER,
  narrative_loyalty JSONB,
  category_stats JSONB,
  analyzed_transactions INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create token_transfers table for detailed transaction analysis
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create token_prices table for price data
CREATE TABLE token_prices (
  id SERIAL PRIMARY KEY,
  mint_address TEXT NOT NULL,
  price_usd DECIMAL,
  source TEXT,
  timestamp TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Add indexes for better performance
CREATE INDEX idx_token_metadata_mint ON token_metadata(mint_address);
CREATE INDEX idx_token_metadata_category ON token_metadata(primary_category);
CREATE INDEX idx_wallet_narratives_address ON wallet_narratives(wallet_address);
CREATE INDEX idx_token_transfers_wallet ON token_transfers(wallet_address);
CREATE INDEX idx_token_transfers_mint ON token_transfers(mint_address);