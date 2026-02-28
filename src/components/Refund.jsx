export default function Refund() {
  const ACCENT = "#D4AF37";
  const SUPPORT_EMAIL = "your@email.com";

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">
        Last updated: {new Date().toLocaleDateString()}
      </div>

      <Section title="7-Day Refund Window" accent={ACCENT}>
        Poker Clock Pro includes a <b>7-day refund policy</b>. If you’re not
        satisfied, contact support within <b>7 days</b> of purchase and we’ll
        issue a refund.
      </Section>

      <Section title="How to Request a Refund" accent={ACCENT}>
        <div className="space-y-3">
          <div>Email support and include:</div>
          <ul className="list-disc list-inside space-y-2">
            <li>Your purchase email (or order receipt)</li>
            <li>The approximate purchase date</li>
            <li>A brief reason (optional, but it helps improve the product)</li>
          </ul>

          <div className="text-sm opacity-80">
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
        </div>
      </Section>

      <Section title="What Refunds Cover" accent={ACCENT}>
        Refunds are intended for legitimate customers who tried the software and
        found it wasn’t a fit (setup issues, compatibility problems, or simply
        not what you expected).
      </Section>

      <Section title="Abuse & License Violations" accent={ACCENT}>
        <div className="space-y-3">
          <div>
            Refunds may be denied in cases of abuse or license violations,
            including (but not limited to):
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li>Redistribution or sharing download access broadly</li>
            <li>Reselling the software or providing it as a service</li>
            <li>Attempting to bypass licensing / access controls</li>
          </ul>
        </div>
      </Section>

      <Section title="Processing Time" accent={ACCENT}>
        Most refunds are processed within <b>3–5 business days</b> after the
        request is approved. Timing can vary depending on your payment method.
      </Section>

      <div className="text-xs opacity-60 pt-2 border-t border-white/10">
        This policy is intended to be fair to legitimate customers while
        protecting the product from misuse.
      </div>

      <div className="text-xs opacity-60 text-center rounded-2xl bg-white/5 p-4 border border-white/10">
        Note: This page provides general information and is not legal advice.
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
