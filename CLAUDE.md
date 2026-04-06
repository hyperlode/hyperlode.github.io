# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Lode's personal portfolio site hosted on GitHub Pages at `lode.ameije.com`. It's a collection of independent interactive web games and tools built with vanilla HTML/CSS/JS — no build step, no package manager, no transpilation.

## Running locally

```bash
python -m http.server 8000
# Open http://localhost:8000
```

Any static file server works. No build step needed.

## Deployment

Pushing to `main` triggers `.github/workflows/static.yml`, which uploads the entire repo to GitHub Pages automatically.

## Architecture

The repo is a flat collection of independent projects, each in its own folder. Projects do **not** share a common framework — they're self-contained. The main `index.html` at the root acts as a hub/portal linking to each project.

**Actively maintained project: `Set-game-trainer/`**

### SET-game-trainer structure

```
Set-game-trainer/
├── index.html              # Hub page
└── src/
    ├── generalFunctions.js # docReady(), cookies, shared utilities
    ├── domFunctions.js     # addDiv(), addButton(), addLabel() DOM helpers
    ├── svgOperations.js    # SVG creation helpers (addSvg, add_text, etc.)
    ├── card.js / cards.js / deck.js  # Card model, deck of 81 cards
    ├── set-functionality.js # Set detection algorithms + docReady init
    ├── set-trainer.js      # Practice/trainer mode
    ├── set-game.js         # RealGame class (main game logic)
    └── countDownTimer.js, simpleTimer.js
```

Script load order in HTML matters — `generalFunctions.js` must load before others. Initialization happens in `docReady()` callbacks.

### Common patterns across projects

- `docReady(fn)` — equivalent to `$(document).ready(fn)`, defined in `generalFunctions.js`
- `domFunctions.js` — imperative DOM builder helpers, used instead of templates
- Game state stored in global objects or closures (no state management library)
- SVG rendered dynamically via JS, not static image files
- Cookies for persisting scores/preferences (see `generalFunctions.js`)

### Other notable projects

- **`quoridor/`** — synced from a separate Git repo, **do not edit files here directly**
- **`Ameji/`** — also synced from separate repo, **do not edit here**
- **`MultitimerApp/`** — uses jQuery + jQuery UI
- **`7segment/`** — SVG-based display painting with PNG export
- **`FantasyForecast/`** — drag-and-drop forecast UI with PHP image upload backend

## Key conventions

- Each project folder is self-contained with its own JS/CSS — don't add cross-project dependencies
- No ES6 modules — scripts are loaded via `<script>` tags in specific order
- Bootstrap 3.3.2 is used for layout in most projects
- PHP files are only for contact/email form backends
