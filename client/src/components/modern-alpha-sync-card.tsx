import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Zap, Target, Clock, TrendingUp, Star } from 'lucide-react';

interface AlphaSyncCardProps {
  walletAddress: string;
}

interface AlphaMove {
  token: string;
  timeBeforePump: string;
  pumpPercentage: number;
  category: string;
  confidence: number;
}

export function ModernAlphaSyncCard({ walletAddress }: AlphaSyncCardProps) {
  const [alphaData, setAlphaData] = useState<{
    alphaScore: number;
    earlyEntryRate: number;
    notableAlphaMoves: AlphaMove[];
    categoryBreakdown: { category: string; alphaScore: number }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // API Mapping: This will connect to /api/wallet/${walletAddress}/alpha-detection
        // Backend will analyze transaction timing vs market movements using Helius data
        await new Promise(resolve => setTimeout(resolve, 180));
        
        const mockAlphaData = {
          alphaScore: 78,
          earlyEntryRate: 65,
          notableAlphaMoves: [
            { 
              token: 'BONK', 
              timeBeforePump: '3 days', 
              pumpPercentage: 520, 
              category: 'Meme',
              confidence: 0.92
            },
            { 
              token: 'JUP', 
              timeBeforePump: '12 hours', 
              pumpPercentage: 210, 
              category: 'DeFi',
              confidence: 0.87
            },
            { 
              token: 'WIF', 
              timeBeforePump: '2 days', 
              pumpPercentage: 180, 
              category: 'Meme',
              confidence: 0.78
            },
            { 
              token: 'PYTH', 
              timeBeforePump: '1 week', 
              pumpPercentage: 145, 
              category: 'Infrastructure',
              confidence: 0.83
            }
          ],
          categoryBreakdown: [
            { category: 'Meme', alphaScore: 92 },
            { category: 'DeFi', alphaScore: 45 },
            { category: 'Infrastructure', alphaScore: 68 },
            { category: 'Gaming', alphaScore: 52 },
          ]
        };
        
        setAlphaData(mockAlphaData);
      } catch (err) {
        setError('Failed to load alpha detection data');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      loadData();
    }
  }, [walletAddress]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Meme': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
      'DeFi': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'Infrastructure': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
      'Gaming': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  if (loading) {
    return (
      <Card className="h-[550px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-xl">Alpha Sync Score</CardTitle>
          </div>
          <CardDescription>Early opportunity detection and alpha movement timing analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="h-16 w-32 bg-muted/50 rounded-lg mx-auto animate-pulse" />
            <div className="h-6 w-24 bg-muted/30 rounded mx-auto animate-pulse" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
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
            <Zap className="h-5 w-5 text-yellow-500" />
            Alpha Sync Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!alphaData) {
    return (
      <Card className="h-[550px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Alpha Sync Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No alpha detection data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[550px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-xl">Alpha Sync Score</CardTitle>
        </div>
        <CardDescription>Early opportunity detection and alpha movement timing analysis</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Main Alpha Score */}
        <div className="text-center space-y-3">
          <div className="text-5xl font-bold">
            <span className={getScoreColor(alphaData.alphaScore)}>{alphaData.alphaScore}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <Badge variant={alphaData.alphaScore >= 70 ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            {alphaData.alphaScore >= 70 ? 'Alpha Hunter' : 'Developing Alpha Skills'}
          </Badge>
          <p className="text-sm text-muted-foreground">
            {alphaData.earlyEntryRate}% early entry success rate
          </p>
        </div>

        <Separator />

        {/* Notable Alpha Moves */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" />
            Recent Alpha Moves
          </h4>
          <div className="space-y-2 max-h-28 overflow-y-auto">
            {alphaData.notableAlphaMoves.map((move, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {move.token.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{move.token}</span>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(move.category)}`}>
                        {move.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3" />
                      {Math.round(move.confidence * 100)}% confidence
                    </div>
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

        <Separator />

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Alpha by Category
          </h4>
          <div className="space-y-3">
            {alphaData.categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.category}</span>
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
          <p className="text-xs font-medium text-yellow-600 mb-1">⚡ Alpha Intelligence</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {alphaData.alphaScore >= 80 
              ? "Exceptional alpha detection! You consistently identify opportunities before major price movements."
              : alphaData.alphaScore >= 60 
              ? "Strong alpha skills in meme tokens. Consider expanding to other categories for diversified alpha."
              : "Focus on developing systematic research and early signal detection for better alpha capture."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}