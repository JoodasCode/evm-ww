import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GaugeChartProps {
  value: number; // 0-100
  className?: string;
  size?: number;
  thickness?: number;
  colors?: string[];
  showLabel?: boolean;
  label?: string;
  labelClassName?: string;
}

export function GaugeChart({
  value,
  className,
  size = 200,
  thickness = 20,
  colors = ['#3b82f6', '#f43f5e', '#10b981', '#f59e0b'],
  showLabel = true,
  label,
  labelClassName
}: GaugeChartProps) {
  // Ensure value is between 0-100
  const safeValue = Math.max(0, Math.min(100, value));
  
  // Create data for the gauge
  const data = [
    { name: 'filled', value: safeValue },
    { name: 'empty', value: 100 - safeValue }
  ];
  
  // Determine color based on value
  const getColor = (value: number) => {
    if (value < 25) return colors[1]; // Red for low
    if (value < 50) return colors[3]; // Yellow for medium-low
    if (value < 75) return colors[2]; // Green for medium-high
    return colors[0]; // Blue for high
  };
  
  const color = getColor(safeValue);
  
  // Get label text based on value
  const getLabelText = (value: number) => {
    if (label) return label;
    if (value < 25) return 'Low';
    if (value < 50) return 'Medium';
    if (value < 75) return 'High';
    return 'Very High';
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={size / 2 - thickness}
              outerRadius={size / 2}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
            >
              <Cell key="filled" fill={color} />
              <Cell key="empty" fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center value display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold">{safeValue}</span>
          {showLabel && (
            <Badge variant="outline" className={cn("mt-2", labelClassName)}>
              {getLabelText(safeValue)}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

// Specialized psycho score gauge component
export function PsychoScoreGauge({
  score,
  percentile,
  trend,
  className,
  analysis
}: {
  score: number;
  percentile: string;
  trend: { value: string; direction: 'up' | 'down' | 'neutral' };
  className?: string;
  analysis?: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex justify-center mb-4">
          <GaugeChart value={score} size={180} thickness={16} />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Percentile</h4>
            <p className="text-2xl font-bold">{percentile}</p>
            <p className="text-xs text-muted-foreground">Higher than {percentile} of traders</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Trend</h4>
            <p className={cn(
              "text-2xl font-bold",
              trend.direction === 'up' ? "text-green-500" : 
              trend.direction === 'down' ? "text-red-500" : ""
            )}>
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}{trend.value}
            </p>
            <p className="text-xs text-muted-foreground">
              {trend.direction === 'up' ? 'Increased' : 
               trend.direction === 'down' ? 'Decreased' : 'Unchanged'} in last 30 days
            </p>
          </div>
        </div>
        
        {analysis && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Analysis</h4>
            <p className="text-sm text-muted-foreground">{analysis}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
