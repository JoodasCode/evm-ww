import React from 'react';
import {
  Area,
  AreaChart as RechartsAreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface AreaChartProps {
  data: Array<{
    name: string;
    value: number;
    [key: string]: any;
  }>;
  className?: string;
  areaColor?: string;
  fillOpacity?: number;
  showGrid?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  showTooltip?: boolean;
  tooltipFormatter?: (value: number, name: string) => [string, string];
  strokeWidth?: number;
}

export function AreaChart({
  data,
  className,
  areaColor = '#8884d8',
  fillOpacity = 0.5,
  showGrid = false,
  showXAxis = true,
  showYAxis = false,
  xAxisKey = 'name',
  yAxisKey = 'value',
  height = 200,
  showTooltip = true,
  tooltipFormatter,
  strokeWidth = 2
}: AreaChartProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
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
          
          <Area
            type="monotone"
            dataKey={yAxisKey}
            stroke={areaColor}
            fill={areaColor}
            fillOpacity={fillOpacity}
            strokeWidth={strokeWidth}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Specialized trading frequency chart component
export function TradingFrequencyChart({
  data,
  className,
  peakDay,
  restDays,
  consistency
}: {
  data: Array<{ name: string; value: number }>;
  className?: string;
  peakDay: string;
  restDays: string;
  consistency: string;
}) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <div className="p-6">
          <AreaChart
            data={data}
            areaColor="#8884d8"
            fillOpacity={0.6}
            showGrid={false}
            showXAxis={true}
            showYAxis={false}
            height={150}
            strokeWidth={2}
          />
        </div>
        
        <div className="grid grid-cols-3 border-t border-border">
          <div className="flex flex-col items-center justify-center py-3 px-2 border-r border-border">
            <span className="text-sm font-medium">{peakDay}</span>
            <span className="text-xs text-muted-foreground">Peak day</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 px-2 border-r border-border">
            <span className="text-sm font-medium">{restDays}</span>
            <span className="text-xs text-muted-foreground">Rest days</span>
          </div>
          <div className="flex flex-col items-center justify-center py-3 px-2">
            <span className="text-sm font-medium">{consistency}</span>
            <span className="text-xs text-muted-foreground">Consistency</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
