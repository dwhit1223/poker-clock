import { BLIND_TEMPLATES } from "../app/templates";
import { computePayouts } from "../app/selectors";
import NumberInput from "./NumberInput";
import {
  unlockAudio,
  playOneMinuteSound,
  playBreakSound,
  playBlindUpSound,
} from "../lib/sound";

export default function SettingsPanel({ state, dispatch }) {
  const payoutInfo = computePayouts(state);

  if (!state.ui.settingsOpen) return null;

  const onNum = (v) => Number(v) || 0;

  return (
    <div className="fixed right-4 top-16 bottom-4 w-[380px] max-w-[92vw] overflow-auto rounded-2xl border border-amber-400/20 bg-black/80 backdrop-blur p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-extrabold text-lg text-amber-200">Settings</div>
        <button
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/15"
          type="button"
          onClick={async () => {
            await unlockAudio();
            playBlindUpSound();
            setTimeout(playOneMinuteSound, 400);
            setTimeout(playBreakSound, 800);
          }}
        >
          Test Sounds
        </button>
        <button
          className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/15"
          onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
          type="button"
        >
          Close
        </button>
      </div>

      <div className="space-y-6">
        <section className="space-y-2">
          <div className="font-semibold text-amber-100">
            Buy-in & Rebuy Values
          </div>
          <label className="text-sm opacity-80">Buy-in ($)</label>
          <NumberInput
            className="w-full rounded-lg bg-white/10 border border-amber-400/15 p-2"
            value={state.buyInValue}
            onChange={(v) => dispatch({ type: "SET_BUYIN_VALUE", value: v })}
            min={0}
            step={1}
            ariaLabel="Buy-in value"
          />

          <label className="text-sm opacity-80">Rebuy ($)</label>
          <NumberInput
            className="w-full rounded-lg bg-white/10 border border-amber-400/15 p-2"
            value={state.rebuyValue}
            onChange={(v) => dispatch({ type: "SET_REBUY_VALUE", value: v })}
            min={0}
            step={1}
            ariaLabel="Rebuy value"
          />
        </section>

        <section className="space-y-2">
          <div className="font-semibold text-amber-100">Prize Distribution</div>

          <div className="rounded-xl border border-amber-400/10 bg-white/5 p-3 mt-3 text-sm">
            <div className="font-semibold text-amber-100 mb-2">
              Prize Pool Breakdown
            </div>

            <div className="flex justify-between">
              <span className="opacity-70">Gross</span>
              <span className="font-semibold">${payoutInfo.gross}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-70">Dealer Pay</span>
              <span className="font-semibold">-${payoutInfo.dealerPay}</span>
            </div>

            <div className="flex justify-between">
              <span className="opacity-70">Bounty Pay</span>
              <span className="font-semibold">-${payoutInfo.bountyPay}</span>
            </div>

            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
              <span className="opacity-80">After Deductions</span>
              <span className="text-amber-200 font-extrabold">
                ${payoutInfo.afterDeductions}
              </span>
            </div>

            {state.prize.mode === "percent_last_fixed" && (
              <>
                <div className="flex justify-between mt-2">
                  <span className="opacity-70">Last Place Fixed</span>
                  <span className="font-semibold">
                    -${payoutInfo.lastFixed}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex justify-between">
                  <span className="opacity-80">Percent Base Pool</span>
                  <span className="text-amber-200 font-extrabold">
                    ${payoutInfo.percentBasePool}
                  </span>
                </div>
              </>
            )}
          </div>

          <label className="text-sm opacity-80">Dealer Pay ($)</label>
          <NumberInput
            className="w-full rounded-lg bg-white/10 border border-amber-400/15 p-2"
            value={state.prize.dealerPay}
            onChange={(v) => dispatch({ type: "SET_DEALER_PAY", value: v })}
            min={0}
            step={1}
            ariaLabel="Dealer pay"
          />

          <label className="text-sm opacity-80">Bounty Pay ($)</label>
          <NumberInput
            className="w-full rounded-lg bg-white/10 border border-amber-400/15 p-2"
            value={state.prize.bountyPay}
            onChange={(v) => dispatch({ type: "SET_BOUNTY_PAY", value: v })}
            min={0}
            step={1}
            ariaLabel="Bounty pay"
          />

          <label className="text-sm opacity-80">Mode</label>
          <select
            className="w-full rounded-lg bg-gray-800 text-white border border-amber-400/20 p-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
            value={state.prize.mode}
            onChange={(e) =>
              dispatch({ type: "SET_PRIZE_MODE", mode: e.target.value })
            }
          >
            <option
              value="percent"
              style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
            >
              All Percent
            </option>

            <option
              value="fixed"
              style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
            >
              All Fixed
            </option>

            <option
              value="percent_last_fixed"
              style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
            >
              Percent + Last Fixed
            </option>
          </select>

          <div className="mt-2 flex items-center justify-between">
            <div className="font-semibold text-amber-100">Paid Places</div>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/15"
              onClick={() => dispatch({ type: "ADD_PRIZE_PLACE" })}
              type="button"
            >
              + Add Place
            </button>
          </div>

          <div className="space-y-2">
            {state.prize.places.map((p, i) => {
              const isLast = i === state.prize.places.length - 1;
              const isLockedLast =
                state.prize.mode === "percent_last_fixed" && isLast;

              return (
                <div
                  key={i}
                  className="rounded-xl border border-amber-400/10 bg-white/5 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {isLockedLast ? "Last" : p.label || `Place ${i + 1}`}
                    </div>
                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-amber-400/10"
                      onClick={() =>
                        dispatch({ type: "REMOVE_PRIZE_PLACE", index: i })
                      }
                      type="button"
                      disabled={state.prize.places.length <= 1 || isLockedLast} // optional: prevent removing last in hybrid mode
                      title={
                        isLockedLast
                          ? "Last place is required in this mode"
                          : "Remove"
                      }
                      style={
                        isLockedLast
                          ? { opacity: 0.5, cursor: "not-allowed" }
                          : undefined
                      }
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="text-xs opacity-70">Label</label>
                      <input
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={isLockedLast ? "Last" : p.label || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_PRIZE_PLACE",
                            index: i,
                            patch: { label: e.target.value },
                          })
                        }
                        onFocus={(e) => e.target.select()}
                        disabled={isLockedLast}
                      />
                    </div>

                    <div>
                      <label className="text-xs opacity-70">
                        {p.type === "fixed" ? "Amount ($)" : "Percent (%)"}
                      </label>
                      <NumberInput
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={p.value}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_PRIZE_PLACE",
                            index: i,
                            patch: { value: Number(v) || 0 },
                          })
                        }
                        min={0}
                        step={1}
                        ariaLabel={`${p.label || `Place ${i + 1}`} value`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-semibold text-amber-100">Blind Structure</div>

          <label className="text-sm opacity-80">Template</label>
          <select
            className="w-full rounded-lg bg-gray-800 text-white border border-amber-400/20 p-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
            style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
            onChange={(e) => {
              const key = e.target.value;
              dispatch({
                type: "SET_TEMPLATE",
                rounds: BLIND_TEMPLATES[key].rounds,
              });
            }}
            defaultValue="regular"
          >
            {Object.entries(BLIND_TEMPLATES).map(([key, t]) => (
              <option
                key={key}
                value={key}
                style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
              >
                {t.name}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/15"
              onClick={() => dispatch({ type: "ADD_BLIND_ROUND" })}
              type="button"
            >
              + Blind Round
            </button>
            <button
              className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-amber-400/15"
              onClick={() => dispatch({ type: "ADD_BREAK_ROUND" })}
              type="button"
            >
              + Break
            </button>
          </div>

          <div className="space-y-2 mt-3">
            {state.blinds.map((r, i) => (
              <div
                key={i}
                className="rounded-xl border border-amber-400/10 bg-white/5 p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {(() => {
                      // Compute blind level number up to this index (breaks don't count)
                      let level = 0;
                      for (let j = 0; j <= i; j++) {
                        if (state.blinds[j]?.type === "blind") level++;
                      }

                      if (r.type === "break") {
                        // Break doesn't count as a level; show where it occurs
                        return `Break (after Level ${Math.max(1, level)})`;
                      }

                      return `Level ${Math.max(1, level)}`;
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-amber-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() =>
                        dispatch({ type: "MOVE_ROUND", from: i, dir: -1 })
                      }
                      disabled={i === 0}
                      type="button"
                      title="Move up"
                    >
                      ↑
                    </button>

                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-amber-400/10 disabled:opacity-40 disabled:cursor-not-allowed"
                      onClick={() =>
                        dispatch({ type: "MOVE_ROUND", from: i, dir: 1 })
                      }
                      disabled={i === state.blinds.length - 1}
                      type="button"
                      title="Move down"
                    >
                      ↓
                    </button>

                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border border-amber-400/10"
                      onClick={() =>
                        dispatch({ type: "REMOVE_ROUND", index: i })
                      }
                      type="button"
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {r.type === "blind" ? (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    <div>
                      <label className="text-xs opacity-70">Small</label>
                      <NumberInput
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={r.small}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_ROUND",
                            index: i,
                            patch: { small: onNum(v) },
                          })
                        }
                        min={0}
                        step={1}
                        ariaLabel={`Round ${i + 1} small blind`}
                      />
                    </div>

                    <div>
                      <label className="text-xs opacity-70">Big</label>
                      <NumberInput
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={r.big}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_ROUND",
                            index: i,
                            patch: { big: onNum(v) },
                          })
                        }
                        min={0}
                        step={1}
                        ariaLabel={`Round ${i + 1} big blind`}
                      />
                    </div>

                    <div>
                      <label className="text-xs opacity-70">Min</label>
                      <NumberInput
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={Math.round(r.durationSec / 60)}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_ROUND",
                            index: i,
                            patch: { durationSec: Math.max(0, onNum(v)) * 60 },
                          })
                        }
                        min={0}
                        step={1}
                        ariaLabel={`Round ${i + 1} minutes`}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2 mt-2">
                    <div>
                      <label className="text-xs opacity-70">
                        Break Minutes
                      </label>
                      <NumberInput
                        className="w-full rounded bg-white/10 border border-amber-400/15 p-1"
                        value={Math.round(r.durationSec / 60)}
                        onChange={(v) =>
                          dispatch({
                            type: "UPDATE_ROUND",
                            index: i,
                            patch: { durationSec: Math.max(0, onNum(v)) * 60 },
                          })
                        }
                        min={0}
                        step={1}
                        ariaLabel={`Break after round ${i + 1} minutes`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
