import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MockArchetypeCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MockArchetypeCard({ walletAddress, icon: Icon, title, description }: MockArchetypeCardProps) {
  // Mock data for archetype
  const archetypes = ["Swing Trader", "Risk Neutral", "Technical Focused"];
  const summary = "This wallet shows consistent patterns of medium-term position holding with strategic entry and exit points.";
  
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-primary">{archetypes[0]}</Badge>
            {archetypes.slice(1).map((archetype, index) => (
              <Badge key={index} variant="outline">{archetype}</Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
