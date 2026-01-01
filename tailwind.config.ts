import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'cyber-purple': 'hsl(var(--cyber-purple))',
        'neon-cyan': 'hsl(var(--neon-cyan))',
        'toxic-green': 'hsl(var(--toxic-green))',
        'neon-red': 'hsl(var(--neon-red))',
        'void-black': 'hsl(var(--void-black))',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px hsl(var(--toxic-green) / 0.5)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 40px hsl(var(--toxic-green) / 0.8)",
          },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "glitch": {
          "0%, 100%": {
            textShadow: "0.05em 0 0 hsl(var(--neon-cyan)), -0.05em -0.025em 0 hsl(var(--neon-red))",
          },
          "25%": {
            textShadow: "-0.05em -0.025em 0 hsl(var(--neon-cyan)), 0.025em 0.025em 0 hsl(var(--neon-red))",
          },
          "50%": {
            textShadow: "0.025em 0.05em 0 hsl(var(--neon-cyan)), 0.05em 0 0 hsl(var(--neon-red))",
          },
          "75%": {
            textShadow: "-0.025em 0 0 hsl(var(--neon-cyan)), -0.05em -0.05em 0 hsl(var(--neon-red))",
          },
        },
        "float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },

        "border-flow": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
        "tilt": {
          "0%, 100%": {
            transform: "rotateY(0deg) rotateX(0deg)",
          },
          "25%": {
            transform: "rotateY(2deg) rotateX(2deg)",
          },
          "75%": {
            transform: "rotateY(-2deg) rotateX(-2deg)",
          },
        },
        "scale-in": {
          "0%": {
            opacity: "0",
            transform: "scale(0.9)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.5s ease-out",
        "glitch": "glitch 1s linear infinite",
        "float": "float 3s ease-in-out infinite",

        "border-flow": "border-flow 3s ease infinite",
        "tilt": "tilt 10s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
