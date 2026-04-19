import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface TournamentCardData {
  id: string;
  title: string;
  game: string;
  prize: string;
  slots: number;
  filled: number;
  date: string;
  isLive: boolean;
  entryFee: string;
  isActive: boolean;
}

interface TournamentGridData {
  active: TournamentCardData[];
  comingSoon: TournamentCardData[];
  source: "supabase" | "fallback";
}

interface TournamentRow {
  id: string;
  title: string;
  game: string | null;
  prize_pool: number | null;
  slot_capacity: number | null;
  slots_filled: number | null;
  entry_fee: number | null;
  starts_at: string | null;
  status: string | null;
}

const fallbackActive: TournamentCardData[] = [
  {
    id: "fallback-gcb",
    title: "GCB Esports Tournament",
    game: "BGMI & FREE FIRE",
    prize: "TBA",
    slots: 112,
    filled: 80,
    date: "24 APR 2026",
    isLive: false,
    entryFee: "INR 100",
    isActive: true,
  },
];

const fallbackComingSoon: TournamentCardData[] = [
  {
    id: "fallback-squad-showdown",
    title: "Squad Showdown",
    game: "BGMI",
    prize: "INR 75,000",
    date: "Coming Soon",
    isActive: false,
    isLive: false,
    entryFee: "TBD",
    slots: 100,
    filled: 0,
  },
  {
    id: "fallback-solo-masters",
    title: "Solo Masters",
    game: "Free Fire",
    prize: "INR 40,000",
    date: "Coming Soon",
    isActive: false,
    isLive: false,
    entryFee: "TBD",
    slots: 100,
    filled: 0,
  },
];

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function normalizeTournament(row: TournamentRow): TournamentCardData {
  const prize = row.prize_pool ? currency.format(row.prize_pool) : "TBD";
  const entryFee = row.entry_fee ? currency.format(row.entry_fee) : "TBD";
  const slots = row.slot_capacity ?? 0;
  const filled = row.slots_filled ?? 0;
  const startsAt = row.starts_at ? new Date(row.starts_at) : null;

  return {
    id: row.id,
    title: row.title,
    game: row.game ?? "Unknown",
    prize,
    slots,
    filled,
    date: startsAt ? dateFormatter.format(startsAt) : "Coming Soon",
    isLive: row.status === "active",
    entryFee,
    isActive: row.status === "active",
  };
}

export async function getTournamentGridData(): Promise<TournamentGridData> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      active: fallbackActive,
      comingSoon: fallbackComingSoon,
      source: "fallback",
    };
  }

  const { data, error } = await supabase
    .from("tournaments")
    .select("id,title,game,prize_pool,slot_capacity,slots_filled,entry_fee,starts_at,status")
    .order("starts_at", { ascending: true });

  if (error || !data) {
    return {
      active: fallbackActive,
      comingSoon: fallbackComingSoon,
      source: "fallback",
    };
  }

  const rows = data as TournamentRow[];
  const normalized = rows.map(normalizeTournament);

  const active = normalized.filter((tournament) => tournament.isActive);
  const comingSoon = normalized.filter((tournament) => !tournament.isActive);

  return {
    active: active.length > 0 ? active : fallbackActive,
    comingSoon: comingSoon.length > 0 ? comingSoon : fallbackComingSoon,
    source: "supabase",
  };
}
