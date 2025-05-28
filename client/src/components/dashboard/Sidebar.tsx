import { Brain, ChartPie, Lightbulb, Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/hooks/useWallet';
import { WalletConnectionButton } from '@/components/wallet/WalletConnectionButton';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: 'overview', label: 'Overview', icon: ChartPie },
  { id: 'behavior', label: 'Behavior', icon: Brain },
  { id: 'insight', label: 'Insight', icon: Lightbulb },
  { id: 'influence', label: 'Influence', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { connected, publicKey } = useWallet();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-64 bg-whisper-card border-r border-whisper-border flex flex-col">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-whisper-border">
        <h1 className="text-xl font-bold text-whisper-text">Wallet Whisperer</h1>
        <p className="text-sm text-whisper-subtext">Professional Analytics</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors",
                    isActive
                      ? "border-l-2 border-whisper-accent bg-whisper-accent/20 text-whisper-text"
                      : "text-whisper-subtext hover:bg-whisper-accent hover:text-whisper-text"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Wallet Connection Status */}
      <div className="p-4 border-t border-whisper-border">
        <div className="bg-whisper-bg p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-whisper-text">Wallet Status</p>
              <p className="text-xs text-whisper-subtext">
                {connected && publicKey ? formatAddress(publicKey) : 'Not Connected'}
              </p>
            </div>
            <WalletConnectionButton />
          </div>
        </div>
      </div>
    </div>
  );
}
