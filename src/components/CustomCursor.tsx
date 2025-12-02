import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState("");
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check for interactive elements
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest("[data-cursor]")
      ) {
        setIsHovering(true);
        const cursorData = target.getAttribute("data-cursor") || 
                          target.closest("[data-cursor]")?.getAttribute("data-cursor");
        if (cursorData) {
          setCursorText(cursorData);
        }
      } else {
        setIsHovering(false);
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY]);

  // Hide on mobile/touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      >
        <motion.div
          animate={{
            scale: isClicking ? 0.5 : isHovering ? 1.5 : 1,
          }}
          transition={{ duration: 0.15 }}
          className="relative -translate-x-1/2 -translate-y-1/2"
        >
          {/* Inner dot */}
          <motion.div
            className="w-3 h-3 bg-primary rounded-full"
            animate={{
              scale: isHovering ? 0 : 1,
            }}
          />
          
          {/* Outer ring */}
          <motion.div
            className="absolute -inset-2 border-2 border-primary rounded-full"
            animate={{
              scale: isHovering ? 2.5 : 1,
              opacity: isHovering ? 1 : 0.5,
            }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Glow effect */}
          <motion.div
            className="absolute -inset-4 bg-primary/20 rounded-full blur-md"
            animate={{
              scale: isHovering ? 3 : 1,
              opacity: isHovering ? 0.8 : 0.3,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Cursor text */}
          {cursorText && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute left-6 top-6 text-xs font-orbitron text-primary whitespace-nowrap bg-background/80 px-2 py-1 rounded"
            >
              {cursorText}
            </motion.span>
          )}
        </motion.div>
      </motion.div>

      {/* Trail effect */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          className="w-8 h-8 -translate-x-1/2 -translate-y-1/2 border border-primary/30 rounded-full"
          animate={{
            scale: isHovering ? 2 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </motion.div>

      {/* Hide default cursor globally */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
};
