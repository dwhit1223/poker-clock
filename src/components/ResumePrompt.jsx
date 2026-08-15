export default function ResumePrompt({
  title,
  statusLabel,
  levelLabel,
  remainingLabel,
  onResume,
  onStartFresh,
}) {
  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl text-center">
        <div className="text-2xl font-bold">Resume tournament?</div>

        <div className="mt-3 text-white/70 text-sm leading-relaxed">
          A previous tournament{title ? ` ("${title}")` : ""} was left{" "}
          {statusLabel} at {levelLabel}, {remainingLabel} remaining.
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onStartFresh}
            className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 py-3 font-semibold"
          >
            Start Fresh
          </button>

          <button
            type="button"
            onClick={onResume}
            className="flex-1 rounded-xl text-black py-3 font-semibold"
            style={{ backgroundColor: "#D4AF37" }}
          >
            Resume Tournament
          </button>
        </div>
      </div>
    </div>
  );
}
