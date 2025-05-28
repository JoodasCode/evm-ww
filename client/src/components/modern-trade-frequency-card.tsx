import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, BarChart3 } from 'lucide-react';

interface ModernTradeFrequencyCardProps {
  walletAddress: string;
}

export function ModernTradeFrequencyCard({ walletAddress }: ModernTradeFrequencyCardProps) {
  const frequencyData = {
    dailyAverage: 3.2,
    peakHours: ['9-11 AM', '2-4 PM', '8-10 PM'],
    tradingDays: 5,
    weeklyPattern: 'Active Weekdays'
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl">Trade Frequency</CardTitle>
        </div>
        <CardDescription>Trading activity patterns and time-of-day analysis</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{frequencyData.dailyAverage}</div>
            <div className="text-xs text-muted-foreground">Trades/Day</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-blue-600">{frequencyData.tradingDays}</div>
            <div className="text-xs text-muted-foreground">Active Days/Week</div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            Peak Trading Hours
          </h4>
          <div className="flex flex-wrap gap-2">
            {frequencyData.peakHours.map((hour) => (
              <Badge key={hour} variant="secondary" className="text-xs">
                {hour}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs font-medium text-blue-600 mb-1">⏰ Activity Pattern</p>
          <p className="text-xs text-muted-foreground">
            Consistent {frequencyData.weeklyPattern.toLowerCase()} trading with peak activity during market hours
          </p>
        </div>
      </CardContent>
    </Card>
  );
}