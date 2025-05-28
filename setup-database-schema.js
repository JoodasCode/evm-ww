import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function setupDatabase() {
  console.log('🚀 Setting up database schema for Wallet Whisperer...');

  const schemas = [
    // Profiles table for user wallet data
    `CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      preferences JSONB DEFAULT '{}'::jsonb
    );`,

    // Wallet analytics for behavioral insights
    `CREATE TABLE IF NOT EXISTS wallet_analytics (
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
    );`,

    // Transaction history for real trading data
    `CREATE TABLE IF NOT EXISTS transaction_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address TEXT NOT NULL,
      signature TEXT UNIQUE NOT NULL,
      block_time TIMESTAMP WITH TIME ZONE,
      transaction_data JSONB NOT NULL,
      enriched_data JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Token metadata cache
    `CREATE TABLE IF NOT EXISTS token_metadata (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token_address TEXT UNIQUE NOT NULL,
      name TEXT,
      symbol TEXT,
      decimals INTEGER,
      logo_url TEXT,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Indexes for performance
    `CREATE INDEX IF NOT EXISTS idx_wallet_analytics_address ON wallet_analytics(wallet_address);`,
    `CREATE INDEX IF NOT EXISTS idx_transaction_history_address ON transaction_history(wallet_address);`,
    `CREATE INDEX IF NOT EXISTS idx_transaction_history_signature ON transaction_history(signature);`
  ];

  for (const schema of schemas) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: schema });
      if (error) {
        console.error('Error executing schema:', error.message);
      } else {
        console.log('✅ Schema executed successfully');
      }
    } catch (error) {
      console.error('Schema error:', error.message);
    }
  }

  console.log('🎉 Database setup complete!');
}

setupDatabase();