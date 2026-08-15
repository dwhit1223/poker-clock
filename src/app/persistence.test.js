import { describe, it, expect, beforeEach } from "vitest";
import { reducer, advanceToNow } from "./reducer";
import { hasMeaningfulProgress } from "./selectors";
import { createInitialState } from "./initialState";
import {
  loadTournament,
  saveTournament,
  TOURNAMENT_SCHEMA_VERSION,
} from "../lib/persistence";

function blindRound(small, big, minutes) {
  return { type: "blind", small, big, durationSec: minutes * 60 };
}

function breakRound(minutes) {
  return { type: "break", durationSec: minutes * 60 };
}

function baseState(overrides = {}) {
  return {
    title: "Test Tournament",
    buyInValue: 40,
    rebuyValue: 40,
    buyIns: 20,
    rebuys: 0,
    prize: {
      mode: "percent",
      dealerPay: 0,
      bountyPay: 0,
      places: [{ label: "1st", type: "percent", value: 100 }],
    },
    blinds: [
      blindRound(5, 10, 20), // idx 0
      blindRound(10, 20, 20), // idx 1
      blindRound(20, 40, 20), // idx 2 -- "Level 3" in the audit's example
      breakRound(10), // idx 3
      blindRound(50, 100, 20), // idx 4
    ],
    currentRoundIndex: 2,
    timer: { status: "idle", remainingSec: 1200, endsAtMs: null, lastTickMs: null },
    ui: {
      settingsOpen: false,
      flash: false,
      lastTransitionAt: null,
      oneMinuteWarnedRoundIndex: null,
      oneMinuteWarningEventAt: null,
    },
    theme: { presetKey: "casinoClassic", displayFont: "Oswald", bodyFont: "Inter", primaryColor: "#f59e0b", timerColor: "#ffffff" },
    sounds: { blindUpUrl: null, oneMinuteUrl: null, breakUrl: null },
    logoDataUrl: null,
    ...overrides,
  };
}

describe("advanceToNow (shared round-advance math)", () => {
  it("audit example: 12:00 remaining, 5 minutes elapsed -> 7:00 remaining, same round", () => {
    const start = 1_000_000;
    const endsAtMs = start + 12 * 60 * 1000; // 12:00 remaining at `start`
    const nowMs = start + 5 * 60 * 1000; // 5 minutes later

    const result = advanceToNow(baseState().blinds, 2, endsAtMs, nowMs);

    expect(result.idx).toBe(2);
    expect(result.remaining).toBe(7 * 60);
    expect(result.transitioned).toBe(false);
    expect(result.finished).toBe(false);
  });

  it("crosses exactly one level", () => {
    const blinds = baseState().blinds;
    const start = 1_000_000;
    const endsAtMs = start + 30 * 1000; // 30s remaining on level 2 (idx 2)
    const nowMs = start + 90 * 1000; // 90s later: 60s into level 3 (break, 10 min)

    const result = advanceToNow(blinds, 2, endsAtMs, nowMs);

    expect(result.idx).toBe(3); // the break round
    expect(result.remaining).toBe(10 * 60 - 60);
    expect(result.transitioned).toBe(true);
  });

  it("crosses multiple levels and a break in one call", () => {
    // idx 2 has 5 min left; closed for 25 min; idx 3 is a 10-min break,
    // idx 4 is a 20-min blind level.
    const blinds = baseState().blinds;
    const start = 1_000_000;
    const endsAtMs = start + 5 * 60 * 1000;
    const nowMs = start + 25 * 60 * 1000; // 20 minutes past the 5-min mark

    const result = advanceToNow(blinds, 2, endsAtMs, nowMs);

    // 5 min consumes level 2. Remaining 20 min: 10 min consumes the
    // break (idx 3), leaving 10 min into level 4 (20 min), so 10 min left.
    expect(result.idx).toBe(4);
    expect(result.remaining).toBe(10 * 60);
    expect(result.transitioned).toBe(true);
  });

  it("reports finished when elapsed time runs past the last round", () => {
    const blinds = baseState().blinds;
    const start = 1_000_000;
    const endsAtMs = start + 1000;
    const nowMs = start + 999_999_999; // absurdly far past the end

    const result = advanceToNow(blinds, blinds.length - 1, endsAtMs, nowMs);

    expect(result.finished).toBe(true);
    expect(result.remaining).toBe(0);
  });
});

describe("RESTORE_TOURNAMENT", () => {
  it("paused: restores the same round and remainingSec verbatim, no time math", () => {
    const state = baseState();
    const snapshot = {
      title: "Friday League",
      buyInValue: 40,
      rebuyValue: 40,
      buyIns: 18,
      rebuys: 2,
      prize: state.prize,
      blinds: state.blinds,
      currentRoundIndex: 2,
      timer: { status: "paused", remainingSec: 754, endsAtMs: null },
    };

    // Even with a huge elapsed gap, paused state must not lose time.
    const nowMs = Date.now() + 45 * 60 * 1000;
    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs,
    });

    expect(result.timer.status).toBe("paused");
    expect(result.timer.remainingSec).toBe(754);
    expect(result.timer.endsAtMs).toBeNull();
    expect(result.currentRoundIndex).toBe(2);
    expect(result.buyIns).toBe(18);
    expect(result.rebuys).toBe(2);
  });

  it("running: recomputes remaining from endsAtMs against nowMs (audit example)", () => {
    const state = baseState();
    const savedAt = 2_000_000;
    const snapshot = {
      title: state.title,
      buyInValue: state.buyInValue,
      rebuyValue: state.rebuyValue,
      buyIns: state.buyIns,
      rebuys: state.rebuys,
      prize: state.prize,
      blinds: state.blinds,
      currentRoundIndex: 2,
      timer: {
        status: "running",
        remainingSec: 720,
        endsAtMs: savedAt + 12 * 60 * 1000,
      },
    };

    const nowMs = savedAt + 5 * 60 * 1000;
    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs,
    });

    expect(result.currentRoundIndex).toBe(2);
    expect(result.timer.status).toBe("running");
    expect(result.timer.remainingSec).toBe(7 * 60);
  });

  it("running: catches up across multiple levels and a break", () => {
    const state = baseState();
    const savedAt = 3_000_000;
    const snapshot = {
      ...state,
      currentRoundIndex: 2,
      timer: { status: "running", remainingSec: 300, endsAtMs: savedAt + 5 * 60 * 1000 },
    };

    const nowMs = savedAt + 25 * 60 * 1000;
    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs,
    });

    expect(result.currentRoundIndex).toBe(4);
    expect(result.timer.remainingSec).toBe(10 * 60);
    expect(result.timer.status).toBe("running");
  });

  it("restore is always silent: flash/lastTransitionAt/oneMinuteWarningEventAt are always cleared", () => {
    const state = baseState({
      ui: {
        settingsOpen: false,
        flash: true,
        lastTransitionAt: 12345,
        oneMinuteWarnedRoundIndex: 1,
        oneMinuteWarningEventAt: 12345,
      },
    });
    const snapshot = {
      ...state,
      currentRoundIndex: 2,
      timer: { status: "paused", remainingSec: 500, endsAtMs: null },
    };

    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs: Date.now(),
    });

    expect(result.ui.flash).toBe(false);
    expect(result.ui.lastTransitionAt).toBeNull();
    expect(result.ui.oneMinuteWarningEventAt).toBeNull();
  });

  it("recovering inside the final 60 seconds of a blind round marks it pre-warned, without setting the sound-event field", () => {
    const state = baseState();
    const savedAt = 4_000_000;
    const snapshot = {
      ...state,
      currentRoundIndex: 2, // a blind round
      timer: { status: "running", remainingSec: 90, endsAtMs: savedAt + 90 * 1000 },
    };

    // 45 seconds elapse -- lands at 45s remaining, inside the final minute.
    const nowMs = savedAt + 45 * 1000;
    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs,
    });

    expect(result.timer.remainingSec).toBe(45);
    expect(result.ui.oneMinuteWarnedRoundIndex).toBe(2); // suppressed for this round
    expect(result.ui.oneMinuteWarningEventAt).toBeNull(); // but no sound event fires

    // And a real subsequent tick must not fire the warning either, since
    // prevRemaining is already <= 60 (no "crossing" left to detect).
    const ticked = reducer(result, {
      type: "TIMER_TICK",
      nowMs: nowMs + 1000,
    });
    expect(ticked.ui.oneMinuteWarningEventAt).toBeNull();
  });

  it("running: reports finished when the elapsed gap runs past the last round", () => {
    const state = baseState();
    const savedAt = 5_000_000;
    const snapshot = {
      ...state,
      currentRoundIndex: state.blinds.length - 1,
      timer: { status: "running", remainingSec: 10, endsAtMs: savedAt + 10 * 1000 },
    };

    const nowMs = savedAt + 999_999;
    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs,
    });

    expect(result.timer.status).toBe("finished");
    expect(result.timer.remainingSec).toBe(0);
    expect(result.ui.flash).toBe(false); // still silent, unlike a real TIMER_TICK finish
  });

  it("clamps an out-of-bounds currentRoundIndex defensively", () => {
    const state = baseState();
    const snapshot = {
      ...state,
      currentRoundIndex: 999,
      timer: { status: "paused", remainingSec: 100, endsAtMs: null },
    };

    const result = reducer(state, {
      type: "RESTORE_TOURNAMENT",
      snapshot,
      nowMs: Date.now(),
    });

    expect(result.currentRoundIndex).toBe(state.blinds.length - 1);
  });

  it("a null/missing snapshot is a no-op", () => {
    const state = baseState();
    const result = reducer(state, { type: "RESTORE_TOURNAMENT", snapshot: null });
    expect(result).toBe(state);
  });
});

describe("TIMER_TICK unaffected by the advanceToNow refactor", () => {
  it("still advances to a break, then to the next blind, exactly as before", () => {
    const state = baseState({
      currentRoundIndex: 0,
      blinds: [
        blindRound(25, 50, 5 / 60), // 5 sec, matches the original reducer test's shape
        breakRound(4 / 60), // 4 sec
        blindRound(50, 100, 5 / 60),
      ],
      timer: { status: "running", remainingSec: 3, endsAtMs: 4000, lastTickMs: null },
    });

    const s2 = reducer(state, { type: "TIMER_TICK", nowMs: 4000 });
    expect(s2.currentRoundIndex).toBe(1);
    expect(s2.ui.flash).toBe(true);
    expect(s2.ui.lastTransitionAt).toBe(4000);
  });
});

describe("hasMeaningfulProgress", () => {
  // These use the REAL production createInitialState(), not a hand-built
  // fixture. createInitialState() ships with a non-zero default buyIns
  // (a starting headcount, not "zero progress" -- see Gate 2 review),
  // so a fixture that assumes 0 is "fresh" would hide exactly the bug
  // these tests exist to catch.

  it("is false for a genuinely untouched createInitialState()", () => {
    expect(hasMeaningfulProgress(createInitialState())).toBe(false);
  });

  it("is true after buy-ins change from their initial value (increment)", () => {
    const initial = createInitialState();
    const state = { ...initial, buyIns: initial.buyIns + 1 };
    expect(hasMeaningfulProgress(state)).toBe(true);
  });

  it("is true after buy-ins change from their initial value (decrement)", () => {
    const initial = createInitialState();
    const state = { ...initial, buyIns: initial.buyIns - 1 };
    expect(hasMeaningfulProgress(state)).toBe(true);
  });

  it("is true after rebuys change from their initial value", () => {
    const initial = createInitialState();
    const state = { ...initial, rebuys: initial.rebuys + 1 };
    expect(hasMeaningfulProgress(state)).toBe(true);
  });

  it("is true once the timer has started", () => {
    const initial = createInitialState();
    const state = {
      ...initial,
      timer: { ...initial.timer, status: "running", endsAtMs: 999 },
    };
    expect(hasMeaningfulProgress(state)).toBe(true);
  });

  it("is true once the round has advanced", () => {
    const initial = createInitialState();
    const state = { ...initial, currentRoundIndex: 1 };
    expect(hasMeaningfulProgress(state)).toBe(true);
  });
});

// These test the site/demo (localStorage) path directly. PRO_ENABLED is
// false in this test environment (no VITE_TARGET set), so loadTournament/
// saveTournament exercise the exact same lsSave/lsLoad + validation code
// a real demo build runs. This is also, independently, what a real
// browser reload racing against injected corruption can't easily
// demonstrate live (the app's own unload-flush keeps re-saving valid
// state before the corrupted value would ever be read) -- verified live
// in a browser separately (see completion report); verified here
// deterministically at the validation-logic level.
//
// jsdom's built-in localStorage doesn't activate in this project's test
// setup (confirmed: setItem/getItem/removeItem are all undefined here),
// so a minimal in-memory Storage stand-in is used instead -- sufficient
// to exercise persistence.js's own read/write/validate logic, which is
// what these tests are actually about.
function makeMemoryStorage() {
  const store = new Map();
  return {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
  };
}

describe("loadTournament corruption handling (localStorage path)", () => {
  const KEY = "pcp:tournament:v1";

  beforeEach(() => {
    globalThis.localStorage = makeMemoryStorage();
  });

  it("returns null when nothing has been saved", async () => {
    expect(await loadTournament()).toBeNull();
  });

  it("returns null for malformed JSON", async () => {
    localStorage.setItem(KEY, "{not valid json!!!");
    expect(await loadTournament()).toBeNull();
  });

  it("returns null when required fields are missing", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({ schemaVersion: TOURNAMENT_SCHEMA_VERSION, savedAt: Date.now() }),
    );
    expect(await loadTournament()).toBeNull();
  });

  it("returns null for an empty blinds array", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        schemaVersion: TOURNAMENT_SCHEMA_VERSION,
        savedAt: Date.now(),
        tournament: { blinds: [], currentRoundIndex: 0, timer: { status: "idle" } },
      }),
    );
    expect(await loadTournament()).toBeNull();
  });

  it("returns null for an invalid timer status", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        schemaVersion: TOURNAMENT_SCHEMA_VERSION,
        savedAt: Date.now(),
        tournament: {
          blinds: [{ type: "blind", small: 5, big: 10, durationSec: 60 }],
          currentRoundIndex: 0,
          timer: { status: "definitely-not-a-real-status" },
        },
      }),
    );
    expect(await loadTournament()).toBeNull();
  });

  it("returns null for an unknown/future schema version", async () => {
    localStorage.setItem(
      KEY,
      JSON.stringify({
        schemaVersion: 999,
        savedAt: Date.now(),
        tournament: {
          blinds: [{ type: "blind", small: 5, big: 10, durationSec: 60 }],
          currentRoundIndex: 0,
          timer: { status: "idle" },
        },
      }),
    );
    expect(await loadTournament()).toBeNull();
  });

  it("round-trips a valid save correctly", async () => {
    const state = baseState();
    saveTournament(state);
    const loaded = await loadTournament();

    expect(loaded).not.toBeNull();
    expect(loaded.schemaVersion).toBe(TOURNAMENT_SCHEMA_VERSION);
    expect(loaded.tournament.buyIns).toBe(state.buyIns);
    expect(loaded.tournament.blinds.length).toBe(state.blinds.length);
    // Presentation fields must never appear in the tournament snapshot.
    expect(loaded.tournament.theme).toBeUndefined();
    expect(loaded.tournament.logoDataUrl).toBeUndefined();
    expect(loaded.tournament.sounds).toBeUndefined();
  });
});
