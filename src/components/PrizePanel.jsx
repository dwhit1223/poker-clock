export default function PrizePanel({ payoutInfo, prizeMode }) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-black/25 p-5 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 text-amber-300 font-extrabold tracking-wide font-display text-2xl md:text-3xl">
        <span aria-hidden>🏆</span>
        <span>PAYOUTS</span>
      </div>

      <div className="mt-5 space-y-4 text-2xl md:text-3xl lg:text-4xl font-display">
        {payoutInfo.payouts.map((p) => (
          <div key={p.index} className="flex justify-between">
            <span className="opacity-80 font-semibold">{p.label}</span>
            <span className="font-extrabold text-amber-200 text-3xl md:text-4xl lg:text-5xl">
              ${p.amount}
            </span>
          </div>
        ))}
      </div>

      {/* <div className="pt-3 text-xs opacity-50">Mode: {prizeMode}</div> */}
    </div>
  );
}
