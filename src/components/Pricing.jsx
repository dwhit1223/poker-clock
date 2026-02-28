export default function Pricing() {
  const ACCENT = "#D4AF37";

  return (
    <div className="min-h-screen text-white bg-[#030712] px-6 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1
          className="text-4xl font-extrabold font-display"
          style={{ color: ACCENT }}
        >
          Simple, One-Time Pricing
        </h1>

        <p className="mt-4 opacity-80">
          No subscriptions. No monthly fees. Buy once and use it forever.
        </p>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-10">
          <div className="text-sm tracking-widest opacity-60">
            POKER CLOCK PRO
          </div>

          <div className="mt-4 text-5xl font-extrabold">$29</div>

          <div className="mt-2 opacity-70">One-time purchase</div>

          <ul className="mt-8 space-y-3 text-left max-w-md mx-auto">
            <li>• Custom logo upload</li>
            <li>• Custom themes (fonts & colors)</li>
            <li>• Custom sound uploads</li>
            <li>• Save & load tournament presets</li>
            <li>• Offline local app</li>
          </ul>

          <button
            className="mt-10 px-8 py-4 rounded-xl font-extrabold text-black"
            style={{ backgroundColor: ACCENT }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
