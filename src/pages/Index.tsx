import { Hero } from "@/components/Hero";
import { GameSelector } from "@/components/GameSelector";
import { TournamentGrid } from "@/components/TournamentGrid";
import { TournamentBracket } from "@/components/TournamentBracket";
import { LiveTicker } from "@/components/LiveTicker";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      <Hero />
      <GameSelector />
      <TournamentGrid />
      <TournamentBracket />
      <LiveTicker />
      <Footer />
    </div>
  );
};

export default Index;
