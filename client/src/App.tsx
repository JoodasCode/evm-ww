import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider, useWallet } from "@/hooks/use-wallet";
import { WalletConnector } from "@/components/wallet-connector";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";

function AppRouter() {
  const { isConnected } = useWallet();

  if (!isConnected) {
    return <WalletConnector />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <WalletProvider>
            <Toaster />
            <AppRouter />
          </WalletProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
