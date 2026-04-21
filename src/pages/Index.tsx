import { lazy, Suspense } from "react";
import { Hero } from "@/components/Hero";
import { CommunityBanner } from "@/components/CommunityBanner";


import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { Background3D } from "@/components/Background3D";
import { TournamentCardSkeleton, TableRowSkeleton } from "@/components/SkeletonLoader";

// Lazy load heavy components
const TournamentGrid = lazy(() => import("@/components/TournamentGrid").then(m => ({ default: m.TournamentGrid })));
// const TournamentBracket = lazy(() => import("@/components/TournamentBracket").then(m => ({ default: m.TournamentBracket })));

const ParticleBackground = lazy(() => import("@/components/ParticleBackground").then(m => ({ default: m.ParticleBackground })));

// Skeleton loaders for each section
const TournamentGridSkeleton = () => (
  <div className="py-24 container mx-auto px-4">
    <div className="animate-pulse mb-12">
      <div className="h-10 bg-muted/30 rounded w-1/3 mx-auto mb-4" />
      <div className="h-6 bg-muted/30 rounded w-1/4 mx-auto" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <TournamentCardSkeleton key={i} />
      ))}
    </div>
  </div>
);




const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Background3D />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />
      <Hero />

      <CommunityBanner />

      <Suspense fallback={<TournamentGridSkeleton />}>
        <TournamentGrid />
      </Suspense>
      {/* <Suspense fallback={<TournamentGridSkeleton />}>
        <TournamentBracket />
      </Suspense> */}
      <Footer />
    </div>
  );
};

export default Index;