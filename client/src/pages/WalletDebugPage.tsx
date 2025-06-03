import { WalletDebugger } from "../components/WalletDebugger";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletDebugPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col items-center gap-8">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">Wallet Authentication Debugger</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet and test the authentication flow between frontend and backend
          </p>
          
          <div className="flex justify-end mb-6">
            <ConnectButton />
          </div>
          
          <WalletDebugger />
          
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <h2 className="text-lg font-medium mb-2">How to use this tool</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Connect your wallet using the RainbowKit button above</li>
              <li>Click "Test Wallet Profile" to create a wallet profile without signature verification</li>
              <li>Click "Sign Message" to get and sign an authentication message</li>
              <li>Click "Test Auth Flow" to test the complete authentication flow with signature verification</li>
              <li>Check the server logs for detailed diagnostic information</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletDebugPage;
