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
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 ring-1 ring-amber-500/20">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Degen Score
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Psychological risk assessment and trading behavior analysis
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Score Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-bold tracking-tight">
              <span className={getScoreColor(degenData.score)}>{degenData.score}</span>
              <span className="text-muted-foreground/70 text-2xl font-medium">/100</span>
            </div>
            <div className="mt-4">
              <Badge 
                variant={getScoreBadgeVariant(degenData.score)}
                className="px-4 py-1.5 text-sm font-medium rounded-full"
              >
                {degenData.label}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Risk Factors */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Risk Factors</h4>
          </div>
          
          <div className="space-y-4">
            {degenData.factors.map((factor, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{factor.name}</span>
                  <span className={`text-sm font-semibold ${getScoreColor(factor.value)}`}>
                    {factor.value}/{factor.max}
                  </span>
                </div>
                <Progress 
                  value={factor.value} 
                  className="h-2 bg-muted rounded-full overflow-hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Insight */}
        <div className="relative p-4 rounded-xl bg-amber-500/5 ring-1 ring-amber-500/10">
          <div className="flex items-start space-x-3">
            <Target className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide">
                Degen Insight
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {degenData.insight}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}