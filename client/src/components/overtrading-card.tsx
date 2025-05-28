import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WhispererScore } from "@/types/wallet";

interface OvertradingCardProps {
  score: WhispererScore;
}

export function OvertradingCard({ score }: OvertradingCardProps) {
  // Calculate overtrading risk based on trading frequency and score
  const getOvertradingLevel = () => {
    const dailyTrades = score.dailyTrades;
    const riskScore = score.degenScore;
    
    if (dailyTrades > 10 || riskScore > 80) return "High";
    if (dailyTrades > 5 || riskScore > 60) return "Medium";
    return "Low";
  };

  const getOvertradingPercentage = () => {
    const level = getOvertradingLevel();
    switch (level) {
      case "High": return 80;
      case "Medium": return 50;
      case "Low": return 20;
      default: return 20;
    }
  };

  const getDescription = () => {
    const level = getOvertradingLevel();
    switch (level) {
      case "High": 
        return "Consider reducing trade frequency to improve performance";
      case "Medium": 
        return "Monitor your trading activity for potential overtrading";
      case "Low": 
        return "Your trading frequency is within healthy bounds";
      default: 
        return "Your trading frequency is within healthy bounds";
    }
  };

  const percentage = getOvertradingPercentage();
  const level = getOvertradingLevel();
  const strokeDashoffset = 220 - (220 * percentage) / 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Overtrading Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto relative">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="none" 
                className="text-border"
              />
              <circle 
                cx="40" 
                cy="40" 
                r="35" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray="220" 
                strokeDashoffset={strokeDashoffset}
                className="text-foreground"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{level}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {getDescription()}
          </p>

          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Daily Trades</p>
                <p className="text-foreground font-medium">{score.dailyTrades}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Score</p>
                <p className="text-foreground font-medium">{score.degenScore}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
