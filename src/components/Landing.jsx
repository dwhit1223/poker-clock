export default function Landing() {
  const base = import.meta.env.BASE_URL || "/";
  const demoUrl = `${base}demo`;

  // Pick ONE accent that matches your logo.
  // If your logo is gold: keep this.
  // If your logo is red/black: change to something like "#ef4444".
  const ACCENT = "#D4AF37"; // brand accent (gold)
  const RED = "#C1121F";

  // Helpers
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderSoft = "1px solid rgba(255,255,255,0.10)";
  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`; // ~20%
  const accentSoftBg = withAlpha(ACCENT, "14"); // ~8%
  const accentBg = withAlpha(ACCENT, "1F"); // ~12%

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `
          radial-gradient(circle at center, ${withAlpha(ACCENT, "14")} 0%, rgba(0,0,0,0) 55%),
          radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)
        `,
      }}
    >
      {/* Top bar */}
      <div className="max-w-6xl mx-auto px-5 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-end">
          <a href={base} className="block">
            <img
              src="/images/logo-horizontal.png"
              alt="Poker Clock Pro"
              className="h-20 sm:h-24 md:h-32 w-auto"
            />
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

          <div
            className="px-4 py-2 rounded-lg border text-sm font-semibold"
            style={{
              backgroundColor: withAlpha(RED, "14"),
              border: `1px solid ${withAlpha(RED, "33")}`,
              color: RED,
            }}
          >
            Pro version coming soon
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold font-display tracking-wide"
              style={{ color: ACCENT }}
            >
              Run a clean, professional poker tournament.
            </h1>

            <p className="mt-4 text-lg opacity-80 leading-relaxed">
              A big-screen tournament clock with blinds, breaks, and prize pool
              tools—built for home games and poker clubs.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={demoUrl}
                className="px-5 py-3 rounded-xl text-black font-extrabold"
                style={{ backgroundColor: ACCENT }}
              >
                Launch Free Demo
              </a>

              <div
                className="px-5 py-3 rounded-xl bg-white/10 border font-semibold"
                style={{ border: borderAccent }}
              >
                Pro version coming soon
                <span className="ml-2 opacity-70 text-sm">
                  (logo + branding + more)
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-sm">
              <Feature
                title="Big-screen friendly"
                desc="Designed for TVs and projectors."
                accent={ACCENT}
              />
              <Feature
                title="Breaks + blind progression"
                desc="Stay on schedule, no confusion."
                accent={ACCENT}
              />
              <Feature
                title="Prize pool tools"
                desc="Dealer/bounty deductions supported."
                accent={ACCENT}
              />
              <Feature
                title="Offline-friendly"
                desc="Works great on local networks."
                accent={ACCENT}
              />
            </div>
          </div>

          {/* Mock preview card */}
          <div
            className="rounded-3xl bg-black/25 p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
            style={{ border: borderAccent }}
          >
            <div className="text-sm opacity-70 tracking-widest">
              DEMO PREVIEW
            </div>

            <div
              className="mt-4 rounded-2xl bg-white/5 p-6"
              style={{ border: borderSoft }}
            >
              <div className="text-xs opacity-60 tracking-widest">
                CURRENT BLINDS
              </div>

              <div
                className="mt-2 text-4xl md:text-5xl font-extrabold font-display"
                style={{
                  color: ACCENT,
                  textShadow: `0 0 24px ${withAlpha(ACCENT, "40")}`,
                }}
              >
                200 / 400
              </div>

              <div className="mt-8 text-xs opacity-60 tracking-widest">
                TIME REMAINING
              </div>

              <div className="mt-2 text-[64px] md:text-[80px] leading-none font-extrabold font-display tabular-nums text-white/90">
                12:34
              </div>

              <div className="mt-8 text-xs opacity-60 tracking-widest">
                NEXT BLINDS
              </div>

              <div
                className="mt-2 text-2xl font-bold font-display"
                style={{ color: ACCENT, opacity: 0.85 }}
              >
                300 / 600
              </div>

              <div className="mt-8">
                <a
                  href={demoUrl}
                  className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
                  style={{ border: borderAccent }}
                >
                  Open the Demo →
                </a>
              </div>
            </div>

            <div className="mt-4 text-xs opacity-60">
              Tip: open the demo in fullscreen on a TV for the best experience.
            </div>
          </div>
        </div>
      </div>

      {/* Notify section */}
      <div className="max-w-6xl mx-auto px-5 pb-12">
        <div
          className="rounded-3xl bg-black/25 p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
          style={{ border: borderAccent }}
        >
          <div className="text-sm opacity-70 tracking-widest">
            PRO VERSION COMING SOON
          </div>

          <div
            className="mt-2 text-2xl md:text-3xl font-extrabold font-display"
            style={{ color: ACCENT }}
          >
            Want an email when Pro launches?
          </div>

          <div className="mt-2 opacity-75">
            Drop your email and I’ll notify you when Poker Clock Pro is ready.
          </div>

          <form
            className="mt-6 flex flex-col sm:flex-row gap-3"
            action="https://formspree.io/f/mnjbwqjj"
            method="POST"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="flex-1 rounded-xl bg-white/10 border px-4 py-3 outline-none"
              style={{ border: borderAccent }}
            />

            <input type="hidden" name="source" value="Landing Page" />

            <button
              type="submit"
              className="px-5 py-3 rounded-xl text-black font-extrabold"
              style={{ backgroundColor: ACCENT }}
            >
              Notify Me
            </button>
          </form>

          <div className="mt-3 text-xs opacity-60">
            No spam. Just a launch email.
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-6xl mx-auto px-5 pb-10">
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm opacity-70">
          <div>© {new Date().getFullYear()} Poker Clock Pro</div>
          <div className="flex items-center gap-4">
            <a className="hover:opacity-100" href={demoUrl}>
              Demo
            </a>
            <span className="opacity-30">•</span>
            <span>Pro version coming soon</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, desc, accent }) {
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
      <div className="mt-1 opacity-70">{desc}</div>
    </div>
  );
}
