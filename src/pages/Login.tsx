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
import { LogIn, Mail, Lock, ArrowRight, UserPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockApi } from "@/lib/mockApi";

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
            await mockApi.verifyEmail(email);
            // Login user
            const user = await mockApi.login(email, password);

            if (!user.emailVerified && password !== 'google-oauth') {
                toast({
                    title: "Email not verified (Test Mode)",
                    description: "In production, you'd be blocked. Allowing access for development.",
                    variant: "destructive",
                });
                // Note: removed standard logout block so user can test the app
            } else {
                toast({
                    title: "Login Successful",
                    description: "Taking you to the dashboard/registration.",
                });
            }

            navigate("/create-team");
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

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await mockApi.verifyEmail(email);
            // Mock authentication signup
            await mockApi.signup(email, password);

            toast({
                title: "Verification Email Sent!",
                description: "Please check your inbox (and spam folder) and click the link to verify your account.",
            });
            
            // Clear fields so user can login post-verification
            setPassword("");
        } catch (error: any) {
            toast({
                title: "Signup Failed",
                description: error.message || "Could not register account.",
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
                            <h2 className="text-3xl font-black mb-2 text-gradient-primary">Access Arena</h2>
                            <p className="text-muted-foreground">Login or create an account to manage your squad.</p>
                        </div>

                        <Tabs defaultValue="signin" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6 glass">
                                <TabsTrigger value="signin" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold">Sign In</TabsTrigger>
                                <TabsTrigger value="signup" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green font-bold">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* SIGN IN TAB */}
                            <TabsContent value="signin">
                                <form onSubmit={handleLogin} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-signin">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email-signin"
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
                                        <Label htmlFor="password-signin">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="password-signin"
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
                                        {loading ? "Authenticating..." : "Sign In to Dashboard"} <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* SIGN UP TAB */}
                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="email-signup">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="email-signup"
                                                type="email"
                                                placeholder="leader@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                                className="pl-10 glass border-border/30 focus:border-toxic-green"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password-signup">Password</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                                            <Input
                                                id="password-signup"
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="pl-10 glass border-border/30 focus:border-toxic-green"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold"
                                    >
                                        {loading ? "Creating Account..." : "Create New Account"} <UserPlus className="ml-2 h-4 w-4" />
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* COMMON GOOGLE OAUTH */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border/30" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                                </div>
                            </div>

                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full glass hover:bg-primary/10"
                                onClick={async () => {
                                setLoading(true);
                                try {
                                    await mockApi.login("google_user@gmail.com", "google-oauth");
                                } finally {
                                    setLoading(false);
                                }
                                }}
                            >
                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Google Auth
                            </Button>
                        </Tabs>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
