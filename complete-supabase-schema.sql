-- COMPLETE WALLET WHISPERER SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor

-- ===============================================
-- 1. USER AUTHENTICATION & SESSIONS
-- ===============================================

-- User accounts and wallet connections
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet ownership and verification
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  network TEXT DEFAULT 'solana',
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_signature TEXT,
  nickname TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, wallet_address)
);

-- Session tracking
CREATE TABLE IF NOT EXISTS wallet_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  session_id TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  login_method TEXT DEFAULT 'wallet_connect',
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 2. CORE WALLET ANALYSIS
-- ===============================================

-- Primary wallet scoring
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

-- Behavioral analysis and psychology
CREATE TABLE IF NOT EXISTS wallet_behavior (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  fomo_score INTEGER CHECK (fomo_score >= 0 AND fomo_score <= 100),
  patience_score INTEGER CHECK (patience_score >= 0 AND patience_score <= 100),
  conviction_score INTEGER CHECK (conviction_score >= 0 AND conviction_score <= 100),
  archetype TEXT,
  confidence DECIMAL(3,2),
  emotional_states TEXT[],
  behavioral_traits TEXT[],
  trading_frequency TEXT,
  avg_transaction_value DECIMAL(15,2),
  risk_tolerance TEXT,
  market_timing TEXT,
  diversification_style TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. TRANSACTION & TRADING DATA
-- ===============================================

-- Raw transaction storage
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  signature TEXT UNIQUE NOT NULL,
  block_time TIMESTAMP WITH TIME ZONE,
  transaction_type TEXT,
  amount DECIMAL(20,8),
  token_symbol TEXT,
  token_mint_address TEXT,
  transaction_fee DECIMAL(10,8),
  status TEXT DEFAULT 'confirmed',
  raw_data JSONB,
  enriched_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading patterns and metrics
CREATE TABLE IF NOT EXISTS trading_patterns (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  avg_hold_time DECIMAL(10,2),
  trade_frequency TEXT,
  preferred_trade_size TEXT,
  time_preference TEXT,
  volatility_preference TEXT,
  diversification_score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance tracking
CREATE TABLE IF NOT EXISTS performance_metrics (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  time_period TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  total_return_percentage DECIMAL(10,4),
  win_rate DECIMAL(5,2),
  sharpe_ratio DECIMAL(8,4),
  max_drawdown DECIMAL(5,2),
  volatility DECIMAL(8,4),
  best_trade_return DECIMAL(10,4),
  worst_trade_return DECIMAL(10,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, time_period, end_date)
);

-- ===============================================
-- 4. TOKEN & NARRATIVE ANALYSIS
-- ===============================================

-- Token categorization
CREATE TABLE IF NOT EXISTS token_categories (
  id SERIAL PRIMARY KEY,
  mint_address TEXT UNIQUE NOT NULL,
  symbol TEXT,
  name TEXT,
  primary_category TEXT,
  secondary_categories TEXT[],
  category_confidence DECIMAL(3,2),
  narrative_tags TEXT[],
  risk_level TEXT,
  market_cap_tier TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token holdings
CREATE TABLE IF NOT EXISTS token_holders (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  amount DECIMAL(20,8),
  usd_value DECIMAL(15,2),
  percentage_of_portfolio DECIMAL(5,2),
  first_acquired TIMESTAMP WITH TIME ZONE,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, mint_address)
);

-- Trading narratives
CREATE TABLE IF NOT EXISTS trading_narratives (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  dominant_narrative TEXT,
  narrative_confidence DECIMAL(3,2),
  secondary_narratives TEXT[],
  narrative_evolution JSONB,
  last_narrative_shift TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. SOCIAL & INFLUENCE TRACKING
-- ===============================================

-- Wallet connections and influence
CREATE TABLE IF NOT EXISTS wallet_connections (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  connected_wallet TEXT NOT NULL,
  connection_strength DECIMAL(3,2),
  connection_type TEXT,
  shared_tokens INTEGER DEFAULT 0,
  transaction_overlap INTEGER DEFAULT 0,
  influence_direction TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, connected_wallet)
);

-- Social metrics
CREATE TABLE IF NOT EXISTS social_metrics (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  influence_rank INTEGER,
  social_score INTEGER,
  trendsetter_score DECIMAL(5,2),
  copy_trading_followers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 6. LABELS & PSYCHOLOGY ENGINE
-- ===============================================

-- Wallet labeling system
CREATE TABLE IF NOT EXISTS wallet_labels (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  label_type TEXT NOT NULL,
  label_value TEXT NOT NULL,
  confidence DECIMAL(3,2),
  data_source TEXT,
  context_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  INDEX(wallet_address, label_type)
);

-- Behavioral tags
CREATE TABLE IF NOT EXISTS wallet_behavior_tags (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  tag TEXT NOT NULL,
  tag_category TEXT,
  strength DECIMAL(3,2),
  evidence_count INTEGER DEFAULT 1,
  last_reinforced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, tag)
);

-- ===============================================
-- 7. ACTIVITY & ENGAGEMENT TRACKING
-- ===============================================

-- Wallet activity logs
CREATE TABLE IF NOT EXISTS wallet_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Network activity
CREATE TABLE IF NOT EXISTS wallet_network (
  id SERIAL PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  network TEXT DEFAULT 'solana',
  first_transaction TIMESTAMP WITH TIME ZONE,
  last_transaction TIMESTAMP WITH TIME ZONE,
  total_volume DECIMAL(20,8),
  unique_protocols INTEGER DEFAULT 0,
  defi_protocols TEXT[],
  nft_activity BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 8. VIEWS FOR COMMON QUERIES
-- ===============================================

-- Complete wallet overview
CREATE OR REPLACE VIEW wallet_overview AS
SELECT 
    ws.wallet_address,
    ws.whisperer_score,
    ws.degen_score,
    ws.portfolio_value,
    wb.archetype,
    wb.risk_score,
    tn.dominant_narrative,
    tp.avg_hold_time,
    tp.trade_frequency,
    pm.total_return_percentage,
    pm.win_rate
FROM wallet_scores ws
LEFT JOIN wallet_behavior wb ON ws.wallet_address = wb.wallet_address
LEFT JOIN trading_narratives tn ON ws.wallet_address = tn.wallet_address
LEFT JOIN trading_patterns tp ON ws.wallet_address = tp.wallet_address
LEFT JOIN performance_metrics pm ON ws.wallet_address = pm.wallet_address 
    AND pm.time_period = '30d'
    AND pm.end_date = CURRENT_DATE;

-- ===============================================
-- 9. INDEXES FOR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_wallet_scores_address ON wallet_scores(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_behavior_address ON wallet_behavior(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_address ON wallet_transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_signature ON wallet_transactions(signature);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_block_time ON wallet_transactions(block_time);
CREATE INDEX IF NOT EXISTS idx_token_holders_wallet ON token_holders(wallet_address);
CREATE INDEX IF NOT EXISTS idx_token_holders_mint ON token_holders(mint_address);
CREATE INDEX IF NOT EXISTS idx_wallet_labels_address_type ON wallet_labels(wallet_address, label_type);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_address ON wallet_activity(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_activity_timestamp ON wallet_activity(timestamp);