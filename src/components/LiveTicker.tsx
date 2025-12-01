import { motion } from "framer-motion";
import { Trophy, Zap } from "lucide-react";

const activities = [
  { text: "User ShadowKing just won ₹5,000 in BGMI Championship", icon: Trophy },
  { text: "Team Phoenix registered for Squad Showdown", icon: Zap },
  { text: "User NeonNinja secured 1st place - ₹10,000", icon: Trophy },
  { text: "12 new registrations in the last 5 minutes", icon: Zap },
  { text: "User ThunderBolt won ₹3,500 in Free Fire Arena", icon: Trophy },
];

export const LiveTicker = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 py-3 overflow-hidden">
      <motion.div
        animate={{ x: [0, -2000] }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...activities, ...activities, ...activities].map((activity, idx) => {
          const Icon = activity.icon;
          return (
            <div key={idx} className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-toxic-green" />
              <span className="text-sm font-medium">{activity.text}</span>
              <span className="text-toxic-green">•</span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};
