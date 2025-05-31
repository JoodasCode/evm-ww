import { Card, CardContent } from '@/components/ui/card';
import { useWhispererScore } from '@/hooks/useWhispererData';

export function InsightTab() {
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
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-16 bg-primary rounded"></div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Calculate timing accuracy based on score data
  const entryTiming = Math.min(Math.max((scoreData?.roiScore || 50) + 20, 0), 100);
  const exitTiming = Math.min(Math.max((scoreData?.roiScore || 50) - 10, 0), 100);

  return (
    <div className="space-y-8">
      {/* Missed Opportunities and Timing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Missed Opportunities */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Missed Opportunities</h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">POPCAT</p>
                    <p className="text-sm text-muted-foreground">Sold too early</p>
                  </div>
                  <span className="text-sm text-foreground">-$2,400</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Potential gain if held for 3 more days
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">JUP</p>
                    <p className="text-sm text-muted-foreground">Missed entry signal</p>
                  </div>
                  <span className="text-sm text-foreground">-$1,850</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Price moved 180% after resistance break
                </p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-foreground">WIF</p>
                    <p className="text-sm text-muted-foreground">Position size too small</p>
                  </div>
                  <span className="text-sm text-foreground">-$1,200</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Could have allocated 3x more capital
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Accuracy */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Timing Analysis</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Entry Timing</span>
                  <span className="text-sm text-foreground">{entryTiming}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${entryTiming}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Above average market entry accuracy
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Exit Timing</span>
                  <span className="text-sm text-foreground">{exitTiming}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${exitTiming}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Room for improvement on profit taking
                </p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Suggested Improvement</p>
                <p className="text-sm text-foreground">
                  Consider implementing trailing stops to capture more upside momentum
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conviction Map */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Conviction Mapping</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">67%</p>
                <p className="text-sm text-muted-foreground">Average Conviction</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">High conviction trades</span>
                  <span className="text-sm text-foreground">4/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Success rate on high conviction</span>
                  <span className="text-sm text-foreground">75%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Recognition */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Repeat Patterns</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">FOMO Buying</p>
                <p className="text-xs text-muted-foreground">Detected 3 times this month</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">Panic Selling</p>
                <p className="text-xs text-muted-foreground">Detected 2 times this month</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium text-foreground">Revenge Trading</p>
                <p className="text-xs text-muted-foreground">Detected 1 time this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">68%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-foreground">2.3x</p>
                  <p className="text-xs text-muted-foreground">Risk/Reward</p>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                  <span className="text-sm text-foreground">1.42</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
