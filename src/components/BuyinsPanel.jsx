function CounterRow({ label, sublabel, value, onDec, onInc }) {
  return (
    <div className="mt-6">
      <div className="text-base md:text-lg opacity-70 tracking-widest font-display">
        {label}
      </div>
      <div className="text-sm md:text-base opacity-50 font-body">
        {sublabel}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 text-amber-300 border border-amber-400/20 shadow-[0_0_15px_rgba(245,158,11,0.12)] hover:scale-105 active:scale-95 transition text-2xl font-black"
          onClick={onDec}
          aria-label={`Decrease ${label}`}
        >
          –
        </button>

        <div className="text-5xl md:text-6xl font-extrabold font-display text-white/90 tabular-nums">
          {value}
        </div>

        <button
          className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-black border border-amber-200 shadow-[0_0_22px_rgba(245,158,11,0.30)] hover:scale-105 active:scale-95 transition text-2xl font-black"
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
      <div className="flex items-center gap-2 text-amber-300 font-extrabold tracking-wide font-display text-2xl md:text-3xl">
        <span aria-hidden className="flex items-center justify-center">
          <svg
            width="38"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            className="text-amber-300"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2"
              fill="rgba(245,158,11,0.10)"
            />
            <text
              x="12"
              y="17"
              textAnchor="middle"
              fontSize="13"
              fontWeight="bold"
              fill="currentColor"
              fontFamily="Oswald, sans-serif"
            >
              $
            </text>
          </svg>
        </span>

        <span>BUY-INS & REBUYS</span>
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
