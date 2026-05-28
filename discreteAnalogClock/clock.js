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

var DIGIT_SKEW = -7;

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

// ── Colours ────────────────────────────────────────────────────────────────
var _bgColor      = "#e8e8e8";  // SVG + page background (shows through "off" segments)
var _planeColor   = "#e8e8e8";  // face plane between / around digit cells
var _segmentColor = "#e03030";  // lit segments and clock hands

// ── Runtime state ──────────────────────────────────────────────────────────
var _handHour      = null;
var _handMinute    = null;
var _handSecond    = null;
var _clockCx       = 0;
var _clockCy       = 0;
var _clockR        = 0;
var _tickInterval  = null;
var _litEnabled         = false;
var _secondEnabled      = true;
var _allSegments        = [];
var _pinnedSegments     = {};   // segmentId -> true
var _clickToggleEnabled = false;
var _hoverOnEnabled  = false;
var _hoverOffEnabled = false;
var _manualTime    = false;
var _manualHour    = 0;   // 0–11
var _manualMinute  = 0;   // 0–59
var _offsetX = 0;
var _offsetY = 0;

// Hand geometry — length and start offset as % of radius
var _hourLen   = 50;  var _hourOff   = 0;
var _minuteLen = 75;  var _minuteOff = 0;
var _secondLen = 85;  var _secondOff = 0;

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

function _distPointToSeg(px, py, ax, ay, bx, by) {
  var dx = bx - ax, dy = by - ay;
  var lenSq = dx * dx + dy * dy;
  var t = lenSq === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
  var nx = ax + t * dx - px, ny = ay + t * dy - py;
  return Math.sqrt(nx * nx + ny * ny);
}

function _lineHitsPolygon(lx1, ly1, lx2, ly2, polygon, tol) {
  var pts = polygon.points;
  var n   = pts.numberOfItems;
  // Centerline crosses a polygon edge
  for (var i = 0; i < n; i++) {
    var a = pts.getItem(i);
    var b = pts.getItem((i + 1) % n);
    if (_segmentsIntersect(lx1, ly1, lx2, ly2, a.x, a.y, b.x, b.y)) return true;
  }
  if (tol > 0) {
    // Any polygon vertex within half-thickness of the centerline
    for (var i = 0; i < n; i++) {
      var p = pts.getItem(i);
      if (_distPointToSeg(p.x, p.y, lx1, ly1, lx2, ly2) <= tol) return true;
    }
    // Any polygon edge within half-thickness of the hand endpoints (capsule ends)
    for (var i = 0; i < n; i++) {
      var a = pts.getItem(i);
      var b = pts.getItem((i + 1) % n);
      if (_distPointToSeg(lx1, ly1, a.x, a.y, b.x, b.y) <= tol) return true;
      if (_distPointToSeg(lx2, ly2, a.x, a.y, b.x, b.y) <= tol) return true;
    }
  }
  return false;
}

function _lineHitsCircle(lx1, ly1, lx2, ly2, circle, tol) {
  var cx = parseFloat(circle.getAttribute("cx"));
  var cy = parseFloat(circle.getAttribute("cy"));
  var r  = parseFloat(circle.getAttribute("r"));
  return _distPointToSeg(cx, cy, lx1, ly1, lx2, ly2) <= r + tol;
}

// ── Hand helpers ───────────────────────────────────────────────────────────
function _makeHand(svg, before, cx, cy, strokeWidth) {
  var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  line.setAttribute("x1", cx);  line.setAttribute("y1", cy);
  line.setAttribute("x2", cx);  line.setAttribute("y2", cy);
  line.setAttribute("stroke", _segmentColor);
  line.setAttribute("stroke-width", strokeWidth);
  line.setAttribute("stroke-linecap", "round");
  svg.insertBefore(line, before);
  return line;
}

function _setHand(hand, cx, cy, angleDeg, startR, endR) {
  var rad = (angleDeg - 90) * Math.PI / 180;
  hand.setAttribute("x1", cx + Math.cos(rad) * startR);
  hand.setAttribute("y1", cy + Math.sin(rad) * startR);
  hand.setAttribute("x2", cx + Math.cos(rad) * endR);
  hand.setAttribute("y2", cy + Math.sin(rad) * endR);
}

// ── Tick ───────────────────────────────────────────────────────────────────
function tickClock() {
  var h, m, s, ms;
  if (_manualTime) {
    h = _manualHour; m = _manualMinute; s = 0; ms = 0;
  } else {
    var now = new Date();
    h = now.getHours() % 12; m = now.getMinutes();
    s = now.getSeconds();    ms = now.getMilliseconds();
  }

  var degH = (h + m / 60) * 30;
  var degM = (m + s / 60) * 6;
  var degS = (s + ms / 1000) * 6;

  _setHand(_handHour,   _clockCx, _clockCy, degH, _clockR * _hourOff   / 100, _clockR * _hourLen   / 100);
  _setHand(_handMinute, _clockCx, _clockCy, degM, _clockR * _minuteOff / 100, _clockR * _minuteLen / 100);
  _setHand(_handSecond, _clockCx, _clockCy, degS, _clockR * _secondOff / 100, _clockR * _secondLen / 100);

  // Hide hand lines when lit mode is on — only lit segments should be visible
  var handStroke = _litEnabled ? "none" : _segmentColor;
  _handHour.setAttribute("stroke",   handStroke);
  _handMinute.setAttribute("stroke", handStroke);
  _handSecond.setAttribute("stroke", _litEnabled ? "none" : (_secondEnabled ? _segmentColor : "none"));

  // Reset all segments to invisible
  for (var i = 0; i < _allSegments.length; i++) {
    _allSegments[i].el.setAttribute("fill", "none");
  }

  // Light up segments touched by any active hand (only when lit mode on)
  if (_litEnabled) {
    var hands = [
      { el: _handHour,   tol: parseFloat(_handHour.getAttribute("stroke-width"))   / 2 },
      { el: _handMinute, tol: parseFloat(_handMinute.getAttribute("stroke-width")) / 2 },
    ];
    if (_secondEnabled) hands.push(
      { el: _handSecond, tol: parseFloat(_handSecond.getAttribute("stroke-width")) / 2 }
    );

    for (var hi = 0; hi < hands.length; hi++) {
      var hand = hands[hi].el;
      var tol  = hands[hi].tol;
      var hx1  = parseFloat(hand.getAttribute("x1"));
      var hy1  = parseFloat(hand.getAttribute("y1"));
      var hx2  = parseFloat(hand.getAttribute("x2"));
      var hy2  = parseFloat(hand.getAttribute("y2"));

      for (var i = 0; i < _allSegments.length; i++) {
        if (_allSegments[i].el.getAttribute("fill") === _segmentColor) continue;
        var hit = _allSegments[i].isCircle
          ? _lineHitsCircle(hx1, hy1, hx2, hy2, _allSegments[i].el, tol)
          : _lineHitsPolygon(hx1, hy1, hx2, hy2, _allSegments[i].el, tol);
        if (hit) _allSegments[i].el.setAttribute("fill", _segmentColor);
      }
    }
  }

  // Apply manually pinned segments (always, on top of everything)
  for (var pid in _pinnedSegments) {
    var pel = document.getElementById(pid);
    if (pel) pel.setAttribute("fill", _segmentColor);
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
  svg.style.background = _bgColor;
  document.body.style.background = _planeColor;
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

  var maskDigitsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  maskDigitsLayer.setAttribute("id", "mask-digits-layer");
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
      maskDigitsLayer.appendChild(clone);
    }
  }
  mask.appendChild(maskDigitsLayer);
  defs.appendChild(mask);
  svg.insertBefore(defs, svg.firstChild);

  // Step 3: hands + plane
  var firstDigit = document.getElementById("0_0");

  // Hands — sit between defs and grey plane
  _handHour   = _makeHand(svg, firstDigit, _clockCx, _clockCy, 14);
  _handMinute = _makeHand(svg, firstDigit, _clockCx, _clockCy,  9);
  _handSecond = _makeHand(svg, firstDigit, _clockCx, _clockCy,  5);

  // Step 4: grey masked plane
  var plane = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  plane.setAttribute("id",     "clock-plane");
  plane.setAttribute("width",  W);
  plane.setAttribute("height", H);
  plane.setAttribute("fill",   _planeColor);
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

  // Wire click-to-toggle on each segment
  for (var si = 0; si < _allSegments.length; si++) {
    _allSegments[si].el.setAttribute("pointer-events", "all");
    _allSegments[si].el.style.cursor = (_clickToggleEnabled || _hoverOnEnabled || _hoverOffEnabled) ? "pointer" : "default";
    (function(seg) {
      seg.el.addEventListener("click", function() {
        if (!_clickToggleEnabled) return;
        var id = seg.el.getAttribute("id");
        if (!id) return;
        if (_pinnedSegments[id]) {
          delete _pinnedSegments[id];
        } else {
          _pinnedSegments[id] = true;
        }
      });
      seg.el.addEventListener("mouseenter", function() {
        if (!_hoverOnEnabled && !_hoverOffEnabled) return;
        var id = seg.el.getAttribute("id");
        if (!id) return;
        if (_hoverOnEnabled)  _pinnedSegments[id] = true;
        if (_hoverOffEnabled) delete _pinnedSegments[id];
      });
    })(_allSegments[si]);
  }

  // Wrap all digit groups in a single layer so offset can be applied without rebuild
  var digitsLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  digitsLayer.setAttribute("id", "digits-layer");
  var firstGroup = document.getElementById("0_0");
  svg.insertBefore(digitsLayer, firstGroup);
  for (var row = 0; row < CLOCK_ROWS; row++) {
    for (var col = 0; col < CLOCK_COLS; col++) {
      var dg = document.getElementById(row + "_" + col);
      if (dg) digitsLayer.appendChild(dg);
    }
  }

  applyDigitOffset(_offsetX, _offsetY);

  tickClock();
  _tickInterval = setInterval(tickClock, 50);
}

function applyDigitOffset(x, y) {
  var dl = document.getElementById("digits-layer");
  if (dl) dl.setAttribute("transform", "translate(" + x + "," + y + ")");
  var ml = document.getElementById("mask-digits-layer");
  if (ml) ml.setAttribute("transform", "translate(" + x + "," + y + ")");
}

function applyBgColor(c) {
  _bgColor = c;
  var svg = document.getElementById(SVG_ID);
  if (svg) svg.style.background = c;
}

function applyPlaneColor(c) {
  _planeColor = c;
  var plane = document.getElementById("clock-plane");
  if (plane) plane.setAttribute("fill", c);
  document.body.style.background = c;
}

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", buildClock);
