-- COMPLETE WALLET WHISPERER DATABASE SCHEMA
-- This creates the entire infrastructure needed for comprehensive wallet analysis

-- ===============================================
-- 1. USER AUTHENTICATION & SESSIONS
-- ===============================================

-- User accounts and wallet connections
CREATE TABLE users (
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
CREATE TABLE user_wallets (
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
CREATE TABLE wallet_sessions (
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
-- 2. WALLET SCORING & ANALYSIS
-- ===============================================

-- Core wallet metrics and scores
CREATE TABLE wallet_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Behavioral psychology analysis
CREATE TABLE wallet_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  stress_indicators JSONB,
  cognitive_biases TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Advanced psychological profiles
CREATE TABLE psychological_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  personality_type TEXT,
  risk_tolerance TEXT,
  decision_making_style TEXT,
  emotional_stability DECIMAL(3,2),
  market_timing_ability DECIMAL(3,2),
  social_influence_susceptibility DECIMAL(3,2),
  loss_aversion_level DECIMAL(3,2),
  overconfidence_bias DECIMAL(3,2),
  anchoring_bias DECIMAL(3,2),
  confirmation_bias DECIMAL(3,2),
  psychological_insights JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 3. TOKEN DATA & CATEGORIZATION
-- ===============================================

-- Complete token metadata with categorization
CREATE TABLE tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address TEXT UNIQUE NOT NULL,
  name TEXT,
  symbol TEXT,
  decimals INTEGER,
  total_supply BIGINT,
  logo_uri TEXT,
  description TEXT,
  website TEXT,
  twitter TEXT,
  telegram TEXT,
  coingecko_id TEXT,
  coinmarketcap_id TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_scam BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token categorization and classification
CREATE TABLE token_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address TEXT NOT NULL REFERENCES tokens(mint_address) ON DELETE CASCADE,
  primary_category TEXT NOT NULL,
  secondary_categories TEXT[],
  category_confidence DECIMAL(3,2) CHECK (category_confidence >= 0 AND category_confidence <= 1),
  category_source TEXT DEFAULT 'automated',
  classification_algorithm TEXT,
  manual_override BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  risk_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time token prices
CREATE TABLE token_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address TEXT NOT NULL,
  price_usd DECIMAL(20,8),
  price_sol DECIMAL(20,8),
  market_cap DECIMAL(20,2),
  volume_24h DECIMAL(20,2),
  price_change_24h DECIMAL(8,4),
  fdv DECIMAL(20,2),
  liquidity DECIMAL(20,2),
  source TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token holders and distribution
CREATE TABLE token_holders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address TEXT NOT NULL,
  holder_address TEXT NOT NULL,
  balance DECIMAL(20,8),
  percentage_of_supply DECIMAL(8,6),
  is_whale BOOLEAN DEFAULT FALSE,
  first_acquired_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(mint_address, holder_address)
);

-- ===============================================
-- 4. TRANSACTION DATA & ANALYSIS
-- ===============================================

-- Raw transaction data from blockchain
CREATE TABLE wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  signature TEXT UNIQUE NOT NULL,
  block_time TIMESTAMP WITH TIME ZONE,
  slot BIGINT,
  fee_lamports BIGINT,
  transaction_type TEXT,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  data_sources TEXT[] DEFAULT ARRAY['helius'],
  raw_data JSONB,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detailed token transfers
CREATE TABLE token_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  token_amount DECIMAL(20,8),
  token_amount_raw BIGINT,
  decimals INTEGER,
  price_usd DECIMAL(20,8),
  usd_value DECIMAL(20,2),
  from_address TEXT,
  to_address TEXT,
  transfer_type TEXT,
  instruction_type TEXT,
  program_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SOL transfers and fees
CREATE TABLE sol_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  signature TEXT NOT NULL,
  amount_lamports BIGINT,
  amount_sol DECIMAL(20,9),
  usd_value DECIMAL(20,2),
  from_address TEXT,
  to_address TEXT,
  transfer_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DeFi protocol interactions
CREATE TABLE defi_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  protocol_name TEXT,
  protocol_type TEXT,
  action_type TEXT,
  input_tokens JSONB,
  output_tokens JSONB,
  fees_paid DECIMAL(20,8),
  slippage DECIMAL(8,4),
  mev_protection BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- NFT transactions
CREATE TABLE nft_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  nft_mint TEXT NOT NULL,
  collection_address TEXT,
  action_type TEXT,
  price_sol DECIMAL(20,9),
  price_usd DECIMAL(20,2),
  marketplace TEXT,
  royalties_paid DECIMAL(20,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 5. TRADING PATTERNS & NARRATIVE ANALYSIS
-- ===============================================

-- Trading narrative and category analysis
CREATE TABLE trading_narratives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  dominant_narrative TEXT,
  narrative_diversity INTEGER,
  narrative_loyalty JSONB,
  category_breakdown JSONB,
  conviction_by_category JSONB,
  narrative_shifts JSONB,
  analyzed_transactions INTEGER DEFAULT 0,
  analysis_period_start TIMESTAMP WITH TIME ZONE,
  analysis_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trading patterns and habits
CREATE TABLE trading_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  avg_hold_time INTERVAL,
  avg_position_size DECIMAL(20,8),
  position_size_variance DECIMAL(8,4),
  trade_frequency DECIMAL(8,4),
  trade_frequency_variance DECIMAL(8,4),
  preferred_trading_hours INTEGER[],
  preferred_trading_days INTEGER[],
  seasonal_patterns JSONB,
  momentum_trading_score DECIMAL(3,2),
  contrarian_trading_score DECIMAL(3,2),
  copy_trading_score DECIMAL(3,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Position sizing psychology
CREATE TABLE position_sizing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  position_size DECIMAL(20,8),
  position_size_usd DECIMAL(20,2),
  portfolio_percentage DECIMAL(8,4),
  conviction_level TEXT,
  sizing_rationale TEXT,
  max_position_size DECIMAL(20,8),
  avg_add_size DECIMAL(20,8),
  number_of_adds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, mint_address)
);

-- Exit strategies and timing
CREATE TABLE exit_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  entry_price DECIMAL(20,8),
  exit_price DECIMAL(20,8),
  hold_duration INTERVAL,
  exit_reason TEXT,
  profit_loss_percentage DECIMAL(8,4),
  exit_timing_score DECIMAL(3,2),
  was_stop_loss BOOLEAN DEFAULT FALSE,
  was_take_profit BOOLEAN DEFAULT FALSE,
  was_panic_sell BOOLEAN DEFAULT FALSE,
  market_sentiment_at_exit TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 6. SOCIAL & NETWORK ANALYSIS
-- ===============================================

-- Wallet relationships and copying
CREATE TABLE wallet_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_address TEXT NOT NULL,
  followed_address TEXT NOT NULL,
  relationship_type TEXT,
  copy_frequency DECIMAL(3,2),
  copy_timing_lag INTERVAL,
  influence_score DECIMAL(3,2),
  detected_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_address, followed_address)
);

-- MEV and front-running analysis
CREATE TABLE mev_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  transaction_id UUID REFERENCES wallet_transactions(id) ON DELETE CASCADE,
  mev_type TEXT,
  mev_protection_used BOOLEAN DEFAULT FALSE,
  frontrun_victim BOOLEAN DEFAULT FALSE,
  sandwich_attack_victim BOOLEAN DEFAULT FALSE,
  estimated_mev_loss DECIMAL(20,8),
  protection_fee_paid DECIMAL(20,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Influencer tracking
CREATE TABLE influencer_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  influencer_name TEXT,
  platform TEXT,
  follow_delay INTERVAL,
  copy_accuracy DECIMAL(3,2),
  profit_from_copies DECIMAL(20,2),
  times_copied INTEGER DEFAULT 0,
  last_copy_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 7. PERFORMANCE & ANALYTICS
-- ===============================================

-- Portfolio snapshots
CREATE TABLE portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  snapshot_date DATE NOT NULL,
  total_value_usd DECIMAL(20,2),
  total_value_sol DECIMAL(20,9),
  token_count INTEGER,
  top_5_holdings JSONB,
  diversification_score DECIMAL(3,2),
  risk_score DECIMAL(3,2),
  yield_bearing_percentage DECIMAL(5,2),
  stablecoin_percentage DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, snapshot_date)
);

-- Performance metrics
CREATE TABLE performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  time_period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_return_percentage DECIMAL(8,4),
  annualized_return DECIMAL(8,4),
  volatility DECIMAL(8,4),
  sharpe_ratio DECIMAL(8,4),
  max_drawdown DECIMAL(8,4),
  win_rate DECIMAL(5,2),
  avg_win_percentage DECIMAL(8,4),
  avg_loss_percentage DECIMAL(8,4),
  profit_factor DECIMAL(8,4),
  total_trades INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, time_period, start_date, end_date)
);

-- Risk metrics
CREATE TABLE risk_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  var_95 DECIMAL(8,4),
  var_99 DECIMAL(8,4),
  expected_shortfall DECIMAL(8,4),
  concentration_risk DECIMAL(3,2),
  liquidity_risk DECIMAL(3,2),
  counterparty_risk DECIMAL(3,2),
  smart_contract_risk DECIMAL(3,2),
  regulatory_risk DECIMAL(3,2),
  correlation_with_market DECIMAL(3,2),
  beta DECIMAL(8,4),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address)
);

-- ===============================================
-- 8. CACHING & PERFORMANCE
-- ===============================================

-- API response caching
CREATE TABLE api_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  cache_value JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analysis job queue
CREATE TABLE analysis_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  job_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  priority INTEGER DEFAULT 1,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  result_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===============================================
-- 9. COMPREHENSIVE INDEXING
-- ===============================================

-- Primary indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_user_wallets_address ON user_wallets(wallet_address);
CREATE INDEX idx_wallet_sessions_address ON wallet_sessions(wallet_address);
CREATE INDEX idx_wallet_sessions_expires ON wallet_sessions(expires_at);

-- Scoring and behavior indexes
CREATE INDEX idx_wallet_scores_address ON wallet_scores(wallet_address);
CREATE INDEX idx_wallet_scores_analyzed ON wallet_scores(last_analyzed_at);
CREATE INDEX idx_wallet_behavior_address ON wallet_behavior(wallet_address);
CREATE INDEX idx_psychological_profiles_address ON psychological_profiles(wallet_address);

-- Token indexes
CREATE INDEX idx_tokens_mint ON tokens(mint_address);
CREATE INDEX idx_tokens_symbol ON tokens(symbol);
CREATE INDEX idx_token_categories_mint ON token_categories(mint_address);
CREATE INDEX idx_token_categories_primary ON token_categories(primary_category);
CREATE INDEX idx_token_prices_mint ON token_prices(mint_address);
CREATE INDEX idx_token_prices_timestamp ON token_prices(timestamp);
CREATE INDEX idx_token_holders_mint ON token_holders(mint_address);
CREATE INDEX idx_token_holders_address ON token_holders(holder_address);

-- Transaction indexes
CREATE INDEX idx_wallet_transactions_address ON wallet_transactions(wallet_address);
CREATE INDEX idx_wallet_transactions_signature ON wallet_transactions(signature);
CREATE INDEX idx_wallet_transactions_time ON wallet_transactions(block_time);
CREATE INDEX idx_token_transfers_wallet ON token_transfers(wallet_address);
CREATE INDEX idx_token_transfers_mint ON token_transfers(mint_address);
CREATE INDEX idx_token_transfers_signature ON token_transfers(signature);
CREATE INDEX idx_sol_transfers_wallet ON sol_transfers(wallet_address);
CREATE INDEX idx_defi_interactions_wallet ON defi_interactions(wallet_address);
CREATE INDEX idx_defi_interactions_protocol ON defi_interactions(protocol_name);
CREATE INDEX idx_nft_transactions_wallet ON nft_transactions(wallet_address);

-- Analysis indexes
CREATE INDEX idx_trading_narratives_address ON trading_narratives(wallet_address);
CREATE INDEX idx_trading_patterns_address ON trading_patterns(wallet_address);
CREATE INDEX idx_position_sizing_wallet ON position_sizing(wallet_address);
CREATE INDEX idx_exit_patterns_wallet ON exit_patterns(wallet_address);
CREATE INDEX idx_wallet_relationships_follower ON wallet_relationships(follower_address);
CREATE INDEX idx_wallet_relationships_followed ON wallet_relationships(followed_address);
CREATE INDEX idx_mev_analysis_wallet ON mev_analysis(wallet_address);
CREATE INDEX idx_influencer_tracking_wallet ON influencer_tracking(wallet_address);

-- Performance indexes
CREATE INDEX idx_portfolio_snapshots_wallet ON portfolio_snapshots(wallet_address);
CREATE INDEX idx_portfolio_snapshots_date ON portfolio_snapshots(snapshot_date);
CREATE INDEX idx_performance_metrics_wallet ON performance_metrics(wallet_address);
CREATE INDEX idx_risk_metrics_wallet ON risk_metrics(wallet_address);

-- Cache indexes
CREATE INDEX idx_api_cache_key ON api_cache(cache_key);
CREATE INDEX idx_api_cache_expires ON api_cache(expires_at);
CREATE INDEX idx_analysis_jobs_wallet ON analysis_jobs(wallet_address);
CREATE INDEX idx_analysis_jobs_status ON analysis_jobs(status);

-- ===============================================
-- 10. TRIGGERS & AUTOMATION
-- ===============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply timestamp triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_wallets_updated_at BEFORE UPDATE ON user_wallets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_scores_updated_at BEFORE UPDATE ON wallet_scores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_behavior_updated_at BEFORE UPDATE ON wallet_behavior FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_psychological_profiles_updated_at BEFORE UPDATE ON psychological_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tokens_updated_at BEFORE UPDATE ON tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_token_categories_updated_at BEFORE UPDATE ON token_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_narratives_updated_at BEFORE UPDATE ON trading_narratives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trading_patterns_updated_at BEFORE UPDATE ON trading_patterns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risk_metrics_updated_at BEFORE UPDATE ON risk_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- 11. VIEWS FOR COMMON QUERIES
-- ===============================================

-- Complete wallet overview
CREATE VIEW wallet_overview AS
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

-- Token category summary
CREATE VIEW token_category_summary AS
SELECT 
    tc.primary_category,
    COUNT(*) as token_count,
    AVG(tc.category_confidence) as avg_confidence,
    COUNT(DISTINCT th.holder_address) as unique_holders
FROM token_categories tc
LEFT JOIN token_holders th ON tc.mint_address = th.mint_address
GROUP BY tc.primary_category;

-- Table comments for documentation
COMMENT ON DATABASE postgres IS 'Wallet Whisperer - Comprehensive crypto wallet behavioral analysis platform';

-- Key table comments
COMMENT ON TABLE wallet_scores IS 'Core wallet scoring and analysis metrics';
COMMENT ON TABLE wallet_behavior IS 'Psychological and behavioral analysis data';
COMMENT ON TABLE psychological_profiles IS 'Deep psychological profiling and bias analysis';
COMMENT ON TABLE tokens IS 'Complete token metadata and information';
COMMENT ON TABLE token_categories IS 'Token categorization for narrative analysis';
COMMENT ON TABLE wallet_transactions IS 'Raw blockchain transaction data';
COMMENT ON TABLE trading_narratives IS 'Trading narrative insights and token category analysis';
COMMENT ON TABLE trading_patterns IS 'Behavioral trading pattern analysis';
COMMENT ON TABLE wallet_relationships IS 'Social trading and copy trading relationships';
COMMENT ON TABLE performance_metrics IS 'Historical performance and returns analysis';
COMMENT ON TABLE risk_metrics IS 'Comprehensive risk assessment metrics';