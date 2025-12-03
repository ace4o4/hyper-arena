import { lazy, Suspense } from "react";
import { Hero } from "@/components/Hero";
import { GameSelector } from "@/components/GameSelector";
import { LiveTicker } from "@/components/LiveTicker";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { Navbar } from "@/components/Navbar";
import { Background3D } from "@/components/Background3D";

// Lazy load heavy components
const TournamentGrid = lazy(() => import("@/components/TournamentGrid").then(m => ({ default: m.TournamentGrid })));
const TournamentBracket = lazy(() => import("@/components/TournamentBracket").then(m => ({ default: m.TournamentBracket })));
const PrizePool = lazy(() => import("@/components/PrizePool").then(m => ({ default: m.PrizePool })));
const PointsTable = lazy(() => import("@/components/PointsTable").then(m => ({ default: m.PointsTable })));
const ParticleBackground = lazy(() => import("@/components/ParticleBackground").then(m => ({ default: m.ParticleBackground })));

// Lightweight loading placeholder
const SectionLoader = () => (
  <div className="py-24 flex justify-center">
    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <CustomCursor />
      <Background3D />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />
      <Hero />
      <GameSelector />
      <Suspense fallback={<SectionLoader />}>
        <PrizePool />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <PointsTable />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TournamentGrid />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <TournamentBracket />
      </Suspense>
      <LiveTicker />
      <Footer />
    </div>
  );
};

export default Index;
