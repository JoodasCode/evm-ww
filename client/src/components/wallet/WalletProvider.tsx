import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WalletContextType } from "@/types/wallet";
import { useAuth } from "@/hooks/useAuth";
import { ethers } from "ethers";

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { linkWallet, getAuthMessage, wallets, removeWallet } = useAuth();
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update wallet state when auth wallets change
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      // Use the first wallet in the list
      setWallet(wallets[0].walletAddress);
      setIsConnected(true);
      setIsSimulated(false);
    } else {
      // Check URL params for simulation mode
      const urlParams = new URLSearchParams(window.location.search);
      const walletParam = urlParams.get('wallet');
      const simulateParam = urlParams.get('simulate');
      
      if (walletParam && simulateParam === 'true') {
        setWallet(walletParam);
        setIsConnected(true);
        setIsSimulated(true);
      } else {
        setWallet(null);
        setIsConnected(false);
      }
    }
  }, [wallets]);

  const connect = async () => {
    try {
      setError(null);
      
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];

      if (!walletAddress) {
        throw new Error('No wallet address found. Please try again.');
      }

      // Get authentication message from the server
      const message = await getAuthMessage(walletAddress);

      // Request signature from the user
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Link wallet to the user account
      await linkWallet(walletAddress, signature, message, 'evm');
      
      // Trigger automated analysis
      await triggerAutomatedAnalysis(walletAddress);
      
      return walletAddress;
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (wallet && !isSimulated) {
        await removeWallet(wallet);
      }
      
      setWallet(null);
      setIsConnected(false);
      setIsSimulated(false);
      
      // Clear URL params if in simulation mode
      if (isSimulated) {
        const url = new URL(window.location.href);
        url.searchParams.delete('wallet');
        url.searchParams.delete('simulate');
        window.history.replaceState({}, '', url.toString());
      }
    } catch (error: any) {
      console.error("Failed to disconnect wallet:", error);
      setError(error.message || 'Failed to disconnect wallet');
    }
  };

  const simulateWallet = async (address: string) => {
    setWallet(address);
    setIsConnected(true);
    setIsSimulated(true);
    
    // Update URL params
    const url = new URL(window.location.href);
    url.searchParams.set('wallet', address);
    url.searchParams.set('simulate', 'true');
    window.history.replaceState({}, '', url.toString());
    
    // Trigger automated analysis for simulated wallet
    await triggerAutomatedAnalysis(address);
  };

  // Automated analysis trigger function
  const triggerAutomatedAnalysis = async (walletAddress: string) => {
    try {
      setIsAnalyzing(true);
      console.log(`🚀 Starting automated analysis for ${walletAddress}`);
      
      // Call the automated analysis endpoint
      const response = await fetch(`/api/wallet/${walletAddress}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      console.log('✅ Automated analysis completed:', result);
    } catch (error) {
      console.error('❌ Automated analysis failed:', error);
      // Don't throw error - analysis failure shouldn't prevent wallet connection
    } finally {
      setIsAnalyzing(false);
    }
  };

  const value: WalletContextType = {
    wallet,
    publicKey: wallet, // For backward compatibility
    isConnected,
    connected: isConnected, // For backward compatibility
    connecting: isAnalyzing, // For backward compatibility
    isSimulated,
    isAnalyzing,
    error,
    connect,
    disconnect,
    simulateWallet,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
