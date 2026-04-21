import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

export const FloatingWhatsApp = () => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none"
    >
      <div className="relative group pointer-events-auto">
        {/* Label on Hover */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg text-white text-sm font-rajdhani font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transform duration-300">
          Join Official WhatsApp Community
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[5px] border-l-black/80" />
        </div>

        {/* Pulsating Ring */}
        <div className="absolute inset-0 bg-[#25D366] rounded-full animate-ping opacity-20" />
        
        {/* Main Button */}
        <a
          href="https://chat.whatsapp.com/J8Pav0GLEXs3gYKeMrcRR4"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.8)]"
        >
          <MessageCircle className="w-8 h-8" />
        </a>
      </div>
    </motion.div>
  );
};
