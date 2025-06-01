import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DetailedTabLayoutProps {
  title: string;
  description: string;
  walletAddress: string;
  children: React.ReactNode;
  className?: string;
}

export function DetailedTabLayout({
  title,
  description,
  walletAddress,
  children,
  className,
}: DetailedTabLayoutProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="px-3 py-1">
            Last 30 days
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-4)}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}
