import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { ExpandableDrawer, CompactCard } from "@/components/expandable-drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const { isSimulated } = useWallet();
  const { refreshAll } = useRefreshData();

  const openDrawer = (drawerType: string) => {
    setActiveDrawer(drawerType);
  };

  const closeDrawer = () => {
    setActiveDrawer(null);
  };
  
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 w-full">
              <CompactCard
                title="Whisperer Score"
                value="847"
                label="/1000"
                badge="Elite Trader"
                badgeVariant="default"
                description="Psychological trading intelligence"
                onClick={() => openDrawer('whisperer')}
              />
              
              <CompactCard
                title="Degen Score"
                value="73"
                label="/100"
                badge="High Risk"
                badgeVariant="destructive"
                description="Risk appetite indicator"
                onClick={() => openDrawer('degen')}
              />
              
              <CompactCard
                title="Risk Appetite"
                value="Medium"
                badge="Balanced"
                badgeVariant="secondary"
                description="Conservative with selective risks"
                onClick={() => openDrawer('risk')}
              />
              
              <CompactCard
                title="Win Rate"
                value="68%"
                badge="Above Average"
                badgeVariant="default"
                description="Successful trade percentage"
                onClick={() => openDrawer('performance')}
              />
              
              <CompactCard
                title="Portfolio"
                value="$127K"
                badge="Diversified"
                badgeVariant="secondary"
                description="Total wallet value"
                onClick={() => openDrawer('portfolio')}
              />
              
              <CompactCard
                title="Labels"
                value="12"
                badge="Active"
                badgeVariant="default"
                description="Behavioral classifications"
                onClick={() => openDrawer('labels')}
              />
            </div>

            {/* Expandable Drawers */}
            <ExpandableDrawer
              isOpen={activeDrawer === 'whisperer'}
              onClose={closeDrawer}
              title="Whisperer Score Analysis"
              subtitle="Deep psychological trading intelligence breakdown"
            >
              <ModernWhispererScoreCard walletAddress={currentWallet} />
            </ExpandableDrawer>

            <ExpandableDrawer
              isOpen={activeDrawer === 'degen'}
              onClose={closeDrawer}
              title="Degen Score Breakdown"
              subtitle="Risk appetite and speculation tendencies"
            >
              <EnhancedDegenScoreCard walletAddress={currentWallet} />
            </ExpandableDrawer>

            <ExpandableDrawer
              isOpen={activeDrawer === 'risk'}
              onClose={closeDrawer}
              title="Risk Profile Analysis"
              subtitle="Trading behavior and risk management patterns"
            >
              <ModernRiskAppetiteCard walletAddress={currentWallet} />
            </ExpandableDrawer>

            <ExpandableDrawer
              isOpen={activeDrawer === 'labels'}
              onClose={closeDrawer}
              title="Behavioral Labels"
              subtitle="AI-powered trading personality insights"
            >
              <ModernLabelSummaryCard walletAddress={currentWallet} />
            </ExpandableDrawer>
          </>
        );
      
      case "behavior":
        return (
          <div className="space-y-4 w-full">
            {/* Top Row - Trading Metrics */}
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-6">
                <ModernTradeFrequencyCard walletAddress={currentWallet} />
              </div>
              <div className="col-span-6">
                <ModernTokenCategoryCard walletAddress={currentWallet} />
              </div>
            </div>
            
            {/* Bottom Row - Degen Score */}
            <div className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12">
                <EnhancedDegenScoreCard walletAddress={currentWallet} />
              </div>
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
        <main className="flex-1 overflow-auto p-4 w-full">
          <div className="w-full max-w-none">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
