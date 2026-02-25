import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Landing from "./components/Landing";
import "./index.css";

function getRelativePath() {
  const base = (import.meta.env.BASE_URL || "/").replace(/\/+$/, "") || "";
  const path = window.location.pathname;

  // If BASE_URL is "/poker-clock/" on GitHub Pages, strip it off first
  if (base && path.startsWith(base)) {
    return path.slice(base.length) || "/";
  }
  return path || "/";
}

const relPath = getRelativePath();
const isDemo = relPath === "/demo" || relPath.startsWith("/demo/");

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>{isDemo ? <App /> : <Landing />}</React.StrictMode>,
);
