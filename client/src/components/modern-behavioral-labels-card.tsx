import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tags, Brain, TrendingUp, Heart, Zap, Loader2 } from 'lucide-react';

interface BehavioralLabel {
  name: string;
  icon: string;
  description: string;
  category: 'trait' | 'behavior' | 'mood';
  confidence: number;
}

interface BehavioralLabelsCardProps {
  walletAddress: string;
}

export function ModernBehavioralLabelsCard({ walletAddress }: BehavioralLabelsCardProps) {
  const [labels, setLabels] = useState<BehavioralLabel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // API Mapping: This will connect to /api/wallet/${walletAddress}/psychometrics
        // For now using mock data with realistic structure
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const mockLabels: BehavioralLabel[] = [
          {
            name: 'Strategic Momentum Trader',
            icon: '🎯',
            description: 'Primary trading archetype based on behavior analysis',
            category: 'trait',
            confidence: 0.92
          },
          {
            name: 'Cautiously Optimistic',
            icon: '😊',
            description: 'Current emotional state affecting trading decisions',
            category: 'mood',
            confidence: 0.78
          },
          {
            name: 'High Risk, Calculated',
            icon: '⚖️',
            description: 'Risk tolerance and appetite classification',
            category: 'trait',
            confidence: 0.85
          },
          {
            name: 'Active Swing Trader',
            icon: '⚡',
            description: 'Trading activity and frequency pattern',
            category: 'behavior',
            confidence: 0.73
          },
          {
            name: 'Alpha Hunter',
            icon: '🔍',
            description: 'Early opportunity identification behavior',
            category: 'behavior',
            confidence: 0.67
          }
        ];
        
        setLabels(mockLabels);
      } catch (err) {
        setError('Failed to load behavioral labels');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      loadData();
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
      case 'trait': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      case 'behavior': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      case 'mood': return 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  if (loading) {
    return (
      <Card className="h-[450px]">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Tags className="h-5 w-5 text-primary" />
            <CardTitle className="text-xl">Label Engine™</CardTitle>
          </div>
          <CardDescription>AI-powered behavioral classification and trading psychology labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/50 rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-[450px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5 text-primary" />
            Label Engine™
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryStats = ['trait', 'behavior', 'mood'].map(category => ({
    category,
    count: labels.filter(label => label.category === category).length
  }));

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Label Engine™</CardTitle>
        </div>
        <CardDescription>AI-powered behavioral classification and trading psychology labels</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 flex-1 overflow-hidden">
        {/* Category Summary */}
        <div className="grid grid-cols-3 gap-3">
          {categoryStats.map(({ category, count }) => (
            <div key={category} className="text-center p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
              <div className="flex items-center justify-center mb-2">
                {getCategoryIcon(category)}
              </div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-muted-foreground capitalize">{category}s</div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Labels List */}
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {labels.map((label, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-accent/5 transition-all duration-200"
            >
              <div className="text-2xl">{label.icon}</div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-sm truncate">{label.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getCategoryColor(label.category)}`}
                  >
                    {label.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {label.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs text-muted-foreground">Confidence</div>
                <div className="text-sm font-bold text-primary">
                  {Math.round(label.confidence * 100)}%
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Zap className="h-3 w-3 mr-1" />
            Refresh Labels
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Brain className="h-3 w-3 mr-1" />
            View History
          </Button>
        </div>

        {/* API Info Footer */}
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
          <p className="text-xs font-medium text-primary mb-1">🏷️ Label Engine</p>
          <p className="text-xs text-muted-foreground">
            Dynamic behavioral classification using advanced trading psychology analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
}