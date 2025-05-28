import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tags, TrendingUp } from 'lucide-react';

interface ModernLabelSummaryCardProps {
  walletAddress: string;
}

export function ModernLabelSummaryCard({ walletAddress }: ModernLabelSummaryCardProps) {
  const labelData = {
    totalLabels: 12,
    activeLabels: 8,
    highConfidence: 5,
    labels: [
      { name: 'DeFi Power User', confidence: 95, category: 'Activity' },
      { name: 'Yield Farmer', confidence: 87, category: 'Strategy' },
      { name: 'NFT Collector', confidence: 72, category: 'Interest' },
      { name: 'MEV Bot', confidence: 45, category: 'Technical' }
    ]
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-emerald-400';
    if (confidence >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 ring-1 ring-emerald-500/20">
              <Tags className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Label Summary
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Behavioral labels and confidence scoring
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-foreground">{labelData.totalLabels}</div>
            <div className="text-xs text-muted-foreground">Total Labels</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-emerald-400">{labelData.activeLabels}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-amber-400">{labelData.highConfidence}</div>
            <div className="text-xs text-muted-foreground">High Conf.</div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Label Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Active Labels</h4>
          </div>
          
          <div className="space-y-3">
            {labelData.labels.map((label, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-foreground">{label.name}</div>
                  <Badge variant="outline" className="text-xs">
                    {label.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getConfidenceColor(label.confidence)}`}>
                    {label.confidence}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Insight */}
        <div className="relative p-4 rounded-xl bg-emerald-500/5 ring-1 ring-emerald-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                Label Intelligence
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Strong DeFi activity patterns with consistent yield farming behavior. High confidence labels indicate reliable behavioral classification.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}