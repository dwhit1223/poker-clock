export default function Privacy() {
  const ACCENT = "#D4AF37";
  const SUPPORT_EMAIL = "your@email.com";

  return (
    <div className="space-y-6">
      <div className="text-sm opacity-70">
        Last updated: {new Date().toLocaleDateString()}
      </div>

      <Section title="Summary" accent={ACCENT}>
        Poker Clock Pro is designed to run locally. The app itself does{" "}
        <b>not</b> send your tournament data anywhere. The website only collects
        information you choose to submit (like an email address).
      </Section>

      <Section title="Information We Collect" accent={ACCENT}>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <b>Email address</b> (only if you submit it through a website form
            to be notified about launches, updates, or product news).
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
            To send product updates and launch announcements (if you opted in by
            submitting your email).
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
          <li>We do not collect tournament/player/prize data from the app.</li>
          <li>
            We do not use your email for unrelated marketing from third parties.
          </li>
        </ul>
      </Section>

      <Section title="Application Data" accent={ACCENT}>
        The Poker Clock Pro application runs locally on your Windows computer.
        It does not transmit tournament data, player data, financial
        information, or configuration data to any external servers.
      </Section>

      <Section title="Third-Party Services" accent={ACCENT}>
        <div className="space-y-2">
          <div>The website may rely on third-party services to operate:</div>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <b>Form provider</b> (example: Formspree) to process email
              submissions.
            </li>
            <li>
              <b>Hosting / CDN</b> (example: GitHub Pages / Cloudflare Pages) to
              deliver the website.
            </li>
            <li>
              <b>Analytics</b> (optional). If enabled, analytics help measure
              traffic and improve the site. They may use cookies or similar
              technologies depending on the provider.
            </li>
          </ul>
          <div className="opacity-80 text-sm">
            These providers handle data according to their own privacy policies.
          </div>
        </div>
      </Section>

      <Section title="Data Retention" accent={ACCENT}>
        If you submit your email, we keep it only as long as needed for product
        updates/launch notifications. You can request removal at any time by
        contacting support.
      </Section>

      <Section title="Security" accent={ACCENT}>
        Reasonable measures are taken to protect submitted information. However,
        no internet transmission is 100% secure.
      </Section>

      <Section title="Contact" accent={ACCENT}>
        <div className="space-y-2">
          <div>
            For privacy-related questions or deletion requests, contact:
          </div>
          <div>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold hover:opacity-90"
              style={{ color: ACCENT }}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </Section>

      <div className="pt-2 text-xs opacity-60 text-center">
        Poker Clock Pro is built to be offline-friendly and privacy-first.
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
