import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Users, CreditCard, Trophy, ArrowRight, Check, Phone, Mail, User, Hash, Shield, Crown, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";

type Step = "game" | "mode" | "details" | "payment" | "success";

interface PlayerDetails {
  ign: string;
  uid: string;
  email: string;
}

export default function Registration() {
  const [step, setStep] = useState<Step>("game");
  const [selectedGame, setSelectedGame] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

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
  };

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: "Your squad has been registered. Check your email for QR tickets.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  const playerLabels = ["Player 2", "Player 3", "Player 4", "Player 5"];
  const playerIcons = [User, User, User, User];

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
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

            {/* Step 3: Player Details */}
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
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Enter team name"
                        className="glass border-border/30 focus:border-toxic-green"
                      />
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
                        onChange={(e) => setLeaderIGN(e.target.value)}
                        placeholder="Your IGN"
                        className="glass border-border/30 focus:border-toxic-green"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Hash className="h-4 w-4" /> Player UID *
                      </Label>
                      <Input
                        value={leaderUID}
                        onChange={(e) => setLeaderUID(e.target.value)}
                        type="number"
                        placeholder="Your game UID"
                        className="glass border-border/30 focus:border-toxic-green"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> Phone Number *
                      </Label>
                      <Input
                        value={leaderPhone}
                        onChange={(e) => setLeaderPhone(e.target.value)}
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        className="glass border-border/30 focus:border-toxic-green"
                      />
                    </div>
                    <div>
                      <Label className="text-foreground mb-2 flex items-center gap-2">
                        <Mail className="h-4 w-4" /> Email Address *
                      </Label>
                      <Input
                        value={leaderEmail}
                        onChange={(e) => setLeaderEmail(e.target.value)}
                        type="email"
                        placeholder="leader@email.com"
                        className="glass border-border/30 focus:border-toxic-green"
                      />
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
                          className="glass border-border/30 focus:border-cyber-purple"
                        />
                      </div>
                      <div>
                        <Label className="text-foreground mb-2 flex items-center gap-2">
                          <Hash className="h-4 w-4" /> UID *
                        </Label>
                        <Input
                          value={player.uid}
                          onChange={(e) => updatePlayer(idx, "uid", e.target.value)}
                          type="number"
                          placeholder="Player UID"
                          className="glass border-border/30 focus:border-cyber-purple"
                        />
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
                          className="glass border-border/30 focus:border-cyber-purple"
                        />
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
                        type="number"
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
                        placeholder="sub@email.com"
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
                    onClick={() => setStep("payment")}
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
                <p className="text-muted-foreground mb-8">Complete your squad entry</p>

                <div className="glass rounded-xl p-6 mb-6 border border-toxic-green/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Entry Fee (per squad)</span>
                    <span className="text-2xl font-black text-toxic-green">₹500</span>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Tournament Prize Pool</span>
                    <span className="text-xl font-bold text-neon-cyan">₹50,000</span>
                  </div>
                  <div className="border-t border-border/30 pt-4">
                    <div className="text-sm text-muted-foreground">
                      <p>• QR Tickets will be sent to all registered email IDs</p>
                      <p>• Team Leader can share tickets from dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-toxic-green hover:bg-toxic-green/90 text-void-black font-bold uppercase tracking-wider"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Pay with UPI
                  </Button>

                  <Button
                    onClick={handleSubmit}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Upload Payment Screenshot
                  </Button>
                </div>

                <Button
                  onClick={() => setStep("details")}
                  variant="ghost"
                  className="w-full mt-4"
                >
                  Back
                </Button>
              </motion.div>
            )}

            {/* Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <motion.div
                  animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  <Trophy className="h-24 w-24 text-toxic-green mx-auto mb-6" />
                </motion.div>
                <h2 className="text-4xl font-black mb-4 text-gradient-primary">Squad Registered!</h2>
                <p className="text-xl text-muted-foreground">QR tickets sent to all players. Good luck!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}