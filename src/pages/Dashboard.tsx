import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { LogOut, Trophy, Crown, Shield, Users, ArrowRight, Gamepad2, AlertCircle, Plus, Check, Edit2, AlertTriangle, X, Upload, Image as ImageIcon, Trash2, Copy, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { mockApi } from "@/lib/mockApi";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState<"code" | "link" | null>(null);

  // Management State
  const [newPlayer, setNewPlayer] = useState({ roll_no: "", email: "", uid: "" });
  const [players, setPlayers] = useState<any[]>([]);
  const [substitute, setSubstitute] = useState<any>(null);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [activeFormSlot, setActiveFormSlot] = useState<number | null>(null);

  // Edit / Confirm State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamInfo, setEditTeamInfo] = useState({ teamName: "", game: "", uid: "", roll_no: "" });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const user = await mockApi.getCurrentUser();
        if (!user) {
          navigate("/auth");
          return;
        }
        setCurrentUserId(user.uid);

        const team = await mockApi.getTeamByLeader(user.email ?? "");
        if (team) {
          setTeamData(team);
          if (team.players) setPlayers(team.players);
          if (team.substitute) setSubstitute(team.substitute);
        }
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [navigate]);

  const handleLogout = () => {
    mockApi.logout();
    navigate("/auth");
  };

  const handleAddPlayer = (isSub: boolean) => {
    const { roll_no, email, uid } = newPlayer;
    
    // 1. All fields required
    if (!roll_no || !email || !uid) {
      toast({ title: "Validation Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    // 2. Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    // 3. Roll Number validation (numeric)
    if (!/^\d+$/.test(roll_no)) {
      toast({ title: "Invalid Roll No", description: "Roll Number must be numeric.", variant: "destructive" });
      return;
    }

    // 4. UID validation (numeric and game-specific length)
    if (!/^\d+$/.test(uid)) {
      toast({ title: "Invalid UID", description: "Game UID must be numeric.", variant: "destructive" });
      return;
    }

    const game = teamData?.game;
    if (game === "BGMI" && uid.length > 15) {
      toast({ title: "UID Too Long", description: "BGMI UID cannot exceed 15 digits.", variant: "destructive" });
      return;
    }
    if (game === "Free Fire" && uid.length > 12) {
      toast({ title: "UID Too Long", description: "Free Fire UID cannot exceed 12 digits.", variant: "destructive" });
      return;
    }
    
    if (isSub) {
       setSubstitute(newPlayer);
       toast({ title: "Substitute Saved" });
    } else {
       const newPlayers = [...players];
       if (activeFormSlot !== null && activeFormSlot < newPlayers.length) {
         newPlayers[activeFormSlot] = newPlayer;
         toast({ title: `Player ${activeFormSlot + 2} Updated` });
       } else {
         newPlayers.push(newPlayer);
         toast({ title: `Player ${newPlayers.length + 1} Added` });
       }
       setPlayers(newPlayers);
    }
    
    setNewPlayer({ roll_no: "", email: "", uid: "" });
    setActiveFormSlot(null);
  };

  const handleSubmitPlayers = async () => {
    setShowConfirmModal(false);
    setLoading(true);
    try {
      const updated = await mockApi.updateTeamPlayers(teamData.id, players, substitute);
      setTeamData(updated);
      toast({ title: "Players Submitted", description: "Proceed to payment" });
    } catch(err:any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };
  const handleSaveTeamEdit = async () => {
    try {
      const leaderPayload = { ...teamData.leader, uid: editTeamInfo.uid, roll_no: editTeamInfo.roll_no };
      const updated = await mockApi.updateTeamInfo(teamData.id, { teamName: editTeamInfo.teamName, game: editTeamInfo.game, leader: leaderPayload });
      setTeamData(updated);
      setIsEditingTeam(false);
      toast({ title: "Team Details Updated" });
    } catch(err:any) {
      toast({ title: "Update Error", description: err.message, variant: "destructive" });
    }
  };
  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const updated = await mockApi.confirmPayment(teamData.id);
      setTeamData(updated);
      setShowSuccessAnim(true);
      
      // Intense celebration confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999
      };

      function fire(particleRatio: number, opts: any) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });

      setTimeout(() => setShowSuccessAnim(false), 4000);
      toast({ title: "Payment Successful", description: "You are fully registered!" });
    } catch(err:any) {
       toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setIsProcessingPayment(false);
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Logo = reader.result as string;
      try {
        const updated = await mockApi.updateTeamInfo(teamData.id, { logo: base64Logo });
        setTeamData(updated);
        toast({ title: "Logo Updated", description: "Team emblem has been saved." });
      } catch (err: any) {
        toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = async () => {
    try {
      const updated = await mockApi.updateTeamInfo(teamData.id, { logo: null });
      setTeamData(updated);
      toast({ title: "Logo Removed", description: "Reverted to default emblem." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const inviteCode = teamData?.inviteCode || "";
  const inviteLink = (() => {
    if (!inviteCode) return "";
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const params = new URLSearchParams({
      mode: "join",
      inviteCode,
    });

    if (teamData?.tournamentId) params.set("tournamentId", teamData.tournamentId);
    if (teamData?.game) params.set("game", teamData.game);

    return `${origin}/create-team?${params.toString()}`;
  })();

  const copyInviteValue = async (type: "code" | "link", value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedState(type);
      toast({
        title: type === "code" ? "Invite Code Copied" : "Invite Link Copied",
        description: type === "code" ? "Share this code with your teammates." : "Share this link with your teammates.",
      });
      setTimeout(() => setCopiedState(null), 1500);
    } catch {
      toast({ title: "Copy Failed", description: "Could not copy to clipboard.", variant: "destructive" });
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-toxic-green">Loading Dashboard...</div>;

  if (!teamData) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl mb-4">You don't have a team yet.</h2>
      <Button onClick={() => navigate("/tournaments")}>Go To Tournaments</Button>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern min-h-[90vh]">
        <div className="container mx-auto max-w-7xl">
          
          <AnimatePresence>
            {showSuccessAnim && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
                >
                    <div className="text-center w-full max-w-lg">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-toxic-green/20 border-4 border-toxic-green flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <Check className="h-12 w-12 sm:h-16 sm:w-16 text-toxic-green animate-bounce" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-toxic-green mb-2 sm:mb-4 break-words" style={{ textShadow: "0 0 30px hsl(var(--toxic-green))" }}>CONGRATULATIONS!</h2>
                        <p className="text-base sm:text-lg md:text-2xl text-white px-2">Your squad is officially registered for the tournament.</p>
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showConfirmModal && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
                >
                   <div className="glass max-w-md w-full p-6 rounded-xl border border-neon-red/30 relative">
                       <div className="flex items-center gap-3 mb-4 text-neon-red">
                          <AlertTriangle className="h-8 w-8" />
                          <h3 className="text-xl font-bold">Confirm Roster</h3>
                       </div>
                       <p className="text-white/80 mb-6">
                          Please ensure all details are correct. You will <b className="text-neon-red">NOT</b> be able to edit team or player details after this step. Proceed to payment?
                       </p>
                       <div className="flex justify-end gap-3 flex-col sm:flex-row">
                          <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>Cancel & Review</Button>
                          <Button className="bg-neon-red text-white hover:bg-neon-red/80" onClick={handleSubmitPlayers}>Yes, Proceed to Payment</Button>
                       </div>
                   </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gradient-primary leading-tight">Player Dashboard</h1>
            <Button onClick={handleLogout} variant="destructive" size="sm" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 mb-8 border border-toxic-green/30">
            {isEditingTeam ? (
              <div className="space-y-4">
                 <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-neon-cyan">Edit Team Details</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingTeam(false)}><X className="h-4 w-4"/></Button>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Team Name</Label>
                      <Input value={editTeamInfo.teamName} onChange={e=>setEditTeamInfo({...editTeamInfo, teamName: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Game</Label>
                      <select value={editTeamInfo.game} onChange={e=>setEditTeamInfo({...editTeamInfo, game: e.target.value})} className="flex h-9 w-full rounded-md border border-border/30 bg-background/50 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="BGMI">BGMI</option>
                        <option value="Free Fire">Free Fire</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Leader UID</Label>
                      <Input value={editTeamInfo.uid} onChange={e=>setEditTeamInfo({...editTeamInfo, uid: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Leader Roll No</Label>
                      <Input value={editTeamInfo.roll_no} onChange={e=>setEditTeamInfo({...editTeamInfo, roll_no: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                    </div>
                 </div>
                      <div className="flex justify-end mt-4 gap-2">
                         {teamData.logo && (
                           <Button variant="outline" size="sm" onClick={handleRemoveLogo} className="border-neon-red text-neon-red hover:bg-neon-red/10">
                             <Trash2 className="h-4 w-4 mr-2" /> Remove Logo
                           </Button>
                         )}
                         <Button onClick={handleSaveTeamEdit} className="bg-toxic-green text-black hover:bg-toxic-green/80">Save Changes</Button>
                      </div>
              </div>
            ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl bg-toxic-green/20 border border-toxic-green/30 flex items-center justify-center relative group cursor-pointer overflow-hidden"
                  onClick={() => document.getElementById('dash-logo-upload')?.click()}
                >
                  {teamData.logo ? (
                    <img src={teamData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="h-8 w-8 text-toxic-green" />
                  )}
                  
                  {/* Badge Indicator */}
                  <div className="absolute bottom-0 right-0 bg-toxic-green p-1 rounded-tl-lg shadow-[0_0_10px_rgba(var(--toxic-green),0.5)]">
                    <Upload className="h-2 w-2 text-void-black" />
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Upload className="h-5 w-5 text-toxic-green mb-1" />
                    <span className="text-[8px] text-white font-bold uppercase">Update Logo</span>
                  </div>
                  <input 
                    id="dash-logo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gradient-primary flex items-center gap-2">
                      {teamData.teamName}
                      {teamData.status === 'pending_players' && (
                          <button onClick={() => {
                             setEditTeamInfo({teamName: teamData.teamName, game: teamData.game, uid: teamData.leader.uid, roll_no: teamData.leader.roll_no});
                             setIsEditingTeam(true);
                          }} className="text-neon-cyan hover:text-white transition-colors">
                              <Edit2 className="h-4 w-4" />
                          </button>
                      )}
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" /> {teamData.game} | Leader: {teamData.leader.uid}
                  </p>
                </div>
              </div>
              <div>
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${teamData.status === 'confirmed' ? 'bg-toxic-green text-black' : 'bg-neon-red/20 text-neon-red'}`}>
                  {teamData.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>
            )}
          </motion.div>

          {inviteCode && currentUserId === teamData.user_id && teamData.status === "pending_players" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6 mb-8 border border-neon-cyan/40"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-neon-cyan mb-1">Invite Teammates</h3>
                  <p className="text-sm text-muted-foreground">Share invite code/link so teammates can fill their own details and join your roster.</p>
                </div>
                <div className="text-xs uppercase tracking-widest text-primary">Step 1: Build Roster</div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-border/40 bg-background/40 p-4">
                  <Label className="text-xs text-muted-foreground">Invite Code</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input value={inviteCode} readOnly className="font-mono tracking-[0.2em] uppercase" />
                    <Button size="icon" variant="outline" onClick={() => copyInviteValue("code", inviteCode)}>
                      {copiedState === "code" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-border/40 bg-background/40 p-4">
                  <Label className="text-xs text-muted-foreground">Invite Link</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input value={inviteLink} readOnly className="text-xs" />
                    <Button size="icon" variant="outline" onClick={() => copyInviteValue("link", inviteLink)}>
                      {copiedState === "link" ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending Players State */}
          {teamData.status === 'pending_players' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="glass p-6 rounded-xl border border-neon-cyan/50 mb-8">
                 <h3 className="text-2xl font-black mb-2 text-neon-cyan">Assemble Your Squad</h3>
                 <p className="text-muted-foreground flex items-center gap-2 mb-6"><AlertCircle className="h-4 w-4"/> Add minimum 3 players to proceed.</p>
                 
                 <div className="space-y-4 max-w-2xl mx-auto">
                        <div className="glass p-4 rounded-xl border border-toxic-green/30 flex justify-between items-center bg-toxic-green/5">
                            <div className="flex items-center"><Crown className="w-5 h-5 mr-3 text-toxic-green"/> <span className="font-bold">Leader (You)</span></div>
                            <Check className="text-toxic-green w-5 h-5"/>
                        </div>
                        
                        {[0,1,2].map((i) => {
                           const p = players[i];
                           const isNextEmpty = players.length === i;
                           const isOpen = activeFormSlot === i;
                           
                           return (
                             <div key={i} className={`glass p-4 rounded-xl border transition-all ${p ? 'border-cyber-purple/50 bg-cyber-purple/5' : isOpen ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'border-border/30 opacity-70'}`}>
                               <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
                                   <div className="flex items-center"><Users className={`w-5 h-5 mr-3 ${p ? 'text-cyber-purple' : 'text-muted-foreground'}`}/> 
                                      <span className="font-bold whitespace-nowrap">Player {i+2} <span className="text-neon-red">*</span></span>
                                   </div>
                                   {p ? (
                                       <div className="text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded text-left sm:text-right break-all flex items-center justify-between sm:justify-end gap-3 flex-1 sm:flex-none">
                                           <span>Roll No: {p.roll_no} | UID: {p.uid}</span>
                                           {!isOpen && teamData.status === 'pending_players' && (
                                              <button onClick={() => { setNewPlayer(p); setActiveFormSlot(i); }} className="text-neon-cyan hover:text-white transition-colors p-1 bg-neon-cyan/10 rounded"><Edit2 className="h-3 w-3" /></button>
                                           )}
                                       </div>
                                   ) : (
                                       !isOpen && isNextEmpty ? (
                                           <Button size="sm" variant="outline" className="text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10 border-neon-cyan/50" onClick={() => setActiveFormSlot(i)}>
                                               <Plus className="w-4 h-4 mr-1"/> Add
                                           </Button>
                                       ) : !isOpen ? (
                                           <span className="text-xs text-muted-foreground hidden sm:block">Waiting for Player {i+1}</span>
                                       ) : null
                                   )}
                               </div>
                               
                               {/* Form Dropdown */}
                               <AnimatePresence>
                               {isOpen && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                   <div className="pt-4 mt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">UID (Game ID)</Label>
                                            <Input placeholder="Enter UID" value={newPlayer.uid} onChange={e => setNewPlayer({...newPlayer, uid: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Roll No</Label>
                                            <Input placeholder="Enter Roll No" value={newPlayer.roll_no} onChange={e => setNewPlayer({...newPlayer, roll_no: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Email Address</Label>
                                            <Input placeholder="Enter Email" type="email" value={newPlayer.email} onChange={e => setNewPlayer({...newPlayer, email: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="col-span-1 sm:col-span-3 flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2 sm:mt-4">
                                            <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => { setActiveFormSlot(null); setNewPlayer({roll_no:'', email:'', uid:''}); }}>Cancel</Button>
                                            <Button size="sm" className="w-full sm:w-auto bg-toxic-green text-black hover:bg-toxic-green/80" onClick={() => handleAddPlayer(false)}>Save Player</Button>
                                        </div>
                                   </div>
                                 </motion.div>
                               )}
                               </AnimatePresence>
                             </div>
                           );
                        })}

                        {/* Substitute */}
                        <div className={`glass p-4 rounded-xl border transition-all ${substitute ? 'border-neon-cyan/50 bg-neon-cyan/5' : activeFormSlot === 3 ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.2)]' : 'border-border/30 opacity-70'}`}>
                           <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 sm:gap-4">
                               <div className="flex items-center"><Shield className={`w-5 h-5 mr-3 ${substitute ? 'text-neon-cyan' : 'text-muted-foreground'}`}/> 
                                  <span className="font-bold whitespace-nowrap">Substitute <span className="text-muted-foreground font-normal">(Optional)</span></span>
                               </div>
                               {substitute ? (
                                   <div className="text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded text-left sm:text-right break-all flex items-center justify-between sm:justify-end gap-3 flex-1 sm:flex-none">
                                       <span>Roll No: {substitute.roll_no} | UID: {substitute.uid}</span>
                                     {activeFormSlot !== 3 && teamData.status === 'pending_players' && (
                                              <button onClick={() => { setNewPlayer(substitute); setActiveFormSlot(3); }} className="text-neon-cyan hover:text-white transition-colors p-1 bg-neon-cyan/10 rounded"><Edit2 className="h-3 w-3" /></button>
                                       )}
                                   </div>
                               ) : (
                                   activeFormSlot !== 3 && players.length === 3 ? (
                                       <Button size="sm" variant="outline" className="text-neon-cyan hover:text-neon-cyan hover:bg-neon-cyan/10 border-neon-cyan/50" onClick={() => setActiveFormSlot(3)}>
                                           <Plus className="w-4 h-4 mr-1"/> Add
                                       </Button>
                                   ) : activeFormSlot !== 3 ? (
                                       <span className="text-xs text-muted-foreground hidden sm:block">Requires full squad</span>
                                   ) : null
                               )}
                           </div>
                           
                           <AnimatePresence>
                           {activeFormSlot === 3 && (
                                 <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                   <div className="pt-4 mt-4 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">UID (Game ID)</Label>
                                            <Input placeholder="Enter UID" value={newPlayer.uid} onChange={e => setNewPlayer({...newPlayer, uid: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Roll No</Label>
                                            <Input placeholder="Enter Roll No" value={newPlayer.roll_no} onChange={e => setNewPlayer({...newPlayer, roll_no: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">Email Address</Label>
                                            <Input placeholder="Enter Email" type="email" value={newPlayer.email} onChange={e => setNewPlayer({...newPlayer, email: e.target.value})} className="glass border-border/30 h-9 text-sm" />
                                        </div>
                                        <div className="col-span-1 sm:col-span-3 flex flex-col-reverse sm:flex-row justify-end gap-2 mt-2 sm:mt-4">
                                            <Button size="sm" variant="ghost" className="w-full sm:w-auto" onClick={() => { setActiveFormSlot(null); setNewPlayer({roll_no:'', email:'', uid:''}); }}>Cancel</Button>
                                            <Button size="sm" className="w-full sm:w-auto bg-toxic-green text-black hover:bg-toxic-green/80" onClick={() => handleAddPlayer(true)}>Save Substitute</Button>
                                        </div>
                                   </div>
                                 </motion.div>
                           )}
                           </AnimatePresence>
                        </div>
                 </div>

                 <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                     <p className="text-xs text-muted-foreground border p-2 rounded glass border-border/50 text-center sm:text-left">Note: You must have exactly 1 Leader + 3 Players.</p>
                     <Button 
                         disabled={players.length < 3 || loading} 
                         onClick={() => setShowConfirmModal(true)}
                         className={`font-bold px-8 whitespace-nowrap ${players.length >= 3 ? 'bg-toxic-green text-black hover:bg-toxic-green/80' : 'bg-muted text-muted-foreground'}`}
                     >
                        Confirm Roster & Pay <ArrowRight className="ml-2 w-4 h-4"/>
                     </Button>
                 </div>
              </div>
            </motion.div>
          )}

          {/* Payment Pending State */}
          {teamData.status === 'payment_pending' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
                 <Card className="glass p-8 max-w-md w-full border-toxic-green/30 text-center">
                    <Trophy className="h-16 w-16 text-toxic-green mx-auto mb-4" />
                    <h2 className="text-2xl font-black mb-2">Tournament Entry Fee</h2>
                    <p className="text-muted-foreground mb-6">Complete payment to finalize your squad's registration for {teamData.game}</p>
                    <div className="text-4xl font-black text-toxic-green mb-8">₹299</div>
                    <Button 
                        disabled={isProcessingPayment} 
                        onClick={handlePayment} 
                        className="w-full bg-toxic-green hover:bg-toxic-green/80 text-black font-bold h-12 text-lg"
                    >
                        {isProcessingPayment ? "Processing..." : "Pay Now"}
                    </Button>
                 </Card>
              </motion.div>
          )}

          {/* Confirmed State -> Standard Dashboard Tabs */}
          {teamData.status === 'confirmed' && (
            <Tabs defaultValue="tickets" className="space-y-6">
                <TabsList className="glass">
                <TabsTrigger value="tickets" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                    QR Tickets
                </TabsTrigger>
                <TabsTrigger value="tournament" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                    Overview
                </TabsTrigger>
                </TabsList>

                {/* QR Tickets */}
                <TabsContent value="tickets">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Leader Ticket */}
                    <div className="glass rounded-xl p-6 border-2 border-toxic-green/30 relative overflow-hidden flex flex-col items-center ticket-bg">
                        <div className="absolute top-0 right-0 bg-toxic-green text-void-black text-xs font-bold px-3 py-1 rounded-bl-lg">LEADER</div>
                        <div className="w-12 h-12 rounded-lg bg-toxic-green/10 border border-toxic-green/30 flex items-center justify-center mb-2 overflow-hidden">
                           {teamData.logo ? (
                             <img src={teamData.logo} alt="Team Logo" className="w-full h-full object-cover" />
                           ) : (
                             <Shield className="h-6 w-6 text-toxic-green" />
                           )}
                        </div>
                        <h4 className="font-bold text-lg">{teamData.leader.name}</h4>
                        <p className="text-xs text-muted-foreground mb-4">UID: {teamData.leader.uid}</p>
                        <div className="p-2 bg-white rounded-lg mb-4">
                            <QRCodeSVG value={`HYPER-${teamData.leader.uid}-L`} size={150} />
                        </div>
                        <p className="text-xs font-bold tracking-widest text-toxic-green">{teamData.game} SQUAD</p>
                    </div>

                    {/* Member Tickets */}
                    {teamData.players.map((p: any, idx: number) => (
                        <div key={idx} className="glass rounded-xl p-6 border border-cyber-purple/30 relative flex flex-col items-center">
                            <Users className="h-8 w-8 text-cyber-purple mb-2" />
                            <h4 className="font-bold text-lg">Player {idx + 2}</h4>
                            <p className="text-xs text-muted-foreground mb-4">UID: {p.uid}</p>
                            <div className="p-2 bg-white rounded-lg mb-4">
                                <QRCodeSVG value={`HYPER-${p.uid}-P${idx}`} size={150} />
                            </div>
                            <p className="text-xs font-bold tracking-widest text-cyber-purple">{teamData.game} SQUAD</p>
                        </div>
                    ))}

                    {/* Sub Ticket */}
                    {teamData.substitute && (
                        <div className="glass rounded-xl p-6 border border-neon-red/30 relative flex flex-col items-center">
                            <div className="absolute top-0 right-0 bg-neon-red/20 text-neon-red text-xs font-bold px-3 py-1 rounded-bl-lg">SUB</div>
                            <Shield className="h-8 w-8 text-neon-red mb-2" />
                            <h4 className="font-bold text-lg">Substitute</h4>
                            <p className="text-xs text-muted-foreground mb-4">UID: {teamData.substitute.uid}</p>
                            <div className="p-2 bg-white rounded-lg mb-4">
                                <QRCodeSVG value={`HYPER-${teamData.substitute.uid}-S`} size={150} />
                            </div>
                            <p className="text-xs font-bold tracking-widest text-neon-red">{teamData.game} SQUAD</p>
                        </div>
                    )}
                </div>
                </TabsContent>

                <TabsContent value="tournament">
                    <div className="glass p-6 rounded-xl border border-toxic-green/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-toxic-green">Tournament Status: REGISTERED</h3>
                                <p className="text-muted-foreground">Stay tuned on Discord for matchmaking and lobby details. Keep your QR tickets handy for verification.</p>
                            </div>
                            <Button variant="outline" className="border-toxic-green/50 text-toxic-green hover:bg-toxic-green hover:text-black">Join Discord</Button>
                        </div>
                        
                        <div className="border-t border-border/50 pt-6 mt-6">
                            <h4 className="font-bold text-lg mb-4 text-neon-cyan">Final Squad Overview</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-background/50 rounded-lg border border-border/50 flex flex-col gap-1 items-start relative overflow-hidden">
                                     {teamData.logo && <img src={teamData.logo} alt="Logo" className="absolute top-0 right-0 w-16 h-16 opacity-10 grayscale" />}
                                    <span className="text-xs text-toxic-green font-bold">LEADER</span>
                                    <span className="font-medium text-lg">{teamData.leader.name}</span>
                                    <span className="text-sm text-muted-foreground">UID: {teamData.leader.uid} | Roll: {teamData.leader.roll_no}</span>
                                </div>
                                {teamData.players.map((p:any, i:number) => (
                                    <div key={i} className="p-4 bg-background/50 rounded-lg border border-border/50 flex flex-col gap-1">
                                        <span className="text-xs text-cyber-purple font-bold">PLAYER {i+2}</span>
                                        <span className="font-medium text-lg">ID Verified</span>
                                        <span className="text-sm text-muted-foreground">UID: {p.uid} | Roll: {p.roll_no}</span>
                                    </div>
                                ))}
                                {teamData.substitute && (
                                    <div className="p-4 bg-background/50 rounded-lg border border-border/50 flex flex-col gap-1">
                                        <span className="text-xs text-neon-red font-bold">SUBSTITUTE</span>
                                        <span className="font-medium text-lg">ID Verified</span>
                                        <span className="text-sm text-muted-foreground">UID: {teamData.substitute.uid} | Roll: {teamData.substitute.roll_no}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
}