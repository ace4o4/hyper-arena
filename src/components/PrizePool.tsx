import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Trophy, Medal, Award, Crown, Gem, Sparkles } from "lucide-react";

const prizes = [
  { place: "1st", amount: "₹25,000", icon: Crown, color: "from-yellow-400 via-yellow-500 to-yellow-600", glow: "shadow-[0_0_60px_rgba(234,179,8,0.5)]" },
  { place: "2nd", amount: "₹15,000", icon: Medal, color: "from-gray-300 via-gray-400 to-gray-500", glow: "shadow-[0_0_40px_rgba(156,163,175,0.4)]" },
  { place: "3rd", amount: "₹10,000", icon: Award, color: "from-amber-600 via-amber-700 to-amber-800", glow: "shadow-[0_0_40px_rgba(180,83,9,0.4)]" },
];

const additionalPrizes = [
  { place: "4th-5th", amount: "₹5,000", icon: Trophy },
  { place: "6th-10th", amount: "₹2,000", icon: Gem },
  { place: "MVP", amount: "₹3,000", icon: Sparkles },
];

export const PrizePool = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      {/* Hologram grid background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,157,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,157,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>
      
      {/* Gradient orbs */}
      <motion.div 
        style={{ y }}
        className="absolute top-1/4 -left-32 w-96 h-96 bg-cyber-purple/30 rounded-full blur-[120px]"
      />
      <motion.div 
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-cyan/30 rounded-full blur-[120px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div style={{ opacity, scale }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-6"
          >
            <Gem className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">MASSIVE REWARDS</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-4">
            <span className="text-gradient-primary">PRIZE POOL</span>
          </h2>
          <motion.div 
            className="text-6xl md:text-8xl font-black text-foreground relative inline-block"
            animate={{ 
              textShadow: [
                "0 0 20px rgba(0,255,157,0.5)",
                "0 0 40px rgba(0,255,157,0.8)",
                "0 0 20px rgba(0,255,157,0.5)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ₹50,000
            {/* Hologram scanline effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent"
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Top 3 Prizes - Hologram Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {prizes.map((prize, idx) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, y: 50, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className={`relative group ${idx === 0 ? "md:-mt-8" : ""}`}
              style={{ perspective: "1000px" }}
            >
              {/* Hologram border effect */}
              <div className={`absolute -inset-[2px] rounded-2xl bg-gradient-to-r ${prize.color} opacity-50 blur-sm group-hover:opacity-100 transition-opacity`} />
              
              <div className={`relative glass-strong rounded-2xl p-8 text-center overflow-hidden ${prize.glow}`}>
                {/* Hologram scanlines */}
                <div className="absolute inset-0 scan-line opacity-30" />
                
                {/* Floating particles */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${prize.color}`}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.3,
                        repeat: Infinity,
                      }}
                      style={{
                        left: `${20 + i * 15}%`,
                        bottom: "20%",
                      }}
                    />
                  ))}
                </motion.div>

                <motion.div 
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${prize.color} mb-4`}
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <prize.icon className="w-10 h-10 text-background" />
                </motion.div>
                
                <div className={`text-xl font-orbitron font-bold bg-gradient-to-r ${prize.color} bg-clip-text text-transparent mb-2`}>
                  {prize.place} PLACE
                </div>
                
                <div className="text-4xl font-black text-foreground">
                  {prize.amount}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Prizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {additionalPrizes.map((prize, idx) => (
            <motion.div
              key={prize.place}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-xl p-6 text-center border border-border/20 hover:border-primary/50 transition-all"
            >
              <prize.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-sm text-muted-foreground mb-1">{prize.place}</div>
              <div className="text-xl font-bold text-foreground">{prize.amount}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
