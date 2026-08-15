import { useEffect, useReducer, useState } from "react";
import { createInitialState } from "./app/initialState";
import { reducer } from "./app/reducer";
import Dashboard from "./components/Dashboard";
import Seo from "./components/Seo";
import ActivateScreen from "./components/ActivateScreen";
import { PRO_ENABLED } from "./app/pro";
import {
  playBlindUpSound,
  playBreakSound,
  playOneMinuteSound,
} from "./lib/sound";

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

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

  // tick loop
  useEffect(() => {
    const id = setInterval(
      () => dispatch({ type: "TIMER_TICK", nowMs: Date.now() }),
      250,
    );
    return () => clearInterval(id);
  }, []);

  // play transition sound on every transition (reliable)
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

  // 1-minute warning sound (fires once per round)
  useEffect(() => {
    if (state.ui.oneMinuteWarnedRoundIndex == null) return;
    playOneMinuteSound();
  }, [state.ui.oneMinuteWarnedRoundIndex]);

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

  return (
    <>
      <Seo
        title="Free Demo | Poker Clock Pro"
        description="Try the free Poker Clock Pro demo and see a TV-friendly poker tournament clock with blinds, breaks, and tournament tools."
        path="/demo"
        robots="index,follow,max-image-preview:large"
      />

      <Dashboard state={state} dispatch={dispatch} />
    </>
  );
}
