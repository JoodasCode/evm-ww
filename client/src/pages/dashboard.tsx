import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { WhispererScoreCard } from "@/components/whisperer-score-card";
import { PortfolioSummaryCard } from "@/components/portfolio-summary-card";
import { ArchetypeCard } from "@/components/archetype-card";
import { TokenHoldingsCard } from "@/components/token-holdings-card";
import { TradingActivityCard } from "@/components/trading-activity-card";
import { RiskAppetiteCard } from "@/components/risk-appetite-card";
import { TradingPatternsCard } from "@/components/trading-patterns-card";
import { OvertradingCard } from "@/components/overtrading-card";
import { useWhispererScore, useTokenBalances, useTradingActivity, useRefreshData } from "@/hooks/use-wallet-data";
import { useWallet } from "@/hooks/use-wallet";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { isSimulated } = useWallet();
  const { refreshAll } = useRefreshData();
  
  const { data: score, isLoading: scoreLoading } = useWhispererScore();
  const { data: tokenBalances = [], isLoading: balancesLoading } = useTokenBalances();
  const { data: tradingActivity = [], isLoading: activityLoading } = useTradingActivity();

  const isLoading = scoreLoading || balancesLoading || activityLoading;

  const getTabTitle = () => {
    switch (activeTab) {
      case "overview": return { title: "Portfolio Overview", subtitle: "Comprehensive wallet analysis and psychological insights" };
      case "behavior": return { title: "Trading Behavior", subtitle: "Deep dive into your trading patterns and risk appetite" };
      case "insight": return { title: "Performance Insights", subtitle: "Discover missed opportunities and optimize your strategy" };
      case "influence": return { title: "Market Influence", subtitle: "Understand your position in the trading ecosystem" };
      case "settings": return { title: "Settings & Preferences", subtitle: "Manage your account and privacy settings" };
      default: return { title: "Portfolio Overview", subtitle: "Comprehensive wallet analysis and psychological insights" };
    }
  };

  const tabInfo = getTabTitle();

  const renderTabContent = () => {
    if (isLoading || !score) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">Loading wallet data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <WhispererScoreCard score={score} />
              <PortfolioSummaryCard score={score} tokenBalances={tokenBalances} />
              <ArchetypeCard score={score} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TokenHoldingsCard tokenBalances={tokenBalances} />
              <TradingActivityCard activities={tradingActivity} />
            </div>
          </div>
        );
      
      case "behavior":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RiskAppetiteCard score={score} />
              <TradingPatternsCard score={score} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <OvertradingCard score={score} />
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Time Bias</h3>
                <p className="text-sm text-muted-foreground">Coming soon - Detailed time-of-day trading analysis</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Investment Focus</h3>
                <p className="text-sm text-muted-foreground">Coming soon - Token category breakdown</p>
              </div>
            </div>
          </div>
        );
      
      case "insight":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Missed Opportunities</h3>
                <p className="text-muted-foreground">Coming soon - Analysis of potential gains from missed trades</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Timing Analysis</h3>
                <p className="text-muted-foreground">Coming soon - Entry and exit timing accuracy</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Conviction Mapping</h3>
                <p className="text-muted-foreground">Coming soon - Position size vs conviction analysis</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Repeat Patterns</h3>
                <p className="text-muted-foreground">Coming soon - Behavioral pattern detection</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h3>
                <p className="text-muted-foreground">Coming soon - Advanced performance analytics</p>
              </div>
            </div>
          </div>
        );
      
      case "influence":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Whale Following Index</h3>
                <p className="text-muted-foreground">Coming soon - Smart money correlation analysis</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Alpha Sync Score</h3>
                <p className="text-muted-foreground">Coming soon - Early opportunity detection</p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Market Impact</h3>
                <p className="text-muted-foreground">Coming soon - Transaction impact analysis</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Social Signals</h3>
                <p className="text-muted-foreground">Coming soon - Social media influence tracking</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Network Position</h3>
                <p className="text-muted-foreground">Coming soon - Wallet network analysis</p>
              </div>
            </div>
          </div>
        );
      
      case "settings":
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
                <p className="text-muted-foreground">Coming soon - Privacy and data sharing preferences</p>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
        <main className="flex-1 overflow-auto p-4">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
