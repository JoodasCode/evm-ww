import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, Target, Zap, BarChart3, AlertTriangle, Clock, DollarSign } from 'lucide-react';

interface PsychologicalAnalysis {
  archetype: string;
  whispererScore: number;
  degenScore: number;
  positionSizing: {
    style: string;
    consistency: number;
    avgSize: number;
  };
  convictionCollapse: {
    trend: string;
    score: number;
    volatility: number;
  };
  diversification: {
    type: string;
    tokenCount: number;
    top3Percentage: number;
  };
  gasStrategy: {
    type: string;
    avgFee: number;
    efficiency: string;
  };
  tradingFrequency: {
    pattern: string;
    tradesPerWeek: number;
    consistency: number;
  };
  riskProfile: {
    level: string;
    score: number;
    tolerance: string;
  };
  performanceMetrics: {
    totalVolume: number;
    avgValue: number;
    timespan: number;
  };
}

export function WalletAnalysisDashboard() {
  const [walletAddress, setWalletAddress] = useState('CyaE1VxvBrahnPWkqm5VsdCvyS2QmNht2UFrKJHga54o');
  const [analyzing, setAnalyzing] = useState(false);

  const { data: analysis, isLoading, error, refetch } = useQuery<PsychologicalAnalysis>({
    queryKey: ['/api/wallet/analysis', walletAddress],
    enabled: !!walletAddress && walletAddress.length > 20,
  });

  const handleAnalyze = () => {
    if (walletAddress && walletAddress.length > 20) {
      setAnalyzing(true);
      refetch().finally(() => setAnalyzing(false));
    }
  };

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case 'Chaos Trader': return 'bg-red-500';
      case 'Conviction Chaser': return 'bg-purple-500';
      case 'Systematic Builder': return 'bg-blue-500';
      case 'Active Degen': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Wallet Whisperer</h1>
          <p className="text-lg text-gray-300">Deep psychological analysis of crypto trading behavior</p>
          
          {/* Wallet Input */}
          <div className="flex gap-3 max-w-2xl mx-auto">
            <Input
              placeholder="Enter Solana wallet address..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isLoading || analyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading || analyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>

        {error && (
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="pt-6">
              <p className="text-red-400 text-center">Failed to analyze wallet: {error.message}</p>
            </CardContent>
          </Card>
        )}

        {analysis && (
          <>
            {/* Main Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Trader Archetype
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className={`${getArchetypeColor(analysis.archetype)} text-white text-lg px-4 py-2`}>
                    {analysis.archetype}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Whisperer Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.whispererScore)}`}>
                      {analysis.whispererScore}/100
                    </div>
                    <Progress value={analysis.whispererScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Degen Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className={`text-3xl font-bold ${getScoreColor(analysis.degenScore)}`}>
                      {analysis.degenScore}/100
                    </div>
                    <Progress value={analysis.degenScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analysis Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Position Sizing */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Position Sizing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Style</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.positionSizing.style}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Consistency</span>
                    <span className={`font-semibold ${getScoreColor(analysis.positionSizing.consistency)}`}>
                      {analysis.positionSizing.consistency}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Size</span>
                    <span className="text-white">${analysis.positionSizing.avgSize}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Conviction Collapse */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Conviction
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Trend</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.convictionCollapse.trend}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Score</span>
                    <span className={`font-semibold ${getScoreColor(analysis.convictionCollapse.score)}`}>
                      {analysis.convictionCollapse.score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Volatility</span>
                    <span className="text-white">{analysis.convictionCollapse.volatility}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Diversification */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Diversification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.diversification.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tokens</span>
                    <span className="text-white">{analysis.diversification.tokenCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Top 3%</span>
                    <span className="text-white">{analysis.diversification.top3Percentage}%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Gas Strategy */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Gas Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Type</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.gasStrategy.type}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Fee</span>
                    <span className="text-white">{analysis.gasStrategy.avgFee} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Efficiency</span>
                    <span className="text-white">{analysis.gasStrategy.efficiency}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Trading Frequency */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Trading Frequency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pattern</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.tradingFrequency.pattern}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Per Week</span>
                    <span className="text-white">{analysis.tradingFrequency.tradesPerWeek}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Consistency</span>
                    <span className={`font-semibold ${getScoreColor(analysis.tradingFrequency.consistency)}`}>
                      {analysis.tradingFrequency.consistency}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Profile */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Risk Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Level</span>
                    <Badge variant="outline" className="text-white">
                      {analysis.riskProfile.level}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Score</span>
                    <span className={`font-semibold ${getScoreColor(analysis.riskProfile.score)}`}>
                      {analysis.riskProfile.score}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Tolerance</span>
                    <span className="text-white">{analysis.riskProfile.tolerance}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${analysis.performanceMetrics.totalVolume.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Total Volume</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      ${analysis.performanceMetrics.avgValue.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Average Trade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {analysis.performanceMetrics.timespan} days
                    </div>
                    <div className="text-gray-300">Active Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}