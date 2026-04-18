import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap, ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export const Hero = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
      {/* Multi-layer Parallax Background with blur */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 z-0 gpu-accelerated"
      >
        <div
          className="absolute inset-0 scale-110"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(2px)', // Reduced blur for performance
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 via-transparent to-neon-cyan/20" />
        {/* Enhanced blur overlay for visibility */}
        <div className="absolute inset-0 backdrop-blur-[1px]" />
      </motion.div>

      {/* Animated grid overlay - Hidden on mobile to prevent layout thrashing */}
      <div className="hidden md:block absolute inset-0 z-[1] opacity-20 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -inset-[100px]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
          animate={{
            x: [0, 80],
            y: [0, 80],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      <div className="absolute inset-0 hexagon-pattern z-[2]" />

      {/* Content with Parallax — Asymmetrical Layout */}
      <motion.div
        style={{ y: contentY, opacity, scale }}
        className="container mx-auto px-4 z-10 gpu-accelerated grid grid-cols-1 lg:grid-cols-12 items-center gap-8"
      >
        {/* Left Side — Abstract Structural "Mech" or Graphic */}
        <div className="hidden lg:block lg:col-span-5 relative h-[600px]">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 clip-diagonal bg-gradient-to-tr from-transparent via-cyan-500/10 to-primary/30 border-l border-primary/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute top-10 right-10 bottom-10 left-0 clip-panel bg-[url('/hero-bg.jpg')] bg-cover bg-center mix-blend-luminosity opacity-50"
          />
          {/* Data Lines decorative */}
          <div className="absolute bottom-20 right-0 w-64 h-[1px] bg-primary hud-line" />
          <div className="absolute top-20 right-10 w-32 h-[1px] bg-accent hud-line opacity-50" />
        </div>

        {/* Right Side — High Contrast Angular Data Panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 clip-panel glass-strong p-8 md:p-12 relative bg-background/80 border-l-[4px] border-primary"
        >
          {/* Top Panel Decor */}
          <div className="absolute top-0 right-0 w-32 h-2 bg-primary clip-diagonal" />
          <div className="absolute -left-1 top-10 bottom-10 w-1 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-50" />

          {/* HOLOGRAPHIC HEADLINE */}
          <div className="relative z-20 mb-6 text-left">
            <span className="text-xs uppercase tracking-widest text-primary font-bold mb-2 block">
              // SYS.ONLINE :: ARENA.READY
            </span>
            <motion.h1
              className="text-5xl md:text-7xl font-black flex flex-wrap gap-x-4 gap-y-2 leading-none"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 }
                }
              }}
            >
              {["DOMINATE", "THE", "ARENA"].map((word, i) => (
                <motion.span
                  key={i}
                  className="relative inline-block"
                  variants={{
                    hidden: { opacity: 0, x: 20 },
                    visible: {
                      opacity: 1, x: 0,
                      transition: { type: "spring", damping: 15, stiffness: 100 }
                    }
                  }}
                >
                  <span
                    className="relative z-10 animate-text-shine"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--toxic-green)) 0%, #fff 50%, hsl(var(--neon-cyan)) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {word}
                  </span>
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-8 text-left font-medium max-w-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join elite tournaments. Compete for massive prize pools. Connect with the best players globally.
            <br />
            <span className="text-primary font-bold text-shadow-glow mt-2 block">Win glory.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              size="lg"
              onClick={() => navigate("/tournaments")}
              className="btn-cyber bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-10 py-7 relative overflow-hidden"
            >
              <Zap className="mr-2 h-5 w-5" />
              Enter Tournament
            </Button>

            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              variant="outline"
              className="btn-cyber glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/10 font-bold text-lg px-10 py-7"
            >
              View Dashboard
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-6"
          >
            {[
              { value: "₹50L+", label: "Prize Pool" },
              { value: "10K+", label: "Players" },
              { value: "500+", label: "Matches" },
            ].map((stat, idx) => (
              <div key={idx} className="text-left relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-primary/50">
                <div className="text-2xl md:text-3xl font-black text-gradient-primary leading-none">{stat.value}</div>
                <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};