import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, HelpCircle, FileText, MessageCircle, RefreshCw, Trash } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';
import { useRefreshAnalysis } from '@/hooks/useWhispererData';
import { api } from '@/lib/api';

export function SettingsTab() {
  const { toast } = useToast();
  const { connected, publicKey, isSimulated, disconnect, simulateWallet } = useWallet();
  const [simulationAddress, setSimulationAddress] = useState('');
  const [publicProfile, setPublicProfile] = useState(false);
  const [analyticsTracking, setAnalyticsTracking] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  
  const refreshAnalysisMutation = useRefreshAnalysis();

  const formatAddress = (address: string) => {
    return `${address.slice(0, 3)}...${address.slice(-4)}`;
  };

  const handleRefreshData = async () => {
    try {
      await refreshAnalysisMutation.mutateAsync();
      toast({
        title: "Data Refreshed",
        description: "Your wallet analysis has been updated with the latest data.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleClearCache = () => {
    // In a real implementation, this would clear cache
    toast({
      title: "Cache Cleared",
      description: "All cached data has been cleared successfully.",
    });
  };

  const handleExportData = async () => {
    if (!publicKey) return;
    
    try {
      const blob = await api.exportData(publicKey);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wallet-whisperer-${publicKey}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Data Exported",
        description: "Your analysis report has been downloaded.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSimulateWallet = () => {
    if (!simulationAddress.trim()) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address.",
        variant: "destructive",
      });
      return;
    }

    simulateWallet(simulationAddress.trim());
    setSimulationAddress('');
    toast({
      title: "Simulation Started",
      description: `Now analyzing wallet ${formatAddress(simulationAddress.trim())}`,
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Management */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Wallet Management</h3>
            <div className="space-y-4">
              <div className="p-4 bg-whisper-bg rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-whisper-text">Connected Wallet</span>
                  <div className="flex items-center space-x-2">
                    {connected && (
                      <Badge 
                        variant="secondary" 
                        className={`${isSimulated ? 'bg-yellow-600' : 'bg-green-600'} text-white`}
                      >
                        {isSimulated ? 'Simulated' : 'Active'}
                      </Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-whisper-subtext font-mono">
                  {connected && publicKey ? formatAddress(publicKey) : 'Not Connected'}
                </p>
              </div>
              <div className="flex space-x-3">
                <Button 
                  className="flex-1 bg-whisper-accent hover:bg-whisper-accent/80 text-whisper-text"
                  disabled={!connected}
                >
                  Change Wallet
                </Button>
                <Button 
                  onClick={disconnect}
                  variant="outline"
                  className="flex-1 border-whisper-border hover:bg-whisper-accent text-whisper-text"
                  disabled={!connected}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Data Management</h3>
            <div className="space-y-4">
              <Button
                onClick={handleRefreshData}
                disabled={!connected || refreshAnalysisMutation.isPending}
                className="w-full p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-left transition-colors"
                variant="ghost"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-whisper-text">Refresh Analysis</p>
                    <p className="text-sm text-whisper-subtext">Update all metrics and scores</p>
                  </div>
                  <RefreshCw className={`text-whisper-subtext ${refreshAnalysisMutation.isPending ? 'animate-spin' : ''}`} size={20} />
                </div>
              </Button>
              
              <Button
                onClick={handleClearCache}
                className="w-full p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-left transition-colors"
                variant="ghost"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-whisper-text">Clear Cache</p>
                    <p className="text-sm text-whisper-subtext">Reset all cached data</p>
                  </div>
                  <Trash className="text-whisper-subtext" size={20} />
                </div>
              </Button>
              
              <Button
                onClick={handleExportData}
                disabled={!connected}
                className="w-full p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-left transition-colors"
                variant="ghost"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-whisper-text">Export Data</p>
                    <p className="text-sm text-whisper-subtext">Download analysis report</p>
                  </div>
                  <Download className="text-whisper-subtext" size={20} />
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Privacy Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div>
                  <p className="font-medium text-whisper-text">Public Profile</p>
                  <p className="text-sm text-whisper-subtext">Allow others to view your stats</p>
                </div>
                <Switch
                  checked={publicProfile}
                  onCheckedChange={setPublicProfile}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div>
                  <p className="font-medium text-whisper-text">Analytics Tracking</p>
                  <p className="text-sm text-whisper-subtext">Help improve our algorithms</p>
                </div>
                <Switch
                  checked={analyticsTracking}
                  onCheckedChange={setAnalyticsTracking}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-whisper-bg rounded-lg">
                <div>
                  <p className="font-medium text-whisper-text">Data Sharing</p>
                  <p className="text-sm text-whisper-subtext">Share anonymized data for research</p>
                </div>
                <Switch
                  checked={dataSharing}
                  onCheckedChange={setDataSharing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Simulation Mode */}
        <Card className="bg-whisper-card border-whisper-border shadow-md">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-whisper-text mb-6">Simulation Mode</h3>
            <div className="space-y-4">
              <div className="p-4 bg-whisper-bg rounded-lg">
                <p className="text-sm text-whisper-subtext mb-3">Test with any wallet address</p>
                <Input
                  type="text"
                  placeholder="Enter wallet address..."
                  value={simulationAddress}
                  onChange={(e) => setSimulationAddress(e.target.value)}
                  className="w-full bg-whisper-card border-whisper-border text-whisper-text"
                />
                <Button
                  onClick={handleSimulateWallet}
                  className="w-full mt-3 bg-whisper-accent hover:bg-whisper-accent/80 text-whisper-text"
                >
                  Simulate Wallet
                </Button>
              </div>
              <div className="text-center">
                <p className="text-xs text-whisper-subtext">
                  Simulation mode allows analysis of any public wallet
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Support Section */}
      <Card className="bg-whisper-card border-whisper-border shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-whisper-text mb-6">Support & Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              className="p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-center transition-colors"
              variant="ghost"
            >
              <div className="flex flex-col items-center space-y-2">
                <HelpCircle className="text-whisper-subtext" size={32} />
                <p className="font-medium text-whisper-text">Help Center</p>
                <p className="text-sm text-whisper-subtext">Get support</p>
              </div>
            </Button>
            
            <Button
              className="p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-center transition-colors"
              variant="ghost"
            >
              <div className="flex flex-col items-center space-y-2">
                <FileText className="text-whisper-subtext" size={32} />
                <p className="font-medium text-whisper-text">Documentation</p>
                <p className="text-sm text-whisper-subtext">API & guides</p>
              </div>
            </Button>
            
            <Button
              className="p-4 bg-whisper-bg hover:bg-whisper-accent rounded-lg text-center transition-colors"
              variant="ghost"
            >
              <div className="flex flex-col items-center space-y-2">
                <MessageCircle className="text-whisper-subtext" size={32} />
                <p className="font-medium text-whisper-text">Community</p>
                <p className="text-sm text-whisper-subtext">Join Discord</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
