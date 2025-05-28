import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown, RefreshCw } from 'lucide-react';
import type { TradingActivityData } from '@/types/wallet';

interface TradingActivityCardProps {
  data: TradingActivityData[];
  isLoading: boolean;
}

export function TradingActivityCard({ data, isLoading }: TradingActivityCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardHeader>
          <CardTitle className="text-whisper-text">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-whisper-accent rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-whisper-accent rounded w-20"></div>
                    <div className="h-3 bg-whisper-accent rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-whisper-accent rounded w-16"></div>
                  <div className="h-3 bg-whisper-accent rounded w-12"></div>
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

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Less than an hour ago';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return ArrowUp;
      case 'sell':
        return ArrowDown;
      case 'swap':
        return RefreshCw;
      default:
        return RefreshCw;
    }
  };

  const getActivityLabel = (type: string, symbol: string) => {
    switch (type) {
      case 'buy':
        return `Bought ${symbol}`;
      case 'sell':
        return `Sold ${symbol}`;
      case 'swap':
        return `Swapped ${symbol}`;
      default:
        return `${type} ${symbol}`;
    }
  };

  const recentActivity = [...data]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <Card className="bg-whisper-card border-whisper-border shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-whisper-text mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.length === 0 ? (
            <p className="text-whisper-subtext text-center py-8">No recent trading activity</p>
          ) : (
            recentActivity.map((activity) => {
              const Icon = getActivityIcon(activity.type);
              
              return (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-whisper-accent rounded-full flex items-center justify-center">
                      <Icon className="text-xs text-whisper-text" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-whisper-text">
                        {getActivityLabel(activity.type, activity.tokenSymbol)}
                      </p>
                      <p className="text-sm text-whisper-subtext">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-whisper-text">
                      {activity.amount.toLocaleString()} {activity.tokenSymbol}
                    </p>
                    <p className="text-sm text-whisper-subtext">
                      {formatCurrency(activity.usdValue)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
