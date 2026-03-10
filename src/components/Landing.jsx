import Privacy from "./Privacy";
import Refund from "./Refund";
import Support from "./Support";
import Features from "./Features";
import Pricing from "./Pricing";
import Seo from "./Seo";

export default function Landing({ page = "home" }) {
  const base = import.meta.env.BASE_URL || "/";
  const demoUrl = `${base}demo`;

  // Purchase URL
  const BUY_URL = "https://pokerclockpro.gumroad.com/l/adklaq";

  // Brand accents
  const ACCENT = "#D4AF37"; // gold

  // Helpers
  const withAlpha = (hex, aa) => {
    if (typeof hex !== "string") return hex;
    if (hex.startsWith("#") && hex.length === 7) return `${hex}${aa}`;
    return hex;
  };

  const borderSoft = "1px solid rgba(255,255,255,0.10)";
  const borderAccent = `1px solid ${withAlpha(ACCENT, "33")}`;

  const SEO = {
    home: {
      title: "Poker Clock Pro | Poker Tournament Clock and Blind Timer",
      description:
        "Poker Clock Pro is a poker tournament clock and blind timer built for home games and poker clubs. Run blinds, breaks, and prize pool calculations on a TV-friendly display.",
      path: "/",
      robots: "index,follow,max-image-preview:large",
    },
    features: {
      title: "Features | Poker Clock Pro",
      description:
        "Explore Poker Clock Pro features including blind timers, break management, prize pool tools, TV-friendly layouts, custom branding, custom sounds, and preset support.",
      path: "/features",
      robots: "index,follow,max-image-preview:large",
    },
    pricing: {
      title: "Pricing | Poker Clock Pro",
      description:
        "View Poker Clock Pro pricing for the free demo and Pro version. Compare features and choose the poker tournament clock that fits your game.",
      path: "/pricing",
      robots: "index,follow,max-image-preview:large",
    },
    support: {
      title: "Support | Poker Clock Pro",
      description:
        "Get support for Poker Clock Pro, including setup help, troubleshooting, and product questions for your poker tournament clock.",
      path: "/support",
      robots: "index,follow,max-image-preview:large",
    },
    privacy: {
      title: "Privacy Policy | Poker Clock Pro",
      description: "Read the Poker Clock Pro privacy policy.",
      path: "/privacy",
      robots: "index,follow,max-image-preview:large",
    },
    refund: {
      title: "Refund Policy | Poker Clock Pro",
      description: "Read the Poker Clock Pro refund policy.",
      path: "/refund",
      robots: "index,follow,max-image-preview:large",
    },
    notfound: {
      title: "Page Not Found | Poker Clock Pro",
      description: "The page you requested could not be found.",
      path: "/404",
      robots: "noindex,follow",
    },
  };

  const PAGES = {
    features: {
      title: "Features",
      body: <Features />,
    },

    pricing: {
      title: "Pricing",
      body: <Pricing />,
    },

    support: {
      title: "Support",
      body: <Support />,
    },

    privacy: {
      title: "Privacy Policy",
      body: <Privacy />,
    },

    refund: {
      title: "Refund Policy",
      body: <Refund />,
    },

    notfound: {
      title: "Page Not Found",
      body: (
        <div className="space-y-4">
          <p className="opacity-80">That page doesn’t exist.</p>
          <a
            href={base}
            className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
            style={{ border: borderAccent }}
          >
            Go back home →
          </a>
        </div>
      ),
    },
  };

  if (page !== "home") {
    const content = PAGES[page] || PAGES.notfound;
    const seo = SEO[page] || SEO.notfound;

    return (
      <div
        className="min-h-screen text-white"
        style={{
          background: `
            radial-gradient(circle at center, ${withAlpha(
              ACCENT,
              "14",
            )} 0%, rgba(0,0,0,0) 55%),
            radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)
          `,
        }}
      >
        <Seo
          title={seo.title}
          description={seo.description}
          path={seo.path}
          robots={seo.robots}
        />

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

            <a
              href={BUY_URL}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-black text-sm font-extrabold"
              style={{ backgroundColor: ACCENT }}
            >
              Buy Pro
            </a>

            <a
              href={base}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border text-sm font-semibold"
              style={{ border: borderSoft }}
            >
              Home
            </a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 pt-10 pb-12">
          <div
            className="rounded-3xl bg-black/25 p-6 md:p-10 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
            style={{ border: borderAccent }}
          >
            <h1
              className="text-3xl md:text-4xl font-extrabold font-display tracking-wide"
              style={{ color: ACCENT }}
            >
              {content.title}
            </h1>

            <div className="mt-6">{content.body}</div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 pb-10">
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-sm opacity-80">
            <div>© {new Date().getFullYear()} Poker Clock Pro</div>

            <div className="flex flex-wrap gap-6">
              <FooterLink href={`${base}features`}>Features</FooterLink>
              <FooterLink href={`${base}pricing`}>Pricing</FooterLink>
              <FooterLink href={demoUrl}>Demo</FooterLink>
              <FooterLink href={`${base}support`}>Support</FooterLink>
              <FooterLink href={`${base}privacy`}>Privacy</FooterLink>
              <FooterLink href={`${base}refund`}>Refund Policy</FooterLink>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: `
          radial-gradient(circle at center, ${withAlpha(
            ACCENT,
            "14",
          )} 0%, rgba(0,0,0,0) 55%),
          radial-gradient(circle at top, rgba(16,185,129,0.12), rgba(3,7,18,1) 70%)
        `,
      }}
    >
      <Seo
        title={SEO.home.title}
        description={SEO.home.description}
        path={SEO.home.path}
        robots={SEO.home.robots}
      />

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

          <a
            href={BUY_URL}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-lg text-black text-sm font-extrabold"
            style={{ backgroundColor: ACCENT }}
          >
            Buy Pro
          </a>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold font-display tracking-wide"
              style={{ color: ACCENT }}
            >
              Poker Tournament Clock for Home Games and Poker Clubs
            </h1>

            <p className="mt-4 text-lg opacity-80 leading-relaxed">
              A big-screen poker tournament clock and blind timer with breaks,
              prize pool tools, and a TV-friendly display—built for home games,
              poker clubs, and live tournaments.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={demoUrl}
                className="px-5 py-3 rounded-xl text-black font-extrabold"
                style={{ backgroundColor: ACCENT }}
              >
                Launch Free Demo
              </a>

              <a
                href={BUY_URL}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
                style={{ border: borderAccent }}
              >
                Buy Pro
                <span className="ml-2 opacity-70 text-sm">
                  (branding + presets + more)
                </span>
              </a>
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

            <div className="mt-6 text-xs opacity-60">
              Support:{" "}
              <a className="underline hover:opacity-90" href={`${base}support`}>
                support@thepokerclockpro.com
              </a>
            </div>
          </div>

          {/* Demo preview card */}
          <div
            className="rounded-3xl bg-black/25 p-6 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
            style={{ border: borderAccent }}
          >
            <div className="text-sm opacity-70 tracking-widest">
              DEMO PREVIEW
            </div>

            <a
              href={`${base}images/screenshots/demo-preview.jpg`}
              target="_blank"
              rel="noreferrer"
              className="group block mt-4"
            >
              <div
                className="overflow-hidden rounded-2xl bg-white/5"
                style={{ border: borderSoft }}
              >
                <img
                  src={`${base}images/screenshots/demo-preview.jpg`}
                  alt="Poker Clock Pro demo preview"
                  className="block w-full h-auto transition-transform duration-300 group-hover:scale-[1.015]"
                />
              </div>
            </a>

            <div className="mt-4 text-sm opacity-75 leading-relaxed">
              A real screenshot from the live demo. Click the image to view it
              larger, or open the demo and try it yourself.
            </div>

            <div className="mt-6 grid gap-3">
              <a
                href={demoUrl}
                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 border font-semibold"
                style={{ border: borderAccent }}
              >
                Open the Demo →
              </a>

              <a
                href={BUY_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl text-black font-extrabold"
                style={{ backgroundColor: ACCENT }}
              >
                Buy Pro →
              </a>
            </div>

            <div className="mt-4 text-xs opacity-60">
              Tip: open the demo in fullscreen on a TV for the best experience.
            </div>
          </div>
        </div>
      </div>

      <ScreenshotSection base={base} />

      <div className="max-w-6xl mx-auto px-5 pb-12">
        <div
          className="rounded-3xl bg-black/25 p-6 md:p-8 shadow-[0_0_60px_rgba(0,0,0,0.35)]"
          style={{ border: borderAccent }}
        >
          <div className="text-sm opacity-70 tracking-widest">
            PRODUCT UPDATES
          </div>

          <div
            className="mt-2 text-2xl md:text-3xl font-extrabold font-display"
            style={{ color: ACCENT }}
          >
            Get updates, new features, and release notes.
          </div>

          <div className="mt-2 opacity-75">
            Join the list for occasional product updates—what’s new, what’s
            improved, and what’s coming next.
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
              Sign Up
            </button>
          </form>

          <div className="mt-3 text-xs opacity-60">
            No spam. Occasional updates only.
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 pb-10">
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between text-sm opacity-80">
          <div>© {new Date().getFullYear()} Poker Clock Pro</div>

          <div className="flex flex-wrap gap-6">
            <FooterLink href={`${base}features`}>Features</FooterLink>
            <FooterLink href={`${base}pricing`}>Pricing</FooterLink>
            <FooterLink href={demoUrl}>Demo</FooterLink>
            <FooterLink href={`${base}support`}>Support</FooterLink>
            <FooterLink href={`${base}privacy`}>Privacy</FooterLink>
            <FooterLink href={`${base}refund`}>Refund Policy</FooterLink>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScreenshotSection({ base }) {
  const screenshots = [
    {
      src: `${base}images/screenshots/clock.jpg`,
      alt: "Poker tournament clock display",
      title: "Main Clock Display",
      caption: "Big-screen tournament clock designed for TVs and projectors.",
    },
    {
      src: `${base}images/screenshots/blind-structure.jpg`,
      alt: "Poker blind structure editor",
      title: "Blind Structure Editor",
      caption: "Quickly build or modify blind levels and break rounds.",
    },
    {
      src: `${base}images/screenshots/prize-pool.jpg`,
      alt: "Poker prize pool calculator",
      title: "Prize Pool Tools",
      caption: "Automatic prize pool and payout calculations for live events.",
    },
    {
      src: `${base}images/screenshots/break-screen.jpg`,
      alt: "Poker tournament break timer",
      title: "Break Screen",
      caption: "Break timers keep the tournament organized and on schedule.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 pb-14">
      <div className="text-center">
        <div className="text-sm opacity-70 tracking-widest">SCREENSHOTS</div>
        <h2 className="mt-2 text-3xl md:text-4xl font-extrabold font-display text-white">
          See Poker Clock Pro in Action
        </h2>
        <p className="mt-3 max-w-3xl mx-auto opacity-75 leading-relaxed">
          Click any screenshot to open a larger view and take a closer look at
          the interface.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {screenshots.map((shot) => (
          <a
            key={shot.src}
            href={shot.src}
            target="_blank"
            rel="noreferrer"
            className="group block rounded-3xl bg-black/25 p-4 md:p-5 shadow-[0_0_60px_rgba(0,0,0,0.25)] hover:bg-black/30 transition-colors"
            style={{ border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              <img
                src={shot.src}
                alt={shot.alt}
                className="w-full h-auto block transition-transform duration-300 group-hover:scale-[1.015]"
                loading="lazy"
              />
            </div>

            <div className="mt-4">
              <div className="text-lg font-bold font-display text-white">
                {shot.title}
              </div>
              <div className="mt-1 text-sm opacity-75">{shot.caption}</div>
              <div className="mt-3 text-xs font-semibold tracking-widest opacity-60 group-hover:opacity-80 transition-opacity">
                CLICK TO ENLARGE
              </div>
            </div>
          </a>
        ))}
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

function FooterLink({ href, children }) {
  return (
    <a href={href} className="hover:opacity-100 transition-opacity">
      {children}
    </a>
  );
}
