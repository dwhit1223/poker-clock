import { describe, it, expect } from "vitest";
import { resolveTarget } from "./pro";

// This test locks in the Gate 1 build-identity invariant: routing and
// Pro feature-gating must always agree, because they both derive from
// this one function. The build-time hard failure for explicitly invalid
// values (e.g. VITE_TARGET=por) is enforced separately in vite.config.js,
// before any application code runs — resolveTarget's fallback here is a
// defense-in-depth safety net, not the primary enforcement point.

describe("resolveTarget", () => {
  it("defaults to site when VITE_TARGET is unset (ordinary local dev)", () => {
    expect(resolveTarget(undefined)).toBe("site");
  });

  it("resolves the site/free-demo target explicitly", () => {
    expect(resolveTarget("site")).toBe("site");
  });

  it("resolves the pro target explicitly", () => {
    expect(resolveTarget("pro")).toBe("pro");
  });

  it("falls back to site for any unexpected value (defense in depth)", () => {
    expect(resolveTarget("por")).toBe("site");
    expect(resolveTarget("")).toBe("site");
  });
});
