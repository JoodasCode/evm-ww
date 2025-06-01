import { Brain, Activity, Zap, Clock, BarChart3, Diamond, Scale, Target, Heart, Wallet, PieChart, Timer, TrendingDown, LineChart, FileText, AlertTriangle, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { GaugeChart, PsychoScoreGauge } from "../charts/GaugeChart";
import { TradingFrequencyChart } from "../charts/AreaChart";
import { CardLayout, CardItem } from "@/components/ui/card-layout";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, Tooltip } from "recharts";

// Mock Card Components
const MockArchetypeCard = ({ walletAddress, icon: Icon, title, description }: { walletAddress: string; icon: any; title: string; description: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "traderArchetype");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-500 text-white">Swing Trader</Badge>
              <Badge variant="outline">Risk Neutral</Badge>
            </div>
            <p className="text-sm">This wallet shows consistent patterns of medium-term position holding with strategic entry and exit points.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockTableCard = ({ walletAddress, icon: Icon, title, description }: { walletAddress: string; icon: any; title: string; description: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "diamondHands");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Token</th>
                  <th className="text-right py-2">Hold Time</th>
                  <th className="text-right py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">ETH</td>
                  <td className="text-right py-2">145 days</td>
                  <td className="text-right py-2">92/100</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">LINK</td>
                  <td className="text-right py-2">67 days</td>
                  <td className="text-right py-2">78/100</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockBarChartCard = ({ walletAddress, icon: Icon, title, description }: { walletAddress: string; icon: any; title: string; description: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "mostTradedTokens");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">ETH</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">LINK</span>
                <span className="text-sm text-muted-foreground">54%</span>
              </div>
              <Progress value={54} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockGaugeCard = ({ walletAddress, icon: Icon, title, description }: { walletAddress: string; icon: any; title: string; description: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "averageHoldTime");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="text-3xl font-bold">72 Days</div>
            <div className="text-sm text-muted-foreground">Above average hold time</div>
            <Badge variant="outline" className="mt-2">Top 25%</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockHeatmapCard = ({ walletAddress, icon: Icon, title, description }: { walletAddress: string; icon: any; title: string; description: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "tradingTimeHeatmap");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="aspect-square bg-primary/10 rounded-sm" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i + 7} className="aspect-square bg-primary/30 rounded-sm" />
              ))}
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i + 14} className="aspect-square bg-primary/50 rounded-sm" />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Trading activity peaks on Tuesdays and Wednesdays</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockCompositeCard = ({ walletAddress }: { walletAddress: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "psychProfile");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Psychological Profile Summary</CardTitle>
        <CardDescription>Comprehensive analysis of your trading psychology</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-32 flex items-center justify-center">
            <p className="text-muted-foreground">Loading psychological profile...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Cognitive Style</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Analytical</Badge>
                  <Badge variant="outline">Pattern-Seeking</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Emotional Traits</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Moderate FOMO</Badge>
                  <Badge variant="outline">Loss Averse</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <h3 className="font-medium">Trading Behavior</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">Swing Trader</Badge>
                  <Badge variant="outline">Research-Driven</Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-medium">Key Psychological Insights</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <FileText className="h-3 w-3 text-primary" />
                  </div>
                  <span>Shows patience with profitable positions but tends to cut losses quickly</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                    <FileText className="h-3 w-3 text-primary" />
                  </div>
                  <span>Demonstrates conviction in core assets but speculates with smaller positions</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface PsychWardTabProps {
  walletAddress: string;
}

export function PsychWardTab({ walletAddress }: PsychWardTabProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Psych Ward</h2>
          <p className="text-muted-foreground">Complete psychological dashboard for your trading behavior</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
        </Badge>
      </div>

      {/* Main Content - All cards on one page */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Composite card spanning full width */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <MockCompositeCard walletAddress={walletAddress} />
        </div>
        
        {/* Cognitive Cards */}
        <MockArchetypeCard 
          walletAddress={walletAddress} 
          icon={Brain} 
          title="Trader Archetype" 
          description="Your trading personality profile" 
        />
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={Activity} 
          title="Impulsiveness Meter" 
          description="Measuring trading impulse control" 
        />
        <MockGaugeCard 
          walletAddress={walletAddress} 
          icon={Clock} 
          title="Average Hold Time" 
          description="How long you typically hold assets" 
        />
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={Target} 
          title="Narrative Chaser" 
          description="Following market stories" 
        />
        
        {/* Behavioral Cards */}
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={TrendingDown} 
          title="Conviction Collapse" 
          description="When you lose faith in positions" 
        />
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={Scale} 
          title="Profit Discipline" 
          description="Analyzing your exit strategies" 
        />
        <MockHeatmapCard 
          walletAddress={walletAddress} 
          icon={Clock} 
          title="Trading Time Heatmap" 
          description="When you're most active" 
        />
        <MockTableCard 
          walletAddress={walletAddress} 
          icon={Wallet} 
          title="Position Sizing Psychology" 
          description="How you allocate capital" 
        />
        
        {/* Emotional Cards */}
        <MockTableCard 
          walletAddress={walletAddress} 
          icon={Heart} 
          title="Sentimental Attachment" 
          description="Tokens you can't let go" 
        />
        <MockGaugeCard 
          walletAddress={walletAddress} 
          icon={Timer} 
          title="Patience Psychology" 
          description="Your trading timing patterns" 
        />
        <MockTableCard 
          walletAddress={walletAddress} 
          icon={Diamond} 
          title="Diamond Hands Score" 
          description="Token holding strength analysis" 
        />
        <MockGaugeCard 
          walletAddress={walletAddress} 
          icon={PieChart} 
          title="Hoarder vs Operator" 
          description="How you use your assets" 
        />
        
        {/* Additional Cards */}
        <MockGaugeCard 
          walletAddress={walletAddress} 
          icon={Zap} 
          title="Overconfidence Score" 
          description="High stakes + declining accuracy" 
        />
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={Activity} 
          title="Confidence Volatility" 
          description="Variation in trade sizing after wins/losses" 
        />
        <MockBarChartCard 
          walletAddress={walletAddress} 
          icon={TrendingUp} 
          title="Average Position Growth" 
          description="Whether your average position size is increasing" 
        />
        <MockGaugeCard 
          walletAddress={walletAddress} 
          icon={FileText} 
          title="Flip Direction Bias" 
          description="Do you flip from winners or losers more" 
        />
      </div>
    </div>
  );
}
