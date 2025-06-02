# Wallet Authentication Test Plan

## Overview
This test plan outlines the steps to verify the successful migration from legacy authentication to a wallet-only authentication flow using wagmi and RainbowKit, fully integrated with Supabase wallet profile management.

## Test Scenarios

### 1. Wallet Connection
- **Test Case 1.1:** Connect wallet using RainbowKit modal
  - Navigate to the Auth Demo page
  - Click on "Connect Wallet"
  - Verify that the RainbowKit modal appears
  - Select a wallet provider
  - Complete the connection process
  - Verify that the wallet address is displayed correctly
  - Verify that the wallet profile is fetched from Supabase

- **Test Case 1.2:** Connect wallet persistence
  - Connect wallet as in Test Case 1.1
  - Refresh the page
  - Verify that the wallet remains connected
  - Verify that the wallet profile is still displayed correctly

### 2. Wallet Disconnection
- **Test Case 2.1:** Disconnect wallet
  - Connect wallet as in Test Case 1.1
  - Click on "Disconnect" in the user profile menu
  - Verify that the wallet is disconnected
  - Verify that the UI updates to show the connect wallet button
  - Verify that protected routes are no longer accessible

### 3. Profile Management
- **Test Case 3.1:** View wallet profile
  - Connect wallet as in Test Case 1.1
  - Navigate to the Account tab
  - Verify that the wallet address is displayed correctly
  - Verify that the premium status is displayed correctly
  - Verify that recent activities are displayed correctly

- **Test Case 3.2:** Upgrade to premium
  - Connect wallet as in Test Case 1.1
  - Navigate to the Account tab
  - Click on "Upgrade to Premium"
  - Verify that the premium status is updated
  - Verify that the UI updates to show the premium badge
  - Verify that the activity log shows the premium upgrade

### 4. Protected Routes
- **Test Case 4.1:** Access protected route when authenticated
  - Connect wallet as in Test Case 1.1
  - Navigate to a protected route (e.g., dashboard)
  - Verify that the protected content is accessible

- **Test Case 4.2:** Access protected route when not authenticated
  - Ensure wallet is disconnected
  - Try to navigate to a protected route (e.g., dashboard)
  - Verify that the user is redirected to the authentication page

### 5. Error Handling
- **Test Case 5.1:** Handle wallet connection errors
  - Simulate a wallet connection error (e.g., by rejecting the connection request)
  - Verify that an appropriate error message is displayed
  - Verify that the UI remains in a usable state

- **Test Case 5.2:** Handle wallet signature errors
  - Connect wallet as in Test Case 1.1
  - Simulate a signature error (e.g., by rejecting the signature request)
  - Verify that an appropriate error message is displayed
  - Verify that the UI remains in a usable state

### 6. Integration Tests
- **Test Case 6.1:** Verify wagmi hooks in components
  - Verify that `useAccount` is used correctly in components
  - Verify that `useDisconnect` is used correctly in components
  - Verify that `useWagmiAuth` is used correctly in components

- **Test Case 6.2:** Verify RainbowKit integration
  - Verify that RainbowKit theme is applied correctly
  - Verify that RainbowKit modal appears and functions correctly
  - Verify that RainbowKit providers are set up correctly

## Expected Results
- All wallet connection and disconnection flows work correctly
- Wallet profiles are correctly fetched from and stored in Supabase
- Premium status is correctly managed and displayed
- Protected routes are properly secured
- Error handling is robust and user-friendly
- UI components display wallet information correctly
- No references to legacy authentication remain in the codebase

## Test Environment
- Development environment with local server
- Modern web browser (Chrome, Firefox, Safari)
- Multiple wallet providers (MetaMask, WalletConnect, etc.)
- Supabase instance with wallet_profiles and user_profiles tables
