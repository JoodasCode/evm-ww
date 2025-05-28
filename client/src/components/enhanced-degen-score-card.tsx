import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Zap, Brain, Target } from 'lucide-react';

interface DegenScoreCardProps {
  walletAddress: string;
}

interface DegenScoreData {
  score: number;
  label: string;
  factors: Array<{
    name: string;
    value: number;
    max: number;
  }>;
  insight: string;
}

export function EnhancedDegenScoreCard({ walletAddress }: DegenScoreCardProps) {
  const [degenData, setDegenData] = useState<DegenScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      // Simulate loading with rich mock data
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setDegenData({
        score: 78,
        label: 'Reformed Degen',
        factors: [
          { name: 'Risk Appetite', value: 85, max: 100 },
          { name: 'FOMO Factor', value: 62, max: 100 },
          { name: 'Diamond Hands', value: 45, max: 100 },
          { name: 'Ape Index', value: 73, max: 100 }
        ],
        insight: 'Strong risk appetite with improving discipline. Watch for FOMO triggers during market pumps.'
      });
      setLoading(false);
    };

    loadData();
  }, [walletAddress]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  if (loading) {
    return (
      <Card className="h-[400px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <CardTitle className="text-xl">Degen Score</CardTitle>
          </div>
          <CardDescription>Psychological risk assessment and trading behavior analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="h-20 bg-muted/50 rounded-lg animate-pulse" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-4 bg-muted/30 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!degenData) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Degen Score
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No degen score data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          <CardTitle className="text-xl">Degen Score</CardTitle>
        </div>
        <CardDescription>Psychological risk assessment and trading behavior analysis</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Main Score Display */}
        <div className="text-center space-y-3">
          <div className="text-5xl font-bold">
            <span className={getScoreColor(degenData.score)}>{degenData.score}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <Badge variant={getScoreBadgeVariant(degenData.score)} className="text-sm px-3 py-1">
            {degenData.label}
          </Badge>
        </div>

        <Separator />

        {/* Factor Breakdown */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            Risk Factors
          </h4>
          <div className="space-y-3">
            {degenData.factors.map((factor, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{factor.name}</span>
                  <span className={getScoreColor(factor.value)}>
                    {factor.value}/{factor.max}
                  </span>
                </div>
                <Progress value={factor.value} className="h-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="bg-yellow-500/5 rounded-lg p-3 border border-yellow-500/20">
          <div className="flex items-start gap-2">
            <Target className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-600 mb-1">💡 Degen Insight</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {degenData.insight}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}