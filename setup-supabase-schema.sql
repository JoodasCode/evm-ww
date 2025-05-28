-- Wallet Whisperer Database Schema
-- This creates all the necessary tables for storing wallet analytics and behavioral data

-- Users/Profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Wallet Analytics table
CREATE TABLE IF NOT EXISTS wallet_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    whisperer_score NUMERIC,
    behavioral_avatar TEXT,
    mood_state TEXT,
    degen_score NUMERIC,
    trading_activity JSONB DEFAULT '{}'::jsonb,
    label_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transaction History table
CREATE TABLE IF NOT EXISTS transaction_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    signature TEXT UNIQUE NOT NULL,
    block_time TIMESTAMP WITH TIME ZONE,
    transaction_data JSONB NOT NULL,
    enriched_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Token Metadata Cache table
CREATE TABLE IF NOT EXISTS token_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address TEXT UNIQUE NOT NULL,
    name TEXT,
    symbol TEXT,
    decimals INTEGER,
    logo_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Price History table
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_address TEXT NOT NULL,
    price_usd NUMERIC,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    source TEXT DEFAULT 'coingecko',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Behavioral Alerts table
CREATE TABLE IF NOT EXISTS behavioral_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address TEXT NOT NULL,
    alert_type TEXT NOT NULL,
    alert_data JSONB NOT NULL,
    triggered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    acknowledged BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_wallet_analytics_address ON wallet_analytics(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transaction_history_address ON transaction_history(wallet_address);
CREATE INDEX IF NOT EXISTS idx_transaction_history_signature ON transaction_history(signature);
CREATE INDEX IF NOT EXISTS idx_price_history_token_timestamp ON price_history(token_address, timestamp);
CREATE INDEX IF NOT EXISTS idx_behavioral_alerts_address ON behavioral_alerts(wallet_address);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wallet_analytics_updated_at BEFORE UPDATE ON wallet_analytics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_token_metadata_updated_at BEFORE UPDATE ON token_metadata FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();