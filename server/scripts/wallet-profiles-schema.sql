-- Fresh Wallet Whisperer Schema
-- Created: 2025-06-02

-- ===============================
-- WALLET PROFILES TABLE
-- ===============================
CREATE TABLE wallet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  blockchain_type TEXT NOT NULL DEFAULT 'evm',
  is_primary BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verification_signature TEXT,
  first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  standalone_wallet BOOLEAN NOT NULL DEFAULT true,
  display_name TEXT,
  avatar_seed TEXT,
  preferences JSONB DEFAULT '{}'
);

-- Performance indexes
CREATE INDEX idx_wallet_address ON wallet_profiles(wallet_address);
CREATE INDEX idx_blockchain_type ON wallet_profiles(blockchain_type);

-- Auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_wallet_profile_last_updated()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_profile_last_updated_trigger
BEFORE UPDATE ON wallet_profiles
FOR EACH ROW
EXECUTE FUNCTION update_wallet_profile_last_updated();

-- ===============================
-- ACTIVITY LOGS TABLE
-- ===============================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT NOT NULL,
  wallet_profile_id UUID REFERENCES wallet_profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  blockchain_type TEXT DEFAULT 'evm'
);

-- Performance indexes
CREATE INDEX idx_activity_wallet ON activity_logs(wallet_address);
CREATE INDEX idx_activity_type ON activity_logs(activity_type);
CREATE INDEX idx_activity_timestamp ON activity_logs(timestamp);

-- ===============================
-- SECURITY POLICIES
-- ===============================

-- Enable RLS on both tables
ALTER TABLE wallet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Wallet Profiles Policies
CREATE POLICY "Anyone can view wallet profiles"
ON wallet_profiles FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert wallet profiles"
ON wallet_profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update wallet profiles"
ON wallet_profiles FOR UPDATE
USING (true);

-- Activity Logs Policies
CREATE POLICY "Anyone can view activity logs"
ON activity_logs FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert activity logs"
ON activity_logs FOR INSERT
WITH CHECK (true);

-- ===============================
-- PERMISSIONS
-- ===============================

-- Grant permissions to roles
GRANT SELECT, INSERT, UPDATE ON wallet_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE ON wallet_profiles TO anon;
GRANT ALL ON wallet_profiles TO service_role;

GRANT SELECT, INSERT ON activity_logs TO authenticated;
GRANT SELECT, INSERT ON activity_logs TO anon;
GRANT ALL ON activity_logs TO service_role;
