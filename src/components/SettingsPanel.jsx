import { BLIND_TEMPLATES } from "../app/templates";
import { computePayouts } from "../app/selectors";
import NumberInput from "./NumberInput";
import {
  unlockAudio,
  playOneMinuteSound,
  playBreakSound,
  playBlindUpSound,
} from "../lib/sound";
import { PRO_ENABLED } from "../app/pro";
import { THEMES } from "../app/themes";

export default function SettingsPanel({ state, dispatch }) {
  const UPGRADE_URL = "https://YOUR-LINK-HERE";
  const payoutInfo = computePayouts(state);

  if (!state.ui.settingsOpen) return null;

  const onNum = (v) => Number(v) || 0;

  // Theme accent (safe fallback)
  const accent = state?.theme?.primaryColor || "#f59e0b";

  // Helper: add alpha to a #RRGGBB color => #RRGGBBAA
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex; // if it's already rgba() or something else, just pass through
  };

  // Reusable style tokens
  const panelBorder = `1px solid ${withAlpha(accent, "33")}`;
  const softBorder = `1px solid rgba(255,255,255,0.10)`;
  const accentBorder = `1px solid ${withAlpha(accent, "33")}`;
  const accentBgSoft = withAlpha(accent, "1F"); // ~12%

  const buttonClass =
    "px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 border transition-colors";
  const inputClass =
    "w-full rounded-lg bg-white/10 border p-2 text-white outline-none";
  const smallInputClass =
    "w-full rounded bg-white/10 border p-1 text-white outline-none";
  const selectClass =
    "w-full rounded-lg bg-gray-800 text-white border p-2 focus:outline-none";

  const sectionTitleStyle = { color: accent };

  // -----------------------------
  // Pro sound upload helpers
  // -----------------------------
  const uploadAudio = (key) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "audio/*";

    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const maxBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxBytes) {
        alert("Audio file too large. Please use a file under 5MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        dispatch({
          type: "SET_SOUND_URL",
          key,
          url: reader.result,
        });
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const clearAudio = (key) => dispatch({ type: "CLEAR_SOUND_URL", key });

  return (
    <div
      className="fixed right-4 top-16 bottom-4 w-[460px] md:w-[520px] lg:w-[620px] max-w-[92vw] overflow-auto rounded-2xl bg-black/80 backdrop-blur p-6"
      style={{ border: panelBorder }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="font-extrabold text-lg" style={{ color: accent }}>
            Settings
          </div>

          {PRO_ENABLED && (
            <span
              className="text-[10px] tracking-widest font-black px-2 py-1 rounded-full"
              style={{
                backgroundColor: accentBgSoft,
                color: accent,
                border: accentBorder,
              }}
            >
              PRO
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            className={buttonClass}
            style={{ border: softBorder }}
            onClick={() => dispatch({ type: "TOGGLE_SETTINGS" })}
            type="button"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {!PRO_ENABLED && (
          <section className="space-y-2">
            <div
              className="rounded-2xl p-5"
              style={{
                border: accentBorder,
                background: `linear-gradient(to bottom, ${accentBgSoft}, rgba(255,255,255,0.05))`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div
                    className="font-extrabold tracking-wide"
                    style={{ color: accent }}
                  >
                    Upgrade to Pro
                  </div>
                  <div className="text-sm opacity-75 mt-1">
                    Unlock logo upload, save/load presets, and custom sounds.
                  </div>
                </div>

                <span
                  className="text-[10px] tracking-widest font-black px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: accentBgSoft,
                    color: accent,
                    border: accentBorder,
                  }}
                >
                  PRO
                </span>
              </div>

              <div className="mt-4 flex flex-col items-center gap-3">
                <div className="text-xs opacity-60 text-center">
                  One-time purchase • Runs locally • TV-ready
                </div>

                <a
                  href={UPGRADE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center px-6 py-2 rounded-lg text-black font-extrabold text-sm leading-none text-center transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accent }}
                >
                  Get Pro
                </a>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-2">
          <div className="font-semibold" style={sectionTitleStyle}>
            Buy-in &amp; Rebuy Values
          </div>

          <label className="text-sm opacity-80">Buy-in ($)</label>
          <NumberInput
            className={inputClass}
            style={{ border: softBorder }}
            value={state.buyInValue}
            onChange={(v) => dispatch({ type: "SET_BUYIN_VALUE", value: v })}
            min={0}
            step={1}
            ariaLabel="Buy-in value"
          />

          <label className="text-sm opacity-80">Rebuy ($)</label>
          <NumberInput
            className={inputClass}
            style={{ border: softBorder }}
            value={state.rebuyValue}
            onChange={(v) => dispatch({ type: "SET_REBUY_VALUE", value: v })}
            min={0}
            step={1}
            ariaLabel="Rebuy value"
          />
        </section>

        {PRO_ENABLED ? (
          <section className="space-y-2">
            <div className="font-semibold" style={sectionTitleStyle}>
              Branding (Pro)
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className={buttonClass}
                style={{ border: softBorder }}
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";

                  input.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const maxBytes = 2 * 1024 * 1024; // 2MB
                    if (file.size > maxBytes) {
                      alert(
                        "Logo file too large. Please use an image under 2MB.",
                      );
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      dispatch({
                        type: "SET_LOGO_DATA_URL",
                        dataUrl: reader.result,
                      });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                }}
              >
                Upload Logo
              </button>

              <button
                className={buttonClass}
                style={{ border: softBorder }}
                type="button"
                onClick={() => dispatch({ type: "CLEAR_LOGO" })}
                disabled={!state.logoDataUrl}
                title={
                  !state.logoDataUrl
                    ? "No uploaded logo to clear"
                    : "Clear logo"
                }
              >
                Use Default
              </button>
            </div>

            <div
              className="mt-2 rounded-xl bg-white/5 p-4"
              style={{ border: softBorder }}
            >
              <div className="text-xs opacity-70 mb-2">Current logo</div>

              <div className="flex items-center gap-3">
                <img
                  src={
                    state.logoDataUrl ||
                    `${import.meta.env.BASE_URL}images/logo.png`
                  }
                  alt="Logo preview"
                  className="h-16 w-16 rounded-full object-contain bg-black/30"
                  style={{ border: softBorder }}
                />

                <div className="text-xs opacity-60 leading-snug">
                  {state.logoDataUrl ? (
                    <>
                      Using{" "}
                      <span style={{ color: accent }} className="font-semibold">
                        uploaded
                      </span>{" "}
                      logo (saved in config)
                    </>
                  ) : (
                    <>
                      Using{" "}
                      <span style={{ color: accent }} className="font-semibold">
                        default
                      </span>{" "}
                      logo
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs opacity-60">
              Upload a PNG/SVG/JPG. Recommended: square image (512×512).
            </div>
          </section>
        ) : (
          <section className="space-y-2">
            <div className="font-semibold" style={sectionTitleStyle}>
              Branding
            </div>

            <div
              className="rounded-xl bg-white/5 p-3 text-sm"
              style={{ border: softBorder }}
            >
              <div className="opacity-80">
                Custom logo upload is a{" "}
                <span style={{ color: accent }} className="font-semibold">
                  Pro
                </span>{" "}
                feature.
              </div>
              <div className="text-xs opacity-60 mt-1">
                Pro version includes logo upload, save/load configs, and custom
                sounds.
              </div>
            </div>
          </section>
        )}

        {/* PRO Theme Controls */}
        {PRO_ENABLED && (
          <section className="space-y-3">
            <div className="font-semibold" style={sectionTitleStyle}>
              Typography &amp; Colors (Pro)
            </div>

            <label className="text-sm opacity-80">Theme Preset</label>
            <select
              className={selectClass}
              style={{ border: softBorder }}
              value={state.theme.presetKey || "custom"}
              onChange={(e) => {
                const key = e.target.value;

                if (key === "custom") {
                  dispatch({ type: "SET_THEME_PRESET_KEY", value: "custom" });
                  return;
                }

                const preset = THEMES?.[key];
                if (!preset) return;

                // IMPORTANT: include presetKey so reducer can keep presetKey synced
                dispatch({
                  type: "APPLY_THEME_PRESET",
                  theme: preset.theme,
                  presetKey: key,
                });
                dispatch({ type: "SET_THEME_PRESET_KEY", value: key });
              }}
            >
              <option value="custom">Custom</option>
              {Object.entries(THEMES || {}).map(([key, t]) => (
                <option key={key} value={key}>
                  {t.label}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-3">
              <button
                className={buttonClass}
                style={{ border: softBorder }}
                type="button"
                onClick={() => {
                  const preset = THEMES?.casinoClassic || {
                    theme: state.theme,
                  };
                  dispatch({
                    type: "APPLY_THEME_PRESET",
                    theme: preset.theme,
                    presetKey: "casinoClassic",
                  });
                  dispatch({
                    type: "SET_THEME_PRESET_KEY",
                    value: "casinoClassic",
                  });
                }}
              >
                Reset Theme
              </button>

              <button
                className={buttonClass}
                style={{ border: softBorder }}
                type="button"
                onClick={() => {
                  dispatch({ type: "SET_THEME_PRESET_KEY", value: "custom" });
                }}
                title="Keep your current colors/fonts but mark as Custom"
              >
                Mark Custom
              </button>
            </div>

            <label className="text-sm opacity-80">Display Font</label>
            <select
              className={selectClass}
              style={{ border: softBorder }}
              value={state.theme.displayFont}
              onChange={(e) =>
                dispatch({ type: "SET_DISPLAY_FONT", value: e.target.value })
              }
            >
              <option value="Oswald">Oswald</option>
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>

            <label className="text-sm opacity-80">Body Font</label>
            <select
              className={selectClass}
              style={{ border: softBorder }}
              value={state.theme.bodyFont}
              onChange={(e) =>
                dispatch({ type: "SET_BODY_FONT", value: e.target.value })
              }
            >
              <option value="Inter">Inter</option>
              <option value="Oswald">Oswald</option>
              <option value="Arial">Arial</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm opacity-80">Primary Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-lg bg-white/10 border p-1"
                  style={{ border: softBorder }}
                  value={state.theme.primaryColor}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_PRIMARY_COLOR",
                      value: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm opacity-80">Timer Color</label>
                <input
                  type="color"
                  className="w-full h-10 rounded-lg bg-white/10 border p-1"
                  style={{ border: softBorder }}
                  value={state.theme.timerColor}
                  onChange={(e) =>
                    dispatch({ type: "SET_TIMER_COLOR", value: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="text-xs opacity-60">
              Tip: Pick a bright primary color for blinds/headers, and a
              high-contrast timer color (usually white) for readability on TVs.
            </div>
          </section>
        )}

        {/* PRO Custom Sounds */}
        {PRO_ENABLED && (
          <section className="space-y-2">
            <div className="font-semibold" style={sectionTitleStyle}>
              Custom Sounds (Pro)
            </div>

            <div className="text-xs opacity-60">
              Upload MP3/WAV/OGG. These are saved inside your config file.
            </div>

            <div className="space-y-3">
              {/* Blind Up */}
              <div
                className="rounded-xl bg-white/5 p-3"
                style={{ border: softBorder }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Blind Up</div>
                  <div className="text-xs opacity-60">
                    {state.sounds?.blindUpUrl ? "Custom" : "Default"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    onClick={() => uploadAudio("blindUpUrl")}
                  >
                    Upload
                  </button>
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    disabled={!state.sounds?.blindUpUrl}
                    onClick={() => clearAudio("blindUpUrl")}
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder, width: "100%" }}
                    type="button"
                    onClick={async () => {
                      await unlockAudio();
                      playBlindUpSound();
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* 1-Min Warning */}
              <div
                className="rounded-xl bg-white/5 p-3"
                style={{ border: softBorder }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">1-Minute Warning</div>
                  <div className="text-xs opacity-60">
                    {state.sounds?.oneMinuteUrl ? "Custom" : "Default"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    onClick={() => uploadAudio("oneMinuteUrl")}
                  >
                    Upload
                  </button>
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    disabled={!state.sounds?.oneMinuteUrl}
                    onClick={() => clearAudio("oneMinuteUrl")}
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder, width: "100%" }}
                    type="button"
                    onClick={async () => {
                      await unlockAudio();
                      playOneMinuteSound();
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>

              {/* Break */}
              <div
                className="rounded-xl bg-white/5 p-3"
                style={{ border: softBorder }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold">Break Start</div>
                  <div className="text-xs opacity-60">
                    {state.sounds?.breakUrl ? "Custom" : "Default"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    onClick={() => uploadAudio("breakUrl")}
                  >
                    Upload
                  </button>
                  <button
                    className={buttonClass}
                    style={{ border: softBorder }}
                    type="button"
                    disabled={!state.sounds?.breakUrl}
                    onClick={() => clearAudio("breakUrl")}
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-2">
                  <button
                    className={buttonClass}
                    style={{ border: softBorder, width: "100%" }}
                    type="button"
                    onClick={async () => {
                      await unlockAudio();
                      playBreakSound();
                    }}
                  >
                    Test
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="space-y-2">
          <div className="font-semibold" style={sectionTitleStyle}>
            Prize Distribution
          </div>

          <div
            className="rounded-xl bg-white/5 p-4 mt-3 text-sm"
            style={{ border: softBorder }}
          >
            <div className="font-semibold mb-2" style={{ color: accent }}>
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
              <span className="font-extrabold" style={{ color: accent }}>
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
                  <span className="font-extrabold" style={{ color: accent }}>
                    ${payoutInfo.percentBasePool}
                  </span>
                </div>
              </>
            )}
          </div>

          <label className="text-sm opacity-80">Dealer Pay ($)</label>
          <NumberInput
            className={inputClass}
            style={{ border: softBorder }}
            value={state.prize.dealerPay}
            onChange={(v) => dispatch({ type: "SET_DEALER_PAY", value: v })}
            min={0}
            step={1}
            ariaLabel="Dealer pay"
          />

          <label className="text-sm opacity-80">Bounty Pay ($)</label>
          <NumberInput
            className={inputClass}
            style={{ border: softBorder }}
            value={state.prize.bountyPay}
            onChange={(v) => dispatch({ type: "SET_BOUNTY_PAY", value: v })}
            min={0}
            step={1}
            ariaLabel="Bounty pay"
          />

          <label className="text-sm opacity-80">Mode</label>
          <select
            className={selectClass}
            style={{
              border: softBorder,
              backgroundColor: "#1f2937",
              color: "#ffffff",
            }}
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
            <div className="font-semibold" style={sectionTitleStyle}>
              Paid Places
            </div>
            <button
              className={buttonClass}
              style={{ border: softBorder }}
              onClick={() => dispatch({ type: "ADD_PRIZE_PLACE" })}
              type="button"
            >
              + Add Place
            </button>
          </div>

          <div className="space-y-2">
            {state.prize.places.map((p, i) => {
              const isLast = i === state.prize.places.length - 1;
              const isLockedType =
                state.prize.mode === "percent_last_fixed" && isLast;

              return (
                <div
                  key={i}
                  className="rounded-xl bg-white/5 p-3"
                  style={{ border: softBorder }}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold">
                      {p.label || `Place ${i + 1}`}
                    </div>

                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ border: softBorder }}
                      onClick={() =>
                        dispatch({ type: "REMOVE_PRIZE_PLACE", index: i })
                      }
                      type="button"
                      disabled={state.prize.places.length <= 1}
                      title="Remove"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="text-xs opacity-70">Label</label>
                      <input
                        className={smallInputClass}
                        style={{ border: softBorder }}
                        value={p.label || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_PRIZE_PLACE",
                            index: i,
                            patch: { label: e.target.value },
                          })
                        }
                        onFocus={(e) => e.target.select()}
                      />
                    </div>

                    <div>
                      <label className="text-xs opacity-70">
                        {p.type === "fixed" ? "Amount ($)" : "Percent (%)"}
                      </label>
                      <NumberInput
                        className={smallInputClass}
                        style={{ border: softBorder }}
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

                  {isLockedType && (
                    <div className="mt-2 text-[11px] opacity-60">
                      Note: In this mode, the{" "}
                      <span style={{ color: accent }}>last paid place</span> is
                      a fixed amount.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <div className="font-semibold" style={sectionTitleStyle}>
            Blind Structure
          </div>

          <label className="text-sm opacity-80">Template</label>
          <select
            className={selectClass}
            style={{
              border: softBorder,
              backgroundColor: "#1f2937",
              color: "#ffffff",
            }}
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

          <div className="grid grid-cols-2 gap-3 mt-2">
            <button
              className={buttonClass}
              style={{ border: softBorder }}
              onClick={() => dispatch({ type: "ADD_BLIND_ROUND" })}
              type="button"
            >
              + Blind Round
            </button>

            <button
              className={buttonClass}
              style={{ border: softBorder }}
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
                className="rounded-xl bg-white/5 p-3"
                style={{ border: softBorder }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">
                    {(() => {
                      let level = 0;
                      for (let j = 0; j <= i; j++) {
                        if (state.blinds[j]?.type === "blind") level++;
                      }

                      if (r.type === "break") {
                        return `Break (after Level ${Math.max(1, level)})`;
                      }

                      return `Level ${Math.max(1, level)}`;
                    })()}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ border: softBorder }}
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
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ border: softBorder }}
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
                      className="text-sm px-2 py-1 rounded bg-white/10 hover:bg-white/20 border"
                      style={{ border: softBorder }}
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
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div>
                      <label className="text-xs opacity-70">Small</label>
                      <NumberInput
                        className={smallInputClass}
                        style={{ border: softBorder }}
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
                        className={smallInputClass}
                        style={{ border: softBorder }}
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
                        className={smallInputClass}
                        style={{ border: softBorder }}
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
                        className={smallInputClass}
                        style={{ border: softBorder }}
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

        {PRO_ENABLED ? (
          <section className="space-y-2">
            <div className="font-semibold" style={sectionTitleStyle}>
              Configuration
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                className={buttonClass}
                style={{ border: softBorder }}
                onClick={() => dispatch({ type: "EXPORT_CONFIG" })}
                type="button"
              >
                Save Config
              </button>

              <button
                className={buttonClass}
                style={{ border: softBorder }}
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "application/json";

                  input.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    try {
                      const text = await file.text();
                      const config = JSON.parse(text);

                      dispatch({
                        type: "IMPORT_CONFIG",
                        config,
                      });
                    } catch {
                      alert("Invalid config file");
                    }
                  };

                  input.click();
                }}
                type="button"
              >
                Load Config
              </button>
            </div>
          </section>
        ) : (
          <section className="space-y-2">
            <div className="font-semibold" style={sectionTitleStyle}>
              Configuration
            </div>

            <div
              className="rounded-xl bg-white/5 p-3 text-sm"
              style={{ border: softBorder }}
            >
              <div className="opacity-80">
                Save/Load tournament presets is a{" "}
                <span style={{ color: accent }} className="font-semibold">
                  Pro
                </span>{" "}
                feature.
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
