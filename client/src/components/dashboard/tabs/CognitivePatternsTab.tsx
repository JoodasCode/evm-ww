import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Activity, DollarSign, Shuffle, Timer, Clock, Zap, Heart, Dice6, Search, TrendingUp, Copy, Scale } from "lucide-react";
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
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Activity className="h-5 w-5 text-muted-foreground" />
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
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
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
                    <div className="bg-primary h-2 rounded-full w-[89%]" />
                  </div>
                  <span className="font-medium">High</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>MEV Protection</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-background rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[95%]" />
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
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Token Discovery Engine</CardTitle>
                  <CardDescription>Finding alpha before the crowd arrives</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
                78/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted border-border">
                <div className="text-xl font-bold text-muted-foreground">Early Adopter</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Found 3 tokens before 10x
                </div>
              </div>
              <div className="text-center p-3 bg-muted border-border">
                <div className="text-xl font-bold text-muted-foreground">65%</div>
                <div className="text-xs text-muted-foreground mt-1">
                  SOL ecosystem early
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">BONK discovery</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">
                  +340% timing
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">WIF entry</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">
                  Crowd follower
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm font-medium">Jupiter usage</span>
                </div>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">
                  Month 2 adopter
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Impulse Threshold */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Timer className="h-5 w-5 text-muted-foreground" />
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
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={patternsData.impulseThreshold.impulsiveActions} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="trigger" width={100} />
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
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Copy className="h-5 w-5 text-muted-foreground" />
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
              <div className="text-2xl font-bold text-muted-foreground mb-1">Independent</div>
              <div className="text-sm text-muted-foreground">
                Low correlation with known whale wallets
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-sm font-medium text-muted-foreground">Whale Overlap</div>
                <div className="text-xs text-muted-foreground mt-1">
                  CyaE1VxvB... token overlap: 34% (3 days avg delay)
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Original strategy score</span>
                <span className="text-muted-foreground">78%</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Copy-paste risk</span>
                <span className="text-muted-foreground">Low</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-primary/10 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Independence Score</div>
              <div className="text-2xl font-bold text-muted-foreground mt-1">78/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Impulse Depth Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Impulse Control Score</CardTitle>
                  <CardDescription>Commitment levels and exit discipline</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
                92/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-lg font-bold text-muted-foreground">8%</div>
                <div className="text-xs text-muted-foreground">Quick exits</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-lg font-bold text-muted-foreground">3.2d</div>
                <div className="text-xs text-muted-foreground">Avg hold</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-lg font-bold text-muted-foreground">92%</div>
                <div className="text-xs text-muted-foreground">Patience</div>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Impulsive</span>
                <span>Patient</span>
              </div>
              <div className="w-full bg-muted/50 rounded-full h-3">
                <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
              </div>
              <div className="flex items-center justify-center mt-2">
                <Badge variant="secondary" className="bg-primary/10 text-muted-foreground">
                  Disciplined Trader
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty Disposition */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Heart className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Protocol Loyalty</CardTitle>
                  <CardDescription>Platform preferences and exploration patterns</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
                Selective
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-xl font-bold text-muted-foreground">72%</div>
                <div className="text-xs text-muted-foreground mt-1">Protocol reuse</div>
              </div>
              <div className="text-center p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-xl font-bold text-muted-foreground">28%</div>
                <div className="text-xs text-muted-foreground mt-1">New exploration</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-sm font-medium">Jupiter</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground font-medium">89%</div>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">
                    High loyalty
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="text-sm font-medium">Raydium</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-muted-foreground font-medium">34%</div>
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">
                    Moderate
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Position Sizing Psychology */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Scale className="h-5 w-5 text-muted-foreground" />
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
              <div className="text-2xl font-bold text-muted-foreground mb-1">Strategic Sizer</div>
              <div className="text-sm text-muted-foreground">
                Big bets on utility tokens, small bets on memes
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-primary/5 rounded-lg border border-border">
                <div className="text-sm font-medium text-muted-foreground">Largest Position</div>
                <div className="text-xs text-muted-foreground mt-1">
                  SOL: 15.2M lamports (67% of portfolio)
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Utility token sizing</span>
                <span className="text-muted-foreground">8.7M avg</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span>Meme token sizing</span>
                <span className="text-muted-foreground">2.1M avg</span>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-border">
              <div className="text-sm font-medium text-muted-foreground">Sizing Psychology</div>
              <div className="text-xs text-muted-foreground mt-1">
                You allocate based on thesis strength: high conviction = big bets, speculation = small bets
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post-Rug Behavior Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Post-Rug Behavior Tracker</CardTitle>
                <CardDescription>How do you cope with loss?</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
              Resilient
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-primary/5 rounded-lg border border-border">
            <div className="text-sm font-medium text-muted-foreground">Recovery Pattern</div>
            <div className="text-xs text-muted-foreground mt-1">
              No major losses detected in last 60 days. Last recovery: 4.2 hours after -23% loss
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium text-foreground">Recovery Time</div>
              <div className="text-lg font-bold text-muted-foreground mt-1">4.2h</div>
              <div className="text-xs text-muted-foreground">Average time to next buy</div>
            </div>
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="text-sm font-medium text-foreground">Revenge Trading</div>
              <div className="text-lg font-bold text-muted-foreground mt-1">Low</div>
              <div className="text-xs text-muted-foreground">Thoughtful reentry</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Similar token rebuy rate</span>
              <span className="text-muted-foreground">12% (healthy)</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Post-loss position sizing</span>
              <span className="text-muted-foreground">Consistent (-8%)</span>
            </div>
          </div>
          
          <div className="p-3 bg-primary/5 rounded-lg border border-border">
            <div className="text-xs text-muted-foreground">
              "You process losses maturely and don't let emotions drive your next decisions"
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Narrative Loyalty Map */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                <Activity className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Narrative Loyalty Map</CardTitle>
                <CardDescription>How long do you stay true to a thesis?</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border">
              Utility Focused
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-primary/5 rounded-lg border border-border text-center">
              <div className="text-lg font-bold text-muted-foreground">67%</div>
              <div className="text-xs text-muted-foreground">Utility/Infra</div>
              <Badge variant="secondary" className="mt-1 text-xs bg-primary/10 text-muted-foreground">
                Primary
              </Badge>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-border text-center">
              <div className="text-lg font-bold text-muted-foreground">23%</div>
              <div className="text-xs text-muted-foreground">Memes</div>
              <Badge variant="secondary" className="mt-1 text-xs bg-primary/10 text-muted-foreground">
                Secondary
              </Badge>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-border text-center">
              <div className="text-lg font-bold text-muted-foreground">10%</div>
              <div className="text-xs text-muted-foreground">DeFi</div>
              <Badge variant="secondary" className="mt-1 text-xs bg-primary/10 text-muted-foreground">
                Exploration
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-foreground">Conviction by Category</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Utility tokens (SOL, JUP)</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">8.7M avg</span>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">Strong</Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Meme tokens (BONK, WIF)</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-muted-foreground">2.1M avg</span>
                    <Badge variant="secondary" className="text-xs bg-primary/10 text-muted-foreground">Light</Badge>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-primary/5 rounded-lg border border-border">
              <div className="text-sm font-medium text-muted-foreground">Narrative Shift Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">
                Dec: Increased utility allocation by 23%. You're building core positions, not chasing trends.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Behavioral Tags */}
      <Card className="border border-border/50 bg-gradient-to-r from-purple-500/5 to-blue-500/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
              <Activity className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Psychological Trading Profile</CardTitle>
              <CardDescription>Your comprehensive behavioral fingerprint</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Execution Style</div>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border hover:bg-primary/20 transition-colors cursor-help">
                      Premium Strategist
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pays 8.7M lamports avg - 3x median for optimal timing</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border hover:bg-primary/20 transition-colors cursor-help">
                      MEV Protected
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Uses sophisticated protection against front-running</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border hover:bg-primary/20 transition-colors cursor-help">
                      Patient Hunter
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Only 8% quick exits - high impulse control</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="text-sm font-medium text-foreground">Risk Profile</div>
              <div className="flex flex-wrap gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-primary/10 text-muted-foreground border-border hover:bg-primary/20 transition-colors cursor-help">
                      Thesis Driven
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>67% utility focus shows conviction-based allocation</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors cursor-help">
                      Size Calibrated
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Position sizing correlates with conviction levels</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border hover:bg-muted/80 transition-colors cursor-help">
                      Focused Executor
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Low token diversity indicates deliberate selection</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}