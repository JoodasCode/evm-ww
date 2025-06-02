import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Web3WalletConnect from '../components/Web3WalletConnect';
import { useAccount, useDisconnect } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useWagmiAuth } from '../hooks/useWagmiAuth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useDisconnect: jest.fn(),
}));

// Mock RainbowKit hooks
jest.mock('@rainbow-me/rainbowkit', () => ({
  useConnectModal: jest.fn(),
}));

// Mock useWagmiAuth hook
jest.mock('../hooks/useWagmiAuth', () => ({
  useWagmiAuth: jest.fn(),
}));

describe('Web3WalletConnect Component', () => {
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
      {children}
    </QueryClientProvider>
  );

  const openConnectModal = jest.fn();
  const disconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    (useAccount as jest.Mock).mockReturnValue({
      address: undefined,
      isConnected: false,
    });
    
    (useConnectModal as jest.Mock).mockReturnValue({
      openConnectModal,
    });
    
    (useDisconnect as jest.Mock).mockReturnValue({
      disconnect,
    });
    
    (useWagmiAuth as jest.Mock).mockReturnValue({
      walletProfile: null,
      isPremium: false,
      isAuthenticated: false,
      isLoading: false,
    });
  });

  test('renders connect button when wallet is not connected', () => {
    render(<Web3WalletConnect />, { wrapper });
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    expect(connectButton).toBeInTheDocument();
  });

  test('opens connect modal when connect button is clicked', () => {
    render(<Web3WalletConnect />, { wrapper });
    
    const connectButton = screen.getByRole('button', { name: /connect wallet/i });
    fireEvent.click(connectButton);
    
    expect(openConnectModal).toHaveBeenCalled();
  });

  test('renders wallet address when connected', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    (useWagmiAuth as jest.Mock).mockReturnValue({
      walletProfile: {
        user_id: 'user123',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      isPremium: false,
      isAuthenticated: true,
      isLoading: false,
    });
    
    render(<Web3WalletConnect />, { wrapper });
    
    expect(screen.getByText(/0x1234...5678/i)).toBeInTheDocument();
  });

  test('shows premium badge when user is premium', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    (useWagmiAuth as jest.Mock).mockReturnValue({
      walletProfile: {
        user_id: 'user123',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      isPremium: true,
      isAuthenticated: true,
      isLoading: false,
    });
    
    render(<Web3WalletConnect />, { wrapper });
    
    expect(screen.getByText(/premium/i)).toBeInTheDocument();
  });

  test('disconnects wallet when disconnect button is clicked', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    (useWagmiAuth as jest.Mock).mockReturnValue({
      walletProfile: {
        user_id: 'user123',
        address: '0x1234567890abcdef1234567890abcdef12345678',
      },
      isPremium: false,
      isAuthenticated: true,
      isLoading: false,
    });
    
    render(<Web3WalletConnect />, { wrapper });
    
    const disconnectButton = screen.getByRole('button', { name: /disconnect/i });
    fireEvent.click(disconnectButton);
    
    expect(disconnect).toHaveBeenCalled();
  });

  test('shows loading state when wallet profile is loading', () => {
    (useAccount as jest.Mock).mockReturnValue({
      address: '0x1234567890abcdef1234567890abcdef12345678',
      isConnected: true,
    });
    
    (useWagmiAuth as jest.Mock).mockReturnValue({
      walletProfile: null,
      isPremium: false,
      isAuthenticated: false,
      isLoading: true,
    });
    
    render(<Web3WalletConnect />, { wrapper });
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
