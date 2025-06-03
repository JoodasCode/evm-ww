-- WALLET WHISPERER SCHEMA UPDATE - WALLET-FIRST AUTHENTICATION
-- Run this in your Supabase SQL Editor to adapt the schema for wallet-only authentication

-- ===============================================
-- 1. MODIFY WALLET_PROFILES TABLE
-- ===============================================

-- Add standalone_wallet flag to indicate wallets that aren't linked to Google accounts
ALTER TABLE IF EXISTS wallet_profiles 
ADD COLUMN IF NOT EXISTS standalone_wallet BOOLEAN DEFAULT TRUE;

-- Add display_name field to wallet_profiles for wallet-only users
ALTER TABLE IF EXISTS wallet_profiles 
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Add avatar_seed for generating consistent avatars for wallet addresses
ALTER TABLE IF EXISTS wallet_profiles 
ADD COLUMN IF NOT EXISTS avatar_seed TEXT;

-- Add preferences JSONB field for wallet-specific settings
ALTER TABLE IF EXISTS wallet_profiles 
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- ===============================================
-- 2. MODIFY USER_ACTIVITY TABLE
-- ===============================================

-- Ensure wallet_address is properly indexed for wallet-first queries
DROP INDEX IF EXISTS idx_user_activity_wallet_address;
CREATE INDEX idx_user_activity_wallet_address ON user_activity(wallet_address);

-- Add blockchain_type to activity for better filtering
ALTER TABLE IF EXISTS user_activity
ADD COLUMN IF NOT EXISTS blockchain_type TEXT DEFAULT 'evm';

-- ===============================================
-- 3. UPDATE RLS POLICIES FOR WALLET-FIRST ACCESS
-- ===============================================

-- Allow wallet-only authentication to view profiles by wallet address
CREATE POLICY "Wallet addresses can view their own profiles"
  ON public.wallet_profiles FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Allow wallet-only authentication to update their own profiles
CREATE POLICY "Wallet addresses can update their own profiles"
  ON public.wallet_profiles FOR UPDATE
  USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- Allow wallet-only authentication to view their activity
CREATE POLICY "Wallet addresses can view their own activity"
  ON public.user_activity FOR SELECT
  USING (wallet_address = current_setting('request.jwt.claims')::json->>'wallet_address');

-- ===============================================
-- 4. CREATE FUNCTION TO GENERATE WALLET PROFILE ON FIRST AUTH
-- ===============================================

-- Function to create or update wallet profile when authenticating
CREATE OR REPLACE FUNCTION public.handle_wallet_auth(
  p_wallet_address TEXT,
  p_blockchain_type TEXT DEFAULT 'evm'
)
RETURNS UUID AS $$
DECLARE
  v_profile_id UUID;
  v_display_name TEXT;
BEGIN
  -- Set search_path to prevent SQL injection
  SET search_path TO public;
  -- Generate a simple display name from the wallet address
  v_display_name := 'Wallet ' || SUBSTRING(p_wallet_address FROM 1 FOR 4) || '...' || SUBSTRING(p_wallet_address FROM LENGTH(p_wallet_address)-3);
  
  -- Check if wallet profile exists
  SELECT id INTO v_profile_id FROM public.wallet_profiles 
  WHERE wallet_address = LOWER(p_wallet_address) AND blockchain_type = p_blockchain_type;
  
  IF v_profile_id IS NULL THEN
    -- Create new wallet profile
    INSERT INTO public.wallet_profiles (
      wallet_address, 
      blockchain_type, 
      is_primary,
      is_verified,
      standalone_wallet,
      display_name,
      avatar_seed
    ) VALUES (
      LOWER(p_wallet_address),
      p_blockchain_type,
      TRUE,
      TRUE,
      TRUE,
      v_display_name,
      encode(digest(LOWER(p_wallet_address), 'sha256'), 'hex')
    )
    RETURNING id INTO v_profile_id;
    
    -- Log first wallet connection
    INSERT INTO public.user_activity (
      wallet_address,
      blockchain_type,
      activity_type,
      details
    ) VALUES (
      LOWER(p_wallet_address),
      p_blockchain_type,
      'WALLET_FIRST_CONNECT',
      jsonb_build_object('success', true)
    );
  ELSE
    -- Update existing wallet profile
    UPDATE public.wallet_profiles
    SET last_updated = NOW()
    WHERE id = v_profile_id;
  END IF;
  
  RETURN v_profile_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 5. CREATE HELPER FUNCTIONS FOR WALLET-FIRST FLOW
-- ===============================================

-- Function to check if a wallet is premium
CREATE OR REPLACE FUNCTION public.is_wallet_premium(p_wallet_address TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_is_premium BOOLEAN;
  v_user_id UUID;
BEGIN
  -- Set search_path to prevent SQL injection
  SET search_path TO public;
  -- First check if wallet is linked to a premium user
  SELECT user_id INTO v_user_id FROM public.wallet_profiles
  WHERE wallet_address = LOWER(p_wallet_address);
  
  IF v_user_id IS NOT NULL THEN
    SELECT is_premium INTO v_is_premium FROM public.user_profiles
    WHERE id = v_user_id;
    
    IF v_is_premium THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Then check if the wallet itself has premium status in preferences
  SELECT (preferences->>'is_premium')::BOOLEAN INTO v_is_premium
  FROM public.wallet_profiles
  WHERE wallet_address = LOWER(p_wallet_address);
  
  RETURN COALESCE(v_is_premium, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===============================================
-- 6. CREATE FUNCTION TO HANDLE NEW USER CREATION
-- ===============================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set search_path to prevent SQL injection
  SET search_path TO public;
  
  -- Create a user profile for the new auth user
  INSERT INTO public.user_profiles (id, is_premium)
  VALUES (NEW.id, FALSE);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===============================================
-- 7. CLEANUP EXISTING DATA (OPTIONAL)
-- ===============================================

-- Update existing wallet profiles to be standalone
UPDATE wallet_profiles
SET standalone_wallet = (user_id IS NULL),
    display_name = CASE 
      WHEN display_name IS NULL THEN 'Wallet ' || SUBSTRING(wallet_address FROM 1 FOR 4) || '...' || SUBSTRING(wallet_address FROM LENGTH(wallet_address)-3)
      ELSE display_name
    END,
    avatar_seed = COALESCE(avatar_seed, encode(digest(LOWER(wallet_address), 'sha256'), 'hex'));
