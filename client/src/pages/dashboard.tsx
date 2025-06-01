import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CognitiveSnapshotTab } from "@/components/dashboard/tabs/CognitiveSnapshotTab";
import { CognitivePatternsTab } from "@/components/dashboard/tabs/CognitivePatternsTab";
import { InsightsTab } from "@/components/dashboard/tabs/InsightsTab";
import { PsychoanalyticsTab } from "@/components/dashboard/tabs/PsychoanalyticsTab";
import { EVMCardsTab } from "@/components/dashboard/tabs/EVMCardsTab";
import { useWallet } from "@/hooks/use-wallet";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("cognitive-snapshot");
  const { wallet, isSimulated } = useWallet();
  
  const refreshAll = () => {
    console.log('Refreshing wallet analytics...');
  };
  
  const currentWallet = wallet || "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

  const getTabTitle = () => {
    switch (activeTab) {
      case "cognitive-snapshot":
        return { title: "Cognitive Snapshot", subtitle: "Your wallet's mental profile at a glance" };
      case "cognitive-patterns":
        return { title: "Cognitive Patterns", subtitle: "Decoding habits, compulsions, and trading biases" };
      case "insights":
        return { title: "Self-Sabotage & Superpowers", subtitle: "Pattern recognition to surface unconscious trading behavior" };
      case "psychoanalytics":
        return { title: "Wallet Personality Layer", subtitle: "Full psychological analysis of your trading psyche" };
      case "evm":
        return { title: "EVM Psychoanalytics", subtitle: "Ethereum-focused behavioral analysis and trading patterns" };
      default:
        return { title: "Cognitive Snapshot", subtitle: "Your wallet's mental profile at a glance" };
    }
  };

  const getSubTabs = (tab: string) => {
    switch (tab) {
      case "behavior":
        return [
          { id: "trade-frequency", label: "Trade Frequency" },
          { id: "token-categories", label: "Token Categories" },
          { id: "degen-score", label: "Degen Score" },
          { id: "risk-profile", label: "Risk Profile" }
        ];
      case "insight":
        return [
          { id: "whisperer-score", label: "Whisperer Score" },
          { id: "timing-accuracy", label: "Timing Accuracy" },
          { id: "conviction-map", label: "Conviction Map" }
        ];
      case "influence":
        return [
          { id: "whale-following", label: "Whale Following" },
          { id: "alpha-signals", label: "Alpha Signals" },
          { id: "market-sentiment", label: "Market Sentiment" }
        ];
      default:
        return [];
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "cognitive-snapshot":
        return <CognitiveSnapshotTab walletAddress={currentWallet} />;
      case "cognitive-patterns":
        return <CognitivePatternsTab walletAddress={currentWallet} />;
      case "insights":
        return <InsightsTab walletAddress={currentWallet} />;
      case "psychoanalytics":
        return <PsychoanalyticsTab walletAddress={currentWallet} />;
      case "evm":
        return <EVMCardsTab walletAddress={currentWallet} />;
      default:
        return <CognitiveSnapshotTab walletAddress={currentWallet} />;
    }
  };

  const tabInfo = getTabTitle();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">{tabInfo.title}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{tabInfo.subtitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              {isSimulated && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                  Simulated Wallet
                </Badge>
              )}
              <ThemeToggle />
              <Button onClick={refreshAll} variant="outline" size="sm" className="h-8 text-xs">
                <RefreshCw className="w-3 h-3 mr-1.5" />
                Refresh Data
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 w-full">
          <div className="w-full max-w-none">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}