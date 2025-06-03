import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import { ActivityLogService, ActivityType } from '@/services/ActivityLogService';

/**
 * A component that automatically triggers wallet authentication
 * when a wallet is connected. This component renders nothing and
 * should be included at the app's top level.
 */
export function WalletAutoConnect() {
  const { isConnected, address } = useAccount();
  const { connectWallet } = useWalletAuth();
  const [hasAuthed, setHasAuthed] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Prevent running before hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Log all dependencies to help debug
    console.log('[WalletAutoConnect] State:', { 
      hydrated, 
      hasAuthed, 
      isConnected, 
      address,
      timestamp: new Date().toISOString()
    });

    if (!hydrated || hasAuthed || !isConnected || !address) {
      return;
    }

    console.log('[WalletAutoConnect] 🔵 Triggering connect for:', address);

    const doConnect = async () => {
      try {
        const displayName = `Wallet ${address.slice(0, 6)}`;
        const result = await connectWallet(displayName);

        console.log('[WalletAutoConnect] Result from connectWallet:', result);

        if (result) {
          console.log('[WalletAutoConnect] 🟢 Successfully connected:', result);
          ActivityLogService.getInstance().log(
            ActivityType.WALLET_CONNECT,
            null,
            address.toLowerCase(),
            { blockchainType: 'evm', success: true, source: 'WalletAutoConnect' }
          );
          setHasAuthed(true);
        } else {
          console.warn('[WalletAutoConnect] 🟠 connectWallet returned null');
        }
      } catch (err) {
        console.error('[WalletAutoConnect] 🔴 Failed to connect wallet:', err);
      }
    };

    doConnect();
  }, [hydrated, isConnected, address, hasAuthed, connectWallet]);

  // This component doesn't render anything
  return null;
}

export default WalletAutoConnect;
