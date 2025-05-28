import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { WhispererScore } from "@/types/wallet";

interface RiskAppetiteCardProps {
  score: WhispererScore;
}

export function RiskAppetiteCard({ score }: RiskAppetiteCardProps) {
  // Calculate risk metrics based on scores
  const volatilityTolerance = Math.min(100, score.degenScore + 10);
  const positionSizing = Math.max(20, 100 - score.degenScore);
  const fomoResistance = Math.min(100, score.whispererScore - 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Risk Appetite</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Volatility Tolerance</span>
              <span className="text-sm text-foreground">{volatilityTolerance}%</span>
            </div>
            <Progress value={volatilityTolerance} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">Position Sizing</span>
              <span className="text-sm text-foreground">{positionSizing}%</span>
            </div>
            <Progress value={positionSizing} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">FOMO Resistance</span>
              <span className="text-sm text-foreground">{fomoResistance}%</span>
            </div>
            <Progress value={fomoResistance} className="h-2" />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Risk Level</p>
                <p className="text-foreground font-medium">{score.riskLevel}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Frequency</p>
                <p className="text-foreground font-medium">{score.tradingFrequency}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
