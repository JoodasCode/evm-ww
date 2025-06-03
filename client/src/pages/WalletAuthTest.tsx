import React, { useState, useEffect } from 'react';
import { useWalletAuth } from '../hooks/useWalletAuth';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ActivityType } from '../services/ActivityLogService';
import axios from 'axios';

interface ActivityLog {
  id: string;
  wallet_address: string;
  wallet_profile_id: string;
  activity_type: string;
  details: Record<string, any>;
  timestamp: string;
}

interface WalletProfile {
  id: string;
  wallet_address: string;
  blockchain_type: string;
  is_verified: boolean;
  display_name: string;
  created_at: string;
  last_updated?: string;
  verification_signature?: string;
  standalone_wallet: boolean;
}

interface ProfileVerification {
  exists: boolean;
  profile: WalletProfile | null;
  directCheck: boolean;
  timestamp: string;
  error?: string;
  apiResult?: any; // Adding apiResult property to fix TypeScript errors
}

/**
 * A test page for wallet authentication flow
 */
const WalletAuthTest: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { walletProfile, connectWallet, disconnectWallet, token, isLoading, error } = useWalletAuth();
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ProfileVerification | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  
  // Add a debug log function
  const addDebugLog = (message: string) => {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp.split('T')[1].split('.')[0]}] ${message}`;
    setDebugLogs(prev => [formattedMessage, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  const handleConnect = async () => {
    try {
      setTestResult(null);
      addDebugLog(`Starting wallet connection for address: ${address}`);
      
      const displayName = `Test Wallet ${new Date().toISOString().substring(0, 10)}`;
      addDebugLog(`Using display name: ${displayName}`);
      
      const result = await connectWallet(displayName);
      
      if (result) {
        addDebugLog(`✅ Wallet connected successfully with profile ID: ${result.id}`);
        setTestResult({
          success: true,
          message: 'Wallet connected and authenticated successfully!'
        });
        
        // Verify profile persistence immediately
        verifyWalletProfile();
      } else {
        addDebugLog(`❌ Failed to connect wallet`);
        setTestResult({
          success: false,
          message: 'Failed to connect wallet. See console for details.'
        });
      }
    } catch (err) {
      console.error('Error in connect test:', err);
      addDebugLog(`❌ Error connecting wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };

  const handleDisconnect = () => {
    try {
      setTestResult(null);
      addDebugLog(`Disconnecting wallet: ${address}`);
      disconnectWallet();
      setActivityLogs([]);
      setVerificationResult(null);
      addDebugLog(`✅ Wallet disconnected successfully`);
      setTestResult({
        success: true,
        message: 'Wallet disconnected successfully!'
      });
    } catch (err) {
      console.error('Error in disconnect test:', err);
      addDebugLog(`❌ Error disconnecting wallet: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Unknown error occurred'
      });
    }
  };
  
  const fetchActivityLogs = async () => {
    if (!address || !walletProfile) return;
    
    try {
      setFetchingLogs(true);
      addDebugLog(`Fetching activity logs for wallet: ${address.toLowerCase()}`);
      
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('wallet_address', address.toLowerCase())
        .order('timestamp', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching activity logs:', error);
        addDebugLog(`❌ Error fetching activity logs: ${error.message}`);
        return;
      }
      
      addDebugLog(`✅ Fetched ${data?.length || 0} activity logs`);
      setActivityLogs(data || []);
    } catch (err) {
      console.error('Error fetching activity logs:', err);
      addDebugLog(`❌ Error fetching activity logs: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setFetchingLogs(false);
    }
  };
  
  // Verify wallet profile directly in Supabase
  const verifyWalletProfile = async () => {
    if (!address) return;
    
    try {
      setVerifying(true);
      const normalizedAddress = address.toLowerCase();
      addDebugLog(`Verifying wallet profile persistence for: ${normalizedAddress}`);
      
      // First check directly in Supabase
      const { data: profileData, error: profileError } = await supabase
        .from('wallet_profiles')
        .select('*')
        .eq('wallet_address', normalizedAddress)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        addDebugLog(`❌ Error checking profile in Supabase: ${profileError.message}`);
        setVerificationResult({
          exists: false,
          profile: null,
          directCheck: true,
          timestamp: new Date().toISOString(),
          error: profileError.message
        });
        return;
      }
      
      // Also check via API endpoint for comparison
      try {
        const apiResponse = await axios.get(`/api/debug/wallet-status/${normalizedAddress}`);
        addDebugLog(`✅ API verification complete`);
        
        if (profileData) {
          addDebugLog(`✅ Wallet profile exists in Supabase with ID: ${profileData.id}`);
          setVerificationResult({
            exists: true,
            profile: profileData as WalletProfile,
            directCheck: true,
            timestamp: new Date().toISOString(),
            apiResult: apiResponse.data
          });
        } else {
          addDebugLog(`⚠️ No wallet profile found in Supabase`);
          setVerificationResult({
            exists: false,
            profile: null,
            directCheck: true,
            timestamp: new Date().toISOString(),
            apiResult: apiResponse.data
          });
        }
      } catch (apiErr) {
        console.error('API verification error:', apiErr);
        addDebugLog(`❌ API verification failed: ${apiErr instanceof Error ? apiErr.message : 'Unknown error'}`);
        
        // Still return the Supabase result
        setVerificationResult({
          exists: !!profileData,
          profile: profileData as WalletProfile | null,
          directCheck: true,
          timestamp: new Date().toISOString(),
          error: `API check failed: ${apiErr instanceof Error ? apiErr.message : 'Unknown error'}`
        });
      }
    } catch (err) {
      console.error('Error verifying wallet profile:', err);
      addDebugLog(`❌ Error verifying wallet profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setVerificationResult({
        exists: false,
        profile: null,
        directCheck: true,
        timestamp: new Date().toISOString(),
        error: err instanceof Error ? err.message : 'Unknown error'
      });
    } finally {
      setVerifying(false);
    }
  };
  
  // Fetch activity logs and verify profile when wallet profile changes
  useEffect(() => {
    if (walletProfile) {
      addDebugLog(`Wallet profile detected with ID: ${walletProfile.id}`);
      fetchActivityLogs();
      verifyWalletProfile();
    }
  }, [walletProfile?.id]);
  
  // Log when address or connection status changes
  useEffect(() => {
    if (address) {
      addDebugLog(`Wallet address changed/connected: ${address}`);
    }
    if (!isConnected && address === undefined) {
      addDebugLog(`Wallet disconnected`);
    }
  }, [address, isConnected]);

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Wallet Authentication Test</CardTitle>
          <CardDescription>
            Test the wallet authentication flow with your connected wallet
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2">Wallet Status</h3>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <div className="text-muted-foreground">Connected:</div>
                <div className="font-mono">
                  {isConnected ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> No
                    </span>
                  )}
                </div>
                
                <div className="text-muted-foreground">Address:</div>
                <div className="font-mono text-sm truncate">{address || 'Not connected'}</div>
                
                <div className="text-muted-foreground">Authenticated:</div>
                <div className="font-mono">
                  {walletProfile ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> No
                    </span>
                  )}
                </div>
                
                <div className="text-muted-foreground">Has Token:</div>
                <div className="font-mono">
                  {token ? (
                    <span className="text-green-600 flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <XCircle className="h-4 w-4 mr-1" /> No
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {walletProfile && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">Wallet Profile</h3>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div className="text-muted-foreground">Profile ID:</div>
                  <div className="font-mono text-sm truncate">{walletProfile.id}</div>
                  
                  <div className="text-muted-foreground">Display Name:</div>
                  <div className="font-mono">{walletProfile.display_name}</div>
                  
                  <div className="text-muted-foreground">Verified:</div>
                  <div className="font-mono">
                    {walletProfile.is_verified ? (
                      <span className="text-green-600 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <XCircle className="h-4 w-4 mr-1" /> No
                      </span>
                    )}
                  </div>
                  
                  <div className="text-muted-foreground">First Seen:</div>
                  <div className="font-mono text-sm">{new Date(walletProfile.first_seen).toLocaleString()}</div>
                  
                  <div className="text-muted-foreground">Last Updated:</div>
                  <div className="font-mono text-sm">{new Date(walletProfile.last_updated).toLocaleString()}</div>
                </div>
              </div>
            )}
            
            {token && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">JWT Token</h3>
                <div className="font-mono text-xs break-all bg-black/90 text-green-400 p-2 rounded">
                  {token}
                </div>
              </div>
            )}
            
            {/* Wallet Profile Verification Status */}
            {address && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2 flex justify-between items-center">
                  <span>Profile Verification</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={verifyWalletProfile} 
                    disabled={verifying}
                  >
                    {verifying ? 'Checking...' : 'Verify Now'}
                  </Button>
                </h3>
                
                {verificationResult ? (
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Status:</span>
                      {verificationResult.exists ? (
                        <span className="text-green-600 font-medium flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Profile Exists
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium flex items-center">
                          <XCircle className="h-4 w-4 mr-1" /> No Profile Found
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs">
                      <span className="text-muted-foreground">Last checked:</span>{' '}
                      {new Date(verificationResult.timestamp).toLocaleString()}
                    </div>
                    
                    {verificationResult.profile && (
                      <div className="mt-2 text-sm">
                        <div className="font-medium">Profile Details:</div>
                        <div className="grid grid-cols-[120px_1fr] gap-1 mt-1">
                          <div className="text-muted-foreground">ID:</div>
                          <div className="font-mono text-xs">{verificationResult.profile.id}</div>
                          
                          <div className="text-muted-foreground">Display Name:</div>
                          <div>{verificationResult.profile.display_name}</div>
                          
                          <div className="text-muted-foreground">Created:</div>
                          <div>{new Date(verificationResult.profile.created_at).toLocaleString()}</div>
                          
                          <div className="text-muted-foreground">Verified:</div>
                          <div>{verificationResult.profile.is_verified ? 'Yes' : 'No'}</div>
                        </div>
                      </div>
                    )}
                    
                    {verificationResult.error && (
                      <div className="text-red-600 text-xs mt-2">
                        Error: {verificationResult.error}
                      </div>
                    )}
                    
                    {verificationResult.apiResult && (
                      <div className="mt-2">
                        <details>
                          <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                            API Verification Details
                          </summary>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-48">
                            {JSON.stringify(verificationResult.apiResult, null, 2)}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    Click "Verify Now" to check wallet profile persistence
                  </div>
                )}
              </div>
            )}
            
            {walletProfile && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2 flex justify-between items-center">
                  <span>Activity Logs</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={fetchActivityLogs} 
                    disabled={fetchingLogs}
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    {fetchingLogs ? 'Loading...' : 'Refresh'}
                  </Button>
                </h3>
                
                {activityLogs.length > 0 ? (
                  <div className="space-y-2 mt-2">
                    {activityLogs.map(log => (
                      <div key={log.id} className="border p-2 rounded-md text-sm">
                        <div className="flex justify-between">
                          <span className="font-medium">{log.activity_type}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs mt-1">
                          <span className="text-muted-foreground">Profile ID: </span>
                          <span className="font-mono">{log.wallet_profile_id}</span>
                        </div>
                        <div className="text-xs mt-1">
                          <details>
                            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                              Details
                            </summary>
                            <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto max-h-24">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No activity logs found
                  </div>
                )}
              </div>
            )}
            
            {/* Debug Logs Section */}
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-medium mb-2 flex justify-between items-center">
                <span>Debug Logs</span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setDebugLogs([])}
                >
                  Clear Logs
                </Button>
              </h3>
              
              <div className="bg-black text-green-400 font-mono text-xs p-2 rounded h-48 overflow-y-auto">
                {debugLogs.length > 0 ? (
                  debugLogs.map((log, index) => (
                    <div key={index} className="whitespace-pre-wrap">{log}</div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No logs yet</div>
                )}
              </div>
            </div>
            
            {/* Direct API Test Links */}
            {address && (
              <div className="p-4 border rounded-lg bg-muted/50">
                <h3 className="font-medium mb-2">API Test Links</h3>
                <div className="space-y-2 text-sm">
                  <a 
                    href={`/api/debug/check-wallet/${address.toLowerCase()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Check Wallet Profile
                  </a>
                  <a 
                    href={`/api/debug/wallet-status/${address.toLowerCase()}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Wallet Status Diagnostics
                  </a>
                </div>
              </div>
            )}
            
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            )}
            
            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                <div className="flex items-center">
                  {testResult.success ? (
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  <AlertTitle>{testResult.success ? "Success" : "Error"}</AlertTitle>
                </div>
                <AlertDescription>
                  {testResult.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="flex justify-between pt-6">
          <Button 
            onClick={handleConnect}
            disabled={!isConnected || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? 'Connecting...' : 'Connect & Authenticate'}
          </Button>
          
          <Button 
            onClick={handleDisconnect}
            disabled={!isConnected || isLoading}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
          >
            Disconnect
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WalletAuthTest;
