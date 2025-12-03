import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Menu, 
  X, 
  Trophy, 
  Users, 
  Gamepad2, 
  User,
  LogIn,
  Zap
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/", icon: Zap },
  { name: "Tournaments", href: "#tournaments", icon: Trophy },
  { name: "Leaderboard", href: "#leaderboard", icon: Users },
  { name: "Games", href: "#games", icon: Gamepad2 },
  { name: "Dashboard", href: "/dashboard", icon: User },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass-strong border-b border-border/20 ${
          isScrolled ? "py-2" : "py-4"
        }`}
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: "rgba(5, 5, 5, 0.8)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="relative">
                  <Gamepad2 className="w-8 h-8 text-primary" />
                  <motion.div
                    className="absolute inset-0 bg-primary/50 blur-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span className="font-orbitron font-bold text-xl text-gradient-primary">
                  HYPERGAME
                </span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.href}
                    className={`relative px-4 py-2 rounded-lg font-rajdhani font-medium transition-all duration-300 flex items-center gap-2 group ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.name}</span>
                    
                    {location.pathname === link.href && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 glass rounded-lg border border-primary/30"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    
                    <motion.div
                      className="absolute bottom-0 left-1/2 h-0.5 bg-primary rounded-full"
                      initial={{ width: 0, x: "-50%" }}
                      whileHover={{ width: "80%", x: "-50%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 text-muted-foreground hover:text-foreground font-rajdhani font-medium transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Login
              </motion.button>
              
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 157, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 bg-primary text-primary-foreground font-orbitron font-bold rounded-lg glow-primary flex items-center gap-2"
                >
                  <Trophy className="w-4 h-4" />
                  JOIN NOW
                </motion.button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 pt-20 glass md:hidden"
            style={{
              backdropFilter: "blur(20px)",
              background: "rgba(5, 5, 5, 0.95)",
            }}
          >
            <div className="container mx-auto px-4 py-8">
              <div className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-4 p-4 glass rounded-lg text-foreground font-rajdhani text-lg"
                    >
                      <link.icon className="w-5 h-5 text-primary" />
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navLinks.length * 0.1 }}
                  className="mt-4"
                >
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                    <button className="w-full py-4 bg-primary text-primary-foreground font-orbitron font-bold rounded-lg glow-primary">
                      JOIN TOURNAMENT
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};