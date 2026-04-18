import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PointsTable } from "@/components/PointsTable";
import { Background3D } from "@/components/Background3D";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Suspense } from "react";

const Leaderboard = () => {
  return (
    <div className="min-h-screen relative overflow-x-hidden bg-background">
      <Background3D />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />
      <div className="pt-24 z-10 relative">
        <PointsTable />
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
