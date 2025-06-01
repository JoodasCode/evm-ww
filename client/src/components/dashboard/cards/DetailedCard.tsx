import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface DetailedCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function DetailedCard({
  title,
  description,
  icon: Icon,
  loading = false,
  className,
  children
}: DetailedCardProps) {
  return (
    <Card className={cn("h-full overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            {title}
          </CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
