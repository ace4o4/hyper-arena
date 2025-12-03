import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Users, Sparkles, ArrowRight } from "lucide-react";
import bgmiLogo from "@/assets/bgmi-logo.jpg";
import freefireLogo from "@/assets/freefire-logo.jpg";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const games = [
  {
    id: "bgmi",
    name: "BGMI",
    tagline: "Battle Royale Mastery",
    logo: bgmiLogo,
    color: "from-primary to-accent",
    glow: "hsl(var(--primary))",
  },
  {
    id: "freefire",
    name: "Free Fire",
    tagline: "Fast-Paced Combat",
    logo: freefireLogo,
    color: "from-destructive to-cyber-purple",
    glow: "hsl(var(--destructive))",
  },
];

export const GameSelector = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  
  return (
    <section ref={containerRef} className="py-24 px-4 relative overflow-hidden">
      {/* Parallax background elements */}
      <motion.div 
        style={{ y }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-30, 30]) }}
        className="absolute -bottom-20 -right-20 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none"
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
            SELECT YOUR GAME
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-gradient-cyber">Choose Your Battle</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            Select your game and dominate the competition
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {games.map((game, idx) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, x: idx === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2 }}
              whileHover={{ y: -12, rotateY: 3 }}
              className="glass-strong rounded-3xl p-8 cursor-pointer group relative overflow-hidden card-3d"
              style={{ 
                transformStyle: "preserve-3d",
                perspective: "1000px",
              }}
              onClick={() => navigate("/register")}
            >
              {/* Animated gradient border */}
              <div 
                className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{
                  background: `linear-gradient(135deg, ${game.glow} 0%, transparent 50%)`,
                  filter: 'blur(40px)',
                }}
              />
              
              {/* Hologram scan effect */}
              <div className="absolute inset-0 hologram opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
              
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                {/* Logo with 3D effect */}
                <div className="mb-8 flex justify-center">
                  <motion.div
                    className="relative"
                    whileHover={{ rotateY: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={game.logo}
                      alt={game.name}
                      className="w-36 h-36 object-cover rounded-2xl border-2 border-border/20 group-hover:border-primary/50 transition-all duration-500"
                      style={{
                        boxShadow: `0 20px 40px -20px ${game.glow}`,
                      }}
                    />
                    {/* Glow ring */}
                    <motion.div
                      className={`absolute -inset-2 rounded-2xl bg-gradient-to-r ${game.color} opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500`}
                    />
                  </motion.div>
                </div>
                
                <h3 className="text-4xl font-black text-center mb-2 group-hover:text-gradient-primary transition-all duration-300">
                  {game.name}
                </h3>
                <p className="text-muted-foreground text-center mb-8">{game.tagline}</p>
                
                {/* Stats cards */}
                <div className="space-y-3">
                  {[
                    { icon: Trophy, label: "Active Tournaments", value: "12", color: "text-primary" },
                    { icon: Sparkles, label: "Prize Pool", value: "₹2.5L", color: "text-accent" },
                    { icon: Users, label: "Players Online", value: "2.4K", color: "text-cyber-purple" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 8, backgroundColor: "hsl(var(--muted) / 0.3)" }}
                      className="flex items-center justify-between glass rounded-xl p-4 transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        <span className="text-sm uppercase tracking-wider text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className={`${stat.color} font-bold text-xl`}>{stat.value}</span>
                    </motion.div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full mt-8 bg-gradient-to-r ${game.color} text-white font-bold py-5 rounded-xl uppercase tracking-wider relative overflow-hidden group/btn flex items-center justify-center gap-2`}
                >
                  <span className="relative z-10">View Tournaments</span>
                  <motion.div
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                    className="relative z-10"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
