import { ethers } from 'ethers';
import { ActivityLogService, ActivityType } from '../services/ActivityLogService';

// Initialize activity logging service
const activityLogger = ActivityLogService.getInstance();

/**
 * Check if MetaMask is installed and available
 */
export function isMetaMaskAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.ethereum;
}

/**
 * Request wallet access from MetaMask
 * @returns The connected wallet address
 */
export async function requestWalletAccess(): Promise<string> {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    
    if (!walletAddress) {
      throw new Error('No wallet address found. Please try again.');
    }
    
    // Normalize wallet address to lowercase
    return walletAddress.toLowerCase();
  } catch (error: any) {
    // Log the error
    activityLogger.log(
      ActivityType.WALLET_CONNECT,
      null,
      null,
      { error: error.message, success: false }
    );
    
    throw error;
  }
}

/**
 * Sign a message with the connected wallet
 * @param message The message to sign
 * @param walletAddress The wallet address to sign with
 * @returns The signature
 */
export async function signMessage(message: string, walletAddress: string): Promise<string> {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  } catch (error: any) {
    // Log the error
    activityLogger.log(
      ActivityType.WALLET_SIGN,
      null,
      walletAddress,
      { error: error.message, success: false }
    );
    
    throw error;
  }
}

/**
 * Get the current chain ID from MetaMask
 * @returns The chain ID
 */
export async function getChainId(): Promise<string> {
  if (!isMetaMaskAvailable()) {
    throw new Error('MetaMask is not installed');
  }
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return chainId;
  } catch (error) {
    console.error('Error getting chain ID:', error);
    throw error;
  }
}

/**
 * Listen for account changes in MetaMask
 * @param callback Function to call when accounts change
 * @returns Function to remove the listener
 */
export function onAccountsChanged(callback: (accounts: string[]) => void): () => void {
  if (!isMetaMaskAvailable()) {
    console.warn('MetaMask is not installed, cannot listen for account changes');
    return () => {};
  }
  
  window.ethereum.on('accountsChanged', callback);
  return () => window.ethereum.removeListener('accountsChanged', callback);
}

/**
 * Listen for chain changes in MetaMask
 * @param callback Function to call when chain changes
 * @returns Function to remove the listener
 */
export function onChainChanged(callback: (chainId: string) => void): () => void {
  if (!isMetaMaskAvailable()) {
    console.warn('MetaMask is not installed, cannot listen for chain changes');
    return () => {};
  }
  
  window.ethereum.on('chainChanged', callback);
  return () => window.ethereum.removeListener('chainChanged', callback);
}
