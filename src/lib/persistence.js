import { PRO_ENABLED } from "../app/pro";

// Live tournament recovery (this event's progress) and Pro presentation
// preferences (theme/logo/sounds) are deliberately separate storages --
// see Gate 2 design doc. Neither is the same thing as Save/Load Config
// (a reusable setup for FUTURE tournaments), which is untouched by this
// module.

export const TOURNAMENT_SCHEMA_VERSION = 1;
export const PREFERENCES_SCHEMA_VERSION = 1;

const TOURNAMENT_LS_KEY = "pcp:tournament:v1";
const PREFERENCES_LS_KEY = "pcp:preferences:v1";

function appVersion() {
  try {
    return import.meta.env.VITE_APP_VERSION || null;
  } catch {
    return null;
  }
}

// ---------- localStorage backend (site/demo) ----------

function lsSave(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Quota exceeded, storage disabled/cleared, private-mode restrictions,
    // etc. Non-fatal: the tournament keeps running, it just won't be
    // recoverable for this write.
  }
}

function lsLoad(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ---------- Pro local-file backend (via the existing local server) ----------

function fileSave(endpoint, payload) {
  try {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {});
  } catch {
    // Non-fatal, same reasoning as lsSave.
  }
}

async function fileLoad(endpoint) {
  try {
    const res = await fetch(endpoint);
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.found ? data.payload : null;
  } catch {
    return null;
  }
}

// ---------- validation ----------

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function isValidTournamentPayload(payload) {
  if (!isPlainObject(payload)) return false;
  if (payload.schemaVersion !== TOURNAMENT_SCHEMA_VERSION) return false;
  if (typeof payload.savedAt !== "number") return false;

  const t = payload.tournament;
  if (!isPlainObject(t)) return false;
  if (!Array.isArray(t.blinds) || t.blinds.length === 0) return false;
  if (typeof t.currentRoundIndex !== "number") return false;
  if (!isPlainObject(t.timer)) return false;
  if (!["idle", "running", "paused", "finished"].includes(t.timer.status))
    return false;

  return true;
}

function isValidPreferencesPayload(payload) {
  if (!isPlainObject(payload)) return false;
  if (payload.schemaVersion !== PREFERENCES_SCHEMA_VERSION) return false;
  if (!isPlainObject(payload.preferences)) return false;
  return true;
}

// ---------- tournament (live session autosave) ----------

export function buildTournamentSnapshot(state) {
  return {
    schemaVersion: TOURNAMENT_SCHEMA_VERSION,
    savedAt: Date.now(),
    appVersion: appVersion(),
    tournament: {
      title: state.title,
      buyInValue: state.buyInValue,
      rebuyValue: state.rebuyValue,
      buyIns: state.buyIns,
      rebuys: state.rebuys,
      prize: state.prize,
      blinds: state.blinds,
      currentRoundIndex: state.currentRoundIndex,
      timer: {
        status: state.timer.status,
        remainingSec: state.timer.remainingSec,
        endsAtMs: state.timer.endsAtMs ?? null,
      },
    },
  };
}

export function saveTournament(state) {
  const payload = buildTournamentSnapshot(state);
  if (PRO_ENABLED) {
    fileSave("/api/state/tournament", payload);
  } else {
    lsSave(TOURNAMENT_LS_KEY, payload);
  }
}

export async function loadTournament() {
  const payload = PRO_ENABLED
    ? await fileLoad("/api/state/tournament")
    : lsLoad(TOURNAMENT_LS_KEY);

  if (!isValidTournamentPayload(payload)) return null;
  return payload;
}

// ---------- Pro presentation preferences ----------

export function buildPreferencesSnapshot(state) {
  return {
    schemaVersion: PREFERENCES_SCHEMA_VERSION,
    savedAt: Date.now(),
    appVersion: appVersion(),
    preferences: {
      theme: state.theme,
      logoDataUrl: state.logoDataUrl ?? null,
      sounds: state.sounds ?? null,
    },
  };
}

export function savePreferences(state) {
  if (!PRO_ENABLED) return; // Pro-only concept; nothing to persist in the free build.
  fileSave("/api/state/preferences", buildPreferencesSnapshot(state));
}

export async function loadPreferences() {
  if (!PRO_ENABLED) return null;
  const payload = await fileLoad("/api/state/preferences");
  if (!isValidPreferencesPayload(payload)) return null;
  return payload;
}
