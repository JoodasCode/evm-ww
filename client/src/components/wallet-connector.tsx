import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Zap } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export function WalletConnector() {
  const [simulationAddress, setSimulationAddress] = useState("");
  const { connect, simulateWallet } = useWallet();

  const handleSimulate = () => {
    if (simulationAddress.trim()) {
      simulateWallet(simulationAddress.trim());
      setSimulationAddress("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Wallet Whisperer</h1>
          <p className="text-muted-foreground">Connect your wallet to begin analyzing your trading psychology</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Connect Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={connect} 
              className="w-full"
              size="lg"
            >
              <Wallet className="w-5 h-5 mr-2" />
              Connect Solana Wallet
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4" />
                <span>Simulate any wallet</span>
              </div>
              <Input
                placeholder="Enter Solana wallet address..."
                value={simulationAddress}
                onChange={(e) => setSimulationAddress(e.target.value)}
                className="font-mono text-sm"
              />
              <Button 
                onClick={handleSimulate}
                variant="outline"
                className="w-full"
                disabled={!simulationAddress.trim()}
              >
                Simulate Wallet
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          <p>Your wallet data is analyzed locally and never stored without permission.</p>
        </div>
      </div>
    </div>
  );
}
