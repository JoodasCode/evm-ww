// Simple script to test environment variables loading
// Run with: node test-env-vars.js

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read .env.local file directly
function readEnvFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars = {};
    
    // Parse the file line by line
    content.split('\n').forEach(line => {
      // Skip comments and empty lines
      if (!line || line.startsWith('#')) return;
      
      // Extract key and value
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim();
        envVars[key] = value;
      }
    });
    
    return envVars;
  } catch (error) {
    console.error(`Error reading env file: ${error.message}`);
    return {};
  }
}

// Read the .env.local file
const envFilePath = path.join(__dirname, '.env.local');
console.log(`Reading environment variables from: ${envFilePath}`);
const envVars = readEnvFile(envFilePath);

// Print the environment variables (masking sensitive values)
console.log('\nEnvironment variables in .env.local:');
Object.keys(envVars).forEach(key => {
  if (key.includes('URL')) {
    console.log(`${key}: ${envVars[key]}`);
  } else if (key.includes('KEY')) {
    // Mask sensitive keys
    const maskedValue = envVars[key].substring(0, 10) + '...';
    console.log(`${key}: ${maskedValue}`);
  } else {
    console.log(`${key}: ${envVars[key]}`);
  }
});

// Compare with process.env
console.log('\nComparing with process.env:');
['SUPABASE_URL', 'VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL'].forEach(key => {
  console.log(`${key} in .env.local: ${envVars[key] || 'Not set'}`);
  console.log(`${key} in process.env: ${process.env[key] || 'Not set'}`);
  console.log('---');
});
