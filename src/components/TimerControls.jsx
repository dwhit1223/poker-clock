import { unlockAudio } from "../lib/sound";

function CircleButton({
  children,
  onClick,
  title,
  disabled,
  variant = "secondary",
  label,
  pulseClass,
}) {
  const base =
    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-150 border";

  const styles = disabled
    ? "bg-gray-800/40 text-gray-500 border-gray-700 cursor-not-allowed"
    : variant === "primary"
      ? `bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105 active:scale-95 ${pulseClass || ""}`
      : "bg-gradient-to-br from-gray-700 to-gray-900 text-amber-300 border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:scale-105 active:scale-95 hover:border-amber-300";

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`${base} ${styles}`}
        onClick={onClick}
        title={title}
        disabled={disabled}
        type="button"
      >
        <span className="text-2xl font-bold">{children}</span>
      </button>

      {label && (
        <div className="text-xs md:text-sm font-display text-amber-300 tracking-widest">
          {label}
        </div>
      )}
    </div>
  );
}

export default function TimerControls({ state, dispatch }) {
  const now = () => Date.now();
  const { status } = state.timer;

  return (
    <div className="mt-14 flex items-center justify-center gap-12">
      <CircleButton
        title="Reset tournament"
        onClick={() => dispatch({ type: "TIMER_RESET" })}
        label="RESET"
      >
        ⟲
      </CircleButton>

      <CircleButton
        title={
          status === "paused"
            ? "Resume Timer"
            : status === "running"
              ? "Pause Timer"
              : "Start Timer"
        }
        onClick={async () => {
          await unlockAudio();

          if (status === "idle")
            dispatch({ type: "TIMER_START", nowMs: now() });
          else if (status === "running")
            dispatch({ type: "TIMER_PAUSE", nowMs: now() });
          else if (status === "paused")
            dispatch({ type: "TIMER_RESUME", nowMs: now() });
        }}
        disabled={status === "finished"}
        variant="primary"
        label={status === "running" ? "PAUSE" : "START"}
        pulseClass={
          status === "paused" ? "animate-pulse ring-4 ring-emerald-400/30" : ""
        }
      >
        {status === "running" ? "❚❚" : "▶"}
      </CircleButton>

      <CircleButton
        title="Advance to next level"
        disabled={state.currentRoundIndex >= state.blinds.length - 1}
        onClick={() => dispatch({ type: "NEXT_LEVEL_NOW", nowMs: now() })}
        label="NEXT"
      >
        ⏭
      </CircleButton>
    </div>
  );
}
