import React from 'react';
import { PsychoCard } from './PsychoCard';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface ArchetypeClassifierCardProps {
  walletAddress: string;
  className?: string;
}

const ArchetypeClassifierCard: React.FC<ArchetypeClassifierCardProps> = ({ walletAddress, className }) => {
  return (
    <PsychoCard
      walletAddress={walletAddress}
      cardType="archetype-classifier"
      title="Trader Archetype"
      description="Your trading personality classification"
      className={className}
    >
      {(cardData) => (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{cardData.primaryArchetype}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex items-center">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p>{cardData.archetypeDescription}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="space-y-3">
            {cardData.archetypeScores.map((score) => (
              <div key={score.type} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>{score.type}</span>
                  <span className="font-medium">{score.score}%</span>
                </div>
                <Progress value={score.score} className="h-2" />
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground mb-1">Key Insights:</h4>
            <ul className="list-disc pl-5 space-y-1">
              {cardData.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </PsychoCard>
  );
};

export default ArchetypeClassifierCard;
