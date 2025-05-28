import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface ModernRiskAppetiteCardProps {
  walletAddress: string;
}

export function ModernRiskAppetiteCard({ walletAddress }: ModernRiskAppetiteCardProps) {
  // Will connect to API endpoint /api/wallet/${walletAddress}/risk-profile
  const riskData = {
    riskScore: 78,
    riskLevel: 'High Risk',
    volatilityTolerance: 85,
    drawdownTolerance: 65,
    positionSizing: 'Aggressive'
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'High Risk': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300';
      case 'Medium Risk': return 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300';
      case 'Low Risk': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-orange-500/10 ring-1 ring-orange-500/20">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Risk Appetite
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Risk tolerance and volatility comfort analysis
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Risk Score */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-6xl font-bold tracking-tight">
              <span className={getRiskColor(riskData.riskScore)}>{riskData.riskScore}</span>
              <span className="text-muted-foreground/70 text-2xl font-medium">/100</span>
            </div>
            <div className="mt-4">
              <Badge 
                variant="outline" 
                className={`px-4 py-1.5 text-sm font-medium rounded-full ${getRiskBadgeColor(riskData.riskLevel)}`}
              >
                {riskData.riskLevel}
              </Badge>
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Risk Metrics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Risk Profile</h4>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Volatility Tolerance</span>
                <span className={`text-sm font-semibold ${getRiskColor(riskData.volatilityTolerance)}`}>
                  {riskData.volatilityTolerance}%
                </span>
              </div>
              <Progress 
                value={riskData.volatilityTolerance} 
                className="h-2 bg-muted rounded-full overflow-hidden"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">Drawdown Tolerance</span>
                <span className={`text-sm font-semibold ${getRiskColor(riskData.drawdownTolerance)}`}>
                  {riskData.drawdownTolerance}%
                </span>
              </div>
              <Progress 
                value={riskData.drawdownTolerance} 
                className="h-2 bg-muted rounded-full overflow-hidden"
              />
            </div>

            <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
              <span className="text-sm font-medium text-foreground">Position Sizing</span>
              <Badge variant="secondary" className="text-xs font-medium">
                {riskData.positionSizing}
              </Badge>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="relative p-4 rounded-xl bg-orange-500/5 ring-1 ring-orange-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-orange-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
                Risk Assessment
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                High risk appetite with strong volatility tolerance. Consider position sizing limits to protect capital.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}