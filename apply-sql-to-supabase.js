// Script to apply SQL directly to Supabase
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using Supabase Service Key (first 10 chars): ${supabaseServiceKey.substring(0, 10)}...`);

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the SQL file
const sqlFilePath = path.resolve(__dirname, 'wallet-first-schema-update.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Split the SQL into individual statements
// This is a simple approach - for complex SQL you might need a proper SQL parser
const sqlStatements = sqlContent
  .split(';')
  .map(stmt => stmt.trim())
  .filter(stmt => stmt.length > 0);

async function executeSQL() {
  console.log(`Found ${sqlStatements.length} SQL statements to execute`);
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const stmt = sqlStatements[i];
    console.log(`\nExecuting statement ${i + 1}/${sqlStatements.length}:`);
    console.log(stmt.substring(0, 100) + (stmt.length > 100 ? '...' : ''));
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: stmt + ';' });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    } catch (err) {
      console.error(`Exception executing statement ${i + 1}:`, err);
    }
  }
  
  console.log('\nSQL execution completed');
}

// Execute the SQL statements
executeSQL().catch(err => {
  console.error('Error executing SQL:', err);
  process.exit(1);
});
