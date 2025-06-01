import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWalletPsychoCard } from "@/hooks/useWalletPsychoCard";

// Simple loading component
const Loading = () => <div className="flex justify-center py-4">Loading...</div>;

interface HighLevelCardProps {
  walletAddress?: string;
  icon: React.ElementType;
  title: string;
  description: string;
  value?: string | number;
  subtitle?: string;
}

export const HighLevelCard = ({
  walletAddress,
  icon: Icon,
  title,
  description,
  value,
  subtitle,
}: HighLevelCardProps) => {
  const { loading } = useWalletPsychoCard(walletAddress || "", "psychoScore");
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">{description}</div>
        {loading ? (
          <Loading />
        ) : (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{value || "71"}</span>
              {subtitle && (
                <Badge variant="outline" className="text-xs">
                  {subtitle || "High"}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
