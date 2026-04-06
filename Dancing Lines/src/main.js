// Dancing Lines — main.js
//
// A lode path is a closed orthogonal polygon. It is described by:
//   vertices  — the corner points of the polygon, listed clockwise.
//   segments  — groups of consecutive edges that slide together along one axis (X or Y).
//   nodeLimits — per-vertex constraints that prevent a vertex from crossing another.

let currentField    = null;
let paused          = false;
let currentGeometry = null;

window.addEventListener('DOMContentLoaded', () => {
    setupLiveControls();
    // Always clear textarea on page load to ensure shape dropdown works
    const ta = document.getElementById('geometry-json');
    if (ta) {
        ta.value = '';
        // Force it to be empty
        ta.innerHTML = '';
    }
    startAnimation();
});

// ---------------------------------------------------------------------------
// Animation control
// ---------------------------------------------------------------------------

function startAnimation(overrides) {
    // Check if there's a geometry in the import textarea
    const jsonTA = document.getElementById('geometry-json');
    if (jsonTA && jsonTA.value.trim()) {
        try {
            const data = JSON.parse(jsonTA.value);
            if (Array.isArray(data.vertices) && Array.isArray(data.segments) && Array.isArray(data.nodeLimits)) {
                // Sync fill-rule if present
                if (data.fillRule) {
                    const sel = document.getElementById('fill-rule');
                    if (sel) sel.value = data.fillRule;
                }
                _runAnimation(data, overrides);
                return;
            }
        } catch (e) {
            // Invalid JSON in textarea; fall back to shape dropdown
        }
    }

    // Fall back to shape dropdown
    const shapeName = document.getElementById('shape-select').value;
    _runAnimation(getGeometryByName(shapeName), overrides);
}

function _runAnimation(geometry, overrides) {
    const svgElement = document.getElementById('testsvg');

    if (currentField) currentField.stop();
    clearSVG(svgElement);

    const strokeColor = document.getElementById('stroke-color').value;
    const fillColor   = document.getElementById('fill-color').value;
    const fillRule    = document.getElementById('fill-rule').value;
    const strokeWidth = sliderToStrokeWidth(document.getElementById('stroke-width').value);
    const baseSpeed   = sliderToSpeed(document.getElementById('speed').value);
    const speedVariability = sliderToSpeedVariability(document.getElementById('speed-variability').value);
    const speedChange = sliderToSpeedChange(document.getElementById('speed-change').value);

    currentGeometry = {
        vertices:            geometry.vertices,
        segments:            geometry.segments,
        nodeLimits:          geometry.nodeLimits,
        overlapIllusionData: geometry.overlapIllusionData || [],
        fillRule:            geometry.fillRule || fillRule
    };

    updateExportTextarea();

    const maxX = (overrides && overrides.MAX_X) || 1000;
    const maxY = (overrides && overrides.MAX_Y) || 1000;

    const pathGeometry = Object.assign({}, currentGeometry, {
        pathProperties: {
            PATH_OFFSET_X: 200,
            PATH_OFFSET_Y: 200,
            MAX_X: maxX,
            MIN_X: 0,
            MAX_Y: maxY,
            MIN_Y: 0,
            PATH_SCALE:    100,
            STROKE_COLOUR: strokeColor,
            FILL_COLOUR:   fillColor,
            FILL_RULE:     currentGeometry.fillRule,
            STROKE_WIDTH:  strokeWidth
        }
    });

    const animationProperties = {
        BASE_SPEED:                          baseSpeed,
        SPEED_VARIABILITY:                   speedVariability,
        SPEED_CHANGE_ON_BOUNCE:              speedChange,
        HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA: 2
    };

    const fieldProperties = {
        LOOP_PERIOD_MS: 10,
        ACCELERATION_UPDATE_HIGHER_IS_LESS_PROBABLE: 1000
    };

    currentField = new Field(fieldProperties, svgElement);
    currentField.addMovingPath(animationProperties, pathGeometry);
    currentField.start();

    paused = false;
    syncPauseButton();
}

function togglePause() {
    if (!currentField) return;
    if (paused) {
        currentField.start();
        paused = false;
    } else {
        currentField.stop();
        paused = true;
    }
    syncPauseButton();
}

function syncPauseButton() {
    const btn = document.getElementById('pause-btn');
    if (!btn) return;
    btn.textContent = paused ? 'Resume' : 'Pause';
    btn.classList.toggle('is-paused', paused);
}

function clearSVG(svgElement) {
    while (svgElement.firstChild) svgElement.removeChild(svgElement.firstChild);
}

// ---------------------------------------------------------------------------
// Live control wiring
// ---------------------------------------------------------------------------

function setupLiveControls() {
    document.getElementById('stroke-color').addEventListener('input', e => {
        if (currentField) currentField.setStrokeColor(e.target.value);
    });

    document.getElementById('fill-color').addEventListener('input', e => {
        if (currentField) currentField.setFillColor(e.target.value);
    });

    document.getElementById('fill-rule').addEventListener('change', e => {
        if (currentField) currentField.setFillRule(e.target.value);
        if (currentGeometry) currentGeometry.fillRule = e.target.value;
    });

    document.getElementById('bg-color').addEventListener('input', e => {
        document.getElementById('testsvg').style.background = e.target.value;
    });

    document.getElementById('stroke-width').addEventListener('input', e => {
        document.getElementById('stroke-width-val').textContent = e.target.value;
        if (currentField) currentField.setStrokeWidth(sliderToStrokeWidth(e.target.value));
    });

    document.getElementById('speed').addEventListener('input', e => {
        document.getElementById('speed-val').textContent = e.target.value;
        if (currentField) currentField.setBaseSpeed(sliderToSpeed(e.target.value));
    });

    document.getElementById('speed-variability').addEventListener('input', e => {
        document.getElementById('speed-variability-val').textContent = e.target.value;
        if (currentField) currentField.setSpeedVariability(sliderToSpeedVariability(e.target.value));
    });

    document.getElementById('speed-change').addEventListener('input', e => {
        document.getElementById('speed-change-val').textContent = e.target.value;
        if (currentField) currentField.setSpeedChangeOnBounce(sliderToSpeedChange(e.target.value));
    });

    // Shape change always requires a full restart
    document.getElementById('shape-select').addEventListener('change', () => {
        // Clear textarea to ensure shape dropdown takes priority
        const ta = document.getElementById('geometry-json');
        if (ta) ta.value = '';

        // Get the selected shape and run animation
        const shapeName = document.getElementById('shape-select').value;
        const geometry = getGeometryByName(shapeName);
        _runAnimation(geometry);
        // updateExportTextarea() is called inside _runAnimation()
    });
}

// ---------------------------------------------------------------------------
// Slider value mapping
// ---------------------------------------------------------------------------

function sliderToStrokeWidth(sliderValue) {
    // slider 10–150  →  path-unit stroke width 0.01–0.15
    return parseFloat(sliderValue) / 1000;
}

function sliderToSpeed(sliderValue) {
    // linear: slider 1–100  →  BASE_SPEED 0.00002–0.005 (units per millisecond)
    // Extremely slow minimum, good maximum for fine control
    return 0.00002 + (parseFloat(sliderValue) - 1) / 100 * (0.005 - 0.00002);
}

function sliderToSpeedVariability(sliderValue) {
    // linear: slider 0–100  →  SPEED_VARIABILITY 0–1.0 (fraction of base speed)
    // 0 = all segments same speed, 1.0 = segments can vary from 0 to 2x base speed
    return parseFloat(sliderValue) / 100;
}

function sliderToSpeedChange(sliderValue) {
    // linear: slider 0–100  →  SPEED_CHANGE_ON_BOUNCE 0–1.0 (fraction of base speed)
    return parseFloat(sliderValue) / 100;
}

// ---------------------------------------------------------------------------
// Import / Export
// ---------------------------------------------------------------------------

function updateExportTextarea() {
    if (!currentGeometry) return;
    document.getElementById('geometry-json').value = formatGeometryJson(currentGeometry);
}

// Compact JSON formatter: arrays/objects that fit within ~72 chars stay on one
// line; longer ones are expanded with each element on its own line.
function formatGeometryJson(val, depth = 0) {
    const indent = '  '.repeat(depth);
    const inner  = '  '.repeat(depth + 1);

    if (Array.isArray(val)) {
        if (val.length === 0) return '[]';
        const flat = JSON.stringify(val);
        if (flat.length <= 72) return flat.replace(/,/g, ', ');
        return '[\n' + val.map(v => inner + formatGeometryJson(v, depth + 1)).join(',\n') + '\n' + indent + ']';
    }

    if (typeof val === 'object' && val !== null) {
        const flat = JSON.stringify(val);
        if (flat.length <= 72) return flat.replace(/,/g, ', ').replace(/:/g, ': ');
        const entries = Object.entries(val);
        return '{\n' + entries.map(([k, v]) => inner + JSON.stringify(k) + ': ' + formatGeometryJson(v, depth + 1)).join(',\n') + '\n' + indent + '}';
    }

    return JSON.stringify(val);
}

function copyGeometryJson() {
    const ta = document.getElementById('geometry-json');
    if (!ta.value) return;
    navigator.clipboard.writeText(ta.value).then(() => {
        const btn  = document.getElementById('copy-btn');
        const orig = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = orig; }, 1500);
    });
}

function loadGeometry() {
    const ta = document.getElementById('geometry-json');
    let data;
    try {
        data = JSON.parse(ta.value);
    } catch (e) {
        alert('Invalid JSON: ' + e.message);
        return;
    }
    if (!Array.isArray(data.vertices) || !Array.isArray(data.segments) || !Array.isArray(data.nodeLimits)) {
        alert('JSON must have "vertices", "segments", and "nodeLimits" arrays.');
        return;
    }
    // Sync fill-rule dropdown if the JSON includes one.
    if (data.fillRule) {
        const sel = document.getElementById('fill-rule');
        if (sel) sel.value = data.fillRule;
    }
    _runAnimation(data);
}

function downloadGeometryFile() {
    const ta = document.getElementById('geometry-json');
    if (!ta.value) {
        alert('Nothing to download. Click "Export current shape" first.');
        return;
    }
    const blob = new Blob([ta.value], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'path-geometry.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function uploadGeometryFile() {
    const input = document.getElementById('geometry-file-input');
    input.click();
}

// Handle file selection for upload
document.getElementById('geometry-file-input').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (event) {
        const ta = document.getElementById('geometry-json');
        ta.value = event.target.result;
        // Reset the file input so the same file can be selected again
        document.getElementById('geometry-file-input').value = '';
    };
    reader.onerror = function () {
        alert('Error reading file.');
    };
    reader.readAsText(file);
});

