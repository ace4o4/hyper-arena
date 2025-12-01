import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  
  // Parallax effects
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void-black/80 via-void-black/60 to-void-black" />
      </motion.div>

      {/* Hexagon Pattern Overlay */}
      <div className="absolute inset-0 hexagon-pattern z-0" />

      {/* Content with Parallax */}
      <motion.div 
        style={{ opacity, scale }}
        className="container mx-auto px-4 z-10 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 animate-glitch"
            animate={{ 
              textShadow: [
                "0.05em 0 0 hsl(var(--neon-cyan)), -0.05em -0.025em 0 hsl(var(--neon-red))",
                "-0.05em -0.025em 0 hsl(var(--neon-cyan)), 0.025em 0.025em 0 hsl(var(--neon-red))",
                "0.025em 0.05em 0 hsl(var(--neon-cyan)), 0.05em 0 0 hsl(var(--neon-red))",
              ]
            }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
          >
            <span className="text-gradient-primary">DOMINATE</span>
            <br />
            <span className="text-foreground">THE ARENA</span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join elite tournaments. Compete for massive prize pools.
            <br />
            <span className="text-toxic-green font-semibold">Win glory.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              onClick={() => navigate("/register")}
              className="bg-toxic-green text-void-black hover:bg-toxic-green/90 font-bold text-lg px-8 py-6 animate-pulse-glow"
            >
              <Zap className="mr-2 h-5 w-5" />
              Enter Tournament
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="glass border-2 hover:bg-white/10 font-bold text-lg px-8 py-6"
            >
              View Dashboard
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {[
              { value: "₹50L+", label: "Prize Pool" },
              { value: "10K+", label: "Active Players" },
              { value: "500+", label: "Daily Matches" },
            ].map((stat, idx) => (
              <div key={idx} className="glass rounded-lg p-6 hover:border-toxic-green/50 transition-all duration-300">
                <div className="text-4xl font-black text-gradient-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase tracking-wider text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Animated Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};
