import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Target, Trophy, Zap, Plus, Minus,
  Trash2, RotateCcw, UserPlus, Crosshair, Wifi,
  ChevronRight, Pencil, Check, X, MapPin,
  Monitor, ExternalLink, Copy, CheckCheck, QrCode, Camera, AlertTriangle, Users as UsersIcon,
} from 'lucide-react';
import { mockApi, type TeamRecord } from '@/lib/mockApi';
import { useToast } from '@/hooks/use-toast';
import {
  Game, TeamData,
  subscribeToTeams, setKills, setPlacement, setWins,
  addTeam, updateTeam, resetTeam, deleteTeam,
} from '@/lib/pointsTableApi';

const ADMIN_PIN = '21468';

// ─────────────────────────────────────────
// PIN Screen
// ─────────────────────────────────────────
const PinScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState('');

  const handleKey = (key: string) => {
    if (key === 'DEL') { setPin((p) => p.slice(0, -1)); return; }
    if (pin.length >= 5) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 5) {
      if (next === ADMIN_PIN) {
        onUnlock();
      } else {
        setError('INVALID PIN — ACCESS DENIED');
        setShake(true);
        setTimeout(() => { setShake(false); setPin(''); setError(''); }, 1400);
      }
    }
  };

  const KEYS = ['1','2','3','4','5','6','7','8','9','DEL','0','⏎'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `linear-gradient(to right,hsl(var(--primary)/.5) 1px,transparent 1px),
                          linear-gradient(to bottom,hsl(var(--primary)/.5) 1px,transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        animate={shake ? { x: [-12,12,-10,10,-6,6,0] } : {}}
        transition={{ duration: 0.45 }}
        className="relative z-10 w-full max-w-[340px] mx-4"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ opacity: [0.5,1,0.5], scale: [0.98,1.02,0.98] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="inline-flex items-center justify-center w-20 h-20 border-2 border-primary/60 bg-primary/10 mb-4"
            style={{ clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}
          >
            <Shield className="w-9 h-9 text-primary" />
          </motion.div>
          <h1 className="font-orbitron font-black text-2xl text-gradient-primary tracking-widest">ADMIN ACCESS</h1>
          <p className="text-muted-foreground text-xs mt-1 font-rajdhani uppercase tracking-[0.2em]">
            Hyper Arena · Control System
          </p>
        </div>

        <div className="glass border border-primary/20 p-6 mb-4"
          style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}
        >
          <div className="flex justify-center gap-3 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                animate={pin.length > i ? { scale: [1.3,1] } : {}}
                transition={{ duration: 0.15 }}
                className={`w-10 h-10 border-2 flex items-center justify-center text-primary font-black text-lg transition-colors ${
                  pin.length > i ? 'border-primary bg-primary/25' : 'border-white/15'
                }`}
              >
                {pin.length > i ? '●' : ''}
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity:0,y:-4 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
                className="text-destructive text-[11px] text-center font-bold tracking-[0.15em]">
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Lock className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Enter 5-digit PIN</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <motion.button key={key}
              onClick={() => handleKey(key === '⏎' ? '' : key)}
              whileTap={{ scale: 0.88 }}
              className={`h-14 glass border font-orbitron font-bold text-lg tracking-wider transition-all ${
                key === 'DEL' ? 'border-destructive/35 text-destructive hover:bg-destructive/10' :
                key === '⏎'  ? 'border-primary/35 text-primary hover:bg-primary/10' :
                               'border-white/10 text-foreground hover:border-primary/35 hover:bg-primary/5'
              }`}
            >{key}</motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// ─────────────────────────────────────────
// Stat Control (Compact with direct input)
// ─────────────────────────────────────────
const StatControl = ({
  label, icon, value, onUpdate, colorClass = 'text-primary'
}: {
  label: string; icon: React.ReactNode; value: number;
  onUpdate: (val: number) => void; colorClass?: string;
}) => {
  return (
    <div className="flex flex-col gap-1.5 p-2 bg-black/40 border border-white/5 rounded-md hover:border-white/10 transition-colors shadow-inner">
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-1 justify-center">
        {icon} {label}
      </div>
      <div className="flex items-center justify-between bg-black/60 border border-white/10 rounded overflow-hidden">
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onUpdate(Math.max(0, value - 1))}
          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-destructive/20 hover:text-destructive text-muted-foreground transition-colors shrink-0">
          <Minus className="w-3 h-3" />
        </motion.button>
        <input 
          type="number" 
          value={value === 0 ? '' : value}
          placeholder="0"
          onChange={(e) => {
            const val = e.target.value === '' ? 0 : parseInt(e.target.value);
            if (!isNaN(val)) onUpdate(Math.max(0, val));
          }}
          className={`w-full min-w-0 bg-transparent text-center font-orbitron font-bold text-base focus:outline-none focus:bg-white/5 ${colorClass}`}
        />
        <motion.button whileTap={{ scale: 0.9 }} onClick={() => onUpdate(value + 1)}
          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-primary/20 hover:text-primary text-muted-foreground transition-colors shrink-0">
          <Plus className="w-3 h-3" />
        </motion.button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Team Card
// ─────────────────────────────────────────
const TeamCard = ({
  team, game, onOptimisticUpdate,
}: {
  team: TeamData;
  game: Game;
  // Instantly patches admin UI — OBS overlay reads independently from Supabase
  onOptimisticUpdate: (teamId: string, patch: Partial<TeamData>) => void;
}) => {
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({
    name: team.name, logo: team.logo,
  });
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // sync draft if props change from outside
  useEffect(() => {
    if (!editMode) {
      setDraft({ name: team.name, logo: team.logo });
    }
  }, [team, editMode]);

  const saveEdit = async () => {
    await updateTeam(game, team.id, {
      name: draft.name.trim() || team.name,
      logo: draft.logo || '🎮',
    });
    setEditMode(false);
  };

  return (
    <motion.div layout
      initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, scale:0.95 }}
      className="relative glass border border-white/10 p-4 overflow-hidden hover:border-primary/25 transition-colors"
      style={{ clipPath: 'polygon(0 0,calc(100% - 18px) 0,100% 18px,100% 100%,18px 100%,0 calc(100% - 18px))' }}
    >
      {/* corner accents */}
      <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-primary/40" />
      <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-primary/40" />

      {/* ── VIEW MODE ── */}
      {!editMode && (
        <>
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none">{team.logo}</span>
              <div>
                <h3 className="font-orbitron font-bold text-sm text-foreground">{team.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] text-muted-foreground uppercase tracking-widest">Total:</span>
                  <span className="text-primary font-black font-orbitron text-base">{team.total}</span>
                  <span className="text-[10px] text-muted-foreground">pts</span>
                </div>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-1 shrink-0">
              <motion.button whileTap={{ scale:0.88 }}
                onClick={() => setEditMode(true)}
                className="p-2 text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"
                title="Edit team">
                <Pencil className="w-4 h-4" />
              </motion.button>
              <motion.button whileTap={{ scale:0.88 }}
                onClick={() => setShowConfirmReset(true)}
                className="p-2 text-muted-foreground hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                title="Reset stats">
                <RotateCcw className="w-4 h-4" />
              </motion.button>
              <motion.button whileTap={{ scale:0.88 }}
                onClick={() => setShowConfirmDelete(true)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Delete team">
                <Trash2 className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Confirm delete */}
          <AnimatePresence>
            {showConfirmDelete && (
              <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}
                className="overflow-hidden mb-3">
                <div className="bg-destructive/10 border border-destructive/40 p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-destructive font-bold uppercase tracking-wider">Delete "{team.name}"?</p>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale:0.9 }}
                      onClick={() => { deleteTeam(game, team.id); setShowConfirmDelete(false); }}
                      className="px-3 py-1 bg-destructive/20 border border-destructive/50 text-destructive text-xs font-bold hover:bg-destructive/30 transition-all">
                      DELETE
                    </motion.button>
                    <motion.button whileTap={{ scale:0.9 }}
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-3 py-1 glass border border-white/10 text-muted-foreground text-xs font-bold hover:text-foreground transition-all">
                      CANCEL
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confirm reset */}
          <AnimatePresence>
            {showConfirmReset && (
              <motion.div initial={{ opacity:0,height:0 }} animate={{ opacity:1,height:'auto' }} exit={{ opacity:0,height:0 }}
                className="overflow-hidden mb-3">
                <div className="bg-yellow-500/10 border border-yellow-500/40 p-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Reset all stats to 0?</p>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale:0.9 }}
                      onClick={async () => { await resetTeam(game, team.id); setShowConfirmReset(false); }}
                      className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 text-xs font-bold hover:bg-yellow-500/30 transition-all">
                      RESET
                    </motion.button>
                    <motion.button whileTap={{ scale:0.9 }}
                      onClick={() => setShowConfirmReset(false)}
                      className="px-3 py-1 glass border border-white/10 text-muted-foreground text-xs font-bold hover:text-foreground transition-all">
                      CANCEL
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Compact Input Grid */}
          <div className="grid grid-cols-3 gap-2">
            <StatControl
              label="Kills"
              icon={<Target className="w-3 h-3"/>}
              value={team.kills}
              onUpdate={(v) => {
                const val = Math.max(0, v);
                onOptimisticUpdate(team.id, { kills: val, total: val + team.placement_pts });
                setKills(game, team.id, val); // saves to Supabase in background
              }}
            />
            <StatControl
              label="Placements"
              icon={<MapPin className="w-3 h-3"/>}
              value={team.placement_pts}
              colorClass="text-neon-cyan"
              onUpdate={(v) => {
                const val = Math.max(0, v);
                onOptimisticUpdate(team.id, { placement_pts: val, total: team.kills + val });
                setPlacement(game, team.id, val);
              }}
            />
            <StatControl
              label="Wins"
              icon={<Trophy className="w-3 h-3"/>}
              value={team.wins}
              colorClass="text-yellow-400"
              onUpdate={(v) => {
                const val = Math.max(0, v);
                onOptimisticUpdate(team.id, { wins: val });
                setWins(game, team.id, val);
              }}
            />
          </div>
        </>
      )}

      {/* ── EDIT MODE ── */}
      {editMode && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-primary font-orbitron font-bold text-xs uppercase tracking-widest">Edit Team Profile</h3>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale:0.9 }} onClick={saveEdit}
                className="flex items-center gap-1 px-3 py-1.5 bg-primary/20 border border-primary/40 text-primary text-xs font-bold hover:bg-primary/30 transition-all">
                <Check className="w-3 h-3" /> SAVE
              </motion.button>
              <motion.button whileTap={{ scale:0.9 }} onClick={() => setEditMode(false)}
                className="flex items-center gap-1 px-3 py-1.5 glass border border-white/10 text-muted-foreground text-xs font-bold hover:text-foreground transition-all">
                <X className="w-3 h-3" /> CANCEL
              </motion.button>
            </div>
          </div>

          <div className="space-y-3">
            {/* Logo + Name */}
            <div className="flex gap-2">
              <input type="text" value={draft.logo}
                onChange={(e) => setDraft({ ...draft, logo: e.target.value })}
                className="w-14 bg-background/60 border border-white/10 px-2 py-2.5 text-center text-xl focus:border-primary/50 focus:outline-none"
                maxLength={2} placeholder="🎮" />
              <input type="text" value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="flex-1 bg-background/60 border border-white/10 px-3 py-2.5 text-sm font-rajdhani text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                placeholder="Team name…" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────────
// Broadcast Panel (OBS Overlay Launcher)
// ─────────────────────────────────────────
const BroadcastPanel = () => {
  const [copiedGame, setCopiedGame] = useState<Game | null>(null);

  const getUrl = (game: Game) => `${window.location.origin}/overlay?game=${game}`;

  const openOverlay = (game: Game) => {
    window.open(getUrl(game), `overlay_${game}`, 'width=1920,height=1080,menubar=no,toolbar=no,location=no,scrollbars=no');
  };

  const copyUrl = (game: Game) => {
    navigator.clipboard.writeText(getUrl(game));
    setCopiedGame(game);
    setTimeout(() => setCopiedGame(null), 2000);
  };

  const games: { id: Game; label: string; icon: string; color: string }[] = [
    { id: 'bgmi',     label: 'BGMI',      icon: '🎯', color: 'rgba(168,85,247,0.15)' },
    { id: 'freefire', label: 'FREE FIRE', icon: '🔥', color: 'rgba(249,115,22,0.15)' },
  ];

  return (
    <div className="mb-6 glass border border-white/10 p-4"
      style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
      <div className="flex items-center gap-2 mb-4">
        <Monitor className="w-4 h-4 text-primary shrink-0" />
        <h2 className="font-orbitron font-bold text-xs tracking-widest text-primary uppercase">OBS Broadcast Overlay</h2>
        <span className="ml-auto text-[9px] uppercase tracking-widest text-muted-foreground">Copy URL → Paste in OBS Browser Source</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {games.map(({ id, label, icon, color }) => (
          <div key={id} className="border border-white/8 rounded-md overflow-hidden"
            style={{ background: color }}>
            {/* Game label */}
            <div className="px-3 py-2 flex items-center gap-2 border-b border-white/8">
              <span className="text-base leading-none">{icon}</span>
              <span className="font-orbitron font-bold text-xs tracking-widest text-foreground">{label}</span>
            </div>
            {/* URL display */}
            <div className="px-3 py-1.5 text-[9px] font-mono text-muted-foreground truncate border-b border-white/5">
              {getUrl(id)}
            </div>
            {/* Action buttons */}
            <div className="flex">
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => copyUrl(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all border-r border-white/8">
                {copiedGame === id
                  ? <><CheckCheck className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied!</span></>
                  : <><Copy className="w-3 h-3" /><span>Copy URL</span></>}
              </motion.button>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={() => openOverlay(id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-primary/10 transition-all">
                <ExternalLink className="w-3 h-3" />
                <span>Open</span>
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// QR Attendance Scanner Panel
// ─────────────────────────────────────────
type ScanResult = {
  teamName: string;
  game: string;
  memberRollNo: string;
  memberUid: string;
  memberRole: string;
  alreadyAttended: boolean;
  teamId: string;
};

const AttendanceScanner = () => {
  const { toast } = useToast();
  const [manualToken, setManualToken] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState('');
  const [marking, setMarking] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const processToken = useCallback(async (token: string) => {
    const trimmed = token.trim();
    if (!trimmed) return;
    setScanning(true);
    setScanResult(null);
    setScanError('');
    try {
      const result = await mockApi.scanQrAttendance(trimmed);
      setScanResult(result);
    } catch (err: unknown) {
      setScanError((err as Error)?.message || 'Could not read QR code.');
    } finally {
      setScanning(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
      scannerRef.current = null;
    }
    if (mountedRef.current) setCameraActive(false);
  }, []);

  // Start the scanner AFTER the container is visible in the DOM (useEffect fires post-render)
  useEffect(() => {
    if (!cameraActive) return;

    let scanner: { stop: () => Promise<void> } | null = null;

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (!mountedRef.current) return;
        scanner = new Html5Qrcode('qr-scanner-container') as unknown as { stop: () => Promise<void> };
        scannerRef.current = scanner;
        await (scanner as any).start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1 },
          (decodedText: string) => {
            void scanner!.stop().catch(() => {});
            scannerRef.current = null;
            if (mountedRef.current) {
              setCameraActive(false);
              void processToken(decodedText);
            }
          },
          () => { /* ignore non-fatal scan errors */ },
        );
        if (mountedRef.current) setCameraLoading(false);
      } catch (err: unknown) {
        if (mountedRef.current) {
          setCameraActive(false);
          setCameraLoading(false);
          toast({ title: 'Camera Error', description: (err as Error)?.message || 'Could not start camera.', variant: 'destructive' });
        }
      }
    };

    void initScanner();

    return () => {
      if (scanner) {
        scanner.stop().catch(() => {});
        scannerRef.current = null;
      }
    };
  }, [cameraActive, processToken, toast]);

  const startCamera = useCallback(() => {
    setCameraLoading(true);
    setCameraActive(true);
  }, []);

  useEffect(() => () => { stopCamera(); }, [stopCamera]);

  const handleMarkAttendance = async () => {
    if (!scanResult) return;
    setMarking(true);
    try {
      await mockApi.markAttendance(
        scanResult.teamId,
        scanResult.memberRole as 'leader' | 'player' | 'substitute',
        scanResult.memberRollNo,
      );
      setScanResult({ ...scanResult, alreadyAttended: true });
      toast({ title: '✅ Attendance Marked', description: `${scanResult.memberRollNo} — ${scanResult.teamName}` });
    } catch (err: unknown) {
      toast({ title: 'Error', description: (err as Error)?.message, variant: 'destructive' });
    } finally {
      setMarking(false);
    }
  };

  const reset = () => {
    setScanResult(null);
    setScanError('');
    setManualToken('');
  };

  return (
    <div className="mb-6 glass border border-yellow-400/30 p-4"
      style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-4 h-4 text-yellow-400 shrink-0" />
        <h2 className="font-orbitron font-bold text-xs tracking-widest text-yellow-400 uppercase">QR Attendance Scanner</h2>
        <span className="ml-auto text-[9px] uppercase tracking-widest text-muted-foreground">Scan or paste QR token</span>
      </div>

      {/* Camera scanner container — always in DOM, height-animated to avoid display:none flicker */}
      <div
        className="w-full rounded-lg mb-3 transition-[height] duration-300 relative"
        style={{ height: cameraActive ? 320 : 0, overflow: 'hidden' }}
      >
        <div id="qr-scanner-container" className="w-full h-full" />
        {cameraLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-yellow-400/40 border-t-yellow-400 rounded-full mb-2" />
            <p className="text-[10px] uppercase tracking-widest text-yellow-400">Starting camera…</p>
          </div>
        )}
      </div>

      {!scanResult && (
        <>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={manualToken}
              onChange={(e) => setManualToken(e.target.value)}
              placeholder="Paste QR token here…"
              className="flex-1 bg-background/60 border border-white/10 px-3 py-2 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:border-yellow-400/50 focus:outline-none rounded"
              onKeyDown={(e) => e.key === 'Enter' && void processToken(manualToken)}
            />
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={() => void processToken(manualToken)}
              disabled={scanning || !manualToken.trim()}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 transition-colors disabled:opacity-40">
              {scanning ? '…' : 'Lookup'}
            </motion.button>
          </div>
          <div className="flex justify-center">
            <motion.button whileTap={{ scale: 0.95 }}
              onClick={cameraActive ? stopCamera : startCamera}
              disabled={cameraLoading}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-colors disabled:opacity-60 ${
                cameraActive
                  ? 'border-destructive/40 text-destructive hover:bg-destructive/10'
                  : 'border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10'
              }`}>
              <Camera className="w-3 h-3" />
              {cameraLoading ? 'Starting…' : cameraActive ? 'Stop Camera' : 'Open Camera'}
            </motion.button>
          </div>
        </>
      )}

      {scanError && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/40 rounded flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
          <p className="text-xs text-destructive">{scanError}</p>
          <motion.button whileTap={{ scale: 0.9 }} onClick={reset} className="ml-auto text-xs text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></motion.button>
        </div>
      )}

      {scanResult && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className={`mt-3 p-4 rounded border ${scanResult.alreadyAttended ? 'bg-yellow-500/10 border-yellow-500/40' : 'bg-primary/10 border-primary/40'}`}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className={`font-orbitron font-bold text-sm ${scanResult.alreadyAttended ? 'text-yellow-400' : 'text-primary'}`}>
                {scanResult.alreadyAttended ? '⚠️ Already Attended' : '✅ Valid Ticket'}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-widest">
                {scanResult.alreadyAttended ? 'Entry denied — this QR was already scanned.' : 'First scan — entry allowed.'}
              </p>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} onClick={reset} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Team</p>
              <p className="font-bold text-foreground mt-0.5">{scanResult.teamName}</p>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Game</p>
              <p className="font-bold text-foreground mt-0.5">{scanResult.game}</p>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Roll No</p>
              <p className="font-bold font-mono text-foreground mt-0.5">{scanResult.memberRollNo}</p>
            </div>
            <div className="bg-black/40 p-2 rounded border border-white/5">
              <p className="text-muted-foreground uppercase tracking-widest text-[9px]">Role</p>
              <p className="font-bold text-foreground mt-0.5 capitalize">{scanResult.memberRole}</p>
            </div>
          </div>

          {!scanResult.alreadyAttended && (
            <motion.button whileTap={{ scale: 0.97 }}
              onClick={() => void handleMarkAttendance()}
              disabled={marking}
              className="w-full py-2.5 bg-primary/20 border border-primary/50 text-primary font-orbitron font-bold text-xs tracking-widest hover:bg-primary/30 transition-all disabled:opacity-40">
              {marking ? 'MARKING…' : 'MARK ATTENDANCE & ALLOW ENTRY'}
            </motion.button>
          )}

          <motion.button whileTap={{ scale: 0.97 }} onClick={reset}
            className="w-full mt-2 py-2 glass border border-white/10 text-muted-foreground font-orbitron font-bold text-[10px] tracking-widest hover:text-foreground transition-all">
            SCAN NEXT
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Main Admin Panel
// ─────────────────────────────────────────
const AdminPanel = () => {
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const [activeGame, setActiveGame] = useState<Game>('bgmi');
  const [teams, setTeams] = useState<TeamData[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newLogo, setNewLogo] = useState('🎮');
  const [paymentQueue, setPaymentQueue] = useState<TeamRecord[]>([]);
  const [isLoadingPaymentQueue, setIsLoadingPaymentQueue] = useState(false);
  const [reviewingTeamId, setReviewingTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (!unlocked) return;
    setTeams([]);
    return subscribeToTeams(activeGame, setTeams);
  }, [unlocked, activeGame]);

  const loadPaymentQueue = useCallback(async () => {
    if (!unlocked) return;

    setIsLoadingPaymentQueue(true);
    try {
      const queuedTeams = await mockApi.getTeamsByStatus('payment_review');
      setPaymentQueue(queuedTeams);
    } catch (error: any) {
      toast({
        title: 'Payment Queue Error',
        description: error?.message || 'Could not load payment queue.',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingPaymentQueue(false);
    }
  }, [toast, unlocked]);

  useEffect(() => {
    void loadPaymentQueue();
  }, [loadPaymentQueue]);

  // Optimistic update: instantly patches admin panel UI.
  // OBS Overlay is NOT affected — it reads directly from Supabase.
  // If Supabase call fails, 2s polling auto-corrects admin UI too.
  const optimisticUpdate = useCallback((teamId: string, patch: Partial<TeamData>) => {
    setTeams(prev =>
      [...prev.map(t => t.id === teamId ? { ...t, ...patch } : t)]
        .sort((a, b) => (b.total - a.total) || (b.wins - a.wins))
    );
  }, []);

  const handleAdd = useCallback(async () => {
    if (!newName.trim()) return;
    await addTeam(activeGame, newName.trim(), newLogo || '🎮');
    setNewName('');
    setNewLogo('🎮');
    setShowAdd(false);
  }, [activeGame, newName, newLogo]);

  const handlePaymentReview = useCallback(async (teamId: string, decision: 'approve' | 'reject') => {
    setReviewingTeamId(teamId);

    try {
      await mockApi.reviewTeamPayment(teamId, decision);
      setPaymentQueue((prev) => prev.filter((team) => team.id !== teamId));

      toast({
        title: decision === 'approve' ? 'Payment Confirmed' : 'Payment Rejected',
        description:
          decision === 'approve'
            ? 'Team moved to confirmed state and tickets are now unlocked.'
            : 'Team moved back to payment_pending for retry.',
      });
    } catch (error: any) {
      toast({
        title: 'Review Failed',
        description: error?.message || 'Could not update payment status.',
        variant: 'destructive',
      });
    } finally {
      setReviewingTeamId(null);
    }
  }, [toast]);

  if (!unlocked) return <PinScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ── Sticky Header ── */}
      <div className="sticky top-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(5,5,5,0.88)', backdropFilter: 'blur(20px)' }}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div>
              <h1 className="font-orbitron font-black text-sm text-gradient-primary tracking-wider">ADMIN PANEL</h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.15em] font-rajdhani">Match Control System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div animate={{ opacity: [1,0.25,1] }} transition={{ duration:1.6, repeat:Infinity }}
              className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-primary text-xs font-orbitron font-bold">LIVE</span>
            <Wifi className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">

        {/* ── OBS Broadcast Overlay ── */}
        <BroadcastPanel />

        {/* ── QR Attendance Scanner ── */}
        <AttendanceScanner />

        {/* ── Payment Review Queue ── */}
        <div className="mb-6 glass border border-neon-cyan/30 p-4"
          style={{ clipPath: 'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h2 className="font-orbitron font-bold text-xs tracking-widest text-neon-cyan uppercase">Payment Verification Queue</h2>
              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.14em]">Approve or reject submitted payment requests</p>
            </div>
            <motion.button whileTap={{ scale: 0.96 }}
              onClick={() => void loadPaymentQueue()}
              className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-colors">
              Refresh
            </motion.button>
          </div>

          {isLoadingPaymentQueue ? (
            <p className="text-xs text-muted-foreground">Loading payment queue...</p>
          ) : paymentQueue.length === 0 ? (
            <p className="text-xs text-muted-foreground">No team is waiting for payment verification.</p>
          ) : (
            <div className="space-y-2">
              {paymentQueue.map((team) => (
                <div key={team.id} className="p-3 border border-white/10 rounded-md bg-black/35">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-orbitron font-bold text-sm text-foreground">{team.teamName}</p>
                      <p className="text-[11px] text-muted-foreground">{team.game} • Leader: {team.leader.uid}</p>
                      <p className="text-[10px] text-muted-foreground mb-2">Requested: {new Date(team.updatedAt || team.createdAt).toLocaleString()}</p>
                      
                      <div className="flex flex-col gap-2 items-start mt-2">
                        {team.utrNumber && (
                           <div className="flex items-center gap-1.5 bg-black/40 px-2 py-1.5 rounded border border-white/10">
                               <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">UTR</span>
                               <span className="text-xs font-mono text-neon-cyan select-all">{team.utrNumber}</span>
                           </div>
                        )}
                        {team.paymentScreenshotUrl && (
                           <a href={team.paymentScreenshotUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-[10px] uppercase font-bold text-primary hover:bg-primary/20 transition-colors bg-primary/10 px-2 py-1.5 rounded border border-primary/30">
                               <ExternalLink className="w-3 h-3" /> View Proof
                           </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.95 }}
                        disabled={reviewingTeamId === team.id}
                        onClick={() => void handlePaymentReview(team.id, 'approve')}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-primary/40 text-primary hover:bg-primary/15 transition-colors disabled:opacity-50">
                        Confirm
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }}
                        disabled={reviewingTeamId === team.id}
                        onClick={() => void handlePaymentReview(team.id, 'reject')}
                        className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border border-destructive/40 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50">
                        Reject
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Game Tabs ── */}
        <div className="flex gap-2 mb-6">
          {(['bgmi','freefire'] as Game[]).map((g) => (
            <motion.button key={g} whileTap={{ scale:0.97 }}
              onClick={() => setActiveGame(g)}
              className={`flex-1 relative py-3.5 font-orbitron font-bold text-sm tracking-widest transition-all glass border border-white/10 ${
                activeGame === g ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}>
              {activeGame === g && (
                <motion.div layoutId="adminTab"
                  className="absolute inset-0 bg-primary/15 border border-primary/40"
                  transition={{ type:'spring', bounce:0.2, duration:0.4 }} />
              )}
              <span className="relative z-10 flex justify-center items-center gap-2">
                {g === 'bgmi' ? '🎯 BGMI' : '🔥 FREE FIRE'}
              </span>
            </motion.button>
          ))}
        </div>

        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-4 gap-2 mb-5">
          {[
            { icon: <Crosshair className="w-4 h-4"/>, label:'Teams',    value: teams.length },
            { icon: <Target    className="w-4 h-4"/>, label:'Kills',    value: teams.reduce((a,t)=>a+t.kills,0) },
            { icon: <MapPin    className="w-4 h-4"/>, label:'Plc Pts',  value: teams.reduce((a,t)=>a+t.placement_pts,0) },
            { icon: <Trophy    className="w-4 h-4"/>, label:'Wins',     value: teams.reduce((a,t)=>a+t.wins,0) },
          ].map((s) => (
            <div key={s.label}
              className="glass border border-primary/20 p-2 text-center"
              style={{ clipPath:'polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))' }}>
              <div className="text-primary mb-1 flex justify-center">{s.icon}</div>
              <div className="font-orbitron font-black text-lg text-foreground leading-none">{s.value}</div>
              <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Add Team ── */}
        <motion.button whileTap={{ scale:0.98 }}
          onClick={() => setShowAdd(!showAdd)}
          className="w-full py-3 mb-4 glass border border-dashed border-primary/40 text-primary font-orbitron font-bold text-sm hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
          <UserPlus className="w-4 h-4" />
          {showAdd ? 'CANCEL' : 'ADD NEW TEAM'}
        </motion.button>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}
              className="overflow-hidden mb-5">
              <div className="glass border border-primary/30 p-4"
                style={{ clipPath:'polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))' }}>
                <h3 className="text-primary font-orbitron font-bold text-xs uppercase tracking-widest mb-3">New Team</h3>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={newLogo} onChange={(e)=>setNewLogo(e.target.value)} maxLength={2}
                    className="w-14 bg-background/60 border border-white/10 px-2 py-2.5 text-center text-xl focus:border-primary/50 focus:outline-none"
                    placeholder="🎮" />
                  <input type="text" value={newName} onChange={(e)=>setNewName(e.target.value)}
                    onKeyDown={(e)=>e.key==='Enter' && handleAdd()}
                    className="flex-1 bg-background/60 border border-white/10 px-3 py-2.5 text-sm font-rajdhani text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none"
                    placeholder="Team name…" />
                </div>
                <p className="text-[10px] text-muted-foreground mb-3">All stats start at 0 — update after each match.</p>
                <motion.button whileTap={{ scale:0.97 }} onClick={handleAdd}
                  disabled={!newName.trim()}
                  className="w-full py-2.5 bg-primary/20 border border-primary/40 text-primary font-orbitron font-bold text-sm hover:bg-primary/30 transition-all disabled:opacity-40">
                  CREATE TEAM
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Teams List ── */}
        {teams.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Crosshair className="w-14 h-14 mx-auto mb-4 opacity-20" />
            <p className="font-orbitron text-base">NO TEAMS YET</p>
            <p className="text-sm mt-2 opacity-60">Add teams using the button above</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-widest">
              <ChevronRight className="w-3 h-3 text-primary" />
              {teams.length} teams · sorted by total points ↓
            </div>
            <AnimatePresence mode="popLayout">
              {teams.map((team) => (
                <TeamCard key={team.id} team={team} game={activeGame} onOptimisticUpdate={optimisticUpdate} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
