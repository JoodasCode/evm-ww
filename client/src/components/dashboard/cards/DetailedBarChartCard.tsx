import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { CostSensitivityChart } from "../charts/LineChart";
import { TradingFrequencyChart } from "../charts/AreaChart";
import { cn } from "@/lib/utils";

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
  
  // Mock data for the radar chart - psychological strengths
  const radarData = [
    {
      subject: 'Patience',
      A: 85,
      fullMark: 100,
    },
    {
      subject: 'Discipline',
      A: 78,
      fullMark: 100,
    },
    {
      subject: 'Risk Mgmt',
      A: 65,
      fullMark: 100,
    },
    {
      subject: 'Analysis',
      A: 90,
      fullMark: 100,
    },
    {
      subject: 'Conviction',
      A: 72,
      fullMark: 100,
    },
    {
      subject: 'Adaptability',
      A: 80,
      fullMark: 100,
    },
  ];

  // Top strengths data
  const topStrengths = [
    { name: "Analysis", value: 90, color: "bg-green-500" },
    { name: "Patience", value: 85, color: "bg-green-500" },
    { name: "Adaptability", value: 80, color: "bg-blue-500" },
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
          <div className="h-60 flex items-center justify-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Radar chart for psychological strengths */}
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Strengths" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
            
            {/* Top strengths with progress bars */}
            <div className="space-y-3 mt-4">
              <h3 className="text-sm font-medium">Top Strengths</h3>
              {topStrengths.map((strength) => (
                <div key={strength.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{strength.name}</span>
                    <span className="text-sm font-medium">{strength.value}%</span>
                  </div>
                  <Progress value={strength.value} className={cn("h-2", strength.color)} />
                </div>
              ))}
            </div>
            
            {/* Trend analysis */}
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Strength Trend</h4>
              <TradingFrequencyChart 
                data={[
                  { name: "Jan", value: 65 },
                  { name: "Feb", value: 70 },
                  { name: "Mar", value: 75 },
                  { name: "Apr", value: 72 },
                  { name: "May", value: 80 },
                  { name: "Jun", value: 85 }
                ]}
                peakDay="Jun"
                restDays="0.74"
                consistency="Improving"
              />
            </div>
            
            <Separator />
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your psychological profile shows exceptional analytical skills (90%) and strong patience (85%). 
                These strengths have been consistently improving over the past 6 months, with a notable 20% increase 
                in adaptability. Your balanced psychological profile suggests you're well-equipped to handle market 
                volatility and make rational decisions under pressure.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
