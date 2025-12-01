import { motion } from "framer-motion";
import { Trophy, TrendingUp, Award, Zap, Target, Crown, Star, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const stats = [
  { label: "Total Earnings", value: "₹12,450", icon: Trophy, color: "toxic-green", trend: "+15%" },
  { label: "Tournaments Won", value: "8", icon: Crown, color: "neon-cyan", trend: "+2" },
  { label: "Win Rate", value: "67%", icon: Target, color: "cyber-purple", trend: "+5%" },
  { label: "Current Rank", value: "#42", icon: TrendingUp, color: "neon-red", trend: "↑12" },
];

const matchHistory = [
  { id: 1, tournament: "BGMI Championship", date: "Dec 15", result: "Won", prize: "₹5,000", place: "1st" },
  { id: 2, tournament: "Squad Showdown", date: "Dec 12", result: "Won", prize: "₹3,200", place: "2nd" },
  { id: 3, tournament: "Solo Masters", date: "Dec 10", result: "Lost", prize: "₹500", place: "8th" },
  { id: 4, tournament: "Free Fire Arena", date: "Dec 8", result: "Won", prize: "₹2,000", place: "3rd" },
];

const achievements = [
  { id: 1, name: "First Blood", description: "Win your first tournament", icon: Zap, unlocked: true },
  { id: 2, name: "Hat Trick", description: "Win 3 consecutive tournaments", icon: Star, unlocked: true },
  { id: 3, name: "Legendary", description: "Reach top 10 ranking", icon: Crown, unlocked: false },
  { id: 4, name: "Untouchable", description: "Maintain 80% win rate", icon: Shield, unlocked: false },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen py-20 px-4 hexagon-pattern">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-black mb-2">
            <span className="text-gradient-primary">Player Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground">Track your competitive journey</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="glass rounded-xl p-6 relative overflow-hidden group cursor-pointer"
              >
                {/* Glow Effect on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-${stat.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}/20 border border-${stat.color}/30`}>
                      <Icon className={`h-6 w-6 text-${stat.color}`} />
                    </div>
                    <span className={`text-sm font-bold text-${stat.color}`}>{stat.trend}</span>
                  </div>
                  <div className="text-3xl font-black mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="history" className="space-y-8">
          <TabsList className="glass">
            <TabsTrigger value="history" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
              Match History
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-toxic-green/20 data-[state=active]:text-toxic-green">
              Achievements
            </TabsTrigger>
          </TabsList>

          {/* Match History */}
          <TabsContent value="history" className="space-y-4">
            {matchHistory.map((match, idx) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ x: 8 }}
                className="glass rounded-xl p-6 cursor-pointer group"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      match.result === "Won" 
                        ? "bg-toxic-green/20 text-toxic-green border border-toxic-green/30" 
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}>
                      {match.result}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg group-hover:text-gradient-primary transition-all">
                        {match.tournament}
                      </h3>
                      <p className="text-sm text-muted-foreground">{match.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Placement</div>
                      <div className="text-xl font-bold text-neon-cyan">{match.place}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Prize</div>
                      <div className="text-xl font-bold text-toxic-green">{match.prize}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
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
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    className={`glass rounded-xl p-6 relative overflow-hidden ${
                      achievement.unlocked ? "ring-2 ring-toxic-green glow-primary" : "opacity-60"
                    }`}
                  >
                    {achievement.unlocked && (
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            "0 0 20px rgba(0,255,157,0.3)",
                            "0 0 40px rgba(0,255,157,0.5)",
                            "0 0 20px rgba(0,255,157,0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-xl"
                      />
                    )}
                    
                    <div className="relative z-10 flex items-start gap-4">
                      <div className={`p-4 rounded-xl ${
                        achievement.unlocked 
                          ? "bg-toxic-green/20 border-2 border-toxic-green" 
                          : "bg-muted/20 border border-border"
                      }`}>
                        <Icon className={`h-8 w-8 ${
                          achievement.unlocked ? "text-toxic-green" : "text-muted-foreground"
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
  );
}
