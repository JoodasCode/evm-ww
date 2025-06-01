import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

/**
 * Hook for fetching and managing psychoanalytic card data
 */
export const useCardData = () => {
  const queryClient = useQueryClient();
  
  /**
   * Fetch a single card for a wallet
   */
  const useCard = (walletAddress: string, cardType: string, options = { enabled: true }) => {
    return useQuery({
      queryKey: ['card', walletAddress, cardType],
      queryFn: async () => {
        const { data } = await axios.get(`/api/cards/${walletAddress}/${cardType}`);
        return data.data;
      },
      enabled: !!walletAddress && !!cardType && options.enabled,
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };
  
  /**
   * Fetch all cards for a wallet
   */
  const useAllCards = (walletAddress: string, options = { enabled: true }) => {
    return useQuery({
      queryKey: ['cards', walletAddress],
      queryFn: async () => {
        const { data } = await axios.get(`/api/cards/${walletAddress}`);
        return data.data;
      },
      enabled: !!walletAddress && options.enabled,
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };
  
  /**
   * Fetch multiple specific cards for a wallet
   */
  const useBatchCards = (walletAddress: string, cardTypes: string[], options = { enabled: true }) => {
    return useQuery({
      queryKey: ['cards', walletAddress, cardTypes],
      queryFn: async () => {
        const { data } = await axios.post(`/api/cards/${walletAddress}/batch`, { cardTypes });
        return data.data;
      },
      enabled: !!walletAddress && cardTypes.length > 0 && options.enabled,
      staleTime: 1000 * 60 * 60, // 1 hour
    });
  };
  
  /**
   * Get available card types
   */
  const useCardTypes = () => {
    return useQuery({
      queryKey: ['cardTypes'],
      queryFn: async () => {
        const { data } = await axios.get('/api/cards/types');
        return data.data;
      },
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
    });
  };
  
  /**
   * Force refresh a card
   */
  const useRefreshCard = () => {
    return useMutation({
      mutationFn: async ({ walletAddress, cardType }: { walletAddress: string; cardType: string }) => {
        const { data } = await axios.get(`/api/cards/${walletAddress}/${cardType}?refresh=true`);
        return data.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['card', variables.walletAddress, variables.cardType] });
        queryClient.invalidateQueries({ queryKey: ['cards', variables.walletAddress] });
      },
    });
  };
  
  /**
   * Force refresh all cards
   */
  const useRefreshAllCards = () => {
    return useMutation({
      mutationFn: async (walletAddress: string) => {
        const { data } = await axios.get(`/api/cards/${walletAddress}?refresh=true`);
        return data.data;
      },
      onSuccess: (data, variables) => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['cards', variables] });
      },
    });
  };
  
  return {
    useCard,
    useAllCards,
    useBatchCards,
    useCardTypes,
    useRefreshCard,
    useRefreshAllCards,
  };
};

export default useCardData;
