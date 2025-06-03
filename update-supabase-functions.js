// Script to update Supabase functions using the REST API
import axios from 'axios';
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

// Read the SQL file for the functions we want to update
const sqlFilePath = path.resolve(__dirname, 'wallet-first-schema-update.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

// Extract the function definitions we want to update
const handleWalletAuthFunction = extractFunction(sqlContent, 'CREATE OR REPLACE FUNCTION public.handle_wallet_auth');
const isWalletPremiumFunction = extractFunction(sqlContent, 'CREATE OR REPLACE FUNCTION public.is_wallet_premium');
const handleNewUserFunction = extractFunction(sqlContent, 'CREATE OR REPLACE FUNCTION public.handle_new_user');

// Function to extract a complete function definition from the SQL content
function extractFunction(content, functionStart) {
  const startIndex = content.indexOf(functionStart);
  if (startIndex === -1) return null;
  
  // Find the end of the function (marked by $$ LANGUAGE plpgsql)
  const endMarker = '$$ LANGUAGE plpgsql';
  const endIndex = content.indexOf(endMarker, startIndex);
  if (endIndex === -1) return null;
  
  // Return the complete function definition including the language specifier and SECURITY DEFINER
  return content.substring(startIndex, endIndex + endMarker.length + ' SECURITY DEFINER'.length);
}

// Function to execute SQL via the Supabase REST API
async function executeSql(sql) {
  try {
    console.log('Executing SQL:');
    console.log(sql.substring(0, 100) + (sql.length > 100 ? '...' : ''));
    
    const response = await axios.post(
      `${supabaseUrl}/rest/v1/`,
      sql,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'X-Client-Info': 'wallet-whisperer-function-updater',
          'Prefer': 'params=single-object'
        }
      }
    );
    
    console.log('SQL executed successfully:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error executing SQL:', error.response?.data || error.message);
    throw error;
  }
}

// Main function to update all the functions
async function updateFunctions() {
  console.log('Updating Supabase functions...');
  
  // Update handle_wallet_auth function
  if (handleWalletAuthFunction) {
    console.log('\nUpdating handle_wallet_auth function...');
    try {
      await executeSql(handleWalletAuthFunction);
      console.log('handle_wallet_auth function updated successfully');
    } catch (error) {
      console.error('Failed to update handle_wallet_auth function');
    }
  } else {
    console.error('Could not find handle_wallet_auth function in SQL file');
  }
  
  // Update is_wallet_premium function
  if (isWalletPremiumFunction) {
    console.log('\nUpdating is_wallet_premium function...');
    try {
      await executeSql(isWalletPremiumFunction);
      console.log('is_wallet_premium function updated successfully');
    } catch (error) {
      console.error('Failed to update is_wallet_premium function');
    }
  } else {
    console.error('Could not find is_wallet_premium function in SQL file');
  }
  
  // Update handle_new_user function and create trigger
  if (handleNewUserFunction) {
    console.log('\nUpdating handle_new_user function...');
    try {
      await executeSql(handleNewUserFunction);
      console.log('handle_new_user function updated successfully');
      
      // Create the trigger
      console.log('\nCreating on_auth_user_created trigger...');
      const triggerSql = `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `;
      await executeSql(triggerSql);
      console.log('on_auth_user_created trigger created successfully');
    } catch (error) {
      console.error('Failed to update handle_new_user function or create trigger');
    }
  } else {
    console.error('Could not find handle_new_user function in SQL file');
  }
  
  console.log('\nFunction update process completed');
}

// Execute the function updates
updateFunctions().catch(err => {
  console.error('Error updating functions:', err);
  process.exit(1);
});
