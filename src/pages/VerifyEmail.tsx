import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function VerifyEmail() {
    return (
        <div className="min-h-screen relative flex flex-col">
            <Background3D />
            <Navbar />
            
            <div className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-lg"
                >
                    <Card className="glass p-8 md:p-12 border-primary/30 text-center relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
                        
                        <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
                            className="w-24 h-24 mx-auto bg-primary/20 rounded-full border-4 border-primary flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,255,157,0.3)] relative z-10"
                        >
                            <ShieldCheck className="w-12 h-12 text-primary" />
                        </motion.div>
                        
                        <h1 className="text-3xl md:text-5xl font-black text-gradient-primary mb-4 relative z-10 tracking-tight">VERIFIED</h1>
                        
                        <div className="space-y-4 mb-10 relative z-10">
                            <p className="text-lg text-white/90">
                                Identity confirmed. Welcome to the grid.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Your email address has been successfully authenticated. You now have full clearance to assemble your squad and enter the tournaments.
                            </p>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="relative z-10"
                        >
                            <Link to="/dashboard">
                                <Button className="w-full bg-primary text-black hover:bg-primary/80 font-orbitron font-bold tracking-wider py-6 text-lg glow-primary group">
                                    ACCESS DASHBOARD
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </Card>
                </motion.div>
            </div>
            
            <Footer />
        </div>
    );
}
