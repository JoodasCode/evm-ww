import supabaseAdmin from '../lib/supabase-admin';

async function checkWalletProfilesTable() {
  console.log('=== WALLET PROFILES TABLE ANALYSIS ===');
  
  try {
    // 1. Check table structure directly
    console.log('\n1. Checking wallet_profiles table structure...');
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .limit(1);
      
    if (tableError) {
      console.error('Error fetching table info:', tableError);
      return;
    }
    
    if (tableInfo && tableInfo.length > 0) {
      const sampleRow = tableInfo[0];
      console.log('Sample row structure:');
      console.log(JSON.stringify(sampleRow, null, 2));
      
      // List all columns
      const columns = Object.keys(sampleRow);
      console.log(`\nColumns found (${columns.length}):`);
      columns.forEach(col => console.log(`- ${col}: ${typeof sampleRow[col]}`));
    } else {
      console.log('No data found in wallet_profiles table');
      
      // Try to get column info from an empty select
      const { error } = await supabaseAdmin
        .from('wallet_profiles')
        .select()
        .limit(0);
        
      if (error) {
        console.error('Error checking empty table:', error);
      } else {
        console.log('Table exists but is empty');
      }
    }
    
    // 2. Count total rows
    console.log('\n2. Counting total wallet profiles...');
    const { count, error: countError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*', { count: 'exact', head: true });
      
    if (countError) {
      console.error('Error counting wallet profiles:', countError);
    } else {
      console.log(`Total wallet profiles: ${count}`);
    }
    
    // 3. Check for duplicate wallet addresses
    console.log('\n3. Checking for duplicate wallet addresses...');
    const { data: walletAddresses, error: addressError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('wallet_address');
      
    if (addressError) {
      console.error('Error fetching wallet addresses:', addressError);
    } else if (walletAddresses && walletAddresses.length > 0) {
      const addresses = walletAddresses.map(p => p.wallet_address.toLowerCase());
      const uniqueAddresses = new Set(addresses);
      
      if (addresses.length !== uniqueAddresses.size) {
        console.log(`❌ Found ${addresses.length - uniqueAddresses.size} duplicate wallet addresses!`);
        
        // Find the duplicates
        const addressCounts = {};
        addresses.forEach(addr => {
          addressCounts[addr] = (addressCounts[addr] || 0) + 1;
        });
        
        const duplicates = Object.entries(addressCounts)
          .filter(([_, count]) => count > 1)
          .map(([addr, count]) => ({ address: addr, count }));
          
        console.log('Duplicate addresses:');
        console.log(duplicates);
      } else {
        console.log('✅ No duplicate wallet addresses found');
      }
    }
    
    // 4. Check for null/empty values in critical fields
    console.log('\n4. Checking for null values in critical fields...');
    const { data: problemProfiles, error: nullError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .or('id.is.null,wallet_address.is.null,is_verified.is.null');
      
    if (nullError) {
      console.error('Error checking for null values:', nullError);
    } else if (problemProfiles && problemProfiles.length > 0) {
      console.log(`❌ Found ${problemProfiles.length} profiles with null values in critical fields`);
      console.log(problemProfiles);
    } else {
      console.log('✅ No profiles with null values in critical fields');
    }
    
    // 5. Check for unused/rarely used columns
    console.log('\n5. Analyzing column usage...');
    const { data: allProfiles, error: profilesError } = await supabaseAdmin
      .from('wallet_profiles')
      .select('*')
      .limit(100);
      
    if (profilesError) {
      console.error('Error fetching profiles for column analysis:', profilesError);
    } else if (allProfiles && allProfiles.length > 0) {
      const columnStats = {};
      
      // Initialize stats for each column
      const sampleColumns = Object.keys(allProfiles[0]);
      sampleColumns.forEach(col => {
        columnStats[col] = {
          nullCount: 0,
          emptyStringCount: 0,
          totalCount: allProfiles.length
        };
      });
      
      // Count null and empty values
      allProfiles.forEach(profile => {
        sampleColumns.forEach(col => {
          if (profile[col] === null) {
            columnStats[col].nullCount++;
          } else if (profile[col] === '') {
            columnStats[col].emptyStringCount++;
          }
        });
      });
      
      // Calculate usage percentage
      sampleColumns.forEach(col => {
        const unusedCount = columnStats[col].nullCount + columnStats[col].emptyStringCount;
        const usagePercent = ((allProfiles.length - unusedCount) / allProfiles.length) * 100;
        columnStats[col].usagePercent = usagePercent.toFixed(2);
      });
      
      console.log('Column usage statistics:');
      console.table(columnStats);
      
      // Identify rarely used columns
      const rarelyUsedColumns = sampleColumns.filter(col => 
        parseFloat(columnStats[col].usagePercent) < 20 && 
        col !== 'id' && 
        col !== 'wallet_address' && 
        col !== 'blockchain_type'
      );
      
      if (rarelyUsedColumns.length > 0) {
        console.log(`\nRarely used columns that could be removed: ${rarelyUsedColumns.join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error('Error analyzing wallet_profiles table:', error);
  }
}

// Run the analysis
checkWalletProfilesTable().catch(console.error);
