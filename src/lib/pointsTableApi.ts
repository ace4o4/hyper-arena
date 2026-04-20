// ─── Supabase-backed Points Table API ────────────────────────────────────────
// Optimistic-update friendly: all write functions take absolute values (not deltas)
// so they do a single UPDATE with no pre-fetch SELECT needed.

import { supabase } from './supabase';

export type Game = 'bgmi' | 'freefire';

export interface TeamData {
  id: string;
  name: string;
  logo: string;
  kills: number;
  placement_pts: number;
  wins: number;
  total: number; // GENERATED ALWAYS AS (kills + placement_pts) STORED
}

const tbl = (game: Game) => `points_${game}`;

// ── Fetch all teams sorted ────────────────────────────────────────────────────
const fetchTeams = async (game: Game): Promise<TeamData[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(tbl(game))
    .select('id, name, logo, kills, placement_pts, wins, total')
    .order('total', { ascending: false })
    .order('wins',  { ascending: false });
  if (error) { console.error('[pts fetch]', error.message); return []; }
  return (data ?? []) as TeamData[];
};

// ── subscribeToTeams ──────────────────────────────────────────────────────────
// Realtime (instant when WS works) + 2s polling fallback (always works)
export const subscribeToTeams = (
  game: Game,
  cb: (teams: TeamData[]) => void
): (() => void) => {
  if (!supabase) { console.error('[pts] Supabase not configured.'); return () => {}; }

  let destroyed = false;
  const notify = async () => {
    if (destroyed) return;
    const teams = await fetchTeams(game);
    if (!destroyed) cb(teams);
  };

  notify(); // initial load

  // Realtime — fires instantly when DB changes
  const channel = supabase
    .channel(`pts_${game}_${Date.now()}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: tbl(game) }, () => notify())
    .subscribe();

  // 2s polling fallback
  const poll = setInterval(notify, 2000);

  return () => {
    destroyed = true;
    clearInterval(poll);
    supabase.removeChannel(channel);
  };
};

// ── Write functions — single UPDATE, no SELECT needed ────────────────────────

export const addTeam = async (game: Game, name: string, logo = '🎮') => {
  if (!supabase) return;
  const { error } = await supabase.from(tbl(game)).insert([{ name: name.trim(), logo }]);
  if (error) console.error('[addTeam]', error.message);
};

export const updateTeam = async (
  game: Game,
  teamId: string,
  updates: Partial<Omit<TeamData, 'id' | 'total'>>
) => {
  if (!supabase) return;
  const { error } = await supabase.from(tbl(game)).update(updates).eq('id', teamId);
  if (error) console.error('[updateTeam]', error.message);
};

// These take ABSOLUTE values (not deltas) — caller (AdminPanel) knows current value
// so no SELECT round-trip needed → half the latency
export const setKills = async (game: Game, teamId: string, value: number) => {
  if (!supabase) return;
  await supabase.from(tbl(game)).update({ kills: Math.max(0, value) }).eq('id', teamId);
};

export const setPlacement = async (game: Game, teamId: string, value: number) => {
  if (!supabase) return;
  await supabase.from(tbl(game)).update({ placement_pts: Math.max(0, value) }).eq('id', teamId);
};

export const setWins = async (game: Game, teamId: string, value: number) => {
  if (!supabase) return;
  await supabase.from(tbl(game)).update({ wins: Math.max(0, value) }).eq('id', teamId);
};

// Keep old names as aliases for backward compat
export const addKill = (game: Game, teamId: string, delta: number) => setKills(game, teamId, delta);
export const addPlacement = (game: Game, teamId: string, delta: number) => setPlacement(game, teamId, delta);
export const addWin = (game: Game, teamId: string, delta: number) => setWins(game, teamId, delta);

export const resetTeam = async (game: Game, teamId: string) => {
  if (!supabase) return;
  const { error } = await supabase
    .from(tbl(game))
    .update({ kills: 0, placement_pts: 0, wins: 0 })
    .eq('id', teamId);
  if (error) console.error('[resetTeam]', error.message);
};

export const deleteTeam = async (game: Game, teamId: string) => {
  if (!supabase) return;
  const { error } = await supabase.from(tbl(game)).delete().eq('id', teamId);
  if (error) console.error('[deleteTeam]', error.message);
};
