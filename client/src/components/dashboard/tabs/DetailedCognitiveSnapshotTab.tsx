import React from "react";
import { Badge } from "@/components/ui/badge";
import { CardLayout, CardItem } from "@/components/ui/card-layout";
import { SpacerCard } from "@/components/ui/spacer-card";
import { Brain, Zap, Activity, Clock } from "lucide-react";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent 
} from "@/components/ui/chart";
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface DetailedCognitiveSnapshotTabProps {
  walletAddress: string;
}

export function DetailedCognitiveSnapshotTab({ walletAddress }: DetailedCognitiveSnapshotTabProps) {
  const { data: archetypeData, loading: archetypeLoading } = useWalletPsychoCard(walletAddress, "archetype");
  const { data: impulseData, loading: impulseLoading } = useWalletPsychoCard(walletAddress, "impulseControl");
  const { data: activityData, loading: activityLoading } = useWalletPsychoCard(walletAddress, "activityPatterns");
  const { data: heatmapData, loading: heatmapLoading } = useWalletPsychoCard(walletAddress, "timeHeatmap");

  // Mock chart data for demonstration
  const barChartData = [
    { name: "Mon", value: 40 },
    { name: "Tue", value: 30 },
    { name: "Wed", value: 60 },
    { name: "Thu", value: 25 },
    { name: "Fri", value: 50 },
    { name: "Sat", value: 75 },
    { name: "Sun", value: 20 },
  ];

  return (
    <CardLayout 
      title="Cognitive Snapshot"
      description="Your wallet's mental profile at a glance"
      fixedHeight
    >
      <CardItem
        title="Trader Archetype Analysis"
        description="Comprehensive breakdown of your trading personality and behavior patterns"
        icon={Brain}
        loading={archetypeLoading}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Primary Type</h4>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                <span className="font-semibold">Momentum Trader</span>
              </div>
              <p className="text-sm text-muted-foreground">You follow market trends and momentum signals</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Secondary Type</h4>
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 rounded-full bg-green-500"></div>
                <span className="font-semibold">Value Investor</span>
              </div>
              <p className="text-sm text-muted-foreground">You seek undervalued assets with growth potential</p>
            </div>
          </div>
          
          <div className="rounded-md border p-4 bg-muted/10">
            <h4 className="font-medium mb-2">Psychological Profile</h4>
            <p className="text-sm text-muted-foreground">
              Your trading behavior shows a blend of momentum-chasing and value-seeking. You tend to follow market trends 
              but also look for fundamentally strong assets. This dual approach gives you versatility but can lead to 
              conflicting signals during market volatility.
            </p>
          </div>
        </div>
      </CardItem>
      
      <CardItem
        title="Impulse Control Score"
        description="Measuring your trading discipline and emotional control"
        icon={Zap}
        loading={impulseLoading}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-4">
          <div className="relative h-40 w-40">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-3xl font-bold">71</div>
            </div>
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="10"
                strokeDasharray="283"
                strokeDashoffset="82"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
          <div className="text-center space-y-1">
            <h4 className="font-medium">Strong Impulse Control</h4>
            <p className="text-sm text-muted-foreground">
              You rarely make emotional trading decisions and generally stick to your strategy
            </p>
          </div>
        </div>
      </CardItem>
      
      <CardItem
        title="Trading Activity Patterns"
        description="Analysis of your trading frequency and timing"
        icon={Activity}
        loading={activityLoading}
      >
        <div className="space-y-4">
          <div className="h-40 w-full">
            <ChartContainer
              config={{
                activity: {
                  label: "Activity",
                  color: "#3b82f6"
                }
              }}
            >
              <RechartsBarChart data={barChartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis hide />
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-md">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{payload[0].name}</span>
                              <span className="text-xs text-muted-foreground">Day</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-medium">{payload[0].value}</span>
                              <span className="text-xs text-muted-foreground">Activity</span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-activity)" 
                  radius={[4, 4, 0, 0]}
                />
              </RechartsBarChart>
            </ChartContainer>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Trading Frequency</span>
              <span className="text-sm font-medium">High</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-4/5 rounded-full"></div>
            </div>
            <p className="text-xs text-muted-foreground">You trade more frequently than 80% of similar wallets</p>
          </div>
        </div>
      </CardItem>
      
      <CardItem
        title="Trading Time Heatmap"
        description="When you're most active in the market"
        icon={Clock}
        loading={heatmapLoading}
      >
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-1 text-left text-xs font-medium"></th>
                  {['00', '04', '08', '12', '16', '20'].map((hour, index) => (
                    <th key={index} className="p-1 text-center text-xs font-medium">
                      {hour}:00
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, rowIndex) => (
                  <tr key={rowIndex}>
                    <td className="p-1 text-xs font-medium">{day}</td>
                    {[0, 1, 2, 3, 4, 5].map((colIndex) => {
                      // Generate random intensity for demo
                      const intensity = Math.floor(Math.random() * 5);
                      const getColor = (i: number) => {
                        const colors = [
                          "bg-muted/30",           // 0 - very low
                          "bg-blue-100",           // 1 - low
                          "bg-blue-300",           // 2 - medium
                          "bg-blue-500",           // 3 - high
                          "bg-blue-700 text-white" // 4 - very high
                        ];
                        return colors[i];
                      };
                      
                      return (
                        <td key={colIndex} className="p-0">
                          <div 
                            className={`w-8 h-8 m-1 rounded flex items-center justify-center text-xs font-medium ${getColor(intensity)}`}
                          >
                            {intensity > 0 ? intensity : ""}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-muted/30"></div>
              <span>None</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-100"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-300"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 rounded bg-blue-700"></div>
              <span>Very High</span>
            </div>
          </div>
        </div>
      </CardItem>
    </CardLayout>
  );
}
