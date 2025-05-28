import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, DollarSign, Loader2, ExternalLink } from 'lucide-react';

interface MissedOpportunity {
  token: string;
  tokenIcon: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  highPrice: number;
  sellDate: string;
  highDate: string;
  missedGainPercent: number;
  daysAfterSell: number;
}

interface MissedOpportunitiesCardProps {
  walletAddress: string;
}

export function MissedOpportunitiesCard({ walletAddress }: MissedOpportunitiesCardProps) {
  const [opportunities, setOpportunities] = useState<MissedOpportunity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/wallet/${walletAddress}/analytics`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const analyticsData = await response.json();
        const analytics = analyticsData.data;
        
        if (analytics && analytics.missedOpportunities) {
          setOpportunities(analytics.missedOpportunities);
        } else {
          setOpportunities([]);
        }
      } catch (err) {
        console.error('Error loading missed opportunities:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  const formatPrice = (price: number) => {
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-emerald-500" />
          Missed Opportunities
        </CardTitle>
        <CardDescription>
          Tokens you sold too early and their subsequent performance
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[400px] pr-2">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-center">
            <div>
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No missed opportunities detected</p>
              <p className="text-xs text-muted-foreground mt-1">Great timing on your trades!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {opportunities.map((opportunity, index) => (
              <div
                key={index}
                className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">
                        {opportunity.token.substring(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{opportunity.token}</h4>
                      <Badge variant="outline" className="text-xs">
                        {opportunity.category}
                      </Badge>
                    </div>
                  </div>
                  <Badge 
                    variant="destructive" 
                    className="bg-red-500/10 text-red-500 border-red-500/20"
                  >
                    +{opportunity.missedGainPercent}%
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Sold at</p>
                    <p className="font-medium">{formatPrice(opportunity.sellPrice)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Peak reached</p>
                    <p className="font-medium text-emerald-600">
                      {formatPrice(opportunity.highPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Days after</p>
                    <p className="font-medium">{opportunity.daysAfterSell}d</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Sold {formatDate(opportunity.sellDate)}</span>
                    <span>•</span>
                    <span>Peak {formatDate(opportunity.highDate)}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Analyze
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}