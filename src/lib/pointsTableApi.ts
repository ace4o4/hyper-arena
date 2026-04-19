// ─── Server-synced Points Table API ─────────────────────────────────────────
// Writes go to: localStorage (persistence) + Vite /api/pts (cross-process sync)
// Reads come from: /api/pts (so OBS gets same data as admin browser)

export type Game = 'bgmi' | 'freefire';

export interface TeamData {
  id: string;
  name: string;
  logo: string;
  kills: number;
  placement_pts: number;
  wins: number;
  total: number;         // AUTO: kills + placement_pts
}

// ── Internal helpers ─────────────────────────────────────────────────────────

const key = (game: Game) => `pts_${game}`;
const API_BASE = '/api/pts';

// Read from localStorage (local fast cache)
const readLocal = (game: Game): TeamData[] => {
  try {
    const raw = localStorage.getItem(key(game));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

// Write to both localStorage AND the Vite server (so OBS can GET it)
const write = async (game: Game, teams: TeamData[]) => {
  const json = JSON.stringify(teams);
  localStorage.setItem(key(game), json);

  // Push to Vite in-memory store so OBS Browser Source can read it
  try {
    await fetch(`${API_BASE}?game=${game}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
    });
  } catch { /* ignore if server not available */ }

  // Notify same-tab listeners
  window.dispatchEvent(new CustomEvent('pts_sync', { detail: game }));
  // Notify other browser windows/tabs
  try {
    new BroadcastChannel('hyper_arena_pts').postMessage({ game });
  } catch { /* ignore */ }
};

const sorted = (teams: TeamData[]) =>
  [...teams].sort((a, b) => b.total - a.total);

const recalc = (t: Omit<TeamData, 'total'>): TeamData => ({
  ...t,
  total: t.kills + t.placement_pts,
});

// ── Public API ────────────────────────────────────────────────────────────────

/** Subscribe to live updates. Returns unsubscribe fn. */
export const subscribeToTeams = (
  game: Game,
  cb: (teams: TeamData[]) => void
): (() => void) => {

  // Read: prefer server (so OBS gets correct data), fall back to localStorage
  const load = async () => {
    try {
      const res = await fetch(`${API_BASE}?game=${game}`, { cache: 'no-store' });
      if (res.ok) {
        const data: TeamData[] = await res.json();
        cb(sorted(data));
        // Sync to localStorage as cache
        localStorage.setItem(key(game), JSON.stringify(data));
        return;
      }
    } catch { /* server not up, fall through */ }
    cb(sorted(readLocal(game)));
  };

  load(); // initial

  // Same-tab event
  const onSyncEvent = (e: Event) => {
    if ((e as CustomEvent).detail === game) load();
  };
  // Cross-tab storage event
  const onStorage = (e: StorageEvent) => {
    if (e.key === key(game)) load();
  };

  window.addEventListener('pts_sync', onSyncEvent);
  window.addEventListener('storage', onStorage);

  // Poll every 1.5s (guarantees OBS always gets fresh data)
  const pollInterval = setInterval(load, 1500);

  return () => {
    window.removeEventListener('pts_sync', onSyncEvent);
    window.removeEventListener('storage', onStorage);
    clearInterval(pollInterval);
  };
};

/** Add a brand-new team with all stats at 0 */
export const addTeam = (game: Game, name: string, logo = '🎮') => {
  const teams = readLocal(game);
  const newTeam: TeamData = {
    id: `${Date.now()}`,
    name: name.trim(),
    logo,
    kills: 0,
    placement_pts: 0,
    wins: 0,
    total: 0,
  };
  write(game, [...teams, newTeam]);
};

/** Fully overwrite a team's editable fields */
export const updateTeam = (
  game: Game,
  teamId: string,
  updates: Partial<Omit<TeamData, 'id' | 'total'>>
) => {
  write(
    game,
    readLocal(game).map((t) =>
      t.id === teamId ? recalc({ ...t, ...updates }) : t
    )
  );
};

/** +/- kills */
export const addKill = (game: Game, teamId: string, delta: number) => {
  write(
    game,
    readLocal(game).map((t) => {
      if (t.id !== teamId) return t;
      const kills = Math.max(0, t.kills + delta);
      return recalc({ ...t, kills });
    })
  );
};

/** +/- placement points */
export const addPlacement = (game: Game, teamId: string, delta: number) => {
  write(
    game,
    readLocal(game).map((t) => {
      if (t.id !== teamId) return t;
      const placement_pts = Math.max(0, t.placement_pts + delta);
      return recalc({ ...t, placement_pts });
    })
  );
};

/** +/- win count */
export const addWin = (game: Game, teamId: string, delta = 1) => {
  write(
    game,
    readLocal(game).map((t) =>
      t.id === teamId
        ? { ...t, wins: Math.max(0, t.wins + delta) }
        : t
    )
  );
};

/** Reset a team's stats */
export const resetTeam = (game: Game, teamId: string) => {
  write(
    game,
    readLocal(game).map((t) =>
      t.id === teamId
        ? { ...t, kills: 0, placement_pts: 0, wins: 0, total: 0 }
        : t
    )
  );
};

/** Permanently delete a team */
export const deleteTeam = (game: Game, teamId: string) => {
  write(game, readLocal(game).filter((t) => t.id !== teamId));
};
