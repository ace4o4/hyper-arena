import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, QrCode, Home } from "lucide-react";
import { Background3D } from "@/components/Background3D";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockApi } from "@/lib/mockApi";

type AttendanceInfo = {
  teamName: string;
  game: string;
  memberRollNo: string;
  memberUid: string;
  memberRole: string;
  alreadyAttended: boolean;
};

export default function AttendanceVerify() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState<AttendanceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No token provided.");
      setLoading(false);
      return;
    }

    const lookup = async () => {
      try {
        const result = await mockApi.scanQrAttendance(token);
        setInfo(result);
      } catch (err: unknown) {
        setError((err as Error)?.message || "Could not verify this QR code.");
      } finally {
        setLoading(false);
      }
    };

    void lookup();
  }, [token]);

  return (
    <div className="min-h-screen relative flex flex-col">
      <Background3D />
      <Navbar />

      <div className="flex-1 pt-32 pb-20 px-4 flex items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {loading && (
            <Card className="glass p-10 border-primary/30 text-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/10 blur-[60px] rounded-full pointer-events-none" />
              <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
              <p className="font-orbitron text-sm tracking-widest text-primary uppercase">
                Verifying Ticket...
              </p>
            </Card>
          )}

          {!loading && error && (
            <Card className="glass p-8 border-destructive/40 text-center relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-destructive/10 blur-[60px] rounded-full pointer-events-none" />
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                className="w-20 h-20 mx-auto bg-destructive/20 rounded-full border-4 border-destructive/60 flex items-center justify-center mb-6 relative z-10"
              >
                <XCircle className="w-10 h-10 text-destructive" />
              </motion.div>
              <h2 className="font-orbitron font-black text-xl text-destructive mb-3 tracking-widest relative z-10">
                INVALID TICKET
              </h2>
              <p className="text-sm text-muted-foreground mb-6 relative z-10">{error}</p>
              <Link to="/" className="relative z-10">
                <Button variant="outline" className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-2">
                  <Home className="w-4 h-4" /> Return Home
                </Button>
              </Link>
            </Card>
          )}

          {!loading && info && (
            <Card
              className={`glass p-8 relative overflow-hidden border-2 ${
                info.alreadyAttended ? "border-red-500/40" : "border-green-500/40"
              }`}
            >
              {/* Background glow */}
              <div
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 blur-[80px] rounded-full pointer-events-none ${
                  info.alreadyAttended ? "bg-red-500/10" : "bg-green-500/10"
                }`}
              />

              {/* Status badge */}
              <div className="relative z-10 text-center mb-6">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", delay: 0.1, bounce: 0.5 }}
                  className={`w-20 h-20 mx-auto rounded-full border-4 flex items-center justify-center mb-4 ${
                    info.alreadyAttended
                      ? "bg-red-500/20 border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                      : "bg-green-500/20 border-green-500/60 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                  }`}
                >
                  {info.alreadyAttended ? (
                    <XCircle className="w-10 h-10 text-red-400" />
                  ) : (
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  )}
                </motion.div>

                <h2
                  className={`font-orbitron font-black text-2xl tracking-widest ${
                    info.alreadyAttended ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {info.alreadyAttended ? "ALREADY CHECKED IN" : "ENTRY ALLOWED"}
                </h2>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-widest">
                  {info.alreadyAttended
                    ? "This ticket has already been used."
                    : "Your ticket is valid — welcome!"}
                </p>
              </div>

              {/* Member details */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="relative z-10 grid grid-cols-2 gap-3 mb-6"
              >
                {[
                  { label: "Team", value: info.teamName },
                  { label: "Game", value: info.game },
                  { label: "Roll No", value: info.memberRollNo },
                  { label: "Role", value: info.memberRole },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="bg-black/40 p-3 rounded border border-white/5"
                  >
                    <p className="text-[9px] text-muted-foreground uppercase tracking-widest">
                      {label}
                    </p>
                    <p className="font-bold text-foreground mt-0.5 text-sm capitalize">{value}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative z-10 flex items-center justify-center gap-2 text-[10px] text-muted-foreground border-t border-white/5 pt-4"
              >
                <QrCode className="w-3 h-3" />
                <span className="font-mono uppercase tracking-widest">Token: {token}</span>
              </motion.div>
            </Card>
          )}
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
