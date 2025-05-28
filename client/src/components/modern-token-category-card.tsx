import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart } from 'lucide-react';

interface ModernTokenCategoryCardProps {
  walletAddress: string;
}

export function ModernTokenCategoryCard({ walletAddress }: ModernTokenCategoryCardProps) {
  const categoryData = [
    { name: 'Meme Tokens', percentage: 45, trades: 23, pnl: 156 },
    { name: 'DeFi', percentage: 30, trades: 12, pnl: 89 },
    { name: 'Infrastructure', percentage: 15, trades: 8, pnl: 67 },
    { name: 'Gaming', percentage: 10, trades: 4, pnl: -23 }
  ];

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Meme Tokens': 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300',
      'DeFi': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300',
      'Infrastructure': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300',
      'Gaming': 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
  };

  const getPnlColor = (pnl: number) => {
    return pnl >= 0 ? 'text-emerald-600' : 'text-red-600';
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-purple-500" />
          <CardTitle className="text-xl">Token Categories</CardTitle>
        </div>
        <CardDescription>Portfolio breakdown by token category and performance</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {categoryData.map((category, index) => (
            <div key={index} className="border border-border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(category.name)}`}>
                  {category.name}
                </Badge>
                <span className="text-sm font-bold">{category.percentage}%</span>
              </div>
              
              <Progress value={category.percentage} className="h-2 mb-3" />
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-center">
                  <div className="text-muted-foreground">Trades</div>
                  <div className="font-medium">{category.trades}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">P&L</div>
                  <div className={`font-medium ${getPnlColor(category.pnl)}`}>
                    {category.pnl >= 0 ? '+' : ''}{category.pnl}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-purple-500/5 rounded-lg p-3 border border-purple-500/20">
          <p className="text-xs font-medium text-purple-600 mb-1">📊 Category Analysis</p>
          <p className="text-xs text-muted-foreground">
            Heavy focus on meme tokens with strong performance. Consider diversifying into infrastructure for stability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}