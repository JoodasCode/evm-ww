import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MockHeatmapCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MockHeatmapCard({ walletAddress, icon: Icon, title, description }: MockHeatmapCardProps) {
  // Generate a 7x24 grid for days of week and hours
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["00", "06", "12", "18"];
  
  // Function to generate a color based on intensity
  const getColor = (intensity: number) => {
    if (intensity < 0.2) return "bg-primary/10";
    if (intensity < 0.4) return "bg-primary/30";
    if (intensity < 0.6) return "bg-primary/50";
    if (intensity < 0.8) return "bg-primary/70";
    return "bg-primary";
  };
  
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
          <div className="grid grid-cols-5 gap-1">
            <div className="col-span-1"></div>
            {hours.map(hour => (
              <div key={hour} className="text-center text-xs text-muted-foreground">
                {hour}
              </div>
            ))}
            
            {days.map(day => (
              <React.Fragment key={day}>
                <div className="text-xs text-muted-foreground">{day}</div>
                {hours.map((_, i) => {
                  const intensity = Math.random();
                  return (
                    <div 
                      key={`${day}-${i}`} 
                      className={`h-6 w-full rounded-sm ${getColor(intensity)}`}
                      title={`${intensity.toFixed(2) * 100}% activity`}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Less Active</span>
            <div className="flex space-x-1">
              <div className="h-3 w-3 rounded-sm bg-primary/10"></div>
              <div className="h-3 w-3 rounded-sm bg-primary/30"></div>
              <div className="h-3 w-3 rounded-sm bg-primary/50"></div>
              <div className="h-3 w-3 rounded-sm bg-primary/70"></div>
              <div className="h-3 w-3 rounded-sm bg-primary"></div>
            </div>
            <span>More Active</span>
          </div>
          
          <div className="text-xs text-muted-foreground mt-2">
            <Badge variant="outline" className="mr-1">Peak Activity</Badge>
            {days[Math.floor(Math.random() * days.length)]} at {Math.floor(Math.random() * 24).toString().padStart(2, '0')}:00
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
