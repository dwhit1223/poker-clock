export default function Features() {
  const ACCENT = "#D4AF37";

  return (
    <div className="min-h-screen text-white bg-[#030712] px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-4xl font-extrabold font-display"
          style={{ color: ACCENT }}
        >
          Built for Real Poker Games
        </h1>

        <div className="mt-12 grid md:grid-cols-2 gap-10">
          <Feature title="Blind Timer & Breaks">
            Clear level tracking with automatic transitions.
          </Feature>

          <Feature title="Prize Pool Tools">
            Dealer and bounty deductions built in.
          </Feature>

          <Feature title="TV-Optimized Design">
            Large fonts, high contrast, fullscreen-ready.
          </Feature>

          <Feature title="Custom Branding (Pro)">
            Upload logos, change fonts, customize colors.
          </Feature>

          <Feature title="Custom Sounds (Pro)">
            Replace default sounds with your own.
          </Feature>

          <Feature title="Save & Load Presets (Pro)">
            Store tournament structures and reload instantly.
          </Feature>
        </div>
      </div>
    </div>
  );
}

function Feature({ title, children }) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <div className="font-semibold text-lg">{title}</div>
      <div className="mt-2 opacity-70">{children}</div>
    </div>
  );
}
