import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Game, TeamData, subscribeToTeams } from "@/lib/pointsTableApi";

export default function BroadcastOverlay() {
  const [searchParams] = useSearchParams();
  const gameParam = searchParams.get("game") as Game | null;
  const activeGame = gameParam || "bgmi";

  const [teams, setTeams] = useState<TeamData[]>([]);

  useEffect(() => {
    document.body.classList.add("obs-mode");
    return () => document.body.classList.remove("obs-mode");
  }, []);

  useEffect(() => {
    const unsub = subscribeToTeams(activeGame, (data) => {
      setTeams(data.slice(0, 12));
    });
    return unsub;
  }, [activeGame]);

  const gameLabel = activeGame === "bgmi" ? "BGMI" : "FREE FIRE";
  const winLabel  = activeGame === "bgmi" ? "🍗 DINNERS" : "🔥 BOOYAHS";

  const rankColor = (rank: number) => {
    if (rank === 1) return "#F59E0B";
    if (rank === 2) return "#9CA3AF";
    if (rank === 3) return "#D97706";
    return "rgba(255,255,255,0.5)";
  };

  return (
    <div className="w-[1920px] h-[1080px] relative overflow-hidden">
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        initial={{ x: 1490, y: 28, opacity: 0 }}
        animate={{ x: 1490, y: 28, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 22 }}
        className="w-[430px] absolute cursor-grab active:cursor-grabbing select-none"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", touchAction: "none" }}
      >

        {/* ── Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 mb-2 rounded-xl"
          style={{ background: "rgba(8, 8, 20, 0.88)", backdropFilter: "blur(14px)" }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block w-2 h-2 rounded-full bg-red-500 shrink-0"
              style={{ boxShadow: "0 0 8px #ef4444", animation: "pulse 1.5s ease-in-out infinite" }}
            />
            <span className="text-[12px] font-bold tracking-[0.18em] text-white uppercase">
              LIVE · Points Table
            </span>
          </div>
          <span
            className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
          >
            {gameLabel}
          </span>
        </div>

        {/* ── Column Headers ── */}
        <div
          className="grid px-4 py-2 mb-0.5 rounded-lg text-[10px] font-bold tracking-[0.15em] uppercase"
          style={{
            background: "rgba(8, 8, 20, 0.82)",
            color: "rgba(255,255,255,0.4)",
            gridTemplateColumns: "28px 1fr 36px 42px 44px 38px",
          }}
        >
          <div className="text-center">#</div>
          <div>TEAM</div>
          <div className="text-center">K</div>
          <div className="text-center">PLS</div>
          <div className="text-center">{activeGame === "bgmi" ? "🍗" : "🔥"}</div>
          <div className="text-right">PTS</div>
        </div>

        {/* ── Team Rows ── */}
        <div className="flex flex-col">
          <AnimatePresence mode="popLayout">
            {teams.map((team, idx) => {
              const rank = idx + 1;
              return (
                <motion.div
                  key={team.id}
                  layout
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 300, damping: 28, delay: idx * 0.035 }}
                  className="grid items-center px-4 py-2.5 rounded-none"
                  style={{
                    gridTemplateColumns: "28px 1fr 36px 42px 44px 38px",
                    background: "rgba(10, 12, 28, 0.82)",
                    backdropFilter: "blur(12px)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  {/* Rank */}
                  <div className="flex justify-center">
                    <span
                      className="text-[14px] font-black leading-none"
                      style={{ color: rankColor(rank) }}
                    >
                      {rank}
                    </span>
                  </div>

                  {/* Team Name */}
                  <div className="overflow-hidden px-1">
                    <span
                      className="text-[13px] font-semibold uppercase tracking-wide truncate block leading-none"
                      style={{ color: "rgba(255,255,255,0.9)" }}
                    >
                      {team.name}
                    </span>
                  </div>

                  {/* Kills */}
                  <div className="text-center text-[13px] font-bold leading-none"
                    style={{ color: "rgba(255,255,255,0.6)" }}>
                    {team.kills}
                  </div>

                  {/* Placement Pts */}
                  <div className="text-center text-[13px] font-bold leading-none"
                    style={{ color: "rgba(140,200,255,0.8)" }}>
                    {team.placement_pts}
                  </div>

                  {/* Wins */}
                  <div className="text-center text-[13px] font-bold leading-none"
                    style={{ color: "rgba(255,220,80,0.85)" }}>
                    {team.wins}
                  </div>

                  {/* Total Points */}
                  <div className="text-right">
                    <motion.span
                      key={team.total}
                      initial={{ scale: 1.5, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-[16px] font-black leading-none block"
                      style={{ color: rank <= 3 ? rankColor(rank) : "rgba(255,255,255,0.95)" }}
                    >
                      {team.total}
                    </motion.span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {teams.length === 0 && (
            <div
              className="text-center py-6 rounded-xl text-[11px] tracking-widest uppercase"
              style={{ background: "rgba(10,12,28,0.55)", color: "rgba(255,255,255,0.2)" }}
            >
              No Teams Yet
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="mt-2 py-1.5 text-center rounded-lg text-[8px] tracking-[0.2em] uppercase"
          style={{ background: "rgba(8,8,20,0.78)", color: "rgba(255,255,255,0.2)" }}
        >
          Hyper Arena · Live Tournament
        </div>
      </motion.div>
    </div>
  );
}
