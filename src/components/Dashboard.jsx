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
import FullscreenButton from "./FullscreenButton";
import { useEffect, useState } from "react";
import { PRO_ENABLED } from "../app/pro";

function FullscreenLogo({ src }) {
  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement,
  );

  useEffect(() => {
    const onChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div
      className={`
      absolute left-1/2 -translate-x-1/2 pointer-events-none
      transition-all duration-500
      ${isFullscreen ? "-top-56" : "-top-48"}
    `}
    >
      {/* Inner wrapper owns the 3D transform/animation (does NOT affect centering) */}
      <div
        className={`${isFullscreen ? "animate-chipwobble" : ""} chip-3d`}
        style={{ perspective: "900px" }}
      >
        <img
          src={src}
          alt="Club Logo"
          className={`
          object-contain transition-all duration-500 ease-out
          ${isFullscreen ? "h-48 w-48 lg:h-56 lg:w-56" : "h-32 w-32 lg:h-36 lg:w-36"}
        `}
        />
      </div>
    </div>
  );
}

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
      className="relative h-screen w-screen text-white p-4 flex flex-col"
      style={{
        background:
          "radial-gradient(circle at center, rgba(255,215,0,0.08) 0%, rgba(0,0,0,0) 55%), radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)",
      }}
    >
      <FlashOverlay show={state.ui.flash} />

      <div className="flex-grow flex flex-col justify-center -mt-6">
        <div className="flex items-center justify-center mb-8">
          <input
            className="w-full max-w-4xl bg-transparent text-center text-2xl md:text-3xl font-extrabold font-display tracking-wide text-amber-300 drop-shadow outline-none border-b border-amber-300/30 focus:border-amber-300/70 px-2 py-1"
            value={state.title}
            onChange={(e) =>
              dispatch({ type: "SET_TITLE", title: e.target.value })
            }
            placeholder="Tournament Name"
            aria-label="Tournament name"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_2fr_1fr] items-center w-full">
          {/* Left column */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <FullscreenLogo
                src={
                  PRO_ENABLED && state.logoDataUrl
                    ? state.logoDataUrl
                    : `${import.meta.env.BASE_URL}images/logo.png`
                }
              />

              <PrizePanel
                payoutInfo={payoutInfo}
                prizeMode={state.prize.mode}
              />
            </div>
          </div>

          {/* Center column */}
          <div className="text-center">
            <div className="text-xl opacity-70 tracking-widest">
              LEVEL {getDisplayedBlindLevel(state)} OF {countBlindRounds(state)}
            </div>

            <div className="mt-6 text-base opacity-60 tracking-widest">
              BLINDS
            </div>
            <div className="mt-2 text-7xl md:text-7xl font-extrabold font-display text-amber-300 drop-shadow-[0_0_24px_rgba(245,158,11,0.25)]">
              {currentBlinds}
            </div>

            <div className="mt-8 whitespace-nowrap text-[120px] md:text-[170px] lg:text-[200px] leading-none font-extrabold font-display text-white/90 tabular-nums drop-shadow-[0_0_24px_rgba(255,255,255,0.10)]">
              {formatTime(state.timer.remainingSec)}
            </div>

            {nextRound?.type === "break" && current?.type === "blind" && (
              <div className="mt-6 text-base tracking-widest text-amber-300 font-extrabold">
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
              <div className="text-base opacity-60 tracking-widest">
                NEXT BLINDS
              </div>
              <div className="mt-2 text-5xl font-bold font-display opacity-85">
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

          {/* Right column */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <BuyinsPanel state={state} dispatch={dispatch} />
            </div>
          </div>
        </div>
      </div>

      <SettingsPanel state={state} dispatch={dispatch} />

      <FullscreenButton />
    </div>
  );
}
