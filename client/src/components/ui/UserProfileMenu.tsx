import React, { useState, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import { useWagmiAuth } from '@/hooks/useWagmiAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Web3WalletConnect from '@/components/Web3WalletConnect';
import { Badge } from '@/components/ui/badge';
import { useLocation } from 'wouter';
import { 
  User, 
  LogOut, 
  Wallet, 
  CreditCard, 
  Settings, 
  ChevronDown 
} from 'lucide-react';

export function UserProfileMenu() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [, setLocation] = useLocation();
  const { 
    walletProfile, 
    isPremium,
    upgradeToPremium,
    removeWallet
  } = useWagmiAuth();

  // Get initials for avatar fallback
  const getInitials = (name?: string) => {
    if (!name) return 'WW';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Format wallet address for display
  const formatWalletAddress = (address?: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  if (!isConnected || !address) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{address ? address.substring(2, 4).toUpperCase() : 'WW'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">Wallet User</span>
            <span className="text-xs text-muted-foreground">
              {formatWalletAddress(address)}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span>My Account</span>
            {isPremium && (
              <Badge variant="secondary" className="mt-1 w-fit">Premium</Badge>
            )}
            {walletProfile?.is_verified && (
              <Badge variant="outline" className="mt-1 w-fit">Verified</Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Connected Wallet
          </DropdownMenuLabel>
          <DropdownMenuItem className="flex items-center">
            <Wallet className="mr-2 h-4 w-4" />
            <span>{formatWalletAddress(address)}</span>
          </DropdownMenuItem>
        </>
        
        <DropdownMenuSeparator />
        
        {!isPremium && (
          <DropdownMenuItem 
            className="flex items-center text-primary" 
            onClick={() => upgradeToPremium()}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Upgrade to Premium</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          className="flex items-center text-destructive" 
          onClick={async () => {
            // Use removeWallet from useWagmiAuth which handles the complete logout flow
            await removeWallet();
            // Redirect to auth page after disconnection
            setLocation('/auth');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Disconnect</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
