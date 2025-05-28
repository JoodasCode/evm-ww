import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, TrendingUp } from 'lucide-react';

interface ModernMoodTimelineCardProps {
  walletAddress: string;
}

export function ModernMoodTimelineCard({ walletAddress }: ModernMoodTimelineCardProps) {
  const moodData = {
    currentMood: 'Bullish',
    confidence: 78,
    timeline: [
      { period: 'Today', mood: 'Bullish', score: 78, change: '+5%' },
      { period: 'Yesterday', mood: 'Neutral', score: 65, change: '-8%' },
      { period: '3 days ago', mood: 'Bearish', score: 42, change: '-12%' },
      { period: '1 week ago', mood: 'Bullish', score: 85, change: '+15%' }
    ]
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'Bullish': return 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20';
      case 'Bearish': return 'text-red-400 bg-red-500/10 ring-red-500/20';
      case 'Neutral': return 'text-amber-400 bg-amber-500/10 ring-amber-500/20';
      default: return 'text-muted-foreground bg-muted/30 ring-border/50';
    }
  };

  const getChangeColor = (change: string) => {
    if (change.startsWith('+')) return 'text-emerald-400';
    if (change.startsWith('-')) return 'text-red-400';
    return 'text-muted-foreground';
  };

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 ring-1 ring-indigo-500/20">
              <Clock className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Mood Timeline
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Market sentiment and psychological state tracking
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Mood */}
        <div className="text-center space-y-4">
          <div className="space-y-2">
            <Badge 
              variant="outline" 
              className={`px-4 py-2 text-lg font-semibold rounded-full ring-1 ${getMoodColor(moodData.currentMood)}`}
            >
              {moodData.currentMood}
            </Badge>
            <div className="text-sm text-muted-foreground">
              {moodData.confidence}% confidence
            </div>
          </div>
        </div>

        <Separator className="bg-border/50" />

        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Recent Timeline</h4>
          </div>
          
          <div className="space-y-3">
            {moodData.timeline.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 ring-1 ring-border/50">
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-muted-foreground w-20">
                    {entry.period}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs font-medium px-2 py-1 rounded-full ring-1 ${getMoodColor(entry.mood)}`}
                  >
                    {entry.mood}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm font-semibold text-foreground">
                    {entry.score}
                  </div>
                  <div className={`text-xs font-medium ${getChangeColor(entry.change)}`}>
                    {entry.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mood Insight */}
        <div className="relative p-4 rounded-xl bg-indigo-500/5 ring-1 ring-indigo-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                Sentiment Analysis
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                Recovery from recent bearish sentiment. Current bullish mood shows renewed confidence in market conditions.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}