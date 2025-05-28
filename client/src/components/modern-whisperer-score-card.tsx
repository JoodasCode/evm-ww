import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, Zap } from 'lucide-react';

interface ModernWhispererScoreCardProps {
  walletAddress: string;
}

export function ModernWhispererScoreCard({ walletAddress }: ModernWhispererScoreCardProps) {
  // Mock data - will connect to API endpoint /api/whisperer-score/${walletAddress}
  const scoreData = {
    score: 847,
    maxScore: 1000,
    rank: 'Elite Trader',
    percentile: 92,
    categories: [
      { name: 'Risk Management', score: 85, max: 100 },
      { name: 'Timing Accuracy', score: 78, max: 100 },
      { name: 'Portfolio Balance', score: 91, max: 100 },
      { name: 'Conviction Strength', score: 73, max: 100 }
    ]
  };

  const getScoreColor = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-emerald-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Elite Trader': return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300';
      case 'Advanced Trader': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      case 'Intermediate Trader': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <Brain className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Whisperer Score
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Overall trading intelligence and psychological assessment
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Score */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-bold tracking-tight">
              <span className={getScoreColor(scoreData.score, scoreData.maxScore)}>{scoreData.score}</span>
              <span className="text-muted-foreground/70 text-2xl font-medium">/{scoreData.maxScore}</span>
            </div>
            <div className="mt-4 space-y-2">
              <Badge 
                variant="outline" 
                className={`px-4 py-1.5 text-sm font-medium rounded-full ${getRankColor(scoreData.rank)}`}
              >
                {scoreData.rank}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Top {scoreData.percentile}% of all traders
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Category Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Score Breakdown</h4>
          </div>
          
          <div className="space-y-4">
            {scoreData.categories.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{category.name}</span>
                  <span className={`text-sm font-semibold ${getScoreColor(category.score, category.max)}`}>
                    {category.score}/{category.max}
                  </span>
                </div>
                <Progress 
                  value={category.score} 
                  className="h-2 bg-muted rounded-full overflow-hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Intelligence Summary */}
        <div className="relative p-4 rounded-xl bg-purple-500/5 ring-1 ring-purple-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Intelligence Summary
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Exceptional trading psychology with strong risk management. Focus on improving timing precision for elite performance.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}