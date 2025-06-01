import { Brain, LineChart as LineChartIcon, Heart, Timer, Zap, TrendingUp, AlertTriangle, Lightbulb, BrainCircuit, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CardLayout, CardItem } from "@/components/ui/card-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { TradingFrequencyChart } from "../charts/AreaChart";
import { CostSensitivityChart } from "../charts/LineChart";
import { GaugeChart, PsychoScoreGauge } from "../charts/GaugeChart";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip
} from "recharts";

// Custom chart component for position growth
const PositionGrowthChart = ({ data }: { data: { name: string; value: number }[] }) => {
  return (
    <CostSensitivityChart
      data={data}
      speedPriority="Medium"
      mevProtection="Medium"
      premiumTolerance="38%"
    />
  );
};

interface DetailedInsightsTabProps {
  walletAddress: string;
}

export function DetailedInsightsTab({ walletAddress }: DetailedInsightsTabProps) {
  // Mock data for charts
  const sentimentData = [
    { name: "Mon", value: 30 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 20 },
    { name: "Thu", value: 80 },
    { name: "Fri", value: 65 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 55 }
  ];

  const liquidityData = [
    { name: "Low", value: 15 },
    { name: "Med", value: 25 },
    { name: "High", value: 60 },
    { name: "Extreme", value: 85 },
    { name: "Peak", value: 40 },
    { name: "Post-Peak", value: 30 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Self-Sabotage & Superpowers</h2>
          <p className="text-muted-foreground">Pattern recognition to surface unconscious trading behavior</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            Last 30 days
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
          </Badge>
        </div>
      </div>

      {/* 2x2 grid layout with CardLayout */}
      <CardLayout>
        {/* Card 21: Psychological Strengths */}
        <CardItem
          icon={Brain}
          title="Psychological Strengths"
          description="Your trading superpowers"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Conviction Strength", value: 92, color: "bg-green-500" },
                { label: "Pattern Recognition", value: 87, color: "bg-green-500" },
                { label: "Emotional Discipline", value: 76, color: "bg-blue-500" }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className={cn("h-2", item.color)} />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your conviction strength is exceptional — you hold positions with confidence.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 22: Psychological Weaknesses */}
        <CardItem
          icon={AlertTriangle}
          title="Psychological Weaknesses"
          description="Your trading blind spots"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "FOMO Susceptibility", value: 78, color: "bg-red-500" },
                { label: "Loss Aversion", value: 65, color: "bg-red-500" },
                { label: "Overconfidence", value: 54, color: "bg-amber-500" }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                  <Progress value={item.value} className={cn("h-2", item.color)} />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your FOMO is high — you chase pumps and often buy near local tops.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 23: Liquidity Lurker Score */}
        <CardItem
          icon={Zap}
          title="Liquidity Lurker Score"
          description="How you interact with market liquidity"
          loading={false}
        >
          <div className="space-y-4">
            <CostSensitivityChart 
              data={liquidityData}
              speedPriority="Very High"
              mevProtection="Low"
              premiumTolerance="92%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You hunt high liquidity — 78% of trades occur in peak market conditions.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 24: Sentimental Attachment */}
        <CardItem
          icon={Heart}
          title="Sentimental Attachment"
          description="Tokens you can't let go of"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { token: "SOL", days: 142, status: "Healthy" },
                  { token: "BONK", days: 87, status: "Unhealthy" },
                  { token: "JTO", days: 64, status: "Healthy" },
                  { token: "PYTH", days: 38, status: "Neutral" }
                ].map((item) => (
                  <div 
                    key={item.token} 
                    className={cn(
                      "p-3 rounded-lg border",
                      item.status === "Healthy" ? "border-green-500/30 bg-green-500/5" :
                      item.status === "Unhealthy" ? "border-red-500/30 bg-red-500/5" :
                      "border-amber-500/30 bg-amber-500/5"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.token}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-background">{item.days} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You have unhealthy attachment to BONK — holding through -72% drawdown.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 25: Patience Psychology */}
        <CardItem
          icon={Timer}
          title="Patience Psychology"
          description="Trading timing patterns"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={42} size={150} thickness={15} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Avg Hold Time</p>
                <p className="font-medium">4.2 days</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Patience Percentile</p>
                <p className="font-medium">42nd</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your patience is below average — you exit positions too quickly.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 26: Market Sentiment Correlation */}
        <CardItem
          icon={LineChartIcon}
          title="Market Sentiment Correlation"
          description="How your trading aligns with market mood"
          loading={false}
        >
          <div className="space-y-4">
            <TradingFrequencyChart 
              data={sentimentData}
              peakDay="Thu"
              restDays="0.65"
              consistency="81%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're a contrarian — 81% of your buys happen during market fear.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 27: Trading Insight Generator */}
        <CardItem
          icon={Lightbulb}
          title="Trading Insight Generator"
          description="AI-generated insights from your patterns"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm italic">
                "Your best trades happen when you wait at least 48 hours before entering. When you rush in within 6 hours of discovering a token, your win rate drops by 68%."
              </p>
            </div>
            
            <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm italic">
                "You consistently sell too early on uptrends. If you had held your top 5 winners just 24 hours longer, your portfolio would be 31% larger."
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Insights based on 237 trades across 30 days of activity.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 28: Cognitive Bias Detection */}
        <CardItem
          icon={BrainCircuit}
          title="Cognitive Bias Detection"
          description="Unconscious biases affecting your trading"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { bias: "Anchoring Bias", severity: 82, description: "Fixating on entry prices" },
                { bias: "Confirmation Bias", severity: 67, description: "Seeking validating info" },
                { bias: "Recency Bias", severity: 54, description: "Overweighting recent events" }
              ].map((item) => (
                <div key={item.bias} className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{item.bias}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-background">{item.severity}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your anchoring bias is extremely high — you're fixated on entry prices.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 29: Average Position Growth */}
        <CardItem
          icon={TrendingUp}
          title="Average Position Growth"
          description="Whether your average position size is increasing"
          loading={false}
        >
          <div className="space-y-4">
            <PositionGrowthChart 
              data={[
                { name: "Jan", value: 100 },
                { name: "Feb", value: 115 },
                { name: "Mar", value: 130 },
                { name: "Apr", value: 125 },
                { name: "May", value: 138 },
                { name: "Jun", value: 145 }
              ]}
            />
            
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">3-Month Growth</p>
                <p className="font-medium text-green-500">+38%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Avg Position</p>
                <p className="font-medium">$3,240</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Percentile</p>
                <p className="font-medium">72nd</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your average trade has grown 38% over the last 3 months — rising conviction.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 30: Flip Direction Bias */}
        <CardItem
          icon={Flame}
          title="Flip Direction Bias"
          description="Do you flip from winners or losers more"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center py-2">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: "After Loss", value: 74 },
                        { name: "After Win", value: 26 }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      <Cell fill="#ef4444" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-md shadow-sm p-2 text-xs">
                              <p>{`${payload[0].name}: ${payload[0].value}%`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">After Loss (74%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">After Win (26%)</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                74% of flips are after a loss — emotional reset patterns detected.
              </p>
            </div>
          </div>
        </CardItem>
      </CardLayout>
    </div>
  );
}
