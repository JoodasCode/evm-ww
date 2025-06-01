import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import WalletConnectionButton from '@/components/wallet/WalletConnectionButton';
import { useWallet } from '@/components/wallet/WalletProvider';

export default function TestAuth() {
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [clientStatus, setClientStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [user, setUser] = useState<any>(null);
  const [serverMessage, setServerMessage] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const { address, isConnected } = useWallet();

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
            <WalletConnectionButton />
          </div>
        </CardContent>
      </Card>
      
      {/* Current User */}
      <Card>
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
          
          {isConnected && (
            <div className="mt-4">
              <p><strong>Connected Wallet:</strong> {address}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
