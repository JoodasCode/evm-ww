import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";
import type { TradingActivity } from "@/types/wallet";

interface TradingActivityCardProps {
  activities: TradingActivity[];
}

export function TradingActivityCard({ activities }: TradingActivityCardProps) {
  const formatCurrency = (value: string | null) => {
    if (!value) return "$0";
    const num = parseFloat(value);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'buy':
        return <ArrowUp className="w-4 h-4 text-foreground" />;
      case 'sell':
        return <ArrowDown className="w-4 h-4 text-foreground" />;
      case 'swap':
        return <RefreshCw className="w-4 h-4 text-foreground" />;
      default:
        return <RefreshCw className="w-4 h-4 text-foreground" />;
    }
  };

  const getActivityLabel = (activity: TradingActivity) => {
    switch (activity.type.toLowerCase()) {
      case 'buy':
        return `Bought ${activity.tokenOut || 'Token'}`;
      case 'sell':
        return `Sold ${activity.tokenIn || 'Token'}`;
      case 'swap':
        return `Swapped ${activity.tokenIn || 'Token'} → ${activity.tokenOut || 'Token'}`;
      default:
        return `${activity.type} Transaction`;
    }
  };

  const getActivityAmount = (activity: TradingActivity) => {
    if (activity.type.toLowerCase() === 'swap') {
      return activity.tokenOut || 'Unknown';
    }
    return activity.amountOut || activity.amountIn || 'Unknown';
  };

  const recentActivities = activities.slice(0, 5);

  if (recentActivities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">No trading activity found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your recent transactions will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {getActivityLabel(activity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">
                  {getActivityAmount(activity)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(activity.usdValue)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
