import React from 'react';
import { useAuth } from '@/hooks/useAuth';
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
import { WalletConnect } from '@/components/WalletConnect';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  LogOut, 
  Wallet, 
  CreditCard, 
  Settings, 
  ChevronDown 
} from 'lucide-react';

export function UserProfileMenu() {
  const { 
    user, 
    isAuthenticated, 
    isPremium, 
    linkedWallets, 
    signOut, 
    upgradeToPremium 
  } = useAuth();

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials(user?.user_metadata?.full_name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{user?.user_metadata?.full_name || 'User'}</span>
            <span className="text-xs text-muted-foreground">
              {linkedWallets && linkedWallets.length > 0 
                ? formatWalletAddress(linkedWallets[0].address) 
                : user?.email || 'No wallet linked'}
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
        
        {linkedWallets && linkedWallets.length > 0 ? (
          <>
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Linked Wallets
            </DropdownMenuLabel>
            {linkedWallets.map((wallet, index) => (
              <DropdownMenuItem key={index} className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <span>{formatWalletAddress(wallet.address)}</span>
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <DropdownMenuItem className="flex flex-col items-start p-2">
            <span className="mb-2 text-sm">Link your wallet</span>
            <WalletConnect variant="outline" className="w-full" />
          </DropdownMenuItem>
        )}
        
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
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
