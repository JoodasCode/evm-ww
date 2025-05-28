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
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-xl">Whisperer Score</CardTitle>
        </div>
        <CardDescription>Overall trading intelligence and psychological assessment</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Main Score */}
        <div className="text-center space-y-3">
          <div className="text-5xl font-bold">
            <span className={getScoreColor(scoreData.score, scoreData.maxScore)}>{scoreData.score}</span>
            <span className="text-muted-foreground text-lg">/{scoreData.maxScore}</span>
          </div>
          <Badge variant="outline" className={`text-sm px-3 py-1 ${getRankColor(scoreData.rank)}`}>
            {scoreData.rank}
          </Badge>
          <p className="text-sm text-muted-foreground">
            Top {scoreData.percentile}% of all traders
          </p>
        </div>

        <Separator />

        {/* Category Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Score Breakdown
          </h4>
          <div className="space-y-3 max-h-32 overflow-y-auto">
            {scoreData.categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className={getScoreColor(category.score, category.max)}>
                    {category.score}/{category.max}
                  </span>
                </div>
                <Progress value={category.score} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
          <p className="text-xs font-medium text-purple-600 mb-1">🧠 Intelligence Summary</p>
          <p className="text-xs text-muted-foreground">
            Exceptional trading psychology with strong risk management. Focus on improving timing precision for elite performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}