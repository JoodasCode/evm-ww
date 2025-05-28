import { Button } from '@/components/ui/button';
import { useWallet } from '@/hooks/useWallet';

export function WalletConnectionButton() {
  const { connected, connecting, publicKey, connect, disconnect } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
  };

  if (connected && publicKey) {
    return (
      <Button
        variant="outline"
        onClick={disconnect}
        className="text-whisper-text border-whisper-border hover:bg-whisper-accent"
      >
        Disconnect
      </Button>
    );
  }

  return (
    <Button
      onClick={connect}
      disabled={connecting}
      className="bg-whisper-accent hover:bg-whisper-accent/80 text-whisper-text"
    >
      {connecting ? 'Connecting...' : 'Connect'}
    </Button>
  );
}
