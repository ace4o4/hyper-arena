import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Users, Calendar, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTournamentGridData, type TournamentCardData } from "@/lib/tournamentsApi";

const getRegistrationLink = (tournament: TournamentCardData, mode: "create" | "join") => {
  const params = new URLSearchParams({
    tournamentId: tournament.id,
    game: tournament.game,
    mode,
  });

  return `/create-team?${params.toString()}`;
};

export const TournamentGrid = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTournaments, setActiveTournaments] = useState<TournamentCardData[]>([]);
  const [comingSoonTournaments, setComingSoonTournaments] = useState<TournamentCardData[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchTournaments = async () => {
      const data = await getTournamentGridData();
      if (!isMounted) return;

      setActiveTournaments(data.active);
      setComingSoonTournaments(data.comingSoon);
      setIsLoading(false);
    };

    fetchTournaments();

    return () => {
      isMounted = false;
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section id="tournaments" ref={containerRef} className="py-24 px-4 relative overflow-hidden">
      {/* Parallax orbs */}
      <motion.div
        style={{ y }}
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-40, 40]) }}
        className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            className="inline-block px-4 py-2 glass rounded-full text-sm font-medium text-primary mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            COMPETE NOW
          </motion.span>
          <h2 className="text-3xl sm:text-4xl md:text-7xl font-black mb-4">
            <span className="text-gradient-primary break-words whitespace-normal text-center">Active Tournaments</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground px-4">Register now and claim your victory</p>
        </motion.div>

        {/* Active Tournaments - Asymmetrical Stack */}
        <div className="grid md:grid-cols-1 gap-8 max-w-5xl mx-auto mb-16">
          {isLoading && (
            <div className="glass rounded-2xl p-8 text-center border border-white/10">
              <p className="text-sm uppercase tracking-[0.25em] text-primary">Syncing tournament feed...</p>
            </div>
          )}

          {!isLoading && activeTournaments.map((tournament) => {
            const fillPercentage = tournament.slots > 0 ? (tournament.filled / tournament.slots) * 100 : 0;

            return (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                whileHover={{ scale: 1.01 }}
                className={`gpu-accelerated clip-panel glass-strong p-0 relative overflow-hidden group cursor-pointer border-l-[4px] border-primary`}
                onClick={() => navigate(getRegistrationLink(tournament, "create"))}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 h-full">
                  {/* Left Side: Game Image/Graphic Placeholder */}
                  <div className="md:col-span-4 relative bg-black/40 overflow-hidden hide-on-mobile border-r border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-overlay" />
                    {/* Mock character silhouette */}
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block bg-primary/20 text-primary px-3 py-1 text-xs font-bold uppercase tracking-wider clip-diagonal">
                        {tournament.game}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: Data */}
                  <div className="md:col-span-8 p-6 md:p-8 relative">
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
                    </div>

                    {/* Live Badge */}
                    {tournament.isLive && (
                      <motion.div className="absolute top-0 right-0 flex items-center gap-2 bg-destructive/20 backdrop-blur-sm px-4 py-2 clip-data-panel">
                        <motion.div animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                          <CircleDot className="h-3 w-3 text-destructive" />
                        </motion.div>
                        <span className="text-xs font-bold text-destructive uppercase tracking-wider">Live Match</span>
                      </motion.div>
                    )}

                    {/* Title */}
                    <h3 className="text-3xl font-black mb-6 group-hover:text-shadow-glow transition-all duration-300">
                      {tournament.title}
                    </h3>

                    {/* Jack UI Info Grid layout */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-8">
                      {[
                        { icon: Trophy, label: "Prize Pool", value: tournament.prize, color: "text-primary" },
                        { icon: Users, label: "Entry Fee", value: tournament.entryFee, color: "text-accent" },
                        { icon: Calendar, label: "Date", value: tournament.date, color: "text-cyber-purple" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`p-2 bg-white/5 clip-diagonal ${item.color}`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{item.label}</div>
                            <div className={`font-bold ${item.color}`}>{item.value}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Minimalist HP-Style Progress Bar */}
                    <div className="mb-0 mt-auto">
                      <div className="flex justify-between text-xs font-mono mb-2 uppercase text-muted-foreground">
                        <span>Registration Capacity</span>
                        <span className="font-bold text-white">{tournament.filled} / {tournament.slots}</span>
                      </div>
                      <div className="relative h-[2px] bg-white/10 w-full mb-1">
                        <motion.div 
                          className="absolute top-0 left-0 bottom-0 bg-primary"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${fillPercentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-white" />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col sm:flex-row gap-2">
                      <Button
                        size="sm"
                        className="bg-toxic-green hover:bg-toxic-green/90 text-black font-semibold"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(getRegistrationLink(tournament, "create"));
                        }}
                      >
                        Create Team
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neon-cyan/60 text-neon-cyan hover:bg-neon-cyan/10"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(getRegistrationLink(tournament, "join"));
                        }}
                      >
                        Join Team
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {comingSoonTournaments.length > 0 && (
          <>
            {/* Coming Soon Tournaments */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <span className="text-muted-foreground text-lg">More tournaments coming soon...</span>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto opacity-60">
              {comingSoonTournaments.map((tournament, idx) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="gpu-accelerated glass rounded-2xl p-6 relative overflow-hidden border border-muted/20"
                >
                  {/* Coming Soon Badge */}
                  <div className="absolute top-4 right-4 bg-muted/30 backdrop-blur-sm border border-muted/50 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Coming Soon</span>
                  </div>

                  {/* Game Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-muted/20 text-muted-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {tournament.game}
                    </span>
                  </div>

                  <h3 className="text-2xl font-black mb-4 text-muted-foreground">
                    {tournament.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Trophy className="h-4 w-4" />
                        <span className="text-sm">Prize Pool</span>
                      </div>
                      <span className="font-bold text-muted-foreground">{tournament.prize}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-muted-foreground/60">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">Date</span>
                      </div>
                      <span className="font-bold text-muted-foreground">{tournament.date}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled
                    variant="outline"
                  >
                    Stay Tuned
                  </Button>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
