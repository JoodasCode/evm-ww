import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLocation } from 'wouter';
import { ActivityType, logAuthActivity } from '../services/ActivityLogService';

// This component handles the OAuth callback from Supabase
export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Get the auth code from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check for errors in the URL
        const errorParam = hashParams.get('error') || queryParams.get('error');
        const errorDescription = hashParams.get('error_description') || queryParams.get('error_description');
        
        if (errorParam) {
          throw new Error(`${errorParam}: ${errorDescription || 'Unknown error'}`);
        }
        
        // Process the callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Log successful authentication
          logAuthActivity(
            ActivityType.LOGIN, 
            data.session.user.id, 
            null, 
            { method: 'google_oauth_callback' }
          );
          
          console.log('Authentication successful, redirecting...');
        }
        
        // Redirect to the dashboard or home page
        setLocation('/');
      } catch (err) {
        console.error('Error during auth callback:', err);
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [setLocation]);
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {loading ? 'Completing authentication...' : error ? 'Authentication Error' : 'Authentication Successful'}
          </h1>
          
          {loading && (
            <div className="mt-4 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 text-red-500">
              <p>{error}</p>
              <button 
                onClick={() => setLocation('/')}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
