import React from 'react';
import { Link } from 'wouter';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { UserProfileMenu } from '@/components/ui/UserProfileMenu';
import { Button } from '@/components/ui/button';
import Web3WalletConnect from '@/components/Web3WalletConnect';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <a className="flex items-center gap-2 font-bold text-xl">
              <Sparkles className="h-5 w-5" />
              <span>Wallet Whisperer</span>
            </a>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </a>
            </Link>
            <Link href="/cards">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Cards
              </a>
            </Link>
            <Link href="/analytics">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Analytics
              </a>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isConnected ? (
            <UserProfileMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => openConnectModal?.()}
                className="flex items-center gap-2"
              >
                Connect Wallet
              </Button>
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
