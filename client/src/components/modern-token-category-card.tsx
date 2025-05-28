import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PieChart, Coins } from 'lucide-react';

interface ModernTokenCategoryCardProps {
  walletAddress: string;
}

export function ModernTokenCategoryCard({ walletAddress }: ModernTokenCategoryCardProps) {
  const categoryData = {
    totalCategories: 6,
    topCategory: 'DeFi',
    categories: [
      { name: 'DeFi', percentage: 45, tokens: 12, color: 'bg-blue-400' },
      { name: 'Gaming', percentage: 25, tokens: 8, color: 'bg-purple-400' },
      { name: 'Infrastructure', percentage: 15, tokens: 5, color: 'bg-emerald-400' },
      { name: 'Meme', percentage: 10, tokens: 6, color: 'bg-amber-400' },
      { name: 'AI/ML', percentage: 5, tokens: 2, color: 'bg-red-400' }
    ],
    diversificationScore: 72
  };

  const getPercentageColor = (percentage: number) => {
    if (percentage >= 30) return 'text-blue-400';
    if (percentage >= 20) return 'text-emerald-400';
    if (percentage >= 10) return 'text-amber-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 ring-1 ring-purple-500/20">
              <PieChart className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Token Categories
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Portfolio diversification and sector allocation
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-foreground">{categoryData.totalCategories}</div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-xl font-bold text-blue-400">{categoryData.topCategory}</div>
            <div className="text-xs text-muted-foreground">Top Sector</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-emerald-400">{categoryData.diversificationScore}</div>
            <div className="text-xs text-muted-foreground">Diversity</div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Category Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Sector Allocation</h4>
          </div>
          
          <div className="space-y-4">
            {categoryData.categories.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="text-sm font-medium text-foreground">{category.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {category.tokens} tokens
                    </Badge>
                  </div>
                  <span className={`text-sm font-semibold ${getPercentageColor(category.percentage)}`}>
                    {category.percentage}%
                  </span>
                </div>
                <Progress 
                  value={category.percentage} 
                  className="h-2 bg-muted rounded-full overflow-hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Diversification Insight */}
        <div className="relative p-4 rounded-xl bg-purple-500/5 ring-1 ring-purple-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                Portfolio Analysis
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Well-diversified portfolio with strong DeFi focus. Good balance across emerging sectors with moderate risk exposure.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}