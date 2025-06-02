import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import Web3WalletConnect from '../components/Web3WalletConnect';
import { useWallet } from '../components/wallet/WalletProvider';
import { useWagmiAuth } from '../hooks/useWagmiAuth';
import { useAccount, useSignMessage } from 'wagmi';
import axios from 'axios';

export default function TestAuth() {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [clientStatus, setClientStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [user, setUser] = useState<any>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [authDebugInfo, setAuthDebugInfo] = useState<string>('');
  const [sessionInfo, setSessionInfo] = useState<string>('');
  const wallet = useWallet();
  const { address, isConnected } = useAccount();
  const { walletProfile, linkWallet, getAuthMessage, isPremium } = useWagmiAuth();

  // Check server-side Supabase connection
  useEffect(() => {
    async function checkServerConnection() {
      try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (data.success) {
          setServerStatus('ok');
          setServerMessage(data.message || 'Server Supabase connection is working');
        } else {
          setServerStatus('error');
          setServerMessage(data.error || 'Server Supabase connection failed');
        }
      } catch (error) {
        setServerStatus('error');
        setServerMessage(`Error checking server status: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    checkServerConnection();
  }, []);

  // Check client-side Supabase connection
  useEffect(() => {
    async function checkClientConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          setClientStatus('error');
          setClientMessage(`Client Supabase error: ${error.message}`);
        } else {
          setClientStatus('ok');
          setClientMessage('Client Supabase connection is working');
          setUser(data.session?.user || null);
        }
      } catch (error) {
        setClientStatus('error');
        setClientMessage(`Error checking client status: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    checkClientConnection();
  }, []);

  // Handle Google OAuth sign-in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error('OAuth error:', error);
        setClientMessage(`OAuth error: ${error.message}`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      setClientMessage(`Sign in error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        setClientMessage(`Sign out error: ${error.message}`);
      } else {
        setUser(null);
        setClientMessage('Signed out successfully');
      }
    } catch (error) {
      console.error('Sign out error:', error);
      setClientMessage(`Sign out error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to check detailed auth state
  const checkAuthState = async () => {
    try {
      // Get current session from Supabase
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      // Get wallet auth state
      const wagmiConnected = isConnected ? 'Connected' : 'Not connected';
      const wagmiAddress = address || 'No wallet address';
      const wagmiProfile = walletProfile ? JSON.stringify(walletProfile, null, 2) : 'No wallet profile';
      const premiumStatus = isPremium ? 'Premium' : 'Not Premium';
      const verifiedStatus = walletProfile?.is_verified ? 'Verified' : 'Not Verified';
      
      // Get wallet state from context
      const walletState = wallet.isConnected ? 'Connected' : 'Not connected';
      const walletAddress = wallet.wallet || 'No wallet address';
      const walletIsSimulated = wallet.isSimulated ? 'Yes' : 'No';
      
      // Format debug info
      const debugInfo = `
=== Supabase Session ===
${sessionData.session ? JSON.stringify(sessionData.session, null, 2) : 'No session'}

=== Wagmi Auth State ===
Connected: ${wagmiConnected}
Address: ${wagmiAddress}
Wallet Profile: ${wagmiProfile}
Premium: ${premiumStatus}
Verified: ${verifiedStatus}

=== Wallet Context State ===
Connected: ${walletState}
Address: ${walletAddress}
Simulated: ${walletIsSimulated}
`;
      
      setAuthDebugInfo(debugInfo);
      
      // Format session info
      if (sessionData.session) {
        setSessionInfo(`Logged in as ${sessionData.session.user.email || 'Unknown user'}`);
      } else if (isConnected && address) {
        setSessionInfo(`Connected with wallet: ${address}`);
      } else {
        setSessionInfo('No active session');
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthDebugInfo(`Error checking auth state: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // Add effect to check auth state periodically
  useEffect(() => {
    checkAuthState();
    const interval = setInterval(checkAuthState, 5000);
    return () => clearInterval(interval);
  }, []);

  // Function to test wallet linking
  const testWalletLinking = async () => {
    if (!address || !isConnected) {
      alert('Please connect a wallet first');
      return;
    }

    try {
      setLoading(true);
      
      // Use the linkWallet function from useWagmiAuth
      const success = await linkWallet();
      
      if (success) {
        alert('Wallet linked successfully!');
        checkAuthState();
      } else {
        alert('Failed to link wallet');
      }
    } catch (error) {
      console.error('Wallet linking error:', error);
      alert(`Wallet linking error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Server Status */}
        <Card>
          <CardHeader>
            <CardTitle>Server Supabase Status</CardTitle>
            <CardDescription>Status of server-side Supabase connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                serverStatus === 'checking' ? 'bg-yellow-500' :
                serverStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>{
                serverStatus === 'checking' ? 'Checking...' :
                serverStatus === 'ok' ? 'Connected' : 'Error'
              }</span>
            </div>
            <p className="mt-2 text-sm">{serverMessage}</p>
          </CardContent>
        </Card>
        
        {/* Client Status */}
        <Card>
          <CardHeader>
            <CardTitle>Client Supabase Status</CardTitle>
            <CardDescription>Status of client-side Supabase connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                clientStatus === 'checking' ? 'bg-yellow-500' :
                clientStatus === 'ok' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span>{
                clientStatus === 'checking' ? 'Checking...' :
                clientStatus === 'ok' ? 'Connected' : 'Error'
              }</span>
            </div>
            <p className="mt-2 text-sm">{clientMessage}</p>
            <p className="mt-2 text-sm">{sessionInfo}</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Authentication Methods */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Authentication Methods</CardTitle>
          <CardDescription>Test different authentication methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Google OAuth</h3>
            <Button 
              onClick={handleGoogleSignIn} 
              disabled={loading}
              className="mr-2"
            >
              {loading ? 'Loading...' : 'Sign in with Google'}
            </Button>
            {user && (
              <Button 
                onClick={handleSignOut} 
                disabled={loading}
                variant="outline"
              >
                Sign Out
              </Button>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Wallet Connection</h3>
            <Web3WalletConnect showDisconnect={true} />
            <Button 
              onClick={testWalletLinking}
              className="ml-2"
              variant="outline"
              disabled={!isConnected || !address}
            >
              Link Wallet to User
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Current User */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current User</CardTitle>
          <CardDescription>Information about the currently authenticated user</CardDescription>
        </CardHeader>
        <CardContent>
          {user ? (
            <div>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Provider:</strong> {user.app_metadata?.provider || 'N/A'}</p>
            </div>
          ) : (
            <p>No user is currently signed in</p>
          )}
          
          {isConnected && address && (
            <div className="mt-4">
              <p><strong>Connected Wallet:</strong> {address}</p>
              {walletProfile && (
                <>
                  <p><strong>Premium:</strong> {isPremium ? 'Yes' : 'No'}</p>
                  <p><strong>Verified:</strong> {walletProfile.is_verified ? 'Yes' : 'No'}</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Auth Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Debug Information</CardTitle>
          <CardDescription>Detailed authentication state information</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96 text-xs">
            {authDebugInfo}
          </pre>
          <Button 
            onClick={checkAuthState}
            className="mt-2"
            size="sm"
          >
            Refresh Auth Info
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
