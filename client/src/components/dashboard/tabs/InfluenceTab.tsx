import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWhispererScore } from '@/hooks/useWhispererData';

export function InfluenceTab() {
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
                  <div className="w-24 h-24 bg-primary rounded-full mx-auto"></div>
                  <div className="space-y-2">
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

  const influenceScore = scoreData?.influenceScore || 50;
  const whaleFollowingScore = Math.min(Math.max(influenceScore + 10, 0), 100);
  const alphaSyncScore = Math.min(Math.max(influenceScore + 20, 0), 100);

  // Calculate circle stroke properties
  const whaleCircumference = 2 * Math.PI * 40;
  const whaleStrokeDashoffset = whaleCircumference - (whaleFollowingScore / 100) * whaleCircumference;

  return (
    <div className="space-y-8">
      {/* Whale Following and Alpha Sync */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Whale Following */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Whale Following Index</h3>
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-4 relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted-foreground"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={whaleCircumference}
                    strokeDashoffset={whaleStrokeDashoffset}
                    className="text-foreground transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-foreground">{whaleFollowingScore}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Moderate whale correlation</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Similar entries within 24h</span>
                <span className="text-sm text-foreground">12/20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg delay behind whales</span>
                <span className="text-sm text-foreground">6.2 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alpha Sync Score */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-6">Alpha Sync Score</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-foreground">{alphaSyncScore}</span>
                <Badge className="bg-primary text-foreground">Good Sync</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${alphaSyncScore}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Smart Money Overlap</p>
                  <p className="text-lg font-semibold text-foreground">67%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Alpha Discovery Rate</p>
                  <p className="text-lg font-semibold text-foreground">23%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Influence Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Impact */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Market Impact</h3>
            <div className="text-center mb-4">
              <p className="text-3xl font-bold text-foreground">Low</p>
              <p className="text-sm text-muted-foreground">Individual transaction impact</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Avg slippage</span>
                <span className="text-sm text-foreground">0.23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Price impact</span>
                <span className="text-sm text-foreground">0.08%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Correlation */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Social Signals</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">Twitter Influence</span>
                  <span className="text-sm text-muted-foreground">42%</span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">Discord Activity</span>
                  <span className="text-sm text-muted-foreground">68%</span>
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-foreground">Telegram Sentiment</span>
                  <span className="text-sm text-muted-foreground">55%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Analysis */}
        <Card className="bg-card border-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Network Position</h3>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">Follower</p>
                <p className="text-sm text-muted-foreground">Primary network role</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Connected wallets</span>
                  <span className="text-sm text-foreground">148</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Influence score</span>
                  <span className="text-sm text-foreground">{influenceScore}/100</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
