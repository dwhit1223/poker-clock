import { useEffect, useReducer } from "react";
import { createInitialState } from "./app/initialState";
import { reducer } from "./app/reducer";
import Dashboard from "./components/Dashboard";
import Seo from "./components/Seo";
import {
  playBlindUpSound,
  playBreakSound,
  playOneMinuteSound,
} from "./lib/sound";

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

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
