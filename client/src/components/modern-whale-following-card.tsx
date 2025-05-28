import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Fish, Users, TrendingUp, Clock, Target } from 'lucide-react';

interface WhaleCorrelation {
  whaleName: string;
  walletAddress: string;
  correlationPercentage: number;
  archetype: string;
  followTimeHours: number;
  successRate: number;
  recentMoves: number;
}

interface WhaleFollowingCardProps {
  walletAddress: string;
}

export function ModernWhaleFollowingCard({ walletAddress }: WhaleFollowingCardProps) {
  const [whaleData, setWhaleData] = useState<{
    correlations: WhaleCorrelation[];
    averageFollowTime: number;
    shadowingScore: number;
    totalInfluencers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // API Mapping: This will connect to /api/wallet/${walletAddress}/whale-correlations
        // Backend will use Helius + on-chain analysis to identify whale following patterns
        await new Promise(resolve => setTimeout(resolve, 250));
        
        const mockWhaleData = {
          correlations: [
            { 
              whaleName: 'DeGods Whale',
              walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
              correlationPercentage: 82, 
              archetype: 'Narrative Whale',
              followTimeHours: 4.2,
              successRate: 78,
              recentMoves: 12
            },
            { 
              whaleName: 'Solana Foundation',
              walletAddress: '5uWjwvztWcnrFkHEgSHr14kxxUbqBMrg7W2xqrjqGk7H',
              correlationPercentage: 76, 
              archetype: 'Infrastructure Builder',
              followTimeHours: 2.8,
              successRate: 65,
              recentMoves: 8
            },
            { 
              whaleName: 'Jupiter Aggregator',
              walletAddress: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
              correlationPercentage: 68, 
              archetype: 'DeFi Strategist',
              followTimeHours: 12.5,
              successRate: 72,
              recentMoves: 15
            },
            { 
              whaleName: 'Phantom Wallet',
              walletAddress: 'PhantomYzqJwU4tHMy2VFuJq9LdXzwCYNrFq6zSJ8nj7B',
              correlationPercentage: 45, 
              archetype: 'Product Whale',
              followTimeHours: 1.2,
              successRate: 55,
              recentMoves: 23
            }
          ],
          averageFollowTime: 5.2,
          shadowingScore: 72,
          totalInfluencers: 47
        };
        
        setWhaleData(mockWhaleData);
      } catch (err) {
        setError('Failed to load whale correlation data');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      loadData();
    }
  }, [walletAddress]);

  const getCorrelationColor = (percentage: number) => {
    if (percentage >= 70) return 'text-emerald-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getArchetypeColor = (archetype: string) => {
    const colors: Record<string, string> = {
      'Narrative Whale': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
      'Infrastructure Builder': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
      'DeFi Strategist': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'Product Whale': 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300',
    };
    return colors[archetype] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  if (loading) {
    return (
      <Card className="h-[550px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl">Whale Following Index</CardTitle>
          </div>
          <CardDescription>Smart money correlation analysis and whale movement tracking</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[550px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-500" />
            Whale Following Index
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!whaleData) {
    return (
      <Card className="h-[550px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fish className="h-5 w-5 text-blue-500" />
            Whale Following Index
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No whale correlation data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[550px]">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Fish className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl">Whale Following Index</CardTitle>
        </div>
        <CardDescription>Smart money correlation analysis and whale movement tracking</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="text-2xl font-bold text-primary">{whaleData.shadowingScore}</div>
            <div className="text-xs text-muted-foreground">Shadowing Score</div>
            <Badge variant={whaleData.shadowingScore >= 70 ? 'default' : 'secondary'} className="text-xs mt-1">
              {whaleData.shadowingScore >= 70 ? 'Strong' : 'Developing'}
            </Badge>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="text-2xl font-bold text-blue-600">{whaleData.averageFollowTime}h</div>
            <div className="text-xs text-muted-foreground">Avg Follow Time</div>
            <Badge variant="outline" className="text-xs mt-1">
              {whaleData.averageFollowTime < 2 ? 'Fast' : 
               whaleData.averageFollowTime < 6 ? 'Moderate' : 'Slow'}
            </Badge>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
            <div className="text-2xl font-bold text-green-600">{whaleData.totalInfluencers}</div>
            <div className="text-xs text-muted-foreground">Total Influencers</div>
            <Badge variant="outline" className="text-xs mt-1">Tracked</Badge>
          </div>
        </div>

        <Separator />

        {/* Top Correlations */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Top Whale Correlations
          </h4>
          <div className="space-y-3 max-h-64 overflow-auto">
            {whaleData.correlations.map((whale, index) => (
              <div 
                key={index}
                className="border border-border rounded-lg p-3 hover:bg-accent/5 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {whale.whaleName.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-medium text-sm truncate">{whale.whaleName}</h5>
                      <Badge variant="outline" className={`text-xs ${getArchetypeColor(whale.archetype)}`}>
                        {whale.archetype}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getCorrelationColor(whale.correlationPercentage)}`}>
                      {whale.correlationPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Correlation</div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">Follow Time</div>
                    <div className="font-medium flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" />
                      {whale.followTimeHours}h
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Success Rate</div>
                    <div className="font-medium flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {whale.successRate}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Recent Moves</div>
                    <div className="font-medium flex items-center justify-center gap-1">
                      <Target className="h-3 w-3" />
                      {whale.recentMoves}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Strength</div>
                    <Progress value={whale.correlationPercentage} className="h-2 mt-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button className="w-full" variant="outline">
          <Fish className="h-4 w-4 mr-2" />
          View Detailed Whale Analysis
        </Button>

        {/* API Info */}
        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs font-medium text-blue-600 mb-1">🐋 Whale Intelligence</p>
          <p className="text-xs text-muted-foreground">
            {whaleData.shadowingScore >= 70 
              ? "Strong whale following pattern detected. Your best returns align with smart money movements."
              : whaleData.shadowingScore >= 50 
              ? "Moderate whale correlation found. Consider monitoring top whale movements more closely."
              : "Limited whale correlation detected. Focus on developing smart money tracking strategies."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}