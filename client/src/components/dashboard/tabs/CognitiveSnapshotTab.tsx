
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Brain, Zap, Target, Shield, User, TrendingUp, Star, TrendingDown } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cognitive Snapshot</h2>
          <p className="text-muted-foreground">Your wallet's mental profile at a glance</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Impulse Control */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Impulse Control</CardTitle>
                  <CardDescription>Trading frequency and discipline patterns</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Are you a trigger-happy degen or a disciplined sniper?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Cognitive Load */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Brain className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Cognitive Load</CardTitle>
                  <CardDescription>Portfolio complexity and mental bandwidth</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How many narratives are you juggling at once?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Personality Archetype */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Personality Archetype</CardTitle>
                  <CardDescription>Your trading psyche classification</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your trading psyche: the Strategist? the Spray-and-Pray?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Trust Circuits */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Trust Circuits</CardTitle>
                  <CardDescription>Protocol loyalty and exploration patterns</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Which DEXs do you gravitate toward? Do you stay loyal?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Behavioral Archetype */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Behavioral Archetype</CardTitle>
                  <CardDescription>Who you are at a glance</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-2">The Strategist</div>
              <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-purple-500/20">
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
          </CardContent>
        </Card>

        {/* Protocol Alpha Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 ring-1 ring-violet-500/20">
                  <Star className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Protocol Alpha Score</CardTitle>
                  <CardDescription>Using DEXs before they become mainstream</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-400 mb-1">Early Adopter</div>
              <div className="text-sm text-muted-foreground">
                Jupiter power user since month 2
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Jupiter early adoption</span>
                <span className="text-violet-400">+89% volume boost</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Raydium usage timing</span>
                <span className="text-muted-foreground">Before hype</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Protocol diversity</span>
                <span className="text-violet-400">7 platforms</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-violet-500/10 rounded-lg">
              <div className="text-sm font-medium text-violet-400">Alpha Score</div>
              <div className="text-2xl font-bold text-violet-400 mt-1">85/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Conviction Collapse Detector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <TrendingDown className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Conviction Collapse Detector</CardTitle>
                  <CardDescription>When did you lose trust in yourself?</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-3 bg-primary/5 rounded-lg border border-green-500/20">
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
            
            <div className="p-3 bg-primary/5 rounded-lg border border-blue-500/20">
              <div className="text-sm font-medium text-muted-foreground">Last Major Decision</div>
              <div className="text-xs text-muted-foreground mt-1">
                Dec 15: Increased SOL position by 67% after 3-day analysis period
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}