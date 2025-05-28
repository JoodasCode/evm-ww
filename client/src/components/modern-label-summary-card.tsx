import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tags } from 'lucide-react';

interface ModernLabelSummaryCardProps {
  walletAddress: string;
}

export function ModernLabelSummaryCard({ walletAddress }: ModernLabelSummaryCardProps) {
  // Will connect to API endpoint /api/wallet/${walletAddress}/labels/summary
  const labels = [
    { name: 'Cautiously Optimistic', category: 'mood', confidence: 78 },
    { name: 'High Risk Tolerance', category: 'trait', confidence: 92 },
    { name: 'Strategic Entry', category: 'behavior', confidence: 85 },
    { name: 'FOMO Resistant', category: 'trait', confidence: 67 },
    { name: 'Pattern Seeker', category: 'behavior', confidence: 73 }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mood': return 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-300';
      case 'trait': return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300';
      case 'behavior': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300';
      default: return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300';
    }
  };

  return (
    <Card className="h-[200px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Tags className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Label Summary</CardTitle>
        </div>
        <CardDescription>Current mood tags and behavioral classifications</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden">
        <div className="flex flex-wrap gap-2">
          {labels.map((label, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className={`text-xs ${getCategoryColor(label.category)}`}
            >
              {label.name} ({label.confidence}%)
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}