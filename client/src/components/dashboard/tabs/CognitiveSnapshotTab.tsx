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
  // Mock data structure - replace with actual API call
  const cognitiveData = {
    impulseControl: {
      level: "Disciplined Sniper",
      score: 73,
      dailyTrades: [
        { day: 'Mon', trades: 2 },
        { day: 'Tue', trades: 0 },
        { day: 'Wed', trades: 1 },
        { day: 'Thu', trades: 4 },
        { day: 'Fri', trades: 1 },
        { day: 'Sat', trades: 0 },
        { day: 'Sun', trades: 2 }
      ],
      percentile: 82
    },
    cognitiveLoad: {
      level: "Focused Conviction",
      activeNarratives: 3,
      portfolioComplexity: [
        { name: 'SOL', value: 85, color: '#8B5CF6' },
        { name: 'Memes', value: 10, color: '#10B981' },
        { name: 'DeFi', value: 5, color: '#F59E0B' }
      ],
      concentrationIndex: 0.85
    },
    personalityArchetype: {
      primary: "Whale Premium Strategist",
      secondary: "MEV-Protected Trader",
      confidence: 89,
      traits: ["Patient", "Strategic", "Quality-Focused"]
    },
    trustCircuits: {
      primaryDex: "Jupiter",
      loyalty: 76,
      protocolDistribution: [
        { protocol: 'Jupiter', usage: 65 },
        { protocol: 'Raydium', usage: 25 },
        { protocol: 'Orca', usage: 10 }
      ],
      explorationTendency: "Conservative"
    }
  };

  const chartConfig = {
    trades: {
      label: "Trades",
      color: "hsl(var(--chart-1))",
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
                <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                  <Zap className="h-5 w-5 text-purple-400" />
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
              <div className="text-xl font-bold text-foreground">{cognitiveData.impulseControl.level}</div>
              <div className="text-sm text-muted-foreground">
                Top {100 - cognitiveData.impulseControl.percentile}% of traders
              </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cognitiveData.impulseControl.dailyTrades} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
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
                <div className="p-2.5 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <Brain className="h-5 w-5 text-emerald-400" />
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
              <div className="text-xl font-bold text-foreground">{cognitiveData.cognitiveLoad.level}</div>
              <div className="text-sm text-muted-foreground">
                {cognitiveData.cognitiveLoad.activeNarratives} active narratives
              </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <Pie
                    data={cognitiveData.cognitiveLoad.portfolioComplexity}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                  >
                    {cognitiveData.cognitiveLoad.portfolioComplexity.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-2">
              {cognitiveData.cognitiveLoad.portfolioComplexity.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
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
                <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                  <Target className="h-5 w-5 text-orange-400" />
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
                  className="bg-gradient-to-r from-orange-500 to-orange-400 h-2 rounded-full transition-all duration-500"
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
                <div className="p-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Shield className="h-5 w-5 text-blue-400" />
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
                      className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
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
                <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                  <User className="h-5 w-5 text-purple-400" />
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
              <div className="text-2xl font-bold text-purple-400 mb-2">The Strategist</div>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                Premium fee strategy + Protocol diversity
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center p-2 bg-purple-500/10 rounded">
                <div className="font-medium text-purple-400">High</div>
                <div className="text-muted-foreground">Conviction</div>
              </div>
              <div className="text-center p-2 bg-purple-500/10 rounded">
                <div className="font-medium text-purple-400">Selective</div>
                <div className="text-muted-foreground">Entry</div>
              </div>
              <div className="text-center p-2 bg-purple-500/10 rounded">
                <div className="font-medium text-purple-400">Patient</div>
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
                <span className="text-green-400">Before hype</span>
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
            <div className="text-center p-3 bg-green-500/5 rounded-lg border border-green-500/20">
              <div className="text-sm font-medium text-green-400">Conviction Status</div>
              <div className="text-lg font-bold text-green-400 mt-1">Stable</div>
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
                <Badge variant="secondary" className="mt-2 text-xs bg-green-500/10 text-green-400">
                  Consistent
                </Badge>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-foreground">Trade Frequency</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1.2 trades/day variance: 23%
                </div>
                <Badge variant="secondary" className="mt-2 text-xs bg-green-500/10 text-green-400">
                  Disciplined
                </Badge>
              </div>
            </div>
            
            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="text-sm font-medium text-blue-400">Last Major Decision</div>
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