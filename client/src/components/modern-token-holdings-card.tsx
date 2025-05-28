import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenHolding {
  id: number;
  token: string;
  tokenName: string;
  tokenSymbol: string;
  value: number;
  allocation: number;
  profitLoss?: number;
  logo?: string;
}

interface ModernTokenHoldingsCardProps {
  tokenBalances: TokenHolding[];
}

export function ModernTokenHoldingsCard({ tokenBalances = [] }: ModernTokenHoldingsCardProps) {
  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Sort by value and take top holdings
  const topHoldings = tokenBalances
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const totalValue = tokenBalances.reduce((sum, token) => sum + token.value, 0);

  if (topHoldings.length === 0) {
    return (
      <Card className="h-[400px]">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Top Holdings</CardTitle>
          </div>
          <CardDescription>Portfolio composition and token allocation analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-2">No token holdings found</p>
            <p className="text-sm text-muted-foreground">
              Connect your wallet or add tokens to see your portfolio
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Top Holdings</CardTitle>
        </div>
        <CardDescription>Portfolio composition and token allocation analysis</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Portfolio Summary */}
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Portfolio Value</span>
            <span className="text-lg font-bold">{formatCurrency(totalValue)}</span>
          </div>
        </div>

        <Separator />

        {/* Token Holdings List */}
        <div className="space-y-3 max-h-48 overflow-y-auto">
          {topHoldings.map((token, index) => (
            <div 
              key={token.id || index}
              className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={token.logo || `/token-icons/${token.tokenSymbol?.toLowerCase()}.png`} 
                    alt={token.tokenSymbol} 
                  />
                  <AvatarFallback className="bg-accent text-accent-foreground font-medium">
                    {token.tokenSymbol?.slice(0, 2) || token.token?.slice(0, 2) || 'TK'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground truncate">
                      {token.tokenSymbol || token.token}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {token.allocation?.toFixed(1) || '0'}%
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {token.tokenName || 'Unknown Token'}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-medium text-foreground">
                  {formatCurrency(token.value)}
                </p>
                {token.profitLoss !== undefined && (
                  <div className={`text-sm flex items-center gap-1 ${
                    token.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {token.profitLoss >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {token.profitLoss >= 0 ? '+' : ''}{token.profitLoss.toFixed(1)}%
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio Insights */}
        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs font-medium text-blue-600 mb-1">💼 Portfolio Intelligence</p>
          <p className="text-xs text-muted-foreground">
            {topHoldings.length > 3 
              ? "Well-diversified portfolio with balanced allocation across multiple tokens."
              : "Consider diversifying your portfolio across more tokens to reduce risk."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}