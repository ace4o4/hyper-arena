import { motion } from "framer-motion";
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
  Shield
} from "lucide-react";

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
  { icon: Twitter, href: "#twitter", label: "Twitter", color: "hover:text-neon-cyan" },
  { icon: Instagram, href: "#instagram", label: "Instagram", color: "hover:text-destructive" },
  { icon: Youtube, href: "#youtube", label: "YouTube", color: "hover:text-destructive" },
  { icon: Twitch, href: "#twitch", label: "Twitch", color: "hover:text-cyber-purple" },
];

const stats = [
  { icon: Trophy, value: "500+", label: "Tournaments" },
  { icon: Users, value: "50K+", label: "Players" },
  { icon: Gamepad2, value: "₹10L+", label: "Prize Pool" },
  { icon: Shield, value: "99.9%", label: "Uptime" },
];

export const Footer = () => {
  return (
    <footer className="relative mt-20 border-t border-border/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyber-purple/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Stats bar */}
      <div className="relative border-b border-border/10">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 justify-center"
              >
                <div className="p-3 rounded-lg glass glow-primary">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-orbitron font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-orbitron font-bold text-gradient-primary mb-4">
              HYPERGAME
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              India's premier esports tournament platform. Compete, conquer, and claim your glory in the ultimate gaming arena.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <motion.a 
                href="mailto:support@hypergame.gg"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 5 }}
              >
                <Mail className="w-5 h-5 group-hover:animate-pulse" />
                <span>support@hypergame.gg</span>
              </motion.a>
              <motion.a 
                href="tel:+919876543210"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group"
                whileHover={{ x: 5 }}
              >
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                <span>+91 98765 43210</span>
              </motion.a>
              <motion.div 
                className="flex items-center gap-3 text-muted-foreground"
                whileHover={{ x: 5 }}
              >
                <MapPin className="w-5 h-5" />
                <span>Mumbai, Maharashtra, India</span>
              </motion.div>
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 glass rounded-lg text-muted-foreground ${social.color} transition-all duration-300 hover:glow-primary`}
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
              <h3 className="font-orbitron font-bold uppercase text-sm tracking-wider mb-4 text-foreground">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors relative group"
                      whileHover={{ x: 5 }}
                    >
                      <span className="absolute -left-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary">›</span>
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
          className="mt-12 p-6 glass rounded-xl border border-primary/20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-orbitron font-bold text-lg mb-2">JOIN THE ELITE</h3>
              <p className="text-muted-foreground">Subscribe for exclusive tournament updates and early access.</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 glass rounded-lg border border-border/20 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-primary text-primary-foreground font-orbitron font-bold rounded-lg glow-primary"
              >
                SUBSCRIBE
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
              Made with <span className="text-destructive animate-pulse">♥</span> for Indian Gamers
            </motion.p>
            <motion.div 
              className="flex items-center gap-4 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                All systems operational
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};
