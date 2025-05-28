import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Target } from 'lucide-react';

interface ModernPatternAnalysisCardProps {
  walletAddress: string;
}

export function ModernPatternAnalysisCard({ walletAddress }: ModernPatternAnalysisCardProps) {
  const patternData = {
    dominantPattern: 'Momentum Trading',
    confidence: 84,
    patterns: [
      { name: 'Momentum Trading', strength: 84, frequency: 'High' },
      { name: 'Trend Following', strength: 72, frequency: 'Medium' },
      { name: 'Contrarian Plays', strength: 45, frequency: 'Low' },
      { name: 'Scalping', strength: 38, frequency: 'Low' }
    ],
    consistency: 78
  };

  const getStrengthColor = (strength: number) => {
    if (strength >= 70) return 'text-emerald-400';
    if (strength >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 ring-1 ring-cyan-500/20">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Pattern Analysis
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Trading patterns and behavioral consistency
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Dominant Pattern */}
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {patternData.dominantPattern}
          </div>
          <div className="flex items-center justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium rounded-full">
              {patternData.confidence}% confidence
            </Badge>
            <Badge variant="secondary" className="px-4 py-1.5 text-sm font-medium rounded-full">
              {patternData.consistency}% consistent
            </Badge>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Pattern Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Pattern Strength</h4>
          </div>
          
          <div className="space-y-3">
            {patternData.patterns.map((pattern, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">{pattern.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {pattern.frequency} Freq
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getStrengthColor(pattern.strength)}`}>
                    {pattern.strength}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pattern Insight */}
        <div className="relative p-4 rounded-xl bg-cyan-500/5 ring-1 ring-cyan-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-cyan-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">
                Behavioral Pattern
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Strong momentum trading patterns with consistent execution. Shows disciplined approach to trend-following strategies.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}