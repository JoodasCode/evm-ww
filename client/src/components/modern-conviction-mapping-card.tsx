import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Target, TrendingUp, BarChart3 } from 'lucide-react';

interface ConvictionPosition {
  token: string;
  tokenSymbol: string;
  positionSize: number;
  conviction: number;
  returnPercentage: number;
  category: string;
}

interface ModernConvictionMappingCardProps {
  walletAddress: string;
}

export function ModernConvictionMappingCard({ walletAddress }: ModernConvictionMappingCardProps) {
  // Mock data - in real app this would come from API
  const convictionData = {
    averageConviction: 67,
    highConvictionTrades: 4,
    totalTrades: 12,
    successRate: 75,
    convictionStrength: 'Moderate',
    positions: [
      {
        token: 'SOL',
        tokenSymbol: 'SOL',
        positionSize: 25,
        conviction: 85,
        returnPercentage: 45,
        category: 'L1'
      },
      {
        token: 'JUP',
        tokenSymbol: 'JUP',
        positionSize: 15,
        conviction: 70,
        returnPercentage: 23,
        category: 'DeFi'
      },
      {
        token: 'BONK',
        tokenSymbol: 'BONK',
        positionSize: 10,
        conviction: 90,
        returnPercentage: -15,
        category: 'Meme'
      }
    ]
  };

  const getConvictionColor = (conviction: number) => {
    if (conviction >= 80) return 'bg-emerald-500';
    if (conviction >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getReturnColor = (returnPercentage: number) => {
    return returnPercentage >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'L1': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
      'DeFi': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'Meme': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  return (
    <Card className="h-[550px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-xl">Conviction Mapping</CardTitle>
        </div>
        <CardDescription>Position size vs conviction analysis and success correlation</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Top Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-muted-foreground">{convictionData.averageConviction}%</div>
            <div className="text-xs text-muted-foreground">Average Conviction</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-emerald-600">{convictionData.highConvictionTrades}/{convictionData.totalTrades}</div>
            <div className="text-xs text-muted-foreground">High Conviction</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-blue-600">{convictionData.successRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>

        <Separator />

        {/* Conviction Strength */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Conviction Strength</span>
            <Badge variant="secondary" className="text-xs">
              {convictionData.convictionStrength}
            </Badge>
          </div>
          <Progress value={convictionData.averageConviction} className="h-3" />
        </div>

        <Separator />

        {/* Conviction vs Position Size */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            Conviction vs Position Size
          </h4>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {convictionData.positions.map((position, index) => (
              <div 
                key={index}
                className="border border-border rounded-lg p-3 hover:bg-accent/5 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {position.tokenSymbol.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{position.tokenSymbol}</span>
                        <Badge variant="outline" className={`text-xs ${getCategoryColor(position.category)}`}>
                          {position.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${getReturnColor(position.returnPercentage)}`}>
                      {position.returnPercentage >= 0 ? '+' : ''}{position.returnPercentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">Return</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground">Position</div>
                    <div className="font-medium">{position.positionSize}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Conviction</div>
                    <div className="flex items-center justify-center gap-1">
                      <div className={`w-3 h-3 rounded-full ${getConvictionColor(position.conviction)}`}></div>
                      <span className="font-medium">{position.conviction}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground">Return</div>
                    <div className={`font-medium ${getReturnColor(position.returnPercentage)}`}>
                      {position.returnPercentage >= 0 ? '+' : ''}{position.returnPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conviction Insight */}
        <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
          <p className="text-xs font-medium text-purple-600 mb-1">🎯 Conviction Insight</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Strong correlation between conviction and success. Trust your analysis and size accordingly.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}