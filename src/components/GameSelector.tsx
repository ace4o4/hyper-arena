import { motion } from "framer-motion";
import { Trophy, Users, Sparkles } from "lucide-react";
import bgmiLogo from "@/assets/bgmi-logo.jpg";
import freefireLogo from "@/assets/freefire-logo.jpg";
import { useNavigate } from "react-router-dom";

const games = [
  {
    id: "bgmi",
    name: "BGMI",
    tagline: "Battle Royale Mastery",
    logo: bgmiLogo,
    color: "from-toxic-green to-neon-cyan",
  },
  {
    id: "freefire",
    name: "Free Fire",
    tagline: "Fast-Paced Combat",
    logo: freefireLogo,
    color: "from-neon-red to-cyber-purple",
  },
];

export const GameSelector = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-20 px-4 relative">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="text-gradient-cyber">Choose Your Battle</span>
          </h2>
          <p className="text-xl text-muted-foreground">Select your game and dominate the competition</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {games.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5, y: -10 }}
              className="glass rounded-2xl p-8 cursor-pointer group relative overflow-hidden shadow-xl hover:shadow-2xl transition-shadow"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Animated Border Glow */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500`}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className="mb-6 flex justify-center">
                  <motion.img
                    src={game.logo}
                    alt={game.name}
                    className="w-32 h-32 object-cover rounded-xl border-2 border-white/10 group-hover:border-white/30 transition-all duration-300 group-hover:shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                    whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                
                <h3 className="text-4xl font-black text-center mb-2 group-hover:text-gradient-primary transition-all">
                  {game.name}
                </h3>
                <p className="text-muted-foreground text-center mb-6">{game.tagline}</p>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between glass rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-toxic-green" />
                    <span className="text-sm uppercase tracking-wider">Active Tournaments</span>
                  </div>
                  <span className="text-toxic-green font-bold text-xl">12</span>
                </motion.div>
                
                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between glass rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-neon-cyan" />
                    <span className="text-sm uppercase tracking-wider">Prize Pool</span>
                  </div>
                  <span className="text-neon-cyan font-bold text-xl">₹2.5L</span>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between glass rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cyber-purple" />
                    <span className="text-sm uppercase tracking-wider">Players Online</span>
                  </div>
                  <span className="text-cyber-purple font-bold text-xl">2.4K</span>
                </motion.div>
                
                <motion.button
                  onClick={() => navigate("/register")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full mt-6 bg-gradient-to-r ${game.color} text-white font-bold py-4 rounded-lg uppercase tracking-wider hover:shadow-[0_0_30px_rgba(0,255,157,0.5)] transition-shadow duration-300 relative overflow-hidden group/btn`}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative z-10">View Tournaments</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
