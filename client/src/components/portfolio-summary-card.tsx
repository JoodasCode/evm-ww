import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { WhispererScore, TokenBalance } from "@/types/wallet";

interface PortfolioSummaryCardProps {
  score: WhispererScore;
  tokenBalances: TokenBalance[];
}

export function PortfolioSummaryCard({ score, tokenBalances }: PortfolioSummaryCardProps) {
  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatPercentage = (value: string) => {
    const num = parseFloat(value);
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(1)}%`;
  };

  const dailyChangeValue = parseFloat(score.dailyChange);
  const dailyChangeAmount = parseFloat(score.portfolioValue) * (dailyChangeValue / 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">Portfolio Value</CardTitle>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(score.portfolioValue)}
              </span>
              <Badge 
                variant={dailyChangeValue >= 0 ? "default" : "destructive"}
                className="bg-accent text-accent-foreground"
              >
                {formatPercentage(score.dailyChange)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              24h change: {dailyChangeValue >= 0 ? '+' : ''}{formatCurrency(dailyChangeAmount.toString())}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <p className="text-xs text-muted-foreground">Tokens</p>
              <p className="text-lg font-semibold text-foreground">{tokenBalances.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Trade</p>
              <p className="text-lg font-semibold text-foreground">
                {formatCurrency(score.avgTradeSize)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
