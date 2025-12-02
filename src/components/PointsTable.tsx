import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronRight, Crown, Zap, Target, Crosshair } from "lucide-react";

const teams = [
  { rank: 1, name: "Team Mayhem", logo: "🔥", points: 2450, kills: 89, wins: 12, change: "up", winRate: 78 },
  { rank: 2, name: "Soul Esports", logo: "⚡", points: 2380, kills: 82, wins: 11, change: "up", winRate: 72 },
  { rank: 3, name: "GodLike", logo: "👑", points: 2290, kills: 76, wins: 10, change: "same", winRate: 68 },
  { rank: 4, name: "Team XSpark", logo: "✨", points: 2150, kills: 71, wins: 9, change: "down", winRate: 65 },
  { rank: 5, name: "Orangutan", logo: "🦧", points: 2080, kills: 68, wins: 8, change: "up", winRate: 62 },
  { rank: 6, name: "Velocity Gaming", logo: "🚀", points: 1950, kills: 64, wins: 7, change: "down", winRate: 58 },
  { rank: 7, name: "Team Insane", logo: "💀", points: 1820, kills: 59, wins: 6, change: "same", winRate: 54 },
  { rank: 8, name: "Revenant", logo: "👻", points: 1700, kills: 55, wins: 5, change: "up", winRate: 50 },
];

export const PointsTable = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const getRankStyle = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-l-4 border-yellow-500";
    if (rank === 2) return "bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-l-4 border-gray-400";
    if (rank === 3) return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-l-4 border-amber-600";
    return "border-l-4 border-transparent hover:border-primary/50";
  };

  const getTrendIcon = (change: string) => {
    if (change === "up") return <TrendingUp className="w-4 h-4 text-primary" />;
    if (change === "down") return <TrendingDown className="w-4 h-4 text-destructive" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Parallax background elements */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-[120px]" />
      </motion.div>

      {/* Holographic grid overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `
          linear-gradient(rgba(0,180,216,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,180,216,0.3) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          style={{ y }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <Target className="w-4 h-4 text-neon-cyan" />
            <span className="text-sm font-medium text-neon-cyan">LIVE RANKINGS</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-cyber">POINTS TABLE</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real-time tournament standings updated after every match
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto"
        >
          {[
            { label: "Total Matches", value: "48", icon: Crosshair },
            { label: "Total Kills", value: "564", icon: Target },
            { label: "Avg Kill/Match", value: "11.75", icon: Zap },
            { label: "Top Fragger", value: "89 Kills", icon: Crown },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-xl p-4 text-center border border-border/20"
            >
              <stat.icon className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
              <div className="text-2xl font-black text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Points Table */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          {/* Table Header */}
          <div className="glass-strong rounded-t-2xl p-4 border-b border-border/20">
            <div className="grid grid-cols-12 gap-4 text-sm font-orbitron uppercase tracking-wider text-muted-foreground">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-4 md:col-span-3">Team</div>
              <div className="col-span-2 text-center hidden md:block">Wins</div>
              <div className="col-span-2 text-center hidden md:block">Kills</div>
              <div className="col-span-2 text-center">Win Rate</div>
              <div className="col-span-3 md:col-span-2 text-center">Points</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="glass-strong rounded-b-2xl overflow-hidden">
            {teams.map((team, idx) => (
              <motion.div
                key={team.rank}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                onMouseEnter={() => setHoveredRow(team.rank)}
                onMouseLeave={() => setHoveredRow(null)}
                className={`relative grid grid-cols-12 gap-4 p-4 items-center transition-all duration-300 cursor-pointer ${getRankStyle(team.rank)} ${
                  hoveredRow === team.rank ? "bg-white/5" : ""
                }`}
              >
                {/* Hologram highlight on hover */}
                {hoveredRow === team.rank && (
                  <motion.div
                    layoutId="tableHighlight"
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-neon-cyan/10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}

                {/* Rank */}
                <div className="col-span-1 text-center relative z-10">
                  <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-black ${
                    team.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                    team.rank === 2 ? "bg-gray-400/20 text-gray-400" :
                    team.rank === 3 ? "bg-amber-600/20 text-amber-600" :
                    "bg-muted/20 text-muted-foreground"
                  }`}>
                    {team.rank}
                  </div>
                </div>

                {/* Team */}
                <div className="col-span-4 md:col-span-3 flex items-center gap-3 relative z-10">
                  <div className="text-2xl">{team.logo}</div>
                  <div>
                    <div className="font-bold text-foreground flex items-center gap-2">
                      {team.name}
                      {team.rank === 1 && <Crown className="w-4 h-4 text-yellow-500" />}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      {getTrendIcon(team.change)}
                    </div>
                  </div>
                </div>

                {/* Wins */}
                <div className="col-span-2 text-center hidden md:block relative z-10">
                  <span className="text-foreground font-bold">{team.wins}</span>
                </div>

                {/* Kills */}
                <div className="col-span-2 text-center hidden md:block relative z-10">
                  <span className="text-foreground font-bold">{team.kills}</span>
                </div>

                {/* Win Rate */}
                <div className="col-span-2 text-center relative z-10">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-16 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${team.winRate}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-neon-cyan rounded-full"
                      />
                    </div>
                    <span className="text-sm text-muted-foreground">{team.winRate}%</span>
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-3 md:col-span-2 text-center relative z-10">
                  <motion.span 
                    className={`text-xl font-black ${
                      team.rank <= 3 ? "text-gradient-primary" : "text-foreground"
                    }`}
                    animate={hoveredRow === team.rank ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {team.points}
                  </motion.span>
                </div>

                {/* Arrow indicator */}
                <motion.div
                  className="absolute right-4 opacity-0 transition-opacity"
                  animate={{ opacity: hoveredRow === team.rank ? 1 : 0, x: hoveredRow === team.rank ? 0 : -10 }}
                >
                  <ChevronRight className="w-5 h-5 text-primary" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View Full Standings CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 glass rounded-lg border border-neon-cyan/30 text-neon-cyan font-orbitron hover:bg-neon-cyan/10 transition-all group"
          >
            View Full Standings
            <ChevronRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
