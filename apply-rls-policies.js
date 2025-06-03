/**
 * Script to apply RLS policies to Supabase
 * 
 * This script reads the fix-rls-policies.sql file and applies it to Supabase
 * using the Supabase service role key.
 */

import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';

config();

// Get Supabase credentials from environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_KEY is required');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Read the SQL file
const sqlFilePath = './fix-rls-policies.sql';

async function applyRlsPolicies() {
  try {
    console.log('Reading SQL file...');
    const sqlContent = readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL content by semicolons to get individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && !stmt.startsWith('/*'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement using Supabase RPC
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}...`);
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
      
      // Use Supabase RPC to execute SQL
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: statement
      });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        
        // Try alternative approach if exec_sql is not available
        console.log('Trying alternative approach with direct SQL query...');
        
        // Execute SQL directly using service role
        const { error: directError } = await supabase.auth.admin.executeSql(statement);
        
        if (directError) {
          console.error('Error with direct SQL execution:', directError);
          console.warn('You may need to run this SQL manually in the Supabase SQL Editor');
        } else {
          console.log('Statement executed successfully with direct SQL');
        }
      } else {
        console.log('Statement executed successfully');
      }
    }
    
    console.log('All SQL statements executed. Check for any errors above.');
  } catch (error) {
    console.error('Error applying RLS policies:', error);
    console.log('You may need to run the SQL manually in the Supabase SQL Editor.');
  }
}

applyRlsPolicies();

