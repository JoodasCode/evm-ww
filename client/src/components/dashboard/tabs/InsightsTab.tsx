import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, TrendingDown, Eye, Clock, RotateCcw, Target, Heart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface InsightsTabProps {
  walletAddress: string;
}

export function InsightsTab({ walletAddress }: InsightsTabProps) {
  const insightsData = {
    regretIndex: {
      level: "Low Regret",
      score: 23, // Lower is better
      missedGains: [
        { period: 'W1', missed: 5.2, realized: 12.8 },
        { period: 'W2', missed: 8.1, realized: 15.3 },
        { period: 'W3', missed: 3.4, realized: 18.7 },
        { period: 'W4', missed: 12.6, realized: 8.9 },
        { period: 'W5', missed: 7.8, realized: 22.1 },
        { period: 'W6', missed: 4.2, realized: 19.5 }
      ],
      earlyExits: 3,
      perfectTiming: 8
    },
    gutInstinct: {
      accuracy: "Strong Signal Reader",
      score: 78,
      entryAccuracy: [
        { timeframe: '1h', accuracy: 85, volume: 12 },
        { timeframe: '4h', accuracy: 82, volume: 18 },
        { timeframe: '1d', accuracy: 74, volume: 8 },
        { timeframe: '1w', accuracy: 71, volume: 3 }
      ],
      signalVsEmotion: 82 // Higher = more signal-based
    },
    convictionDepth: {
      level: "Deep Conviction",
      avgHoldDuration: "18.3 days",
      holdingPattern: [
        { position: 'SOL', duration: 45, conviction: 95 },
        { position: 'MEME-1', duration: 12, conviction: 65 },
        { position: 'MEME-2', duration: 8, conviction: 45 },
        { position: 'MEME-3', duration: 22, conviction: 78 }
      ],
      trustInThesis: 87
    },
    attentionSpan: {
      level: "Selective Focus",
      rotationFrequency: "Low",
      stickiness: [
        { month: 'Jan', rotations: 2, focus: 85 },
        { month: 'Feb', rotations: 1, focus: 92 },
        { month: 'Mar', rotations: 3, focus: 78 },
        { month: 'Apr', rotations: 1, focus: 88 },
        { month: 'May', rotations: 2, focus: 85 }
      ],
      narrativeJumping: 15 // Lower = more focused
    }
  };

  const chartConfig = {
    missed: { label: "Missed Gains %", color: "hsl(var(--chart-1))" },
    realized: { label: "Realized Gains %", color: "hsl(var(--chart-2))" },
    accuracy: { label: "Accuracy %", color: "hsl(var(--chart-3))" },
    conviction: { label: "Conviction", color: "hsl(var(--chart-4))" },
    focus: { label: "Focus Level", color: "hsl(var(--chart-5))" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Self-Sabotage & Superpowers</h2>
          <p className="text-muted-foreground">Pattern recognition to surface unconscious trading behavior</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
        </Badge>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Regret Index */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <TrendingDown className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Regret Index</CardTitle>
                  <CardDescription>How often you cut winners too early</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Measures missed gains from early exits vs optimal holding</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{insightsData.regretIndex.level}</div>
                <div className="text-sm text-muted-foreground">
                  {insightsData.regretIndex.score}% regret score
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {insightsData.regretIndex.perfectTiming} perfect exits
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={insightsData.regretIndex.missedGains} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="realized" 
                    stackId="1"
                    stroke="var(--color-realized)" 
                    fill="var(--color-realized)" 
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="missed" 
                    stackId="1"
                    stroke="var(--color-missed)" 
                    fill="var(--color-missed)" 
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-green-500/10 rounded border border-green-500/20">
                <div className="font-medium text-muted-foreground">77%</div>
                <div className="text-muted-foreground">Optimal exits</div>
              </div>
              <div className="text-center p-2 bg-red-500/10 rounded border border-red-500/20">
                <div className="font-medium text-muted-foreground">23%</div>
                <div className="text-muted-foreground">Early exits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gut Instinct Accuracy */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Gut Instinct Accuracy</CardTitle>
                  <CardDescription>Signal-based vs emotional entries</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Are your entries based on signals or emotions?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{insightsData.gutInstinct.accuracy}</div>
                <div className="text-sm text-muted-foreground">
                  {insightsData.gutInstinct.score}% overall accuracy
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {insightsData.gutInstinct.signalVsEmotion}% signal-based
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insightsData.gutInstinct.entryAccuracy} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timeframe" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Short-term accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-background rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[85%]" />
                  </div>
                  <span className="font-medium">85%</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Long-term accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-background rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full w-[71%]" />
                  </div>
                  <span className="font-medium">71%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conviction Depth */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Conviction Depth</CardTitle>
                  <CardDescription>How much you trust your thesis</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you trust your thesis enough to hold through volatility?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{insightsData.convictionDepth.level}</div>
                <div className="text-sm text-muted-foreground">
                  {insightsData.convictionDepth.avgHoldDuration} avg hold
                </div>
              </div>
              <Badge variant="secondary" className="text-sm">
                {insightsData.convictionDepth.trustInThesis}% thesis trust
              </Badge>
            </div>
            
            <div className="space-y-3">
              {insightsData.convictionDepth.holdingPattern.map((position, index) => (
                <div key={position.position} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{position.position}</span>
                    <span className="text-muted-foreground">{position.duration}d hold</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${position.conviction}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">{position.conviction}% conviction</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attention Span */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <RotateCcw className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Attention Span</CardTitle>
                  <CardDescription>Narrative consistency and focus patterns</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Do you stick to plays or constantly hunt for new narratives?</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{insightsData.attentionSpan.level}</div>
                <div className="text-sm text-muted-foreground">
                  {insightsData.attentionSpan.rotationFrequency} rotation frequency
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {100 - insightsData.attentionSpan.narrativeJumping}% focus stability
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insightsData.attentionSpan.stickiness} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="focus" 
                    stroke="var(--color-focus)" 
                    strokeWidth={3}
                    dot={{ fill: 'var(--color-focus)', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">1.8</div>
                <div className="text-muted-foreground">Avg rotations/month</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">85%</div>
                <div className="text-muted-foreground">Focus consistency</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regret Pattern Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <TrendingDown className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Regret Pattern Analysis</CardTitle>
                  <CardDescription>Chronic premature exit behavior patterns</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground mb-1">Low Regret</div>
              <div className="text-sm text-muted-foreground">
                Only 23% of exits happened before next price peak
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Perfect timing exits</span>
                <span className="text-muted-foreground">31%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Good timing exits</span>
                <span className="text-muted-foreground">46%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Premature exits</span>
                <span className="text-muted-foreground">23%</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-sm font-medium text-muted-foreground">Exit Quality Score</div>
              <div className="text-2xl font-bold text-muted-foreground mt-1">77/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Delayed Entry Syndrome */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Delayed Entry Syndrome</CardTitle>
                  <CardDescription>FOMO overriding logic in entry timing</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Entry timing quality</span>
              <Badge variant="outline" className="bg-blue-500/10 text-muted-foreground border-blue-500/20">
                Strategic entries
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Entries after token peaks</span>
                <span className="text-muted-foreground">18%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: '18%' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Early</div>
                <div className="text-xs text-muted-foreground">Entry preference</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">82%</div>
                <div className="text-xs text-muted-foreground">Good timing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* False Conviction Detector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Target className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">False Conviction Detector</CardTitle>
                  <CardDescription>Are you acting confident... or pretending to be?</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-500/10 text-muted-foreground border-green-500/20">
                Authentic
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
              <div className="text-sm font-medium text-muted-foreground">Conviction Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">
                Your actions match your words: premium fees + extended hold times = real conviction
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-foreground">Fee vs Hold</div>
                <div className="text-lg font-bold text-muted-foreground mt-1">Aligned</div>
                <div className="text-xs text-muted-foreground">Premium fees + 3.2d avg hold</div>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm font-medium text-foreground">Size vs Duration</div>
                <div className="text-lg font-bold text-muted-foreground mt-1">Consistent</div>
                <div className="text-xs text-muted-foreground">8.7M lamports *(≈ $1.60)* positions</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>False conviction signals</span>
                <span className="text-muted-foreground">None detected</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Quick exit after premium fee</span>
                <span className="text-muted-foreground">2% (very low)</span>
              </div>
            </div>
            
            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="text-xs text-muted-foreground">
                "You don't just talk the talk - your trading patterns show genuine confidence in your decisions"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hope Syndrome Tracker */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
                  <Heart className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Hope Syndrome Tracker</CardTitle>
                  <CardDescription>Refusal to cut losses and move on</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Loss cutting discipline</span>
              <Badge variant="outline" className="bg-green-500/10 text-muted-foreground border-green-500/20">
                Disciplined
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tokens held in 70%+ drawdown</span>
                <span className="text-orange-400">12%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: '12%' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Quick</div>
                <div className="text-xs text-muted-foreground">Loss recognition</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Rational</div>
                <div className="text-xs text-muted-foreground">Exit style</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral Insights Summary */}
      <Card className="border border-border/50 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Key Behavioral Insights</CardTitle>
          <CardDescription>Actionable patterns to improve your trading psychology</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Superpowers</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Strong short-term signal detection (85% accuracy)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Deep conviction in major positions (87% thesis trust)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Low regret rate (23% vs 45% average)</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-orange-400">Growth Areas</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Long-term accuracy could improve (71% vs 85% short-term)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Consider extending hold periods for better gains</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                  <span>Monitor March rotation spike pattern</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}