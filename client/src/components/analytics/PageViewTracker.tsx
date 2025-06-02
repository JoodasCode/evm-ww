import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAccount } from 'wagmi';
import activityLogService, { ActivityType } from '@/services/ActivityLogService';

interface PageViewTrackerProps {
  children: React.ReactNode;
}

/**
 * Component that tracks page views in the application
 * Wraps around routes to automatically log page views
 */
export function PageViewTracker({ children }: PageViewTrackerProps) {
  const [location] = useLocation();
  const { address, isConnected } = useAccount();
  
  useEffect(() => {
    // Log page view when location changes
    activityLogService.log(
      ActivityType.PAGE_VIEW,
      null, // We don't have user ID directly from wagmi, this would come from Supabase
      address ? address : null, // Use wallet address if available
      {
        path: location,
        isAuthenticated: isConnected
      }
    );
  }, [location, address, isConnected]);
  
  return <>{children}</>;
}

export default PageViewTracker;
