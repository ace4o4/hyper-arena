// ─── localStorage-based Points Table API ───────────────────────────────────
// No backend needed. Data persists in browser.
// Switch to Firebase later by replacing these functions only.

export type Game = 'bgmi' | 'freefire';

export interface TeamData {
  id: string;
  name: string;
  logo: string;
  kills: number;
  placement_pts: number; // cumulative placement points across matches
  wins: number;          // chicken dinner count
  total: number;         // AUTO: kills + placement_pts
}

// ── Internal helpers ────────────────────────────────────────────────────────

const key = (game: Game) => `pts_${game}`;

const SYNC_EVENT = 'pts_sync'; // custom event for same-tab reactivity

const read = (game: Game): TeamData[] => {
  try {
    const raw = localStorage.getItem(key(game));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const write = (game: Game, teams: TeamData[]) => {
  localStorage.setItem(key(game), JSON.stringify(teams));
  // Notify all listeners in the same tab
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: game }));
};

const sorted = (teams: TeamData[]) =>
  [...teams].sort((a, b) => b.total - a.total);

const recalc = (t: Omit<TeamData, 'total'>): TeamData => ({
  ...t,
  total: t.kills + t.placement_pts,
});

// ── Public API ───────────────────────────────────────────────────────────────

/** Subscribe to live updates for a game. Returns unsubscribe fn. */
export const subscribeToTeams = (
  game: Game,
  cb: (teams: TeamData[]) => void
): (() => void) => {
  const load = () => cb(sorted(read(game)));
  load(); // initial call

  const onSyncEvent = (e: Event) => {
    if ((e as CustomEvent).detail === game) load();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === key(game)) load();
  };

  window.addEventListener(SYNC_EVENT, onSyncEvent);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(SYNC_EVENT, onSyncEvent);
    window.removeEventListener('storage', onStorage);
  };
};

/** Add a brand-new team with all stats at 0 */
export const addTeam = (game: Game, name: string, logo = '🎮') => {
  const teams = read(game);
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
    read(game).map((t) =>
      t.id === teamId ? recalc({ ...t, ...updates }) : t
    )
  );
};

/** +/- kills (1 kill = 1 pt in total) */
export const addKill = (game: Game, teamId: string, delta: number) => {
  write(
    game,
    read(game).map((t) => {
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
    read(game).map((t) => {
      if (t.id !== teamId) return t;
      const placement_pts = Math.max(0, t.placement_pts + delta);
      return recalc({ ...t, placement_pts });
    })
  );
};

/** +/- win count (wins are display-only, not added to total) */
export const addWin = (game: Game, teamId: string, delta = 1) => {
  write(
    game,
    read(game).map((t) =>
      t.id === teamId
        ? { ...t, wins: Math.max(0, t.wins + delta) }
        : t
    )
  );
};

/** Reset a team's stats to all zeros */
export const resetTeam = (game: Game, teamId: string) => {
  write(
    game,
    read(game).map((t) =>
      t.id === teamId
        ? { ...t, kills: 0, placement_pts: 0, wins: 0, total: 0 }
        : t
    )
  );
};

/** Permanently delete a team */
export const deleteTeam = (game: Game, teamId: string) => {
  write(game, read(game).filter((t) => t.id !== teamId));
};
