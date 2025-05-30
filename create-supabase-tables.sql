-- Create wallet analysis tables in Supabase
CREATE TABLE IF NOT EXISTS wallet_scores (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  total_transactions INTEGER DEFAULT 0,
  whisperer_score DECIMAL(5,2) DEFAULT 0,
  risk_score DECIMAL(5,2) DEFAULT 0,
  fomo_score DECIMAL(5,2) DEFAULT 0,
  patience_score DECIMAL(5,2) DEFAULT 0,
  conviction_score DECIMAL(5,2) DEFAULT 0,
  last_analyzed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_behavior (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  archetype TEXT DEFAULT 'Unknown',
  confidence DECIMAL(5,2) DEFAULT 0,
  trading_frequency TEXT DEFAULT 'Unknown',
  avg_transaction_value DECIMAL(15,2) DEFAULT 0,
  risk_tolerance TEXT DEFAULT 'Unknown',
  market_timing TEXT DEFAULT 'Unknown',
  diversification_style TEXT DEFAULT 'Unknown',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  transaction_type TEXT,
  amount DECIMAL(20,8),
  token_symbol TEXT,
  timestamp TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);