import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MockGaugeCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MockGaugeCard({ walletAddress, icon: Icon, title, description }: MockGaugeCardProps) {
  // Generate a random value between 0 and 100
  const value = Math.floor(Math.random() * 100);
  
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
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{value}%</span>
            <span className="text-xs text-muted-foreground">
              {value < 30 ? "Low" : value < 70 ? "Medium" : "High"}
            </span>
          </div>
          <Progress value={value} />
          <div className="text-xs text-muted-foreground mt-2">
            {value < 30 
              ? "Your score is relatively low compared to other traders." 
              : value < 70 
                ? "Your score is average compared to other traders." 
                : "Your score is high compared to other traders."}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
