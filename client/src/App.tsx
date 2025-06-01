import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { WalletProvider } from "@/components/wallet/WalletProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import AuthDemo from "@/pages/AuthDemo";
import AuthCallback from "@/pages/AuthCallback";
import { useState, useEffect } from "react";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

// This component must be used inside AuthProvider
function AuthenticatedRoutes() {
  const { isAuthenticated } = useAuth();
  const [location] = useLocation();
  
  // Allow access to auth pages without authentication
  if (location === '/auth' || location === '/auth-demo' || location === '/auth/callback') {
    return (
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/auth/callback" component={AuthCallback} />
        <Route path="/auth-demo" component={AuthDemo} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  // Redirect to auth page if not authenticated
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Main app routes for authenticated users
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth-demo" component={AuthDemo} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Simple router that doesn't depend on authentication
function SimpleRouter() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/auth-demo" component={AuthDemo} />
      <Route path="/" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Use a simple flag to determine if we should use the full auth system
  // or a simplified version for development/testing
  const [useSimpleRouter] = useState(() => {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('simple') || urlParams.has('demo');
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          {useSimpleRouter ? (
            // Simple router without authentication for testing
            <>
              <Toaster />
              <PageViewTracker>
                <SimpleRouter />
              </PageViewTracker>
            </>
          ) : (
            // Full authentication system
            <AuthProvider>
              <WalletProvider>
                <Toaster />
                <PageViewTracker>
                  <AuthenticatedRoutes />
                </PageViewTracker>
              </WalletProvider>
            </AuthProvider>
          )}
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
