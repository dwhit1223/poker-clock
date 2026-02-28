export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="mt-4 opacity-75">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div
          className="rounded-3xl bg-black/25 p-8 space-y-6"
          style={{ border: borderAccent }}
        >
          <Section title="Summary" accent={ACCENT}>
            Poker Clock Pro is designed to run locally. The app itself does{" "}
            <b>not</b> send your tournament data anywhere. The website only
            collects information you choose to submit (like an email address).
          </Section>

          <Section title="Information We Collect" accent={ACCENT}>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <b>Email address</b> (only if you submit it through a website
                form to be notified about launches, updates, or product news).
              </li>
              <li>
                <b>Basic technical info</b> that your browser sends to websites
                (like device type, approximate location based on IP, and pages
                visited). This is standard for most websites/hosting providers.
              </li>
            </ul>
          </Section>

          <Section title="How We Use Your Information" accent={ACCENT}>
            <ul className="list-disc list-inside space-y-2">
              <li>
                To send product updates and launch announcements (if you opted
                in by submitting your email).
              </li>
              <li>To respond to support requests if you email us.</li>
              <li>
                To maintain and improve the website (for example, fixing broken
                links or improving page performance).
              </li>
            </ul>
          </Section>

          <Section title="What We Do Not Do" accent={ACCENT}>
            <ul className="list-disc list-inside space-y-2">
              <li>We do not sell or rent your email address.</li>
              <li>
                We do not collect tournament/player/prize data from the app.
              </li>
              <li>
                We do not use your email for unrelated marketing from third
                parties.
              </li>
            </ul>
          </Section>

          <Section title="Application Data" accent={ACCENT}>
            The Poker Clock Pro application runs locally on your Windows
            computer. It does not transmit tournament data, player data,
            financial information, or configuration data to any external
            servers.
          </Section>

          <Section title="Third-Party Services" accent={ACCENT}>
            The website may rely on third-party services to operate:
            <ul className="mt-2 list-disc list-inside space-y-2">
              <li>
                <b>Form provider</b> (example: Formspree) to process email
                submissions.
              </li>
              <li>
                <b>Hosting / CDN</b> (example: GitHub Pages / Cloudflare Pages)
                to deliver the website.
              </li>
              <li>
                <b>Analytics</b> (optional). If enabled, analytics help measure
                traffic and improve the site. They may use cookies or similar
                technologies depending on the provider.
              </li>
            </ul>
            <div className="mt-3 opacity-80 text-sm">
              These providers handle data according to their own privacy
              policies.
            </div>
          </Section>

          <Section title="Data Retention" accent={ACCENT}>
            If you submit your email, we keep it only as long as needed for
            product updates/launch notifications. You can request removal at any
            time by contacting support.
          </Section>

          <Section title="Security" accent={ACCENT}>
            Reasonable measures are taken to protect submitted information.
            However, no internet transmission is 100% secure.
          </Section>

          <Section title="Contact" accent={ACCENT}>
            For privacy-related questions or deletion requests, contact:
            <div className="mt-2">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-semibold hover:opacity-90"
                style={{ color: ACCENT }}
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </Section>
        </div>

        <div className="text-xs opacity-60 text-center">
          Poker Clock Pro is built to be offline-friendly and privacy-first.
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
