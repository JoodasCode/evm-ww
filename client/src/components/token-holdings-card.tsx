import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { TokenBalance } from "@/types/wallet";

interface TokenHoldingsCardProps {
  tokenBalances: TokenBalance[];
}

export function TokenHoldingsCard({ tokenBalances }: TokenHoldingsCardProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatTokenAmount = (amount: string, decimals: number, symbol: string) => {
    const num = parseFloat(amount) / Math.pow(10, decimals);
    if (num > 1000000) {
      return `${(num / 1000000).toFixed(1)}M ${symbol}`;
    } else if (num > 1000) {
      return `${(num / 1000).toFixed(1)}K ${symbol}`;
    } else {
      return `${num.toFixed(2)} ${symbol}`;
    }
  };

  // Sort by USD value and take top holdings
  const topHoldings = tokenBalances
    .sort((a, b) => parseFloat(b.usdValue) - parseFloat(a.usdValue))
    .slice(0, 5);

  if (topHoldings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No token holdings found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Connect your wallet or add some tokens to see your portfolio
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Top Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topHoldings.map((token) => (
            <div 
              key={token.id} 
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={token.logo || undefined} alt={token.symbol} />
                  <AvatarFallback className="bg-accent text-accent-foreground">
                    {token.symbol.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">
                  {formatTokenAmount(token.amount, token.decimals, token.symbol)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(token.usdValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
