import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Landing from "./components/Landing";
import "./index.css";

function getRelativePath() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") || "";
  const path = window.location.pathname;

  // Strip BASE_URL if deployed under a subpath (ex: /poker-clock/)
  if (base && base !== "/" && path.startsWith(base)) {
    return path.slice(base.length) || "/";
  }
  return path || "/";
}

const entry = import.meta.env.VITE_ENTRY || "landing";
const relPath = getRelativePath();
console.log("BASE_URL", import.meta.env.BASE_URL);
console.log("pathname", window.location.pathname);
console.log("relPath", relPath);
console.log("landingPage", getLandingPage(relPath));
console.log("showApp", showApp);

// In PRO builds, always show the app at "/"
const showApp =
  entry === "pro" ? true : relPath === "/demo" || relPath.startsWith("/demo/");

// Simple path → page mapping (no React Router)
function getLandingPage(pathname) {
  // normalize: remove trailing slash except root
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  const p = normalized.toLowerCase();

  if (p === "/" || p === "") return "home";
  if (p === "/features") return "features";
  if (p === "/pricing") return "pricing";
  if (p === "/support") return "support";
  if (p === "/privacy") return "privacy";
  if (p === "/refund") return "refund";

  return "notfound";
}

const landingPage = getLandingPage(relPath);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {showApp ? <App /> : <Landing page={landingPage} />}
  </React.StrictMode>,
);
