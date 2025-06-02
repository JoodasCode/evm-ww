import React from 'react';
import Web3WalletConnect from './Web3WalletConnect';
import { ButtonProps } from './ui/button';

interface WalletConnectProps {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  className?: string;
}

/**
 * Legacy WalletConnect component wrapper around Web3WalletConnect
 * This component exists for backward compatibility with existing code
 */
export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  size = 'default',
  variant = 'default',
  className = ''
}) => {
  return (
    <Web3WalletConnect 
      className={className}
      showDisconnect={true}
    />
  );
};

export default WalletConnect;
