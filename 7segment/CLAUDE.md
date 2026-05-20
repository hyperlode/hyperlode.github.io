# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

An SVG-based pixel-art painter for segment displays and circles. The user interactively lights up individual segments by hover or click, then exports the result as PNG or a serialized text format. Runs at `sevSegLode.html` — no build step.

## Running locally

```bash
python -m http.server 8000
# Open http://localhost:8000/7segment/sevSegLode.html
```

The page depends on root-relative paths (`/bootstrap-3.3.2-dist/`, `/silviomoreto-bootstrap-select-83d5a1b/`) so it must be served from the repo root, not the `7segment/` subdirectory.

## Architecture

All logic runs in a single flat SVG canvas (`#writing_sheet`) inside `<div id="drawing">`. No modules — scripts are loaded via `<script>` tags in order:

```
sevSegClickable.js  ← globals, init ($("document").ready), all interactive logic
saveSvgAsPng.js     ← third-party PNG export
svgOperations.js    ← skewer(), addPointToPolyLine() SVG helpers
domFunctions.js     ← DOM helpers (unused/legacy)
fifteenSeg.js       ← fifteenSeg shape object
sevSeg.js           ← sevSeg shape object
circle.js           ← circle shape object
```

### Shape objects (sevSeg / fifteenSeg / circle)

Each shape is a plain object with:
- `SEGMENT_NAMES` — ordered array of segment IDs (e.g. `["A","B","C","D","E","F","G","P"]` for 7-seg)
- `add(id, scale)` — creates SVG `<g id="{row}_{col}">` containing `<polygon>` elements for each segment and a `<circle>` for the decimal point

The active shape type is stored in global `shapeType`, set by `setShapeType()` reading the Bootstrap select dropdown.

### Segment / digit ID scheme

- Digit ID: `"{row}_{col}"` (e.g. `"2_5"`)
- Segment ID: `"{row}_{col}_{segmentName}"` (e.g. `"2_5_A"`)
- Segment visibility is stored as `data-rel="true|false"` on the SVG element (not CSS class), because the PNG export reads `fill` attributes directly — CSS is not captured by `saveSvgAsPng`.

### Key globals in sevSegClickable.js

| Variable | Purpose |
|---|---|
| `NUMBER_OF_LINES` / `NUMBER_OF_CHARACTERS_ON_LINE` | Current grid dimensions |
| `SEGMENT_HEIGHT`, `SEGMENT_WIDTH`, `DIGIT_SEGMENT_POINTINESS` | Segment geometry |
| `FILL_COLOUR` / `EMPTY_COLOUR` | On/off colors |
| `DIGIT_SKEW` | Italic skew angle applied via `skewer()` |
| `shapeType` | Currently active shape object |

### Import / Export format

Text format written to `#textArea_imageAsText`:
```
----EXPORT START----
<comment line>
<numRows>
<numCols>
{row}_{col},{seg0},{seg1},...DIGIT{row}_{col},{seg0},...
----EXPORT END----
```
Segment values are `1`/`0`. `importString()` also accepts typed text (ASCII art) and converts it via a hardcoded character lookup table (0–9, A–Z, space).
