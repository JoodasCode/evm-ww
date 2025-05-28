import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { WalletContextType } from "@/types/wallet";

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    // Check URL params for simulation mode
    const urlParams = new URLSearchParams(window.location.search);
    const walletParam = urlParams.get('wallet');
    const simulateParam = urlParams.get('simulate');
    
    if (walletParam && simulateParam === 'true') {
      setWallet(walletParam);
      setIsConnected(true);
      setIsSimulated(true);
    }
  }, []);

  const connect = async () => {
    try {
      // In a real implementation, this would use @solana/wallet-adapter
      // For now, simulate connection
      if (typeof window !== 'undefined' && (window as any).solana) {
        const response = await (window as any).solana.connect();
        setWallet(response.publicKey.toString());
        setIsConnected(true);
        setIsSimulated(false);
      } else {
        // Fallback simulation
        const mockWallet = "4x7NvzSr8YKz2zMQm9CgKQqLpR8aYkZJbN1pH9Kz2";
        setWallet(mockWallet);
        setIsConnected(true);
        setIsSimulated(false);
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  };

  const disconnect = () => {
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
  };

  const simulateWallet = (address: string) => {
    setWallet(address);
    setIsConnected(true);
    setIsSimulated(true);
    
    // Update URL params
    const url = new URL(window.location.href);
    url.searchParams.set('wallet', address);
    url.searchParams.set('simulate', 'true');
    window.history.replaceState({}, '', url.toString());
  };

  const value: WalletContextType = {
    wallet,
    isConnected,
    isSimulated,
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
