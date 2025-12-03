import { motion, useScroll, useTransform } from "framer-motion";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Twitter, 
  Instagram, 
  Youtube, 
  Twitch,
  Gamepad2,
  Trophy,
  Users,
  Shield,
  ExternalLink,
  Send
} from "lucide-react";
import { useRef, useState } from "react";

const footerLinks = {
  platform: [
    { name: "Tournaments", href: "#tournaments" },
    { name: "Leaderboards", href: "#leaderboards" },
    { name: "Prize Pools", href: "#prizes" },
    { name: "Live Matches", href: "#live" },
  ],
  games: [
    { name: "BGMI", href: "#bgmi" },
    { name: "Free Fire", href: "#freefire" },
    { name: "Call of Duty Mobile", href: "#codm" },
    { name: "Valorant Mobile", href: "#valorant" },
  ],
  support: [
    { name: "Help Center", href: "#help" },
    { name: "Contact Us", href: "#contact" },
    { name: "FAQs", href: "#faqs" },
    { name: "Discord Server", href: "#discord" },
  ],
  legal: [
    { name: "Terms of Service", href: "#terms" },
    { name: "Privacy Policy", href: "#privacy" },
    { name: "Refund Policy", href: "#refund" },
    { name: "Fair Play Rules", href: "#rules" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#twitter", label: "Twitter", color: "hover:text-accent hover:shadow-[0_0_20px_hsl(var(--accent)/0.5)]" },
  { icon: Instagram, href: "#instagram", label: "Instagram", color: "hover:text-destructive hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)]" },
  { icon: Youtube, href: "#youtube", label: "YouTube", color: "hover:text-destructive hover:shadow-[0_0_20px_hsl(var(--destructive)/0.5)]" },
  { icon: Twitch, href: "#twitch", label: "Twitch", color: "hover:text-cyber-purple hover:shadow-[0_0_20px_hsl(var(--cyber-purple)/0.5)]" },
];

const stats = [
  { icon: Trophy, value: "500+", label: "Tournaments" },
  { icon: Users, value: "50K+", label: "Players" },
  { icon: Gamepad2, value: "₹10L+", label: "Prize Pool" },
  { icon: Shield, value: "99.9%", label: "Uptime" },
];

export const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3], [50, 0]);

  return (
    <footer ref={footerRef} className="relative mt-20 border-t border-border/10">
      {/* 3D Grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute bottom-0 left-0 right-0 h-[400px] opacity-10"
          style={{
            perspective: '500px',
            perspectiveOrigin: '50% 100%',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: 'rotateX(60deg)',
              transformOrigin: 'bottom',
              backgroundImage: `
                linear-gradient(to right, hsl(var(--primary) / 0.5) 1px, transparent 1px),
                linear-gradient(to top, hsl(var(--primary) / 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-purple/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Stats bar */}
      <motion.div 
        style={{ opacity, y }}
        className="relative border-b border-border/10"
      >
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-4 justify-center p-4 rounded-xl glass hover:border-primary/30 transition-all duration-300 cursor-default"
              >
                <motion.div 
                  className="p-3 rounded-lg bg-primary/10 border border-primary/20"
                  whileHover={{ rotate: 10 }}
                >
                  <stat.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <p className="text-2xl font-orbitron font-bold text-gradient-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-3xl font-orbitron font-bold text-gradient-primary mb-4"
              whileHover={{ scale: 1.02 }}
            >
              HYPERGAME
            </motion.h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              India's premier esports tournament platform. Compete, conquer, and claim your glory in the ultimate gaming arena.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <motion.a 
                href="mailto:support@hypergame.gg"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all group glass rounded-lg p-3"
                whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.2)" }}
              >
                <Mail className="w-5 h-5 text-primary" />
                <span>support@hypergame.gg</span>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
              <motion.a 
                href="tel:+919876543210"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-all group glass rounded-lg p-3"
                whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.2)" }}
              >
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 98765 43210</span>
                <ExternalLink className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.a>
              <motion.div 
                className="flex items-center gap-3 text-muted-foreground glass rounded-lg p-3"
                whileHover={{ x: 5, backgroundColor: "hsl(var(--muted) / 0.2)" }}
              >
                <MapPin className="w-5 h-5 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </motion.div>
            </div>

            {/* Social links */}
            <div className="flex gap-3 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 glass rounded-xl text-muted-foreground ${social.color} transition-all duration-300`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links sections */}
          {Object.entries(footerLinks).map(([title, links], sectionIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
            >
              <h3 className="font-orbitron font-bold uppercase text-sm tracking-wider mb-4 text-foreground flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors relative group flex items-center gap-2"
                      whileHover={{ x: 8 }}
                    >
                      <span className="w-0 group-hover:w-4 h-px bg-primary transition-all duration-300" />
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter section */}
        <motion.div 
          className="mt-12 p-8 glass-strong rounded-2xl border border-primary/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-cyber-purple/5"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{ backgroundSize: '200% 200%' }}
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-orbitron font-bold text-xl mb-2 text-gradient-primary">JOIN THE ELITE</h3>
              <p className="text-muted-foreground">Subscribe for exclusive tournament updates and early access.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-5 py-4 glass rounded-xl border border-border/20 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-primary text-primary-foreground font-orbitron font-bold rounded-xl relative overflow-hidden group hover-shine"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">SUBSCRIBE</span>
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p 
              className="text-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              © {new Date().getFullYear()} HyperGame Esports. All rights reserved.
            </motion.p>
            <motion.p 
              className="text-muted-foreground text-sm flex items-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Made with <motion.span 
                className="text-destructive"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >♥</motion.span> for Indian Gamers
            </motion.p>
            <motion.div 
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-2 glass px-3 py-1 rounded-full">
                <motion.span 
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                All systems operational
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};
