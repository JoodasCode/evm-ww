import { useState, useEffect } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";

/**
 * WalletDebugger component for testing wallet authentication flow
 * This component helps debug the connection between frontend and backend
 */
export function WalletDebugger() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [logs, setLogs] = useState<string[]>([]);
  const [testWalletStatus, setTestWalletStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [diagWalletStatus, setDiagWalletStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [signatureStatus, setSignatureStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [signature, setSignature] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [walletProfile, setWalletProfile] = useState<any>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Add a log entry with timestamp
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = type === 'info' ? 'ℹ️' : 
                  type === 'success' ? '✅' : 
                  type === 'error' ? '❌' : '⚠️';
    setLogs(prev => [...prev, `${timestamp} ${prefix} ${message}`]);
  };

  // Clear logs
  const clearLogs = () => {
    setLogs([]);
  };

  // Get auth message for the connected wallet
  const getAuthMessage = async () => {
    if (!address) {
      addLog('No wallet connected', 'error');
      return null;
    }

    try {
      addLog(`Getting auth message for ${address}`, 'info');
      const response = await fetch(`/api/auth/message/${address}`);
      
      // Log raw response status and headers for debugging
      addLog(`Response status: ${response.status} ${response.statusText}`, 'info');
      addLog(`Content-Type: ${response.headers.get('content-type')}`, 'info');
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get the text response for debugging
        const textResponse = await response.text();
        addLog(`Non-JSON response received: ${textResponse.substring(0, 100)}...`, 'error');
        return null;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        addLog(`Error getting auth message: ${data.error || 'Unknown error'}`, 'error');
        return null;
      }
      
      addLog(`Auth message received: ${data.data?.message || data.message}`, 'success');
      const messageText = data.data?.message || data.message;
      setMessage(messageText);
      return messageText;
    } catch (error) {
      addLog(`Error fetching auth message: ${error instanceof Error ? error.message : String(error)}`, 'error');
      return null;
    }
  };

  // Sign the auth message with the connected wallet
  const signAuthMessage = async () => {
    try {
      setSignatureStatus('loading');
      const messageToSign = message || await getAuthMessage();
      
      if (!messageToSign) {
        setSignatureStatus('error');
        return;
      }
      
      addLog(`Signing message: ${messageToSign}`, 'info');
      const sig = await signMessageAsync({ message: messageToSign });
      
      addLog(`Signature created: ${sig.slice(0, 10)}...${sig.slice(-8)}`, 'success');
      setSignature(sig);
      setSignatureStatus('success');
      return sig;
    } catch (error) {
      addLog(`Error signing message: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setSignatureStatus('error');
      return null;
    }
  };

  // Test the wallet profile endpoint (no signature required)
  const testWalletProfile = async () => {
    if (!address) {
      addLog('No wallet connected', 'error');
      return;
    }

    try {
      setTestWalletStatus('loading');
      addLog(`Testing wallet profile endpoint for ${address}`, 'info');
      
      const requestBody = JSON.stringify({
        wallet_address: address
      });
      
      addLog(`Request body: ${requestBody}`, 'info');
      
      const response = await fetch('/api/auth/test-wallet-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      
      // Log raw response status and headers for debugging
      addLog(`Response status: ${response.status} ${response.statusText}`, 'info');
      addLog(`Content-Type: ${response.headers.get('content-type')}`, 'info');
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get the text response for debugging
        const textResponse = await response.text();
        addLog(`Non-JSON response received: ${textResponse.substring(0, 100)}...`, 'error');
        setTestWalletStatus('error');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        addLog(`Error testing wallet profile: ${data.error || 'Unknown error'}`, 'error');
        setTestWalletStatus('error');
        return;
      }
      
      addLog(`Wallet profile created/updated successfully`, 'success');
      setWalletProfile(data.data);
      setTestWalletStatus('success');
    } catch (error) {
      addLog(`Error testing wallet profile: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setTestWalletStatus('error');
    }
  };

  // Test the diagnostic wallet auth endpoint (with signature)
  const testDiagWalletAuth = async () => {
    if (!address) {
      addLog('No wallet connected', 'error');
      return;
    }

    try {
      setDiagWalletStatus('loading');
      
      // Make sure we have a signature and message
      const sig = signature || await signAuthMessage();
      const messageToUse = message || await getAuthMessage();
      
      if (!sig || !messageToUse) {
        addLog('Failed to get signature or message', 'error');
        setDiagWalletStatus('error');
        return;
      }
      
      addLog(`Testing diagnostic wallet auth endpoint for ${address}`, 'info');
      
      const requestBody = JSON.stringify({
        walletAddress: address,
        signature: sig,
        message: messageToUse,
        blockchainType: 'evm'
      });
      
      // Log a truncated version of the request body for readability
      const truncatedBody = JSON.stringify({
        walletAddress: address,
        signature: sig.slice(0, 10) + '...' + sig.slice(-8),
        message: messageToUse.length > 30 ? messageToUse.slice(0, 30) + '...' : messageToUse,
        blockchainType: 'evm'
      });
      addLog(`Request body (truncated for display): ${truncatedBody}`, 'info');
      addLog('Sending complete signature to server', 'info');
      
      const response = await fetch('/api/auth/diag-wallet-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: requestBody
      });
      
      // Log raw response status and headers for debugging
      addLog(`Response status: ${response.status} ${response.statusText}`, 'info');
      addLog(`Content-Type: ${response.headers.get('content-type')}`, 'info');
      
      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, get the text response for debugging
        const textResponse = await response.text();
        addLog(`Non-JSON response received: ${textResponse.substring(0, 100)}...`, 'error');
        setDiagWalletStatus('error');
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        addLog(`Error in diagnostic auth: ${data.error || 'Unknown error'}`, 'error');
        setDiagWalletStatus('error');
        return;
      }
      
      addLog(`Diagnostic auth successful! JWT token received.`, 'success');
      setAuthToken(data.token);
      setDiagWalletStatus('success');
    } catch (error) {
      addLog(`Error in diagnostic auth: ${error instanceof Error ? error.message : String(error)}`, 'error');
      setDiagWalletStatus('error');
    }
  };

  // Reset all states
  const resetAll = () => {
    setTestWalletStatus('idle');
    setDiagWalletStatus('idle');
    setSignatureStatus('idle');
    setSignature(null);
    setMessage(null);
    setWalletProfile(null);
    setAuthToken(null);
    clearLogs();
  };

  // Update logs when wallet connection changes
  useEffect(() => {
    if (isConnected && address) {
      addLog(`Wallet connected: ${address}`, 'success');
    } else {
      addLog('Wallet disconnected', 'info');
    }
  }, [isConnected, address]);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Wallet Authentication Debugger</CardTitle>
        <CardDescription>
          Test the wallet authentication flow between frontend and backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Wallet Status</h3>
              <p className="text-sm text-muted-foreground">
                {isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? address?.slice(0, 6) + '...' + address?.slice(-4) : 'Not Connected'}
            </Badge>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={testWalletProfile} 
              disabled={!isConnected || testWalletStatus === 'loading'}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              {testWalletStatus === 'loading' ? 'Testing...' : 'Test Wallet Profile'}
              {testWalletStatus === 'success' && <span className="text-green-500">✓</span>}
              {testWalletStatus === 'error' && <span className="text-red-500">✗</span>}
            </Button>

            <Button 
              onClick={signAuthMessage} 
              disabled={!isConnected || signatureStatus === 'loading'}
              variant="outline"
              className="flex items-center justify-center gap-2"
            >
              {signatureStatus === 'loading' ? 'Signing...' : 'Sign Message'}
              {signatureStatus === 'success' && <span className="text-green-500">✓</span>}
              {signatureStatus === 'error' && <span className="text-red-500">✗</span>}
            </Button>

            <Button 
              onClick={testDiagWalletAuth} 
              disabled={!isConnected || diagWalletStatus === 'loading'}
              variant="default"
              className="flex items-center justify-center gap-2"
            >
              {diagWalletStatus === 'loading' ? 'Testing...' : 'Test Auth Flow'}
              {diagWalletStatus === 'success' && <span className="text-green-500">✓</span>}
              {diagWalletStatus === 'error' && <span className="text-red-500">✗</span>}
            </Button>
          </div>

          <Separator />

          <Tabs defaultValue="logs">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="logs">Debug Logs</TabsTrigger>
              <TabsTrigger value="profile">Wallet Profile</TabsTrigger>
              <TabsTrigger value="token">Auth Token</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logs" className="mt-4">
              <Card>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Debug Logs</CardTitle>
                    <Button onClick={clearLogs} variant="ghost" size="sm">Clear</Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    {logs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">No logs yet. Start testing to see logs.</p>
                    ) : (
                      <div className="space-y-1">
                        {logs.map((log, index) => (
                          <div key={index} className="text-sm font-mono whitespace-pre-wrap">
                            {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">Wallet Profile Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {walletProfile ? (
                      <pre className="text-xs">{JSON.stringify(walletProfile, null, 2)}</pre>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No wallet profile data. Click "Test Wallet Profile" to create one.
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="token" className="mt-4">
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm font-medium">JWT Auth Token</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    {authToken ? (
                      <div className="space-y-4">
                        <div className="p-3 bg-muted rounded-md overflow-x-auto">
                          <p className="text-xs font-mono break-all">{authToken}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Token Parts:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {authToken.split('.').map((part, index) => (
                              <div key={index} className="p-2 bg-muted rounded-md">
                                <p className="text-xs font-medium mb-1">
                                  {index === 0 ? 'Header' : index === 1 ? 'Payload' : 'Signature'}
                                </p>
                                <p className="text-xs font-mono break-all">
                                  {part.length > 20 ? part.slice(0, 20) + '...' : part}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No auth token. Complete the auth flow to get a token.
                      </p>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={resetAll}>Reset All</Button>
        <p className="text-xs text-muted-foreground">
          Check server logs for detailed diagnostic information
        </p>
      </CardFooter>
    </Card>
  );
}

export default WalletDebugger;
