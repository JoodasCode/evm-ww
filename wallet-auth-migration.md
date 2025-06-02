# Wallet Authentication Migration

## Overview

This document outlines the migration from the legacy authentication system to a wallet-only authentication flow using wagmi v2 and RainbowKit v2, fully integrated with Supabase for wallet profile management.

## Architecture

### Authentication Flow

1. **Wallet Connection**:
   - User connects their wallet using RainbowKit's connection modal
   - wagmi's `useAccount` hook provides wallet connection state and address
   - `useWagmiAuth` custom hook manages wallet profile and authentication state

2. **Authentication Process**:
   - After wallet connection, a signature challenge is generated
   - User signs the challenge with their wallet
   - Signature is verified on the backend
   - Wallet profile is created or retrieved from Supabase
   - Session is established with the authenticated wallet

3. **Profile Management**:
   - Wallet profiles are stored in Supabase's `wallet_profiles` table
   - User profiles are stored in Supabase's `user_profiles` table
   - Premium status and other user data are managed through Supabase

## Key Components

### Frontend

- **`useWagmiAuth` Hook**: Central hook for wallet authentication and profile management
- **`Web3WalletConnect` Component**: UI component for wallet connection using RainbowKit
- **`WalletProvider` Context**: Provides wallet authentication state to the application
- **`UserProfileMenu` Component**: Displays wallet profile and provides disconnect functionality

### Configuration

- **`wagmi.ts`**: Configures wagmi and RainbowKit with appropriate chains and providers
- **`main.tsx`**: Sets up the provider hierarchy with WagmiProvider and RainbowKitProvider

## Migration Changes

1. **Removed Components**:
   - Legacy `useAuth` hook and context
   - Legacy `AuthProvider` component
   - Legacy `WalletConnect` component
   - All Clerk-related authentication components

2. **Added Components**:
   - `useWagmiAuth` custom hook
   - `Web3WalletConnect` component
   - `WalletProvider` context
   - wagmi configuration in `wagmi.ts`

3. **Updated Components**:
   - `AuthDemo` page now uses wagmi hooks and `useWagmiAuth`
   - `UserProfileMenu` now uses wagmi hooks for wallet connection state
   - `App.tsx` updated to use new provider hierarchy
   - `standalone-demo.tsx` updated to use new wallet authentication components

## Usage

### Connecting a Wallet

```tsx
import { Web3WalletConnect } from '@/components/Web3WalletConnect';
import { useAccount } from 'wagmi';

const MyComponent = () => {
  const { address, isConnected } = useAccount();

  return (
    <div>
      {isConnected ? (
        <p>Connected: {address}</p>
      ) : (
        <Web3WalletConnect />
      )}
    </div>
  );
};
```

### Accessing Wallet Profile

```tsx
import { useWagmiAuth } from '@/hooks/useWagmiAuth';

const MyComponent = () => {
  const { walletProfile, isPremium, upgradeToPremium } = useWagmiAuth();

  return (
    <div>
      {walletProfile ? (
        <div>
          <p>User ID: {walletProfile.user_id}</p>
          <p>Premium: {isPremium ? 'Yes' : 'No'}</p>
          {!isPremium && (
            <button onClick={upgradeToPremium}>
              Upgrade to Premium
            </button>
          )}
        </div>
      ) : (
        <p>No wallet profile found</p>
      )}
    </div>
  );
};
```

### Protected Routes

```tsx
import { useWagmiAuth } from '@/hooks/useWagmiAuth';
import { Navigate } from 'wouter';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useWagmiAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return children;
};
```

## Testing

A comprehensive test plan is available in `wallet-auth-test-plan.md` to verify the functionality of the new wallet authentication system.

## Dependencies

- wagmi v2
- RainbowKit v2
- Supabase
- TanStack Query (react-query)
- Tailwind CSS
- Shadcn UI

## Environment Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: Required for WalletConnect functionality
- `VITE_SUPABASE_URL`: Supabase instance URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key for client-side operations

## Future Improvements

- Add unit tests for authentication components and hooks
- Implement analytics tracking for wallet connection events
- Enhance error handling for wallet connection edge cases
- Improve onboarding experience for new wallet users
