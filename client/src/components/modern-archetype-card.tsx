import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Star } from 'lucide-react';

interface ModernArchetypeCardProps {
  walletAddress: string;
}

export function ModernArchetypeCard({ walletAddress }: ModernArchetypeCardProps) {
  // Will connect to API endpoint /api/wallet/${walletAddress}/archetype
  const archetypeData = {
    primary: 'Strategic Momentum Trader',
    confidence: 87,
    traits: ['High Conviction', 'Research-Driven', 'Risk-Aware'],
    description: 'Combines technical analysis with fundamental research for strategic entries'
  };

  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-xl">Archetype</CardTitle>
        </div>
        <CardDescription>Primary trading personality and behavioral pattern</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 overflow-hidden">
        <div className="text-center space-y-3">
          <div className="text-2xl font-bold text-primary">{archetypeData.primary}</div>
          <div className="flex items-center justify-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">{archetypeData.confidence}% confidence</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold">Key Traits</h4>
          <div className="flex flex-wrap gap-2">
            {archetypeData.traits.map((trait) => (
              <Badge key={trait} variant="secondary" className="text-xs">
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/20">
          <p className="text-xs text-muted-foreground">{archetypeData.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}