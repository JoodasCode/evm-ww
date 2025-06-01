import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Activity, Clock, TrendingDown, Diamond, Layers, Zap, BarChart3, LineChart, PieChart, Wallet, Timer, Scale, Target, Heart, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";

interface EVMCardsTabProps {
  walletAddress: string;
}

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
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">ETH</span>
                <span className="text-sm font-medium">78%</span>
              </div>
              <Progress value={78} className="h-2" />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">USDT</span>
                <span className="text-sm font-medium">45%</span>
              </div>
              <Progress value={45} className="h-2" />
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">LINK</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <Progress value={32} className="h-2" />
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
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-4xl font-bold">47.3</div>
            <div className="text-sm text-muted-foreground mt-1">days average hold time</div>
            <div className="w-full mt-4">
              <Progress value={47} className="h-2" />
            </div>
            <div className="flex justify-between w-full mt-1 text-xs text-muted-foreground">
              <span>Short term</span>
              <span>Medium</span>
              <span>Long term</span>
            </div>
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
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }).map((_, dayIndex) => (
              Array.from({ length: 4 }).map((_, hourIndex) => {
                // Generate random intensity for demo
                const intensity = Math.floor(Math.random() * 5);
                const bgColor = [
                  'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'
                ][intensity];
                
                return (
                  <div 
                    key={`${dayIndex}-${hourIndex}`}
                    className={`${bgColor} h-6 rounded-sm`}
                    title={`Activity level: ${intensity + 1}/5`}
                  />
                );
              })
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const MockCompositeCard = ({ walletAddress }: { walletAddress: string }) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "archetypeBreakdown");
  
  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Brain className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Trader Archetype Breakdown</CardTitle>
            <CardDescription>Comprehensive analysis of trading behavior</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500 text-white px-3 py-1.5">Swing Trader</Badge>
              <Badge className="bg-green-500 text-white px-3 py-1.5">Value Investor</Badge>
              <Badge className="bg-purple-500 text-white px-3 py-1.5">Momentum Trader</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Risk Profile</h4>
                <Progress value={65} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Time Horizon</h4>
                <Progress value={40} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Short-term</span>
                  <span>Long-term</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Conviction</h4>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-sm">
              <p>This wallet demonstrates a balanced approach to trading with a preference for swing trading strategies. There's evidence of value-based decision making with occasional momentum plays during favorable market conditions.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export function EVMCardsTab({ walletAddress }: EVMCardsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">EVM Psychoanalytics</h2>
          <p className="text-muted-foreground">
            Ethereum wallet behavior analysis and psychological profiling
          </p>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Key Insights</TabsTrigger>
          <TabsTrigger value="charts">Charts & Metrics</TabsTrigger>
          <TabsTrigger value="tables">Tables & Tags</TabsTrigger>
          <TabsTrigger value="all">All Cards</TabsTrigger>
        </TabsList>

        {/* Key Insights Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Archetype Breakdown Summary Card (spans full width) - Composite card */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <MockCompositeCard walletAddress={walletAddress} />
            </div>
            
            {/* Key insight cards */}
            <MockArchetypeCard walletAddress={walletAddress} icon={Brain} title="Trader Archetype" description="Your trading personality profile" /> {/* Tag type */}
            <MockTableCard walletAddress={walletAddress} icon={Diamond} title="Diamond Hands Score" description="Token holding strength analysis" /> {/* Table type */}
            <MockBarChartCard walletAddress={walletAddress} icon={Activity} title="Impulsiveness Meter" description="Measuring trading impulse control" /> {/* Line chart type */}
            <MockBarChartCard walletAddress={walletAddress} icon={BarChart3} title="Most Traded Tokens" description="Highest volume tokens in your portfolio" /> {/* Bar chart type */}
            <MockGaugeCard walletAddress={walletAddress} icon={Clock} title="Average Hold Time" description="How long you typically hold assets" /> {/* Gauge/number type */}
          </div>
        </TabsContent>

        {/* Charts & Metrics Tab */}
        <TabsContent value="charts" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MockBarChartCard walletAddress={walletAddress} icon={TrendingDown} title="Conviction Collapse" description="When you lose faith in positions" /> {/* Bar chart type */}
            <MockBarChartCard walletAddress={walletAddress} icon={Scale} title="Profit Discipline" description="Analyzing your exit strategies" /> {/* Bar chart (merged) type */}
            <MockHeatmapCard walletAddress={walletAddress} icon={Clock} title="Trading Time Heatmap" description="When you're most active" /> {/* Heatmap type */}
            <MockBarChartCard walletAddress={walletAddress} icon={Target} title="Narrative Chaser" description="Following market stories" /> {/* Line/bar chart type */}
            <MockBarChartCard walletAddress={walletAddress} icon={Activity} title="Impulsiveness Meter" description="Measuring trading impulse control" /> {/* Line chart type */}
            <MockBarChartCard walletAddress={walletAddress} icon={BarChart3} title="Most Traded Tokens" description="Highest volume tokens in your portfolio" /> {/* Bar chart type */}
          </div>
        </TabsContent>
        
        {/* Tables & Tags Tab */}
        <TabsContent value="tables" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <MockArchetypeCard walletAddress={walletAddress} icon={Brain} title="Trader Archetype" description="Your trading personality profile" /> {/* Tag type */}
            <MockTableCard walletAddress={walletAddress} icon={Wallet} title="Position Sizing Psychology" description="How you allocate capital" /> {/* Table type */}
            <MockTableCard walletAddress={walletAddress} icon={Diamond} title="Diamond Hands Score" description="Token holding strength analysis" /> {/* Table type */}
            <MockGaugeCard walletAddress={walletAddress} icon={PieChart} title="Hoarder vs Operator" description="How you use your assets" /> {/* Donut/ratio type */}
            <MockTableCard walletAddress={walletAddress} icon={Heart} title="Sentimental Attachment" description="Tokens you can't let go" /> {/* Table type */}
            <MockGaugeCard walletAddress={walletAddress} icon={Timer} title="Patience Psychology" description="Your trading timing patterns" /> {/* Gauge/line type */}
            <MockBarChartCard walletAddress={walletAddress} icon={Zap} title="Liquidity Lurker" description="How you interact with liquidity" /> {/* Bubble chart/flag type */}
            <MockGaugeCard walletAddress={walletAddress} icon={Clock} title="Average Hold Time" description="How long you typically hold assets" /> {/* Gauge/number type */}
          </div>
        </TabsContent>

        {/* All Cards Tab */}
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Composite card (spans full width) */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <MockCompositeCard walletAddress={walletAddress} />
            </div>
            
            {/* All individual cards */}
            <MockArchetypeCard walletAddress={walletAddress} icon={Brain} title="Trader Archetype" description="Your trading personality profile" />
            <MockGaugeCard walletAddress={walletAddress} icon={Clock} title="Average Hold Time" description="How long you typically hold assets" />
            <MockBarChartCard walletAddress={walletAddress} icon={TrendingDown} title="Conviction Collapse" description="When you lose faith in positions" />
            <MockTableCard walletAddress={walletAddress} icon={Diamond} title="Diamond Hands Score" description="Token holding strength analysis" />
            <MockGaugeCard walletAddress={walletAddress} icon={PieChart} title="Hoarder vs Operator" description="How you use your assets" />
            <MockBarChartCard walletAddress={walletAddress} icon={Activity} title="Impulsiveness Meter" description="Measuring trading impulse control" />
            <MockBarChartCard walletAddress={walletAddress} icon={Zap} title="Liquidity Lurker" description="How you interact with liquidity" />
            <MockBarChartCard walletAddress={walletAddress} icon={BarChart3} title="Most Traded Tokens" description="Highest volume tokens in your portfolio" />
            <MockBarChartCard walletAddress={walletAddress} icon={Target} title="Narrative Chaser" description="Following market stories" />
            <MockGaugeCard walletAddress={walletAddress} icon={Timer} title="Patience Psychology" description="Your trading timing patterns" />
            <MockTableCard walletAddress={walletAddress} icon={Wallet} title="Position Sizing Psychology" description="How you allocate capital" />
            <MockBarChartCard walletAddress={walletAddress} icon={Scale} title="Profit Discipline" description="Analyzing your exit strategies" />
            <MockTableCard walletAddress={walletAddress} icon={Heart} title="Sentimental Attachment" description="Tokens you can't let go" />
            <MockHeatmapCard walletAddress={walletAddress} icon={Clock} title="Trading Time Heatmap" description="When you're most active" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
