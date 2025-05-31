import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWhispererScore } from '@/hooks/useWhispererData';

export function BehaviorTab() {
  const { data: scoreData, isLoading } = useWhispererScore();

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-primary rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-primary rounded"></div>
                    <div className="h-4 bg-primary rounded"></div>
                    <div className="h-4 bg-primary rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const riskLevel = scoreData?.riskLevel || 'Medium';
  const tradingFrequency = scoreData?.tradingFrequency || 'Low';
  const dailyTrades = scoreData?.dailyTrades || 0;

  // Simulate risk appetite metrics based on scores
  const volatilityTolerance = Math.min(Math.max((scoreData?.degenScore || 50) + 20, 0), 100);
  const positionSizing = Math.min(Math.max((scoreData?.avgTradeSize || 0) / 100, 0), 100);
  const fomoResistance = Math.min(Math.max(100 - (scoreData?.degenScore || 50), 0), 100);

  return (
    <div className="space-y-8">
      {/* Risk Appetite and Trading Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Appetite */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Risk Appetite</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Volatility Tolerance</span>
                  <span className="text-sm text-foreground">{volatilityTolerance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${volatilityTolerance}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Position Sizing</span>
                  <span className="text-sm text-foreground">{positionSizing}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${positionSizing}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">FOMO Resistance</span>
                  <span className="text-sm text-foreground">{fomoResistance}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${fomoResistance}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Patterns */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Trading Patterns</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{dailyTrades * 7}</p>
                  <p className="text-sm text-muted-foreground">Trades/Week</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-foreground">3.2</p>
                  <p className="text-sm text-muted-foreground">Avg Hold Days</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Peak Trading Hours</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-primary text-foreground">
                    9-11 AM
                  </Badge>
                  <Badge variant="secondary" className="bg-primary text-foreground">
                    2-4 PM
                  </Badge>
                  <Badge variant="secondary" className="bg-primary text-foreground">
                    8-10 PM
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overtrading Detector */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Overtrading Analysis</h3>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    className="text-muted-foreground"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="35"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray="220"
                    strokeDashoffset="110"
                    className="text-foreground transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-foreground">Low</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trading frequency is within healthy bounds
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Bias */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Time of Day Bias</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Morning</span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                  ))}
                  {[1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-muted rounded-full" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Afternoon</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                  ))}
                  <div className="w-2 h-2 bg-muted rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Evening</span>
                <div className="flex space-x-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-primary rounded-full" />
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 bg-muted rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Category Breakdown */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Investment Focus</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">DeFi</span>
                <span className="text-sm text-foreground">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Memecoins</span>
                <span className="text-sm text-foreground">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Gaming</span>
                <span className="text-sm text-foreground">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Infrastructure</span>
                <span className="text-sm text-foreground">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
