import { Brain, Diamond, TrendingDown, Scale, Clock, BarChart3, PieChart, Shuffle, Target, Calculator } from "lucide-react";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { DetailedTabLayout } from "../layout/DetailedTabLayout";
import { DetailedCard } from "../cards/DetailedCard";
import { TradingFrequencyChart } from "../charts/AreaChart";
import { CostSensitivityChart } from "../charts/LineChart";
import { GaugeChart } from "../charts/GaugeChart";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface DetailedCognitivePatternsTabProps {
  walletAddress: string;
}

export function DetailedCognitivePatternsTab({ walletAddress }: DetailedCognitivePatternsTabProps) {
  // Mock data for trading frequency chart
  const weekdayData = [
    { name: "Mon", value: 20 },
    { name: "Tue", value: 5 },
    { name: "Wed", value: 60 },
    { name: "Thu", value: 100 },
    { name: "Fri", value: 80 },
    { name: "Sat", value: 10 },
    { name: "Sun", value: 30 }
  ];

  // Mock data for cost sensitivity chart
  const timeData = [
    { name: "6AM", value: 5 },
    { name: "9AM", value: 12 },
    { name: "12PM", value: 8 },
    { name: "3PM", value: 16 },
    { name: "6PM", value: 7 },
    { name: "9PM", value: 11 }
  ];

  return (
    <DetailedTabLayout
      title="Cognitive Patterns"
      description="Decoding habits, compulsions, and trading biases"
      walletAddress={walletAddress}
    >
        {/* Card 11: Position Sizing Psychology */}
        <DetailedCard
          icon={Scale}
          title="Position Sizing Psychology"
          description="Variation in position sizes"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              {['SOL', 'BONK', 'JTO', 'PYTH', 'RNDR'].map((token, index) => {
                const value = [78, 65, 52, 45, 38][index];
                return (
                  <div key={token} className="space-y-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{token}</span>
                      <span className="text-sm font-medium">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                );
              })}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your sizing shows moderate variance — suggests strategic but adaptive risk.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 12: Profit Discipline */}
        <DetailedCard
          icon={Target}
          title="Profit Discipline"
          description="Consistency in profitable exits"
          loading={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 text-center p-4 bg-muted/20 rounded-lg">
                <span className="text-3xl font-bold text-green-500">61%</span>
                <p className="text-xs text-muted-foreground">Profit-taking consistency</p>
              </div>
              <div className="space-y-1 text-center p-4 bg-muted/20 rounded-lg">
                <span className="text-3xl font-bold text-red-500">39%</span>
                <p className="text-xs text-muted-foreground">Missed opportunities</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You show a 61% profit-taking consistency — balanced, but watch overtrading.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 13: Entry/Exit Timing */}
        <DetailedCard
          icon={Clock}
          title="Entry/Exit Timing"
          description="When you buy and sell"
          loading={false}
        >
          <div className="space-y-4">
            <TradingFrequencyChart 
              data={weekdayData}
              peakDay="Thu"
              restDays="0.8"
              consistency="72%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Most exits happen too early — you're leaving 11% on the table.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 14: Trade Burst Pattern */}
        <DetailedCard
          icon={TrendingDown}
          title="Trade Burst Pattern"
          description="Clustering of trades"
          loading={false}
        >
          <div className="space-y-4">
            <CostSensitivityChart 
              data={timeData}
              speedPriority="High"
              mevProtection="Very High"
              premiumTolerance="89%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're a binge trader — 82% of trades happen in 3-hour bursts.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 15: Favorite Time to Trade */}
        <DetailedCard
          icon={Clock}
          title="Favorite Time to Trade"
          description="Your most active hours"
          loading={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {['Morning', 'Midday', 'Evening', 'Night'].map((time, index) => {
                const active = index === 2;
                return (
                  <div 
                    key={time} 
                    className={cn(
                      "p-3 text-center rounded-lg border", 
                      active ? "bg-primary/10 border-primary" : "bg-muted/10 border-border"
                    )}
                  >
                    <p className={cn("text-sm font-medium", active ? "text-primary" : "text-muted-foreground")}>{time}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-center">
              <div className="inline-flex items-center justify-center rounded-md bg-muted px-3 py-1 text-sm font-medium">
                Most active between 3–5 PM UTC
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're most active between 3–5 PM UTC — peak hours precision.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 16: Token Rotation Score */}
        <DetailedCard
          icon={Shuffle}
          title="Token Rotation Score"
          description="How often you change focus"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={78} size={150} thickness={15} />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">27 unique tokens in 30 days</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You rotate tokens aggressively — 27 unique tokens in 30 days.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 17: Concentration Index (HHI) */}
        <DetailedCard
          icon={PieChart}
          title="Concentration Index (HHI)"
          description="Portfolio concentration"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={68} size={150} thickness={15} />
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium">68% of portfolio in 2 tokens</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're highly concentrated — 68% of your portfolio is in 2 tokens.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 18: Portfolio Entropy */}
        <DetailedCard
          icon={Calculator}
          title="Portfolio Entropy"
          description="Uncertainty in portfolio distribution"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <span className="text-6xl font-bold">0.61</span>
                <p className="text-sm text-muted-foreground mt-2">Entropy Score (0-1)</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your entropy score is 0.61 — moderate diversification.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 19: Active Token Count */}
        <DetailedCard
          icon={BarChart3}
          title="Active Token Count"
          description="Unique tokens touched in time range"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="text-center">
                <span className="text-6xl font-bold">14</span>
                <p className="text-sm text-muted-foreground mt-2">Different tokens this week</p>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Weekly Average</span>
                <span className="text-sm font-medium">8.5</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">You're in the top 35% for token diversity</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You've traded 14 different tokens this week — active and curious.
              </p>
            </div>
          </div>
        </DetailedCard>

        {/* Card 20: Flip Speed by Token */}
        <DetailedCard
          icon={Clock}
          title="Flip Speed by Token"
          description="Hold time per token"
          loading={false}
        >
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Token</th>
                    <th className="text-right py-2 font-medium">Avg Hold</th>
                    <th className="text-right py-2 font-medium">Flips</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { token: "$LFG", hold: "6h", flips: 8, fast: true },
                    { token: "$BONK", hold: "2.3d", flips: 5, fast: false },
                    { token: "$JTO", hold: "12h", flips: 4, fast: true },
                    { token: "$SOL", hold: "8.5d", flips: 3, fast: false },
                    { token: "$PYTH", hold: "1.2d", flips: 2, fast: false }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-muted">
                      <td className="py-2">{row.token}</td>
                      <td className={cn("text-right py-2", row.fast ? "text-amber-500" : "")}>{row.hold}</td>
                      <td className="text-right py-2">{row.flips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                $LFG gets flipped in 6h on average — you're fast on conviction decay.
              </p>
            </div>
          </div>
        </DetailedCard>
    </DetailedTabLayout>
  );
}
