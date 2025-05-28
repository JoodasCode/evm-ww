import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';

interface IntegratedInsightsCardProps {
  walletAddress: string;
}

interface IntegratedInsight {
  id: string;
  type: 'volatility-trait' | 'performance-archetype' | 'risk-pattern';
  title: string;
  description: string;
  source: {
    psychometric?: {
      type: string;
      data: any;
    };
    analytic?: {
      type: string;
      data: any;
    };
  };
  severity?: number;
  recommendation?: string;
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

        // Fetch both psychometrics and analytics data to generate integrated insights
        const [psychometricsResponse, analyticsResponse] = await Promise.all([
          fetch(`/api/wallet/${walletAddress}/psychometrics`),
          fetch(`/api/wallet/${walletAddress}/analytics`)
        ]);

        if (!psychometricsResponse.ok || !analyticsResponse.ok) {
          throw new Error('Failed to fetch data for insights');
        }

        const psychometricsData = await psychometricsResponse.json();
        const analyticsData = await analyticsResponse.json();

        const psychometrics = psychometricsData.data;
        const analytics = analyticsData.data;

        // Generate integrated insights based on the data
        const generatedInsights = generateIntegratedInsights(psychometrics, analytics);
        setInsights(generatedInsights);

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
  }, [walletAddress]);

  const generateIntegratedInsights = (psychometrics: any, analytics: any): IntegratedInsight[] => {
    const insights: IntegratedInsight[] = [];
    
    if (!psychometrics || !analytics) {
      return insights;
    }
    
    // Generate insight based on risk appetite and behavioral avatar
    if (analytics.riskAppetite && psychometrics.behavioralAvatar) {
      insights.push({
        id: 'risk-profile-alignment',
        type: 'risk-pattern',
        title: 'Risk Profile Alignment',
        description: `Your ${psychometrics.behavioralAvatar} trading style aligns with your ${analytics.riskAppetite.score > 70 ? 'high' : analytics.riskAppetite.score > 40 ? 'moderate' : 'low'} risk appetite.`,
        source: {
          psychometric: {
            type: 'behavioralAvatar',
            data: psychometrics.behavioralAvatar,
          },
          analytic: {
            type: 'riskAppetite',
            data: analytics.riskAppetite,
          },
        },
        severity: 65,
        recommendation: 'Consider adjusting position sizes to better match your natural trading style.',
      });
    }
    
    // Generate insight based on mood state and trading patterns
    if (psychometrics.currentMood && analytics.tradingPatterns) {
      insights.push({
        id: 'emotional-trading-impact',
        type: 'volatility-trait',
        title: 'Emotional Trading Impact',
        description: `Your ${psychometrics.currentMood} mood state may be affecting your trading decisions, particularly in ${analytics.tradingPatterns[0]?.name || 'recent'} patterns.`,
        source: {
          psychometric: {
            type: 'currentMood',
            data: psychometrics.currentMood,
          },
          analytic: {
            type: 'tradingPatterns',
            data: analytics.tradingPatterns,
          },
        },
        severity: 75,
        recommendation: 'Consider taking a break or reducing position sizes when experiencing strong emotional states.',
      });
    }
    
    // Generate insight based on timing and hold patterns
    if (analytics.holdingPatterns && analytics.timingAccuracy) {
      insights.push({
        id: 'timing-psychology',
        type: 'performance-archetype',
        title: 'Timing Psychology',
        description: `Your ${analytics.holdingPatterns.averageHoldTime > 7 ? 'long-term' : 'short-term'} holding pattern suggests ${analytics.timingAccuracy.overallScore > 70 ? 'good' : 'developing'} market timing skills.`,
        source: {
          analytic: {
            type: 'timingAccuracy',
            data: analytics.timingAccuracy,
          },
        },
        severity: analytics.timingAccuracy.overallScore < 50 ? 80 : 40,
        recommendation: analytics.timingAccuracy.overallScore < 50 
          ? 'Focus on developing entry and exit strategies with clear criteria.'
          : 'Your timing skills are developing well. Consider increasing position sizes gradually.',
      });
    }
    
    return insights;
  };

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
    <Card className="h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Integrated Insights
        </CardTitle>
        <CardDescription>
          Connections between your trading psychology and market behavior
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-auto max-h-[250px] pr-2">
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
                    {insight.severity}%
                  </Badge>
                )}
              </div>
              {insight.recommendation && (
                <div className="bg-primary/5 rounded-md p-2 mt-2">
                  <p className="text-xs italic text-primary/80">
                    <span className="font-semibold">Recommendation:</span>{' '}
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