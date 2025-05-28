'use client';

import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, Flame } from 'lucide-react';
import { fetchTradingContext, getMockTradingContext } from '@/services/tradingContext';

interface DegenScoreCardProps {
  walletAddress: string;
}

interface DegenScoreData {
  score: number;
  label: string;
  factors: {
    name: string;
    value: string;
  }[];
  insight: string;
}

export function DegenScoreCard({ walletAddress }: DegenScoreCardProps) {
  const [degenData, setDegenData] = useState<DegenScoreData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always use real API - no mock data in diehard mode
        try {
          // Use real API data
          const tradingData = await fetchTradingContext(walletAddress);
          
          if (tradingData && tradingData.analytics && tradingData.analytics.riskAppetite) {
            // Extract degen score data from trading context
            const degenScoreData: DegenScoreData = {
              score: tradingData.analytics.riskAppetite.score || 0,
              label: getRiskLabel(tradingData.analytics.riskAppetite.score || 0),
              factors: [
                { 
                  name: 'Trade Frequency', 
                  value: 'No data available' 
                },
                { 
                  name: 'Meme Exposure', 
                  value: tradingData.analytics.portfolioComposition?.memePercentage !== undefined 
                    ? `${tradingData.analytics.portfolioComposition.memePercentage}% of portfolio` 
                    : 'No data' 
                },
                { 
                  name: 'Short Holds', 
                  value: tradingData.analytics.holdingPatterns?.averageMinutes !== undefined 
                    ? `Avg ${tradingData.analytics.holdingPatterns.averageMinutes} mins` 
                    : 'No data' 
                },
              ],
              insight: tradingData.integratedInsights?.find((insight) => insight.type === 'risk-pattern')?.description || 'No risk pattern insights available yet.',
            };

            setDegenData(degenScoreData);
          } else {
            setError('No risk appetite data available');
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          setError('Failed to fetch degen score data');
        }
      } catch (err) {
        console.error('Error loading degen score data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchData();
    }

    return () => {
      // Any cleanup if needed
    };
  }, [walletAddress]);

  const getRiskLabel = (score: number) => {
    if (score < 30) return 'Conservative';
    if (score < 60) return 'Moderate Risk Appetite';
    return 'High Risk Appetite';
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-red-500" />
          <CardTitle className="text-xl">Degen Score™</CardTitle>
        </div>
        <CardDescription className="mt-1">
          Measures your risk appetite and trading behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{error || 'No data available'}</p>
          </div>
        ) : degenData ? (
          <>
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="text-7xl font-bold text-primary mb-2">
                {degenData.score}
              </div>
              <div className="text-lg font-medium">
                {degenData.label}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Safe</span>
                <span className="font-medium">Moderate</span>
                <span className="font-medium">Chaos</span>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                  style={{ width: `${degenData.score}%` }}
                />
              </div>
            </div>

            <div className="w-full overflow-hidden">
              <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide">Key Factors</h3>
              <div className="space-y-3">
                {degenData.factors.map((factor, index) => (
                  <div key={index} className="grid grid-cols-2 items-center p-3 bg-secondary/50 rounded-md overflow-hidden">
                    <span className="text-sm font-medium">
                      {factor.name}
                      :
                    </span>
                    <span className="text-sm font-semibold text-right">{factor.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No degen score data available</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-4 pb-4 border-t">
        <div className="flex items-start gap-2 w-full overflow-hidden">
          <div className="flex-shrink-0 text-primary mt-0.5">
            <Brain size={16} />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-xs text-primary/80 font-medium uppercase tracking-wide mb-0.5">Whisper Insight:</p>
            <p className="text-sm text-muted-foreground italic break-words overflow-hidden">
              {degenData?.insight || 'Insight not available'}
            </p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
