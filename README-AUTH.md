# Wallet Whisperer Authentication System

This document provides an overview of the Wallet Whisperer authentication system, which implements a hybrid authentication flow combining Supabase OAuth and wallet-based login.

## Architecture Overview

The authentication system consists of the following components:

1. **Backend AuthService**: A TypeScript class that handles all authentication-related operations
2. **API Routes**: Express.js routes that expose authentication functionality to the frontend
3. **Frontend Auth Hook**: React Context-based hook for managing authentication state
4. **Wallet Connection Components**: UI components for connecting wallets and managing authentication

## Key Features

### Hybrid Authentication Flow

The system supports multiple authentication methods:

- **Google OAuth via Supabase**: Traditional email-based authentication
- **EVM Wallet Signatures**: Cryptographic proof of wallet ownership
- **Session Merging**: Ability to link multiple wallets to a single user account

### Security Features

- **Cryptographic Verification**: All wallet signatures are verified using blockchain-specific libraries
- **Wallet Address Normalization**: All addresses are normalized to lowercase to prevent mismatches
- **Timestamped Auth Messages**: Prevents replay attacks
- **Protected API Routes**: Proper authentication checks on all sensitive endpoints

### Fallback Architecture

- **Mock Clients**: Redis and Supabase clients have fallback implementations
- **Graceful Degradation**: System can run with limited functionality when external services are unavailable
- **Detailed Logging**: Comprehensive logging for debugging and monitoring

## Backend Implementation

### AuthService Class

The `AuthService` class (`server/lib/auth.ts`) provides the following methods:

- `generateAuthMessage`: Creates standardized wallet signature messages
- `verifyWalletSignature`: Verifies wallet signatures based on blockchain type
- `getUserById`: Retrieves user data including linked wallet profiles
- `linkWalletToUser`: Associates a wallet with a user account
- `removeWalletFromUser`: Removes a wallet association
- `upgradeToPremium`: Upgrades a user to premium status

### API Routes

The authentication API routes (`server/api/auth.ts`) include:

- `GET /api/auth/message/:wallet`: Generates an authentication message for a wallet
- `POST /api/auth/link-wallet`: Links a wallet to a user account
- `DELETE /api/auth/wallets/:address`: Removes a wallet from a user account
- `GET /api/auth/profile`: Retrieves the current user's profile
- `POST /api/auth/upgrade`: Upgrades a user to premium status

## Frontend Implementation

### Auth Hook

The `useAuth` hook (`client/src/hooks/useAuth.tsx`) provides:

- Authentication state management
- Methods for Google sign-in and sign-out
- Wallet linking and removal
- Premium upgrade functionality
- Authentication message retrieval

### Wallet Connection Components

- `WalletConnect.tsx`: UI component for connecting EVM wallets
- `AuthPage.tsx`: Complete authentication page with both Google and wallet options
- `AuthDemo.tsx`: Demo page showcasing the full authentication flow

## Usage Examples

### Connecting a Wallet

```typescript
import { useAuth } from '@/hooks/useAuth';
import { ethers } from 'ethers';

const { linkWallet, getAuthMessage } = useAuth();

// Connect wallet
async function connectWallet() {
  // Get wallet address from MetaMask
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  const walletAddress = accounts[0].toLowerCase();
  
  // Get authentication message
  const message = await getAuthMessage(walletAddress);
  
  // Sign message
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const signature = await signer.signMessage(message);
  
  // Link wallet to user account
  await linkWallet(walletAddress, signature, message, 'evm');
}
```

### Google Authentication

```typescript
import { useAuth } from '@/hooks/useAuth';

const { signInWithGoogle, signOut } = useAuth();

// Sign in with Google
async function handleGoogleSignIn() {
  await signInWithGoogle();
}

// Sign out
async function handleSignOut() {
  await signOut();
}
```

## Integration with Existing Wallet System

The new authentication system has been integrated with the existing wallet system:

- `WalletProvider.tsx` now uses the `useAuth` hook for wallet management
- Backward compatibility is maintained with the `useWallet` hook
- The wallet connection flow has been updated to use EVM signatures

## Testing

To test the authentication system:

1. Start the server: `npm run dev:server`
2. Start the client: `npm run dev:client`
3. Navigate to the auth demo page
4. Try both Google authentication and wallet connection
5. Test wallet linking and removal
6. Test premium upgrade flow

## Future Enhancements

- Add support for Solana wallet signatures
- Implement additional OAuth providers
- Add audit logging for security events
- Enhance premium user features
