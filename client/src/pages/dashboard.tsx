import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import Masonry from 'react-masonry-css';
import { ModernWhispererScoreCard } from "@/components/modern-whisperer-score-card";
import { ModernRiskAppetiteCard } from "@/components/modern-risk-appetite-card";
import { ModernArchetypeCard } from "@/components/modern-archetype-card";
import { ModernLabelSummaryCard } from "@/components/modern-label-summary-card";
import { EnhancedDegenScoreCard } from "@/components/enhanced-degen-score-card";
import { ModernTradeFrequencyCard } from "@/components/modern-trade-frequency-card";
import { ModernTokenCategoryCard } from "@/components/modern-token-category-card";
import { ModernMissedOpportunitiesCard } from "@/components/modern-missed-opportunities-card";
import { ModernTimingAnalysisCard } from "@/components/modern-timing-analysis-card";
import { ModernConvictionMappingCard } from "@/components/modern-conviction-mapping-card";
import { ModernPatternAnalysisCard } from "@/components/modern-pattern-analysis-card";
import { ModernLabelEngineHistoryCard } from "@/components/modern-label-engine-history-card";
import { ModernMoodTimelineCard } from "@/components/modern-mood-timeline-card";
import { ModernScoreRegressionCard } from "@/components/modern-score-regression-card";
import { ComingSoonCard } from "@/components/coming-soon-card";
import { useWhispererScore, useTokenBalances, useTradingActivity, useRefreshData } from "@/hooks/use-wallet-data";
import { useWallet } from "@/hooks/use-wallet";
import { getMockDataForWallet } from "@/lib/mock-data";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { isSimulated } = useWallet();
  const { refreshAll } = useRefreshData();
  
  const { data: score, isLoading: scoreLoading } = useWhispererScore();
  const { data: tokenBalances = [], isLoading: balancesLoading } = useTokenBalances();
  const { data: tradingActivity = [], isLoading: activityLoading } = useTradingActivity();

  const isLoading = scoreLoading || balancesLoading || activityLoading;
  
  // Get current wallet address for components
  const currentWallet = "G8XdYiKt7pzewTnQtpxWeet9hS8uTvymgDJok4f9T74W";

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
    // Use your comprehensive mock data for immediate display
    const mockData = getMockDataForWallet(currentWallet);
    const displayScore = mockData.score;
    const displayHoldings = mockData.holdings;
    const displayTrades = mockData.trades;

    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(200px,_auto)] gap-6">
            {/* Primary Whisperer Score - spans 2 columns for prominence */}
            <div className="lg:col-span-2">
              <ModernWhispererScoreCard walletAddress={currentWallet} />
            </div>
            
            {/* Degen Score - normal height */}
            <div>
              <EnhancedDegenScoreCard walletAddress={currentWallet} />
            </div>
            
            {/* Risk Appetite - compact */}
            <div>
              <ModernRiskAppetiteCard walletAddress={currentWallet} />
            </div>
            
            {/* Portfolio Performance - tall card */}
            <div className="row-span-2">
              <ComingSoonCard 
                title="Portfolio Performance" 
                description="ROI tracking and performance analytics"
                features={["PnL tracking", "Win/loss ratios", "Performance benchmarks"]}
                size="large"
              />
            </div>
            
            {/* Archetype - compact */}
            <div>
              <ModernArchetypeCard walletAddress={currentWallet} />
            </div>
            
            {/* Social Sentiment - small card */}
            <div>
              <ComingSoonCard 
                title="Social Sentiment" 
                description="Community sentiment and social signals"
                features={["Twitter sentiment", "Discord activity", "Community influence"]}
                size="small"
              />
            </div>
            
            {/* Label Summary - spans full width */}
            <div className="md:col-span-2 lg:col-span-3">
              <ModernLabelSummaryCard walletAddress={currentWallet} />
            </div>
          </div>
        );
      
      case "behavior":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(200px,_auto)] gap-6">
            {/* Trade Frequency - spans 2 columns for detailed data */}
            <div className="lg:col-span-2">
              <ModernTradeFrequencyCard walletAddress={currentWallet} />
            </div>
            
            {/* Token Categories - normal size */}
            <div>
              <ModernTokenCategoryCard walletAddress={currentWallet} />
            </div>
            
            {/* Transaction Patterns - tall card */}
            <div className="row-span-2">
              <ComingSoonCard 
                title="Transaction Patterns" 
                description="Advanced transaction flow analysis"
                features={["MEV detection", "Sandwich attack patterns", "Front-running analysis"]}
                size="large"
              />
            </div>
            
            {/* Degen Score - normal size */}
            <div>
              <EnhancedDegenScoreCard walletAddress={currentWallet} />
            </div>
            
            {/* Wallet Clustering - spans full width */}
            <div className="md:col-span-2 lg:col-span-3">
              <ComingSoonCard 
                title="Wallet Clustering" 
                description="Multi-wallet behavior analysis"
                features={["Connected wallets", "Cross-chain activity", "Identity clustering"]}
                size="medium"
              />
            </div>
          </div>
        );
      
      case "insight":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ModernMissedOpportunitiesCard walletAddress={currentWallet} />
              <ModernTimingAnalysisCard walletAddress={currentWallet} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ModernConvictionMappingCard walletAddress={currentWallet} />
              <IntegratedInsightsCard walletAddress={currentWallet} />
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Performance Metrics</h3>
                <p className="text-muted-foreground">Advanced performance analytics coming soon</p>
              </div>
            </div>
          </div>
        );
      
      case "influence":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ModernWhaleFollowingCard walletAddress={currentWallet} />
              <ModernAlphaSyncCard walletAddress={currentWallet} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Market Impact</h3>
                <p className="text-muted-foreground">Transaction impact analysis coming soon</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Social Signals</h3>
                <p className="text-muted-foreground">Social media influence tracking coming soon</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-xl font-semibold text-foreground mb-4">Network Position</h3>
                <p className="text-muted-foreground">Wallet network analysis coming soon</p>
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
