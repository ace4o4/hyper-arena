import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep space gradient base */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--cyber-purple) / 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 100%, hsl(var(--neon-cyan) / 0.2) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 10% 60%, hsl(var(--toxic-green) / 0.15) 0%, transparent 50%),
            linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--void-black)) 100%)
          `,
        }}
      />

      {/* Animated gradient orbs with 3D perspective */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        {/* Primary gaming orb */}
        <motion.div
          style={{ 
            rotateZ: rotate1, 
            scale,
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
          className="absolute -top-1/4 -left-1/4 w-[700px] h-[700px] rounded-full opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 2 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `
                radial-gradient(circle at 30% 30%, hsl(var(--cyber-purple) / 0.9), transparent 60%),
                radial-gradient(circle at 70% 70%, hsl(var(--neon-red) / 0.4), transparent 60%)
              `,
              filter: 'blur(80px)',
            }}
          />
        </motion.div>

        {/* Secondary orb - Cyan energy */}
        <motion.div
          style={{ 
            rotateZ: rotate2, 
            scale,
            x: mousePosition.x * -0.3,
            y: mousePosition.y * -0.3,
          }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] rounded-full opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `
                radial-gradient(circle at 70% 30%, hsl(var(--neon-cyan) / 0.8), transparent 60%),
                radial-gradient(circle at 30% 70%, hsl(var(--toxic-green) / 0.5), transparent 60%)
              `,
              filter: 'blur(100px)',
            }}
          />
        </motion.div>

        {/* Central pulsing core */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, hsl(var(--toxic-green) / 0.6), transparent 60%)`,
              filter: 'blur(60px)',
            }}
          />
        </motion.div>

        {/* Floating energy particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${15 + (i % 4) * 20}%`,
              background: i % 3 === 0 
                ? 'hsl(var(--toxic-green))' 
                : i % 3 === 1 
                  ? 'hsl(var(--neon-cyan))'
                  : 'hsl(var(--cyber-purple))',
              boxShadow: `0 0 20px ${i % 3 === 0 
                ? 'hsl(var(--toxic-green))' 
                : i % 3 === 1 
                  ? 'hsl(var(--neon-cyan))'
                  : 'hsl(var(--cyber-purple))'}`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, i % 2 === 0 ? 10 : -10, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 3D Grid floor effect - enhanced */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[60vh] opacity-30"
        style={{
          perspective: '600px',
          perspectiveOrigin: '50% 0%',
        }}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transform: 'rotateX(65deg)',
            transformOrigin: 'top',
            backgroundImage: `
              linear-gradient(to right, hsl(var(--toxic-green) / 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--toxic-green) / 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
          animate={{
            backgroundPosition: ['0px 0px', '0px 80px'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating geometric gaming shapes */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${12 + i * 15}%`,
              top: `${18 + (i % 3) * 28}%`,
            }}
            animate={{
              y: [0, -25, 0],
              rotateZ: [0, 180, 360],
              rotateY: [0, 180, 360],
              opacity: [0.15, 0.3, 0.15],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-10 h-10 md:w-16 md:h-16"
              style={{
                background: i % 3 === 0 
                  ? 'linear-gradient(135deg, hsl(var(--toxic-green) / 0.4), transparent)'
                  : i % 3 === 1
                    ? 'linear-gradient(135deg, hsl(var(--neon-cyan) / 0.4), transparent)'
                    : 'linear-gradient(135deg, hsl(var(--cyber-purple) / 0.4), transparent)',
                clipPath: i % 4 === 0 
                  ? 'polygon(50% 0%, 100% 100%, 0% 100%)' // Triangle
                  : i % 4 === 1 
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
                    : i % 4 === 2
                      ? 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' // Hexagon
                      : 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Square
                boxShadow: `0 0 30px ${i % 3 === 0 
                  ? 'hsl(var(--toxic-green) / 0.3)'
                  : i % 3 === 1
                    ? 'hsl(var(--neon-cyan) / 0.3)'
                    : 'hsl(var(--cyber-purple) / 0.3)'}`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Gaming crosshair elements */}
      <motion.div
        className="absolute top-[20%] right-[15%] w-16 h-16 opacity-20"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-2 border-toxic-green rounded-full" />
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-toxic-green -translate-y-1/2" />
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-toxic-green -translate-x-1/2" />
      </motion.div>

      <motion.div
        className="absolute bottom-[30%] left-[10%] w-12 h-12 opacity-15"
        animate={{ rotate: -360, scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border border-neon-cyan" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
      </motion.div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-line opacity-20" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, hsl(var(--background) / 0.4) 70%, hsl(var(--background) / 0.8) 100%)',
        }}
      />
    </div>
  );
};