import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface MockTableCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MockTableCard({ walletAddress, icon: Icon, title, description }: MockTableCardProps) {
  // Mock data for table
  const mockTokens = [
    { name: "SOL", value: "$1,245.00", change: "+12.5%" },
    { name: "JUP", value: "$567.89", change: "-3.2%" },
    { name: "BONK", value: "$123.45", change: "+45.6%" },
    { name: "PYTH", value: "$78.90", change: "+5.4%" },
  ];
  
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
          {mockTokens.map((token, index) => (
            <React.Fragment key={token.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="font-medium">{token.name}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-sm">{token.value}</div>
                  <Badge variant={token.change.startsWith("+") ? "default" : "destructive"} className="text-xs">
                    {token.change}
                  </Badge>
                </div>
              </div>
              {index < mockTokens.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
