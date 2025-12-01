import { motion } from "framer-motion";
import { Trophy, Crown, Zap } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Match {
  id: string;
  player1: { name: string; score: number; winner?: boolean };
  player2: { name: string; score: number; winner?: boolean };
  status: "live" | "upcoming" | "completed";
}

interface Round {
  name: string;
  matches: Match[];
}

const bracketData: Round[] = [
  {
    name: "Round 1",
    matches: [
      { id: "r1m1", player1: { name: "TeamAlpha", score: 15, winner: true }, player2: { name: "TeamBeta", score: 12 }, status: "completed" },
      { id: "r1m2", player1: { name: "TeamGamma", score: 18 }, player2: { name: "TeamDelta", score: 16 }, status: "live" },
      { id: "r1m3", player1: { name: "TeamEpsilon", score: 0 }, player2: { name: "TeamZeta", score: 0 }, status: "upcoming" },
      { id: "r1m4", player1: { name: "TeamEta", score: 14, winner: true }, player2: { name: "TeamTheta", score: 9 }, status: "completed" },
    ],
  },
  {
    name: "Semi Finals",
    matches: [
      { id: "r2m1", player1: { name: "TeamAlpha", score: 0 }, player2: { name: "TeamGamma", score: 0 }, status: "upcoming" },
      { id: "r2m2", player1: { name: "TeamEta", score: 0 }, player2: { name: "TBD", score: 0 }, status: "upcoming" },
    ],
  },
  {
    name: "Finals",
    matches: [
      { id: "r3m1", player1: { name: "TBD", score: 0 }, player2: { name: "TBD", score: 0 }, status: "upcoming" },
    ],
  },
];

export const TournamentBracket = () => {
  return (
    <section className="py-20 px-4 hexagon-pattern">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-cyber">Tournament Bracket</span>
          </h2>
          <p className="text-xl text-muted-foreground">Follow the path to glory</p>
        </motion.div>

        <ScrollArea className="w-full whitespace-nowrap rounded-xl glass p-6">
          <div className="flex gap-8 min-w-max pb-4">
            {bracketData.map((round, roundIdx) => (
              <motion.div
                key={round.name}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: roundIdx * 0.2 }}
                className="flex flex-col gap-6 min-w-[320px]"
              >
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-black text-gradient-primary uppercase tracking-wider">
                    {round.name}
                  </h3>
                </div>

                {round.matches.map((match, matchIdx) => (
                  <motion.div
                    key={match.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: matchIdx * 0.1 }}
                    whileHover={{ scale: 1.03, y: -4 }}
                    className={`glass rounded-xl p-4 relative overflow-hidden ${
                      match.status === "live" ? "ring-2 ring-neon-red glow-danger" : ""
                    }`}
                  >
                    {/* Live Badge */}
                    {match.status === "live" && (
                      <motion.div
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-2 right-2 flex items-center gap-1 bg-neon-red/20 backdrop-blur-sm border border-neon-red/50 rounded-full px-2 py-1"
                      >
                        <Zap className="h-3 w-3 text-neon-red" fill="currentColor" />
                        <span className="text-xs font-bold text-neon-red uppercase">Live</span>
                      </motion.div>
                    )}

                    {/* Player 1 */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                        match.player1.winner
                          ? "bg-toxic-green/20 border-2 border-toxic-green shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                          : "bg-card/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {match.player1.winner && <Crown className="h-4 w-4 text-toxic-green" fill="currentColor" />}
                        <span className={`font-bold ${match.player1.winner ? "text-toxic-green" : ""}`}>
                          {match.player1.name}
                        </span>
                      </div>
                      <span className="text-lg font-black">{match.player1.score}</span>
                    </motion.div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center my-2">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                      <span className="px-3 text-xs font-bold text-muted-foreground">VS</span>
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
                    </div>

                    {/* Player 2 */}
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        match.player2.winner
                          ? "bg-toxic-green/20 border-2 border-toxic-green shadow-[0_0_15px_rgba(0,255,157,0.3)]"
                          : "bg-card/50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {match.player2.winner && <Crown className="h-4 w-4 text-toxic-green" fill="currentColor" />}
                        <span className={`font-bold ${match.player2.winner ? "text-toxic-green" : ""}`}>
                          {match.player2.name}
                        </span>
                      </div>
                      <span className="text-lg font-black">{match.player2.score}</span>
                    </motion.div>
                  </motion.div>
                ))}

                {/* Connection Line */}
                {roundIdx < bracketData.length - 1 && (
                  <div className="absolute right-0 top-1/2 w-8 h-px bg-gradient-to-r from-border to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Winner Podium */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="glass rounded-2xl p-8 text-center max-w-md">
            <Trophy className="h-16 w-16 text-toxic-green mx-auto mb-4 animate-float" />
            <h3 className="text-3xl font-black text-gradient-primary mb-2">Championship Winner</h3>
            <p className="text-muted-foreground mb-4">Match in progress...</p>
            <div className="text-5xl font-black text-toxic-green">₹50,000</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
