import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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
  
  // Mock data for the line chart
  const mockChartData = [
    { date: "Jan", pnl: 5, benchmark: 3 },
    { date: "Feb", pnl: 8, benchmark: 5 },
    { date: "Mar", pnl: 3, benchmark: 6 },
    { date: "Apr", pnl: 12, benchmark: 8 },
    { date: "May", pnl: 18, benchmark: 10 },
    { date: "Jun", pnl: 15, benchmark: 12 },
  ];
  
  // Mock insights
  const insights = [
    { title: "Risk Tolerance", value: "High", badge: "Above Average", badgeColor: "bg-amber-100 text-amber-800" },
    { title: "Trading Style", value: "Momentum", badge: "Aggressive", badgeColor: "bg-red-100 text-red-800" },
    { title: "Conviction", value: "Medium", badge: "Improving", badgeColor: "bg-green-100 text-green-800" },
  ];

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-muted ring-1 ring-border">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {insights.map((insight, index) => (
                <div key={index} className="bg-muted/20 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-muted-foreground">{insight.title}</h3>
                  <p className="text-2xl font-bold mt-1">{insight.value}</p>
                  <Badge className={`mt-2 ${insight.badgeColor}`}>{insight.badge}</Badge>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-sm font-medium mb-4">Performance vs. Market Benchmark</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="pnl" stroke="#8884d8" strokeWidth={2} name="Your PnL" />
                  <Line type="monotone" dataKey="benchmark" stroke="#82ca9d" strokeWidth={2} name="Market Avg" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-2">Strengths</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="text-sm">Strong conviction on winning trades</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="text-sm">Excellent market timing on entries</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-green-500"></div>
                    <p className="text-sm">Disciplined trading schedule</p>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-2">Areas for Improvement</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-red-500"></div>
                    <p className="text-sm">Tendency to exit winning positions too early</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-red-500"></div>
                    <p className="text-sm">Overexposure to high-volatility tokens</p>
                  </li>
                  <li className="flex items-start">
                    <div className="mr-2 mt-0.5 h-4 w-4 rounded-full bg-red-500"></div>
                    <p className="text-sm">Inconsistent position sizing</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Summary Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your trading profile shows a high-risk, momentum-based approach that has outperformed market benchmarks
                by 25% over the last 6 months. Your strongest trait is your ability to identify and enter promising positions
                early, but you tend to exit too quickly, limiting your potential gains. Your trading psychology indicates a
                growing conviction in your strategy, which is a positive development from your previous more erratic approach.
                To improve results further, consider implementing more consistent position sizing and holding winning trades longer.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
