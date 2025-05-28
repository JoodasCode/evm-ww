import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WhispererScoreData } from '@/types/wallet';

interface WhispererScoreCardProps {
  data: WhispererScoreData | null;
  isLoading: boolean;
}

export function WhispererScoreCard({ data, isLoading }: WhispererScoreCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardHeader>
          <CardTitle className="text-whisper-text">Whisperer Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-whisper-accent rounded-full mx-auto mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-whisper-accent rounded w-3/4"></div>
              <div className="h-4 bg-whisper-accent rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardHeader>
          <CardTitle className="text-whisper-text">Whisperer Score</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-whisper-subtext">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const score = data.whispererScore;
  const circumference = 2 * Math.PI * 28;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-whisper-card border-whisper-border shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-whisper-text">Whisperer Score</h3>
          <div className="w-16 h-16 relative">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-whisper-border"
              />
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="text-whisper-text stroke-linecap-round transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-whisper-text">{score}</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-whisper-subtext mb-4">
          Last updated: {data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'Never'}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-whisper-subtext">Risk Score:</span>
            <span className="text-whisper-text">{data.degenScore}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-whisper-subtext">ROI Score:</span>
            <span className="text-whisper-text">{data.roiScore}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
