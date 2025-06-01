import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";

interface DetailedTableCardProps {
  walletAddress: string;
  icon: React.ElementType;
  title: string;
  description: string;
}

export const DetailedTableCard = ({ 
  walletAddress, 
  icon: Icon, 
  title, 
  description 
}: DetailedTableCardProps) => {
  const { data, loading } = useWalletPsychoCard(walletAddress, "tableData");
  
  // Mock table data
  const mockData = [
    { token: "SOL", value: "$1,245.32", change: "+12.5%", status: "positive" },
    { token: "BONK", value: "$567.89", change: "-3.2%", status: "negative" },
    { token: "JTO", value: "$321.45", change: "+8.7%", status: "positive" },
    { token: "PYTH", value: "$189.67", change: "+5.1%", status: "positive" },
    { token: "RNDR", value: "$98.34", change: "-1.8%", status: "negative" },
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
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-2 text-left text-sm font-medium">Token</th>
                    <th className="p-2 text-left text-sm font-medium">Value</th>
                    <th className="p-2 text-left text-sm font-medium">Change</th>
                    <th className="p-2 text-left text-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.map((row, index) => (
                    <tr key={index} className={index !== mockData.length - 1 ? "border-b" : ""}>
                      <td className="p-2 text-sm">{row.token}</td>
                      <td className="p-2 text-sm font-medium">{row.value}</td>
                      <td className="p-2 text-sm">
                        <span className={row.status === "positive" ? "text-green-500" : "text-red-500"}>
                          {row.change}
                        </span>
                      </td>
                      <td className="p-2 text-sm">
                        <Badge variant={row.status === "positive" ? "outline" : "secondary"} className="text-xs">
                          {row.status === "positive" ? "Gain" : "Loss"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Total Value</h4>
                <p className="text-2xl font-bold">$2,422.67</p>
                <p className="text-xs text-muted-foreground">Across 5 tokens</p>
              </div>
              
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Net Change</h4>
                <p className="text-2xl font-bold text-green-500">+4.3%</p>
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-semibold mb-2">Analysis</h4>
              <p className="text-sm text-muted-foreground">
                Your portfolio shows a strong concentration in SOL, which makes up over 50% of your holdings.
                While this has been beneficial due to SOL's recent performance (+12.5%), it also represents
                a concentration risk. Your smaller positions in BONK and RNDR are currently underperforming,
                but they provide some diversification benefit.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
