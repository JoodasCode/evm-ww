-- SQL to fix RLS policies for wallet-first authentication
-- Copy and paste this into the Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to wallet_profiles" ON public.wallet_profiles;
DROP POLICY IF EXISTS "Allow public read access to user_activity" ON public.user_activity;
DROP POLICY IF EXISTS "Allow public read access to user_profiles" ON public.user_profiles;

-- Create new policy for public read access to wallet_profiles
CREATE POLICY "Allow public read access to wallet_profiles"
  ON public.wallet_profiles FOR SELECT
  USING (true);

-- Create new policy for public read access to user_activity
CREATE POLICY "Allow public read access to user_activity"
  ON public.user_activity FOR SELECT
  USING (true);

-- Create new policy for public read access to user_profiles
CREATE POLICY "Allow public read access to user_profiles"
  ON public.user_profiles FOR SELECT
  USING (true);

-- Create a function to set JWT claims with wallet address
CREATE OR REPLACE FUNCTION public.set_claim(uid uuid, claim text, value jsonb)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = uid
  ) THEN
    RETURN 'User not found';
  END IF;

  UPDATE auth.users
  SET raw_app_meta_data = 
    raw_app_meta_data || 
    json_build_object(claim, value)::jsonb
  WHERE id = uid;
  
  RETURN 'OK';
END;
$$;

-- Create a function to set wallet address claim
CREATE OR REPLACE FUNCTION public.set_wallet_claim(uid uuid, wallet_address text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN public.set_claim(uid, 'wallet_address', to_jsonb(wallet_address));
END;
$$;

-- Create a trigger to update JWT claims when wallet profile is created or updated
CREATE OR REPLACE FUNCTION public.handle_wallet_profile_changes()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only proceed if user_id is not null
  IF NEW.user_id IS NOT NULL THEN
    -- Set wallet_address claim for the user
    PERFORM public.set_wallet_claim(NEW.user_id, NEW.wallet_address);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for wallet_profiles
DROP TRIGGER IF EXISTS on_wallet_profile_change ON public.wallet_profiles;
CREATE TRIGGER on_wallet_profile_change
  AFTER INSERT OR UPDATE ON public.wallet_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_wallet_profile_changes();

-- Test if the JWT secret is correctly set
SELECT current_setting('pgrst.jwt_secret', true) AS jwt_secret;
