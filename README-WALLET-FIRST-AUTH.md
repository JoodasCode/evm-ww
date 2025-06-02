# Wallet-First Authentication for Wallet Whisperer

This document outlines the wallet-first authentication flow implemented for Wallet Whisperer, which allows users to authenticate using only their Web3 wallet without requiring a Google OAuth account.

## Schema Changes

We've enhanced our Supabase schema to better support wallet-only authentication by adding the following:

### 1. Updated Wallet Profiles Table

The `wallet_profiles` table has been extended with these new fields:

- `standalone_wallet`: Boolean flag indicating if this wallet exists without being linked to a Google OAuth account
- `display_name`: Text field for wallet-only users to have a display name
- `avatar_seed`: Text field for generating consistent avatars for wallet addresses
- `preferences`: JSONB field for wallet-specific settings (including premium status)

### 2. Enhanced User Activity Logging

The `user_activity` table now includes:

- `blockchain_type`: Text field to better categorize wallet activities
- Improved activity details with `standalone` flag to distinguish wallet-only users

### 3. Row Level Security (RLS) Policies

New RLS policies have been added to allow wallet-only authentication:

- Wallet addresses can view their own profiles
- Wallet addresses can update their own profiles
- Wallet addresses can view their own activity logs

## Server-Side Implementation

### New Endpoints

1. **Wallet-Only Authentication** (`POST /api/auth/wallet-auth`)
   - Creates or updates wallet profiles with standalone wallet flag
   - Handles wallet signature verification
   - Logs wallet connection activities
   - Returns wallet profile data

2. **Enhanced Logout** (`POST /api/auth/logout`)
   - Updated to handle standalone wallet disconnections
   - Logs appropriate activity data with standalone flag

### Helper Functions

1. **Wallet Profile Management**
   - Automatic creation of wallet profiles for first-time connections
   - Generation of display names from wallet addresses
   - Proper handling of verification signatures

2. **Premium Status**
   - Support for premium status directly on wallet profiles
   - SQL function to check premium status across linked and standalone wallets

## Client-Side Implementation

### Updated Hooks

1. **useWagmiAuth Hook**
   - Support for standalone wallet profiles
   - Enhanced wallet profile data structure
   - Methods for updating wallet profile display name and preferences
   - Proper premium status checking for both linked and standalone wallets

### Components

1. **Protected Routes**
   - Route protection based on wallet connection status
   - Redirection to auth page when wallet is disconnected

2. **User Profile Menu**
   - Support for displaying wallet-only user information
   - Proper wallet disconnection with server notification

## Usage Flow

1. User connects their wallet using RainbowKit
2. System verifies wallet signature
3. System creates or updates a standalone wallet profile
4. User can access protected routes and features
5. When disconnecting, the system logs the activity and redirects to auth page

## Benefits

- **Simplified Onboarding**: Users can authenticate with just a wallet connection
- **Reduced Friction**: No need for email/password or Google OAuth
- **Consistent Experience**: Same premium features available to wallet-only users
- **Better Analytics**: Improved activity logging for wallet-only users

## Future Enhancements

- JWT token issuance for wallet-only authentication
- Enhanced wallet profile customization options
- Multi-wallet linking for wallet-only users
- Cross-device synchronization for wallet-only users
