-- SQL Script to fix wallet_profiles table schema
-- Run this in the Supabase SQL Editor

-- 1. Add proper constraints to wallet_address
ALTER TABLE wallet_profiles 
ADD CONSTRAINT wallet_address_unique UNIQUE (wallet_address);

-- 2. Add NOT NULL constraints to required fields
ALTER TABLE wallet_profiles 
ALTER COLUMN wallet_address SET NOT NULL,
ALTER COLUMN blockchain_type SET NOT NULL,
ALTER COLUMN is_verified SET NOT NULL;

-- 3. Add proper defaults for boolean fields and timestamps
ALTER TABLE wallet_profiles 
ALTER COLUMN is_primary SET DEFAULT false,
ALTER COLUMN standalone_wallet SET DEFAULT true,
ALTER COLUMN first_seen SET DEFAULT now(),
ALTER COLUMN last_updated SET DEFAULT now();

-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS wallet_profiles_wallet_address_idx 
ON wallet_profiles (wallet_address);

CREATE INDEX IF NOT EXISTS wallet_profiles_blockchain_type_idx 
ON wallet_profiles (blockchain_type);

-- 5. Add a trigger to update last_updated automatically
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

-- 6. Fix the user_id column to properly relate to user_profiles
-- First, check if user_profiles table exists
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
    -- Make sure user_id column is the right type
    ALTER TABLE wallet_profiles 
    ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
    
    -- Add foreign key constraint if it doesn't exist
    IF NOT EXISTS (
      SELECT FROM information_schema.table_constraints 
      WHERE constraint_name = 'wallet_profiles_user_id_fkey'
    ) THEN
      ALTER TABLE wallet_profiles
      ADD CONSTRAINT wallet_profiles_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES user_profiles(id);
    END IF;
  END IF;
END $$;
