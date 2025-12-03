import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const Background3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Animated gradient orbs with 3D perspective */}
      <div className="absolute inset-0" style={{ perspective: '1000px' }}>
        {/* Primary orb */}
        <motion.div
          style={{ rotateZ: rotate1, scale }}
          className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, hsl(277 100% 45% / 0.8), transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </motion.div>

        {/* Secondary orb */}
        <motion.div
          style={{ rotateZ: rotate2, scale }}
          className="absolute -bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle at 70% 70%, hsl(192 100% 42% / 0.8), transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </motion.div>

        {/* Accent orb */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, hsl(158 100% 50% / 0.5), transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>
      </div>

      {/* 3D Grid floor effect */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[50vh] opacity-20"
        style={{
          perspective: '500px',
          perspectiveOrigin: '50% 0%',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: 'rotateX(60deg)',
            transformOrigin: 'top',
            backgroundImage: `
              linear-gradient(to right, hsl(158 100% 50% / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(158 100% 50% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotateZ: [0, 180, 360],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          >
            <div
              className="w-8 h-8 md:w-12 md:h-12"
              style={{
                background: i % 2 === 0 
                  ? 'linear-gradient(135deg, hsl(158 100% 50% / 0.3), transparent)'
                  : 'linear-gradient(135deg, hsl(192 100% 42% / 0.3), transparent)',
                clipPath: i % 3 === 0 
                  ? 'polygon(50% 0%, 100% 100%, 0% 100%)' // Triangle
                  : i % 3 === 1 
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' // Diamond
                    : 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', // Hexagon
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Scan lines overlay */}
      <div className="absolute inset-0 scan-line opacity-30" />
      
      {/* Noise texture */}
      <div className="absolute inset-0 noise-overlay" />
    </div>
  );
};
