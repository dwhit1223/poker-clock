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
    case "TIMER_START":
      return {
        ...state,
        timer: { ...state.timer, status: "running", lastTickMs: action.nowMs },
      };

    case "TIMER_PAUSE":
      return {
        ...state,
        timer: { ...state.timer, status: "paused", lastTickMs: null },
      };

    case "TIMER_RESUME":
      return {
        ...state,
        timer: { ...state.timer, status: "running", lastTickMs: action.nowMs },
      };

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

    case "NEXT_LEVEL_NOW": {
      const idx = state.currentRoundIndex;
      if (idx >= state.blinds.length - 1) return state;

      const nextIndex = idx + 1;
      const next = state.blinds[nextIndex];

      return {
        ...state,
        currentRoundIndex: nextIndex,
        timer: {
          ...state.timer,
          remainingSec: next?.durationSec ?? 0,
          lastTickMs: state.timer.status === "running" ? action.nowMs : null,
        },
        ui: {
          ...state.ui,
          flash: true,
          lastTransitionAt: action.nowMs,
          oneMinuteWarnedRoundIndex: null,
        },
      };
    }

    case "TIMER_TICK": {
      if (state.timer.status !== "running") return state;

      const last = state.timer.lastTickMs ?? action.nowMs;
      const elapsedSec = Math.floor((action.nowMs - last) / 1000);
      if (elapsedSec <= 0) return state;

      let remaining = state.timer.remainingSec - elapsedSec;
      let idx = state.currentRoundIndex;
      let transitioned = false;

      while (remaining <= 0 && idx < state.blinds.length - 1) {
        idx += 1;
        remaining += state.blinds[idx].durationSec;
        transitioned = true;
      }

      if (remaining <= 0 && idx === state.blinds.length - 1) {
        return {
          ...state,
          currentRoundIndex: idx,
          timer: { status: "finished", remainingSec: 0, lastTickMs: null },
          ui: { ...state.ui, flash: true, lastTransitionAt: action.nowMs },
        };
      }

      // Fire 1-minute warning once per round when crossing <= 60 seconds
      const currentRound = state.blinds[idx];
      const alreadyWarned = state.ui.oneMinuteWarnedRoundIndex === idx;

      const prevRemaining = state.timer.remainingSec; // before this tick
      const crossedOneMinute = prevRemaining > 60 && remaining <= 60;

      const shouldWarn =
        !transitioned && // if we transitioned this tick, don't also warn
        currentRound?.type === "blind" &&
        !alreadyWarned &&
        crossedOneMinute;

      return {
        ...state,
        currentRoundIndex: idx,
        timer: {
          ...state.timer,
          remainingSec: remaining,
          lastTickMs: action.nowMs,
        },
        ui: transitioned
          ? {
              ...state.ui,
              flash: true,
              lastTransitionAt: action.nowMs,
              oneMinuteWarnedRoundIndex: null,
            }
          : shouldWarn
            ? {
                ...state.ui,
                oneMinuteWarnedRoundIndex: idx,
              }
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

    default:
      return state;
  }
}
