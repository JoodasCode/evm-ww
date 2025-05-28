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
            <Card key={i} className="bg-whisper-card border-whisper-border">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-whisper-accent rounded w-1/3"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-whisper-accent rounded"></div>
                    <div className="h-4 bg-whisper-accent rounded"></div>
                    <div className="h-4 bg-whisper-accent rounded"></div>
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
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Risk Appetite</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-whisper-subtext">Volatility Tolerance</span>
                  <span className="text-sm text-whisper-text">{volatilityTolerance}%</span>
                </div>
                <div className="w-full bg-whisper-bg rounded-full h-2">
                  <div 
                    className="bg-whisper-accent h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${volatilityTolerance}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-whisper-subtext">Position Sizing</span>
                  <span className="text-sm text-whisper-text">{positionSizing}%</span>
                </div>
                <div className="w-full bg-whisper-bg rounded-full h-2">
                  <div 
                    className="bg-whisper-accent h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${positionSizing}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-whisper-subtext">FOMO Resistance</span>
                  <span className="text-sm text-whisper-text">{fomoResistance}%</span>
                </div>
                <div className="w-full bg-whisper-bg rounded-full h-2">
                  <div 
                    className="bg-whisper-accent h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${fomoResistance}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trading Patterns */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Trading Patterns</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-whisper-bg rounded-lg">
                  <p className="text-2xl font-bold text-whisper-text">{dailyTrades * 7}</p>
                  <p className="text-sm text-whisper-subtext">Trades/Week</p>
                </div>
                <div className="text-center p-4 bg-whisper-bg rounded-lg">
                  <p className="text-2xl font-bold text-whisper-text">3.2</p>
                  <p className="text-sm text-whisper-subtext">Avg Hold Days</p>
                </div>
              </div>
              <div className="pt-4 border-t border-whisper-border">
                <p className="text-sm text-whisper-subtext mb-3">Peak Trading Hours</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-whisper-accent text-whisper-text">
                    9-11 AM
                  </Badge>
                  <Badge variant="secondary" className="bg-whisper-accent text-whisper-text">
                    2-4 PM
                  </Badge>
                  <Badge variant="secondary" className="bg-whisper-accent text-whisper-text">
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
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Overtrading Analysis</h3>
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
                    className="text-whisper-border"
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
                    className="text-whisper-text transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-whisper-text">Low</span>
                </div>
              </div>
              <p className="text-sm text-whisper-subtext">
                Your trading frequency is within healthy bounds
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Time Bias */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Time of Day Bias</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-whisper-subtext">Morning</span>
                <div className="flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 bg-whisper-accent rounded-full" />
                  ))}
                  {[1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-whisper-border rounded-full" />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-whisper-subtext">Afternoon</span>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-2 h-2 bg-whisper-accent rounded-full" />
                  ))}
                  <div className="w-2 h-2 bg-whisper-border rounded-full" />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-whisper-subtext">Evening</span>
                <div className="flex space-x-1">
                  {[1, 2].map((i) => (
                    <div key={i} className="w-2 h-2 bg-whisper-accent rounded-full" />
                  ))}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-2 h-2 bg-whisper-border rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Category Breakdown */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Investment Focus</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-whisper-subtext">DeFi</span>
                <span className="text-sm text-whisper-text">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-whisper-subtext">Memecoins</span>
                <span className="text-sm text-whisper-text">25%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-whisper-subtext">Gaming</span>
                <span className="text-sm text-whisper-text">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-whisper-subtext">Infrastructure</span>
                <span className="text-sm text-whisper-text">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
