-- Add a policy to allow public read access to wallet_profiles
CREATE POLICY "Allow public read access to wallet_profiles"
  ON public.wallet_profiles FOR SELECT
  USING (true);

-- Add a policy to allow public read access to user_activity
CREATE POLICY "Allow public read access to user_activity"
  ON public.user_activity FOR SELECT
  USING (true);
