import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { BarChart3, Clock } from 'lucide-react';

interface ModernTradeFrequencyCardProps {
  walletAddress: string;
}

export function ModernTradeFrequencyCard({ walletAddress }: ModernTradeFrequencyCardProps) {
  const frequencyData = {
    dailyAverage: 24,
    weeklyAverage: 168,
    monthlyAverage: 720,
    peakHours: ['09:00-11:00', '14:00-16:00', '21:00-23:00'],
    tradingStyle: 'High Frequency',
    consistency: 87
  };

  const getFrequencyColor = (frequency: number) => {
    if (frequency >= 50) return 'text-red-400';
    if (frequency >= 20) return 'text-amber-400';
    if (frequency >= 10) return 'text-blue-400';
    return 'text-emerald-400';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <BarChart3 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Trade Frequency
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Trading activity patterns and timing analysis
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Frequency Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className={`text-2xl font-bold ${getFrequencyColor(frequencyData.dailyAverage)}`}>
              {frequencyData.dailyAverage}
            </div>
            <div className="text-xs text-muted-foreground">Daily Avg</div>
          </div>
          <div className="text-center space-y-1">
            <div className={`text-2xl font-bold ${getFrequencyColor(frequencyData.weeklyAverage / 7)}`}>
              {frequencyData.weeklyAverage}
            </div>
            <div className="text-xs text-muted-foreground">Weekly Avg</div>
          </div>
          <div className="text-center space-y-1">
            <div className={`text-2xl font-bold ${getFrequencyColor(frequencyData.monthlyAverage / 30)}`}>
              {frequencyData.monthlyAverage}
            </div>
            <div className="text-xs text-muted-foreground">Monthly Avg</div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Trading Style & Consistency */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
            <span className="text-sm font-medium text-foreground">Trading Style</span>
            <Badge variant="outline" className="font-medium">
              {frequencyData.tradingStyle}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Consistency Score</span>
              <span className="text-sm font-semibold text-emerald-400">
                {frequencyData.consistency}%
              </span>
            </div>
            <Progress 
              value={frequencyData.consistency} 
              className="h-2 bg-muted rounded-full overflow-hidden"
            />
          </div>
        </div>

        {/* Peak Hours */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Peak Trading Hours</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {frequencyData.peakHours.map((hour, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 ring-1 ring-blue-500/20 text-blue-400"
              >
                {hour}
              </Badge>
            ))}
          </div>
        </div>

        {/* Frequency Insight */}
        <div className="relative p-4 rounded-xl bg-blue-500/5 ring-1 ring-blue-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Activity Pattern
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Highly active trader with consistent patterns. Peak activity during market hours suggests professional approach to trading.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}