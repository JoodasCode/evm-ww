import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl">Risk Appetite</CardTitle>
        </div>
        <CardDescription>Risk tolerance and volatility comfort analysis</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Risk Score */}
        <div className="text-center space-y-3">
          <div className="text-4xl font-bold">
            <span className={getRiskColor(riskData.riskScore)}>{riskData.riskScore}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <Badge variant="outline" className={`text-sm px-3 py-1 ${getRiskBadgeColor(riskData.riskLevel)}`}>
            {riskData.riskLevel}
          </Badge>
        </div>

        {/* Risk Metrics */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Risk Profile
          </h4>
          
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Volatility Tolerance</span>
                <span className={getRiskColor(riskData.volatilityTolerance)}>
                  {riskData.volatilityTolerance}%
                </span>
              </div>
              <Progress value={riskData.volatilityTolerance} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Drawdown Tolerance</span>
                <span className={getRiskColor(riskData.drawdownTolerance)}>
                  {riskData.drawdownTolerance}%
                </span>
              </div>
              <Progress value={riskData.drawdownTolerance} className="h-2" />
            </div>

            <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Position Sizing</span>
              <Badge variant="secondary" className="text-xs">
                {riskData.positionSizing}
              </Badge>
            </div>
          </div>
        </div>

        {/* Risk Insight */}
        <div className="bg-orange-500/5 rounded-lg p-3 border border-orange-500/20">
          <p className="text-xs font-medium text-orange-600 mb-1">⚠️ Risk Assessment</p>
          <p className="text-xs text-muted-foreground">
            High risk appetite with strong volatility tolerance. Consider position sizing limits to protect capital.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}