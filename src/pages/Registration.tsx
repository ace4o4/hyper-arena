import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Users, User, CreditCard, Trophy, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CustomCursor } from "@/components/CustomCursor";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";

type Step = "game" | "mode" | "details" | "payment" | "success";

export default function Registration() {
  const [step, setStep] = useState<Step>("game");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMode, setSelectedMode] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => {
      toast({
        title: "Registration Successful!",
        description: "You've been registered for the tournament. Check your email for details.",
      });
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen relative">
      <CustomCursor />
      <ParticleBackground />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl"
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
                      className={`glass rounded-xl p-6 cursor-pointer border-2 transition-all ${
                        selectedGame === game
                          ? "border-toxic-green glow-primary bg-toxic-green/10"
                          : "border-border/20 hover:border-toxic-green/50"
                      }`}
                    >
                      <Gamepad2 className="h-12 w-12 text-toxic-green mb-4" />
                      <h3 className="text-xl font-black mb-2">{game}</h3>
                      <p className="text-sm text-muted-foreground">Battle Royale</p>
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

            {/* Step 2: Mode Selection */}
            {step === "mode" && (
              <motion.div
                key="mode"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Select Game Mode</h2>
                <p className="text-muted-foreground mb-8">Choose your preferred battle mode</p>

                <RadioGroup value={selectedMode} onValueChange={setSelectedMode} className="space-y-4">
                  {[
                    { value: "solo", icon: User, label: "Solo", desc: "1v1 Individual matches" },
                    { value: "squad", icon: Users, label: "Squad", desc: "4v4 Team battles" },
                  ].map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <motion.div
                        key={mode.value}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className={`glass rounded-xl p-6 cursor-pointer border-2 transition-all ${
                          selectedMode === mode.value
                            ? "border-toxic-green glow-primary bg-toxic-green/10"
                            : "border-border/20"
                        }`}
                      >
                        <RadioGroupItem value={mode.value} id={mode.value} className="sr-only" />
                        <Label htmlFor={mode.value} className="flex items-center gap-4 cursor-pointer">
                          <Icon className="h-8 w-8 text-toxic-green" />
                          <div className="flex-1">
                            <div className="text-xl font-black mb-1">{mode.label}</div>
                            <div className="text-sm text-muted-foreground">{mode.desc}</div>
                          </div>
                          {selectedMode === mode.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="h-6 w-6 rounded-full bg-toxic-green flex items-center justify-center"
                            >
                              <Check className="h-4 w-4 text-void-black" />
                            </motion.div>
                          )}
                        </Label>
                      </motion.div>
                    );
                  })}
                </RadioGroup>

                <div className="flex gap-4 mt-8">
                  <Button
                    onClick={() => setStep("game")}
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => selectedMode && setStep("details")}
                    disabled={!selectedMode}
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
              >
                <h2 className="text-3xl font-black mb-2 text-gradient-primary">Player Details</h2>
                <p className="text-muted-foreground mb-8">Enter your in-game information</p>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="uid" className="text-foreground mb-2 block">Player UID *</Label>
                    <Input
                      id="uid"
                      type="number"
                      placeholder="Enter your game UID"
                      className="glass border-border/30 focus:border-toxic-green transition-colors"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ign" className="text-foreground mb-2 block">In-Game Name *</Label>
                    <Input
                      id="ign"
                      placeholder="Your IGN"
                      className="glass border-border/30 focus:border-toxic-green transition-colors"
                    />
                  </div>

                  {selectedMode === "squad" && (
                    <div>
                      <Label htmlFor="team" className="text-foreground mb-2 block">Team Name</Label>
                      <Input
                        id="team"
                        placeholder="Your team name"
                        className="glass border-border/30 focus:border-toxic-green transition-colors"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="discord" className="text-foreground mb-2 block">Discord ID</Label>
                    <Input
                      id="discord"
                      placeholder="username#0000"
                      className="glass border-border/30 focus:border-toxic-green transition-colors"
                    />
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
                <p className="text-muted-foreground mb-8">Complete your tournament entry</p>

                <div className="glass rounded-xl p-6 mb-6 border border-toxic-green/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Entry Fee</span>
                    <span className="text-2xl font-black text-toxic-green">₹100</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Prize Pool</span>
                    <span className="text-xl font-bold text-neon-cyan">₹50,000</span>
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
                <h2 className="text-4xl font-black mb-4 text-gradient-primary">You're In!</h2>
                <p className="text-xl text-muted-foreground">Registration successful. Good luck!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
      </div>
    </div>
  );
}
