import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WhispererScoreData, TokenBalanceData } from '@/types/wallet';

interface PortfolioSummaryCardProps {
  scoreData: WhispererScoreData | null;
  tokenData: TokenBalanceData[];
  isLoading: boolean;
}

export function PortfolioSummaryCard({ scoreData, tokenData, isLoading }: PortfolioSummaryCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardHeader>
          <CardTitle className="text-whisper-text">Portfolio Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-whisper-accent rounded w-3/4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-12 bg-whisper-accent rounded"></div>
              <div className="h-12 bg-whisper-accent rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const portfolioValue = scoreData?.portfolioValue || 0;
  const dailyChange = scoreData?.dailyChange || 0;
  const dailyChangeAmount = (portfolioValue * dailyChange) / 100;
  const tokenCount = tokenData.length;
  const avgTradeSize = scoreData?.avgTradeSize || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  return (
    <Card className="bg-whisper-card border-whisper-border shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-whisper-text mb-4">Portfolio Value</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-whisper-text">
                {formatCurrency(portfolioValue)}
              </span>
              <span className={`ml-2 px-2 py-1 bg-whisper-accent rounded text-xs text-whisper-text`}>
                {formatChange(dailyChange)}
              </span>
            </div>
            <p className="text-sm text-whisper-subtext">
              24h change: {formatCurrency(dailyChangeAmount)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-whisper-border">
            <div>
              <p className="text-xs text-whisper-subtext">Tokens</p>
              <p className="text-lg font-semibold text-whisper-text">{tokenCount}</p>
            </div>
            <div>
              <p className="text-xs text-whisper-subtext">Avg Trade</p>
              <p className="text-lg font-semibold text-whisper-text">
                {formatCurrency(avgTradeSize)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
