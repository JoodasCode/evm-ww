import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Target, Clock, TrendingUp, Loader2 } from 'lucide-react';

interface AlphaSyncCardProps {
  walletAddress: string;
}

interface AlphaMove {
  token: string;
  timeBeforePump: string;
  pumpPercentage: number;
  category: string;
}

export function AlphaSyncCard({ walletAddress }: AlphaSyncCardProps) {
  const [alphaData, setAlphaData] = useState<{
    alphaScore: number;
    earlyEntryRate: number;
    notableAlphaMoves: AlphaMove[];
    categoryBreakdown: { category: string; alphaScore: number }[];
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/wallet/${walletAddress}/analytics`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const analyticsData = await response.json();
        const analytics = analyticsData.data;
        
        if (analytics) {
          const mockAlphaData = {
            alphaScore: 78,
            earlyEntryRate: 65,
            notableAlphaMoves: [
              { token: 'BONK', timeBeforePump: '3 days', pumpPercentage: 520, category: 'Meme' },
              { token: 'JUP', timeBeforePump: '12 hours', pumpPercentage: 210, category: 'DeFi' },
              { token: 'WIF', timeBeforePump: '2 days', pumpPercentage: 180, category: 'Meme' },
            ],
            categoryBreakdown: [
              { category: 'Meme', alphaScore: 92 },
              { category: 'DeFi', alphaScore: 45 },
              { category: 'NFT', alphaScore: 68 },
              { category: 'Infrastructure', alphaScore: 52 },
            ]
          };
          setAlphaData(mockAlphaData);
        } else {
          setError('No alpha detection data available');
        }
      } catch (err) {
        console.error('Error loading alpha sync data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Meme': 'bg-pink-500/10 text-pink-700 border-pink-200',
      'DeFi': 'bg-blue-500/10 text-blue-700 border-blue-200',
      'NFT': 'bg-purple-500/10 text-purple-700 border-purple-200',
      'Infrastructure': 'bg-green-500/10 text-green-700 border-green-200',
    };
    return colors[category] || 'bg-gray-500/10 text-gray-700 border-gray-200';
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          Alpha Sync Score
        </CardTitle>
        <CardDescription>
          Early opportunity detection and alpha movement timing analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : alphaData ? (
          <>
            {/* Main Alpha Score */}
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold">
                <span className={getScoreColor(alphaData.alphaScore)}>
                  {alphaData.alphaScore}
                </span>
                <span className="text-muted-foreground text-lg">/100</span>
              </div>
              <Badge variant={alphaData.alphaScore >= 70 ? 'default' : 'secondary'}>
                {alphaData.alphaScore >= 70 ? 'Alpha Hunter' : 'Developing Alpha Skills'}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {alphaData.earlyEntryRate}% early entry rate
              </p>
            </div>

            {/* Notable Alpha Moves */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Recent Alpha Moves
              </h4>
              <div className="space-y-2 max-h-32 overflow-auto">
                {alphaData.notableAlphaMoves.map((move, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border border-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold">
                          {move.token.substring(0, 2)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium">{move.token}</span>
                        <Badge variant="outline" className={`ml-2 text-xs ${getCategoryColor(move.category)}`}>
                          {move.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-600">
                        +{move.pumpPercentage}%
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {move.timeBeforePump} early
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Alpha by Category</h4>
              <div className="space-y-2">
                {alphaData.categoryBreakdown.map((category) => (
                  <div key={category.category} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{category.category}</span>
                      <span className={getScoreColor(category.alphaScore)}>
                        {category.alphaScore}%
                      </span>
                    </div>
                    <Progress value={category.alphaScore} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Alpha Insight */}
            <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/20">
              <p className="text-xs font-medium text-yellow-600 mb-1">⚡ Alpha Insight</p>
              <p className="text-xs text-muted-foreground">
                {alphaData.alphaScore >= 80 
                  ? "Exceptional alpha detection! You consistently identify opportunities before major price movements."
                  : alphaData.alphaScore >= 60 
                  ? "Strong alpha skills in meme tokens. Consider expanding to other categories for diversified alpha."
                  : "Focus on developing systematic research and early signal detection for better alpha capture."}
              </p>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No alpha sync data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}