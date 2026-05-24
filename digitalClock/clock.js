// ── Globals required by sevSeg.js ──────────────────────────────────────────
var SVG_ID = "clock_svg";
var SCALE  = 1;

var SEGMENT_WIDTH            = 6;
var SEGMENT_HEIGHT           = 25;
var DIGIT_SEGMENT_POINTINESS = 3;
var DECPOINT_SPACE           = 8;
var DECPOINT_DIAMETER        = 6;

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
var GAP_X = 8;
var GAP_Y = 8;

// ── Clock hand state ───────────────────────────────────────────────────────
var _handHour   = null;
var _handMinute = null;
var _handSecond = null;
var _clockCx    = 0;
var _clockCy    = 0;
var _clockR     = 0;
var _tickInterval = null;

// ── Stubs for helpers defined in sevSegClickable.js ────────────────────────
function shapeRowColSegmentFromId(id) {
  var arr = id.split("_");
  if (arr.length === 3) return { row: arr[0], col: arr[1], segName: arr[2] };
  return { row: arr[0], col: arr[1] };
}
function defineDigitsAndChangeColorOfSelectedSegment() {}

// ── Hand helpers ───────────────────────────────────────────────────────────
function makeHand(svg, before, cx, cy, strokeWidth) {
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", cx);
  line.setAttribute("y1", cy);
  line.setAttribute("x2", cx);
  line.setAttribute("y2", cy - 10);
  line.setAttribute("stroke", "#e03030");
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-linecap", "round");
  svg.insertBefore(line, before);
  return line;
}

function setHand(hand, cx, cy, angleDeg, length) {
  var rad = (angleDeg - 90) * Math.PI / 180;
  hand.setAttribute("x1", cx);
  hand.setAttribute("y1", cy);
  hand.setAttribute("x2", cx + Math.cos(rad) * length);
  hand.setAttribute("y2", cy + Math.sin(rad) * length);
}

function tickClock() {
  var now  = new Date();
  var h    = now.getHours() % 12;
  var m    = now.getMinutes();
  var s    = now.getSeconds();
  var ms   = now.getMilliseconds();

  var degH = (h + m / 60) * 30;
  var degM = (m + s / 60) * 6;
  var degS = (s + ms / 1000) * 6;

  setHand(_handHour,   _clockCx, _clockCy, degH, _clockR * 0.50);
  setHand(_handMinute, _clockCx, _clockCy, degM, _clockR * 0.75);
  setHand(_handSecond, _clockCx, _clockCy, degS, _clockR * 0.85);
}

// ── Main build function ────────────────────────────────────────────────────
function buildClock() {
  // Stop existing tick
  if (_tickInterval) { clearInterval(_tickInterval); _tickInterval = null; }

  // Remove existing SVG if rebuilding
  var existing = document.getElementById(SVG_ID);
  if (existing) existing.parentNode.removeChild(existing);

  // Apply gap settings
  DIGIT_MARGIN_HORIZONTAL_LEFT  = Math.floor(GAP_X / 2);
  DIGIT_MARGIN_HORIZONTAL_RIGHT = Math.ceil(GAP_X / 2);
  DIGIT_MARGIN_VERTICAL_TOP     = Math.floor(GAP_Y / 2);
  DIGIT_MARGIN_VERTICAL_BOTTOM  = Math.ceil(GAP_Y / 2);
  DIGITFIELD_WIDTH  = DIGIT_WIDTH  + DIGIT_MARGIN_HORIZONTAL_LEFT + DIGIT_MARGIN_HORIZONTAL_RIGHT;
  DIGITFIELD_HEIGHT = DIGIT_HEIGHT + DIGIT_MARGIN_VERTICAL_TOP    + DIGIT_MARGIN_VERTICAL_BOTTOM;

  var W = CLOCK_COLS * DIGITFIELD_WIDTH;
  var H = CLOCK_ROWS * DIGITFIELD_HEIGHT;

  _clockCx = W / 2;
  _clockCy = H / 2;
  _clockR  = Math.min(W, H) / 2 * 0.92;

  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("id", SVG_ID);
  svg.setAttribute("width",  W);
  svg.setAttribute("height", H);
  svg.style.background = "#e8e8e8";
  svg.style.display    = "block";
  document.getElementById("drawing").appendChild(svg);

  // Step 1: generate all digit groups (black fill — for mask only)
  FILL_COLOUR = EMPTY_COLOUR = "#000000";
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      sevSeg.add(row + "_" + col, SCALE);
    }
  }

  // Step 2: build cutout mask
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

  // Step 3: background layer — red fill rect + clock hands, all before grey plane
  var firstDigit = document.getElementById("0_0");

  // Solid red background (toggled by checkbox)
  var redBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  redBg.setAttribute("id",     "red-bg");
  redBg.setAttribute("width",  W);
  redBg.setAttribute("height", H);
  redBg.setAttribute("fill",   "#e03030");
  var chk = document.getElementById("chk-red-bg");
  redBg.setAttribute("visibility", chk && chk.checked ? "visible" : "hidden");
  svg.insertBefore(redBg, firstDigit);

  // Clock hands — inserted before grey plane, on top of red bg
  _handHour   = makeHand(svg, firstDigit, _clockCx, _clockCy, 14);
  _handMinute = makeHand(svg, firstDigit, _clockCx, _clockCy,  9);
  _handSecond = makeHand(svg, firstDigit, _clockCx, _clockCy,  5);

  // Step 4: grey masked plane on top of all background elements
  var plane = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  plane.setAttribute("width",  W);
  plane.setAttribute("height", H);
  plane.setAttribute("fill",   "#e8e8e8");
  plane.setAttribute("mask",   "url(#cutout)");
  svg.insertBefore(plane, firstDigit);

  // Step 5: hide real digit groups (served mask geometry only)
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

  // Start ticking
  tickClock();
  _tickInterval = setInterval(tickClock, 1000);
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", buildClock);
