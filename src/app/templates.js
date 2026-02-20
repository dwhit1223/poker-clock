const blind = (small, big, minutes) => ({
  type: "blind",
  small,
  big,
  durationSec: minutes * 60,
});

const brk = (minutes) => ({
  type: "break",
  durationSec: minutes * 60,
});

export const BLIND_TEMPLATES = {
  slow: {
    name: "Slow",
    rounds: [
      blind(5, 10, 20),
      blind(10, 20, 20),
      blind(20, 40, 20),
      brk(10),
      blind(50, 100, 20),
      blind(100, 200, 20),
      blind(200, 400, 20),
      brk(10),
      blind(400, 800, 20),
      blind(1000, 2000, 20),
      blind(2000, 4000, 20),
      brk(10),
      blind(4000, 8000, 20),
      blind(10000, 20000, 20),
      blind(15000, 30000, 20),
    ],
  },
  regular: {
    name: "Regular",
    rounds: [
      blind(25, 50, 15),
      blind(50, 100, 15),
      blind(75, 150, 15),
      blind(100, 200, 15),
      brk(10),
      blind(150, 300, 15),
      blind(200, 400, 15),
      blind(300, 600, 15),
      blind(400, 800, 15),
    ],
  },
  turbo: {
    name: "Turbo",
    rounds: [
      blind(25, 50, 10),
      blind(50, 100, 10),
      blind(100, 200, 10),
      brk(8),
      blind(200, 400, 10),
      blind(400, 800, 10),
      blind(800, 1600, 10),
    ],
  },
};
