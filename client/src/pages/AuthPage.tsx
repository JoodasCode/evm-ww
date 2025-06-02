import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import Web3WalletConnect from '@/components/Web3WalletConnect';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { Link } from 'wouter';

interface WalletProfile {
  id: string;
  wallet_address: string;
  user_id: string;
  is_premium: boolean;
}

export const AuthPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [walletProfile, setWalletProfile] = useState<WalletProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      fetchWalletProfile(address);
    } else {
      setWalletProfile(null);
    }
  }, [isConnected, address]);

  const fetchWalletProfile = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single();

      if (error) {
        console.error('Error fetching wallet profile:', error);
      } else if (data) {
        setWalletProfile(data);
      }
    } catch (error) {
      console.error('Error fetching wallet profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatWalletAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Wallet Whisperer</CardTitle>
          <CardDescription className="text-center">
            {isConnected ? 'Manage your wallet and analytics' : 'Connect your wallet to get started'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {isConnected ? (
            <div className="space-y-6">
              <div className="bg-muted p-4 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Wallet Info</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Address</span>
                    <span className="font-mono text-sm">{formatWalletAddress(address || '')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {walletProfile?.is_premium ? (
                      <Badge className="bg-primary">Premium</Badge>
                    ) : (
                      <Badge variant="outline">Basic</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-4">
                <p className="text-muted-foreground">Connect your wallet to access the Wallet Whisperer dashboard</p>
              </div>
              
              <div className="flex justify-center">
                <Web3WalletConnect className="w-full" />
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs text-muted-foreground">By connecting your wallet, you agree to our Terms of Service and Privacy Policy</p>
              </div>
            </div>
          )}
        </CardContent>
        
        {isConnected && (
          <CardFooter>
            <Button 
              onClick={() => disconnect()} 
              variant="outline" 
              className="w-full"
            >
              Disconnect Wallet
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
