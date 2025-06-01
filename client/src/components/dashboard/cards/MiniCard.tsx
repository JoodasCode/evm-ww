import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MiniCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary";
}

export function MiniCard({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description, 
  value,
  badge,
  badgeVariant = "default"
}: MiniCardProps) {
  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
        <div>
          <CardTitle className="text-xs font-medium flex items-center gap-1">
            <Icon className="h-3 w-3 text-muted-foreground" />
            {title}
          </CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className="space-y-1">
          <p className="text-sm font-bold">{value}</p>
          {badge && (
            <Badge className="text-xs px-1 py-0" variant={badgeVariant}>{badge}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
