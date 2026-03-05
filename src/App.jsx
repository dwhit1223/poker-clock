import { useEffect, useReducer, useState } from "react";
import { createInitialState } from "./app/initialState";
import { reducer } from "./app/reducer";
import Dashboard from "./components/Dashboard";
import {
  playBlindUpSound,
  playBreakSound,
  playOneMinuteSound,
} from "./lib/sound";

function ActivateScreen({ onActivated }) {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | error
  const [error, setError] = useState("");

  async function activate() {
    setStatus("working");
    setError("");

    try {
      const res = await fetch("/api/license/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseKey }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Activation failed.");
        return;
      }

      setStatus("idle");
      onActivated();
    } catch (e) {
      setStatus("error");
      setError(String(e?.message || e));
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="text-2xl font-bold">Activate Poker Clock Pro</div>
        <div className="mt-2 text-white/70 text-sm">
          Enter your Gumroad license key to unlock Pro on this machine.
        </div>

        <label className="block mt-6 text-sm text-white/80">License key</label>
        <input
          className="mt-2 w-full rounded-xl bg-black/40 border border-white/15 px-3 py-3 outline-none focus:border-white/30"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
        />

        {status === "error" && (
          <div className="mt-3 text-sm text-red-300">{error}</div>
        )}

        <button
          className="mt-6 w-full rounded-xl bg-[#D4AF37] text-black font-semibold py-3 disabled:opacity-60"
          onClick={activate}
          disabled={!licenseKey.trim() || status === "working"}
        >
          {status === "working" ? "Activating..." : "Activate"}
        </button>

        <div className="mt-4 text-xs text-white/50">
          After activation, Poker Clock Pro can run offline on this computer.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState);

  const [licenseState, setLicenseState] = useState({
    checked: false,
    activated: false,
    error: "",
  });

  // Check activation status once at startup
  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await fetch("/api/license/status");
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        setLicenseState({
          checked: true,
          activated: !!data.activated,
          error: "",
        });
      } catch (e) {
        if (cancelled) return;
        setLicenseState({
          checked: true,
          activated: false,
          error: "Could not check activation status.",
        });
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  // tick loop
  useEffect(() => {
    const id = setInterval(
      () => dispatch({ type: "TIMER_TICK", nowMs: Date.now() }),
      250,
    );
    return () => clearInterval(id);
  }, []);

  // play transition sound on every transition (reliable)
  useEffect(() => {
    if (!state.ui.lastTransitionAt) return;

    const current = state.blinds[state.currentRoundIndex];
    if (current?.type === "break") playBreakSound();
    else playBlindUpSound();
  }, [state.ui.lastTransitionAt, state.currentRoundIndex, state.blinds]);

  // auto-clear flash overlay (visual only)
  useEffect(() => {
    if (!state.ui.flash) return;

    const t = setTimeout(() => dispatch({ type: "CLEAR_FLASH" }), 2000);
    return () => clearTimeout(t);
  }, [state.ui.flash]);

  // 1-minute warning sound (fires once per round)
  useEffect(() => {
    if (state.ui.oneMinuteWarnedRoundIndex == null) return;
    playOneMinuteSound();
  }, [state.ui.oneMinuteWarnedRoundIndex]);

  // Gate the app
  if (!licenseState.checked) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        Checking license…
      </div>
    );
  }

  if (!licenseState.activated) {
    return (
      <ActivateScreen
        onActivated={() =>
          setLicenseState((s) => ({ ...s, activated: true, error: "" }))
        }
      />
    );
  }

  return <Dashboard state={state} dispatch={dispatch} />;
}
