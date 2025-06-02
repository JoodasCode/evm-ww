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
import { PsychWardTab } from "@/components/dashboard/tabs/PsychWardTab";
import { DetailedCognitiveSnapshotTab } from "@/components/dashboard/tabs/DetailedCognitiveSnapshotTab";
import { DetailedCognitivePatternsTab } from "@/components/dashboard/tabs/DetailedCognitivePatternsTab";
import { DetailedInsightsTab } from "@/components/dashboard/tabs/DetailedInsightsTab";
import { DetailedPsychoanalyticsTab } from "@/components/dashboard/tabs/DetailedPsychoanalyticsTab";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("psych-ward");
  const { address, isConnected } = useAccount();
  
  const refreshAll = () => {
    console.log('Refreshing wallet analytics...');
  };
  
  // Use connected wallet address or fallback to a demo address
  const currentWallet = address || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";

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
      case "psych-ward":
        return { title: "Psych Ward", subtitle: "Your wallet's mental health at a glance" };
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
        return <DetailedCognitiveSnapshotTab walletAddress={currentWallet} />;
      case "cognitive-patterns":
        return <DetailedCognitivePatternsTab walletAddress={currentWallet} />;
      case "insights":
        return <DetailedInsightsTab walletAddress={currentWallet} />;
      case "psychoanalytics":
        return <DetailedPsychoanalyticsTab walletAddress={currentWallet} />;
      case "psych-ward":
        return <PsychWardTab walletAddress={currentWallet} />;
      case "evm":
        return <EVMCardsTab walletAddress={currentWallet} />;
      default:
        return <PsychWardTab walletAddress={currentWallet} />;
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
              {!isConnected && (
                <Badge variant="secondary" className="bg-accent text-accent-foreground text-xs">
                  Demo Wallet
                </Badge>
              )}
              {isConnected && (
                <Badge variant="outline" className="text-xs">
                  Connected: {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
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