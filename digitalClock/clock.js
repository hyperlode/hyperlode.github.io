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

// ── Runtime state ──────────────────────────────────────────────────────────
var _handHour     = null;
var _handMinute   = null;
var _handSecond   = null;
var _clockCx      = 0;
var _clockCy      = 0;
var _clockR       = 0;
var _tickInterval = null;
var _litEnabled   = false;
var _allSegments  = [];   // [{el, isCircle}] — real digit group shapes

// ── Stubs for helpers defined in sevSegClickable.js ────────────────────────
function shapeRowColSegmentFromId(id) {
  var arr = id.split("_");
  if (arr.length === 3) return { row: arr[0], col: arr[1], segName: arr[2] };
  return { row: arr[0], col: arr[1] };
}
function defineDigitsAndChangeColorOfSelectedSegment() {}

// ── Geometry helpers ───────────────────────────────────────────────────────
function _segmentsIntersect(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
  var d1x = p2x - p1x, d1y = p2y - p1y;
  var d2x = p4x - p3x, d2y = p4y - p3y;
  var cross = d1x * d2y - d1y * d2x;
  if (Math.abs(cross) < 1e-10) return false;
  var dx = p3x - p1x, dy = p3y - p1y;
  var t = (dx * d2y - dy * d2x) / cross;
  var u = (dx * d1y - dy * d1x) / cross;
  return t >= 0 && t <= 1 && u >= 0 && u <= 1;
}

function _lineHitsPolygon(lx1, ly1, lx2, ly2, polygon) {
  var pts = polygon.points;
  var n   = pts.numberOfItems;
  for (var i = 0; i < n; i++) {
    var a = pts.getItem(i);
    var b = pts.getItem((i + 1) % n);
    if (_segmentsIntersect(lx1, ly1, lx2, ly2, a.x, a.y, b.x, b.y)) return true;
  }
  return false;
}

function _distPointToSeg(px, py, ax, ay, bx, by) {
  var dx = bx - ax, dy = by - ay;
  var lenSq = dx * dx + dy * dy;
  var t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  var nx = ax + t * dx - px, ny = ay + t * dy - py;
  return Math.sqrt(nx * nx + ny * ny);
}

function _lineHitsCircle(lx1, ly1, lx2, ly2, circle) {
  var cx = parseFloat(circle.getAttribute("cx"));
  var cy = parseFloat(circle.getAttribute("cy"));
  var r  = parseFloat(circle.getAttribute("r"));
  return _distPointToSeg(cx, cy, lx1, ly1, lx2, ly2) <= r;
}

// ── Hand helpers ───────────────────────────────────────────────────────────
function _makeHand(svg, before, cx, cy, strokeWidth) {
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", cx);  line.setAttribute("y1", cy);
  line.setAttribute("x2", cx);  line.setAttribute("y2", cy);
  line.setAttribute("stroke", "#e03030");
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-linecap", "round");
  svg.insertBefore(line, before);
  return line;
}

function _setHand(hand, cx, cy, angleDeg, length) {
  var rad = (angleDeg - 90) * Math.PI / 180;
  hand.setAttribute("x1", cx);
  hand.setAttribute("y1", cy);
  hand.setAttribute("x2", cx + Math.cos(rad) * length);
  hand.setAttribute("y2", cy + Math.sin(rad) * length);
}

// ── Tick ───────────────────────────────────────────────────────────────────
function tickClock() {
  var now = new Date();
  var h   = now.getHours() % 12;
  var m   = now.getMinutes();
  var s   = now.getSeconds();
  var ms  = now.getMilliseconds();

  var degH = (h + m / 60) * 30;
  var degM = (m + s / 60) * 6;
  var degS = (s + ms / 1000) * 6;

  _setHand(_handHour,   _clockCx, _clockCy, degH, _clockR * 0.50);
  _setHand(_handMinute, _clockCx, _clockCy, degM, _clockR * 0.75);
  _setHand(_handSecond, _clockCx, _clockCy, degS, _clockR * 0.85);

  // Hide hand lines when lit mode is on — only lit segments should be visible
  var handStroke = _litEnabled ? "none" : "#e03030";
  _handHour.setAttribute("stroke",   handStroke);
  _handMinute.setAttribute("stroke", handStroke);
  _handSecond.setAttribute("stroke", handStroke);

  if (!_litEnabled) return;

  // Reset all segments to invisible
  for (var i = 0; i < _allSegments.length; i++) {
    _allSegments[i].el.setAttribute("fill", "none");
  }

  // Light up segments touched by any hand
  var hands = [_handHour, _handMinute, _handSecond];
  for (var hi = 0; hi < hands.length; hi++) {
    var hand = hands[hi];
    var hx1 = parseFloat(hand.getAttribute("x1"));
    var hy1 = parseFloat(hand.getAttribute("y1"));
    var hx2 = parseFloat(hand.getAttribute("x2"));
    var hy2 = parseFloat(hand.getAttribute("y2"));

    for (var i = 0; i < _allSegments.length; i++) {
      if (_allSegments[i].el.getAttribute("fill") === "#e03030") continue; // already lit
      var hit = _allSegments[i].isCircle
        ? _lineHitsCircle(hx1, hy1, hx2, hy2, _allSegments[i].el)
        : _lineHitsPolygon(hx1, hy1, hx2, hy2, _allSegments[i].el);
      if (hit) _allSegments[i].el.setAttribute("fill", "#e03030");
    }
  }
}

// ── Build ──────────────────────────────────────────────────────────────────
function buildClock() {
  if (_tickInterval) { clearInterval(_tickInterval); _tickInterval = null; }

  var existing = document.getElementById(SVG_ID);
  if (existing) existing.parentNode.removeChild(existing);

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

  // Step 1: generate digit groups (black fill — for mask only)
  FILL_COLOUR = EMPTY_COLOUR = "#000000";
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      sevSeg.add(row + "_" + col, SCALE);
    }
  }

  // Step 2: cutout mask
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

  // Step 3: background layer
  var firstDigit = document.getElementById("0_0");

  var redBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  redBg.setAttribute("id",     "red-bg");
  redBg.setAttribute("width",  W);
  redBg.setAttribute("height", H);
  redBg.setAttribute("fill",   "#e03030");
  var chk = document.getElementById("chk-red-bg");
  redBg.setAttribute("visibility", chk && chk.checked ? "visible" : "hidden");
  svg.insertBefore(redBg, firstDigit);

  // Hands — sit between red bg and grey plane
  _handHour   = _makeHand(svg, firstDigit, _clockCx, _clockCy, 14);
  _handMinute = _makeHand(svg, firstDigit, _clockCx, _clockCy,  9);
  _handSecond = _makeHand(svg, firstDigit, _clockCx, _clockCy,  5);

  // Step 4: grey masked plane
  var plane = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  plane.setAttribute("width",  W);
  plane.setAttribute("height", H);
  plane.setAttribute("fill",   "#e8e8e8");
  plane.setAttribute("mask",   "url(#cutout)");
  svg.insertBefore(plane, firstDigit);

  // Step 5: hide real digit groups + collect segment refs for lit-up feature
  // The digit groups sit ABOVE the grey plane in z-order — perfect for lit segments
  _allSegments = [];
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      var g = document.getElementById(row + "_" + col);
      if (!g) continue;
      var polys   = g.querySelectorAll("polygon");
      var circles = g.querySelectorAll("circle");
      for (var i = 0; i < polys.length;   i++) {
        polys[i].setAttribute("fill", "none");
        polys[i].setAttribute("stroke", "none");
        _allSegments.push({ el: polys[i], isCircle: false });
      }
      for (var i = 0; i < circles.length; i++) {
        circles[i].setAttribute("fill", "none");
        circles[i].setAttribute("stroke", "none");
        _allSegments.push({ el: circles[i], isCircle: true });
      }
    }
  }

  tickClock();
  _tickInterval = setInterval(tickClock, 50);
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", buildClock);
