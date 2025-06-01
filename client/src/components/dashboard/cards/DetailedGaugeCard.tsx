import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";

interface DetailedGaugeCardProps {
  walletAddress: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const DetailedGaugeCard = ({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description 
}: DetailedGaugeCardProps) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "psychoScore");
  
  // Mock score value
  const score = 71;
  
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
            <div className="flex justify-center">
              <div className="relative w-48 h-48">
                {/* Circular gauge background */}
                <div className="absolute inset-0 rounded-full border-8 border-muted"></div>
                
                {/* Circular gauge fill - dynamically styled based on score */}
                <div 
                  className="absolute inset-0 rounded-full border-8 border-primary" 
                  style={{ 
                    clipPath: `polygon(50% 50%, 50% 0%, ${score <= 25 ? '50% 0' : score <= 50 ? '100% 0' : score <= 75 ? '100% 100%' : '0% 100%'}, ${score <= 25 ? '50% 0' : score <= 50 ? '100% 0' : score <= 75 ? '0% 100%' : '0% 0'})` 
                  }}
                ></div>
                
                {/* Score display */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{score}</span>
                  <Badge variant="outline" className="mt-2">
                    {score < 30 ? 'Low' : score < 70 ? 'Medium' : 'High'}
                  </Badge>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Percentile</h4>
                <p className="text-2xl font-bold">78%</p>
                <p className="text-xs text-muted-foreground">Higher than 78% of traders</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Trend</h4>
                <p className="text-2xl font-bold text-green-500">+12%</p>
                <p className="text-xs text-muted-foreground">Increased in last 30 days</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your {title.toLowerCase()} score of {score} indicates a strong tendency toward risk-taking behavior.
                This puts you in the top quartile of traders on our platform. Your recent trading patterns show 
                increased confidence and willingness to hold positions longer, which has contributed to your 
                improved performance over the last month.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
