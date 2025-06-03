import supabaseAdmin from '../lib/supabase-admin';

/**
 * This script analyzes and improves the wallet_profiles table structure
 * based on best practices and the Supabase schema requirements.
 */
async function improveWalletProfilesSchema() {
  console.log('=== IMPROVING WALLET PROFILES TABLE SCHEMA ===');
  
  try {
    // 1. First, analyze the current schema
    console.log('\n1. Analyzing current wallet_profiles schema...');
    const { data: currentProfiles, error: fetchError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .limit(5);
      
    if (fetchError) {
      console.error('Error fetching profiles:', fetchError);
      return;
    }
    
    if (!currentProfiles || currentProfiles.length === 0) {
      console.log('No wallet profiles found to analyze');
      return;
    }
    
    // Display current schema
    const sampleProfile = currentProfiles[0];
    console.log('Current schema:');
    Object.keys(sampleProfile).forEach(column => {
      console.log(`- ${column}: ${typeof sampleProfile[column]} ${sampleProfile[column] === null ? '(NULL)' : ''}`);
    });
    
    // 2. Check for missing or unused columns
    console.log('\n2. Checking for missing or unused columns...');
    
    // Count null values for each column
    const columnStats = {};
    Object.keys(sampleProfile).forEach(column => {
      columnStats[column] = { nullCount: 0, totalCount: currentProfiles.length };
    });
    
    currentProfiles.forEach(profile => {
      Object.keys(profile).forEach(column => {
        if (profile[column] === null) {
          columnStats[column].nullCount++;
        }
      });
    });
    
    // Calculate usage percentage
    Object.keys(columnStats).forEach(column => {
      const usagePercent = ((columnStats[column].totalCount - columnStats[column].nullCount) / 
                           columnStats[column].totalCount) * 100;
      columnStats[column].usagePercent = usagePercent.toFixed(2) + '%';
    });
    
    console.log('Column usage:');
    console.table(columnStats);
    
    // 3. Create recommendations for schema improvements
    console.log('\n3. Generating recommendations for schema improvements...');
    
    const recommendations = [];
    
    // Check for primary key
    if (!sampleProfile.id) {
      recommendations.push('Add a proper UUID primary key column "id"');
    }
    
    // Check for wallet_address uniqueness
    const { data: duplicateCheck, error: duplicateError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('wallet_address, count(*)')
      .group('wallet_address')
      .having('count(*)', 'gt', 1);
      
    if (duplicateError) {
      console.error('Error checking for duplicates:', duplicateError);
    } else if (duplicateCheck && duplicateCheck.length > 0) {
      recommendations.push('Add a UNIQUE constraint to wallet_address column after resolving duplicates');
      console.log('Duplicate wallet addresses found:', duplicateCheck);
    } else {
      recommendations.push('Add a UNIQUE constraint to wallet_address column');
    }
    
    // Check for unused columns
    Object.keys(columnStats).forEach(column => {
      if (parseFloat(columnStats[column].usagePercent) < 10 && 
          column !== 'id' && column !== 'wallet_address') {
        recommendations.push(`Consider removing unused column "${column}" (${columnStats[column].usagePercent} usage)`);
      }
    });
    
    // Check for proper relationship with user_profiles
    if (sampleProfile.user_id === null) {
      recommendations.push('Establish proper relationship between wallet_profiles and user_profiles tables');
    }
    
    // Check for proper timestamps
    if (!sampleProfile.first_seen) {
      recommendations.push('Add first_seen timestamp with DEFAULT now()');
    }
    if (!sampleProfile.last_updated) {
      recommendations.push('Add last_updated timestamp with DEFAULT now()');
    }
    
    // Check for proper blockchain type
    if (!sampleProfile.blockchain_type) {
      recommendations.push('Add blockchain_type column with NOT NULL constraint');
    }
    
    // 4. Display SQL for implementing recommendations
    console.log('\nRecommendations:');
    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
    
    // 5. Generate SQL for implementing recommendations
    console.log('\n4. SQL statements to implement recommendations:');
    
    const sqlStatements = [
      `-- 1. Ensure wallet_address has a UNIQUE constraint
ALTER TABLE wallet_profiles ADD CONSTRAINT wallet_address_unique UNIQUE (wallet_address);`,
      
      `-- 2. Add NOT NULL constraints to required fields
ALTER TABLE wallet_profiles 
  ALTER COLUMN wallet_address SET NOT NULL,
  ALTER COLUMN blockchain_type SET NOT NULL,
  ALTER COLUMN is_verified SET NOT NULL;`,
      
      `-- 3. Add proper defaults
ALTER TABLE wallet_profiles 
  ALTER COLUMN is_primary SET DEFAULT false,
  ALTER COLUMN standalone_wallet SET DEFAULT true,
  ALTER COLUMN first_seen SET DEFAULT now(),
  ALTER COLUMN last_updated SET DEFAULT now();`,
      
      `-- 4. Add indexes for performance
CREATE INDEX IF NOT EXISTS wallet_profiles_wallet_address_idx ON wallet_profiles (wallet_address);
CREATE INDEX IF NOT EXISTS wallet_profiles_blockchain_type_idx ON wallet_profiles (blockchain_type);`,
      
      `-- 5. Add a trigger to update last_updated automatically
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
EXECUTE FUNCTION update_wallet_profile_last_updated();`
    ];
    
    sqlStatements.forEach((sql, index) => {
      console.log(`\n--- SQL Statement ${index + 1} ---\n${sql}`);
    });
    
    console.log('\n5. Next steps:');
    console.log('- Review the recommendations and SQL statements');
    console.log('- Execute the SQL statements in the Supabase SQL editor');
    console.log('- Update the application code to match the new schema');
    console.log('- Test the application with the new schema');
    
  } catch (error) {
    console.error('Error analyzing wallet_profiles schema:', error);
  }
}

// Run the analysis
improveWalletProfilesSchema().catch(console.error);
