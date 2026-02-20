import { describe, it, expect } from "vitest";
import { computePrizeAmounts } from "./selectors";

describe("prize math", () => {
  it("percent mode", () => {
    const state = {
      buyIns: 2,
      rebuys: 1,
      buyInValue: 20,
      rebuyValue: 10,
      prize: { mode: "percent", first: 50, second: 30, third: 20 },
    };
    const p = computePrizeAmounts(state);
    expect(p.pool).toBe(50);
    expect(p.first).toBe(25);
    expect(p.second).toBe(15);
    expect(p.third).toBe(10);
  });

  it("fixed mode", () => {
    const state = {
      buyIns: 2,
      rebuys: 1,
      buyInValue: 20,
      rebuyValue: 10,
      prize: { mode: "fixed", first: 25, second: 15, third: 10 },
    };
    const p = computePrizeAmounts(state);
    expect(p.pool).toBe(50);
    expect(p.first).toBe(25);
    expect(p.second).toBe(15);
    expect(p.third).toBe(10);
  });
});
