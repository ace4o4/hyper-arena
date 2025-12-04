import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Users, CreditCard, Trophy, ArrowRight, Check, Phone, Mail, User, Hash, Shield, Crown, UserPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { z } from "zod";

type Step = "game" | "mode" | "details" | "payment" | "success";

// Validation schemas
const playerSchema = z.object({
  ign: z.string().min(2, "IGN must be at least 2 characters").max(30, "IGN must be less than 30 characters"),
  uid: z.string().min(5, "UID must be at least 5 digits").max(20, "UID must be less than 20 digits").regex(/^\d+$/, "UID must contain only numbers"),
  email: z.string().email("Please enter a valid email address"),
});

const teamSchema = z.object({
  teamName: z.string().min(3, "Team name must be at least 3 characters").max(30, "Team name must be less than 30 characters"),
  leaderPhone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number must be less than 15 digits").regex(/^[\d+\s-]+$/, "Invalid phone number format"),
  leaderEmail: z.string().email("Please enter a valid email address"),
  leaderIGN: z.string().min(2, "IGN must be at least 2 characters").max(30, "IGN must be less than 30 characters"),
  leaderUID: z.string().min(5, "UID must be at least 5 digits").max(20, "UID must be less than 20 digits").regex(/^\d+$/, "UID must contain only numbers"),
});

interface PlayerDetails {
  ign: string;
  uid: string;
  email: string;
}

interface FormErrors {
  teamName?: string;
  leaderPhone?: string;
  leaderEmail?: string;
  leaderIGN?: string;
  leaderUID?: string;
  players?: { [key: number]: { ign?: string; uid?: string; email?: string } };
}

export default function Registration() {
  const [step, setStep] = useState<Step>("game");
  const [selectedGame, setSelectedGame] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [errors, setErrors] = useState<FormErrors>({});

  // Team details
  const [teamName, setTeamName] = useState("");
  const [leaderPhone, setLeaderPhone] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [leaderIGN, setLeaderIGN] = useState("");
  const [leaderUID, setLeaderUID] = useState("");
  
  // Team members (4 players + 1 substitute)
  const [players, setPlayers] = useState<PlayerDetails[]>([
    { ign: "", uid: "", email: "" },
    { ign: "", uid: "", email: "" },
    { ign: "", uid: "", email: "" },
    { ign: "", uid: "", email: "" },
  ]);
  const [substitute, setSubstitute] = useState<PlayerDetails>({ ign: "", uid: "", email: "" });

  const updatePlayer = (index: number, field: keyof PlayerDetails, value: string) => {
    const updated = [...players];
    updated[index][field] = value;
    setPlayers(updated);
    
    // Clear error for this field
    if (errors.players?.[index]?.[field]) {
      const newErrors = { ...errors };
      if (newErrors.players?.[index]) {
        delete newErrors.players[index][field];
      }
      setErrors(newErrors);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Validate team details
    const teamResult = teamSchema.safeParse({
      teamName,
      leaderPhone,
      leaderEmail,
      leaderIGN,
      leaderUID,
    });

    if (!teamResult.success) {
      isValid = false;
      teamResult.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormErrors;
        newErrors[field] = err.message;
      });
    }

    // Validate players
    const playerErrors: { [key: number]: { ign?: string; uid?: string; email?: string } } = {};
    players.forEach((player, index) => {
      const playerResult = playerSchema.safeParse(player);
      if (!playerResult.success) {
        isValid = false;
        playerErrors[index] = {};
        playerResult.error.errors.forEach((err) => {
          const field = err.path[0] as keyof PlayerDetails;
          playerErrors[index][field] = err.message;
        });
      }
    });

    if (Object.keys(playerErrors).length > 0) {
      newErrors.players = playerErrors;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form before submitting.",
        variant: "destructive",
      });
      return;
    }

    setStep("success");
    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: "Your squad has been registered. Check your email for QR tickets.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  const clearFieldError = (field: keyof FormErrors) => {
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const playerLabels = ["Player 2", "Player 3", "Player 4", "Player 5"];

  const ErrorMessage = ({ message }: { message?: string }) => {
    if (!message) return null;
    return (
      <motion.p 
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-neon-red text-xs mt-1 flex items-center gap-1"
      >
        <AlertCircle className="h-3 w-3" />
        {message}
      </motion.p>
    );
  };

  return (
    <div className="min-h-screen relative">
      <Background3D />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl"
      >
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between">
          {["game", "mode", "details", "payment"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <motion.div
                animate={{
                  backgroundColor: step === s || ["mode", "details", "payment", "success"].indexOf(step) > ["mode", "details", "payment", "success"].indexOf(s)
                    ? "hsl(var(--toxic-green))"
                    : "hsl(var(--muted))",
                }}
                className="h-10 w-10 rounded-full flex items-center justify-center font-bold border-2"
              >
                {idx + 1}
              </motion.div>
              {idx < 3 && (
                <motion.div
                  className="h-1 w-12 md:w-24 mx-2"
                  animate={{
                    backgroundColor: ["mode", "details", "payment", "success"].indexOf(step) > idx
                      ? "hsl(var(--toxic-green))"
                      : "hsl(var(--muted))",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Card */}
        <Card className="glass p-8 border-border/20">
          <AnimatePresence mode="wait">
            {/* Step 1: Game Selection */}
            {step === "game" && (
              <motion.div
                key="game"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Select Your Game</h2>
                <p className="text-muted-foreground mb-8">Choose which game you want to compete in</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {["BGMI", "Free Fire"].map((game) => (
                    <motion.div
                      key={game}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedGame(game)}
                      className={`glass rounded-xl p-6 cursor-pointer border-2 transition-all relative ${
                        selectedGame === game
                          ? "border-toxic-green glow-primary bg-toxic-green/10"
                          : "border-border/20 hover:border-toxic-green/50"
                      }`}
                    >
                      <Gamepad2 className="h-12 w-12 text-toxic-green mb-4" />
                      <h3 className="text-xl font-black mb-2">{game}</h3>
                      <p className="text-sm text-muted-foreground">Battle Royale - Squad</p>
                      <div className="mt-3 text-xs text-neon-cyan">1 Tournament Active</div>
                      {selectedGame === game && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 h-6 w-6 rounded-full bg-toxic-green flex items-center justify-center"
                        >
                          <Check className="h-4 w-4 text-void-black" />
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Coming Soon */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["PUBG Mobile", "COD Mobile", "Valorant", "Apex Legends"].map((game) => (
                    <div key={game} className="glass rounded-xl p-4 opacity-50 cursor-not-allowed">
                      <Gamepad2 className="h-8 w-8 text-muted-foreground mb-2" />
                      <h4 className="text-sm font-bold">{game}</h4>
                      <span className="text-xs text-neon-red">Coming Soon</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => selectedGame && setStep("mode")}
                  disabled={!selectedGame}
                  className="w-full mt-8 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold uppercase tracking-wider"
                  size="lg"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Mode Selection - Squad Only */}
            {step === "mode" && (
              <motion.div
                key="mode"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Game Mode</h2>
                <p className="text-muted-foreground mb-8">Squad mode - Team Leader registers for the entire team</p>

                <div className="space-y-4">
                  {/* Squad Mode - Active */}
                  <motion.div
                    whileHover={{ scale: 1.02, x: 4 }}
                    className="glass rounded-xl p-6 border-2 border-toxic-green glow-primary bg-toxic-green/10 relative"
                  >
                    <div className="flex items-center gap-4">
                      <Users className="h-10 w-10 text-toxic-green" />
                      <div className="flex-1">
                        <div className="text-xl font-black mb-1 flex items-center gap-2">
                          Squad Mode
                          <span className="text-xs bg-toxic-green text-void-black px-2 py-1 rounded-full">ACTIVE</span>
                        </div>
                        <div className="text-sm text-muted-foreground">4v4 Team battles • Team Leader Registration</div>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-toxic-green flex items-center justify-center">
                        <Check className="h-4 w-4 text-void-black" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Solo Mode - Disabled */}
                  <div className="glass rounded-xl p-6 border-2 border-border/20 opacity-40 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <User className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="text-xl font-black mb-1 flex items-center gap-2">
                          Solo Mode
                          <span className="text-xs bg-neon-red/20 text-neon-red px-2 py-1 rounded-full">DISABLED</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Individual matches not available for this tournament</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 glass rounded-xl border border-neon-cyan/30">
                  <div className="flex items-start gap-3">
                    <Crown className="h-5 w-5 text-neon-cyan mt-0.5" />
                    <div>
                      <h4 className="font-bold text-neon-cyan">Team Leader Registration</h4>
                      <p className="text-sm text-muted-foreground">As team leader, you'll register all 4 players and 1 substitute. QR tickets will be generated for each player.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep("game")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep("details")}
                    className="flex-1 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Player Details with Validation */}
            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="max-h-[70vh] overflow-y-auto pr-2"
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Team Registration</h2>
                <p className="text-muted-foreground mb-8">Enter details for all team members</p>

                {/* Team Info */}
                <div className="glass rounded-xl p-6 mb-6 border border-neon-cyan/30">
                  <h3 className="text-lg font-bold text-neon-cyan mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Team Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground mb-2 block">Team Name *</Label>
                      <Input
                        value={teamName}
                        onChange={(e) => {
                          setTeamName(e.target.value);
                          clearFieldError('teamName');
                        }}
                        placeholder="Enter team name"
                        className={`glass border-border/30 focus:border-toxic-green ${errors.teamName ? 'border-neon-red' : ''}`}
                      />
                      <ErrorMessage message={errors.teamName} />
                    </div>
                  </div>
                </div>

                {/* Leader Details */}
                <div className="glass rounded-xl p-6 mb-6 border border-toxic-green/30">
                  <h3 className="text-lg font-bold text-toxic-green mb-4 flex items-center gap-2">
                    <Crown className="h-5 w-5" /> Team Leader (You)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" /> In-Game Name (IGN) *
                      </Label>
                      <Input
                        value={leaderIGN}
                        onChange={(e) => {
                          setLeaderIGN(e.target.value);
                          clearFieldError('leaderIGN');
                        }}
                        placeholder="Your IGN"
                        className={`glass border-border/30 focus:border-toxic-green ${errors.leaderIGN ? 'border-neon-red' : ''}`}
                      />
                      <ErrorMessage message={errors.leaderIGN} />
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
                        placeholder="Your game UID"
                        className={`glass border-border/30 focus:border-toxic-green ${errors.leaderUID ? 'border-neon-red' : ''}`}
                      />
                      <ErrorMessage message={errors.leaderUID} />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number *
                      </Label>
                      <Input
                        value={leaderPhone}
                        onChange={(e) => {
                          setLeaderPhone(e.target.value);
                          clearFieldError('leaderPhone');
                        }}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className={`glass border-border/30 focus:border-toxic-green ${errors.leaderPhone ? 'border-neon-red' : ''}`}
                      />
                      <ErrorMessage message={errors.leaderPhone} />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address *
                      </Label>
                      <Input
                        value={leaderEmail}
                        onChange={(e) => {
                          setLeaderEmail(e.target.value);
                          clearFieldError('leaderEmail');
                        }}
                        type="email"
                        placeholder="leader@email.com"
                        className={`glass border-border/30 focus:border-toxic-green ${errors.leaderEmail ? 'border-neon-red' : ''}`}
                      />
                      <ErrorMessage message={errors.leaderEmail} />
                    </div>
                  </div>
                </div>

                {/* Team Members */}
                {players.map((player, idx) => (
                  <div key={idx} className="glass rounded-xl p-6 mb-4 border border-cyber-purple/30">
                    <h3 className="text-lg font-bold text-cyber-purple mb-4 flex items-center gap-2">
                      <UserPlus className="h-5 w-5" /> {playerLabels[idx]}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          <User className="h-4 w-4" /> IGN *
                        </Label>
                        <Input
                          value={player.ign}
                          onChange={(e) => updatePlayer(idx, "ign", e.target.value)}
                          placeholder="Player IGN"
                          className={`glass border-border/30 focus:border-cyber-purple ${errors.players?.[idx]?.ign ? 'border-neon-red' : ''}`}
                        />
                        <ErrorMessage message={errors.players?.[idx]?.ign} />
                      </div>
                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          <Hash className="h-4 w-4" /> UID *
                        </Label>
                        <Input
                          value={player.uid}
                          onChange={(e) => updatePlayer(idx, "uid", e.target.value)}
                          placeholder="Player UID"
                          className={`glass border-border/30 focus:border-cyber-purple ${errors.players?.[idx]?.uid ? 'border-neon-red' : ''}`}
                        />
                        <ErrorMessage message={errors.players?.[idx]?.uid} />
                      </div>
                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Email *
                        </Label>
                        <Input
                          value={player.email}
                          onChange={(e) => updatePlayer(idx, "email", e.target.value)}
                          type="email"
                          placeholder="player@email.com"
                          className={`glass border-border/30 focus:border-cyber-purple ${errors.players?.[idx]?.email ? 'border-neon-red' : ''}`}
                        />
                        <ErrorMessage message={errors.players?.[idx]?.email} />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Substitute */}
                <div className="glass rounded-xl p-6 mb-6 border border-neon-red/30">
                  <h3 className="text-lg font-bold text-neon-red mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5" /> Substitute Player (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" /> IGN
                      </Label>
                      <Input
                        value={substitute.ign}
                        onChange={(e) => setSubstitute({ ...substitute, ign: e.target.value })}
                        placeholder="Substitute IGN"
                        className="glass border-border/30 focus:border-neon-red"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Hash className="h-4 w-4" /> UID
                      </Label>
                      <Input
                        value={substitute.uid}
                        onChange={(e) => setSubstitute({ ...substitute, uid: e.target.value })}
                        placeholder="Substitute UID"
                        className="glass border-border/30 focus:border-neon-red"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email
                      </Label>
                      <Input
                        value={substitute.email}
                        onChange={(e) => setSubstitute({ ...substitute, email: e.target.value })}
                        type="email"
                        placeholder="substitute@email.com"
                        className="glass border-border/30 focus:border-neon-red"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep("mode")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => {
                      if (validateForm()) {
                        setStep("payment");
                      } else {
                        toast({
                          title: "Validation Error",
                          description: "Please fix the errors before continuing.",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="flex-1 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Payment */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Payment</h2>
                <p className="text-muted-foreground mb-8">Complete payment to confirm registration</p>

                <div className="glass rounded-xl p-6 mb-6 border border-toxic-green/30">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-lg font-bold">Tournament Entry Fee</div>
                      <div className="text-sm text-muted-foreground">{selectedGame} - Squad Mode</div>
                    </div>
                    <div className="text-3xl font-black text-toxic-green">₹299</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Team: {teamName}</span>
                      <span>{players.length + 1} Players</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Leader: {leaderIGN}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-border/20">
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-4 cursor-pointer border-2 border-toxic-green text-center"
                      >
                        <CreditCard className="h-8 w-8 text-toxic-green mx-auto mb-2" />
                        <div className="font-bold">UPI Payment</div>
                        <div className="text-xs text-muted-foreground">Google Pay, PhonePe, etc.</div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="glass rounded-xl p-4 cursor-pointer border border-border/20 text-center"
                      >
                        <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <div className="font-bold">Screenshot</div>
                        <div className="text-xs text-muted-foreground">Upload payment proof</div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep("details")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="flex-1 bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold"
                  >
                    Complete Registration
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Success */}
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
                >
                  <Check className="h-12 w-12 text-toxic-green" />
                </motion.div>
                <h2 className="text-3xl font-black mb-4 text-gradient-primary">Registration Complete!</h2>
                <p className="text-muted-foreground mb-8">
                  Your squad has been registered for the tournament.
                  <br />Check your email for QR tickets.
                </p>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Trophy className="h-16 w-16 text-toxic-green mx-auto" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
    </div>
  );
}