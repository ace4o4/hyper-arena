import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [180, 0]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep space gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--cyber-purple) / 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, hsl(var(--neon-cyan) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 10% 60%, hsl(var(--toxic-green) / 0.1) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--void-black)) 100%)
          `,
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        style={{ rotateZ: rotate1 }}
        className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(var(--cyber-purple) / 0.6), transparent 60%)`,
            filter: 'blur(80px)',
          }}
        />
      </motion.div>

      <motion.div
        style={{ rotateZ: rotate2 }}
        className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25"
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: `radial-gradient(circle at 70% 30%, hsl(var(--neon-cyan) / 0.5), transparent 60%)`,
            filter: 'blur(100px)',
          }}
        />
      </motion.div>

      {/* 3D Grid floor effect - Optimized */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-20"
        style={{
          perspective: '500px',
          perspectiveOrigin: '50% 0%',
        }}
      >
        <motion.div
          className="absolute -inset-[100px]"
          style={{
            transform: 'rotateX(60deg)',
            transformOrigin: 'top',
            backgroundImage: `
              linear-gradient(to right, hsl(var(--toxic-green) / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--toxic-green) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
          animate={{
            y: [0, 60],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-line opacity-10" />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.5) 80%, hsl(var(--background) / 0.9) 100%)',
        }}
      />
    </div>
  );
};