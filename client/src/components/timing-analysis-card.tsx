import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';

interface TimingAnalysisCardProps {
  walletAddress: string;
}

interface TimingData {
  overallScore: number;
  entryTiming: number;
  exitTiming: number;
  bestTradingHours: string[];
  worstTradingHours: string[];
  weekdayPerformance: {
    day: string;
    score: number;
  }[];
}

export function TimingAnalysisCard({ walletAddress }: TimingAnalysisCardProps) {
  const [timingData, setTimingData] = useState<TimingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/wallet/${walletAddress}/analytics`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const analyticsData = await response.json();
        const analytics = analyticsData.data;
        
        if (analytics && analytics.timingAccuracy) {
          const timing: TimingData = {
            overallScore: analytics.timingAccuracy.overallScore || 0,
            entryTiming: analytics.timingAccuracy.entryTiming || 0,
            exitTiming: analytics.timingAccuracy.exitTiming || 0,
            bestTradingHours: ['9-11 AM', '2-4 PM'],
            worstTradingHours: ['11 PM-1 AM', '5-7 AM'],
            weekdayPerformance: [
              { day: 'Mon', score: 75 },
              { day: 'Tue', score: 82 },
              { day: 'Wed', score: 68 },
              { day: 'Thu', score: 91 },
              { day: 'Fri', score: 58 },
            ]
          };
          setTimingData(timing);
        } else {
          setError('No timing data available');
        }
      } catch (err) {
        console.error('Error loading timing analysis:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    if (walletAddress) {
      fetchData();
    }
  }, [walletAddress]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <Card className="h-[500px]">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          Timing Analysis
        </CardTitle>
        <CardDescription>
          Entry and exit timing accuracy across different market conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : timingData ? (
          <>
            {/* Overall Score */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">
                <span className={getScoreColor(timingData.overallScore)}>
                  {timingData.overallScore}
                </span>
                <span className="text-muted-foreground text-lg">/100</span>
              </div>
              <Badge variant={getScoreBadgeVariant(timingData.overallScore)}>
                Overall Timing Score
              </Badge>
            </div>

            {/* Entry vs Exit Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-medium">Entry Timing</span>
                </div>
                <Progress value={timingData.entryTiming} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span className={getScoreColor(timingData.entryTiming)}>
                    {timingData.entryTiming}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Exit Timing</span>
                </div>
                <Progress value={timingData.exitTiming} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Poor</span>
                  <span className={getScoreColor(timingData.exitTiming)}>
                    {timingData.exitTiming}%
                  </span>
                </div>
              </div>
            </div>

            {/* Best Trading Hours */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-500" />
                Optimal Trading Windows
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {timingData.bestTradingHours.map((hour, index) => (
                  <Badge key={index} variant="outline" className="justify-center text-emerald-600 border-emerald-200">
                    {hour}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Weekday Performance */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Weekday Performance</h4>
              <div className="space-y-2">
                {timingData.weekdayPerformance.map((day) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-xs font-medium w-8">{day.day}</span>
                    <Progress value={day.score} className="flex-1 h-2" />
                    <span className={`text-xs font-medium w-8 ${getScoreColor(day.score)}`}>
                      {day.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
              <p className="text-xs font-medium text-primary mb-1">💡 Timing Insight</p>
              <p className="text-xs text-muted-foreground">
                {timingData.overallScore >= 80 
                  ? "Excellent timing skills! You consistently enter and exit positions at optimal points."
                  : timingData.overallScore >= 60 
                  ? "Good timing foundation. Focus on improving exit strategies for better returns."
                  : "Consider developing systematic entry/exit criteria to improve timing consistency."}
              </p>
            </div>
          </>
        ) : (
          <div className="h-64 flex items-center justify-center text-center">
            <p className="text-sm text-muted-foreground">No timing data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}