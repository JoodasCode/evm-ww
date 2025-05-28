import { useState, useEffect, createContext, useContext } from 'react';
import type { WalletContextType } from '@/types/wallet';

const WalletContext = createContext<WalletContextType | null>(null);

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export function useWalletState(): WalletContextType {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    // Check URL params for simulation mode
    const urlParams = new URLSearchParams(window.location.search);
    const walletParam = urlParams.get('wallet');
    const simulateParam = urlParams.get('simulate');
    
    if (walletParam && simulateParam === 'true') {
      setPublicKey(walletParam);
      setConnected(true);
      setIsSimulated(true);
    }
  }, []);

  const connect = async () => {
    setConnecting(true);
    try {
      // In a real implementation, this would connect to Solana wallet adapter
      // For now, simulate a connection
      if (typeof window !== 'undefined' && (window as any).solana) {
        const wallet = (window as any).solana;
        if (wallet.isPhantom) {
          const response = await wallet.connect();
          setPublicKey(response.publicKey.toString());
          setConnected(true);
          setIsSimulated(false);
        }
      } else {
        // Fallback to mock connection for demo
        setPublicKey('4x7N8k9mL2pQ5vR6sT8uW1yA3zB5cD9eF2gH7jK8nM9p');
        setConnected(true);
        setIsSimulated(false);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setPublicKey(null);
    setConnected(false);
    setIsSimulated(false);
    
    // Clear URL params if in simulation mode
    const url = new URL(window.location.href);
    url.searchParams.delete('wallet');
    url.searchParams.delete('simulate');
    window.history.replaceState({}, '', url.toString());
  };

  const simulateWallet = (address: string) => {
    setPublicKey(address);
    setConnected(true);
    setIsSimulated(true);
    
    // Update URL params
    const url = new URL(window.location.href);
    url.searchParams.set('wallet', address);
    url.searchParams.set('simulate', 'true');
    window.history.replaceState({}, '', url.toString());
  };

  return {
    connected,
    connecting,
    publicKey,
    isSimulated,
    connect,
    disconnect,
    simulateWallet,
  };
}

export { WalletContext };
