import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, AlertTriangle, Target, Clock } from 'lucide-react';

interface MissedOpportunity {
  token: string;
  tokenSymbol: string;
  soldPrice: number;
  currentPrice: number;
  missedGains: number;
  timeHeld: string;
  category: string;
}

interface ModernMissedOpportunitiesCardProps {
  walletAddress: string;
}

export function ModernMissedOpportunitiesCard({ walletAddress }: ModernMissedOpportunitiesCardProps) {
  // Mock data - in real app this would come from API
  const missedOpportunities: MissedOpportunity[] = [
    {
      token: 'BONK',
      tokenSymbol: 'BONK',
      soldPrice: 0.000012,
      currentPrice: 0.000074,
      missedGains: 517,
      timeHeld: '3 days',
      category: 'Meme'
    },
    {
      token: 'JUP',
      tokenSymbol: 'JUP',
      soldPrice: 0.45,
      currentPrice: 1.23,
      missedGains: 173,
      timeHeld: '1 week',
      category: 'DeFi'
    },
    {
      token: 'WIF',
      tokenSymbol: 'WIF',
      soldPrice: 1.20,
      currentPrice: 2.80,
      missedGains: 133,
      timeHeld: '2 days',
      category: 'Meme'
    }
  ];

  const totalMissedValue = missedOpportunities.reduce((sum, opp) => sum + opp.missedGains, 0);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Meme': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
      'DeFi': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'Infrastructure': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  if (missedOpportunities.length === 0) {
    return (
      <Card className="h-[450px] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <CardTitle className="text-xl">Missed Opportunities</CardTitle>
          </div>
          <CardDescription>Tokens you sold too early and their subsequent performance</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No missed opportunities detected</h3>
            <p className="text-sm text-muted-foreground">Great timing on your trades!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <CardTitle className="text-xl">Missed Opportunities</CardTitle>
        </div>
        <CardDescription>Tokens you sold too early and their subsequent performance</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-red-600">+{totalMissedValue}%</div>
            <div className="text-xs text-muted-foreground">Total Missed Gains</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-primary">{missedOpportunities.length}</div>
            <div className="text-xs text-muted-foreground">Opportunities</div>
          </div>
        </div>

        <Separator />

        {/* Opportunities List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {missedOpportunities.map((opp, index) => (
            <div 
              key={index}
              className="border border-border rounded-lg p-3 hover:bg-accent/5 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {opp.tokenSymbol.substring(0, 2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{opp.tokenSymbol}</span>
                      <Badge variant="outline" className={`text-xs ${getCategoryColor(opp.category)}`}>
                        {opp.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Held for {opp.timeHeld}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    +{opp.missedGains}%
                  </div>
                  <div className="text-xs text-muted-foreground">Missed</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-muted-foreground">Sold at</div>
                  <div className="font-medium">${opp.soldPrice.toFixed(6)}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Current price</div>
                  <div className="font-medium text-green-600">${opp.currentPrice.toFixed(6)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Button variant="outline" size="sm" className="w-full">
          <Target className="h-4 w-4 mr-2" />
          View Full Analysis
        </Button>

        {/* Insight */}
        <div className="bg-orange-500/5 rounded-lg p-3 border border-orange-500/20">
          <p className="text-xs font-medium text-orange-600 mb-1">📈 Learning Insight</p>
          <p className="text-xs text-muted-foreground">
            Consider holding positions longer when conviction is high. Your timing analysis shows room for improvement.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}