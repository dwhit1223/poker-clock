// src/components/Features.jsx
export default function Features() {
  const ACCENT = "#D4AF37"; // gold

  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`;
  const accentBg = withAlpha(ACCENT, "1F");

  const pill = {
    backgroundColor: accentBg,
    border: borderAccent,
    color: ACCENT,
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-black tracking-widest"
          style={pill}
        >
          BUILT FOR REAL TOURNAMENTS
        </div>

        <h2
          className="mt-4 text-2xl md:text-3xl font-extrabold font-display tracking-wide"
          style={{ color: ACCENT }}
        >
          Built for real poker games.
        </h2>

        <p className="mt-3 opacity-80 leading-relaxed">
          A clean, big-screen tournament clock you can trust — designed for home
          games, poker clubs, and anyone who wants the room to feel organized
          and professional.
        </p>
      </div>

      {/* Feature grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
        className="rounded-2xl bg-white/5 p-6 border border-white/10"
        style={{ border: borderAccent }}
      >
        <div className="text-sm opacity-70 tracking-widest">TIP</div>
        <div className="mt-2 font-semibold" style={{ color: ACCENT }}>
          This is made for a TV.
        </div>
        <div className="mt-2 opacity-80 leading-relaxed text-sm">
          Open the demo, hit fullscreen, and throw it on a big screen — that’s
          where Poker Clock Pro feels “real”.
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
      className="rounded-2xl bg-white/5 p-6"
      style={{ border: `1px solid ${withAlpha(accent, "22")}` }}
    >
      <div className="text-sm opacity-70 tracking-widest">FEATURE</div>
      <div className="mt-2 font-semibold" style={{ color: accent }}>
        {title}
      </div>
      <div className="mt-2 opacity-80 leading-relaxed text-sm">{desc}</div>
    </div>
  );
}
