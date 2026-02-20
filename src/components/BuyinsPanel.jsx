function CounterRow({ label, sublabel, value, onDec, onInc }) {
  return (
    <div className="mt-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-[11px] opacity-50">{sublabel}</div>

      <div className="mt-2 flex items-center justify-between">
        <button
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-amber-400/15 text-xl"
          onClick={onDec}
          aria-label={`Decrease ${label}`}
        >
          –
        </button>

        <div className="text-4xl font-extrabold text-white/90 tabular-nums">{value}</div>

        <button
          className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xl font-black"
          onClick={onInc}
          aria-label={`Increase ${label}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function BuyinsPanel({ state, dispatch }) {
  return (
    <div className="rounded-2xl border border-amber-400/20 bg-black/25 p-5 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2 text-amber-300 font-extrabold tracking-wide">
        <span aria-hidden>🪙</span>
        <span>BUY-INS &amp; REBUYS</span>
      </div>

      <CounterRow
        label="BUY-INS"
        sublabel={`($${state.buyInValue} each)`}
        value={state.buyIns}
        onDec={() => dispatch({ type: "DEC_BUYIN" })}
        onInc={() => dispatch({ type: "INC_BUYIN" })}
      />

      <CounterRow
        label="REBUYS"
        sublabel={`($${state.rebuyValue} each)`}
        value={state.rebuys}
        onDec={() => dispatch({ type: "DEC_REBUY" })}
        onInc={() => dispatch({ type: "INC_REBUY" })}
      />
    </div>
  );
}
