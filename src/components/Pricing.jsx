// src/components/Pricing.jsx
export default function Pricing() {
  const base = import.meta.env.BASE_URL || "/";
  const demoUrl = `${base}demo`;

  // Match Landing.jsx + other pages
  const ACCENT = "#D4AF37"; // gold
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderSoft = "1px solid rgba(255,255,255,0.10)";
  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`;
  const accentSoftBg = withAlpha(ACCENT, "14");
  const accentBg = withAlpha(ACCENT, "1F");

  // TODO: set this when ready
  const CHECKOUT_URL = "#";

  const pill = {
    backgroundColor: accentBg,
    border: borderAccent,
    color: ACCENT,
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `
          radial-gradient(circle at center, ${accentSoftBg} 0%, rgba(0,0,0,0) 55%),
          radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)
        `,
      }}
    >
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-5 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <a href={base} className="inline-block">
            <img
              src="/images/logo-horizontal.png"
              alt="Poker Clock Pro"
              className="h-20 sm:h-24 md:h-32 w-auto"
            />
          </a>

          <a href={base} className="mt-1 text-sm opacity-70 hover:opacity-100">
            ← Back to Home
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={demoUrl}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border text-sm font-semibold"
            style={{ border: borderSoft }}
          >
            Try the Demo
          </a>

          <a
            href={CHECKOUT_URL}
            className="px-4 py-2 rounded-lg text-black font-extrabold hover:opacity-90"
            style={{ backgroundColor: ACCENT }}
          >
            Buy Pro
          </a>
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black tracking-widest"
            style={pill}
          >
            ONE-TIME PURCHASE
          </div>

          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold font-display tracking-wide"
            style={{ color: ACCENT }}
          >
            Simple pricing. No subscriptions.
          </h1>

          <p className="mt-4 text-lg opacity-80 leading-relaxed">
            Buy once, run tournaments forever. Built for home games and poker
            clubs that want a clean, big-screen experience.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Left: summary */}
          <div
            className="lg:col-span-1 rounded-3xl bg-black/25 p-6"
            style={{ border: borderAccent }}
          >
            <div className="text-sm opacity-70 tracking-widest">INCLUDED</div>

            <ul className="mt-4 space-y-3 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span style={{ color: ACCENT }}>✓</span>
                <span>
                  <span style={{ color: ACCENT }} className="font-semibold">
                    Offline
                  </span>{" "}
                  local app (ZIP download + EXE launcher)
                </span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: ACCENT }}>✓</span>
                <span>TV-ready fullscreen display</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: ACCENT }}>✓</span>
                <span>Save / load tournament presets</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: ACCENT }}>✓</span>
                <span>Blinds + breaks + prize pool tools</span>
              </li>
            </ul>

            <div
              className="mt-6 rounded-2xl bg-white/5 p-4"
              style={{ border: borderSoft }}
            >
              <div className="text-xs opacity-70">Good to know</div>
              <div className="mt-1 text-sm opacity-80 leading-relaxed">
                You’ll get updates & fixes as you keep using the app.
              </div>
            </div>
          </div>

          {/* Right: price + features */}
          <div
            className="lg:col-span-2 rounded-3xl bg-black/25 p-8 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
            style={{ border: borderAccent }}
          >
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <div className="text-sm tracking-widest opacity-70">
                  POKER CLOCK PRO
                </div>

                <div className="mt-3 flex items-end gap-3 justify-center md:justify-start">
                  <div className="text-6xl md:text-7xl font-extrabold">$29</div>
                  <div className="pb-2 text-sm opacity-70">one-time</div>
                </div>

                <div className="mt-2 opacity-75">
                  No monthly fees. No account required.
                </div>
              </div>

              <div className="flex gap-3 justify-center md:justify-end">
                <a
                  href={demoUrl}
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
                  style={{ border: borderSoft }}
                >
                  Try Demo
                </a>

                <a
                  href={CHECKOUT_URL}
                  className="px-6 py-3 rounded-xl text-black font-extrabold hover:opacity-90"
                  style={{ backgroundColor: ACCENT }}
                >
                  Buy Now
                </a>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <IncludedCard
                title="Custom logo upload"
                desc="Add your poker club’s logo (saved in config)."
                accent={ACCENT}
              />
              <IncludedCard
                title="Themes (fonts & colors)"
                desc="Pick a preset or customize your own look."
                accent={ACCENT}
              />
              <IncludedCard
                title="Custom sound uploads"
                desc="Use your own blinds/break/1-minute audio."
                accent={ACCENT}
              />
              <IncludedCard
                title="Presets"
                desc="Save & load tournament setups in seconds."
                accent={ACCENT}
              />
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-2 text-sm">
              <div
                className="rounded-2xl bg-white/5 p-4"
                style={{ border: borderSoft }}
              >
                <div className="font-semibold" style={{ color: ACCENT }}>
                  7-day refund policy
                </div>
                <div className="mt-1 opacity-75 leading-relaxed">
                  If it’s not for you, request a refund within 7 days.
                </div>
                <a
                  href={`${base}refund`}
                  className="mt-2 inline-block text-xs opacity-75 hover:opacity-100"
                >
                  Read the refund policy →
                </a>
              </div>

              <div
                className="rounded-2xl bg-white/5 p-4"
                style={{ border: borderSoft }}
              >
                <div className="font-semibold" style={{ color: ACCENT }}>
                  Friendly support
                </div>
                <div className="mt-1 opacity-75 leading-relaxed">
                  Quick troubleshooting + help getting set up.
                </div>
                <a
                  href={`${base}support`}
                  className="mt-2 inline-block text-xs opacity-75 hover:opacity-100"
                >
                  Visit support →
                </a>
              </div>
            </div>

            <div className="mt-4 text-xs opacity-60">
              Tip: open the demo fullscreen on a TV to see the real experience.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 border-t border-white/10 pt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm opacity-80">
          <div>© {new Date().getFullYear()} Poker Clock Pro</div>

          <div className="flex flex-wrap items-center gap-4">
            <a className="hover:opacity-100" href={`${base}features`}>
              Features
            </a>
            <span className="opacity-30">•</span>
            <a className="hover:opacity-100" href={`${base}pricing`}>
              Pricing
            </a>
            <span className="opacity-30">•</span>
            <a className="hover:opacity-100" href={demoUrl}>
              Demo
            </a>
            <span className="opacity-30">•</span>
            <a className="hover:opacity-100" href={`${base}support`}>
              Support
            </a>
            <span className="opacity-30">•</span>
            <a className="hover:opacity-100" href={`${base}privacy`}>
              Privacy
            </a>
            <span className="opacity-30">•</span>
            <a className="hover:opacity-100" href={`${base}refund`}>
              Refunds
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function IncludedCard({ title, desc, accent }) {
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  return (
    <div
      className="rounded-2xl bg-white/5 p-4"
      style={{ border: `1px solid ${withAlpha(accent, "22")}` }}
    >
      <div className="font-semibold" style={{ color: withAlpha(accent, "E6") }}>
        {title}
      </div>
      <div className="mt-1 opacity-70 text-sm leading-relaxed">{desc}</div>
    </div>
  );
}
