import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MockBarChartCardProps {
  walletAddress: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function MockBarChartCard({ walletAddress, icon: Icon, title, description }: MockBarChartCardProps) {
  // Mock data for bar chart
  const data = [
    { name: "Jan", value: Math.floor(Math.random() * 100) },
    { name: "Feb", value: Math.floor(Math.random() * 100) },
    { name: "Mar", value: Math.floor(Math.random() * 100) },
    { name: "Apr", value: Math.floor(Math.random() * 100) },
    { name: "May", value: Math.floor(Math.random() * 100) },
    { name: "Jun", value: Math.floor(Math.random() * 100) },
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
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
