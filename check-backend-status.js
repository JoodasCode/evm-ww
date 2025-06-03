import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Set base URL for axios
axios.defaults.baseURL = 'http://localhost:5002';

async function checkBackendStatus() {
  console.log('=== CHECKING BACKEND SERVER STATUS ===');
  
  try {
    // Check if the server is running
    console.log('Checking if server is running...');
    const healthResponse = await axios.get('/api/health');
    console.log('Server health check response:', healthResponse.data);
    
    // Get a test auth message
    console.log('\nGetting test auth message...');
    const testWallet = '0x1234567890abcdef1234567890abcdef12345678';
    const messageResponse = await axios.get(`/api/auth/message/${testWallet}`);
    console.log('Auth message response:', messageResponse.data);
    
    // Check database connection
    console.log('\nChecking database connection...');
    const dbCheckResponse = await axios.get('/api/debug/db-check');
    console.log('Database connection check:', dbCheckResponse.data);
    
    // List recent wallet profiles
    console.log('\nChecking recent wallet profiles...');
    const profilesResponse = await axios.get('/api/debug/recent-profiles');
    console.log('Recent wallet profiles:', profilesResponse.data);
    
    console.log('\n=== BACKEND SERVER CHECK COMPLETED ===');
  } catch (error) {
    console.error('Error checking backend status:', error.message);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server. Server might be down or unreachable.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

// Run the check
checkBackendStatus().catch(console.error);
