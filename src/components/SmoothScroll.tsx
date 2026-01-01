import { useEffect } from "react";
import Lenis from "lenis";

const SmoothScroll = () => {
    useEffect(() => {
        // Initialize Lenis with optimized settings for performance
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, // Critical for low-end devices: use native scroll on touch
            touchMultiplier: 2,
        } as any);

        // RAF loop
        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Clean up
        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
};

export default SmoothScroll;
