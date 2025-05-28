import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WhispererScore } from "@/types/wallet";

interface TradingPatternsCardProps {
  score: WhispererScore;
}

export function TradingPatternsCard({ score }: TradingPatternsCardProps) {
  // Calculate trading metrics with safe defaults
  const dailyTrades = score?.dailyTrades || 0;
  const tradesPerWeek = dailyTrades * 7;
  const avgHoldDays = tradesPerWeek > 0 ? Math.max(0.5, 7 / tradesPerWeek) : 0;

  const peakHours = ['9-11 AM', '2-4 PM', '8-10 PM']; // Mock data - in real app this would come from analysis

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Trading Patterns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{tradesPerWeek}</p>
              <p className="text-sm text-muted-foreground">Trades/Week</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-foreground">{avgHoldDays.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">Avg Hold Days</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Peak Trading Hours</p>
            <div className="flex flex-wrap gap-2">
              {peakHours.map((hour) => (
                <Badge 
                  key={hour} 
                  variant="secondary" 
                  className="bg-accent text-accent-foreground"
                >
                  {hour}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Current Mood</p>
                <p className="text-foreground font-medium">{score.currentMood}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Daily Trades</p>
                <p className="text-foreground font-medium">{dailyTrades}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
