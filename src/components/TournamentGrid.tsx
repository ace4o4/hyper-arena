import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Users, Calendar, CircleDot, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const tournaments = [
  {
    id: 1,
    title: "BGMI Championship",
    game: "BGMI",
    prize: "₹50,000",
    slots: 64,
    filled: 48,
    date: "15 Dec 2025",
    isLive: true,
    entryFee: "₹100",
  },
  {
    id: 2,
    title: "Free Fire Arena",
    game: "Free Fire",
    prize: "₹30,000",
    slots: 48,
    filled: 32,
    date: "18 Dec 2025",
    isLive: false,
    entryFee: "₹50",
  },
  {
    id: 3,
    title: "Squad Showdown",
    game: "BGMI",
    prize: "₹75,000",
    slots: 80,
    filled: 72,
    date: "20 Dec 2025",
    isLive: true,
    entryFee: "₹200",
  },
  {
    id: 4,
    title: "Solo Masters",
    game: "Free Fire",
    prize: "₹40,000",
    slots: 50,
    filled: 28,
    date: "22 Dec 2025",
    isLive: false,
    entryFee: "₹150",
  },
];

export const TournamentGrid = () => {
  const containerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section ref={containerRef} className="py-24 px-4 relative overflow-hidden">
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
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-gradient-primary">Active Tournaments</span>
          </h2>
          <p className="text-xl text-muted-foreground">Register now and claim your victory</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {tournaments.map((tournament, idx) => {
            const fillPercentage = (tournament.filled / tournament.slots) * 100;
            
            return (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-strong rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
                onClick={() => navigate("/register")}
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                </div>

                {/* Live Badge */}
                {tournament.isLive && (
                  <motion.div
                    className="absolute top-4 right-4 flex items-center gap-2 bg-destructive/20 backdrop-blur-sm border border-destructive/50 rounded-full px-3 py-1 pulse-ring"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <CircleDot className="h-3 w-3 text-destructive" />
                    </motion.div>
                    <span className="text-xs font-bold text-destructive uppercase tracking-wider">Live</span>
                  </motion.div>
                )}

                {/* Game Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tournament.game}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black mb-4 group-hover:text-gradient-primary transition-all duration-300">
                  {tournament.title}
                </h3>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                  {[
                    { icon: Trophy, label: "Prize Pool", value: tournament.prize, color: "text-primary" },
                    { icon: Users, label: "Entry Fee", value: tournament.entryFee, color: "text-accent" },
                    { icon: Calendar, label: "Date", value: tournament.date, color: "text-cyber-purple" },
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      className="flex items-center justify-between"
                      whileHover={{ x: 4 }}
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className={`h-4 w-4 ${item.color}`} />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Slots Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Slots Filled</span>
                    <span className="font-bold">
                      {tournament.filled}/{tournament.slots}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={fillPercentage} className="h-2" />
                    {fillPercentage > 80 && (
                      <motion.span 
                        className="absolute -top-1 right-0 text-xs text-destructive font-bold"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        Almost Full!
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Register Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider relative overflow-hidden group/btn"
                    size="lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Register Now
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 5 }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </span>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "100%" }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
