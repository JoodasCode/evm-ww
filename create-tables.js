import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eHdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function createTables() {
  console.log('🚀 Creating tables for your wallet analytics platform...');

  const createTableSQL = `
    -- Profiles table for wallet users
    CREATE TABLE profiles (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      preferences JSONB DEFAULT '{}'::jsonb
    );

    -- Wallet analytics for behavioral scores and insights  
    CREATE TABLE wallet_analytics (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address TEXT NOT NULL,
      whisperer_score NUMERIC,
      behavioral_avatar TEXT,
      mood_state TEXT,
      degen_score NUMERIC,
      trading_activity JSONB DEFAULT '{}'::jsonb,
      label_data JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Transaction history from Helius/Moralis
    CREATE TABLE transaction_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      wallet_address TEXT NOT NULL,
      signature TEXT UNIQUE NOT NULL,
      block_time TIMESTAMP WITH TIME ZONE,
      transaction_data JSONB NOT NULL,
      enriched_data JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Token metadata cache
    CREATE TABLE token_metadata (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token_address TEXT UNIQUE NOT NULL,
      name TEXT,
      symbol TEXT,
      decimals INTEGER,
      metadata JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Performance indexes
    CREATE INDEX idx_wallet_analytics_address ON wallet_analytics(wallet_address);
    CREATE INDEX idx_transaction_history_address ON transaction_history(wallet_address);
  `;

  try {
    const { error } = await supabase.rpc('exec_sql', { 
      query: createTableSQL 
    });
    
    if (error) {
      console.error('Error creating tables:', error.message);
    } else {
      console.log('✅ All tables created successfully!');
      
      // Verify tables were created
      const testTables = ['profiles', 'wallet_analytics', 'transaction_history', 'token_metadata'];
      for (const table of testTables) {
        const { error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          console.log(`✅ ${table} table ready`);
        }
      }
    }
  } catch (error) {
    console.error('Creation error:', error.message);
  }
}

createTables();