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
