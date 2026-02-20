function CircleButton({ children, onClick, title, disabled }) {
  return (
    <button
      className={[
        "w-14 h-14 rounded-full border border-amber-400/15",
        disabled ? "bg-white/5 opacity-50 cursor-not-allowed" : "bg-white/10 hover:bg-white/20",
        "flex items-center justify-center text-xl",
      ].join(" ")}
      onClick={onClick}
      title={title}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}

export default function TimerControls({ state, dispatch }) {
  const now = () => Date.now();
  const { status } = state.timer;

  return (
    <div className="mt-10 flex items-center justify-center gap-4">
      <CircleButton
        title="Reset current level"
        onClick={() => dispatch({ type: "TIMER_RESET" })}
      >
        ↺
      </CircleButton>

      <button
        className={[
          "w-16 h-16 rounded-full flex items-center justify-center",
          "bg-amber-500 hover:bg-amber-400 text-black",
          "shadow-[0_0_25px_rgba(245,158,11,0.35)]",
          "border border-amber-200/30",
          "text-2xl font-black",
          (status === "finished") ? "opacity-60 cursor-not-allowed" : "",
        ].join(" ")}
        type="button"
        title={status === "paused" ? "Resume" : status === "running" ? "Pause" : "Start"}
        onClick={() => {
          if (status === "idle") dispatch({ type: "TIMER_START", nowMs: now() });
          else if (status === "running") dispatch({ type: "TIMER_PAUSE" });
          else if (status === "paused") dispatch({ type: "TIMER_RESUME", nowMs: now() });
        }}
        disabled={status === "finished"}
        aria-label="Toggle timer"
      >
        {status === "running" ? "❚❚" : "▶"}
      </button>

      <CircleButton
        title="Next level now"
        disabled={state.currentRoundIndex >= state.blinds.length - 1}
        onClick={() => dispatch({ type: "NEXT_LEVEL_NOW", nowMs: now() })}
      >
        ⏭
      </CircleButton>
    </div>
  );
}
