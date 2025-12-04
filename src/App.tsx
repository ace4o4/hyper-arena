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

// Sci-fi Gaming Loader
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
    {/* Background grid */}
    <div className="absolute inset-0 opacity-10">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
    </div>
    
    <div className="relative flex flex-col items-center gap-6">
      {/* Hexagon loader */}
      <div className="relative w-24 h-24">
        {/* Outer rotating hexagon */}
        <div 
          className="absolute inset-0 border-2 border-primary animate-spin"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDuration: '3s',
          }} 
        />
        {/* Middle pulsing hexagon */}
        <div 
          className="absolute inset-3 bg-primary/20 animate-pulse"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          }} 
        />
        {/* Inner core */}
        <div 
          className="absolute inset-6 bg-gradient-to-br from-primary to-accent"
          style={{ 
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animation: 'pulse 1s ease-in-out infinite',
          }} 
        />
        {/* Scanning line */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
        >
          <div 
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
            style={{
              animation: 'scan 1.5s ease-in-out infinite',
            }}
          />
        </div>
        {/* Corner accents */}
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              top: `${50 - 45 * Math.cos((angle * Math.PI) / 180)}%`,
              left: `${50 + 45 * Math.sin((angle * Math.PI) / 180)}%`,
              transform: 'translate(-50%, -50%)',
              animation: `pulse 1s ease-in-out infinite ${i * 0.1}s`,
            }}
          />
        ))}
      </div>
      
      {/* Text with glitch effect */}
      <div className="relative">
        <span className="text-primary font-orbitron font-bold text-lg tracking-[0.3em] glitch-text" data-text="INITIALIZING">
          INITIALIZING
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-48 h-1 bg-muted/30 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
          style={{
            animation: 'loading-bar 1.5s ease-in-out infinite',
          }}
        />
      </div>
    </div>
    
    <style>{`
      @keyframes scan {
        0%, 100% { top: 0%; }
        50% { top: 100%; }
      }
      @keyframes loading-bar {
        0% { width: 0%; margin-left: 0%; }
        50% { width: 100%; margin-left: 0%; }
        100% { width: 0%; margin-left: 100%; }
      }
    `}</style>
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
