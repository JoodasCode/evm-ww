import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface ModernMoodTimelineCardProps {
  walletAddress: string;
}

export function ModernMoodTimelineCard({ walletAddress }: ModernMoodTimelineCardProps) {
  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-pink-500" />
          <CardTitle className="text-xl">Mood Timeline</CardTitle>
        </div>
        <CardDescription>Emotional state changes over time</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <p className="text-muted-foreground">Connect API for mood timeline data</p>
      </CardContent>
    </Card>
  );
}