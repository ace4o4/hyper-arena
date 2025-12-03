import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Registration = lazy(() => import("./pages/Registration"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Custom fast loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="relative flex flex-col items-center gap-4">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-4 border-primary/20 rounded-lg rotate-45 animate-pulse" />
        <div className="absolute inset-2 border-4 border-primary/40 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '2s' }} />
        <div className="absolute inset-4 border-4 border-primary rounded-lg rotate-45 animate-ping" style={{ animationDuration: '1s' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-primary font-orbitron font-bold text-sm tracking-widest">LOADING</span>
        <span className="flex gap-1">
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      </div>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Registration />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
