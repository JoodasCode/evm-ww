import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useWallet } from './useWallet';
import type { WhispererScoreData, TokenBalanceData, TradingActivityData } from '@/types/wallet';

export function useWhispererScore() {
  const { publicKey, isSimulated } = useWallet();
  
  return useQuery({
    queryKey: ['whisperer-score', publicKey],
    queryFn: () => publicKey ? api.getWhispererScore(publicKey) : null,
    enabled: !!publicKey,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useTokenBalances() {
  const { publicKey } = useWallet();
  
  return useQuery({
    queryKey: ['token-balances', publicKey],
    queryFn: () => publicKey ? api.getTokenBalances(publicKey) : [],
    enabled: !!publicKey,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useTradingActivity(limit: number = 10) {
  const { publicKey } = useWallet();
  
  return useQuery({
    queryKey: ['trading-activity', publicKey, limit],
    queryFn: () => publicKey ? api.getTradingActivity(publicKey, limit) : [],
    enabled: !!publicKey,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useRefreshAnalysis() {
  const queryClient = useQueryClient();
  const { publicKey } = useWallet();
  
  return useMutation({
    mutationFn: () => {
      if (!publicKey) throw new Error('No wallet connected');
      return api.refreshAnalysis(publicKey);
    },
    onSuccess: () => {
      // Invalidate all related queries
      queryClient.invalidateQueries({ queryKey: ['whisperer-score', publicKey] });
      queryClient.invalidateQueries({ queryKey: ['token-balances', publicKey] });
      queryClient.invalidateQueries({ queryKey: ['trading-activity', publicKey] });
    },
  });
}

export function useRefreshTokenBalances() {
  const queryClient = useQueryClient();
  const { publicKey } = useWallet();
  
  return useMutation({
    mutationFn: () => {
      if (!publicKey) throw new Error('No wallet connected');
      return api.refreshTokenBalances(publicKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['token-balances', publicKey] });
      queryClient.invalidateQueries({ queryKey: ['whisperer-score', publicKey] });
    },
  });
}

export function useCreateWhispererScore() {
  const queryClient = useQueryClient();
  const { isSimulated } = useWallet();
  
  return useMutation({
    mutationFn: (walletAddress: string) => api.createWhispererScore(walletAddress, isSimulated),
    onSuccess: (data) => {
      queryClient.setQueryData(['whisperer-score', data.address], data);
    },
  });
}
