export default function Support() {
  const ACCENT = "#D4AF37";
  const SUPPORT_EMAIL = "your@email.com";

  return (
    <div className="space-y-8">
      <div className="text-sm opacity-70">
        Need help getting set up or running your tournament? I’ve got you.
      </div>

      {/* Contact */}
      <Section title="Contact" accent={ACCENT}>
        <div className="space-y-3">
          <div>
            Email:{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold hover:opacity-90"
              style={{ color: ACCENT }}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="opacity-75">
            Typical response time: within 24–48 hours.
          </div>

          <div className="text-sm opacity-75">
            When emailing, please include:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Your Windows version</li>
              <li>The app version (shown in the app)</li>
              <li>A screenshot (or short video) if possible</li>
              <li>What you expected vs what happened</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Common Questions */}
      <div className="space-y-6">
        <div
          className="text-xl font-extrabold font-display"
          style={{ color: ACCENT }}
        >
          Common Questions
        </div>

        <QA
          q="Does it require internet?"
          a="No. Poker Clock Pro runs locally on your Windows computer. Internet is only needed to download the ZIP file."
        />

        <QA
          q="Windows says “Protected your PC”"
          a={
            <>
              This is Windows SmartScreen. Click <b>More info</b>, then{" "}
              <b>Run anyway</b>. The app is safe and unsigned (common for
              independent software).
            </>
          }
        />

        <QA
          q="How do I run it on a TV or second monitor?"
          a="Open the app on your computer, drag it to the TV/monitor, then use Fullscreen. If it looks zoomed, check Windows Display Settings → Scale (try 100% or 125%)."
        />

        <QA
          q="Can I use it on multiple computers?"
          a="Yes — for your own events and poker club. Please do not redistribute the software."
        />

        <QA
          q="What if it doesn’t work for me?"
          a="Poker Clock Pro includes a 7-day refund policy. If it doesn’t meet your needs, email within 7 days of purchase."
        />
      </div>

      <div className="text-center text-sm opacity-60 pt-4">
        Built by a home game organizer who actually runs tournaments.
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

function QA({ q, a }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 border border-white/10">
      <div className="font-semibold">{q}</div>
      <div className="mt-1 opacity-75">{a}</div>
    </div>
  );
}
