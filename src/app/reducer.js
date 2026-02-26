import { PRO_ENABLED } from "./pro";

export function reducer(state, action) {
  switch (action.type) {
    // UI
    case "TOGGLE_SETTINGS":
      return {
        ...state,
        ui: { ...state.ui, settingsOpen: !state.ui.settingsOpen },
      };

    case "SET_TITLE":
      return { ...state, title: action.title };

    case "SET_LOGO_DATA_URL":
      if (!PRO_ENABLED) return state;

      return {
        ...state,
        logoDataUrl: action.dataUrl || null,
      };

    case "CLEAR_LOGO":
      if (!PRO_ENABLED) return state;

      return {
        ...state,
        logoDataUrl: null,
      };

    // Buy-ins / rebuys
    case "INC_BUYIN":
      return { ...state, buyIns: state.buyIns + 1 };
    case "DEC_BUYIN":
      return { ...state, buyIns: Math.max(0, state.buyIns - 1) };

    case "INC_REBUY":
      return { ...state, rebuys: state.rebuys + 1 };
    case "DEC_REBUY":
      return { ...state, rebuys: Math.max(0, state.rebuys - 1) };

    // Values
    case "SET_BUYIN_VALUE":
      return { ...state, buyInValue: Math.max(0, Number(action.value) || 0) };
    case "SET_REBUY_VALUE":
      return { ...state, rebuyValue: Math.max(0, Number(action.value) || 0) };

    // Prize
    case "SET_PRIZE_MODE": {
      const mode = action.mode;

      let places = [...state.prize.places];

      if (mode === "fixed") {
        places = places.map((p) => ({ ...p, type: "fixed" }));
      } else if (mode === "percent") {
        places = places.map((p) => ({ ...p, type: "percent" }));
      } else if (mode === "percent_last_fixed") {
        places = places.map((p, i) => ({
          ...p,
          type: i === places.length - 1 ? "fixed" : "percent",
        }));
        // Ensure last label is "Last" if you want consistency:
        if (places.length > 0)
          places[places.length - 1] = {
            ...places[places.length - 1],
            label: "Last",
          };
      }

      return {
        ...state,
        prize: { ...state.prize, mode, places },
      };
    }

    case "SET_DEALER_PAY":
      return {
        ...state,
        prize: {
          ...state.prize,
          dealerPay: Math.max(0, Number(action.value) || 0),
        },
      };

    case "SET_BOUNTY_PAY":
      return {
        ...state,
        prize: {
          ...state.prize,
          bountyPay: Math.max(0, Number(action.value) || 0),
        },
      };

    case "ADD_PRIZE_PLACE": {
      const places = [...state.prize.places];

      // Insert new place BEFORE the last item if we’re using percent_last_fixed
      const insertIndex =
        state.prize.mode === "percent_last_fixed" && places.length > 0
          ? places.length - 1
          : places.length;

      const newPlace = {
        label: `${insertIndex + 1}th`,
        type: state.prize.mode === "fixed" ? "fixed" : "percent",
        value: state.prize.mode === "fixed" ? 0 : 5,
      };

      places.splice(insertIndex, 0, newPlace);

      // Re-enforce last fixed if needed
      if (state.prize.mode === "percent_last_fixed" && places.length > 0) {
        places[places.length - 1] = {
          ...places[places.length - 1],
          label: "Last",
          type: "fixed",
        };
      }

      return { ...state, prize: { ...state.prize, places } };
    }

    case "REMOVE_PRIZE_PLACE": {
      const idx = action.index;
      let places = state.prize.places.filter((_, i) => i !== idx);

      // Don’t let it go empty; keep at least one
      if (places.length === 0)
        places = [{ label: "1st", type: "percent", value: 100 }];

      // Re-enforce last fixed if needed
      if (state.prize.mode === "percent_last_fixed" && places.length > 0) {
        places = places.map((p, i) => ({
          ...p,
          type: i === places.length - 1 ? "fixed" : "percent",
        }));
        places[places.length - 1] = {
          ...places[places.length - 1],
          label: "Last",
        };
      }

      return { ...state, prize: { ...state.prize, places } };
    }

    case "UPDATE_PRIZE_PLACE": {
      const { index, patch } = action;

      let places = state.prize.places.map((p, i) =>
        i === index ? { ...p, ...patch } : p,
      );

      // Enforce mode rules
      if (state.prize.mode === "fixed") {
        places = places.map((p) => ({ ...p, type: "fixed" }));
      } else if (state.prize.mode === "percent") {
        places = places.map((p) => ({ ...p, type: "percent" }));
      } else if (state.prize.mode === "percent_last_fixed") {
        places = places.map((p, i) => ({
          ...p,
          type: i === places.length - 1 ? "fixed" : "percent",
        }));
        if (places.length > 0)
          places[places.length - 1] = {
            ...places[places.length - 1],
            label: "Last",
          };
      }

      return { ...state, prize: { ...state.prize, places } };
    }

    // Templates
    case "SET_TEMPLATE": {
      const rounds = action.rounds;
      const idx = 0;
      return {
        ...state,
        blinds: rounds,
        currentRoundIndex: idx,
        timer: {
          status: "idle",
          remainingSec: rounds[idx]?.durationSec ?? 0,
          lastTickMs: null,
        },
      };
    }

    // Rounds management
    case "ADD_BLIND_ROUND":
      return {
        ...state,
        blinds: [
          ...state.blinds,
          { type: "blind", small: 100, big: 200, durationSec: 15 * 60 },
        ],
      };

    case "ADD_BREAK_ROUND":
      return {
        ...state,
        blinds: [...state.blinds, { type: "break", durationSec: 10 * 60 }],
      };

    case "REMOVE_ROUND": {
      const blinds = state.blinds.filter((_, i) => i !== action.index);
      const newIndex = Math.min(
        state.currentRoundIndex,
        Math.max(0, blinds.length - 1),
      );
      const newRemaining = blinds[newIndex]?.durationSec ?? 0;
      return {
        ...state,
        blinds,
        currentRoundIndex: newIndex,
        timer: { ...state.timer, remainingSec: newRemaining },
      };
    }

    case "UPDATE_ROUND": {
      const blinds = state.blinds.map((r, i) =>
        i === action.index ? { ...r, ...action.patch } : r,
      );

      let timer = state.timer;
      if (
        action.index === state.currentRoundIndex &&
        action.patch.durationSec != null
      ) {
        timer = {
          ...timer,
          remainingSec: Math.min(
            timer.remainingSec,
            blinds[action.index].durationSec,
          ),
        };
      }

      return { ...state, blinds, timer };
    }

    case "MOVE_ROUND": {
      const from = action.from;
      const dir = action.dir; // -1 (up) or +1 (down)
      const to = from + dir;

      if (from < 0 || from >= state.blinds.length) return state;
      if (to < 0 || to >= state.blinds.length) return state;

      const blinds = [...state.blinds];
      const [moved] = blinds.splice(from, 1);
      blinds.splice(to, 0, moved);

      // Keep the currentRoundIndex pointing at the same "logical" round that was running.
      let currentRoundIndex = state.currentRoundIndex;

      if (currentRoundIndex === from) currentRoundIndex = to;
      else if (from < currentRoundIndex && to >= currentRoundIndex)
        currentRoundIndex -= 1;
      else if (from > currentRoundIndex && to <= currentRoundIndex)
        currentRoundIndex += 1;

      // Keep remainingSec valid if we moved the currently-active round
      let timer = state.timer;
      const current = blinds[currentRoundIndex];
      if (state.timer.status !== "running" && state.timer.status !== "paused") {
        // idle/finished: reset remaining to the new current round duration
        timer = { ...timer, remainingSec: current?.durationSec ?? 0 };
      } else {
        // running/paused: clamp remaining to new duration
        timer = {
          ...timer,
          remainingSec: Math.min(timer.remainingSec, current?.durationSec ?? 0),
        };
      }

      return { ...state, blinds, currentRoundIndex, timer };
    }

    // Timer controls
    case "TIMER_START": {
      return {
        ...state,
        timer: {
          ...state.timer,
          status: "running",
          endsAtMs: action.nowMs + state.timer.remainingSec * 1000,
        },
      };
    }

    case "TIMER_PAUSE": {
      if (state.timer.status !== "running" || !state.timer.endsAtMs) {
        return {
          ...state,
          timer: { ...state.timer, status: "paused", endsAtMs: null },
        };
      }

      const remainingMs = state.timer.endsAtMs - (action.nowMs ?? Date.now());
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      return {
        ...state,
        timer: {
          ...state.timer,
          status: "paused",
          endsAtMs: null,
          remainingSec,
        },
      };
    }

    case "TIMER_RESUME": {
      return {
        ...state,
        timer: {
          ...state.timer,
          status: "running",
          endsAtMs: action.nowMs + state.timer.remainingSec * 1000,
        },
      };
    }

    case "TIMER_RESET": {
      const firstRound = state.blinds[0];

      return {
        ...state,

        // Reset tournament position
        currentRoundIndex: 0,

        // Reset buyins and rebuys
        buyIns: 0,
        rebuys: 0,

        // Reset timer
        timer: {
          status: "idle",
          remainingSec: firstRound?.durationSec ?? 0,
          lastTickMs: null,
        },

        // Reset UI state
        ui: {
          ...state.ui,
          flash: false,
          lastTransitionAt: null,
          oneMinuteWarnedRoundIndex: null,
        },
      };
    }

    case "TIMER_SYNC": {
      if (state.timer.status !== "running" || !state.timer.endsAtMs)
        return state;

      const nowMs = action.nowMs ?? Date.now();
      const remainingMs = state.timer.endsAtMs - nowMs;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      if (remainingSec > 0) {
        if (remainingSec === state.timer.remainingSec) return state;
        return { ...state, timer: { ...state.timer, remainingSec } };
      }

      // remainingSec is 0 → advance if possible
      const idx = state.currentRoundIndex;
      if (idx >= state.blinds.length - 1) {
        return {
          ...state,
          timer: {
            ...state.timer,
            remainingSec: 0,
            status: "finished",
            endsAtMs: null,
          },
        };
      }

      const nextIndex = idx + 1;
      const next = state.blinds[nextIndex];
      const nextDurationSec = next?.durationSec ?? 0;

      return {
        ...state,
        currentRoundIndex: nextIndex,
        timer: {
          ...state.timer,
          remainingSec: nextDurationSec,
          // keep running and set new end time
          endsAtMs: nowMs + nextDurationSec * 1000,
        },
        ui: {
          ...state.ui,
          flash: true,
          lastTransitionAt: nowMs,
          oneMinuteWarnedRoundIndex: null,
        },
      };
    }

    case "NEXT_LEVEL_NOW": {
      const idx = state.currentRoundIndex;
      if (idx >= state.blinds.length - 1) return state;

      const nextIndex = idx + 1;
      const next = state.blinds[nextIndex];
      const nextDurationSec = next?.durationSec ?? 0;

      const willRun = state.timer.status === "running";
      const nowMs = action.nowMs ?? Date.now();

      return {
        ...state,
        currentRoundIndex: nextIndex,
        timer: {
          ...state.timer,
          remainingSec: nextDurationSec,
          endsAtMs: willRun ? nowMs + nextDurationSec * 1000 : null,
          // if you keep status unchanged, it remains running/paused/etc.
        },
        ui: {
          ...state.ui,
          flash: true,
          lastTransitionAt: nowMs,
          oneMinuteWarnedRoundIndex: null,
        },
      };
    }

    case "TIMER_TICK": {
      if (state.timer.status !== "running" || !state.timer.endsAtMs)
        return state;

      const nowMs = action.nowMs ?? Date.now();

      // Compute remaining time in the CURRENT round from the end timestamp.
      let remaining = Math.max(
        0,
        Math.ceil((state.timer.endsAtMs - nowMs) / 1000),
      );

      let idx = state.currentRoundIndex;
      let transitioned = false;

      // If time is up, advance through rounds (handles large time jumps cleanly)
      while (remaining <= 0 && idx < state.blinds.length - 1) {
        idx += 1;
        const dur = state.blinds[idx]?.durationSec ?? 0;

        // Start next round immediately from "now"
        remaining = dur;
        transitioned = true;

        // Set a new end time for the new current round
        // (If you want the next round to start exactly at the boundary rather than "now",
        // you can carry over negative remainder, but for accuracy + simplicity "now" is best.)
      }

      // Finished the last round
      if (remaining <= 0 && idx === state.blinds.length - 1) {
        return {
          ...state,
          currentRoundIndex: idx,
          timer: {
            ...state.timer,
            status: "finished",
            remainingSec: 0,
            endsAtMs: null,
          },
          ui: { ...state.ui, flash: true, lastTransitionAt: nowMs },
        };
      }

      // If we transitioned, reset the endsAtMs for the new round based on nowMs.
      const effectiveEndsAtMs = transitioned
        ? nowMs + remaining * 1000
        : state.timer.endsAtMs;

      // ---- 1-minute warning logic (same as yours, but based on computed remaining) ----
      const currentRound = state.blinds[idx];
      const alreadyWarned = state.ui.oneMinuteWarnedRoundIndex === idx;

      const prevRemaining = state.timer.remainingSec; // value from previous render/tick
      const crossedOneMinute = prevRemaining > 60 && remaining <= 60;

      const shouldWarn =
        !transitioned &&
        currentRound?.type === "blind" &&
        !alreadyWarned &&
        crossedOneMinute;

      // Avoid re-render spam when nothing changes
      if (
        !transitioned &&
        !shouldWarn &&
        remaining === state.timer.remainingSec
      ) {
        return state;
      }

      return {
        ...state,
        currentRoundIndex: idx,
        timer: {
          ...state.timer,
          remainingSec: remaining,
          endsAtMs: effectiveEndsAtMs,
        },
        ui: transitioned
          ? {
              ...state.ui,
              flash: true,
              lastTransitionAt: nowMs,
              oneMinuteWarnedRoundIndex: null,
            }
          : shouldWarn
            ? { ...state.ui, oneMinuteWarnedRoundIndex: idx }
            : state.ui,
      };
    }

    case "TRIGGER_ONE_MINUTE_WARNING":
      return {
        ...state,
        ui: {
          ...state.ui,
          oneMinuteWarnedRoundIndex: action.roundIndex,
        },
      };

    case "CLEAR_FLASH":
      return { ...state, ui: { ...state.ui, flash: false } };

    case "EXPORT_CONFIG": {
      // Only export configuration, not runtime timer state
      const config = {
        title: state.title,
        logoDataUrl: state.logoDataUrl ?? null,
        buyInValue: state.buyInValue,
        rebuyValue: state.rebuyValue,
        prize: state.prize,
        blinds: state.blinds,
      };

      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;

      const safeTitle = state.title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

      a.download = `${safeTitle || "poker_clock"}_config.json`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(url);

      if (!PRO_ENABLED) return state;
    }

    case "IMPORT_CONFIG": {
      const config = action.config;

      if (!config) return state;

      const firstRound = config.blinds?.[0];

      return {
        ...state,

        title: config.title ?? state.title,
        logoDataUrl: config.logoDataUrl ?? null,

        buyInValue: config.buyInValue ?? state.buyInValue,
        rebuyValue: config.rebuyValue ?? state.rebuyValue,

        prize: config.prize ?? state.prize,

        blinds: config.blinds ?? state.blinds,

        // reset runtime state safely
        currentRoundIndex: 0,

        timer: {
          status: "idle",
          remainingSec: firstRound?.durationSec ?? 0,
          lastTickMs: null,
        },

        ui: {
          ...state.ui,
          flash: false,
          lastTransitionAt: null,
          oneMinuteWarnedRoundIndex: null,
        },
      };
    }

    default:
      if (!PRO_ENABLED) return state;
  }
}
