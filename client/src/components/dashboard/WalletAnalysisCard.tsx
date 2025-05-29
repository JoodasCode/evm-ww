import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, TrendingUp, Shield } from "lucide-react";

interface WalletAnalysisCardProps {
  walletAddress: string;
}

export function WalletAnalysisCard({ walletAddress }: WalletAnalysisCardProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch(`/api/cards/${walletAddress}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cardTypes: ['archetype-classifier', 'trading-rhythm', 'risk-appetite-meter']
          })
        });
        const data = await response.json();
        setAnalysisData(data);
      } catch (error) {
        console.error('Failed to fetch analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [walletAddress]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Brain className="w-8 h-8 animate-pulse mx-auto mb-4 text-primary" />
            <p>Analyzing your trading psychology...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisData || analysisData.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <p>No analysis data available</p>
        </CardContent>
      </Card>
    );
  }

  const archetype = analysisData.find((card: any) => card.cardType === 'archetype-classifier')?.data;
  const rhythm = analysisData.find((card: any) => card.cardType === 'trading-rhythm')?.data;
  const risk = analysisData.find((card: any) => card.cardType === 'risk-appetite-meter')?.data;

  return (
    <div className="space-y-6">
      {/* Archetype Card */}
      {archetype && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Trading Archetype
            </CardTitle>
            <CardDescription>Your psychological trading profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{archetype.primary}</div>
                <div className="text-lg text-muted-foreground">{archetype.secondary}</div>
                <Badge variant="secondary" className="mt-2">
                  {archetype.confidence}% confidence
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                {archetype.traits?.map((trait: string, index: number) => (
                  <Badge key={index} variant="outline">{trait}</Badge>
                ))}
              </div>
              
              <div className="text-sm text-muted-foreground text-center">
                {archetype.analysis}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading Rhythm Card */}
      {rhythm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Trading Rhythm
            </CardTitle>
            <CardDescription>Your trading frequency and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{rhythm.frequency}</div>
                <div className="text-sm text-muted-foreground">Frequency</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{rhythm.peakTradingHour}:00</div>
                <div className="text-sm text-muted-foreground">Peak Hour</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Appetite Card */}
      {risk && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Risk Profile
            </CardTitle>
            <CardDescription>Your risk tolerance and behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{risk.level}</div>
                <div className="text-lg text-muted-foreground">Score: {risk.score}</div>
              </div>
              
              <div className="space-y-2">
                {risk.riskFactors?.map((factor: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    • {factor}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}