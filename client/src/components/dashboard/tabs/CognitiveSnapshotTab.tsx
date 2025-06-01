import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Brain, Zap, Target, Shield, User, TrendingUp, Star, TrendingDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DetailedTabLayout } from "../layout/DetailedTabLayout";
import { DetailedCard } from "../cards/DetailedCard";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface CognitiveSnapshotTabProps {
  walletAddress: string;
}

export function CognitiveSnapshotTab({ walletAddress }: CognitiveSnapshotTabProps) {
  // Mock data for cognitive snapshot
  const cognitiveData = {
    archetypeClassifier: {
      primary: "Strategic Accumulator",
      confidence: 89,
      traits: ["Patient", "Research-driven", "Long-term focused"]
    },
    tradingRhythm: {
      frequency: "Weekly",
      weeklyPattern: [
        { day: "Mon", trades: 3 },
        { day: "Tue", trades: 1 },
        { day: "Wed", trades: 2 },
        { day: "Thu", trades: 5 },
        { day: "Fri", trades: 2 },
        { day: "Sat", trades: 0 },
        { day: "Sun", trades: 1 }
      ],
      peakHours: ["10-12 PM", "2-4 PM"],
      consistency: 76
    },
    riskAppetite: {
      level: "Moderate-High",
      score: 72,
      volatilityTolerance: 68,
      positionSizing: "Calculated"
    },
    personalityArchetype: {
      primary: "Strategic Accumulator",
      secondary: "Value Hunter",
      confidence: 89,
      traits: ["Patient", "Research-driven", "Long-term focused", "Risk-calculated"]
    },
    trustCircuits: {
      primaryDex: "Jupiter",
      loyalty: 85,
      exploration: 23,
      protocolDiversity: 7,
      explorationTendency: "Conservative",
      protocolDistribution: [
        { protocol: "Jupiter", usage: 45 },
        { protocol: "Raydium", usage: 25 },
        { protocol: "Orca", usage: 20 },
        { protocol: "Others", usage: 10 }
      ]
    }
  };

  // Use mock data for display
  const displayData = {
    archetype: cognitiveData.archetypeClassifier.primary,
    confidence: cognitiveData.archetypeClassifier.confidence,
    traits: cognitiveData.archetypeClassifier.traits,
    riskLevel: cognitiveData.riskAppetite.level,
    riskScore: cognitiveData.riskAppetite.score,
    frequency: cognitiveData.tradingRhythm.frequency,
    weeklyPattern: cognitiveData.tradingRhythm.weeklyPattern
  };

  const chartConfig = {
    trades: {
      label: "Trades",
      color: "hsl(var(--chart-1))",
    },
    riskTolerance: {
      label: "Risk Tolerance",
      color: "hsl(var(--chart-1))",
    },
    confidence: {
      label: "Confidence", 
      color: "hsl(var(--chart-2))",
    },
    activity: {
      label: "Trading Activity",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <DetailedTabLayout
      title="Cognitive Snapshot"
      description="Your wallet's mental profile at a glance"
      walletAddress={walletAddress}
    >
        
        {/* Impulse Control */}
        <DetailedCard
          icon={Zap}
          title="Impulse Control"
          description="How you handle market volatility"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{displayData.riskLevel}</div>
              <div className="text-sm text-muted-foreground">
                Risk Score: {displayData.riskScore}
              </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayData.weeklyPattern} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="trades" fill="var(--color-trades)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium text-foreground">1.4</div>
                <div className="text-muted-foreground">Avg trades/day</div>
              </div>
              <div className="text-center">
                <div className="font-medium text-foreground">3.2h</div>
                <div className="text-muted-foreground">Decision time</div>
              </div>
            </div>
          </div>
        </DetailedCard>

        {/* Cognitive Load */}
        <DetailedCard
          icon={Brain}
          title="Cognitive Load"
          description="Portfolio complexity and mental bandwidth"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{displayData.archetype}</div>
              <div className="text-sm text-muted-foreground">
                {displayData.confidence}% confidence
              </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <Pie
                    data={[
                      { name: 'Risk Tolerance', value: displayData.riskScore },
                      { name: 'Confidence', value: displayData.confidence },
                      { name: 'Trading Activity', value: displayData.frequency === 'Low' ? 30 : 70 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {[
                      { name: 'Risk Tolerance', color: 'var(--color-riskTolerance)' },
                      { name: 'Confidence', color: 'var(--color-confidence)' },
                      { name: 'Trading Activity', color: 'var(--color-activity)' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-2">
              {displayData.traits.map((trait: string, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>{trait}</span>
                  </div>
                  <span className="font-medium">Active</span>
                </div>
              ))}
            </div>
          </div>
        </DetailedCard>

        {/* Personality Archetype */}
        <DetailedCard
          icon={Target}
          title="Personality Archetype"
          description="Your trading psyche classification"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-xl font-bold text-foreground">
                {cognitiveData.personalityArchetype.primary}
              </div>
              <Badge variant="secondary" className="text-sm">
                {cognitiveData.personalityArchetype.secondary}
              </Badge>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Confidence</span>
                <span className="text-sm font-bold">{cognitiveData.personalityArchetype.confidence}%</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cognitiveData.personalityArchetype.confidence}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Behavioral Traits</div>
              <div className="flex flex-wrap gap-2">
                {cognitiveData.personalityArchetype.traits.map((trait) => (
                  <Badge key={trait} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </DetailedCard>

        {/* Trust Circuits */}
        <DetailedCard
          icon={Shield}
          title="Trust Circuits"
          description="Protocol loyalty and exploration patterns"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{cognitiveData.trustCircuits.primaryDex}</div>
              <div className="text-sm text-muted-foreground">
                {cognitiveData.trustCircuits.loyalty}% loyalty • {cognitiveData.trustCircuits.explorationTendency}
              </div>
            </div>
            
            <div className="space-y-3">
              {cognitiveData.trustCircuits.protocolDistribution.map((protocol) => (
                <div key={protocol.protocol} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{protocol.protocol}</span>
                    <span className="text-muted-foreground">{protocol.usage}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${protocol.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-xs text-muted-foreground mb-1">Exploration Tendency</div>
              <div className="text-sm font-medium text-foreground">
                {cognitiveData.trustCircuits.explorationTendency}
              </div>
            </div>
          </div>
        </DetailedCard>

        {/* Behavioral Archetype */}
        <DetailedCard
          icon={User}
          title="Behavioral Archetype"
          description="Who you are at a glance"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-2">The Strategist</div>
              <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
                Premium fee strategy + Protocol diversity
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="font-medium text-muted-foreground">High</div>
                <div className="text-muted-foreground">Conviction</div>
              </div>
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="font-medium text-muted-foreground">Selective</div>
                <div className="text-muted-foreground">Entry</div>
              </div>
              <div className="text-center p-2 bg-primary/10 rounded">
                <div className="font-medium text-muted-foreground">Patient</div>
                <div className="text-muted-foreground">Execution</div>
              </div>
            </div>
          </div>
        </DetailedCard>

        {/* Protocol Alpha Score */}
        <DetailedCard
          icon={TrendingUp}
          title="Protocol Alpha Score"
          description="Your early adoption patterns"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Early Adopter</div>
              <div className="text-sm text-muted-foreground">
                Jupiter power user since month 2
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Jupiter early adoption</span>
                <span className="text-muted-foreground">+89% volume boost</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Raydium usage timing</span>
                <span className="text-muted-foreground">Before hype</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Protocol diversity</span>
                <span className="text-muted-foreground">7 platforms</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Alpha Score</div>
              <div className="text-2xl font-bold text-muted-foreground mt-1">85/100</div>
            </div>
          </div>
        </DetailedCard>

        {/* Conviction Collapse Detector */}
        <DetailedCard
          icon={TrendingDown}
          title="Conviction Collapse Detector"
          description="When did you lose trust in yourself?"
          loading={false}
        >
          <div className="space-y-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
              <div className="text-sm font-medium text-muted-foreground">Conviction Status</div>
              <div className="text-lg font-bold text-muted-foreground mt-1">Stable</div>
              <div className="text-xs text-muted-foreground mt-1">
                No collapse detected in last 60 days
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-foreground">Position Sizing</div>
                <div className="text-xs text-muted-foreground mt-1">
                  8.7M lamports avg *(≈ 0.0087 SOL / $1.60)*
                </div>
                <Badge variant="secondary" className="mt-2 text-xs bg-primary/10 text-muted-foreground">
                  Consistent
                </Badge>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-foreground">Trade Frequency</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1.2 trades/day variance: 23%
                </div>
                <Badge variant="secondary" className="mt-2 text-xs bg-primary/10 text-muted-foreground">
                  Disciplined
                </Badge>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-border">
              <div className="text-sm font-medium text-muted-foreground">Last Major Decision</div>
              <div className="text-xs text-muted-foreground mt-1">
                Dec 15: Increased SOL position by 67% after 3-day analysis period
              </div>
            </div>
          </div>
        </DetailedCard>
    </DetailedTabLayout>
  );
}