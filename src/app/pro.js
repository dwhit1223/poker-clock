// Single source of truth for which product this build is: the free
// website/demo ("site") or the paid desktop app ("pro"). Anything other
// than exactly "pro" resolves to "site" so the app fails safe toward the
// public, non-Pro experience. Invalid explicit values are rejected at
// build-config time in vite.config.js, before this code ever runs.
export function resolveTarget(rawTarget) {
  return rawTarget === "pro" ? "pro" : "site";
}

export const PRO_ENABLED = resolveTarget(import.meta.env.VITE_TARGET) === "pro";
