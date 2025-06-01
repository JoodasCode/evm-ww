import { Brain, PieChart as PieChartIcon, Clock, Activity, Diamond, Scale, Zap, LineChart as LineChartIcon, BarChart3, Flame, Target, Lightbulb, Gauge, Radar, Heart, Timer, TrendingUp, AlertTriangle, BrainCircuit } from "lucide-react";
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

interface DetailedPsychoanalyticsTabProps {
  walletAddress: string;
}

export function DetailedPsychoanalyticsTab({ walletAddress }: DetailedPsychoanalyticsTabProps) {
  // Mock data for charts
  const emotionData = [
    { name: "Greed", value: 85 },
    { name: "Fear", value: 35 },
    { name: "Hope", value: 65 },
    { name: "Regret", value: 50 },
    { name: "Euphoria", value: 75 },
    { name: "Panic", value: 30 }
  ];

  const timeData = [
    { name: "Mon", value: 35 },
    { name: "Tue", value: 45 },
    { name: "Wed", value: 25 },
    { name: "Thu", value: 60 },
    { name: "Fri", value: 85 },
    { name: "Sat", value: 70 },
    { name: "Sun", value: 40 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Wallet Personality Layer</h2>
          <p className="text-muted-foreground">Full psychological analysis of your trading psyche</p>
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
        {/* Card 31: Trader Archetype */}
        <CardItem
          icon={Brain}
          title="Trader Archetype"
          description="Your dominant trading personality"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Flame className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Momentum Hunter</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                You chase trends and momentum, often with high conviction
              </p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Secondary Type</p>
                <p className="font-medium">Contrarian</p>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground">Archetype Match</p>
                <p className="font-medium">87%</p>
              </div>
            </div>
          </div>
        </CardItem>

        {/* Card 32: Hoarder vs Operator */}
        <CardItem
          icon={PieChartIcon}
          title="Hoarder vs Operator"
          description="How you utilize your assets"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={72} size={150} thickness={15} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Hoarder</p>
                <p className="font-medium">28%</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground">Operator</p>
                <p className="font-medium text-primary">72%</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're primarily an operator — actively trading rather than holding.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 33: Trading Time Psychology */}
        <CardItem
          icon={Clock}
          title="Trading Time Psychology"
          description="When you trade and what it reveals"
          loading={false}
        >
          <div className="space-y-4">
            <TradingFrequencyChart 
              data={timeData}
              peakDay="Fri"
              restDays="0.65"
              consistency="85%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You're a weekend warrior — 85% of trades happen Friday-Saturday.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 34: Emotional Trading Patterns */}
        <CardItem
          icon={Activity}
          title="Emotional Trading Patterns"
          description="How emotions influence your decisions"
          loading={false}
        >
          <div className="space-y-4">
            <CostSensitivityChart 
              data={emotionData}
              speedPriority="High"
              mevProtection="Low"
              premiumTolerance="72%"
            />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Greed and euphoria dominate your trading emotions by a wide margin.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 35: Risk Tolerance Profile */}
        <CardItem
          icon={Target}
          title="Risk Tolerance Profile"
          description="Your approach to risk and volatility"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <PsychoScoreGauge 
                score={82} 
                percentile="82nd" 
                trend={{ value: "+12% vs last month", direction: "up" }}
                analysis="High risk tolerance with strong conviction"
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your risk tolerance is extremely high — 82nd percentile among traders.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 36: Dopamine Loop Detection */}
        <CardItem
          icon={Flame}
          title="Dopamine Loop Detection"
          description="Addictive trading patterns"
          loading={false}
        >
          <div className="space-y-4">
            <div className="space-y-3">
              {[
                { label: "Trading Frequency", value: 92, status: "Unhealthy" },
                { label: "Position Size Escalation", value: 78, status: "Unhealthy" },
                { label: "Win Celebration Duration", value: 45, status: "Healthy" },
                { label: "Loss Recovery Attempts", value: 85, status: "Unhealthy" }
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span 
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        item.status === "Healthy" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <Progress 
                    value={item.value} 
                    className={cn(
                      "h-2", 
                      item.status === "Healthy" ? "bg-green-500/20" : "bg-red-500/20"
                    )} 
                  />
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                You show signs of dopamine addiction in your trading patterns.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 37: Trading Flow State */}
        <CardItem
          icon={Gauge}
          title="Trading Flow State"
          description="When you enter the zone"
          loading={false}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Morning", value: 35, active: false },
                { label: "Afternoon", value: 85, active: true },
                { label: "Evening", value: 65, active: false },
                { label: "Late Night", value: 40, active: false }
              ].map((item) => (
                <div 
                  key={item.label} 
                  className={cn(
                    "p-3 rounded-lg border text-center",
                    item.active ? "border-primary bg-primary/5" : "border-border bg-muted/5"
                  )}
                >
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className={cn(
                    "text-xl font-bold mt-1",
                    item.active ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.value}%
                  </p>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your flow state peaks in the afternoon — 85% performance boost.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 38: Trading Wisdom Score */}
        <CardItem
          icon={Lightbulb}
          title="Trading Wisdom Score"
          description="Learning from mistakes and adapting"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={63} size={150} thickness={15} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <p className="text-xs text-muted-foreground">Mistake Repetition</p>
                <p className="font-medium text-amber-500">Medium</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Adaptation Speed</p>
                <p className="font-medium text-green-500">Fast</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your wisdom score is above average — you learn from mistakes quickly.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 39: Overconfidence Score */}
        <CardItem
          icon={Target}
          title="Overconfidence Score"
          description="High stakes + declining accuracy"
          loading={false}
        >
          <div className="space-y-4">
            <div className="flex justify-center">
              <GaugeChart value={78} size={150} thickness={15} />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Confidence Level</p>
                <p className="font-medium text-red-500">Rising</p>
              </div>
              <div className="p-2 bg-muted/20 rounded-lg">
                <p className="text-xs text-muted-foreground">Win Rate</p>
                <p className="font-medium text-red-500">Declining</p>
              </div>
            </div>
            
            <div className="p-3 bg-muted/20 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Risk Factor</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-500">High</span>
              </div>
              <Progress value={78} className="h-2 bg-red-500/20" />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Your confidence is rising while win rate drops — overconfidence alert.
              </p>
            </div>
          </div>
        </CardItem>

        {/* Card 40: Confidence Volatility */}
        <CardItem
          icon={Activity}
          title="Confidence Volatility"
          description="Variation in trade sizing after wins/losses"
          loading={false}
        >
          <div className="space-y-4">
            <TradingFrequencyChart 
              data={[
                { name: "Mon", value: 20 },
                { name: "Tue", value: 80 },
                { name: "Wed", value: 30 },
                { name: "Thu", value: 90 },
                { name: "Fri", value: 40 },
                { name: "Sat", value: 85 },
                { name: "Sun", value: 25 }
              ]}
              peakDay="Thu"
              restDays="0.54"
              consistency="High Volatility"
            />
            
            <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Post-Win Sizing</p>
                <p className="font-medium text-green-500">+65%</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Post-Loss Sizing</p>
                <p className="font-medium text-red-500">+120%</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Big sizing shifts after losses — emotional volatility detected.
              </p>
            </div>
          </div>
        </CardItem>
      </CardLayout>
    </div>
  );
}
