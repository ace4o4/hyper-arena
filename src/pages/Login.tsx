import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Mock authentication - accept any credentials
            await new Promise(resolve => setTimeout(resolve, 500));

            toast({
                title: "Welcome Back!",
                description: "Successfully logged in.",
            });
            navigate("/dashboard");
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error.message || "Invalid credentials.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative">
            <Background3D />
            <Navbar />
            <div className="pt-24 pb-12 px-4 hexagon-pattern flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="glass p-8 border-border/20">
                        <div className="text-center mb-8">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="h-16 w-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center mx-auto mb-4"
                            >
                                <LogIn className="h-8 w-8 text-primary" />
                            </motion.div>
                            <h2 className="text-3xl font-black mb-2 text-gradient-primary">Welcome Back</h2>
                            <p className="text-muted-foreground">Login to manage your team and tournament details.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="leader@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 glass border-border/30 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 glass border-border/30 focus:border-primary"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                            >
                                {loading ? "Logging in..." : "Login"} <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">Don't have a team yet? </span>
                            <Link to="/register" className="text-primary hover:underline font-bold">
                                Register here
                            </Link>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
