# Poker Clock (JavaScript)

A realtime poker tournament dashboard: blinds timer, buy-ins/rebuys, prize pool, break rounds, and organizer settings panel.

## Run locally
1. Install Node.js (v18+ recommended, v20 ideal)
2. In this folder:

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

## Tests
```bash
npm test
```

## GitHub Pages
This repo is pre-configured for GitHub Pages via Actions.

### IMPORTANT: set the Vite base path
Edit `vite.config.js`:

- If your repo is named `poker-clock`, keep:
  `base: "/poker-clock/"`

- If your repo is named something else, change it to:
  `base: "/<your-repo-name>/"`

Then push to `main`. In GitHub:
- Settings → Pages → Source: **GitHub Actions**
