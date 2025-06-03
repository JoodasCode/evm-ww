// Wallet Connection Guide
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set up Supabase client with service key for admin access
const supabaseUrl = process.env.SUPABASE_URL || 'https://example.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'fallback-key';

// Create admin client with service key
const adminClient = createClient(supabaseUrl, supabaseServiceKey);

// Get wallet address from command line
const walletAddress = process.argv[2]?.toLowerCase();

if (!walletAddress) {
  console.error('Please provide a wallet address as an argument');
  console.log('Usage: node wallet-connection-guide.js 0xYourWalletAddress');
  process.exit(1);
}

async function checkWalletProfile() {
  console.log('=== WALLET CONNECTION GUIDE ===');
  console.log(`Checking wallet profile for address: ${walletAddress}`);
  
  // Check if wallet profile exists
  const { data: profile, error } = await adminClient
    .from('wallet_profiles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error checking wallet profile:', error);
    process.exit(1);
  }
  
  if (profile) {
    console.log('✅ Wallet profile found in database!');
    console.log('Profile details:');
    console.log(`- Display name: ${profile.display_name}`);
    console.log(`- First seen: ${profile.first_seen}`);
    console.log(`- Is verified: ${profile.is_verified}`);
    console.log(`- Is primary: ${profile.is_primary}`);
    
    console.log('\nYour wallet is already connected and authenticated. No further action needed.');
    return;
  }
  
  console.log('❌ No wallet profile found for this address');
  console.log('\n=== WALLET CONNECTION TROUBLESHOOTING GUIDE ===');
  
  console.log('\n1. BROWSER STEPS:');
  console.log('   a. Open the browser console (F12 or right-click > Inspect > Console)');
  console.log('   b. Clear the console (right-click in console > Clear console)');
  console.log('   c. Disconnect your wallet if connected (click "Disconnect" in the UI)');
  console.log('   d. Clear browser localStorage:');
  console.log('      - In console, type: localStorage.clear()');
  console.log('      - Press Enter');
  
  console.log('\n2. CONNECT YOUR WALLET:');
  console.log('   a. Click "Connect Wallet" in the UI');
  console.log('   b. Select your wallet provider (MetaMask, etc.)');
  console.log('   c. IMPORTANT: Make sure you select the correct account with address:');
  console.log(`      ${walletAddress}`);
  console.log('   d. When prompted to sign the message, carefully review it');
  console.log('   e. The message should contain your wallet address and a timestamp');
  console.log('   f. Sign the message using your wallet');
  
  console.log('\n3. CHECK CONSOLE FOR ERRORS:');
  console.log('   a. After signing, check the browser console for any error messages');
  console.log('   b. Look for "Wallet authentication response:" log entries');
  console.log('   c. Check if there are any 403 Forbidden errors');
  
  console.log('\n4. COMMON ISSUES:');
  console.log('   a. Wrong wallet address: Make sure you\'re using the correct wallet address');
  console.log('   b. Signature mismatch: The wallet that signs must match the connected address');
  console.log('   c. Message format: The message must be signed exactly as presented');
  console.log('   d. Case sensitivity: Make sure the wallet address is in the correct case');
  
  console.log('\n5. AFTER CONNECTING:');
  console.log('   a. Run this script again to verify your wallet profile was created:');
  console.log(`      node wallet-connection-guide.js ${walletAddress}`);
  
  console.log('\n=== TECHNICAL DETAILS FOR DEVELOPERS ===');
  console.log('1. The authentication flow works as follows:');
  console.log('   a. Frontend requests an auth message from /api/auth/message/:wallet');
  console.log('   b. User signs the message with their wallet');
  console.log('   c. Frontend sends the signature to /api/auth/wallet-auth');
  console.log('   d. Backend verifies the signature matches the wallet address');
  console.log('   e. If verified, backend creates a wallet profile and returns a JWT token');
  console.log('   f. Frontend stores the token in localStorage and sets up a Supabase session');
  
  console.log('\n2. Common error messages and solutions:');
  console.log('   a. "Wallet ownership verification failed": The signature doesn\'t match the wallet address');
  console.log('      Solution: Make sure you\'re signing with the exact wallet you\'re connecting');
  console.log('   b. "Auth session missing": This is normal in test environments');
  console.log('      Solution: The profile should still be created even with this error');
  
  console.log('\n3. For developers, you can check the JWT token in localStorage:');
  console.log('   a. In browser console, type:');
  console.log('      localStorage.getItem("sb-[your-supabase-url]-auth-token")');
  console.log('   b. This should return a JSON string containing the access_token');
}

// Run the check
checkWalletProfile().catch(console.error);
