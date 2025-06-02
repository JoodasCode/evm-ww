import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useWagmiAuth } from '../hooks/useWagmiAuth';
import { useAccount, useSignMessage } from 'wagmi';
import { supabase } from '../lib/supabase';
import { WalletProvider } from '../contexts/WalletContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useSignMessage: jest.fn(),
}));

// Mock supabase
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
  },
}));

// Mock fetch for API calls
global.fetch = jest.fn();

describe('useWagmiAuth Hook', () => {
  // Setup QueryClient for tests
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>{children}</WalletProvider>
    </QueryClientProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    (useSignMessage as jest.Mock).mockReturnValue({
      signMessage: jest.fn().mockResolvedValue('0xsignature'),
      isPending: false,
    });
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ message: 'Sign this message for authentication: 12345' }),
    });
    
    (supabase.from('wallet_profiles').select().eq().single as jest.Mock).mockResolvedValue({
      data: {
        user_id: 'user123',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      error: null,
    });
    
    (supabase.from('user_profiles').select().eq().single as jest.Mock).mockResolvedValue({
      data: {
        id: 'user123',
        is_premium: false,
      },
      error: null,
    });
  });

  test('should fetch wallet profile when wallet is connected', async () => {
    const { result } = renderHook(() => useWagmiAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.walletProfile).toEqual({
        user_id: 'user123',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      });
      expect(result.current.isPremium).toBe(false);
    });
  });

  test('should handle wallet not connected state', async () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    
    const { result } = renderHook(() => useWagmiAuth(), { wrapper });
    
    expect(result.current.walletProfile).toBeNull();
    expect(result.current.isPremium).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  test('should handle wallet profile not found', async () => {
    (supabase.from('wallet_profiles').select().eq().single as jest.Mock).mockResolvedValue({
      data: null,
      error: { code: 'PGRST116' },
    });
    
    const { result } = renderHook(() => useWagmiAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.walletProfile).toBeNull();
      expect(result.current.isPremium).toBe(false);
    });
  });

  test('should upgrade to premium successfully', async () => {
    (supabase.from('user_profiles').update().eq as jest.Mock).mockResolvedValue({
      error: null,
    });
    
    const { result } = renderHook(() => useWagmiAuth(), { wrapper });
    
    await waitFor(() => {
      expect(result.current.walletProfile).not.toBeNull();
    });
    
    await act(async () => {
      await result.current.upgradeToPremium();
    });
    
    expect(supabase.from).toHaveBeenCalledWith('user_profiles');
    expect(supabase.update).toHaveBeenCalledWith({ is_premium: true });
    
    await waitFor(() => {
      expect(result.current.isPremium).toBe(true);
    });
  });
});
