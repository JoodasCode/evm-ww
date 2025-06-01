import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import { CostSensitivityChart } from "../charts/LineChart";
import { TradingFrequencyChart } from "../charts/AreaChart";
import { cn } from "@/lib/utils";

interface DetailedCompositeCardProps {
  walletAddress: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const DetailedCompositeCard = ({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description 
}: DetailedCompositeCardProps) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "compositeData");
  
  // Mock data for psychological weaknesses
  const weaknessData = [
    { name: "FOMO", value: 85, color: "bg-red-500" },
    { name: "Impatience", value: 72, color: "bg-red-500" },
    { name: "Loss Aversion", value: 65, color: "bg-amber-500" },
    { name: "Overconfidence", value: 58, color: "bg-amber-500" },
    { name: "Anchoring", value: 45, color: "bg-blue-500" },
  ];
  
  // Pie chart data for psychological weakness distribution
  const pieData = [
    { name: "FOMO", value: 35 },
    { name: "Impatience", value: 25 },
    { name: "Loss Aversion", value: 20 },
    { name: "Overconfidence", value: 15 },
    { name: "Anchoring", value: 5 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#FF8042', '#FFBB28', '#00C49F', '#0088FE', '#8884d8'];

  // Trend data for primary weakness
  const trendData = [
    { name: "Jan", value: 65 },
    { name: "Feb", value: 70 },
    { name: "Mar", value: 75 },
    { name: "Apr", value: 80 },
    { name: "May", value: 85 },
    { name: "Jun", value: 82 },
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top weaknesses with progress bars */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Primary Psychological Weaknesses</h3>
              {weaknessData.slice(0, 3).map((weakness) => (
                <div key={weakness.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{weakness.name}</span>
                    <span className="text-sm font-medium">{weakness.value}%</span>
                  </div>
                  <Progress value={weakness.value} className={cn("h-2", weakness.color)} />
                </div>
              ))}
            </div>
            
            <Separator />
            
            {/* Pie chart for weakness distribution */}
            <div>
              <h3 className="text-sm font-medium mb-3">Weakness Distribution</h3>
              <div className="flex items-center justify-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <Separator />
            
            {/* Trend chart for primary weakness */}
            <div>
              <h3 className="text-sm font-medium mb-2">FOMO Trend (6 Months)</h3>
              <CostSensitivityChart 
                data={trendData}
                speedPriority="High"
                mevProtection="Low"
                premiumTolerance="85%"
              />
              <div className="mt-3 p-3 bg-muted/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Risk Factor</span>
                  <Badge className="bg-red-100 text-red-800">High</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your trading psychology shows a significant FOMO pattern (85%), which has been increasing over the past 6 months. 
                This leads to buying near local tops and chasing pumps. Your second major weakness is impatience (72%), 
                causing premature exits from potentially profitable positions. These two weaknesses account for 60% of your 
                trading losses. Focusing on reducing FOMO through more disciplined entry strategies could significantly 
                improve your overall performance.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
