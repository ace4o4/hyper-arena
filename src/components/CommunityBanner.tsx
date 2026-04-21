import { motion } from "framer-motion";
import { MessageCircle, ExternalLink, Zap, Users, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CommunityBanner = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent shadow-[0_0_20px_rgba(0,255,157,0.3)]" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyber-purple/5 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative glass-strong border border-primary/20 rounded-[2rem] p-8 md:p-12 overflow-hidden group"
        >
          {/* Animated Glow Border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                <Bell className="w-3 h-3 animate-bounce" />
                Stay Updated
              </div>
              
              <h2 className="text-4xl md:text-5xl font-black leading-tight">
                JOIN THE <span className="text-gradient-primary">ULTIMATE HUB</span> <br />
                FOR INDIAN GAMERS
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-xl">
                Get instant notifications for new tournaments, finding teammates, and exclusive lobby codes. Join 5,000+ elite players in our official WhatsApp community.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <a 
                  href="https://chat.whatsapp.com/J8Pav0GLEXs3gYKeMrcRR4" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    className="w-full sm:w-auto px-8 h-14 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-orbitron font-bold shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-all hover:scale-105"
                  >
                    <MessageCircle className="w-6 h-6 mr-3" />
                    JOIN WHATSAPP COMMUNITY
                  </Button>
                </a>
                
                <div className="flex -space-x-3 items-center">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                       <img src={`https://i.pravatar.cc/40?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="pl-6 text-sm font-rajdhani font-bold text-muted-foreground">
                    <span className="text-white">+5k Members</span> already joined
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visuals */}
            <div className="lg:col-span-5 relative hidden lg:block">
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                 className="relative z-10"
               >
                 <div className="glass p-6 rounded-3xl border border-white/10 shadow-2xl skew-x-[-2deg] rotate-[-2deg]">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 mb-4">
                       <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                          <MessageCircle className="w-6 h-6" />
                       </div>
                       <div>
                          <div className="font-bold text-sm">Hyper Arena Official</div>
                          <div className="text-[10px] text-green-500 flex items-center gap-1 uppercase tracking-tighter"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Community Online</div>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <div className="p-3 bg-white/5 rounded-2xl rounded-tl-none border border-white/5 text-xs text-left max-w-[80%]">
                          Hey elite players! New BGMI Scrims are live now. 🏆
                       </div>
                       <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tr-none text-xs text-right ml-auto max-w-[80%] text-green-400 font-medium">
                          Registration link shared in community! ✅
                       </div>
                    </div>
                 </div>
                 
                 {/* Decorative elements */}
                 <div className="absolute -top-10 -right-10 w-24 h-24 border border-primary/20 clip-diagonal animate-pulse" />
                 <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
