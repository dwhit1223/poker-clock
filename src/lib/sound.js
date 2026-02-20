function beep({
  freq = 880,
  durationMs = 180,
  gain = 0.05,
  type = "square",
} = {}) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => {
      o.stop();
      ctx.close();
    }, durationMs);
  } catch {
    // no warnings needed
  }
}

// --- MP3-ready helper ---
// Put MP3s in /public/sounds/ and call playFile("/sounds/one-minute.mp3")
function playFile(path) {
  try {
    const a = new Audio(path);
    a.volume = 1.0;
    a.play().catch(() => {});
  } catch {
    // ignore
  }
}

// Toggle this later when you have real audio files:
const USE_AUDIO_FILES = false;

// Current sounds (beeps now, easy swap later)
export function playBlindUpSound() {
  if (USE_AUDIO_FILES) return playFile("/sounds/blind-up.mp3");
  beep({ freq: 880, durationMs: 180, gain: 0.05, type: "square" });
}

export function playBreakSound() {
  if (USE_AUDIO_FILES) return playFile("/sounds/on-break.mp3");
  beep({ freq: 440, durationMs: 260, gain: 0.045, type: "sine" });
}

export function playOneMinuteSound() {
  if (USE_AUDIO_FILES) return playFile("/sounds/one-minute.mp3");
  // a distinct "warning" double-beep
  beep({ freq: 660, durationMs: 140, gain: 0.05, type: "square" });
  setTimeout(
    () => beep({ freq: 660, durationMs: 140, gain: 0.05, type: "square" }),
    180,
  );
}
