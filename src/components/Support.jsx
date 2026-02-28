export default function Support() {
  const base = import.meta.env.BASE_URL || "/";
  const demoUrl = `${base}demo`;

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

        <a
          href={demoUrl}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border text-sm font-semibold"
          style={{ border: borderSoft }}
        >
          Try the Demo
        </a>
      </div>

      <div className="max-w-4xl mx-auto px-5 pt-14 pb-16 space-y-10">
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold font-display"
            style={{ color: ACCENT }}
          >
            Support
          </h1>

          <p className="mt-4 opacity-80 text-lg">
            Need help getting set up or running your tournament? I’ve got you.
          </p>
        </div>

        {/* Contact Card */}
        <div
          className="rounded-3xl bg-black/25 p-8"
          style={{ border: borderAccent }}
        >
          <div className="text-sm opacity-70 tracking-widest">CONTACT</div>

          <div className="mt-4 text-lg">
            Email:{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-semibold hover:opacity-90"
              style={{ color: ACCENT }}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>

          <div className="mt-2 opacity-75">
            Typical response time: within 24–48 hours.
          </div>

          <div className="mt-4 text-sm opacity-70">
            When emailing, please include:
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Your Windows version</li>
              <li>The app version (shown in the app)</li>
              <li>A screenshot (or short video) if possible</li>
              <li>What you expected vs what happened</li>
            </ul>
          </div>
        </div>

        {/* Common Issues */}
        <div className="space-y-6">
          <h2
            className="text-2xl font-extrabold font-display"
            style={{ color: ACCENT }}
          >
            Common Questions
          </h2>

          <QA
            q="Does it require internet?"
            a="No. Poker Clock Pro runs locally on your Windows computer. Internet is only needed to download the ZIP file."
            borderSoft={borderSoft}
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
            borderSoft={borderSoft}
          />

          <QA
            q="How do I run it on a TV or second monitor?"
            a="Open the app on your computer, drag it to the TV/monitor, then use Fullscreen. If it looks zoomed, check Windows Display Settings → Scale (try 100% or 125%)."
            borderSoft={borderSoft}
          />

          <QA
            q="Can I use it on multiple computers?"
            a="Yes — for your own events and poker club. Please do not redistribute the software."
            borderSoft={borderSoft}
          />

          <QA
            q="What if it doesn’t work for me?"
            a="Poker Clock Pro includes a 7-day refund policy. If it doesn’t meet your needs, email within 7 days of purchase."
            borderSoft={borderSoft}
          />
        </div>

        {/* Closing reassurance */}
        <div className="text-center text-sm opacity-60">
          Built by a home game organizer who actually runs tournaments.
        </div>
      </div>
    </div>
  );
}

function QA({ q, a, borderSoft }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6" style={{ border: borderSoft }}>
      <div className="font-semibold">{q}</div>
      <div className="mt-1 opacity-75">{a}</div>
    </div>
  );
}
