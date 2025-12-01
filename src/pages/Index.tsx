import { Hero } from "@/components/Hero";
import { GameSelector } from "@/components/GameSelector";
import { TournamentGrid } from "@/components/TournamentGrid";
import { TournamentBracket } from "@/components/TournamentBracket";
import { LiveTicker } from "@/components/LiveTicker";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <GameSelector />
      <TournamentGrid />
      <TournamentBracket />
      <LiveTicker />
    </div>
  );
};

export default Index;
