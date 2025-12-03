import { useEffect, useState } from "react";

export const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    let rafId: number;
    
    const updatePosition = (e: MouseEvent) => {
      // Use RAF for smooth updates without lag
      rafId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest("[role='button']");
      setIsHovering(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener("mousemove", updatePosition, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Hide on touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor - static gradient */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div 
          className={`rounded-full transition-transform duration-100 ${
            isClicking ? 'scale-75' : isHovering ? 'scale-150' : 'scale-100'
          }`}
          style={{
            width: isHovering ? '40px' : '16px',
            height: isHovering ? '40px' : '16px',
            background: isHovering 
              ? 'transparent'
              : 'linear-gradient(135deg, hsl(158 100% 50%) 0%, hsl(192 100% 42%) 50%, hsl(277 100% 45%) 100%)',
            border: isHovering ? '2px solid hsl(158 100% 50%)' : 'none',
            boxShadow: isHovering 
              ? '0 0 20px hsl(158 100% 50% / 0.5), inset 0 0 20px hsl(158 100% 50% / 0.1)'
              : '0 0 10px hsl(158 100% 50% / 0.6)',
          }}
        />
      </div>
      
      {/* Cursor trail dot */}
      <div
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -50%)',
          width: '4px',
          height: '4px',
          background: 'hsl(158 100% 50%)',
          opacity: isHovering ? 0 : 0.8,
          transition: 'opacity 0.15s',
        }}
      />
      
      <style>{`
        @media (hover: hover) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
};
