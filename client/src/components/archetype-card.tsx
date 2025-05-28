import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Zap, Target, Brain, Star } from "lucide-react";
import type { WhispererScore } from "@/types/wallet";

interface ArchetypeCardProps {
  score: WhispererScore;
}

const archetypeConfig = {
  "Strategic Accumulator": {
    icon: Target,
    description: "You carefully research positions and hold for medium-term gains. Risk-conscious but opportunistic.",
  },
  "Degen Trader": {
    icon: Zap,
    description: "High-risk, high-reward mindset. You thrive on volatility and aren't afraid to make bold moves.",
  },
  "Conservative Investor": {
    icon: Shield,
    description: "Safety first approach with focus on established tokens and steady growth.",
  },
  "Trend Follower": {
    icon: TrendingUp,
    description: "You excel at identifying and riding market momentum waves.",
  },
  "Alpha Hunter": {
    icon: Star,
    description: "Early adopter who finds opportunities before the masses catch on.",
  },
  "Novice": {
    icon: Brain,
    description: "Still learning the ropes. Focus on education and gradual position building.",
  },
};

export function ArchetypeCard({ score }: ArchetypeCardProps) {
  const archetype = score.archetype || "Novice";
  const config = archetypeConfig[archetype as keyof typeof archetypeConfig] || archetypeConfig.Novice;
  const Icon = config.icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Trader Archetype</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
            <Icon className="w-8 h-8 text-accent-foreground" />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-foreground">{archetype}</h4>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {config.description}
            </p>
          </div>
          <div className="pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Mood</p>
                <p className="text-foreground font-medium">{score.currentMood}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Risk Level</p>
                <p className="text-foreground font-medium">{score.riskLevel}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
