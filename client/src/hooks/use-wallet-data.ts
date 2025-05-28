import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWhispererScore, getTokenBalances, getTradingActivity, updateWhispererScore } from "@/lib/api";
import { useWallet } from "./use-wallet";
import type { WhispererScore } from "@/types/wallet";

export function useWhispererScore() {
  const { wallet, isSimulated } = useWallet();
  
  return useQuery({
    queryKey: ['/api/whisperer-score', wallet],
    queryFn: () => wallet ? getWhispererScore(wallet, isSimulated) : null,
    enabled: !!wallet,
  });
}

export function useTokenBalances() {
  const { wallet } = useWallet();
  
  return useQuery({
    queryKey: ['/api/token-balances', wallet],
    queryFn: () => wallet ? getTokenBalances(wallet) : [],
    enabled: !!wallet,
  });
}

export function useTradingActivity(limit?: number) {
  const { wallet } = useWallet();
  
  return useQuery({
    queryKey: ['/api/trading-activity', wallet, limit],
    queryFn: () => wallet ? getTradingActivity(wallet, limit) : [],
    enabled: !!wallet,
  });
}

export function useUpdateWhispererScore() {
  const { wallet } = useWallet();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<WhispererScore>) => {
      if (!wallet) throw new Error("No wallet connected");
      return updateWhispererScore(wallet, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/whisperer-score', wallet] });
    },
  });
}

export function useRefreshData() {
  const { wallet } = useWallet();
  const queryClient = useQueryClient();
  
  const refreshAll = () => {
    if (!wallet) return;
    
    queryClient.invalidateQueries({ queryKey: ['/api/whisperer-score', wallet] });
    queryClient.invalidateQueries({ queryKey: ['/api/token-balances', wallet] });
    queryClient.invalidateQueries({ queryKey: ['/api/trading-activity', wallet] });
  };
  
  return { refreshAll };
}
