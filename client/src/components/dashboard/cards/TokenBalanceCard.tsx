import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TokenBalanceData } from '@/types/wallet';

interface TokenBalanceCardProps {
  data: TokenBalanceData[];
  isLoading: boolean;
}

export function TokenBalanceCard({ data, isLoading }: TokenBalanceCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardHeader>
          <CardTitle className="text-whisper-text">Top Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-whisper-accent rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-whisper-accent rounded w-16"></div>
                    <div className="h-3 bg-whisper-accent rounded w-20"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-whisper-accent rounded w-20"></div>
                  <div className="h-3 bg-whisper-accent rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatAmount = (amount: number, decimals: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    } else {
      return amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: Math.min(decimals, 2),
      });
    }
  };

  // Sort by USD value and take top holdings
  const topHoldings = [...data]
    .sort((a, b) => b.usdValue - a.usdValue)
    .slice(0, 5);

  return (
    <Card className="bg-whisper-card border-whisper-border shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-whisper-text mb-4">Top Holdings</h3>
        <div className="space-y-3">
          {topHoldings.length === 0 ? (
            <p className="text-whisper-subtext text-center py-8">No token holdings found</p>
          ) : (
            topHoldings.map((token) => (
              <div key={token.mint} className="flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-whisper-accent rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-whisper-text">
                      {token.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-whisper-text">{token.symbol}</p>
                    <p className="text-sm text-whisper-subtext">{token.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-whisper-text">
                    {formatAmount(token.amount, token.decimals)} {token.symbol}
                  </p>
                  <p className="text-sm text-whisper-subtext">
                    {formatCurrency(token.usdValue)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
