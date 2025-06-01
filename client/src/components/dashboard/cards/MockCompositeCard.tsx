import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar as RechartsRadar, Tooltip } from "recharts";

interface MockCompositeCardProps {
  walletAddress: string;
}

export function MockCompositeCard({ walletAddress }: MockCompositeCardProps) {
  // Mock data for radar chart
  const data = [
    { subject: "Risk Appetite", A: 85, fullMark: 100 },
    { subject: "Conviction", A: 65, fullMark: 100 },
    { subject: "Patience", A: 72, fullMark: 100 },
    { subject: "Discipline", A: 58, fullMark: 100 },
    { subject: "Analysis", A: 90, fullMark: 100 },
    { subject: "Adaptability", A: 75, fullMark: 100 },
  ];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Psychological Profile Summary</CardTitle>
        <CardDescription>Comprehensive analysis of your trading psychology</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500 text-white">Swing Trader</Badge>
            <Badge variant="outline">Risk Neutral</Badge>
            <Badge variant="outline">Technical Focused</Badge>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <RechartsRadar
                  name="Trader"
                  dataKey="A"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Key Psychological Traits:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Strong analytical skills with technical focus</li>
              <li>Moderate risk tolerance with preference for swing trading</li>
              <li>Occasional emotional decision-making under pressure</li>
              <li>Good patience for position development</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
