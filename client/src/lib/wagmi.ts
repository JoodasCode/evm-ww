// wagmi.ts - Configuration for wagmi and RainbowKit
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  sepolia,
} from 'wagmi/chains';

// Define project ID for WalletConnect
// Using the real project ID from WalletConnect or a fallback
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '6c6cd1f9c0051deae149b2457005ed2e';

// Create wagmi config using RainbowKit's getDefaultConfig
export const config = getDefaultConfig({
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
