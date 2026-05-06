# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Ameije's Maze Madness — an interactive SVG maze game. No build step; open any `.xhtml` file directly in a browser or serve with `python -m http.server 8000`.

## The two pages

| File | Description |
|---|---|
| `AmeijesMazeMadness_MazeFields_20120817.xhtml` | **Static** — user clicks cells in a 5×5 grid to mark them "in" or "out", then browses mazes that match the selection |
| `AmeijeMazeMadness_20170202.xhtml` | **Dynamic** — the game: a current maze is shown top-left with its neighbours; clicking a neighbour animates the transition; goal is to reach a randomly chosen red maze |

`AmeijeMazeMadness_20120808.xhtml` is an older version of the dynamic page (no `path-data-polyfill.js`, uses the now-deprecated `pathSegList` API).

## Core library: `mazes_5x5.js`

Everything runs through this one file. Key concepts:

**Maze encoding** — a maze is a 25-character binary string (e.g. `"1111101001111000011111101"`). Each character maps to one cell of the 5×5 grid in row-major order: `1` = cell is inside the maze boundary, `0` = outside.

**Hamilton cycles** — the ~1072 valid mazes in `getAllMazeNames()` are exactly the 5×5 grids whose boundary forms a single closed Hamilton cycle visiting all 36 grid-corner points. The boundary-tracing algorithm in `getPathCoordsFromMazeCoords()` walks around the edge between inside (1) and outside (0) cells.

**Adjacency / links** — `getMazeLinkNamesFromMazeName(mazeName)` returns all valid mazes reachable from a given maze by a single "flip" (one cell changes between in/out while keeping the result a valid Hamilton cycle). These are the game's navigation edges.

**SVG path generation pipeline:**
```
mazeString
  → getMazeCoordsFromName()       // string → 7×7 border-padded 2D array
  → getPathCoordsFromMazeCoords() // boundary trace → list of [row,col] corner points
  → (scale by xScale/yScale)
  → coordsToSVGPathString()       // → SVG "M L L … Z" path string
```

**Animation** — `getTransformationsFromMazeNames(start, end, xScale, yScale, steps)` computes per-step coordinate deltas. `animatePathMove()` applies them via `window.setTimeout`. Path coordinates are updated live using `path.setPathData()` (requires `path-data-polyfill.js`).

**`path-data-polyfill.js`** — must be loaded before inline script in the 2017 XHTML file. It re-implements `getPathData()`/`setPathData()` on SVG path elements to replace the deprecated `pathSegList` API.

## Key globals in the XHTML game page

- `xScale`, `yScale` — pixel size of each grid unit (default `12`)
- `width` — stroke-width, computed as `xScale / 2`
- `svg` — reference to the single `<svg>` element
- `links` — current maze's neighbour names (mutated by `displayActiveMazeWithLinks`)
- `steps` — array of maze names the player has visited
- `goalMaze` — the target maze string (red, shown bottom-left)

## Common patterns

- SVG elements are created and appended imperatively with `createSvgElementSvgDom()` — there is no template or virtual DOM.
- Maze strings are stored as custom `maze` attributes on SVG `<path>` elements so they can be retrieved at click time.
- Animation loops use `window.setTimeout` recursively (not `requestAnimationFrame`).
- `defaultValue(arg, defaultVal)` is used instead of default parameters for broad browser compat.
