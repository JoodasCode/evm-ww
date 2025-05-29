import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { CognitiveSnapshotTab } from "@/components/dashboard/tabs/CognitiveSnapshotTab";
import { CognitivePatternsTab } from "@/components/dashboard/tabs/CognitivePatternsTab";
import { InsightsTab } from "@/components/dashboard/tabs/InsightsTab";
import { PsychoanalyticsTab } from "@/components/dashboard/tabs/PsychoanalyticsTab";
import { useWallet } from "@/hooks/use-wallet";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("cognitive-snapshot");
  const { walletAddress, isSimulated } = useWallet();
  
  const refreshAll = () => {
    console.log('Refreshing wallet analytics...');
  };
  
  const currentWallet = walletAddress || "CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o";

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

  const renderSubTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="space-y-4 w-full">
          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-4">
              <ModernWhispererScoreCard walletAddress={currentWallet} />
            </div>
            <div className="col-span-4">
              <EnhancedDegenScoreCard walletAddress={currentWallet} />
            </div>
            <div className="col-span-4">
              <ModernRiskAppetiteCard walletAddress={currentWallet} />
            </div>
          </div>
          
          {/* Second Row - Archetype */}
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12">
              <ModernArchetypeCard walletAddress={currentWallet} />
            </div>
          </div>
          
          {/* Bottom Row - Labels */}
          <div className="grid grid-cols-12 gap-4 w-full">
            <div className="col-span-12">
              <ModernLabelSummaryCard walletAddress={currentWallet} />
            </div>
          </div>
        </div>
      );
    }

    // Behavior subtabs
    if (activeTab === "behavior") {
      switch (activeSubTab) {
        case "trade-frequency":
          return <ModernTradeFrequencyCard walletAddress={currentWallet} />;
        case "token-categories":
          return <ModernTokenCategoryCard walletAddress={currentWallet} />;
        case "degen-score":
          return <EnhancedDegenScoreCard walletAddress={currentWallet} />;
        case "risk-profile":
          return <ModernRiskAppetiteCard walletAddress={currentWallet} />;
        default:
          return <ModernTradeFrequencyCard walletAddress={currentWallet} />;
      }
    }

    // Insight subtabs
    if (activeTab === "insight") {
      switch (activeSubTab) {
        case "whisperer-score":
          return <ModernWhispererScoreCard walletAddress={currentWallet} />;
        case "timing-accuracy":
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Timing Accuracy</h3>
              <p className="text-muted-foreground">Advanced timing analysis coming soon</p>
            </div>
          );
        case "conviction-map":
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Conviction Map</h3>
              <p className="text-muted-foreground">Conviction mapping analysis coming soon</p>
            </div>
          );
        default:
          return <ModernWhispererScoreCard walletAddress={currentWallet} />;
      }
    }

    // Influence subtabs
    if (activeTab === "influence") {
      switch (activeSubTab) {
        case "whale-following":
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Whale Following</h3>
              <p className="text-muted-foreground">Whale tracking analysis coming soon</p>
            </div>
          );
        case "alpha-signals":
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Alpha Signals</h3>
              <p className="text-muted-foreground">Alpha signal detection coming soon</p>
            </div>
          );
        case "market-sentiment":
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Market Sentiment</h3>
              <p className="text-muted-foreground">Sentiment analysis coming soon</p>
            </div>
          );
        default:
          return (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <h3 className="text-xl font-semibold text-foreground mb-4">Whale Following</h3>
              <p className="text-muted-foreground">Whale tracking analysis coming soon</p>
            </div>
          );
      }
    }

    // Settings tab
    if (activeTab === "settings") {
      return (
        <div className="max-w-4xl space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Data Management</h3>
              <div className="space-y-3">
                <Button onClick={refreshAll} className="w-full justify-start" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Clear Cache
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  Export Data
                </Button>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Privacy Settings</h3>
              <p className="text-muted-foreground">Privacy and data sharing preferences coming soon</p>
            </div>
          </div>
        </div>
      );
    }

    return <div className="text-foreground">Select a tab</div>;
  };

  const renderTabContent = () => {
    const subTabs = getSubTabs(activeTab);
    
    return (
      <div className="w-full">
        {/* Sub Navigation */}
        {subTabs.length > 0 && (
          <div className="flex space-x-1 mb-6 bg-slate-800/30 rounded-lg p-1">
            {subTabs.map((subTab) => (
              <button
                key={subTab.id}
                onClick={() => setActiveSubTab(subTab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeSubTab === subTab.id
                    ? "bg-slate-700 text-white shadow-lg"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                }`}
              >
                {subTab.label}
              </button>
            ))}
          </div>
        )}
        
        {/* Content */}
        {renderSubTabContent()}
      </div>
    );
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