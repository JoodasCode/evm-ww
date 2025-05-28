import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { History, Clock } from 'lucide-react';

interface ModernLabelEngineHistoryCardProps {
  walletAddress: string;
}

export function ModernLabelEngineHistoryCard({ walletAddress }: ModernLabelEngineHistoryCardProps) {
  const historyData = {
    totalUpdates: 47,
    lastUpdate: '2 hours ago',
    recentChanges: [
      { date: '2h ago', action: 'Added', label: 'DeFi Power User', confidence: 95 },
      { date: '1d ago', action: 'Updated', label: 'Yield Farmer', confidence: 87 },
      { date: '3d ago', action: 'Removed', label: 'NFT Flipper', confidence: 0 },
      { date: '1w ago', action: 'Added', label: 'MEV Bot', confidence: 45 }
    ]
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Added': return 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20';
      case 'Updated': return 'text-blue-400 bg-blue-500/10 ring-blue-500/20';
      case 'Removed': return 'text-red-400 bg-red-500/10 ring-red-500/20';
      default: return 'text-muted-foreground bg-muted/30 ring-border/50';
    }
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-slate-500/10 ring-1 ring-slate-500/20">
              <History className="h-5 w-5 text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Label History
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Recent label engine updates and changes
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center space-y-1">
            <div className="text-2xl font-bold text-foreground">{historyData.totalUpdates}</div>
            <div className="text-xs text-muted-foreground">Total Updates</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-slate-400">{historyData.lastUpdate}</div>
            <div className="text-xs text-muted-foreground">Last Update</div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Recent Changes */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Recent Changes</h4>
          </div>
          
          <div className="space-y-3">
            {historyData.recentChanges.map((change, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getActionColor(change.action)}`}
                  >
                    {change.action}
                  </Badge>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground">{change.label}</div>
                    <div className="text-xs text-muted-foreground">{change.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  {change.confidence > 0 && (
                    <div className="text-sm font-semibold text-foreground">
                      {change.confidence}%
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* History Insight */}
        <div className="relative p-4 rounded-xl bg-slate-500/5 ring-1 ring-slate-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-slate-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                Update Pattern
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Active label refinement with high-confidence additions. Engine is effectively tracking behavioral evolution.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}