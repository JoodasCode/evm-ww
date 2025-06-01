-- WALLET WHISPERER SUPABASE SCHEMA - AUTHENTICATION & ACTIVITY LOGGING
-- Run this in your Supabase SQL Editor

-- ===============================================
-- 1. USER AUTHENTICATION & WALLET PROFILES
-- ===============================================

-- User profiles extension table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  is_premium BOOLEAN DEFAULT FALSE,
  premium_expires_at TIMESTAMP WITH TIME ZONE,
  credits_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wallet profiles for linking wallets to users
CREATE TABLE IF NOT EXISTS wallet_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  blockchain_type TEXT DEFAULT 'evm',
  is_primary BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT TRUE,
  verification_signature TEXT,
  first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(wallet_address, blockchain_type)
);

-- ===============================================
-- 2. ACTIVITY LOGGING
-- ===============================================

-- User activity logs
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  wallet_address TEXT,
  activity_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT
);

-- ===============================================
-- 3. RLS POLICIES
-- ===============================================

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- User Profiles policies
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Wallet Profiles policies
CREATE POLICY "Users can view their own wallet profiles"
  ON wallet_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallet profiles"
  ON wallet_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet profiles"
  ON wallet_profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wallet profiles"
  ON wallet_profiles FOR DELETE
  USING (auth.uid() = user_id);

-- Activity logging policies
CREATE POLICY "Users can view their own activity"
  ON user_activity FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert activity logs"
  ON user_activity FOR INSERT
  WITH CHECK (true);

-- ===============================================
-- 4. FUNCTIONS & TRIGGERS
-- ===============================================

-- Create a trigger to create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- 5. INDEXES FOR PERFORMANCE
-- ===============================================

CREATE INDEX IF NOT EXISTS idx_wallet_profiles_user_id ON wallet_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_profiles_wallet_address ON wallet_profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_wallet_address ON user_activity(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_activity_timestamp ON user_activity(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
