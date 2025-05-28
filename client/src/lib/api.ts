import { apiRequest } from "./queryClient";
import type { WhispererScore, TokenBalance, TradingActivity } from "@/types/wallet";

export async function getWhispererScore(wallet: string, simulate?: boolean): Promise<WhispererScore> {
  const url = `/api/whisperer-score/${wallet}${simulate ? '?simulate=true' : ''}`;
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch whisperer score: ${response.statusText}`);
  }
  return response.json();
}

export async function updateWhispererScore(wallet: string, data: Partial<WhispererScore>): Promise<WhispererScore> {
  const response = await apiRequest("POST", `/api/whisperer-score/${wallet}`, data);
  return response.json();
}

export async function getTokenBalances(wallet: string): Promise<TokenBalance[]> {
  const response = await fetch(`/api/token-balances/${wallet}`, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch token balances: ${response.statusText}`);
  }
  return response.json();
}

export async function createTokenBalance(wallet: string, data: Omit<TokenBalance, 'id' | 'walletAddress' | 'createdAt' | 'updatedAt'>): Promise<TokenBalance> {
  const response = await apiRequest("POST", `/api/token-balances/${wallet}`, data);
  return response.json();
}

export async function deleteTokenBalances(wallet: string): Promise<void> {
  await apiRequest("DELETE", `/api/token-balances/${wallet}`);
}

export async function getTradingActivity(wallet: string, limit?: number): Promise<TradingActivity[]> {
  const url = `/api/trading-activity/${wallet}${limit ? `?limit=${limit}` : ''}`;
  const response = await fetch(url, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Failed to fetch trading activity: ${response.statusText}`);
  }
  return response.json();
}

export async function createTradingActivity(wallet: string, data: Omit<TradingActivity, 'id' | 'walletAddress' | 'createdAt'>): Promise<TradingActivity> {
  const response = await apiRequest("POST", `/api/trading-activity/${wallet}`, data);
  return response.json();
}
