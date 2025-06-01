import React from 'react';
import { Link } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { UserProfileMenu } from '@/components/ui/UserProfileMenu';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/WalletConnect';
import { ModeToggle } from '@/components/ui/mode-toggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  const { isAuthenticated, signInWithGoogle } = useAuth();

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
          {isAuthenticated ? (
            <UserProfileMenu />
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => signInWithGoogle()}
                className="hidden md:flex items-center gap-2"
              >
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in
              </Button>
              <WalletConnect size="sm" />
            </div>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
