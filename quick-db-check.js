// Quick check using the exact same connection that worked 10 minutes ago
import { createClient } from '@supabase/supabase-js';

const WALLET_ADDRESS = "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

// Using exact same credentials from the working test
const supabase = createClient(
  "https://xdcsjcpzhdocnkbxxxwf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkY3NqY3B6aGRvY25rYnh4eXdmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzk4MzczNiwiZXhwIjoyMDYzNTU5NzM2fQ._mquuQo5JlHMud4VXPQTC_zY10yMKD5UE_Rn3nOCmiA"
);

async function quickCheck() {
  console.log('🔍 Quick check for Cented data with same credentials...');
  
  try {
    // Try the exact same query style that worked in the system test
    const { data, error } = await supabase
      .from('wallet_scores')
      .select('*')
      .eq('address', WALLET_ADDRESS);

    if (error) {
      console.log('❌ Still getting error:', error.message);
      
      // Try alternative query
      const { data: allData, error: allError } = await supabase
        .from('wallet_scores')
        .select('*')
        .limit(5);
        
      if (allError) {
        console.log('❌ Can\'t read any data:', allError.message);
      } else {
        console.log(`✅ Can read table - found ${allData?.length || 0} total rows`);
        
        // Look for Cented manually
        const centedData = allData?.find(row => row.address === WALLET_ADDRESS);
        if (centedData) {
          console.log('🎉 FOUND CENTED DATA!');
          console.log(JSON.stringify(centedData, null, 2));
        } else {
          console.log('❌ Cented not in the results');
          console.log('Current addresses in DB:', allData?.map(row => row.address.substring(0, 12) + '...'));
        }
      }
    } else {
      console.log('✅ Query worked! Results:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ Connection error:', error.message);
  }
}

quickCheck();