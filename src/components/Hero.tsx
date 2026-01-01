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

      {/* Animated grid overlay - Optimized with Transform */}
      <div className="absolute inset-0 z-[1] opacity-20 overflow-hidden pointer-events-none">
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

      {/* Content with Parallax */}
      <motion.div
        style={{ y: contentY, opacity, scale }}
        className="container mx-auto px-4 z-10 text-center gpu-accelerated"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* HOLOGRAPHIC HEADLINE */}
          <div className="relative z-20 mb-8 animate-float">
            <motion.h1
              className="text-5xl md:text-7xl lg:text-9xl font-black flex flex-wrap justify-center gap-x-4 md:gap-x-8 gap-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.2
                  }
                }
              }}
            >
              {["DOMINATE", "THE", "ARENA"].map((word, i) => (
                <motion.span
                  key={i}
                  className="relative inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 50, scale: 0.8, filter: "blur(10px)" },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: "blur(0px)",
                      transition: {
                        type: "spring",
                        damping: 12,
                        stiffness: 100
                      }
                    }
                  }}
                >
                  <span
                    className="relative z-10 animate-text-shine"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--toxic-green)) 0%, #fff 50%, hsl(var(--neon-cyan)) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 0 20px hsl(var(--toxic-green) / 0.5))',
                    }}
                  >
                    {word}
                  </span>

                  {/* Holographic duplicate for depth */}
                  <motion.span
                    className="absolute inset-0 z-0 select-none pointer-events-none"
                    style={{
                      color: 'hsl(var(--primary))',
                      filter: 'blur(4px)',
                      opacity: 0.5
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.02, 1],
                      filter: ["blur(4px)", "blur(6px)", "blur(4px)"]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                  >
                    {word}
                  </motion.span>
                </motion.span>
              ))}
            </motion.h1>
          </div>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Join elite tournaments. Compete for massive prize pools.
            <br />
            <span className="text-primary font-bold text-shadow-glow">Win glory.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative"
            >
              <Button
                size="lg"
                onClick={() => navigate("/register")}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-10 py-7 relative overflow-hidden hover-shine"
              >
                <Zap className="mr-2 h-5 w-5" />
                Enter Tournament
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="glass border-2 border-border/50 hover:border-primary/50 hover:bg-primary/10 font-bold text-lg px-10 py-7 transition-all duration-300"
              >
                View Dashboard
              </Button>
            </motion.div>
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
              <motion.div
                key={idx}
                className="glass rounded-xl p-6 hover-lift cursor-default"
                whileHover={{
                  borderColor: "hsl(var(--primary) / 0.5)",
                  boxShadow: "0 0 30px hsl(var(--primary) / 0.2)"
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + idx * 0.1 }}
              >
                <div className="text-4xl font-black text-gradient-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground uppercase tracking-wider text-sm">{stat.label}</div>
              </motion.div>
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