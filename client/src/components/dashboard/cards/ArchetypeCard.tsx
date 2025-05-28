import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Shield, Target, Zap } from 'lucide-react';
import type { WhispererScoreData } from '@/types/wallet';

interface ArchetypeCardProps {
  data: WhispererScoreData | null;
  isLoading: boolean;
}

const archetypeIcons = {
  'Strategic Accumulator': TrendingUp,
  'Risk Averse': Shield,
  'FOMO Trader': Zap,
  'Balanced Trader': Target,
  'Novice': Target,
} as const;

const archetypeDescriptions = {
  'Strategic Accumulator': 'You carefully research positions and hold for medium-term gains. Risk-conscious but opportunistic.',
  'Risk Averse': 'You prefer stable investments and avoid high-volatility assets. Conservative approach with steady returns.',
  'FOMO Trader': 'You often jump into trending tokens quickly. High-energy trading with mixed results.',
  'Balanced Trader': 'You maintain a good balance between risk and reward. Disciplined approach to portfolio management.',
  'Novice': 'You\'re still learning the ropes. Building experience with various trading strategies.',
} as const;

export function ArchetypeCard({ data, isLoading }: ArchetypeCardProps) {
  if (isLoading) {
    return (
      <Card className="bg-whisper-card border-whisper-border">
        <CardContent className="p-6">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-whisper-accent rounded-full mx-auto mb-3"></div>
            <div className="h-6 bg-whisper-accent rounded mb-2"></div>
            <div className="h-12 bg-whisper-accent rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const archetype = (data?.archetype || 'Novice') as keyof typeof archetypeIcons;
  const Icon = archetypeIcons[archetype] || Target;
  const description = archetypeDescriptions[archetype] || archetypeDescriptions['Novice'];

  return (
    <Card className="bg-whisper-card border-whisper-border shadow-md">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-whisper-text mb-4">Trader Archetype</h3>
        <div className="text-center">
          <div className="w-16 h-16 bg-whisper-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Icon className="text-2xl text-whisper-text" size={32} />
          </div>
          <h4 className="text-lg font-semibold text-whisper-text">{archetype}</h4>
          <p className="text-sm text-whisper-subtext mt-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
