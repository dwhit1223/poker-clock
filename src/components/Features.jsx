// src/components/Features.jsx
export default function Features() {
  const base = import.meta.env.BASE_URL || "/";
  const demoUrl = `${base}demo`;

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
      {/* Top bar (consistent) */}
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
            href={`${base}pricing`}
            className="px-4 py-2 rounded-lg border text-sm font-semibold"
            style={pill}
          >
            View Pricing
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
            BUILT FOR REAL TOURNAMENTS
          </div>

          <h1
            className="mt-4 text-4xl md:text-5xl font-extrabold font-display tracking-wide"
            style={{ color: ACCENT }}
          >
            Built for real poker games.
          </h1>

          <p className="mt-4 text-lg opacity-80 leading-relaxed">
            A clean, big-screen tournament clock you can trust — designed for
            home games, poker clubs, and anyone who wants the room to feel
            organized and professional.
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            title="Blind timer + breaks"
            desc="Clear level tracking with automatic transitions — no confusion, no math on the fly."
            accent={ACCENT}
          />
          <FeatureCard
            title="Big-screen display"
            desc="Large fonts, high contrast, and fullscreen-ready so everyone in the room can see it."
            accent={ACCENT}
          />
          <FeatureCard
            title="Prize pool tools"
            desc="Dealer and bounty deductions supported with clean payout calculations."
            accent={ACCENT}
          />
          <FeatureCard
            title="Offline-friendly"
            desc="Runs locally. No account required. Great for local networks and TV setups."
            accent={ACCENT}
          />
          <FeatureCard
            title="Save & load presets (Pro)"
            desc="Store tournament setups and reload instantly for recurring games."
            accent={ACCENT}
          />
          <FeatureCard
            title="Custom branding (Pro)"
            desc="Upload your club logo, adjust fonts, and set colors that look great on a TV."
            accent={ACCENT}
          />
          <FeatureCard
            title="Custom sounds (Pro)"
            desc="Use your own audio for blinds up, one-minute warning, and breaks."
            accent={ACCENT}
          />
          <FeatureCard
            title="Polished experience"
            desc="Built by someone who actually runs tournaments — focused on clarity and flow."
            accent={ACCENT}
          />
          <FeatureCard
            title="Demo mode"
            desc="Try it in your browser first, then upgrade to the offline Pro app when ready."
            accent={ACCENT}
          />
        </div>

        {/* Callout */}
        <div
          className="mt-10 rounded-3xl bg-black/25 p-8"
          style={{ border: borderAccent }}
        >
          <div className="text-sm opacity-70 tracking-widest">TIP</div>
          <div className="mt-3 text-lg font-semibold" style={{ color: ACCENT }}>
            This is made for a TV.
          </div>
          <div className="mt-2 opacity-80 leading-relaxed">
            Open the demo, hit fullscreen, and throw it on a big screen — that’s
            where Poker Clock Pro feels “real”.
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={demoUrl}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
              style={{ border: borderSoft }}
            >
              Launch Demo
            </a>

            <a
              href={`${base}pricing`}
              className="px-5 py-3 rounded-xl text-black font-extrabold hover:opacity-90"
              style={{ backgroundColor: ACCENT }}
            >
              See Pricing
            </a>
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

function FeatureCard({ title, desc, accent }) {
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  return (
    <div
      className="rounded-3xl bg-white/5 p-6"
      style={{ border: `1px solid ${withAlpha(accent, "22")}` }}
    >
      <div className="text-sm opacity-70 tracking-widest">FEATURE</div>
      <div className="mt-2 text-lg font-semibold" style={{ color: accent }}>
        {title}
      </div>
      <div className="mt-2 opacity-80 leading-relaxed text-sm">{desc}</div>
    </div>
  );
}
