import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain, AlertTriangle, TrendingUp, Lightbulb, Loader2, Target, Zap
} from 'lucide-react';

interface IntegratedInsightsCardProps {
  walletAddress: string;
}

interface IntegratedInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  severity?: number;
  recommendation?: string;
}

export function IntegratedInsightsCard({ walletAddress }: IntegratedInsightsCardProps) {
  const [insights, setInsights] = useState<IntegratedInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch comprehensive data from our analytics endpoints
        const [scoresResponse, behaviorResponse, activityResponse] = await Promise.all([
          fetch(`/api/wallet-scores/${walletAddress}`),
          fetch(`/api/wallet-behavior/${walletAddress}`),
          fetch(`/api/wallet-activity/${walletAddress}`)
        ]);

        const scoresData = scoresResponse.ok ? await scoresResponse.json() : null;
        const behaviorData = behaviorResponse.ok ? await behaviorResponse.json() : null;
        const activityData = activityResponse.ok ? await activityResponse.json() : null;

        // Generate insights based on the real data
        const generatedInsights: IntegratedInsight[] = [];

        if (scoresData && behaviorData) {
          // Whisperer Score Analysis
          if (scoresData.whisperer_score > 80) {
            generatedInsights.push({
              id: 'whisperer-elite',
              type: 'performance-archetype',
              title: 'Elite Psychological Profile',
              description: `Exceptional Whisperer Score of ${scoresData.whisperer_score}/100 indicates sophisticated trading psychology and strong emotional control.`,
              severity: 95,
              recommendation: 'Continue leveraging your psychological edge for strategic positioning.'
            });
          }

          // Risk Pattern Analysis
          if (behaviorData.risk_score > 70) {
            generatedInsights.push({
              id: 'risk-strategic',
              type: 'risk-pattern',
              title: 'Strategic Risk Management',
              description: `Your risk score of ${behaviorData.risk_score}/100 shows calculated risk-taking with strategic positioning.`,
              severity: behaviorData.risk_score,
              recommendation: 'Your risk management appears well-calibrated for whale-level trading.'
            });
          }

          // FOMO Analysis
          if (behaviorData.fomo_score < 50) {
            generatedInsights.push({
              id: 'fomo-control',
              type: 'volatility-trait',
              title: 'Excellent FOMO Control',
              description: `Low FOMO score of ${behaviorData.fomo_score}/100 indicates disciplined trading without emotional reactivity.`,
              severity: 25,
              recommendation: 'Your emotional discipline is a significant competitive advantage.'
            });
          }

          // Patience Analysis
          if (behaviorData.patience_score > 80) {
            generatedInsights.push({
              id: 'patience-whale',
              type: 'performance-archetype',
              title: 'Whale-Level Patience',
              description: `Exceptional patience score of ${behaviorData.patience_score}/100 shows ability to hold positions through volatility.`,
              severity: 90,
              recommendation: 'Your patience enables strategic accumulation during market downturns.'
            });
          }

          // Conviction Analysis
          if (behaviorData.conviction_score > 85) {
            generatedInsights.push({
              id: 'conviction-strong',
              type: 'performance-archetype',
              title: 'Strong Conviction Trading',
              description: `High conviction score of ${behaviorData.conviction_score}/100 indicates confidence in position sizing and strategic decisions.`,
              severity: behaviorData.conviction_score,
              recommendation: 'Your conviction enables larger position sizes and strategic market moves.'
            });
          }

          // Classification-based insights
          if (scoresData.current_mood === 'Strategic') {
            generatedInsights.push({
              id: 'mood-strategic',
              type: 'volatility-trait',
              title: 'Strategic Market Positioning',
              description: 'Current psychological state indicates strategic thinking and calculated market approach.',
              severity: 75,
              recommendation: 'Ideal mindset for identifying and capitalizing on market inefficiencies.'
            });
          }
        }

        // If no specific insights generated, provide default analysis
        if (generatedInsights.length === 0 && (scoresData || behaviorData)) {
          generatedInsights.push({
            id: 'analysis-pending',
            type: 'default',
            title: 'Analysis in Progress',
            description: 'Comprehensive behavioral analysis is being processed based on your trading data.',
            recommendation: 'More insights will be available as additional trading data is analyzed.'
          });
        }

        setInsights(generatedInsights);
      } catch (err) {
        console.error('Error loading integrated insights:', err);
        setError('Failed to load integrated insights');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchInsights();
    }
  }, [walletAddress]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'volatility-trait':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'performance-archetype':
        return <TrendingUp className="h-5 w-5 text-emerald-500" />;
      case 'risk-pattern':
        return <Target className="h-5 w-5 text-purple-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return 'bg-emerald-500';
    if (severity >= 60) return 'bg-blue-500';
    if (severity >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <Card className="h-[350px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Integrated Insights
        </CardTitle>
        <CardDescription>
          AI-powered analysis of your trading psychology and behavioral patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto max-h-[200px] pr-2">
        {loading ? (
          <div className="h-full flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-center py-8">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : insights.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center py-8">
            <div className="space-y-2">
              <Zap className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="text-sm text-muted-foreground">No insights available yet</p>
              <p className="text-xs text-muted-foreground">Complete a wallet analysis to generate insights</p>
            </div>
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
                    {insight.severity}%
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
            Based on comprehensive analysis of trading patterns and psychology
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date().toLocaleDateString()}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}