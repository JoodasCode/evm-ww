import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, Brain, TrendingUp, Heart, Users, Shield, RotateCcw, Activity, Eye, Fuel } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface PsychoanalyticsTabProps {
  walletAddress: string;
}

export function PsychoanalyticsTab({ walletAddress }: PsychoanalyticsTabProps) {
  const psychoData = {
    moodTimeline: {
      currentMood: "Strategic",
      volatility: "Low",
      timeline: [
        { week: 'W1', mood: 'Cautious', risk: 45, fomo: 30, confidence: 75 },
        { week: 'W2', mood: 'Strategic', risk: 55, fomo: 35, confidence: 82 },
        { week: 'W3', mood: 'Patient', risk: 40, fomo: 25, confidence: 88 },
        { week: 'W4', mood: 'Decisive', risk: 65, fomo: 45, confidence: 85 },
        { week: 'W5', mood: 'Strategic', risk: 58, fomo: 38, confidence: 90 },
        { week: 'W6', mood: 'Focused', risk: 52, fomo: 32, confidence: 87 }
      ]
    },
    feeIdentity: {
      philosophy: "Premium for Quality",
      selfWorth: "High-Value Executor",
      feePersonality: [
        { aspect: 'Speed Priority', value: 95 },
        { aspect: 'MEV Protection', value: 92 },
        { aspect: 'Success Signaling', value: 78 },
        { aspect: 'Cost Sensitivity', value: 25 },
        { aspect: 'Status Display', value: 65 },
        { aspect: 'Efficiency Focus', value: 88 }
      ]
    },
    behavioralTags: [
      { tag: "High-Conviction Overpayer", strength: 92, type: "dominant" },
      { tag: "MEV-Aware Strategist", strength: 88, type: "secondary" },
      { tag: "Selective Executor", strength: 85, type: "secondary" },
      { tag: "Premium Quality Seeker", strength: 82, type: "tertiary" },
      { tag: "Patient Capital Deployer", strength: 78, type: "tertiary" }
    ],
    archetypeEngine: {
      primary: "The Whale Strategist",
      secondary: "The Premium Executor",
      traits: {
        dominantTraits: ["Strategic", "Patient", "Quality-Focused"],
        hiddenTraits: ["Status-Conscious", "Perfectionist", "Risk-Calculated"],
        unconsciousPatterns: ["Overpays for certainty", "Avoids market timing pressure", "Values execution over speculation"]
      },
      psychProfile: {
        coreMotivation: "Wealth preservation through quality execution",
        fearDrivers: ["MEV exploitation", "Suboptimal execution", "Market manipulation"],
        confidenceSource: "Technical superiority and premium tools"
      }
    },
    whispererBadges: {
      current: 69,
      degen: 80,
      trend: "stable",
      gamifiedElements: [
        { badge: "🏆", title: "Whale Strategist", description: "Premium fee strategy elite", unlocked: true },
        { badge: "🛡️", title: "MEV Sniper", description: "Superior protection tactics", unlocked: true },
        { badge: "🎯", title: "Precision Executor", description: "Quality over quantity master", unlocked: true },
        { badge: "⏱️", title: "Patient Hunter", description: "High impulse threshold", unlocked: true },
        { badge: "💎", title: "Diamond Hands", description: "Strong conviction holder", unlocked: false },
        { badge: "🚀", title: "Rocket Fuel", description: "Degen score >90", unlocked: false }
      ]
    }
  };

  const chartConfig = {
    risk: { label: "Risk", color: "hsl(var(--chart-1))" },
    fomo: { label: "FOMO", color: "hsl(var(--chart-2))" },
    confidence: { label: "Confidence", color: "hsl(var(--chart-3))" },
    value: { label: "Intensity", color: "hsl(var(--chart-4))" }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Wallet Personality Layer</h2>
          <p className="text-muted-foreground">Full Freudian degen analysis of your trading psyche</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            Whisperer: {psychoData.whispererBadges.current}
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            Degen: {psychoData.whispererBadges.degen}
          </Badge>
        </div>
      </div>

      {/* Gamified Badges Section */}
      <Card className="border border-border/50 bg-gradient-to-r from-purple-500/5 to-pink-500/5 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <Users className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Achievement Badges</CardTitle>
              <CardDescription>Your trading personality achievements and unlocks</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {psychoData.whispererBadges.gamifiedElements.map((badge) => (
              <div 
                key={badge.title}
                className={`text-center p-4 rounded-lg border transition-all duration-200 ${
                  badge.unlocked 
                    ? 'bg-card/80 border-emerald-500/30 shadow-md hover:shadow-lg' 
                    : 'bg-muted/30 border-border/50 opacity-60'
                }`}
              >
                <div className="text-2xl mb-2">{badge.badge}</div>
                <div className="font-medium text-sm">{badge.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{badge.description}</div>
                {badge.unlocked && (
                  <Badge variant="outline" className="mt-2 text-xs">Unlocked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Mood Timeline */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Mood Timeline</CardTitle>
                  <CardDescription>Emotional swings and psychological patterns</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Track your emotional state changes through market cycles</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-bold text-foreground">{psychoData.moodTimeline.currentMood}</div>
                <div className="text-sm text-muted-foreground">
                  {psychoData.moodTimeline.volatility} mood volatility
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                Stable pattern
              </Badge>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={psychoData.moodTimeline.timeline} margin={{ top: 5, right: 30, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="risk" 
                    stroke="var(--color-risk)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-risk)', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fomo" 
                    stroke="var(--color-fomo)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-fomo)', strokeWidth: 2, r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="confidence" 
                    stroke="var(--color-confidence)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-confidence)', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Fee Identity */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-green-500/10 ring-1 ring-green-500/20">
                  <Heart className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Fee Identity</CardTitle>
                  <CardDescription>Self-worth through transaction cost psychology</CardDescription>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <InfoIcon className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>How your fee strategy reflects your trading psychology</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-xl font-bold text-foreground">{psychoData.feeIdentity.philosophy}</div>
              <div className="text-sm text-muted-foreground">
                {psychoData.feeIdentity.selfWorth}
              </div>
            </div>
            
            <ChartContainer config={chartConfig} className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={psychoData.feeIdentity.feePersonality} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="aspect" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                  <Radar 
                    name="Fee Psychology"
                    dataKey="value" 
                    stroke="var(--color-value)" 
                    fill="var(--color-value)" 
                    fillOpacity={0.2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
            
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium text-foreground">Fee Philosophy</div>
              <div className="text-xs text-muted-foreground mt-1">
                "I pay premium because my time and execution quality are worth it"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fear Index */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-red-500/10 ring-1 ring-red-500/20">
                  <Shield className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Fear Index</CardTitle>
                  <CardDescription>Risk aversion and security-seeking behaviors</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">Low Fear</div>
              <div className="text-sm text-muted-foreground">
                High swap-to-transfer ratio indicates confidence
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Swap activity</span>
                <span className="text-green-400">78%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Transfer activity</span>
                <span className="text-yellow-400">22%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Risk comfort level</span>
                <span className="text-green-400">High</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pain Repetition Cycle */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                  <RotateCcw className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Pain Repetition Cycle</CardTitle>
                  <CardDescription>Repeating traumatic trading patterns</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Trauma repetition risk</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Low repetition
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Rebuying previous losers</span>
                <span className="text-orange-400">15%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-300" style={{ width: '15%' }} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Learning</div>
                <div className="text-xs text-muted-foreground">From mistakes</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-medium text-foreground">Forward</div>
                <div className="text-xs text-muted-foreground">Looking</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speed Psychology */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                  <Fuel className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Speed Psychology</CardTitle>
                  <CardDescription>Your relationship with time and urgency</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500/20">
                Speed Obsessed
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
              <div className="text-sm font-medium text-orange-400">Fee Analysis</div>
              <div className="text-xs text-muted-foreground mt-1">
                You pay 8.7M lamports *(≈ 0.0087 SOL / $1.60)* — 3x median fee
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm font-medium">Speed priority</span>
                <Badge variant="secondary" className="text-xs bg-orange-500/10 text-orange-400">
                  87% faster execution
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
                <span className="text-sm font-medium">Success impact</span>
                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-400">
                  +12% vs standard fees
                </Badge>
              </div>
            </div>
            
            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="text-xs text-muted-foreground">
                "I pay premium because my time and execution quality are worth it"
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projection Bias Detector */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
                  <Eye className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold">Projection Bias Detector</CardTitle>
                  <CardDescription>Imitating without insight patterns</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Independent thinking</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">
                Original strategy
              </Badge>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Whale token overlap</span>
                <span className="text-blue-400">34%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Timing correlation</span>
                <span className="text-yellow-400">Low</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Strategy independence</span>
                <span className="text-green-400">High</span>
              </div>
            </div>
            
            <div className="text-center p-3 bg-green-500/10 rounded-lg">
              <div className="text-sm font-medium text-green-400">Independence Score</div>
              <div className="text-2xl font-bold text-green-400 mt-1">78/100</div>
            </div>
          </CardContent>
        </Card>

        {/* Behavioral Tags */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
                <Brain className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Behavioral Tags</CardTitle>
                <CardDescription>Psychological labels and trading patterns</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {psychoData.behavioralTags.map((tag) => (
                <div key={tag.tag} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{tag.tag}</span>
                    <Badge 
                      variant={tag.type === 'dominant' ? 'default' : 'outline'} 
                      className="text-xs"
                    >
                      {tag.strength}%
                    </Badge>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        tag.type === 'dominant' ? 'bg-gradient-to-r from-orange-500 to-orange-400' :
                        tag.type === 'secondary' ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                        'bg-gradient-to-r from-gray-500 to-gray-400'
                      }`}
                      style={{ width: `${tag.strength}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Archetype Engine */}
        <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
                <Users className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">Archetype Engine</CardTitle>
                <CardDescription>Deep psychological trading profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <div className="text-xl font-bold text-foreground">
                {psychoData.archetypeEngine.primary}
              </div>
              <Badge variant="secondary" className="text-sm">
                {psychoData.archetypeEngine.secondary}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Core Motivation</h4>
                <p className="text-sm text-muted-foreground">
                  {psychoData.archetypeEngine.psychProfile.coreMotivation}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Dominant Traits</h4>
                <div className="flex flex-wrap gap-2">
                  {psychoData.archetypeEngine.traits.dominantTraits.map((trait) => (
                    <Badge key={trait} variant="outline" className="text-xs">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">Hidden Patterns</h4>
                <div className="space-y-1">
                  {psychoData.archetypeEngine.traits.unconsciousPatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      <span className="text-muted-foreground">{pattern}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}