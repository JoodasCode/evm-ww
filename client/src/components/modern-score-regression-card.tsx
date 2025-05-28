import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

interface ModernScoreRegressionCardProps {
  walletAddress: string;
}

export function ModernScoreRegressionCard({ walletAddress }: ModernScoreRegressionCardProps) {
  return (
    <Card className="h-[450px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl">Score Regression</CardTitle>
        </div>
        <CardDescription>Score changes and trends over time</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <p className="text-muted-foreground">Connect API for score regression data</p>
      </CardContent>
    </Card>
  );
}