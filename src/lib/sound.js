const BASE_URL = import.meta.env.BASE_URL || "/";
const soundUrl = (file) => `${BASE_URL}sounds/${file}`;

// --- PRO override support ---
// These should be data URLs (or any valid URL). Keys match state.sounds keys.
let SOUND_OVERRIDES = {
  blindUpUrl: null,
  breakUrl: null,
  oneMinuteUrl: null,
};

export function setSoundOverrides(overrides) {
  SOUND_OVERRIDES = {
    ...SOUND_OVERRIDES,
    ...(overrides || {}),
  };
}

function getSoundPath(key, fallbackFile) {
  return SOUND_OVERRIDES?.[key] || soundUrl(fallbackFile);
}

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
    const a = getAudio(path);
    a.currentTime = 0;
    a.volume = 1.0;
    a.play().catch(() => {});
  } catch {
    // ignore
  }
}

// Toggle this later when you have real audio files:
const USE_AUDIO_FILES = true;

const audioCache = new Map();
let audioUnlocked = false;

function getAudio(path) {
  if (!audioCache.has(path)) {
    const a = new Audio(path);
    a.preload = "auto";
    audioCache.set(path, a);
  }
  return audioCache.get(path);
}

export async function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;

  // Attempt to unlock HTMLAudio playback
  try {
    const a = new Audio();
    a.muted = true;
    // Some browsers need a play attempt during a user gesture
    await a.play().catch(() => {});
  } catch {
    // ignore
  }

  // If you still use oscillator beeps anywhere, unlock AudioContext too
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    await ctx.resume().catch(() => {});
    await ctx.close().catch(() => {});
  } catch {
    // ignore
  }
}

// Current sounds (beeps now, easy swap later)
export function playBlindUpSound() {
  if (USE_AUDIO_FILES)
    return playFile(getSoundPath("blindUpUrl", "blind-up.mp3"));
  beep({ freq: 880, durationMs: 180, gain: 0.05, type: "square" });
}

export function playBreakSound() {
  if (USE_AUDIO_FILES)
    return playFile(getSoundPath("breakUrl", "on-break.mp3"));
  beep({ freq: 440, durationMs: 260, gain: 0.045, type: "sine" });
}

export function playOneMinuteSound() {
  if (USE_AUDIO_FILES)
    return playFile(getSoundPath("oneMinuteUrl", "one-minute.mp3"));
  // a distinct "warning" double-beep
  beep({ freq: 660, durationMs: 140, gain: 0.05, type: "square" });
  setTimeout(
    () => beep({ freq: 660, durationMs: 140, gain: 0.05, type: "square" }),
    180,
  );
}
