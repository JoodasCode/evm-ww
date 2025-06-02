import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from "lucide-react";
import { ActivityLogService, ActivityType } from '../services/ActivityLogService';
import { useAccount } from 'wagmi';
import { useLocation } from 'wouter';

// This component handles Web3 wallet authentication callback
export default function AuthCallback() {
  const { address, isConnected } = useAccount();
  const [_, setLocation] = useLocation();
  const activityLogger = ActivityLogService.getInstance();

  useEffect(() => {
    // Log the authentication attempt
    if (isConnected && address) {
      // Log successful authentication
      activityLogger.log(
        ActivityType.LOGIN,
        null, // User ID will be set by the Web3WalletConnect component
        address,
        { blockchainType: 'evm', success: true }
      );

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        setLocation('/');
      }, 1500);
    } else if (address === undefined) {
      // Still loading, do nothing
      return;
    } else {
      // Log failed authentication
      activityLogger.log(
        ActivityType.LOGIN,
        null,
        null,
        { blockchainType: 'evm', success: false }
      );

      // Redirect to auth demo page
      setTimeout(() => {
        setLocation('/auth-demo');
      }, 1500);
    }
  }, [isConnected, address, setLocation]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-[350px] max-w-full">
        <CardHeader>
          <CardTitle>Authentication</CardTitle>
          <CardDescription>
            Processing your wallet connection...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </CardContent>
      </Card>
    </div>
  );
}
