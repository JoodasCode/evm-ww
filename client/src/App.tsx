import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/ThemeProvider";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/not-found";
import AuthDemo from "./pages/AuthDemo";
import { AuthPage } from "./pages/AuthPage";
import { PageViewTracker } from "./components/analytics/PageViewTracker";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Application router with protected routes
function AppRouter() {
  return (
    <Switch>
      <Route path="/auth-demo" component={AuthDemo} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )}
      </Route>
      <Route path="/">
        {() => <Redirect to="/auth" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <PageViewTracker>
            <AppRouter />
          </PageViewTracker>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
