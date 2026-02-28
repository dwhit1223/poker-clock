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

// In PRO builds, always show the app at "/"
const showApp =
  entry === "pro" ? true : relPath === "/demo" || relPath.startsWith("/demo/");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{showApp ? <App /> : <Landing />}</React.StrictMode>,
);
