import { useState, useEffect } from "react";
import { LogOut, Trophy, Crown, Shield, Users, ArrowRight, Gamepad2, AlertCircle, Plus, Check, Edit2, AlertTriangle, X, Upload, Image as ImageIcon, Trash2, Copy, Link2, MessageCircle, ExternalLink, Download } from "lucide-react";
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
import mockUpiReceipt from "@/assets/mock_upi_payment.png";

// Build a deterministic QR token for a team member
const buildQrToken = (teamId: string, role: "leader" | "player" | "substitute", rollNo: string) =>
  `HYPER-ARENA-${teamId}-${role}-${rollNo}`;

// Download a single ticket card as PDF
const downloadTicketPdf = async (elementId: string, filename: string) => {
  const el = document.getElementById(elementId);
  if (!el) return;
  const { default: html2canvas } = await import("html2canvas");
  const { jsPDF } = await import("jspdf");
  const canvas = await html2canvas(el, { backgroundColor: "#0a0a0a", scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save(filename);
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState<File | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState<"code" | "link" | null>(null);

  // Management State
  const [newPlayer, setNewPlayer] = useState({ roll_no: "", email: "", uid: "" });
  const [players, setPlayers] = useState<any[]>([]);
  const [substitute, setSubstitute] = useState<any>(null);
  const [activeFormSlot, setActiveFormSlot] = useState<number | null>(null);

  // Edit / Confirm State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEditingTeam, setIsEditingTeam] = useState(false);
  const [editTeamInfo, setEditTeamInfo] = useState({ teamName: "", game: "", uid: "", roll_no: "" });

  const paymentAmount = Number(import.meta.env.VITE_PAYMENT_AMOUNT || "100");
  const upiId = import.meta.env.VITE_UPI_ID || "your-upi-id@bank";
  const upiName = import.meta.env.VITE_UPI_NAME || "Hyper Arena";
  const isUpiConfigured = upiId !== "your-upi-id@bank";

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

  const handleDeleteTeam = async () => {
    if (!teamData) return;
    setShowDeleteModal(false);
    setLoading(true);
    try {
      const { supabase } = await import("@/lib/supabase");
      if (!supabase) throw new Error("Supabase not configured.");
      const { error } = await supabase.from("teams").delete().eq("id", teamData.id);
      if (error) throw new Error(error.message);
      toast({
        title: "Team Deleted",
        description: `"${teamData.teamName}" has been disbanded. You can now create a new team.`,
      });
      setTeamData(null);
      setPlayers([]);
      setSubstitute(null);
    } catch (err: any) {
      toast({ title: "Delete Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
    if (!isUpiConfigured) {
      toast({
        title: "UPI Not Configured",
        description: "Set VITE_UPI_ID in .env.local before collecting payments.",
        variant: "destructive",
      });
      return;
    }

    if (!utrNumber.trim()) {
      toast({ title: "UTR Missing", description: "Please enter the UTR / Transaction ID.", variant: "destructive" });
      return;
    }

    if (!paymentScreenshotFile) {
       toast({ title: "Screenshot Missing", description: "Please upload your payment screenshot.", variant: "destructive" });
       return;
    }

    setIsProcessingPayment(true);
    try {
      let screenshotUrl = null;
      if (paymentScreenshotFile) {
        toast({ title: "Uploading...", description: "Uploading payment screenshot." });
        screenshotUrl = await mockApi.uploadPaymentScreenshot(teamData.id, paymentScreenshotFile);
      }
      
      const updated = await mockApi.submitPaymentProof(teamData.id, utrNumber, screenshotUrl);
      setTeamData(updated);
      toast({ title: "Payment Submitted", description: "Your payment is under verification. Tickets unlock after approval." });
    } catch(err:any) {
       toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setIsProcessingPayment(false);
  }

  const handleBackToEdit = async () => {
    try {
      setLoading(true);
      const updated = await mockApi.updateTeamInfo(teamData.id, { status: "pending_players" });
      setTeamData(updated);
      toast({ title: "Roster Unlocked", description: "You can now edit your team details." });
    } catch(err:any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      toast({ title: "Uploading...", description: "Saving logo to the server." });
      const publicUrl = await mockApi.uploadTeamLogo(teamData.id, file);
      const updated = await mockApi.updateTeamInfo(teamData.id, { logo: publicUrl });
      setTeamData(updated);
      toast({ title: "Logo Updated", description: "Team emblem has been securely saved." });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    }
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

  const upiIntentLink = (() => {
    if (!teamData) return "";

    const teamIdentifier = (teamData.inviteCode || teamData.id || "").toString().trim();
    const paymentNote = `Team ${teamData.teamName} | ID ${teamIdentifier}`;
    const params = new URLSearchParams({
      pa: upiId,
      pn: upiName,
      am: paymentAmount.toFixed(2),
      cu: "INR",
      tn: paymentNote,
      tr: `HYPER-${teamIdentifier}`,
    });

    return `upi://pay?${params.toString()}`;
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

  if (loading) return <div className="min-h-screen flex items-center justify-center text-primary">Loading Dashboard...</div>;

  if (!teamData) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4" style={{background: 'var(--background)'}}>
      <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
        <Gamepad2 className="h-10 w-10 text-primary" />
      </div>
      <h2 className="text-3xl font-black text-gradient-primary">No Team Found</h2>
      <p className="text-muted-foreground max-w-md">You haven't created or joined a team yet. Head to tournaments to register your squad!</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => navigate("/tournaments")} className="bg-primary text-black hover:bg-primary/80 font-bold">
          Browse Tournaments <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button onClick={() => navigate("/create-team?mode=create")} variant="outline" className="glass border-border/30">
          Create New Team
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern min-h-[90vh]">
        <div className="container mx-auto max-w-7xl">
          
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
                          <Button variant="ghost" onClick={() => setShowConfirmModal(false)}>Cancel &amp; Review</Button>
                          <Button className="bg-neon-red text-white hover:bg-neon-red/80" onClick={handleSubmitPlayers}>Yes, Proceed to Payment</Button>
                       </div>
                   </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Delete Team Confirmation Modal */}
          <AnimatePresence>
            {showDeleteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-4"
              >
                <div className="glass max-w-md w-full p-6 rounded-xl border border-neon-red/50 relative">
                  <div className="flex items-center gap-3 mb-4 text-neon-red">
                    <Trash2 className="h-8 w-8" />
                    <h3 className="text-xl font-bold">Disband Team?</h3>
                  </div>
                  <p className="text-white/80 mb-2">
                    You are about to permanently delete{" "}
                    <span className="font-bold text-primary">"{teamData.teamName}"</span>.
                  </p>
                  <p className="text-muted-foreground text-sm mb-6">
                    This action cannot be undone. After deletion, you'll be free to create a new team.
                  </p>
                  <div className="flex justify-end gap-3 flex-col sm:flex-row">
                    <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button className="bg-neon-red text-white hover:bg-neon-red/80" onClick={handleDeleteTeam}>
                      <Trash2 className="h-4 w-4 mr-2" /> Yes, Delete Team
                    </Button>
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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 mb-8 border border-primary/30">
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
                         {/* teamData.logo && (
                           <Button variant="outline" size="sm" onClick={handleRemoveLogo} className="border-neon-red text-neon-red hover:bg-neon-red/10">
                             <Trash2 className="h-4 w-4 mr-2" /> Remove Logo
                           </Button>
                         ) */}
                         <Button onClick={handleSaveTeamEdit} className="bg-primary text-black hover:bg-primary/80">Save Changes</Button>
                      </div>
              </div>
            ) : (
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div 
                  className="w-16 h-16 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center relative overflow-hidden"
                >
                  {teamData.logo ? (
                    <img src={teamData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <Shield className="h-8 w-8 text-primary" />
                  )}
                  
                  {/* Upload feature disabled as requested
                  <div className="absolute bottom-0 right-0 bg-primary p-1 rounded-tl-lg shadow-[0_0_10px_rgba(var(--primary),0.5)]">
                    <Upload className="h-2 w-2 text-void-black" />
                  </div>

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <Upload className="h-5 w-5 text-primary mb-1" />
                    <span className="text-[8px] text-white font-bold uppercase">Update Logo</span>
                  </div>
                  <input 
                    id="dash-logo-upload" 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                  />
                  */}
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
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1 rounded-full text-xs font-bold ${teamData.status === 'confirmed' ? 'bg-primary text-black' : teamData.status === 'payment_review' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-neon-red/20 text-neon-red'}`}>
                  {teamData.status.replace('_', ' ').toUpperCase()}
                </span>
                {teamData.status === 'pending_players' && currentUserId === teamData.user_id && (
                  <Button variant="outline" size="sm" onClick={() => setShowDeleteModal(true)} className="border-neon-red text-neon-red hover:bg-neon-red/10 h-7 text-xs px-2">
                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                  </Button>
                )}
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
                <div className="glass p-4 rounded-xl border border-green-500/30 bg-green-500/5 hover:border-green-500/50 transition-all group">
                   <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-green-500/10 rounded-lg group-hover:scale-110 transition-transform">
                          <MessageCircle className="h-5 w-5 text-green-500" />
                       </div>
                       <div className="text-xs uppercase tracking-widest text-green-500 font-bold">Community Hub</div>
                   </div>
                   <div className="text-sm font-medium mb-3">Join our WhatsApp Community for matches & updates.</div>
                   <a 
                     href="https://chat.whatsapp.com/J8Pav0GLEXs3gYKeMrcRR4" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 text-xs text-white bg-green-500/20 hover:bg-green-500/30 px-3 py-1.5 rounded transition-colors border border-green-500/20"
                   >
                     Join Now <ExternalLink className="h-3 w-3" />
                   </a>
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
                        <div className="glass p-4 rounded-xl border border-primary/30 flex justify-between items-center bg-primary/5">
                            <div className="flex items-center"><Crown className="w-5 h-5 mr-3 text-primary"/> <span className="font-bold">Leader (You)</span></div>
                            <Check className="text-primary w-5 h-5"/>
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
                                            <Button size="sm" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/80" onClick={() => handleAddPlayer(false)}>Save Player</Button>
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
                                            <Button size="sm" className="w-full sm:w-auto bg-primary text-black hover:bg-primary/80" onClick={() => handleAddPlayer(true)}>Save Substitute</Button>
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
                         className={`font-bold px-8 whitespace-nowrap ${players.length >= 3 ? 'bg-primary text-black hover:bg-primary/80' : 'bg-muted text-muted-foreground'}`}
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
                 <Card className="glass p-8 max-w-md w-full border-primary/30 text-center">
                    <Trophy className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h2 className="text-2xl font-black mb-2">Tournament Entry Fee</h2>
                    <p className="text-muted-foreground mb-4">Complete payment to finalize your squad's registration for {teamData.game}</p>
                    <div className="text-4xl font-black text-primary mb-4">₹{paymentAmount}</div>

                    {!isUpiConfigured && (
                      <p className="text-xs text-neon-red mb-4 border border-neon-red/30 rounded-md p-2 bg-neon-red/10">
                        Payment is blocked: UPI ID is not configured in environment.
                      </p>
                    )}

                    {isUpiConfigured && (
                      <>
                        <div className="p-3 bg-white rounded-lg inline-block mb-4">
                          <QRCodeSVG value={upiIntentLink} size={170} />
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">UPI ID</p>
                        <p className="font-bold text-neon-cyan mb-4 break-all">{upiId}</p>
                        <a
                          href={upiIntentLink}
                          className="inline-flex items-center justify-center w-full rounded-md h-11 px-4 text-sm font-semibold mb-3 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 hover:bg-neon-cyan/30 transition-colors"
                        >
                          Open UPI App
                        </a>
                        
                        {/* Mock UPI Image for reference */}
                        <div className="mt-4 mb-6 border border-white/10 rounded-lg overflow-hidden bg-black/50 p-2">
                           <p className="text-xs text-muted-foreground mb-2">Example Screenshot</p>
                           <img src={mockUpiReceipt} alt="Mock UPI Reference" className="w-full h-auto rounded border border-white/5 mix-blend-screen max-h-[300px] object-contain" />
                        </div>

                        <div className="space-y-4 mb-6 text-left">
                            <div>
                              <Label className="text-xs text-muted-foreground">UTR / Transaction ID</Label>
                              <Input 
                                placeholder="Enter 12-digit UTR number" 
                                value={utrNumber} 
                                onChange={(e) => setUtrNumber(e.target.value)}
                                className="mt-1 glass border-border/30"
                              />
                            </div>
                            <div>
                               <Label className="text-xs text-muted-foreground">Upload Payment Screenshot</Label>
                               <div className="mt-1 flex items-center justify-center w-full">
                                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border/30 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80 transition-colors">
                                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                          <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                                          <p className="mb-2 text-sm text-muted-foreground">
                                             <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                                          </p>
                                          <p className="text-xs text-muted-foreground max-w-[200px] text-center truncate">
                                            {paymentScreenshotFile ? paymentScreenshotFile.name : "JPEG, PNG up to 5MB"}
                                          </p>
                                      </div>
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                              setPaymentScreenshotFile(e.target.files[0]);
                                          }
                                      }} />
                                  </label>
                               </div>
                            </div>
                        </div>
                      </>
                    )}

                    <Button 
                        disabled={isProcessingPayment} 
                        onClick={handlePayment} 
                        className="w-full bg-primary hover:bg-primary/80 text-black font-bold h-auto py-3 text-sm uppercase tracking-wide whitespace-normal leading-tight"
                    >
                        {isProcessingPayment ? "Submitting..." : "I Have Paid - Submit For Verification"}
                    </Button>
                    <p className="text-[11px] text-muted-foreground mt-3 mb-4">Tickets will be generated only after admin verifies payment.</p>

                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border/10" />
                      </div>
                      <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Need to change details?</span>
                      </div>
                    </div>
                    
                    <Button 
                        variant="ghost" 
                        onClick={handleBackToEdit} 
                        className="w-full text-muted-foreground hover:text-white border border-transparent hover:border-white/10"
                        disabled={isProcessingPayment}
                    >
                        Go Back to Edit Roster
                    </Button>
                 </Card>
              </motion.div>
          )}

          {/* Payment Verification Pending */}
          {teamData.status === 'payment_review' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <Card className="glass p-8 max-w-md w-full border-neon-cyan/40 text-center">
                <Check className="h-14 w-14 text-neon-cyan mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-2">Payment Under Verification</h2>
                <p className="text-muted-foreground mb-4">
                  Payment submission received. Your registration will be confirmed after admin verification.
                </p>
                <p className="text-xs text-muted-foreground">Once verified, QR tickets will appear automatically in this dashboard.</p>
              </Card>
            </motion.div>
          )}

          {/* Payment Rejected State */}
          {teamData.status === 'payment_rejected' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
              <Card className="glass p-8 max-w-md w-full border-neon-red/40 text-center">
                <AlertTriangle className="h-14 w-14 text-neon-red mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-2 text-neon-red">Payment Rejected</h2>
                <p className="text-white/80 mb-4">
                  We couldn't verify your payment using the provided UTR and screenshot. Please ensure the payment was successful and submit correct details.
                </p>
                <Button 
                     onClick={async () => {
                        setLoading(true);
                        try {
                           const updated = await mockApi.updateTeamInfo(teamData.id, { status: "payment_pending" });
                           setTeamData(updated);
                           setUtrNumber("");
                           setPaymentScreenshotFile(null);
                        } catch(err:any) {
                           toast({ title: "Error", description: err.message, variant: "destructive" });
                        }
                        setLoading(false);
                     }}
                     className="w-full bg-neon-red hover:bg-neon-red/80 text-white font-bold h-11"
                >
                    Try Submitting Payment Proof Again
                </Button>
              </Card>
            </motion.div>
          )}

          {/* Confirmed State -> Standard Dashboard Tabs */}
          {teamData.status === 'confirmed' && (
            <Tabs defaultValue="tickets" className="space-y-6">
                <TabsList className="glass">
                <TabsTrigger value="tickets" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    QR Tickets
                </TabsTrigger>
                <TabsTrigger value="tournament" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                    Overview
                </TabsTrigger>
                </TabsList>

                {/* QR Tickets */}
                <TabsContent value="tickets">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Leader Ticket */}
                    <div id={`ticket-leader-${teamData.id}`} className="glass rounded-xl p-6 border-2 border-primary/30 relative overflow-hidden flex flex-col items-center ticket-bg">
                        <div className="absolute top-0 right-0 bg-primary text-void-black text-xs font-bold px-3 py-1 rounded-bl-lg">LEADER</div>
                        <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center mb-2 overflow-hidden">
                           {teamData.logo ? (
                             <img src={teamData.logo} alt="Team Logo" className="w-full h-full object-cover" />
                           ) : (
                             <Shield className="h-6 w-6 text-primary" />
                           )}
                        </div>
                        <h4 className="font-bold text-lg">{teamData.teamName}</h4>
                        <p className="text-xs text-muted-foreground">Roll No: {teamData.leader.roll_no}</p>
                        <p className="text-xs text-muted-foreground mb-3">UID: {teamData.leader.uid}</p>
                        <div className="p-2 bg-white rounded-lg mb-3">
                            <QRCodeSVG value={buildQrToken(teamData.id, "leader", teamData.leader.roll_no)} size={150} />
                        </div>
                        <p className="text-xs font-bold tracking-widest text-primary mb-3">{teamData.game} SQUAD</p>
                        <Button size="sm" variant="outline" className="text-xs gap-1 border-primary/40 text-primary hover:bg-primary/10"
                          onClick={() => downloadTicketPdf(`ticket-leader-${teamData.id}`, `ticket-${teamData.teamName}-leader.pdf`)}>
                          <Download className="h-3 w-3" /> Download PDF
                        </Button>
                    </div>

                    {/* Member Tickets */}
                    {teamData.players.map((p: any, idx: number) => (
                        <div key={idx} id={`ticket-player-${teamData.id}-${idx}`} className="glass rounded-xl p-6 border border-cyber-purple/30 relative flex flex-col items-center">
                            <Users className="h-8 w-8 text-cyber-purple mb-2" />
                            <h4 className="font-bold text-lg">{teamData.teamName}</h4>
                            <p className="text-xs text-muted-foreground">Roll No: {p.roll_no}</p>
                            <p className="text-xs text-muted-foreground mb-3">UID: {p.uid}</p>
                            <div className="p-2 bg-white rounded-lg mb-3">
                                <QRCodeSVG value={buildQrToken(teamData.id, "player", p.roll_no)} size={150} />
                            </div>
                            <p className="text-xs font-bold tracking-widest text-cyber-purple mb-3">{teamData.game} SQUAD — Player {idx + 2}</p>
                            <Button size="sm" variant="outline" className="text-xs gap-1 border-cyber-purple/40 text-cyber-purple hover:bg-cyber-purple/10"
                              onClick={() => downloadTicketPdf(`ticket-player-${teamData.id}-${idx}`, `ticket-${teamData.teamName}-player${idx + 2}.pdf`)}>
                              <Download className="h-3 w-3" /> Download PDF
                            </Button>
                        </div>
                    ))}

                    {/* Sub Ticket */}
                    {teamData.substitute && (
                        <div id={`ticket-sub-${teamData.id}`} className="glass rounded-xl p-6 border border-neon-red/30 relative flex flex-col items-center">
                            <div className="absolute top-0 right-0 bg-neon-red/20 text-neon-red text-xs font-bold px-3 py-1 rounded-bl-lg">SUB</div>
                            <Shield className="h-8 w-8 text-neon-red mb-2" />
                            <h4 className="font-bold text-lg">{teamData.teamName}</h4>
                            <p className="text-xs text-muted-foreground">Roll No: {teamData.substitute.roll_no}</p>
                            <p className="text-xs text-muted-foreground mb-3">UID: {teamData.substitute.uid}</p>
                            <div className="p-2 bg-white rounded-lg mb-3">
                                <QRCodeSVG value={buildQrToken(teamData.id, "substitute", teamData.substitute.roll_no)} size={150} />
                            </div>
                            <p className="text-xs font-bold tracking-widest text-neon-red mb-3">{teamData.game} SQUAD — Substitute</p>
                            <Button size="sm" variant="outline" className="text-xs gap-1 border-neon-red/40 text-neon-red hover:bg-neon-red/10"
                              onClick={() => downloadTicketPdf(`ticket-sub-${teamData.id}`, `ticket-${teamData.teamName}-substitute.pdf`)}>
                              <Download className="h-3 w-3" /> Download PDF
                            </Button>
                        </div>
                    )}
                </div>
                </TabsContent>

                <TabsContent value="tournament">
                    <div className="glass p-6 rounded-xl border border-primary/30">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-primary">Tournament Status: REGISTERED</h3>
                                <p className="text-muted-foreground">Stay tuned on Discord for matchmaking and lobby details. Keep your QR tickets handy for verification.</p>
                            </div>
                            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary hover:text-black">Join Discord</Button>
                        </div>
                        
                        <div className="border-t border-border/50 pt-6 mt-6">
                            <h4 className="font-bold text-lg mb-4 text-neon-cyan">Final Squad Overview</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-background/50 rounded-lg border border-border/50 flex flex-col gap-1 items-start relative overflow-hidden">
                                     {teamData.logo && <img src={teamData.logo} alt="Logo" className="absolute top-0 right-0 w-16 h-16 opacity-10 grayscale" />}
                                    <span className="text-xs text-primary font-bold">LEADER</span>
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