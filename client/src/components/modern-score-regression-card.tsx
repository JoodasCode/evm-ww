import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Activity } from 'lucide-react';

interface ModernScoreRegressionCardProps {
  walletAddress: string;
}

export function ModernScoreRegressionCard({ walletAddress }: ModernScoreRegressionCardProps) {
  const regressionData = {
    currentScore: 847,
    trend: 'Upward',
    changePercent: '+12.5%',
    timeframe: '30 days',
    dataPoints: [
      { period: '7d ago', score: 752, change: '+5%' },
      { period: '14d ago', score: 716, change: '+8%' },
      { period: '21d ago', score: 663, change: '-3%' },
      { period: '30d ago', score: 684, change: '+15%' }
    ],
    prediction: {
      next7d: 865,
      confidence: 73
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'Upward': return 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20';
      case 'Downward': return 'text-red-400 bg-red-500/10 ring-red-500/20';
      case 'Stable': return 'text-blue-400 bg-blue-500/10 ring-blue-500/20';
      default: return 'text-muted-foreground bg-muted/30 ring-border/50';
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-emerald-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 ring-1 ring-teal-500/20">
              <LineChart className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Score Regression
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Historical performance and trend analysis
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-foreground">{regressionData.currentScore}</div>
            <div className="text-xs text-muted-foreground">Current Score</div>
          </div>
          <div className="text-center space-y-2">
            <Badge 
              variant="outline" 
              className={`px-3 py-1.5 text-sm font-semibold rounded-full ring-1 ${getTrendColor(regressionData.trend)}`}
            >
              {regressionData.trend}
            </Badge>
            <div className={`text-sm font-medium ${getChangeColor(regressionData.changePercent)}`}>
              {regressionData.changePercent} ({regressionData.timeframe})
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Historical Data */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Historical Progression</h4>
          </div>
          
          <div className="space-y-3">
            {regressionData.dataPoints.map((point, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-muted-foreground w-16">
                    {point.period}
                  </div>
                  <div className="text-sm font-medium text-foreground">
                    {point.score}
                  </div>
                </div>
                <div className={`text-sm font-semibold ${getChangeColor(point.change)}`}>
                  {point.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prediction */}
        <div className="relative p-4 rounded-xl bg-teal-500/5 ring-1 ring-teal-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-teal-400 mt-2" />
            <div className="space-y-2">
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wide">
                7-Day Prediction
              </p>
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-foreground">
                  {regressionData.prediction.next7d}
                </div>
                <Badge variant="outline" className="text-xs">
                  {regressionData.prediction.confidence}% confidence
                </Badge>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Positive momentum suggests continued score improvement based on current behavioral patterns.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}