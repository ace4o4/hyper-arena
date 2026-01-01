import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award, Target, Crown, Star, Shield, Users, Calendar, MapPin, Clock, Share2, QrCode, ArrowLeft, Gamepad2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ParticleBackground } from "@/components/ParticleBackground";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Mock team data
// Mock data removed in favor of real data
const defaultTeamData = {
  name: "Loading Team...",
  game: "Loading...",
  leader: { name: "...", uid: "...", email: "...", isLeader: true },
  players: [],
  substitute: null
};

const registeredTournament = {
  id: 1,
  name: "BGMI Pro League Season 1",
  game: "BGMI",
  date: "December 20, 2024",
  time: "6:00 PM IST",
  venue: "Online - Discord Server",
  prizePool: "₹50,000",
  totalTeams: 32,
  registeredTeams: 28,
  status: "Upcoming",
  entryFee: "₹500",
};

const tournamentDetails = [
  {
    game: "BGMI",
    name: "BGMI Pro League Season 1",
    date: "December 20, 2024",
    time: "6:00 PM IST",
    venue: "Online - Discord",
    prizePool: "₹50,000",
    teams: 32,
    format: "Battle Royale - Squad",
    status: "Active",
  },
  {
    game: "Free Fire",
    name: "Free Fire Championship",
    date: "December 25, 2024",
    time: "7:00 PM IST",
    venue: "Online - Discord",
    prizePool: "₹30,000",
    teams: 24,
    format: "Battle Royale - Squad",
    status: "Active",
  },
];

const stats = [
  { label: "Total Earnings", value: "₹12,450", icon: Trophy, color: "toxic-green", trend: "+15%" },
  { label: "Tournaments Won", value: "8", icon: Crown, color: "neon-cyan", trend: "+2" },
  { label: "Win Rate", value: "67%", icon: Target, color: "cyber-purple", trend: "+5%" },
  { label: "Current Rank", value: "#42", icon: TrendingUp, color: "neon-red", trend: "↑12" },
];

const achievements = [
  { id: 1, name: "First Blood", description: "Win your first tournament", icon: Star, unlocked: true },
  { id: 2, name: "Hat Trick", description: "Win 3 consecutive tournaments", icon: Star, unlocked: true },
  { id: 3, name: "Legendary", description: "Reach top 10 ranking", icon: Crown, unlocked: false },
  { id: 4, name: "Untouchable", description: "Maintain 80% win rate", icon: Shield, unlocked: false },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<any>(defaultTeamData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeamData = () => {
      try {
        // Load team data from localStorage
        const storedData = localStorage.getItem('teamRegistration');
        if (storedData) {
          const registration = JSON.parse(storedData);
          setTeamData({
            name: registration.teamName,
            game: registration.game,
            leader: {
              name: registration.leader.ign,
              uid: registration.leader.uid,
              email: registration.leader.email,
              isLeader: true
            },
            players: registration.players.map((p: any) => ({
              name: p.ign,
              uid: p.uid,
              email: p.email,
              role: "Member"
            })),
            substitute: registration.substitute ? {
              name: registration.substitute.ign,
              uid: registration.substitute.uid,
              email: registration.substitute.email
            } : null
          });
        }
      } catch (err) {
        console.error("Error loading team data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTeamData();
  }, []);

  const handleLogout = async () => {
    // Clear local storage
    localStorage.removeItem('teamRegistration');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate("/");
  };

  const handleShareTicket = (playerName: string) => {
    toast({
      title: "Ticket Shared!",
      description: `QR ticket for ${playerName} has been shared via WhatsApp/Email.`,
    });
  };

  const generateQRCode = (playerUid: string) => {
    // Generate a simple QR-like pattern for demo
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=HYPERGAME-${playerUid}-${registeredTournament.id}`;
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <Navbar />
      <div className="pt-24 pb-12 px-4 hexagon-pattern">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-black mb-2">
              <span className="text-gradient-primary">Player Dashboard</span>
            </h1>
            <p className="text-lg text-muted-foreground">Welcome back, {teamData.leader.name}!</p>
          </motion.div>

          {/* Team Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl p-6 mb-8 border border-toxic-green/30"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-toxic-green/20 border border-toxic-green/30">
                  <Shield className="h-8 w-8 text-toxic-green" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gradient-primary">{teamData.name}</h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <Gamepad2 className="h-4 w-4" /> {teamData.game}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate("/")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Home
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              </div>
            </div>

            {/* Team Leader */}
            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Team Leader</h3>
              <div className="glass rounded-lg p-4 border border-toxic-green/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-5 w-5 text-toxic-green" />
                  <div>
                    <p className="font-bold">{teamData.leader.name}</p>
                    <p className="text-xs text-muted-foreground">UID: {teamData.leader.uid}</p>
                  </div>
                </div>
                <span className="text-xs bg-toxic-green/20 text-toxic-green px-3 py-1 rounded-full">Leader</span>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider mb-3">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {teamData.players.map((player, idx) => (
                  <div key={idx} className="glass rounded-lg p-4 border border-cyber-purple/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-cyber-purple" />
                      <div>
                        <p className="font-bold">{player.name}</p>
                        <p className="text-xs text-muted-foreground">UID: {player.uid} • {player.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="glass rounded-xl p-4 md:p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-${stat.color}/20`}>
                      <Icon className={`h-5 w-5 text-${stat.color}`} />
                    </div>
                    <span className={`text-xs font-bold text-${stat.color}`}>{stat.trend}</span>
                  </div>
                  <div className="text-2xl md:text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="tournament" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="tournament" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                Registered Tournament
              </TabsTrigger>
              <TabsTrigger value="tickets" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                QR Tickets
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                Tournament Details
              </TabsTrigger>
              <TabsTrigger value="achievements" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
                Achievements
              </TabsTrigger>
            </TabsList>

            {/* Registered Tournament */}
            <TabsContent value="tournament">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-xl p-6 border border-neon-cyan/30"
              >
                <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-gradient-primary">{registeredTournament.name}</h3>
                    <p className="text-muted-foreground">{registeredTournament.game} - Squad</p>
                  </div>
                  <span className="px-4 py-2 bg-toxic-green/20 text-toxic-green rounded-full text-sm font-bold">
                    {registeredTournament.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="glass rounded-lg p-4">
                    <Calendar className="h-5 w-5 text-neon-cyan mb-2" />
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-bold">{registeredTournament.date}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <Clock className="h-5 w-5 text-neon-cyan mb-2" />
                    <p className="text-xs text-muted-foreground">Time</p>
                    <p className="font-bold">{registeredTournament.time}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <MapPin className="h-5 w-5 text-neon-cyan mb-2" />
                    <p className="text-xs text-muted-foreground">Venue</p>
                    <p className="font-bold">{registeredTournament.venue}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <Trophy className="h-5 w-5 text-toxic-green mb-2" />
                    <p className="text-xs text-muted-foreground">Prize Pool</p>
                    <p className="font-bold text-toxic-green">{registeredTournament.prizePool}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Teams Registered</p>
                    <p className="text-xl font-bold">{registeredTournament.registeredTeams}/{registeredTournament.totalTeams}</p>
                  </div>
                  <Progress value={(registeredTournament.registeredTeams / registeredTournament.totalTeams) * 100} className="w-1/2" />
                </div>
              </motion.div>
            </TabsContent>

            {/* QR Tickets */}
            <TabsContent value="tickets">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Leader Ticket */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="glass rounded-xl p-6 border-2 border-toxic-green/30 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-toxic-green text-void-black text-xs font-bold px-3 py-1 rounded-bl-lg">
                    LEADER
                  </div>
                  <div className="text-center mb-4">
                    <Crown className="h-8 w-8 text-toxic-green mx-auto mb-2" />
                    <h4 className="font-bold text-lg">{teamData.leader.name}</h4>
                    <p className="text-xs text-muted-foreground">UID: {teamData.leader.uid}</p>
                  </div>
                  <div className="flex justify-center mb-4">
                    <img
                      src={generateQRCode(teamData.leader.uid)}
                      alt="QR Code"
                      className="w-32 h-32 rounded-lg border border-border/30"
                    />
                  </div>
                  <p className="text-xs text-center text-muted-foreground mb-4">{registeredTournament.name}</p>
                  <Button
                    onClick={() => handleShareTicket(teamData.leader.name)}
                    className="w-full bg-toxic-green/20 hover:bg-toxic-green/30 text-toxic-green"
                    size="sm"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share Ticket
                  </Button>
                </motion.div>

                {/* Player Tickets */}
                {teamData.players.map((player, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (idx + 1) * 0.1 }}
                    className="glass rounded-xl p-6 border border-cyber-purple/30"
                  >
                    <div className="text-center mb-4">
                      <Users className="h-8 w-8 text-cyber-purple mx-auto mb-2" />
                      <h4 className="font-bold text-lg">{player.name}</h4>
                      <p className="text-xs text-muted-foreground">UID: {player.uid} • {player.role}</p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <img
                        src={generateQRCode(player.uid)}
                        alt="QR Code"
                        className="w-32 h-32 rounded-lg border border-border/30"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mb-4">{registeredTournament.name}</p>
                    <Button
                      onClick={() => handleShareTicket(player.name)}
                      className="w-full bg-cyber-purple/20 hover:bg-cyber-purple/30 text-cyber-purple"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Share Ticket
                    </Button>
                  </motion.div>
                ))}

                {/* Substitute Ticket */}
                {teamData.substitute && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="glass rounded-xl p-6 border border-neon-red/30"
                  >
                    <div className="absolute top-0 right-0 bg-neon-red/20 text-neon-red text-xs font-bold px-3 py-1 rounded-bl-lg">
                      SUBSTITUTE
                    </div>
                    <div className="text-center mb-4 pt-4">
                      <Shield className="h-8 w-8 text-neon-red mx-auto mb-2" />
                      <h4 className="font-bold text-lg">{teamData.substitute.name}</h4>
                      <p className="text-xs text-muted-foreground">UID: {teamData.substitute.uid}</p>
                    </div>
                    <div className="flex justify-center mb-4">
                      <img
                        src={generateQRCode(teamData.substitute.uid)}
                        alt="QR Code"
                        className="w-32 h-32 rounded-lg border border-border/30"
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground mb-4">{registeredTournament.name}</p>
                    <Button
                      onClick={() => handleShareTicket(teamData.substitute.name)}
                      className="w-full bg-neon-red/20 hover:bg-neon-red/30 text-neon-red"
                      size="sm"
                    >
                      <Share2 className="h-4 w-4 mr-2" /> Share Ticket
                    </Button>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            {/* Tournament Details */}
            <TabsContent value="details">
              <div className="space-y-4">
                {tournamentDetails.map((tournament, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="glass rounded-xl p-6 border border-neon-cyan/20"
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Gamepad2 className="h-5 w-5 text-neon-cyan" />
                          <span className="text-sm text-neon-cyan">{tournament.game}</span>
                        </div>
                        <h3 className="text-xl font-black">{tournament.name}</h3>
                      </div>
                      <span className="px-3 py-1 bg-toxic-green/20 text-toxic-green rounded-full text-sm font-bold">
                        {tournament.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-bold">{tournament.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-bold">{tournament.time}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Venue</p>
                        <p className="font-bold">{tournament.venue}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prize Pool</p>
                        <p className="font-bold text-toxic-green">{tournament.prizePool}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Teams</p>
                        <p className="font-bold">{tournament.teams}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Coming Soon Tournaments */}
                <div className="glass rounded-xl p-6 border border-muted/20 opacity-60">
                  <div className="text-center py-8">
                    <Gamepad2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">More Tournaments Coming Soon</h3>
                    <p className="text-muted-foreground">PUBG Mobile, COD Mobile, Valorant tournaments launching soon!</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Achievements */}
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {achievements.map((achievement, idx) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`glass rounded-xl p-6 relative overflow-hidden ${achievement.unlocked ? "ring-2 ring-toxic-green glow-primary" : "opacity-60"
                        }`}
                    >
                      <div className="relative z-10 flex items-start gap-4">
                        <div className={`p-4 rounded-xl ${achievement.unlocked
                          ? "bg-toxic-green/20 border-2 border-toxic-green"
                          : "bg-muted/20 border border-border"
                          }`}>
                          <Icon className={`h-8 w-8 ${achievement.unlocked ? "text-toxic-green" : "text-muted-foreground"
                            }`} />
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-black mb-1">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          {achievement.unlocked ? (
                            <div className="flex items-center gap-2 text-toxic-green text-sm font-bold">
                              <Award className="h-4 w-4" />
                              Unlocked
                            </div>
                          ) : (
                            <Progress value={45} className="h-2" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
}