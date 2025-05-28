// Check existing Supabase tables and structure
import { createClient } from '@supabase/supabase-js';

async function checkSupabaseTables() {
  console.log('🔍 Checking existing Supabase tables...');
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Supabase credentials missing');
    return;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get all tables in the public schema
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (error) {
      console.error('❌ Error fetching tables:', error.message);
      return;
    }
    
    console.log('✅ Found tables:', tables);
    
    // Check each table structure
    for (const table of tables) {
      console.log(`\n📋 Structure of table: ${table.table_name}`);
      
      const { data: columns, error: colError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');
      
      if (colError) {
        console.error(`❌ Error fetching columns for ${table.table_name}:`, colError.message);
      } else {
        columns.forEach(col => {
          console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
        });
      }
    }
    
    return tables;
  } catch (error) {
    console.error('❌ Supabase connection error:', error.message);
  }
}

// Run the check
checkSupabaseTables();