import supabaseAdmin from '../lib/supabase-admin';

async function checkWalletProfilesTable() {
  console.log('=== WALLET PROFILES TABLE ANALYSIS ===');
  
  try {
    // 1. Check table schema
    console.log('\n1. Checking wallet_profiles table schema...');
    const { data: columnsInfo, error: schemaError } = await supabaseAdmin
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'wallet_profiles');
      
    if (schemaError) {
      console.error('Error fetching schema:', schemaError);
      return;
    }
    
    if (columnsInfo) {
      console.log('Column information:');
      console.table(columnsInfo);
      
      // Check for primary key
      const primaryKeyColumn = columnsInfo.find(col => 
        col.column_default?.includes('uuid_generate_v4()') || 
        col.column_name === 'id'
      );
      
      if (primaryKeyColumn) {
        console.log(`✅ Primary key found: ${primaryKeyColumn.column_name}`);
      } else {
        console.log('❌ No primary key column found!');
      }
      
      // Check for required columns
      const requiredColumns = ['wallet_address', 'blockchain_type', 'is_verified'];
      const missingColumns = requiredColumns.filter(col => 
        !columnsInfo.some(c => c.column_name === col)
      );
      
      if (missingColumns.length > 0) {
        console.log(`❌ Missing required columns: ${missingColumns.join(', ')}`);
      } else {
        console.log('✅ All required columns present');
      }
    }
    
    // 2. Check for RLS policies
    console.log('\n2. Checking Row Level Security (RLS) policies...');
    const { data: rlsPolicies, error: rlsError } = await supabaseAdmin
      .rpc('get_policies_for_table', { table_name: 'wallet_profiles' });
      
    if (rlsError) {
      console.error('Error fetching RLS policies:', rlsError);
    } else if (rlsPolicies && rlsPolicies.length > 0) {
      console.log('RLS policies found:');
      console.table(rlsPolicies);
    } else {
      console.log('ℹ️ No RLS policies found for wallet_profiles table');
    }
    
    // 3. Check RLS status
    console.log('\n3. Checking if RLS is enabled...');
    const { data: rlsStatus, error: rlsStatusError } = await supabaseAdmin
      .rpc('is_rls_enabled', { table_name: 'wallet_profiles' });
      
    if (rlsStatusError) {
      console.error('Error checking RLS status:', rlsStatusError);
    } else {
      console.log(`RLS enabled: ${rlsStatus ? '✅ Yes' : '❌ No'}`);
    }
    
    // 4. Check data in the table
    console.log('\n4. Checking wallet_profiles data...');
    const { data: walletProfiles, error: dataError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .limit(10);
      
    if (dataError) {
      console.error('Error fetching wallet profiles:', dataError);
      return;
    }
    
    if (walletProfiles && walletProfiles.length > 0) {
      console.log(`Found ${walletProfiles.length} wallet profiles:`);
      console.log(walletProfiles);
      
      // Check for null or missing values in important fields
      const problemProfiles = walletProfiles.filter(profile => 
        !profile.id || 
        !profile.wallet_address || 
        profile.is_verified === null || 
        profile.is_verified === undefined
      );
      
      if (problemProfiles.length > 0) {
        console.log(`❌ Found ${problemProfiles.length} profiles with missing critical data`);
        console.log(problemProfiles);
      } else {
        console.log('✅ All profiles have required data');
      }
      
      // Check for duplicate wallet addresses
      const addresses = walletProfiles.map(p => p.wallet_address.toLowerCase());
      const uniqueAddresses = new Set(addresses);
      
      if (addresses.length !== uniqueAddresses.size) {
        console.log('❌ Duplicate wallet addresses found!');
      } else {
        console.log('✅ No duplicate wallet addresses');
      }
    } else {
      console.log('No wallet profiles found');
    }
    
    // 5. Suggest improvements
    console.log('\n5. Suggested improvements:');
    console.log('- Ensure wallet_address is unique and indexed');
    console.log('- Add proper constraints (NOT NULL) for required fields');
    console.log('- Consider adding a foreign key relationship to user_profiles if needed');
    console.log('- Standardize timestamp columns (first_seen and last_updated)');
    console.log('- Remove unused columns to simplify the schema');
    
  } catch (error) {
    console.error('Error analyzing wallet_profiles table:', error);
  }
}

// Run the analysis
checkWalletProfilesTable().catch(console.error);
