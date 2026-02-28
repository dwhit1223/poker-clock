// src/components/Pricing.jsx
export default function Pricing() {
  // Match Landing.jsx + other pages
  const ACCENT = "#D4AF37"; // gold
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`;
  const accentBg = withAlpha(ACCENT, "1F");

  // TODO: set this when ready
  const CHECKOUT_URL = "#";

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
          ONE-TIME PURCHASE
        </div>

        <h2
          className="mt-4 text-2xl md:text-3xl font-extrabold font-display tracking-wide"
          style={{ color: ACCENT }}
        >
          Simple pricing. No subscriptions.
        </h2>

        <p className="mt-3 opacity-80 leading-relaxed">
          Buy once, run tournaments forever. Built for home games and poker
          clubs that want a clean, big-screen experience.
        </p>
      </div>

      {/* Pricing grid */}
      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        {/* Left: summary */}
        <div
          className="lg:col-span-1 rounded-2xl bg-white/5 p-6 border border-white/10"
          style={{ border: borderAccent }}
        >
          <div className="text-sm opacity-70 tracking-widest">INCLUDED</div>

          <ul className="mt-4 space-y-3 text-sm leading-relaxed opacity-80">
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

          <div className="mt-6 rounded-2xl bg-black/20 p-4 border border-white/10">
            <div className="text-xs opacity-70">Good to know</div>
            <div className="mt-1 text-sm opacity-80 leading-relaxed">
              You’ll get updates &amp; fixes as you keep using the app.
            </div>
          </div>
        </div>

        {/* Right: price + features */}
        <div
          className="lg:col-span-2 rounded-2xl bg-white/5 p-6 md:p-8 border border-white/10"
          style={{ border: borderAccent }}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-sm tracking-widest opacity-70">
                POKER CLOCK PRO
              </div>

              <div className="mt-3 flex items-end gap-3 justify-center md:justify-start">
                <div className="text-5xl md:text-6xl font-extrabold">$29</div>
                <div className="pb-2 text-sm opacity-70">one-time</div>
              </div>

              <div className="mt-2 opacity-75">
                No monthly fees. No account required.
              </div>
            </div>

            <div className="flex gap-3 justify-center md:justify-end">
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
            <div className="rounded-2xl bg-black/20 p-4 border border-white/10">
              <div className="font-semibold" style={{ color: ACCENT }}>
                7-day refund policy
              </div>
              <div className="mt-1 opacity-75 leading-relaxed">
                If it’s not for you, request a refund within 7 days.
              </div>
              <div className="mt-2 text-xs opacity-75">
                See the refund policy page for details.
              </div>
            </div>

            <div className="rounded-2xl bg-black/20 p-4 border border-white/10">
              <div className="font-semibold" style={{ color: ACCENT }}>
                Friendly support
              </div>
              <div className="mt-1 opacity-75 leading-relaxed">
                Quick troubleshooting + help getting set up.
              </div>
              <div className="mt-2 text-xs opacity-75">
                Visit the support page for the fastest help.
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs opacity-60">
            Tip: open the demo fullscreen on a TV to see the real experience.
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
      className="rounded-2xl bg-black/20 p-4 border border-white/10"
      style={{ border: `1px solid ${withAlpha(accent, "22")}` }}
    >
      <div className="font-semibold" style={{ color: withAlpha(accent, "E6") }}>
        {title}
      </div>
      <div className="mt-1 opacity-70 text-sm leading-relaxed">{desc}</div>
    </div>
  );
}
