import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { WhispererScore } from "@/types/wallet";

interface WhispererScoreCardProps {
  score: WhispererScore;
}

export function WhispererScoreCard({ score }: WhispererScoreCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Whisperer Score</CardTitle>
          <div className="w-16 h-16 relative">
            {/* Circular progress indicator */}
            <svg className="w-16 h-16 transform -rotate-90">
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
                className="text-border"
              />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" 
                strokeDasharray="176" 
                strokeDashoffset={176 - (176 * score.whispererScore) / 100}
                className="text-foreground"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-foreground">{score.whispererScore}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Last updated: {formatDate(score.updatedAt)}
        </p>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Risk Score:</span>
            <span className="text-foreground">{score.degenScore}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">ROI Score:</span>
            <span className="text-foreground">{score.roiScore}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Influence:</span>
            <span className="text-foreground">{score.influenceScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
