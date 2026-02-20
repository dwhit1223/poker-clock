import {
  computePayouts,
  getCurrentRound,
  getNextBlindRound,
  getDisplayedBlindLevel,
  countBlindRounds,
} from "../app/selectors";
import { formatTime } from "../lib/format";
import PrizePanel from "./PrizePanel";
import BuyinsPanel from "./BuyinsPanel";
import SettingsPanel from "./SettingsPanel";
import TimerControls from "./TimerControls";
import FlashOverlay from "./FlashOverlay";

export default function Dashboard({ state, dispatch }) {
  const payoutInfo = computePayouts(state);
  const current = getCurrentRound(state);
  const nextBlind = getNextBlindRound(state);
  const nextRound = state.blinds[state.currentRoundIndex + 1] ?? null;
  const isBreak = current?.type === "break";
  const currentBlinds =
    !isBreak && current ? `${current.small} / ${current.big}` : "BREAK";
  const nextBlinds = nextBlind ? `${nextBlind.small} / ${nextBlind.big}` : "—";

  return (
    <div
      className="min-h-screen text-white p-4"
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 55%), radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)",
      }}
    >
      <FlashOverlay show={state.ui.flash} />

      <div className="flex items-center justify-center mb-8">
        <input
          className="w-full max-w-4xl bg-transparent text-center text-4xl md:text-5xl font-extrabold tracking-wide text-amber-300 drop-shadow outline-none border-b border-amber-300/30 focus:border-amber-300/70 px-2 py-1"
          value={state.title}
          onChange={(e) =>
            dispatch({ type: "SET_TITLE", title: e.target.value })
          }
          placeholder="Tournament Name"
          aria-label="Tournament name"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr] items-center">
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <PrizePanel payoutInfo={payoutInfo} prizeMode={state.prize.mode} />
          </div>
        </div>

        <div className="text-center">
          <div className="text-sm opacity-70 tracking-widest">
            LEVEL {getDisplayedBlindLevel(state)} OF {countBlindRounds(state)}
          </div>

          <div className="mt-6 text-xs opacity-60 tracking-widest">BLINDS</div>
          <div className="mt-2 text-6xl md:text-7xl font-extrabold text-amber-300 drop-shadow-[0_0_24px_rgba(245,158,11,0.25)]">
            {currentBlinds}
          </div>

          <div className="mt-8 text-7xl md:text-8xl font-extrabold text-white/90 tabular-nums drop-shadow-[0_0_24px_rgba(255,255,255,0.10)]">
            {formatTime(state.timer.remainingSec)}
          </div>

          {/* Show this ONLY on the level before a break */}
          {nextRound?.type === "break" && current?.type === "blind" && (
            <div className="mt-6 text-xs tracking-widest text-amber-300 font-extrabold">
              BREAK AFTER LEVEL {getDisplayedBlindLevel(state)}
            </div>
          )}

          <div
            className={
              nextRound?.type === "break" && current?.type === "blind"
                ? "mt-2"
                : "mt-6"
            }
          >
            <div className="text-xs opacity-60 tracking-widest">
              NEXT BLINDS
            </div>
            <div className="mt-2 text-4xl font-bold opacity-85">
              {nextBlinds}
            </div>
          </div>

          <TimerControls state={state} dispatch={dispatch} />

          <div className="mt-8">
            <button
              className="text-xs opacity-70 hover:opacity-100 inline-flex items-center gap-2"
              onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
              type="button"
            >
              ⚙ SETTINGS <span className="opacity-60">▾</span>
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            <BuyinsPanel state={state} dispatch={dispatch} />
          </div>
        </div>
      </div>

      <SettingsPanel state={state} dispatch={dispatch} />
    </div>
  );
}
