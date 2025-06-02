import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAccount } from 'wagmi';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route component that redirects to auth page if user is not authenticated
 * Uses wagmi's useAccount hook to check if wallet is connected
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isConnected } = useAccount();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If not connected, redirect to auth page
    if (!isConnected) {
      setLocation('/auth');
    }
  }, [isConnected, setLocation]);

  // If connected, render children, otherwise render nothing while redirecting
  return isConnected ? <>{children}</> : null;
}
