-- SCHEMA ADDENDUM - Missing tables from previous implementation
-- Run this AFTER the main schema to add additional functionality

-- ===============================================
-- ADDITIONAL TABLES FROM PREVIOUS SCHEMA
-- ===============================================

-- Manual labeling system for wallets
CREATE TABLE wallet_labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  label TEXT NOT NULL,
  label_type TEXT DEFAULT 'manual',
  confidence DECIMAL(3,2) DEFAULT 1.0,
  source TEXT DEFAULT 'user',
  created_by TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Label change history for audit trail
CREATE TABLE wallet_label_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  old_label TEXT,
  new_label TEXT,
  change_reason TEXT,
  changed_by TEXT,
  change_type TEXT DEFAULT 'update',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavioral tags for categorizing trading patterns
CREATE TABLE wallet_behavior_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  tag_name TEXT NOT NULL,
  tag_category TEXT,
  tag_value TEXT,
  confidence DECIMAL(3,2),
  auto_generated BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, tag_name)
);

-- Current wallet holdings snapshot
CREATE TABLE wallet_holdings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  mint_address TEXT NOT NULL,
  token_account TEXT,
  balance DECIMAL(20,8),
  balance_usd DECIMAL(20,2),
  percentage_of_portfolio DECIMAL(5,2),
  avg_buy_price DECIMAL(20,8),
  unrealized_pnl DECIMAL(20,2),
  first_acquired_at TIMESTAMP WITH TIME ZONE,
  last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_staked BOOLEAN DEFAULT FALSE,
  yield_earning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, mint_address)
);

-- Wallet connection and relationship tracking
CREATE TABLE wallet_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  connected_address TEXT NOT NULL,
  connection_type TEXT,
  connection_strength DECIMAL(3,2),
  first_interaction_at TIMESTAMP WITH TIME ZONE,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  interaction_count INTEGER DEFAULT 0,
  total_value_exchanged DECIMAL(20,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, connected_address)
);

-- Network analysis for social trading patterns
CREATE TABLE wallet_network (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  network_type TEXT,
  network_data JSONB,
  centrality_score DECIMAL(8,4),
  influence_radius INTEGER,
  cluster_id TEXT,
  network_position TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, network_type)
);

-- ===============================================
-- INDEXES FOR NEW TABLES
-- ===============================================

CREATE INDEX idx_wallet_labels_address ON wallet_labels(wallet_address);
CREATE INDEX idx_wallet_labels_type ON wallet_labels(label_type);
CREATE INDEX idx_wallet_label_history_address ON wallet_label_history(wallet_address);
CREATE INDEX idx_wallet_behavior_tags_address ON wallet_behavior_tags(wallet_address);
CREATE INDEX idx_wallet_behavior_tags_category ON wallet_behavior_tags(tag_category);
CREATE INDEX idx_wallet_holdings_address ON wallet_holdings(wallet_address);
CREATE INDEX idx_wallet_holdings_mint ON wallet_holdings(mint_address);
CREATE INDEX idx_wallet_connections_address ON wallet_connections(wallet_address);
CREATE INDEX idx_wallet_connections_connected ON wallet_connections(connected_address);
CREATE INDEX idx_wallet_network_address ON wallet_network(wallet_address);
CREATE INDEX idx_wallet_network_type ON wallet_network(network_type);

-- ===============================================
-- ADDITIONAL TRIGGERS
-- ===============================================

CREATE TRIGGER update_wallet_labels_updated_at BEFORE UPDATE ON wallet_labels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_behavior_tags_updated_at BEFORE UPDATE ON wallet_behavior_tags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_holdings_updated_at BEFORE UPDATE ON wallet_holdings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_connections_updated_at BEFORE UPDATE ON wallet_connections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_network_updated_at BEFORE UPDATE ON wallet_network FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- ENHANCED VIEWS INCLUDING NEW TABLES
-- ===============================================

-- Complete wallet profile with all data
CREATE OR REPLACE VIEW complete_wallet_profile AS
SELECT 
    ws.wallet_address,
    ws.whisperer_score,
    ws.degen_score,
    ws.portfolio_value,
    wb.archetype,
    wb.risk_score,
    tn.dominant_narrative,
    tp.avg_hold_time,
    COUNT(wh.mint_address) as current_holdings_count,
    SUM(wh.balance_usd) as total_holdings_value,
    COUNT(wl.label) as manual_labels_count,
    COUNT(wbt.tag_name) as behavior_tags_count,
    COUNT(wc.connected_address) as connections_count
FROM wallet_scores ws
LEFT JOIN wallet_behavior wb ON ws.wallet_address = wb.wallet_address
LEFT JOIN trading_narratives tn ON ws.wallet_address = tn.wallet_address
LEFT JOIN trading_patterns tp ON ws.wallet_address = tp.wallet_address
LEFT JOIN wallet_holdings wh ON ws.wallet_address = wh.wallet_address
LEFT JOIN wallet_labels wl ON ws.wallet_address = wl.wallet_address AND wl.is_active = TRUE
LEFT JOIN wallet_behavior_tags wbt ON ws.wallet_address = wbt.wallet_address
LEFT JOIN wallet_connections wc ON ws.wallet_address = wc.wallet_address AND wc.is_active = TRUE
GROUP BY ws.wallet_address, ws.whisperer_score, ws.degen_score, ws.portfolio_value, 
         wb.archetype, wb.risk_score, tn.dominant_narrative, tp.avg_hold_time;

-- ===============================================
-- TABLE COMMENTS
-- ===============================================

COMMENT ON TABLE wallet_labels IS 'Manual and automated labeling system for wallet categorization';
COMMENT ON TABLE wallet_label_history IS 'Audit trail for label changes and updates';
COMMENT ON TABLE wallet_behavior_tags IS 'Granular behavioral tags for pattern recognition';
COMMENT ON TABLE wallet_holdings IS 'Current portfolio positions and holdings snapshot';
COMMENT ON TABLE wallet_connections IS 'Direct wallet-to-wallet relationship tracking';
COMMENT ON TABLE wallet_network IS 'Network analysis and social trading pattern data';