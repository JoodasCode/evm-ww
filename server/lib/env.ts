/**
 * Environment variables loader for Wallet Whisperer
 * Loads variables from .env.local file and provides them to the application
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to read .env.local file directly
function loadEnvFile(filePath: string): Record<string, string> {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const envVars: Record<string, string> = {};
    
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
        
        // Also set in process.env if not already set
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error(`Error reading env file: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}

// Load environment variables from .env.local
const envFilePath = path.join(dirname(dirname(__dirname)), '.env.local');
console.log(`Loading environment variables from: ${envFilePath}`);
const envVars = loadEnvFile(envFilePath);

// Export environment variables
export const env = {
  // Supabase configuration
  supabase: {
    url: envVars.SUPABASE_URL || process.env.SUPABASE_URL || '',
    anonKey: envVars.SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '',
    serviceKey: envVars.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY || ''
  },
  
  // Database configuration
  database: {
    url: envVars.DATABASE_URL || process.env.DATABASE_URL || ''
  },
  
  // Redis configuration
  redis: {
    url: envVars.REDIS_URL || process.env.REDIS_URL || ''
  },
  
  // Dune Analytics configuration
  dune: {
    apiKey: envVars.DUNE_API_KEY || process.env.DUNE_API_KEY || '',
    workerProxyUrl: envVars.DUNE_WORKER_PROXY || process.env.DUNE_WORKER_PROXY || ''
  }
};

// Log loaded environment variables (without showing sensitive values)
console.log('Environment variables loaded from .env.local:');
console.log(`SUPABASE_URL: ${env.supabase.url || 'Not set'}`);
console.log(`SUPABASE_ANON_KEY: ${env.supabase.anonKey ? 'Set (key hidden)' : 'Not set'}`);
console.log(`SUPABASE_SERVICE_KEY: ${env.supabase.serviceKey ? 'Set (key hidden)' : 'Not set'}`);
console.log(`DATABASE_URL: ${env.database.url ? 'Set (URL hidden)' : 'Not set'}`);
console.log(`REDIS_URL: ${env.redis.url ? 'Set (URL hidden)' : 'Not set'}`);

export default env;
