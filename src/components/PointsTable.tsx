import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Trophy, ChevronRight, Crown, Zap, Target, Crosshair, MapPin } from "lucide-react";
import { Game, TeamData, subscribeToTeams } from "@/lib/pointsTableApi";

export const PointsTable = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<Game>("bgmi");
  const [teams, setTeams] = useState<TeamData[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  useEffect(() => {
    // Uses localStorage sync logic instead of Firestore
    const unsub = subscribeToTeams(activeGame, (data) => {
      setTeams(data);
    });
    return unsub;
  }, [activeGame]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-l-4 border-yellow-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-l-4 border-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-l-4 border-amber-600";
    return "border-l-4 border-transparent hover:border-primary/50";
  };

  const totalKills = teams.reduce((a, t) => a + t.kills, 0);
  const topKills   = teams.length > 0 ? Math.max(...teams.map((t) => t.kills)) : 0;
  const avgKills   = teams.length > 0 ? (totalKills / teams.length).toFixed(1) : "0";

  return (
    <section id="leaderboard" ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Parallax bg orbs */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px]" />
      </motion.div>

      {/* Holographic grid */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0,180,216,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,180,216,0.3) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div style={{ y }} className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <Target className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">LIVE RANKINGS</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-cyber">POINTS TABLE</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time standings · Auto-synced across tabs
          </p>
        </motion.div>

        {/* ── Game Selector Tabs ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex justify-center mb-10"
        >
          <div className="flex glass border border-white/10 p-1">
            {(["bgmi", "freefire"] as Game[]).map((game) => (
              <motion.button
                key={game}
                onClick={() => setActiveGame(game)}
                whileTap={{ scale: 0.97 }}
                className={`relative px-8 py-3 font-orbitron font-bold text-sm tracking-wider transition-all ${
                  activeGame === game ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {activeGame === game && (
                  <motion.div
                    layoutId="ptTabBg"
                    className="absolute inset-0 bg-primary/20 border border-primary/50"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">
                  {game === "bgmi" ? "🎯  BGMI" : "🔥  Free Fire"}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── Stats Overview ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
        >
          {[
            { label: "Total Teams",  value: teams.length.toString(), icon: Crosshair },
            { label: "Total Kills",  value: totalKills.toString(),   icon: Target    },
            { label: "Avg Kills",    value: avgKills,                icon: Zap       },
            { label: "Top Fragger",  value: `${topKills} kills`,    icon: Crown     },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="gpu-accelerated clip-panel glass rounded-none p-4 text-center border-l-2 border-primary/20 relative"
            >
              <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
              <stat.icon className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
              <div className="text-2xl font-black text-foreground text-shadow-glow">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Points Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* HUD line */}
          <div className="w-full flex items-center gap-4 mb-4">
            <div className="w-4 h-4 border border-primary/50 rotate-45" />
            <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
          </div>

          {/* Table Header */}
          <div className="glass-strong clip-diagonal py-4 px-2 md:px-4 border-b border-primary/20 bg-background/90 text-primary">
            <div className="grid grid-cols-12 gap-1 text-[10px] md:text-[11px] font-bold uppercase tracking-widest items-center">
              <div className="col-span-2 md:col-span-1 text-center">Pos.</div>
              <div className="col-span-7 md:col-span-4 text-left pl-2">Team Name</div>
              <div className="col-span-1 hidden md:block text-center whitespace-nowrap">Kills</div>
              <div className="col-span-1 hidden md:block text-center whitespace-nowrap">Pls. Pts.</div>
              <div className="col-span-2 hidden md:block text-center whitespace-nowrap">
                {activeGame === "bgmi" ? "Chicken Dinner" : "Booyah"}
              </div>
              <div className="col-span-1 hidden md:block" /> {/* Spacer */}
              <div className="col-span-3 md:col-span-2 text-right pr-4 md:pr-10">Total</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="space-y-2 mt-4 overflow-hidden px-4 md:px-0">
            {teams.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Crosshair className="w-10 h-10 mx-auto mb-3 opacity-25" />
                <p className="font-orbitron text-base">NO TEAMS REGISTERED YET</p>
                <p className="text-sm mt-1 opacity-60">
                  Standings will appear here once teams are added in the Admin Panel
                </p>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {teams.map((team, idx) => {
                  const rank = idx + 1;
                  return (
                    <motion.div
                      key={team.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.04 }}
                      onMouseEnter={() => setHoveredRow(team.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className={`gpu-accelerated relative grid grid-cols-12 gap-2 p-4 items-center transition-all duration-300 cursor-pointer clip-panel bg-background/80 ${getRankStyle(rank)} ${
                        hoveredRow === team.id ? "translate-x-3 bg-white/5" : ""
                      }`}
                    >
                      {/* Hover glow */}
                      {hoveredRow === team.id && (
                        <motion.div
                          layoutId="tableHighlight"
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-neon-cyan/10"
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        />
                      )}

                      {/* Rank */}
                      <div className="col-span-2 md:col-span-1 flex justify-center relative z-10 w-full">
                        <div className={`inline-flex items-center justify-center w-8 h-8 font-black ${
                          rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                          rank === 2 ? "bg-gray-400/20   text-gray-400"   :
                          rank === 3 ? "bg-amber-600/20  text-amber-600"  :
                          "bg-muted/20 text-muted-foreground"
                        }`}>
                          {rank}
                        </div>
                      </div>

                      {/* Team */}
                      <div className="col-span-7 md:col-span-4 flex flex-row items-center gap-3 relative z-10 pl-2">
                        <div className="text-2xl leading-none shrink-0">{team.logo}</div>
                        <div className="font-bold text-foreground flex items-center gap-2 min-w-0">
                          <span className="truncate">{team.name}</span>
                          {rank === 1 && <Crown className="w-4 h-4 text-yellow-500 shrink-0" />}
                        </div>
                      </div>

                      {/* Kills */}
                      <div className="col-span-1 hidden md:flex items-center justify-center gap-1.5 relative z-10">
                        <Target className="w-3 h-3 text-muted-foreground shrink-0 hidden lg:block" />
                        <span className="font-bold text-base">{team.kills}</span>
                      </div>

                      {/* Placement */}
                      <div className="col-span-1 hidden md:flex items-center justify-center gap-1.5 relative z-10 text-neon-cyan">
                        <MapPin className="w-3 h-3 shrink-0 hidden lg:block" />
                        <span className="font-bold text-base">{team.placement_pts}</span>
                      </div>

                      {/* Wins */}
                      <div className="col-span-2 hidden md:flex items-center justify-center gap-1.5 relative z-10 text-yellow-400">
                        <Trophy className="w-3 h-3 shrink-0" />
                        <span className="font-bold text-base">{team.wins}</span>
                      </div>

                      {/* Spacer */}
                      <div className="col-span-1 hidden md:block" />

                      {/* Total Points */}
                      <div className="col-span-3 md:col-span-2 text-right relative z-10 flex items-center justify-end pr-4 md:pr-10">
                        <motion.span
                          key={team.total}
                          layout
                          className={`text-2xl font-black ${rank <= 3 ? "text-gradient-primary" : "text-foreground"}`}
                          animate={hoveredRow === team.id ? { scale: [1, 1.12, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          {team.total}
                        </motion.span>
                      </div>

                      {/* Arrow */}
                      <motion.div
                        className="absolute right-4 z-10"
                        animate={{ opacity: hoveredRow === team.id ? 1 : 0, x: hoveredRow === team.id ? 0 : -8 }}
                      >
                        <ChevronRight className="w-5 h-5 text-primary" />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
