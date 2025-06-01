import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { ActivityType, logAuthActivity } from '@/services/ActivityLogService';

interface PageViewTrackerProps {
  children: React.ReactNode;
}

/**
 * Component that tracks page views in the application
 * Wraps around routes to automatically log page views
 */
export function PageViewTracker({ children }: PageViewTrackerProps) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Log page view when location changes
    logAuthActivity(
      ActivityType.PAGE_VIEW,
      user?.id || undefined,
      undefined,
      {
        path: location,
        isAuthenticated
      }
    );
  }, [location, user?.id, isAuthenticated]);
  
  return <>{children}</>;
}

export default PageViewTracker;
