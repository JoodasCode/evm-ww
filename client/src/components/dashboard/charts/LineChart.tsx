import React from 'react';
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface LineChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  className?: string;
  lineColor?: string;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  showTooltip?: boolean;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  strokeWidth?: number;
  dot?: boolean | object;
  activeDot?: boolean | object;
}

export function LineChart({
  data,
  className,
  lineColor = '#3b82f6',
  showGrid = false,
  showXAxis = true,
  showYAxis = false,
  xAxisKey = 'name',
  yAxisKey = 'value',
  height = 200,
  showTooltip = true,
  tooltipFormatter,
  strokeWidth = 2,
  dot = false,
  activeDot = { r: 4, strokeWidth: 1 }
}: LineChartProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              strokeOpacity={0.5}
            />
          )}
          
          {showXAxis && (
            <XAxis
              dataKey={xAxisKey}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              dy={10}
            />
          )}
          
          {showYAxis && (
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              dx={-10}
            />
          )}
          
          {showTooltip && (
            <Tooltip
              formatter={tooltipFormatter}
              contentStyle={{
                backgroundColor: 'var(--background)',
                borderColor: 'var(--border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              }}
              labelStyle={{
                color: 'var(--foreground)',
                fontWeight: 500,
                fontSize: '0.75rem',
                marginBottom: '0.25rem'
              }}
              itemStyle={{
                color: 'var(--muted-foreground)',
                fontSize: '0.75rem',
                padding: '0.125rem 0'
              }}
            />
          )}
          
          <Line
            type="monotone"
            dataKey={yAxisKey}
            stroke={lineColor}
            strokeWidth={strokeWidth}
            dot={dot}
            activeDot={activeDot}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Specialized cost sensitivity chart component
export function CostSensitivityChart({
  data,
  className,
  speedPriority,
  mevProtection,
  premiumTolerance
}: {
  data: Array<{ name: string; value: number }>;
  className?: string;
  speedPriority: 'Low' | 'Medium' | 'High' | 'Very High';
  mevProtection: 'Low' | 'Medium' | 'High' | 'Very High';
  premiumTolerance: string;
}) {
  const getIndicatorWidth = (level: string) => {
    switch(level) {
      case 'Low': return 'w-1/4';
      case 'Medium': return 'w-2/4';
      case 'High': return 'w-3/4';
      case 'Very High': return 'w-full';
      default: return 'w-1/4';
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <div className="p-6">
          <LineChart
            data={data}
            lineColor="#3b82f6"
            showGrid={false}
            showXAxis={true}
            showYAxis={false}
            height={150}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 1 }}
          />
        </div>
        
        <div className="px-6 pb-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Speed Priority</span>
            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full bg-foreground rounded-full", getIndicatorWidth(speedPriority))}></div>
              </div>
              <span className="text-xs">{speedPriority}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">MEV Protection</span>
            <div className="flex items-center space-x-2">
              <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full bg-foreground rounded-full", getIndicatorWidth(mevProtection))}></div>
              </div>
              <span className="text-xs">{mevProtection}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
