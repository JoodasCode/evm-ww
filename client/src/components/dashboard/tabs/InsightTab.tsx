import { Card, CardContent } from '@/components/ui/card';
import { useWhispererScore } from '@/hooks/useWhispererData';

export function InsightTab() {
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
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-16 bg-whisper-accent rounded"></div>
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
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Missed Opportunities</h3>
            <div className="space-y-4">
              <div className="p-4 bg-whisper-bg rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-whisper-text">POPCAT</p>
                    <p className="text-sm text-whisper-subtext">Sold too early</p>
                  </div>
                  <span className="text-sm text-whisper-text">-$2,400</span>
                </div>
                <p className="text-xs text-whisper-subtext">
                  Potential gain if held for 3 more days
                </p>
              </div>
              <div className="p-4 bg-whisper-bg rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-whisper-text">JUP</p>
                    <p className="text-sm text-whisper-subtext">Missed entry signal</p>
                  </div>
                  <span className="text-sm text-whisper-text">-$1,850</span>
                </div>
                <p className="text-xs text-whisper-subtext">
                  Price moved 180% after resistance break
                </p>
              </div>
              <div className="p-4 bg-whisper-bg rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-whisper-text">WIF</p>
                    <p className="text-sm text-whisper-subtext">Position size too small</p>
                  </div>
                  <span className="text-sm text-whisper-text">-$1,200</span>
                </div>
                <p className="text-xs text-whisper-subtext">
                  Could have allocated 3x more capital
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing Accuracy */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Timing Analysis</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-whisper-subtext">Entry Timing</span>
                  <span className="text-sm text-whisper-text">{entryTiming}%</span>
                </div>
                <div className="w-full bg-whisper-bg rounded-full h-2">
                  <div 
                    className="bg-whisper-accent h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${entryTiming}%` }}
                  />
                </div>
                <p className="text-xs text-whisper-subtext mt-1">
                  Above average market entry accuracy
                </p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-whisper-subtext">Exit Timing</span>
                  <span className="text-sm text-whisper-text">{exitTiming}%</span>
                </div>
                <div className="w-full bg-whisper-bg rounded-full h-2">
                  <div 
                    className="bg-whisper-accent h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${exitTiming}%` }}
                  />
                </div>
                <p className="text-xs text-whisper-subtext mt-1">
                  Room for improvement on profit taking
                </p>
              </div>
              <div className="pt-4 border-t border-whisper-border">
                <p className="text-sm text-whisper-subtext mb-2">Suggested Improvement</p>
                <p className="text-sm text-whisper-text">
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
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Conviction Mapping</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-whisper-text">67%</p>
                <p className="text-sm text-whisper-subtext">Average Conviction</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-whisper-subtext">High conviction trades</span>
                  <span className="text-sm text-whisper-text">4/12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-whisper-subtext">Success rate on high conviction</span>
                  <span className="text-sm text-whisper-text">75%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pattern Recognition */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Repeat Patterns</h3>
            <div className="space-y-3">
              <div className="p-3 bg-whisper-bg rounded-lg">
                <p className="text-sm font-medium text-whisper-text">FOMO Buying</p>
                <p className="text-xs text-whisper-subtext">Detected 3 times this month</p>
              </div>
              <div className="p-3 bg-whisper-bg rounded-lg">
                <p className="text-sm font-medium text-whisper-text">Panic Selling</p>
                <p className="text-xs text-whisper-subtext">Detected 2 times this month</p>
              </div>
              <div className="p-3 bg-whisper-bg rounded-lg">
                <p className="text-sm font-medium text-whisper-text">Revenge Trading</p>
                <p className="text-xs text-whisper-subtext">Detected 1 time this month</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-4">Key Metrics</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-whisper-text">68%</p>
                  <p className="text-xs text-whisper-subtext">Win Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-whisper-text">2.3x</p>
                  <p className="text-xs text-whisper-subtext">Risk/Reward</p>
                </div>
              </div>
              <div className="pt-4 border-t border-whisper-border">
                <div className="flex justify-between">
                  <span className="text-sm text-whisper-subtext">Sharpe Ratio</span>
                  <span className="text-sm text-whisper-text">1.42</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
