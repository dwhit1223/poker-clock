export default function Refund() {
  const base = import.meta.env.BASE_URL || "/";
  const ACCENT = "#D4AF37";

  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderSoft = "1px solid rgba(255,255,255,0.10)";
  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`;
  const accentSoftBg = withAlpha(ACCENT, "14");

  const SUPPORT_EMAIL = "your@email.com";

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
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-14 pb-16 space-y-10">
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold font-display"
            style={{ color: ACCENT }}
          >
            Refund Policy
          </h1>
          <p className="mt-4 opacity-75">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div
          className="rounded-3xl bg-black/25 p-8 space-y-6"
          style={{ border: borderAccent }}
        >
          <Section title="7-Day Refund Window" accent={ACCENT}>
            Poker Clock Pro includes a <b>7-day refund policy</b>. If you’re not
            satisfied, contact support within <b>7 days</b> of purchase and
            we’ll issue a refund.
          </Section>

          <Section title="How to Request a Refund" accent={ACCENT}>
            Email support and include:
            <ul className="mt-2 list-disc list-inside space-y-2">
              <li>Your purchase email (or order receipt)</li>
              <li>The approximate purchase date</li>
              <li>
                A brief reason (optional, but it helps improve the product)
              </li>
            </ul>
            <div className="mt-4 text-sm opacity-80">
              Send requests to{" "}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold hover:opacity-90"
                style={{ color: ACCENT }}
              >
                {SUPPORT_EMAIL}
              </a>
              .
            </div>
          </Section>

          <Section title="What Refunds Cover" accent={ACCENT}>
            Refunds are intended for legitimate customers who tried the software
            and found it wasn’t a fit (setup issues, compatibility problems, or
            simply not what you expected).
          </Section>

          <Section title="Abuse & License Violations" accent={ACCENT}>
            Refunds may be denied in cases of abuse or license violations,
            including (but not limited to):
            <ul className="mt-2 list-disc list-inside space-y-2">
              <li>Redistribution or sharing download access broadly</li>
              <li>Reselling the software or providing it as a service</li>
              <li>Attempting to bypass licensing / access controls</li>
            </ul>
          </Section>

          <Section title="Processing Time" accent={ACCENT}>
            Most refunds are processed within <b>3–5 business days</b> after the
            request is approved. Timing can vary depending on your payment
            method.
          </Section>

          <div
            className="text-xs opacity-60 pt-4"
            style={{ borderTop: borderSoft }}
          >
            This policy is intended to be fair to legitimate customers while
            protecting the product from misuse.
          </div>
        </div>

        <div
          className="text-xs opacity-60 text-center rounded-2xl bg-white/5 p-4"
          style={{ border: borderSoft }}
        >
          Note: This page provides general information and is not legal advice.
        </div>
      </div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div className="space-y-2">
      <div className="text-lg font-semibold" style={{ color: accent }}>
        {title}
      </div>
      <div className="opacity-80 leading-relaxed text-sm">{children}</div>
    </div>
  );
}
