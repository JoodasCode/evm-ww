import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DetailedBarChartCardProps {
  walletAddress: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const DetailedBarChartCard = ({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description 
}: DetailedBarChartCardProps) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "barChartData");
  
  // Mock data for the bar chart
  const mockData = [
    { name: "SOL", value: 78 },
    { name: "BONK", value: 65 },
    { name: "JTO", value: 52 },
    { name: "PYTH", value: 45 },
    { name: "RNDR", value: 38 },
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
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
            
            <div className="space-y-4 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">SOL</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">BONK</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">JTO</span>
                  <span className="text-sm font-medium">52%</span>
                </div>
                <Progress value={52} className="h-2" />
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your portfolio shows a strong preference for SOL, making up nearly 80% of your trading activity. 
                This concentration suggests you're comfortable with the Solana ecosystem but may benefit from 
                diversification. Your trading patterns show a tendency to rotate between the top 5 tokens rather 
                than exploring new opportunities.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
