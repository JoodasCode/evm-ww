import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Activity, DollarSign, Shuffle, Timer, Clock, Zap, Heart, Dice6, Search, TrendingUp, Copy } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface CognitivePatternsTabProps {
  walletAddress: string;
}

export function CognitivePatternsTab({ walletAddress }: CognitivePatternsTabProps) {
  // Real behavioral patterns data
  const patternsData = {
    dopamineLoop: {
      intensity: "Moderate Chaser",
      avgTradesPerDay: 1.4,
      weeklyPattern: [
        { day: 'Mon', trades: 2, mood: 'focused' },
        { day: 'Tue', trades: 0, mood: 'patient' },
        { day: 'Wed', trades: 1, mood: 'selective' },
        { day: 'Thu', trades: 4, mood: 'active' },
        { day: 'Fri', trades: 1, mood: 'cautious' },
        { day: 'Sat', trades: 0, mood: 'offline' },
        { day: 'Sun', trades: 2, mood: 'planning' }
      ],
      percentile: 65
    },
    costSensitivity: {
      strategy: "Premium Executor",
      avgFee: "8.75M lamports",
      feePattern: [
        { time: '6AM', fee: 5.2, urgency: 'low' },
        { time: '9AM', fee: 12.8, urgency: 'high' },
        { time: '12PM', fee: 8.1, urgency: 'medium' },
        { time: '3PM', fee: 15.6, urgency: 'high' },
        { time: '6PM', fee: 6.9, urgency: 'low' },
        { time: '9PM', fee: 11.2, urgency: 'medium' }
      ],
      willingnessToPayPremium: 89
    },
    mentalFragmentation: {
      level: "Focused Conviction",
      portfolioComplexity: "Low",
      meaningfulPositions: 3,
      dustRatio: 0,
      concentrationIndex: 85,
      fragmentationTrend: [
        { week: 'W1', complexity: 82 },
        { week: 'W2', complexity: 85 },
        { week: 'W3', complexity: 83 },
        { week: 'W4', complexity: 87 },
        { week: 'W5', complexity: 85 },
        { week: 'W6', complexity: 89 }
      ]
    },
    impulseThreshold: {
      level: "High Pain Tolerance",
      triggerSensitivity: 27, // Lower = higher threshold
      reactionTime: "3.2 hours",
      impulsiveActions: [
        { trigger: 'Price spike', frequency: 12, response: 'wait' },
        { trigger: 'Volume surge', frequency: 8, response: 'investigate' },
        { trigger: 'Social buzz', frequency: 3, response: 'ignore' },
        { trigger: 'Technical break', frequency: 15, response: 'act' }
      ]
    }
  };

  const chartConfig = {
    trades: { label: "Trades", color: "hsl(var(--chart-1))" },
    fee: { label: "Fee (M lamports)", color: "hsl(var(--chart-2))" },
    complexity: { label: "Complexity", color: "hsl(var(--chart-3))" },
    frequency: { label: "Frequency", color: "hsl(var(--chart-4))" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Cognitive Patterns</h2>
          <p className="text-muted-foreground">Decoding habits, compulsions, and trading biases</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            Last 30 days
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            {walletAddress.slice(0, 8)}...
          </Badge>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dopamine Loop */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <Activity className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Dopamine Loop</CardTitle>
                  <CardDescription>Trading frequency and reward-seeking behavior</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Are you chasing the dopamine hit from frequent trading?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{patternsData.dopamineLoop.intensity}</div>
                <div className="text-sm text-muted-foreground">
                  {patternsData.dopamineLoop.avgTradesPerDay} trades/day avg
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {patternsData.dopamineLoop.percentile}th percentile
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={patternsData.dopamineLoop.weeklyPattern} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="trades" 
                    stroke="var(--color-trades)" 
                    fill="var(--color-trades)" 
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Thu</div>
                <div className="text-muted-foreground">Peak day</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">0.8</div>
                <div className="text-muted-foreground">Rest days</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">72%</div>
                <div className="text-muted-foreground">Consistency</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Sensitivity */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Cost Sensitivity</CardTitle>
                  <CardDescription>Fee strategy and friction tolerance</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you care about friction or just want speed?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{patternsData.costSensitivity.strategy}</div>
                <div className="text-sm text-muted-foreground">
                  {patternsData.costSensitivity.avgFee} average
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {patternsData.costSensitivity.willingnessToPayPremium}% premium tolerance
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patternsData.costSensitivity.feePattern} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="fee" 
                    stroke="var(--color-fee)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-fee)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Speed Priority</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-background rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[89%]" />
                  </div>
                  <span className="font-medium">High</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>MEV Protection</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-background rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full w-[95%]" />
                  </div>
                  <span className="font-medium">Very High</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Discovery Engine */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
                  <Search className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Token Discovery Engine</CardTitle>
                  <CardDescription>Finding alpha before the crowd arrives</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400 mb-1">Early Adopter</div>
              <div className="text-sm text-muted-foreground">
                Found 3 tokens before 10x pumps
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Early BONK discovery</span>
                <span className="text-emerald-400">+340% timing</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>WIF entry timing</span>
                <span className="text-yellow-400">Crowd follower</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>SOL ecosystem tokens</span>
                <span className="text-emerald-400">65% early</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-emerald-500/10 rounded-lg">
              <div className="text-sm font-medium text-emerald-400">Discovery Score</div>
              <div className="text-2xl font-bold text-emerald-400 mt-1">78/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Impulse Threshold */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-yellow-500/10 ring-1 ring-yellow-500/20">
                  <Timer className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Impulse Threshold</CardTitle>
                  <CardDescription>Pain tolerance and trigger sensitivity</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>What's your pain tolerance before you pull the trigger?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{patternsData.impulseThreshold.level}</div>
                <div className="text-sm text-muted-foreground">
                  {patternsData.impulseThreshold.reactionTime} avg decision time
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {100 - patternsData.impulseThreshold.triggerSensitivity}% patience
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternsData.impulseThreshold.impulsiveActions} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="trigger" width={80} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="frequency" fill="var(--color-frequency)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-2">
              {patternsData.impulseThreshold.impulsiveActions.map((action) => (
                <div key={action.trigger} className="flex items-center justify-between text-sm">
                  <span>{action.trigger}</span>
                  <Badge variant="outline" className="text-xs">
                    {action.response}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Whale Mimicry Detector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
                  <Copy className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Whale Mimicry Detector</CardTitle>
                  <CardDescription>Following whale wallets and timing lag analysis</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">Independent</div>
              <div className="text-sm text-muted-foreground">
                Low correlation with known whale wallets
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                <div className="text-sm font-medium text-cyan-400">Whale Overlap</div>
                <div className="text-xs text-muted-foreground mt-1">
                  CyaE1VxvB... token overlap: 34% (3 days avg delay)
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Original strategy score</span>
                <span className="text-cyan-400">78%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Copy-paste risk</span>
                <span className="text-green-400">Low</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-sm font-medium text-green-400">Independence Score</div>
              <div className="text-2xl font-bold text-green-400 mt-1">78/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Impulse Depth Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <Zap className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Impulse Depth Score</CardTitle>
                  <CardDescription>Lack of commitment and emotional reactivity</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quick exit tendency</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Low impulse
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tokens sold within 10 minutes</span>
                <span className="text-red-400">8%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-red-400 transition-all duration-300" style={{ width: '8%' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">3.2 days</div>
                <div className="text-xs text-muted-foreground">Avg hold time</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Patient</div>
                <div className="text-xs text-muted-foreground">Exit style</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Disposition */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                  <Heart className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Loyalty Disposition</CardTitle>
                  <CardDescription>Safety in familiar vs chasing novelty</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">Selective Loyalty</div>
              <div className="text-sm text-muted-foreground">
                72% protocol reuse rate
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Jupiter loyalty</span>
                <span className="text-green-400">89%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Raydium loyalty</span>
                <span className="text-green-400">34%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>New protocol exploration</span>
                <span className="text-yellow-400">28%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Sizing Psychology */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
                  <Scale className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Position Sizing Psychology</CardTitle>
                  <CardDescription>Bet sizing patterns tied to conviction levels</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400 mb-1">Strategic Sizer</div>
              <div className="text-sm text-muted-foreground">
                Big bets on utility tokens, small bets on memes
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
                <div className="text-sm font-medium text-amber-400">Largest Position</div>
                <div className="text-xs text-muted-foreground mt-1">
                  SOL: 15.2M lamports (67% of portfolio)
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Utility token sizing</span>
                <span className="text-amber-400">8.7M avg</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Meme token sizing</span>
                <span className="text-yellow-400">2.1M avg</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-amber-500/10 rounded-lg">
              <div className="text-sm font-medium text-amber-400">Sizing Discipline</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">92/100</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gamified Badges Row */}
      <Card className="border border-border/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Trading Personality Badges</CardTitle>
              <CardDescription>Your behavioral achievement unlocks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🏆</div>
              <div className="font-medium text-sm">Whale Premium Strategist</div>
              <div className="text-xs text-muted-foreground mt-1">Elite fee strategy</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-medium text-sm">MEV Sniper</div>
              <div className="text-xs text-muted-foreground mt-1">Premium protection</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">🎯</div>
              <div className="font-medium text-sm">Focused Executor</div>
              <div className="text-xs text-muted-foreground mt-1">Low complexity master</div>
            </div>
            <div className="text-center p-4 bg-card/50 rounded-lg border border-border/50">
              <div className="text-2xl mb-2">⏱️</div>
              <div className="font-medium text-sm">Patient Hunter</div>
              <div className="text-xs text-muted-foreground mt-1">High impulse threshold</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}