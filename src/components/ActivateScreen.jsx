import { useState } from "react";

export default function ActivateScreen({ onActivated }) {
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState("idle"); // idle | working | error | success
  const [error, setError] = useState("");

  async function activate() {
    if (!licenseKey.trim() || status === "working") return;

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

      setStatus("success");
    } catch {
      setStatus("error");
      setError(
        "Couldn't reach the activation server. Check your internet connection and try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl text-center">
          <div className="text-2xl font-bold" style={{ color: "#D4AF37" }}>
            Activation complete
          </div>
          <div className="mt-3 text-white/70 text-sm">
            Poker Clock Pro can now run offline on this computer.
          </div>
          <button
            type="button"
            className="mt-6 w-full rounded-xl text-black font-semibold py-3"
            style={{ backgroundColor: "#D4AF37" }}
            onClick={onActivated}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="text-2xl font-bold">Activate Poker Clock Pro</div>
        <div className="mt-2 text-white/70 text-sm">
          Enter the license key from your Gumroad purchase.
        </div>

        <label className="block mt-6 text-sm text-white/80" htmlFor="license-key">
          License key
        </label>
        <input
          id="license-key"
          className="mt-2 w-full rounded-xl bg-black/40 border border-white/15 px-3 py-3 outline-none focus:border-white/30"
          placeholder="XXXX-XXXX-XXXX-XXXX"
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") activate();
          }}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck={false}
          aria-label="License key"
        />

        {status === "error" && (
          <div className="mt-3 text-sm text-red-300">{error}</div>
        )}

        <button
          type="button"
          className="mt-6 w-full rounded-xl text-black font-semibold py-3 disabled:opacity-60"
          style={{ backgroundColor: "#D4AF37" }}
          onClick={activate}
          disabled={!licenseKey.trim() || status === "working"}
        >
          {status === "working" ? "Activating..." : "Activate"}
        </button>

        <div className="mt-4 text-xs text-white/50">
          Internet connection required for this one-time activation. Poker
          Clock Pro runs fully offline afterward.
        </div>
      </div>
    </div>
  );
}
