import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Clock, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

interface ModernTimingAnalysisCardProps {
  walletAddress: string;
}

export function ModernTimingAnalysisCard({ walletAddress }: ModernTimingAnalysisCardProps) {
  // Mock data - in real app this would come from API
  const timingData = {
    overallScore: 72,
    entryTiming: {
      score: 75,
      rating: 'Good'
    },
    exitTiming: {
      score: 68,
      rating: 'Fair'
    },
    optimalWindows: [
      '9-11 AM',
      '2-4 PM'
    ],
    weekdayPerformance: [
      { day: 'Mon', score: 75 },
      { day: 'Tue', score: 82 },
      { day: 'Wed', score: 68 },
      { day: 'Thu', score: 91 },
      { day: 'Fri', score: 58 }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Excellent': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300';
      case 'Good': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      case 'Fair': return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300';
      case 'Poor': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl">Timing Analysis</CardTitle>
        </div>
        <CardDescription>Entry and exit timing accuracy across different market conditions</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        {/* Overall Score */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold">
            <span className={getScoreColor(timingData.overallScore)}>{timingData.overallScore}</span>
            <span className="text-muted-foreground text-lg">/100</span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Timing Score</p>
        </div>

        <Separator />

        {/* Entry/Exit Timing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Entry Timing</span>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className={`text-xl font-bold ${getScoreColor(timingData.entryTiming.score)}`}>
                {timingData.entryTiming.score}%
              </div>
              <Badge variant="outline" className={`text-xs ${getRatingColor(timingData.entryTiming.rating)}`}>
                {timingData.entryTiming.rating}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Exit Timing</span>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/50">
              <div className={`text-xl font-bold ${getScoreColor(timingData.exitTiming.score)}`}>
                {timingData.exitTiming.score}%
              </div>
              <Badge variant="outline" className={`text-xs ${getRatingColor(timingData.exitTiming.rating)}`}>
                {timingData.exitTiming.rating}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        {/* Optimal Trading Windows */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            Optimal Trading Windows
          </h4>
          <div className="flex gap-2">
            {timingData.optimalWindows.map((window) => (
              <Badge key={window} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300">
                {window}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Weekday Performance */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Weekday Performance</h4>
          <div className="space-y-2 max-h-20 overflow-y-auto">
            {timingData.weekdayPerformance.map((day) => (
              <div key={day.day} className="flex items-center justify-between">
                <span className="text-sm font-medium w-8">{day.day}</span>
                <div className="flex-1 mx-3">
                  <Progress value={day.score} className="h-2" />
                </div>
                <span className={`text-sm font-bold w-8 ${getScoreColor(day.score)}`}>
                  {day.score}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Timing Insight */}
        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs font-medium text-blue-600 mb-1">⏰ Timing Intelligence</p>
          <p className="text-xs text-muted-foreground">
            {timingData.overallScore >= 75 
              ? "Excellent timing skills! Your entry and exit points are well-coordinated with market movements."
              : timingData.overallScore >= 60 
              ? "Good timing foundation. Focus on improving exit strategies for better performance."
              : "Consider developing systematic timing rules and market condition awareness."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}