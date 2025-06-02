import React from 'react';
import ReactDOM from 'react-dom/client';
import { WalletProvider } from '@/components/wallet/WalletProvider';
import Web3WalletConnect from '@/components/Web3WalletConnect';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Import RainbowKit and wagmi
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { config } from './lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

function StandaloneDemo() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Wallet Whisperer Auth Demo</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>RainbowKit Demo</CardTitle>
            <CardDescription>
              Connect your wallet using RainbowKit's beautiful UI
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Web3WalletConnect showDisconnect={true} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Wallet Features</CardTitle>
            <CardDescription>
              Explore wallet authentication features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => console.log('Premium upgrade clicked')} 
                variant="default" 
                className="w-full"
              >
                Upgrade to Premium
              </Button>
              <Button 
                onClick={() => console.log('Verify wallet clicked')} 
                variant="outline" 
                className="w-full"
              >
                Verify Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs overflow-auto p-4 bg-gray-100 rounded">
              {JSON.stringify({
                url: window.location.href,
                time: new Date().toISOString(),
              }, null, 2)}
            </pre>
            <Button 
              onClick={() => console.log('Debug button clicked')} 
              variant="outline" 
              className="mt-4"
            >
              Log Debug Info
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Wrap the app with all necessary providers
function StandaloneApp() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ThemeProvider>
            <WalletProvider>
              <Toaster />
              <StandaloneDemo />
            </WalletProvider>
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Mount the app to a new div in the body
const mountNode = document.createElement('div');
document.body.appendChild(mountNode);
ReactDOM.createRoot(mountNode).render(<StandaloneApp />);
