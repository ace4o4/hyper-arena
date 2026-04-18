import { Suspense, lazy } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Background3D } from "@/components/Background3D";

const ParticleBackground = lazy(() =>
  import("@/components/ParticleBackground").then((module) => ({ default: module.ParticleBackground }))
);
const TournamentGrid = lazy(() =>
  import("@/components/TournamentGrid").then((module) => ({ default: module.TournamentGrid }))
);

export default function Tournaments() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Background3D />
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <Navbar />

      <div className="pt-16">
        <Suspense
          fallback={
            <div className="min-h-[50vh] flex items-center justify-center text-primary font-semibold tracking-widest">
              LOADING TOURNAMENTS...
            </div>
          }
        >
          <TournamentGrid />
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
