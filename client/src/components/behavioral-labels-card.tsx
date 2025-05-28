import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tags, Brain, TrendingUp, Zap, Heart, Loader2 } from 'lucide-react';

interface BehavioralLabel {
  name: string;
  icon: string;
  description: string;
  category: 'trait' | 'behavior' | 'mood';
  confidence?: number;
}

interface BehavioralLabelsCardProps {
  walletAddress: string;
}

export function BehavioralLabelsCard({ walletAddress }: BehavioralLabelsCardProps) {
  const [labels, setLabels] = useState<BehavioralLabel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/wallet/${walletAddress}/psychometrics`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const psychometricsData = await response.json();
        const psychometrics = psychometricsData.data;
        
        if (psychometrics) {
          // Generate behavioral labels from psychometric data
          const generatedLabels: BehavioralLabel[] = [
            {
              name: psychometrics.behavioralAvatar || 'Strategic Trader',
              icon: '🎯',
              description: 'Primary trading archetype based on behavior analysis',
              category: 'trait'
            },
            {
              name: psychometrics.currentMood || 'Optimistic',
              icon: '😊',
              description: 'Current emotional state affecting trading decisions',
              category: 'mood'
            },
            {
              name: psychometrics.riskProfile || 'Moderate',
              icon: '⚖️',
              description: 'Risk tolerance and appetite classification',
              category: 'trait'
            },
            {
              name: psychometrics.tradingFrequency || 'Active',
              icon: '⚡',
              description: 'Trading activity and frequency pattern',
              category: 'behavior'
            }
          ];

          setLabels(generatedLabels);
        } else {
          setError('No psychometric data available');
        }
      } catch (err) {
        console.error('Error loading behavioral labels:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'trait': return <Brain className="h-4 w-4 text-blue-500" />;
      case 'behavior': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'mood': return <Heart className="h-4 w-4 text-pink-500" />;
      default: return <Tags className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'trait': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'behavior': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'mood': return 'bg-pink-500/10 text-pink-700 border-pink-200';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="h-[400px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          Label Engine™
        </CardTitle>
        <CardDescription>
          AI-powered behavioral classification and trading psychology labels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {/* Skeleton for category summary */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
              ))}
            </div>
            {/* Skeleton for labels */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : labels.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-center">
            <div>
              <Tags className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">No behavioral labels available</p>
            </div>
          </div>
        ) : (
          <>
            {/* Category Summary */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {['trait', 'behavior', 'mood'].map((category) => {
                const count = labels.filter(label => label.category === category).length;
                return (
                  <div key={category} className="text-center p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center mb-1">
                      {getCategoryIcon(category)}
                    </div>
                    <div className="text-lg font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground capitalize">{category}s</div>
                  </div>
                );
              })}
            </div>

            <Separator />

            {/* Labels List */}
            <div className="space-y-3 max-h-48 overflow-auto">
              {labels.map((label, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="text-2xl">{label.icon}</div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{label.name}</h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCategoryColor(label.category)}`}
                      >
                        {label.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {label.description}
                    </p>
                  </div>

                  {label.confidence && (
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Confidence</div>
                      <div className="text-sm font-bold text-primary">
                        {Math.round(label.confidence * 100)}%
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Zap className="h-3 w-3 mr-1" />
                Refresh Labels
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Brain className="h-3 w-3 mr-1" />
                View History
              </Button>
            </div>

            {/* Label Engine Info */}
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">🏷️ Label Engine</p>
              <p className="text-xs text-muted-foreground">
                Dynamic behavioral classification using advanced trading psychology analysis
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}