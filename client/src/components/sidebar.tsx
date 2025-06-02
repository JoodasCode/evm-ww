import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Brain, Zap, TrendingUp, Users, Wallet, Layers, Activity } from "lucide-react";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const tabs = [
    { id: 'psych-ward', label: 'Psych Ward', icon: Activity },
    { id: 'cognitive-snapshot', label: 'Cognitive Snapshot', icon: Brain },
    { id: 'cognitive-patterns', label: 'Cognitive Patterns', icon: Zap },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'psychoanalytics', label: 'Psychoanalytics', icon: Users },
    { id: 'evm', label: 'EVM', icon: Layers },
  ];

  return (
    <div className="w-56 bg-card border-r border-border flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold text-foreground">Wallet Whisperer</h1>
        <p className="text-xs text-muted-foreground">Professional Analytics</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <li key={tab.id}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start space-x-2 h-9 text-sm ${
                    isActive 
                      ? "bg-accent text-accent-foreground border-l-2 border-l-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  onClick={() => onTabChange(tab.id)}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Wallet Connection Status */}
      <div className="p-3 border-t border-border">
        <div className="bg-background p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground">Wallet Status</p>
              <p className="text-xs text-muted-foreground truncate">
                {isConnected && address ? formatWalletAddress(address) : "Not Connected"}
              </p>
            </div>
            <Button
              size="sm"
              variant={isConnected ? "outline" : "default"}
              onClick={isConnected ? () => disconnect() : () => openConnectModal?.()}
              className="ml-2 h-7 text-xs"
            >
              <Wallet className="w-3 h-3 mr-1" />
              {isConnected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
