import { motion } from "framer-motion";
import { Trophy, Users, Calendar, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

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
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-primary">Active Tournaments</span>
          </h2>
          <p className="text-xl text-muted-foreground">Register now and claim your victory</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {tournaments.map((tournament, idx) => {
            const fillPercentage = (tournament.filled / tournament.slots) * 100;
            
            return (
              <motion.div
                key={tournament.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -8 }}
                className="glass rounded-2xl p-6 relative overflow-hidden group"
              >
                {/* Live Badge */}
                {tournament.isLive && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute top-4 right-4 flex items-center gap-2 bg-neon-red/20 backdrop-blur-sm border border-neon-red/50 rounded-full px-3 py-1"
                  >
                    <CircleDot className="h-3 w-3 text-neon-red" />
                    <span className="text-xs font-bold text-neon-red uppercase tracking-wider">Live Now</span>
                  </motion.div>
                )}

                {/* Game Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-toxic-green/20 text-toxic-green px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {tournament.game}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-black mb-4 group-hover:text-gradient-primary transition-all duration-300">
                  {tournament.title}
                </h3>

                {/* Info Grid */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-4 w-4 text-toxic-green" />
                      <span className="text-sm">Prize Pool</span>
                    </div>
                    <span className="font-bold text-toxic-green">{tournament.prize}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4 text-neon-cyan" />
                      <span className="text-sm">Entry Fee</span>
                    </div>
                    <span className="font-bold text-neon-cyan">{tournament.entryFee}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4 text-cyber-purple" />
                      <span className="text-sm">Date</span>
                    </div>
                    <span className="font-semibold">{tournament.date}</span>
                  </div>
                </div>

                {/* Slots Progress */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Slots Filled</span>
                    <span className="font-bold">
                      {tournament.filled}/{tournament.slots}
                    </span>
                  </div>
                  <Progress 
                    value={fillPercentage} 
                    className="h-2"
                  />
                </div>

                {/* Register Button */}
                <Button 
                  className="w-full bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold uppercase tracking-wider"
                  size="lg"
                >
                  Register Now
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
