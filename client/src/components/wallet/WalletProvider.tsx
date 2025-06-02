import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WalletContextType } from "@/types/wallet";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useWagmiAuth } from "@/hooks/useWagmiAuth";
import { ActivityLogService, ActivityType } from "@/services/ActivityLogService";

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected: wagmiConnected } = useAccount();
  const { disconnect: disconnectWallet } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { linkWallet, getAuthMessage, walletProfile } = useWagmiAuth();
  
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const activityLogger = ActivityLogService.getInstance();

  // Update wallet state when wagmi connection changes
  useEffect(() => {
    if (wagmiConnected && address) {
      // Use the connected wallet address
      setWallet(address);
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
  }, [wagmiConnected, address]);

  const connect = async () => {
    try {
      setError(null);
      
      if (!address) {
        throw new Error('No wallet address connected. Please connect your wallet first.');
      }
      
      // Link wallet using the useWagmiAuth hook
      await linkWallet();
      
      // Trigger automated analysis
      await triggerAutomatedAnalysis(address);
      
      return address;
    } catch (error: any) {
      console.error("Failed to connect wallet:", error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    }
  };

  const disconnect = async () => {
    try {
      if (isSimulated) {
        // Just clear simulation state
        setWallet(null);
        setIsConnected(false);
        setIsSimulated(false);
        
        // Clear URL params
        const url = new URL(window.location.href);
        url.searchParams.delete('wallet');
        url.searchParams.delete('simulate');
        window.history.replaceState({}, '', url.toString());
      } else {
        // Use wagmi disconnect
        disconnectWallet();
        
        // Log activity
        if (wallet) {
          activityLogger.log(
            ActivityType.WALLET_DISCONNECT,
            null,
            wallet,
            { blockchainType: 'evm', success: true }
          );
        }
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
