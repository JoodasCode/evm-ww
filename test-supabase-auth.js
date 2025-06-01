// Test script for Supabase authentication
// Run with: node test-supabase-auth.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '.env.local') });

// Test both server-side and client-side environment variables
console.log('\n=== Environment Variables Test ===');
console.log('Server-side SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('Server-side SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');
console.log('Server-side SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Not set');
console.log('Client-side VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '✅ Set' : '❌ Not set');
console.log('Client-side VITE_SUPABASE_ANON_KEY:', process.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

// Initialize Supabase client with server-side credentials
async function testServerSideAuth() {
  console.log('\n=== Testing Server-Side Supabase Client ===');
  
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing server-side Supabase credentials');
      return;
    }
    
    console.log('Initializing with URL:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by getting public schema information
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    
    if (error) {
      console.error('❌ Server-side connection failed:', error.message);
    } else {
      console.log('✅ Server-side connection successful');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.error('❌ Server-side test error:', err.message);
  }
}

// Initialize Supabase client with client-side credentials
async function testClientSideAuth() {
  console.log('\n=== Testing Client-Side Supabase Client ===');
  
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('❌ Missing client-side Supabase credentials');
      return;
    }
    
    console.log('Initializing with URL:', supabaseUrl);
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        flowType: 'pkce'
      }
    });
    
    // Test connection by getting public schema information
    const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
    
    if (error) {
      console.error('❌ Client-side connection failed:', error.message);
    } else {
      console.log('✅ Client-side connection successful');
      console.log('Data sample:', data);
    }
  } catch (err) {
    console.error('❌ Client-side test error:', err.message);
  }
}

// Run the tests
async function runTests() {
  await testServerSideAuth();
  await testClientSideAuth();
  console.log('\nTests completed.');
}

runTests();
