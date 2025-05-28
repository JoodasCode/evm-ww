import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 ring-1 ring-blue-500/20">
              <User className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-foreground">
                Archetype
              </CardTitle>
              <CardDescription className="text-muted-foreground mt-1">
                Primary trading personality and behavioral pattern
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold text-foreground tracking-tight">
            {archetypeData.primary}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Star className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-muted-foreground font-medium">
              {archetypeData.confidence}% confidence
            </span>
          </div>
        </div>

        <Separator className="bg-border/50" />

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-foreground">Key Traits</h4>
          <div className="flex flex-wrap gap-2">
            {archetypeData.traits.map((trait) => (
              <Badge 
                key={trait} 
                variant="secondary" 
                className="text-xs font-medium px-3 py-1 rounded-full bg-muted/50 ring-1 ring-border/30"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative p-4 rounded-xl bg-blue-500/5 ring-1 ring-blue-500/10">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-400 mt-2" />
            <div className="space-y-1">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                Behavioral Profile
              </p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {archetypeData.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}