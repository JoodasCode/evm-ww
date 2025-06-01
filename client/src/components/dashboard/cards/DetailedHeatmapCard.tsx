import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";

interface DetailedHeatmapCardProps {
  walletAddress: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const DetailedHeatmapCard = ({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description 
}: DetailedHeatmapCardProps) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "heatmapData");
  
  // Mock heatmap data - representing days of week (rows) and hours of day (columns)
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = ["00", "04", "08", "12", "16", "20"];
  
  // Generate mock intensity values (0-4) for each cell
  const generateHeatmapData = () => {
    const result = [];
    for (let i = 0; i < days.length; i++) {
      const row = [];
      for (let j = 0; j < hours.length; j++) {
        // Random intensity between 0-4
        row.push(Math.floor(Math.random() * 5));
      }
      result.push(row);
    }
    return result;
  };
  
  const heatmapData = generateHeatmapData();
  
  // Function to get color based on intensity
  const getColor = (intensity: number) => {
    const colors = [
      "bg-muted/30",           // 0 - very low
      "bg-blue-100",           // 1 - low
      "bg-blue-300",           // 2 - medium
      "bg-blue-500",           // 3 - high
      "bg-blue-700 text-white" // 4 - very high
    ];
    return colors[intensity];
  };

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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-sm font-medium"></th>
                    {hours.map((hour, index) => (
                      <th key={index} className="p-2 text-center text-xs font-medium">
                        {hour}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="p-2 text-sm font-medium">{day}</td>
                      {heatmapData[rowIndex].map((intensity, colIndex) => (
                        <td key={colIndex} className="p-0">
                          <div 
                            className={`w-10 h-10 m-1 rounded flex items-center justify-center text-xs font-medium ${getColor(intensity)}`}
                          >
                            {intensity > 0 ? intensity : ""}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-muted/30"></div>
                <span className="text-xs">None</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-blue-100"></div>
                <span className="text-xs">Low</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-blue-300"></div>
                <span className="text-xs">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span className="text-xs">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-blue-700"></div>
                <span className="text-xs">Very High</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your trading activity shows a clear pattern: you're most active on weekdays during market hours (8:00-16:00),
                with peak activity on Wednesdays around noon. Weekend activity is minimal, suggesting you take time off from
                trading. This pattern indicates a disciplined approach, avoiding late-night impulsive trading which is often
                associated with poor decision-making.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
