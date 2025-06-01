import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// Get environment variables for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Log the actual values for debugging
console.log(`VITE_SUPABASE_URL: ${supabaseUrl || 'Not set'}`);
console.log(`VITE_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set (key hidden)' : 'Not set'}`);

// Determine if we should use the mock client
const useMockClient = !supabaseUrl || !supabaseAnonKey;

if (useMockClient) {
  console.log('Missing Supabase credentials. Will use mock client.');
} else {
  console.log('Supabase credentials found:', { 
    url: supabaseUrl,
    keyLength: supabaseAnonKey?.length || 0
  });
}

// Mock user data for development
const mockUser: User = {
  id: 'mock-user-id-123',
  app_metadata: {},
  user_metadata: {
    full_name: 'Mock User',
    avatar_url: 'https://ui-avatars.com/api/?name=Mock+User'
  },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'mock@example.com',
  role: 'authenticated',
  updated_at: new Date().toISOString()
};

// Create a mock Supabase client for development
class MockSupabaseClient {
  private user: User | null = null;
  private authChangeCallbacks: Array<(event: string, session: any) => void> = [];

  auth = {
    getUser: async () => {
      return { data: { user: this.user }, error: null };
    },
    getSession: async () => {
      return { 
        data: { 
          session: this.user ? {
            access_token: 'mock-access-token',
            refresh_token: 'mock-refresh-token',
            user: this.user,
            expires_at: Date.now() + 3600
          } : null 
        }, 
        error: null 
      };
    },
    signInWithOAuth: async ({ provider }: { provider: string }) => {
      console.log(`[Mock Supabase] Sign in with ${provider}`);
      // Simulate successful sign-in after a short delay
      setTimeout(() => {
        this.user = mockUser;
        this.authChangeCallbacks.forEach(callback => {
          callback('SIGNED_IN', { user: this.user });
        });
      }, 1000);
      return { data: { provider, url: '#' }, error: null };
    },
    signOut: async () => {
      console.log('[Mock Supabase] Sign out');
      this.user = null;
      this.authChangeCallbacks.forEach(callback => {
        callback('SIGNED_OUT', null);
      });
      return { error: null };
    },
    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      this.authChangeCallbacks.push(callback);
      return {
        data: { subscription: { unsubscribe: () => {
          this.authChangeCallbacks = this.authChangeCallbacks.filter(cb => cb !== callback);
        }}}
      };
    }
  };

  from = (table: string) => {
    return {
      select: () => ({
        eq: () => ({
          single: async () => {
            if (table === 'users') {
              return { data: { ...mockUser, isPremium: false, walletProfiles: [] }, error: null };
            }
            return { data: null, error: null };
          }
        })
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: {}, error: null })
        })
      }),
      update: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: {}, error: null })
          })
        })
      }),
      delete: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: {}, error: null })
          })
        })
      })
    };
  };
}

// Create either a real or mock Supabase client
let supabase: SupabaseClient;

if (useMockClient) {
  console.log('Using mock Supabase client for development');
  supabase = new MockSupabaseClient() as unknown as SupabaseClient;
} else {
  console.log('Using real Supabase client with URL:', supabaseUrl);
  
  // Get the current origin for OAuth redirects
  const redirectTo = `${window.location.origin}/auth/callback`;
  console.log('OAuth redirect URL:', redirectTo);
  
  // Create the Supabase client with proper configuration
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });
}

// Initialize the client (will run after export)
if (!useMockClient) {
  // This needs to be in a separate function to avoid top-level await
  const initSupabase = async () => {
    try {
      // Configure OAuth redirect URL
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log('Setting OAuth redirect URL:', redirectTo);
      
      // Get the current session if any
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Supabase session initialized successfully');
      }
    } catch (err) {
      console.error('Error initializing Supabase client:', err);
    }
  };
  
  // Call the initialization function
  initSupabase();
}

// Export for use in the application
export { supabase };
export default supabase;
