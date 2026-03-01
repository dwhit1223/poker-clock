export function computeGrossPrizePool(state) {
  return state.buyIns * state.buyInValue + state.rebuys * state.rebuyValue;
}

export function computeNetPrizePool(state) {
  const gross = computeGrossPrizePool(state);
  const dealer = Number(state.prize.dealerPay) || 0;
  const bountyPerEntry = Number(state.prize.bountyPay) || 0;
  const totalEntries =
    (Number(state.buyIns) || 0) + (Number(state.rebuys) || 0);
  const bounty = bountyPerEntry * totalEntries;
  return Math.max(0, gross - dealer - bounty);
}

export function computePayouts(state) {
  const gross = computeGrossPrizePool(state);

  const dealerPay = Number(state.prize.dealerPay) || 0;

  const bountyPerEntry = Number(state.prize.bountyPay) || 0;
  const totalEntries =
    (Number(state.buyIns) || 0) + (Number(state.rebuys) || 0);
  const bountyPay = bountyPerEntry * totalEntries;

  const places = Array.isArray(state.prize.places) ? state.prize.places : [];
  const mode = state.prize.mode;

  // Start with gross minus dealer/bounty
  const afterDeductions = Math.max(0, gross - dealerPay - bountyPay);

  // If last place is fixed (hybrid mode), subtract it BEFORE percent calcs
  let lastFixed = 0;
  if (mode === "percent_last_fixed" && places.length > 0) {
    const last = places[places.length - 1];
    lastFixed = last?.type === "fixed" ? Number(last.value) || 0 : 0;
  }

  const percentBasePool = Math.max(0, afterDeductions - lastFixed);

  const payouts = places.map((p, idx) => {
    const value = Number(p.value) || 0;

    let amount = 0;

    if (mode === "percent_last_fixed") {
      const isLast = idx === places.length - 1;

      if (isLast) {
        // last is fixed
        amount = Number(p.value) || 0;
      } else {
        // percent calculated from percentBasePool (after last fixed removed)
        amount = Math.round((percentBasePool * value) / 100);
      }
    } else {
      // original behaviors:
      // - fixed: fixed amount
      // - percent: percent of afterDeductions
      amount =
        p.type === "fixed"
          ? value
          : Math.round((afterDeductions * value) / 100);
    }

    return {
      index: idx,
      label: p.label || `Place ${idx + 1}`,
      type: p.type,
      value,
      amount,
    };
  });

  // Keep these for the Settings breakdown
  const netPayoutsTotal = payouts.reduce(
    (sum, p) => sum + (Number(p.amount) || 0),
    0,
  );

  return {
    gross,
    dealerPay,
    bountyPay,
    afterDeductions, // gross - dealer - bounty
    lastFixed, // last fixed removed before percent
    percentBasePool, // pool used for percent payouts in hybrid mode
    payouts,
    net: afterDeductions, // "net" after dealer/bounty (before last fixed)
    totalPayouts: netPayoutsTotal,
  };
}

export function getCurrentRound(state) {
  return state.blinds[state.currentRoundIndex] ?? null;
}

export function getNextBlindRound(state) {
  for (let i = state.currentRoundIndex + 1; i < state.blinds.length; i++) {
    const r = state.blinds[i];
    if (r?.type === "blind") return r;
  }
  return null;
}
export function countBlindRounds(state) {
  return state.blinds.filter((r) => r?.type === "blind").length;
}

export function getDisplayedBlindLevel(state) {
  // How many blind rounds have started up to and including the current round?
  // If currently on a break, it should still show the last completed/current blind level number.
  const upToIndex = state.currentRoundIndex;

  let blindCount = 0;
  for (let i = 0; i <= upToIndex; i++) {
    if (state.blinds[i]?.type === "blind") blindCount++;
  }

  // If we’re currently in a break, we want the level number of the last blind,
  // not a new level. The loop above already does that because breaks don’t increment.
  return Math.max(1, blindCount);
}
