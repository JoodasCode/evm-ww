import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Loader2 } from 'lucide-react';

// RainbowKit and wagmi imports
import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  lightTheme,
  getDefaultConfig,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';

// Define project ID for WalletConnect
// Using the real project ID from WalletConnect
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '6c6cd1f9c0051deae149b2457005ed2e';

// Create wagmi config using RainbowKit's getDefaultConfig
const config = getDefaultConfig({
  appName: 'Wallet Whisperer',
  projectId,
  chains: [mainnet, polygon, optimism, arbitrum, base, sepolia],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a new query client for TanStack Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
          accentColor: '#0E76FD',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
