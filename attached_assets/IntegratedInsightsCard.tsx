'use client';

import React, { useState, useEffect } from 'react';
import {
  Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain, AlertTriangle, TrendingUp, Lightbulb, Loader2,
} from 'lucide-react';
import { IntegratedInsight, fetchTradingContext, getMockTradingContext } from '@/services/tradingContext';

interface IntegratedInsightsCardProps {
  walletAddress: string;
}

export function IntegratedInsightsCard({ walletAddress }: IntegratedInsightsCardProps) {
  const [insights, setInsights] = useState<IntegratedInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always use real API - no mock data in diehard mode
        try {
          // Use real API
          const data = await fetchTradingContext(walletAddress);
          
          // Set the insights if available
          if (data && data.integratedInsights) {
            setInsights(data.integratedInsights);
          } else {
            // Handle case where data exists but insights are missing
            setInsights([]);
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // Return empty data structure instead of mock data
          setInsights([]);
        }
      } catch (err) {
        console.error('Error loading integrated insights:', err);
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

  // Helper function to get the appropriate icon for an insight type
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'volatility-trait':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'performance-archetype':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'risk-pattern':
        return <Brain className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  // Helper function to get severity color
  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return 'bg-red-500';
    if (severity >= 60) return 'bg-orange-500';
    if (severity >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Integrated Insights
        </CardTitle>
        <CardDescription>
          Connections between your trading psychology and market behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto max-h-[200px] pr-2">
        {loading ? (
          <div className="h-full flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-center py-8">
            <p className="text-sm text-muted-foreground">{error || 'No data available'}</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center py-8">
            <p className="text-sm text-muted-foreground">No integrated insights available</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight.id} className="space-y-2 border-b border-border pb-3 last:border-0 last:pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  {getInsightIcon(insight.type)}
                  <div>
                    <h4 className="text-sm font-medium">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground">{insight.description}</p>
                  </div>
                </div>
                {insight.severity && (
                  <Badge variant="outline" className={`${getSeverityColor(insight.severity)} text-white`}>
                    {insight.severity}
                    %
                  </Badge>
                )}
              </div>
              {insight.recommendation && (
                <div className="bg-primary/5 rounded-md p-2 mt-2">
                  <p className="text-xs italic text-primary/80">
                    <span className="font-semibold">Recommendation:</span>
                    {' '}
                    {insight.recommendation}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <div className="flex items-center justify-between w-full">
          <p className="text-xs text-muted-foreground">
            Based on unified analysis of your trading patterns and psychology
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
