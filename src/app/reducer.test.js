import { describe, it, expect } from "vitest";
import { reducer } from "./reducer";

function baseState() {
  return {
    title: "Test",
    buyInValue: 20,
    rebuyValue: 10,
    buyIns: 0,
    rebuys: 0,
    prize: { mode: "percent", first: 50, second: 30, third: 20 },
    blinds: [
      { type: "blind", small: 25, big: 50, durationSec: 5 },
      { type: "break", durationSec: 4 },
      { type: "blind", small: 50, big: 100, durationSec: 5 },
    ],
    currentRoundIndex: 0,
    timer: { status: "running", remainingSec: 3, lastTickMs: 0 },
    ui: { settingsOpen: false, flash: false, lastTransitionAt: null },
  };
}

describe("timer tick transitions with breaks", () => {
  it("advances to break, then to next blind", () => {
    const s1 = baseState();
    const s2 = reducer(s1, { type: "TIMER_TICK", nowMs: 4000 }); // elapsed 4 sec => 3 -> -1 => advance to break
    expect(s2.currentRoundIndex).toBe(1);
    expect(s2.timer.remainingSec).toBe(3); // -1 + 4 = 3
    expect(s2.ui.flash).toBe(true);

    const s3 = reducer({ ...s2, timer: { ...s2.timer, lastTickMs: 4000 }, ui: { ...s2.ui, flash: false } }, { type: "TIMER_TICK", nowMs: 8000 }); // elapsed 4 sec => 3 -> -1 => advance to blind
    expect(s3.currentRoundIndex).toBe(2);
    expect(s3.timer.remainingSec).toBe(4); // -1 + 5 = 4
  });

  it("next level now advances immediately", () => {
    const s1 = { ...baseState(), timer: { status: "paused", remainingSec: 3, lastTickMs: null } };
    const s2 = reducer(s1, { type: "NEXT_LEVEL_NOW", nowMs: 123 });
    expect(s2.currentRoundIndex).toBe(1);
    expect(s2.timer.remainingSec).toBe(4);
    expect(s2.timer.lastTickMs).toBe(null);
  });
});
