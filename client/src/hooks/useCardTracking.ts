import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ActivityType, logCardActivity } from '@/services/ActivityLogService';

/**
 * Hook for tracking card-related activities
 */
export function useCardTracking() {
  const { user, wallets } = useAuth();
  const primaryWalletAddress = wallets?.[0]?.walletAddress;
  
  /**
   * Track when a user views a card
   */
  const trackCardView = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_VIEW,
      cardId,
      user?.id,
      primaryWalletAddress,
      details
    );
  }, [user?.id, primaryWalletAddress]);
  
  /**
   * Track when a card calculation is performed
   */
  const trackCardCalculation = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_CALCULATION,
      cardId,
      user?.id,
      primaryWalletAddress,
      details
    );
  }, [user?.id, primaryWalletAddress]);
  
  /**
   * Track when a card is refreshed
   */
  const trackCardRefresh = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_REFRESH,
      cardId,
      user?.id,
      primaryWalletAddress,
      details
    );
  }, [user?.id, primaryWalletAddress]);
  
  return {
    trackCardView,
    trackCardCalculation,
    trackCardRefresh
  };
}

export default useCardTracking;
