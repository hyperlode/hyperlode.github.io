// ── Globals required by sevSeg.js ──────────────────────────────────────────
var SVG_ID = "clock_svg";
var SCALE  = 1;

var SEGMENT_WIDTH            = 6;
var SEGMENT_HEIGHT           = 25;
var DIGIT_SEGMENT_POINTINESS = 3;
var DECPOINT_SPACE           = 8;
var DECPOINT_DIAMETER        = 6;

// These are recalculated by buildClock() before each draw
var DIGIT_MARGIN_HORIZONTAL_LEFT  = 10;
var DIGIT_MARGIN_HORIZONTAL_RIGHT = 5;
var DIGIT_MARGIN_VERTICAL_TOP     = 10;
var DIGIT_MARGIN_VERTICAL_BOTTOM  = 10;

var DIGIT_SKEW = 0;

var DIGIT_WIDTH       = SEGMENT_HEIGHT + SEGMENT_WIDTH;
var DIGIT_HEIGHT      = SEGMENT_HEIGHT * 2 + SEGMENT_WIDTH;
var DIGITFIELD_WIDTH  = DIGIT_WIDTH  + DIGIT_MARGIN_HORIZONTAL_LEFT + DIGIT_MARGIN_HORIZONTAL_RIGHT;
var DIGITFIELD_HEIGHT = DIGIT_HEIGHT + DIGIT_MARGIN_VERTICAL_TOP    + DIGIT_MARGIN_VERTICAL_BOTTOM;

var FILL_COLOUR   = "#000000";
var EMPTY_COLOUR  = "#000000";
var STROKE_COLOUR = "none";
var STROKE_WIDTH  = 0;

// ── Config ─────────────────────────────────────────────────────────────────
var CLOCK_COLS = 15;
var CLOCK_ROWS = 15;
var GAP_X = 15;   // total horizontal space between digits
var GAP_Y = 20;   // total vertical space between digits

// ── Stubs for helpers defined in sevSegClickable.js ────────────────────────
function shapeRowColSegmentFromId(id) {
  var arr = id.split("_");
  if (arr.length === 3) return { row: arr[0], col: arr[1], segName: arr[2] };
  return { row: arr[0], col: arr[1] };
}
function defineDigitsAndChangeColorOfSelectedSegment() {}

// ── Helpers ────────────────────────────────────────────────────────────────
function makeLine(x1, y1, x2, y2, color, width) {
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", x1);  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);  line.setAttribute("y2", y2);
  line.setAttribute("stroke", color);
  line.setAttribute("stroke-width", width);
  line.setAttribute("stroke-linecap", "round");
  return line;
}

// ── Main build function ────────────────────────────────────────────────────
function buildClock() {
  // Remove existing SVG if rebuilding
  var existing = document.getElementById(SVG_ID);
  if (existing) existing.parentNode.removeChild(existing);

  // Apply gap settings to margin globals (sevSeg.js reads these directly)
  DIGIT_MARGIN_HORIZONTAL_LEFT  = Math.floor(GAP_X / 2);
  DIGIT_MARGIN_HORIZONTAL_RIGHT = Math.ceil(GAP_X / 2);
  DIGIT_MARGIN_VERTICAL_TOP     = Math.floor(GAP_Y / 2);
  DIGIT_MARGIN_VERTICAL_BOTTOM  = Math.ceil(GAP_Y / 2);
  DIGITFIELD_WIDTH  = DIGIT_WIDTH  + DIGIT_MARGIN_HORIZONTAL_LEFT + DIGIT_MARGIN_HORIZONTAL_RIGHT;
  DIGITFIELD_HEIGHT = DIGIT_HEIGHT + DIGIT_MARGIN_VERTICAL_TOP    + DIGIT_MARGIN_VERTICAL_BOTTOM;

  var W = CLOCK_COLS * DIGITFIELD_WIDTH;
  var H = CLOCK_ROWS * DIGITFIELD_HEIGHT;

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", SVG_ID);
  svg.setAttribute("width",  W);
  svg.setAttribute("height", H);
  svg.style.background = "#e8e8e8";
  svg.style.display    = "block";
  document.getElementById("drawing").appendChild(svg);

  // Step 1: generate all digit groups (black fill, used for mask)
  FILL_COLOUR = EMPTY_COLOUR = "#000000";
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      sevSeg.add(row + "_" + col, SCALE);
    }
  }

  // Step 2: build cutout mask — white plane with black holes at segments
  var defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  var mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
  mask.setAttribute("id", "cutout");
  mask.setAttribute("maskUnits", "userSpaceOnUse");

  var maskBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  maskBg.setAttribute("width", W);  maskBg.setAttribute("height", H);
  maskBg.setAttribute("fill", "white");
  mask.appendChild(maskBg);

  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      var g     = document.getElementById(row + "_" + col);
      var clone = g.cloneNode(true);
      clone.removeAttribute("id");
      var kids = clone.querySelectorAll("[id]");
      for (var k = 0; k < kids.length; k++) kids[k].removeAttribute("id");
      var shapes = clone.querySelectorAll("polygon, circle");
      for (var k = 0; k < shapes.length; k++) {
        shapes[k].setAttribute("fill",   "black");
        shapes[k].setAttribute("stroke", "none");
      }
      mask.appendChild(clone);
    }
  }
  defs.appendChild(mask);
  svg.insertBefore(defs, svg.firstChild);

  // Step 3: background elements inserted before digit groups
  var firstDigit = document.getElementById("0_0");

  // Solid red background (hidden by default)
  var redBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  redBg.setAttribute("id",         "red-bg");
  redBg.setAttribute("width",      W);
  redBg.setAttribute("height",     H);
  redBg.setAttribute("fill",       "#e03030");
  var chk = document.getElementById("chk-red-bg");
  redBg.setAttribute("visibility", chk && chk.checked ? "visible" : "hidden");
  svg.insertBefore(redBg, firstDigit);

  // Red diagonal lines
  var step = 30;
  for (var i = -H; i < W + H; i += step) {
    svg.insertBefore(makeLine(i, 0, i + H, H, "#e03030", 1.5), firstDigit);
  }

  // Step 4: grey plane with cutout mask on top of lines
  var plane = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  plane.setAttribute("width",  W);
  plane.setAttribute("height", H);
  plane.setAttribute("fill",   "#e8e8e8");
  plane.setAttribute("mask",   "url(#cutout)");
  svg.insertBefore(plane, firstDigit);

  // Step 5: hide real digit groups (mask geometry only)
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      var g = document.getElementById(row + "_" + col);
      if (!g) continue;
      var segs = g.querySelectorAll("polygon, circle");
      for (var k = 0; k < segs.length; k++) {
        segs[k].setAttribute("fill",   "none");
        segs[k].setAttribute("stroke", "none");
      }
    }
  }
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", buildClock);
