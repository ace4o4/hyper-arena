import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, ArrowRight, Check, Mail, User, Hash, Crown, AlertCircle, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { mockApi } from "@/lib/mockApi";

type Step = "game" | "details" | "success";

interface FormErrors {
  teamName?: string;
  leaderEmail?: string;
  leaderRollNo?: string;
  leaderUID?: string;
}

export default function Registration() {
  const [step, setStep] = useState<Step>("game");
  const [selectedGame, setSelectedGame] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // Team details
  const [teamName, setTeamName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderRollNo, setLeaderRollNo] = useState("");
  const [leaderUID, setLeaderUID] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await mockApi.getCurrentUser();
        if (!user) {
          toast({ title: "Unauthorized", description: "Please log in first", variant: "destructive" });
          navigate("/auth");
        } else {
          setLeaderEmail(user.email);
        }
      } catch (err) {
        toast({ title: "Auth Error", description: "Could not verify session", variant: "destructive" });
        navigate("/auth");
      }
    };
    fetchUser();
  }, [navigate, toast]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (teamName.length < 3) {
      newErrors.teamName = "Team name needs at least 3 characters";
      isValid = false;
    }
    
    if (!leaderRollNo || !/^\d+$/.test(leaderRollNo)) {
      newErrors.leaderRollNo = "Valid numeric Roll No required";
      isValid = false;
    }

    if (!leaderEmail || !/.+\@.+\..+/.test(leaderEmail)) {
      newErrors.leaderEmail = "Valid email required";
      isValid = false;
    }

    if (!leaderUID || !/^\d+$/.test(leaderUID)) {
      newErrors.leaderUID = "UID must be numeric";
      isValid = false;
    } else {
      if (selectedGame === "BGMI" && leaderUID.length > 15) {
        newErrors.leaderUID = "BGMI UID cannot exceed 15 digits";
        isValid = false;
      }
      if (selectedGame === "Free Fire" && leaderUID.length > 12) {
        newErrors.leaderUID = "Free Fire UID cannot exceed 12 digits";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await mockApi.checkTeamNameUnique(teamName);
      
      await mockApi.createTeam({
        teamName,
        game: selectedGame,
        leaderEmail,
        logo: teamLogo,
        leader: {
          roll_no: leaderRollNo,
          uid: leaderUID,
          email: leaderEmail,
        }
      });

      // Cool confetti burst
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);

      setStep("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-neon-red text-xs mt-1 flex items-center gap-1">
        <AlertCircle className="h-3 w-3" /> {message}
      </motion.p>
    );
  };

  return (
    <div className="min-h-screen relative">
      <Background3D />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern flex items-center justify-center min-h-screen">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-4xl">
          
          <Card className="glass p-8 border-border/20 relative">
            <AnimatePresence mode="wait">
              {/* Step 1: Game Selection */}
              {step === "game" && (
                <motion.div key="game" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                  <h2 className="text-3xl font-black mb-2 text-gradient-primary">Select Your Game</h2>
                  <p className="text-muted-foreground mb-8">Choose which game you want to compete in</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {["BGMI", "Free Fire"].map((game) => (
                      <motion.div
                        key={game}
                        whileHover={{ scale: 1.05, y: -8 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedGame(game)}
                        className={`glass rounded-xl p-6 cursor-pointer border-2 transition-all relative ${selectedGame === game
                          ? "border-toxic-green glow-primary bg-toxic-green/10"
                          : "border-border/20 hover:border-toxic-green/50"
                          }`}
                      >
                        <Gamepad2 className="h-12 w-12 text-toxic-green mb-4" />
                        <h3 className="text-xl font-black mb-2">{game}</h3>
                        <p className="text-sm text-muted-foreground">Battle Royale - Squad</p>
                        {selectedGame === game && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-4 right-4 h-6 w-6 rounded-full bg-toxic-green flex items-center justify-center">
                            <Check className="h-4 w-4 text-void-black" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  <Button
                    onClick={() => selectedGame && setStep("details")}
                    disabled={!selectedGame}
                    className="w-full mt-8 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold uppercase tracking-wider"
                    size="lg"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              )}

              {/* Step 2: Details */}
              {step === "details" && (
                <motion.div key="details" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                  <h2 className="text-3xl font-black mb-2 text-gradient-primary">Create Your Team</h2>
                  <p className="text-muted-foreground mb-8">Enter leader details and team name for {selectedGame}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Left Column: Branding */}
                    <div className="space-y-6">
                      <div className="glass rounded-xl p-6 border border-border/20">
                        <Label className="text-foreground mb-4 flex items-center gap-2">
                          <ImageIcon className="h-4 w-4 text-toxic-green" /> Team Logo (Optional)
                        </Label>
                        <div 
                          className="w-full h-48 rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center cursor-pointer hover:border-toxic-green/50 transition-all bg-black/20 relative overflow-hidden group"
                          onClick={() => document.getElementById('logo-upload')?.click()}
                        >
                          {teamLogo ? (
                            <img src={teamLogo} alt="Team Logo" className="w-full h-full object-contain p-2" />
                          ) : (
                            <>
                              <Upload className="h-10 w-10 text-muted-foreground group-hover:text-toxic-green transition-colors mb-2" />
                              <span className="text-xs text-muted-foreground">UPLOAD TEAM EMBLEM</span>
                              <span className="text-[10px] text-muted-foreground/50 mt-1">PNG, JPG recommended</span>
                            </>
                          )}
                          <input 
                            id="logo-upload" 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setTeamLogo(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="glass rounded-xl p-6 border border-border/20">
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          <Hash className="h-4 w-4 text-toxic-green" /> Team Name *
                        </Label>
                        <Input
                          value={teamName}
                          onChange={(e) => {
                            setTeamName(e.target.value);
                            clearFieldError('teamName');
                          }}
                          placeholder="Hyper Gladiators"
                          className={`glass border-border/30 focus:border-toxic-green ${errors.teamName ? 'border-neon-red' : ''}`}
                        />
                        <ErrorMessage message={errors.teamName} />
                      </div>
                    </div>

                    {/* Right Column: Leader Info */}
                    <div className="space-y-6 flex flex-col justify-between">
                      <div className="glass rounded-xl p-6 border border-border/20 h-full">
                        <h3 className="text-lg font-bold text-toxic-green mb-6 flex items-center gap-2">
                          <Crown className="h-5 w-5" /> Leader Information
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-foreground mb-2 flex items-center gap-2">
                              <User className="h-4 w-4" /> Roll No *
                            </Label>
                            <Input
                              value={leaderRollNo}
                              onChange={(e) => {
                                setLeaderRollNo(e.target.value);
                                clearFieldError('leaderRollNo');
                              }}
                              placeholder="Your Roll No"
                              className={`glass border-border/30 focus:border-toxic-green ${errors.leaderRollNo ? 'border-neon-red' : ''}`}
                            />
                            <ErrorMessage message={errors.leaderRollNo} />
                          </div>
                          <div>
                            <Label className="text-foreground mb-2 flex items-center gap-2">
                              <Hash className="h-4 w-4" /> Player UID *
                            </Label>
                            <Input
                              value={leaderUID}
                              onChange={(e) => {
                                setLeaderUID(e.target.value);
                                clearFieldError('leaderUID');
                              }}
                              placeholder={`Game ID (${selectedGame === "BGMI" ? "15" : "12"} digits)`}
                              className={`glass border-border/30 focus:border-toxic-green ${errors.leaderUID ? 'border-neon-red' : ''}`}
                            />
                            <ErrorMessage message={errors.leaderUID} />
                          </div>
                          <div>
                            <Label className="text-foreground mb-2 flex items-center gap-2">
                              <Mail className="h-4 w-4" /> Email Address
                            </Label>
                            <Input
                              value={leaderEmail}
                              disabled
                              className="glass border-border/30 opacity-50 cursor-not-allowed h-10"
                            />
                            <span className="text-[10px] text-muted-foreground mt-1 block">Account verified & linked</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button onClick={() => setStep("game")} variant="outline" className="flex-1 glass border-border/30">Back</Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="flex-1 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold h-12"
                    >
                      {loading ? "INITIALIZING..." : "CONFIRM & CREATE TEAM"} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success Animation */}
              {step === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="h-24 w-24 rounded-full bg-toxic-green/20 border-2 border-toxic-green flex items-center justify-center mx-auto mb-6"
                    style={{
                      boxShadow: "0 0 40px hsl(var(--toxic-green) / 0.5)"
                    }}
                  >
                    <Check className="h-12 w-12 text-toxic-green" />
                  </motion.div>
                  <h2 className="text-4xl font-black mb-4 text-gradient-primary">
                    <span className="text-white">Team </span>
                    <span className="text-toxic-green" style={{ textShadow: "0 0 20px hsl(var(--toxic-green)/0.8)" }}>{teamName}</span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Has successfully been created! Redirecting to Dashboard...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}