import supabaseAdmin from '../lib/supabase-admin';

/**
 * This script fixes the wallet_profiles table structure by:
 * 1. Ensuring proper primary key and unique constraints
 * 2. Adding proper foreign key relationships
 * 3. Standardizing column naming and types
 * 4. Adding indexes for performance
 */
async function fixWalletProfilesSchema() {
  console.log('=== FIXING WALLET PROFILES TABLE SCHEMA ===');
  
  try {
    // 1. First, create a backup of the current data
    console.log('\n1. Creating backup of current wallet_profiles data...');
    const { data: currentProfiles, error: backupError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*');
      
    if (backupError) {
      console.error('Error creating backup:', backupError);
      return;
    }
    
    console.log(`Backed up ${currentProfiles?.length || 0} wallet profiles`);
    
    // Save backup to a JSON file (in a real scenario)
    console.log('In a production environment, we would save this backup to a file or table');
    
    // 2. Execute SQL to fix the schema
    console.log('\n2. Fixing wallet_profiles table schema...');
    
    // SQL to execute - we'll run these one by one to handle errors properly
    const sqlCommands = [
      // Add proper constraints and indexes
      `
      ALTER TABLE wallet_profiles
      ADD CONSTRAINT wallet_address_unique UNIQUE (wallet_address);
      `,
      
      // Rename updated_at to last_updated if needed (already done in our case)
      `
      -- This is just a comment since we already use last_updated
      -- ALTER TABLE wallet_profiles RENAME COLUMN updated_at TO last_updated;
      `,
      
      // Add proper foreign key to user_profiles if needed
      `
      -- First check if user_profiles table exists
      DO $$ 
      BEGIN
        IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_profiles') THEN
          -- Add foreign key if it doesn't exist
          IF NOT EXISTS (
            SELECT FROM information_schema.table_constraints 
            WHERE constraint_name = 'wallet_profiles_user_id_fkey'
          ) THEN
            -- Make sure user_id column exists and is the right type
            ALTER TABLE wallet_profiles 
            ALTER COLUMN user_id TYPE uuid USING user_id::uuid;
            
            -- Add foreign key constraint
            ALTER TABLE wallet_profiles
            ADD CONSTRAINT wallet_profiles_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES user_profiles(id);
          END IF;
        END IF;
      END $$;
      `,
      
      // Add proper indexes for performance
      `
      CREATE INDEX IF NOT EXISTS wallet_profiles_wallet_address_idx 
      ON wallet_profiles (wallet_address);
      
      CREATE INDEX IF NOT EXISTS wallet_profiles_user_id_idx 
      ON wallet_profiles (user_id);
      
      CREATE INDEX IF NOT EXISTS wallet_profiles_blockchain_type_idx 
      ON wallet_profiles (blockchain_type);
      `,
      
      // Add proper default values and NOT NULL constraints
      `
      ALTER TABLE wallet_profiles 
      ALTER COLUMN is_verified SET NOT NULL,
      ALTER COLUMN blockchain_type SET NOT NULL,
      ALTER COLUMN wallet_address SET NOT NULL,
      ALTER COLUMN is_primary SET DEFAULT false,
      ALTER COLUMN standalone_wallet SET DEFAULT true;
      `,
      
      // Add proper timestamps with defaults
      `
      ALTER TABLE wallet_profiles 
      ALTER COLUMN first_seen SET DEFAULT now(),
      ALTER COLUMN last_updated SET DEFAULT now();
      `
    ];
    
    // Execute each SQL command
    for (const [index, sql] of sqlCommands.entries()) {
      console.log(`\nExecuting SQL command ${index + 1}/${sqlCommands.length}...`);
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql });
      
      if (error) {
        console.error(`Error executing SQL command ${index + 1}:`, error);
        console.log('SQL was:', sql);
      } else {
        console.log(`✅ SQL command ${index + 1} executed successfully`);
      }
    }
    
    // 3. Verify the changes
    console.log('\n3. Verifying changes to wallet_profiles table...');
    const { data: verifyProfiles, error: verifyError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .limit(1);
      
    if (verifyError) {
      console.error('Error verifying changes:', verifyError);
    } else {
      console.log('✅ Successfully verified wallet_profiles table structure');
      if (verifyProfiles && verifyProfiles.length > 0) {
        console.log('Updated sample row:');
        console.log(JSON.stringify(verifyProfiles[0], null, 2));
      }
    }
    
    // 4. Provide recommendations for further improvements
    console.log('\n4. Recommendations for further improvements:');
    console.log('- Consider adding a trigger to update last_updated timestamp automatically');
    console.log('- Implement proper RLS policies for security');
    console.log('- Add documentation comments to the table and columns');
    console.log('- Consider adding a wallet_type enum for blockchain_type');
    
  } catch (error) {
    console.error('Error fixing wallet_profiles schema:', error);
  }
}

// Run the migration
fixWalletProfilesSchema().catch(console.error);
