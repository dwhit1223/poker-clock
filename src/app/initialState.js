import { BLIND_TEMPLATES } from "./templates";

export function createInitialState() {
  const template = BLIND_TEMPLATES.slow;

  return {
    title: "Deuces Poker Tournament",
    logoDataUrl: null, // Pro: uploaded logo (data URL). null = use default public/images/logo.png

    buyInValue: 40,
    rebuyValue: 40,

    buyIns: 20,
    rebuys: 0,

    prize: {
      // "percent" = all places are percent
      // "fixed" = all places are fixed dollar amounts
      // "percent_last_fixed" = all except LAST are percent, LAST is fixed
      mode: "percent_last_fixed",

      dealerPay: 0,
      bountyPay: 0,

      // Editable list of paid places.
      // When mode is "percent_last_fixed", the LAST item should be type:"fixed"
      places: [
        { label: "1st", type: "percent", value: 50 },
        { label: "2nd", type: "percent", value: 30 },
        { label: "3rd", type: "percent", value: 20 },
        { label: "Last", type: "fixed", value: 40 }, // example last-place fixed payout
      ],
    },

    blinds: template.rounds,
    currentRoundIndex: 0,

    timer: {
      status: "idle", // idle | running | paused | finished
      remainingSec: template.rounds[0]?.durationSec ?? 0,
      lastTickMs: null,
    },

    ui: {
      settingsOpen: false,
      flash: false,
      lastTransitionAt: null,

      // used to ensure the "1 minute remaining" sound plays once per round
      oneMinuteWarnedRoundIndex: null,
    },
  };
}
