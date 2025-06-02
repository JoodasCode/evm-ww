import { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { ActivityType, logCardActivity } from '@/services/ActivityLogService';

/**
 * Hook for tracking card-related activities
 */
export function useCardTracking() {
  const { address } = useAccount();
  const primaryWalletAddress = address?.toLowerCase();
  
  /**
   * Track when a user views a card
   */
  const trackCardView = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_VIEW,
      cardId,
      null, // No user ID in wallet-only auth flow
      primaryWalletAddress,
      details
    );
  }, [primaryWalletAddress]);
  
  /**
   * Track when a card calculation is performed
   */
  const trackCardCalculation = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_CALCULATION,
      cardId,
      null, // No user ID in wallet-only auth flow
      primaryWalletAddress,
      details
    );
  }, [primaryWalletAddress]);
  
  /**
   * Track when a card is refreshed
   */
  const trackCardRefresh = useCallback((cardId: string, details?: Record<string, any>) => {
    logCardActivity(
      ActivityType.CARD_REFRESH,
      cardId,
      null, // No user ID in wallet-only auth flow
      primaryWalletAddress,
      details
    );
  }, [primaryWalletAddress]);
  
  return {
    trackCardView,
    trackCardCalculation,
    trackCardRefresh
  };
}

export default useCardTracking;
