import { useEffect, useReducer, useRef, useState } from "react";
import { createInitialState } from "./app/initialState";
import { reducer } from "./app/reducer";
import Dashboard from "./components/Dashboard";
import Seo from "./components/Seo";
import ActivateScreen from "./components/ActivateScreen";
import ResumePrompt from "./components/ResumePrompt";
import { PRO_ENABLED } from "./app/pro";
import {
  getDisplayedBlindLevel,
  countBlindRounds,
} from "./app/selectors";
import { formatTime } from "./lib/format";
import {
  saveTournament,
  loadTournament,
  savePreferences,
  loadPreferences,
} from "./lib/persistence";
import {
  playBlindUpSound,
  playBreakSound,
  playOneMinuteSound,
} from "./lib/sound";

// A saved tournament older than this is not auto-restored -- the operator
// is asked instead. Elapsed time only; crossing midnight by itself is not
// meaningful (tournaments legitimately run past midnight).
const STALE_GAP_MS = 4 * 60 * 60 * 1000;

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  // Always-current ref so debounced/interval save callbacks never close
  // over a stale render's state.
  const stateRef = useRef(state);
  stateRef.current = state;

  // License activation gate -- Pro builds only. PRO_ENABLED is a
  // build-time constant (see src/app/pro.js), so this never changes
  // within a running instance: the free site/demo build never enters
  // this branch and never calls /api/license/*, structurally, not by
  // accident.
  const [licenseChecked, setLicenseChecked] = useState(!PRO_ENABLED);
  const [activated, setActivated] = useState(!PRO_ENABLED);

  useEffect(() => {
    if (!PRO_ENABLED) return;

    let cancelled = false;

    fetch("/api/license/status")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setActivated(!!data.activated);
        setLicenseChecked(true);
      })
      .catch(() => {
        if (cancelled) return;
        setActivated(false);
        setLicenseChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------
  // Live session recovery. A stale (>4h) save is held here instead of
  // being auto-applied, and surfaced via ResumePrompt; a non-stale save
  // is restored immediately and silently.
  // ---------------------------------------------------------------
  const [pendingResume, setPendingResume] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadTournament().then((snapshot) => {
      if (cancelled || !snapshot) return;

      const gapMs = Date.now() - snapshot.savedAt;
      if (gapMs > STALE_GAP_MS) {
        setPendingResume(snapshot);
      } else {
        dispatch({
          type: "RESTORE_TOURNAMENT",
          snapshot: snapshot.tournament,
          nowMs: Date.now(),
        });
      }
    });

    if (PRO_ENABLED) {
      loadPreferences().then((snapshot) => {
        if (cancelled || !snapshot) return;
        dispatch({
          type: "RESTORE_PREFERENCES",
          preferences: snapshot.preferences,
        });
      });
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // ---------------------------------------------------------------
  // Autosave -- tournament state.
  //
  // Two independent triggers:
  // 1. A ~500ms debounce for meaningful changes -- but keyed on
  //    everything EXCEPT the continuously-ticking timer.remainingSec/
  //    endsAtMs fields. Those change roughly once a second while
  //    running purely from TIMER_TICK; if they were included here,
  //    this debounce would end up re-firing almost every second on
  //    its own (still within the stated requirements, but not the
  //    intended separation, and more writes than needed). Excluding
  //    them means ordinary running produces zero debounce saves at
  //    all -- only the interval below governs -- while a real edit
  //    (buy-in, pause/resume, round change, structure edit, etc.)
  //    still reaches storage within ~500ms.
  // 2. A 2s interval, only while running, guaranteeing a save at
  //    least that often even if nothing else triggers one.
  //
  // TIMER_TICK dispatches every 250ms, but neither trigger writes on
  // every tick: the debounce ignores tick-only changes, and the
  // interval caps at once per 2s.
  // ---------------------------------------------------------------
  const debounceKey = JSON.stringify([
    state.title,
    state.buyInValue,
    state.rebuyValue,
    state.buyIns,
    state.rebuys,
    state.prize,
    state.blinds,
    state.currentRoundIndex,
    state.timer.status,
  ]);

  useEffect(() => {
    const t = setTimeout(() => saveTournament(stateRef.current), 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceKey]);

  useEffect(() => {
    if (state.timer.status !== "running") return;
    const id = setInterval(() => saveTournament(stateRef.current), 2000);
    return () => clearInterval(id);
  }, [state.timer.status]);

  // Autosave -- Pro presentation preferences. Its own, separate,
  // much-less-frequent schedule so a buy-in click never rewrites a
  // multi-megabyte logo/sound payload.
  useEffect(() => {
    if (!PRO_ENABLED) return;
    const t = setTimeout(() => savePreferences(stateRef.current), 500);
    return () => clearTimeout(t);
  }, [state.theme, state.logoDataUrl, state.sounds]);

  // Best-effort final flush when the tab is hidden/closed or the app is
  // closed -- the primary defense against losing the last few seconds
  // of unsaved progress on an accidental refresh or close.
  useEffect(() => {
    const flush = () => {
      saveTournament(stateRef.current);
      if (PRO_ENABLED) savePreferences(stateRef.current);
    };

    document.addEventListener("visibilitychange", flush);
    window.addEventListener("beforeunload", flush);

    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, []);

  // tick loop
  useEffect(() => {
    const id = setInterval(
      () => dispatch({ type: "TIMER_TICK", nowMs: Date.now() }),
      250,
    );
    return () => clearInterval(id);
  }, []);

  // play transition sound on every transition (reliable). Restoring a
  // saved tournament always sets lastTransitionAt to null, so this never
  // fires for a transition that happened while the app was closed.
  useEffect(() => {
    if (!state.ui.lastTransitionAt) return;

    const current = state.blinds[state.currentRoundIndex];
    if (current?.type === "break") playBreakSound();
    else playBlindUpSound();
  }, [state.ui.lastTransitionAt, state.currentRoundIndex, state.blinds]);

  // auto-clear flash overlay (visual only)
  useEffect(() => {
    if (!state.ui.flash) return;

    const t = setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 2000);
    return () => clearTimeout(t);
  }, [state.ui.flash]);

  // 1-minute warning sound. Deliberately keyed on oneMinuteWarningEventAt,
  // not oneMinuteWarnedRoundIndex: restore sets the latter (to suppress a
  // future false warning) without ever setting the former, so restoring
  // into the final 60 seconds of a round never replays this sound.
  useEffect(() => {
    if (!state.ui.oneMinuteWarningEventAt) return;
    playOneMinuteSound();
  }, [state.ui.oneMinuteWarningEventAt]);

  if (PRO_ENABLED && !licenseChecked) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        Checking license…
      </div>
    );
  }

  if (PRO_ENABLED && !activated) {
    return <ActivateScreen onActivated={() => setActivated(true)} />;
  }

  if (pendingResume) {
    const t = pendingResume.tournament;
    return (
      <ResumePrompt
        title={t.title}
        statusLabel={t.timer.status === "paused" ? "paused" : "running"}
        levelLabel={`Level ${getDisplayedBlindLevel({
          blinds: t.blinds,
          currentRoundIndex: t.currentRoundIndex,
        })} of ${countBlindRounds({ blinds: t.blinds })}`}
        remainingLabel={formatTime(t.timer.remainingSec)}
        onResume={() => {
          dispatch({
            type: "RESTORE_TOURNAMENT",
            snapshot: t,
            nowMs: Date.now(),
          });
          setPendingResume(null);
        }}
        onStartFresh={() => {
          saveTournament(stateRef.current);
          setPendingResume(null);
        }}
      />
    );
  }

  return (
    <>
      <Seo
        title={PRO_ENABLED ? "Poker Clock Pro" : "Free Demo | Poker Clock Pro"}
        description="Try the free Poker Clock Pro demo and see a TV-friendly poker tournament clock with blinds, breaks, and tournament tools."
        path="/demo"
        robots="index,follow,max-image-preview:large"
      />

      <Dashboard state={state} dispatch={dispatch} />
    </>
  );
}
