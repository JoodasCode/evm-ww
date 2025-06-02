# Wallet Whisperer Authentication System

## Overview

Wallet Whisperer uses a wallet-only authentication flow powered by wagmi v2 and RainbowKit v2, fully integrated with Supabase for wallet profile management. This document provides an overview of the authentication system architecture, components, and usage.

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

## Activity Logging

The authentication system integrates with the activity logging system to track user actions:

- **Wallet Connection**: Logs when a user connects their wallet
- **Wallet Disconnection**: Logs when a user disconnects their wallet
- **Premium Upgrade**: Logs when a user upgrades to premium

Activity logs are stored in the `user_activity` table in Supabase and can be viewed in the user's profile.

## Database Schema

### wallet_profiles Table

```sql
CREATE TABLE wallet_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_verified BOOLEAN DEFAULT FALSE
);
```

### user_profiles Table

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_premium BOOLEAN DEFAULT FALSE,
  preferences JSONB DEFAULT '{}'
);
```

### user_activity Table

```sql
CREATE TABLE user_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES user_profiles(id),
  activity_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  details JSONB DEFAULT '{}'
);
```

## Environment Variables

- `VITE_WALLETCONNECT_PROJECT_ID`: Required for WalletConnect functionality
- `VITE_SUPABASE_URL`: Supabase instance URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key for client-side operations

## Testing

Unit tests are available for the authentication components and hooks:

- `useWagmiAuth.test.tsx`: Tests for the `useWagmiAuth` hook
- `Web3WalletConnect.test.tsx`: Tests for the `Web3WalletConnect` component

Run tests with:

```bash
npm test
```

## Security Considerations

- Wallet addresses are normalized to lowercase for consistency
- Authentication messages include timestamps to prevent replay attacks
- Signature verification is performed on the server side
- Protected routes enforce wallet authentication
- Activity logging provides an audit trail of authentication events

## Future Improvements

- Add more comprehensive unit tests for authentication components and hooks
- Implement analytics tracking for wallet connection events
- Enhance error handling for wallet connection edge cases
- Improve onboarding experience for new wallet users
