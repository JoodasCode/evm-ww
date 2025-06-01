-- WALLET WHISPERER SUPABASE CLEANUP SCRIPT
-- Run this in your Supabase SQL Editor BEFORE running the setup script
-- WARNING: This will permanently delete data from the specified tables

-- ===============================================
-- DISABLE TRIGGERS TEMPORARILY
-- ===============================================

-- Disable RLS temporarily for cleanup
ALTER TABLE IF EXISTS public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_wallets DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_scores DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_behavior DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.trading_patterns DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.token_holders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_labels DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_behavior_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_activity DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.wallet_network DISABLE ROW LEVEL SECURITY;

-- ===============================================
-- DROP VIEWS
-- ===============================================

DROP VIEW IF EXISTS public.wallet_overview;

-- ===============================================
-- DROP TRIGGERS
-- ===============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ===============================================
-- DROP FUNCTIONS
-- ===============================================

DROP FUNCTION IF EXISTS public.handle_new_user();

-- ===============================================
-- DROP TABLES (in reverse dependency order)
-- ===============================================

-- Activity & Engagement Tracking
DROP TABLE IF EXISTS public.wallet_network;
DROP TABLE IF EXISTS public.wallet_activity;

-- Labels & Psychology Engine
DROP TABLE IF EXISTS public.wallet_behavior_tags;
DROP TABLE IF EXISTS public.wallet_labels;

-- Social Metrics
DROP TABLE IF EXISTS public.social_metrics;

-- Wallet Connections
DROP TABLE IF EXISTS public.wallet_connections;

-- Token Holdings
DROP TABLE IF EXISTS public.token_holders;

-- Trading Patterns
DROP TABLE IF EXISTS public.trading_patterns;
DROP TABLE IF EXISTS public.trading_narratives;
DROP TABLE IF EXISTS public.performance_metrics;

-- Transaction & Trading Data
DROP TABLE IF EXISTS public.wallet_transactions;

-- Core Wallet Analysis
DROP TABLE IF EXISTS public.wallet_behavior;
DROP TABLE IF EXISTS public.wallet_scores;

-- User Authentication & Sessions
DROP TABLE IF EXISTS public.wallet_sessions;
DROP TABLE IF EXISTS public.user_wallets;
DROP TABLE IF EXISTS public.users;

-- New schema tables (in case we need to recreate them)
DROP TABLE IF EXISTS public.user_activity;
DROP TABLE IF EXISTS public.wallet_profiles;
DROP TABLE IF EXISTS public.user_profiles;

-- ===============================================
-- DROP INDEXES
-- ===============================================

DROP INDEX IF EXISTS public.idx_wallet_scores_address;
DROP INDEX IF EXISTS public.idx_wallet_behavior_address;
DROP INDEX IF EXISTS public.idx_wallet_transactions_address;
DROP INDEX IF EXISTS public.idx_wallet_transactions_signature;
DROP INDEX IF EXISTS public.idx_wallet_transactions_block_time;
DROP INDEX IF EXISTS public.idx_token_holders_wallet;
DROP INDEX IF EXISTS public.idx_token_holders_mint;
DROP INDEX IF EXISTS public.idx_wallet_labels_address_type;
DROP INDEX IF EXISTS public.idx_wallet_activity_address;
DROP INDEX IF EXISTS public.idx_wallet_activity_timestamp;
DROP INDEX IF EXISTS public.idx_wallet_profiles_user_id;
DROP INDEX IF EXISTS public.idx_wallet_profiles_wallet_address;
DROP INDEX IF EXISTS public.idx_user_activity_user_id;
DROP INDEX IF EXISTS public.idx_user_activity_wallet_address;
DROP INDEX IF EXISTS public.idx_user_activity_timestamp;
DROP INDEX IF EXISTS public.idx_user_activity_type;

-- ===============================================
-- CONFIRM CLEANUP
-- ===============================================

SELECT 'Database cleanup complete. You can now run the setup script.' as status;
