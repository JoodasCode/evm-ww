import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw } from 'lucide-react';
import useCardData from '@/hooks/useCardData';

interface PsychoCardProps {
  walletAddress: string;
  cardType: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export const PsychoCard: React.FC<PsychoCardProps> = ({
  walletAddress,
  cardType,
  title,
  description,
  className = '',
  children,
}) => {
  const { useCard, useRefreshCard } = useCardData();
  const { data: cardData, isLoading, isError, error } = useCard(walletAddress, cardType);
  const { mutate: refreshCard, isPending: isRefreshing } = useRefreshCard();

  const handleRefresh = () => {
    refreshCard({ walletAddress, cardType });
  };

  // Format timestamp
  const formattedTime = cardData?.metadata?.calculatedAt
    ? new Date(cardData.metadata.calculatedAt).toLocaleString()
    : '';

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : isError ? (
          <div className="p-4 text-center">
            <p className="text-red-500 font-medium">Error loading card</p>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'Something went wrong'}
            </p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : cardData?.error ? (
          <div className="p-4 text-center">
            <p className="text-amber-500 font-medium">Analysis Error</p>
            <p className="text-sm text-muted-foreground">{cardData.message}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          children
        )}
      </CardContent>

      <CardFooter className="pt-1 border-t text-xs text-muted-foreground flex justify-between items-center">
        <span>Last updated: {formattedTime}</span>
        <Badge variant="outline" className="text-xs">
          {cardType}
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default PsychoCard;
