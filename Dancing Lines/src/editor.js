// src/editor.js
// Visual editor for lode path geometries.
//
// Terminology used throughout:
//   vertex   — a corner point of the closed polygon.
//   edge     — a straight segment between two consecutive vertices.
//   segment  — a named group of consecutive edges that slide collectively
//              along one axis (X if affectY=0, Y if affectY=1).

class Editor {
    constructor(svgElement) {
        this.svg    = svgElement;
        this.ORIGIN = 50;   // SVG-px margin
        this.CELL   = 80;   // SVG-px per grid unit
        this.GMAX   = 10;   // grid spans 0..GMAX
        this.snap   = 0.5;
        this.tool   = 'add'; // 'add' | 'select'

        this.selectedVertex  = -1;
        this.selectedSegment = -1;
        this._dragVertex     = -1;

        this._ns = 'http://www.w3.org/2000/svg';

        // Called by host page whenever state changes.
        // Receives a reason string: 'structure' | 'coord' | 'segselect'
        this.onUpdate = null;

        this.geometry = {
            vertices:            [],
            segments:            [],
            nodeLimits:          [],
            overlapIllusionData: []
        };

        this._init();
    }

    // ── Coordinate helpers ─────────────────────────────────────────────────────

    _toSVG(ex, ey)  { return [this.ORIGIN + ex * this.CELL, this.ORIGIN + ey * this.CELL]; }
    _toGrid(sx, sy) { return [(sx - this.ORIGIN) / this.CELL, (sy - this.ORIGIN) / this.CELL]; }
    _snapV(v)       { return Math.round(v / this.snap) * this.snap; }

    _evGrid(e) {
        const r  = this.svg.getBoundingClientRect();
        const sx = (e.clientX - r.left) * (900 / r.width);
        const sy = (e.clientY - r.top)  * (900 / r.height);
        return this._toGrid(sx, sy);
    }

    // ── SVG helpers ────────────────────────────────────────────────────────────

    _el(tag, attrs = {}) {
        const el = document.createElementNS(this._ns, tag);
        for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
        return el;
    }

    _clr(el) { while (el.firstChild) el.removeChild(el.firstChild); }

    // ── Initialise canvas ─────────────────────────────────────────────────────

    _init() {
        this._clr(this.svg);
        this.svg.setAttribute('viewBox', '0 0 900 900');

        this._bg         = this._el('rect', { x: 0, y: 0, width: 900, height: 900, fill: 'white', cursor: 'crosshair' });
        this._lGrid      = this._el('g');
        this._lPath      = this._el('g', { 'pointer-events': 'none' });
        this._lSegs      = this._el('g');               // segments (clicks select them)
        this._lEdgeHands = this._el('g');               // midpoint insert handles
        this._lVertices  = this._el('g');
        this._lPrev      = this._el('g', { 'pointer-events': 'none' });

        this.svg.append(this._bg, this._lGrid, this._lPath, this._lSegs, this._lEdgeHands, this._lVertices, this._lPrev);
        this._drawGrid();
        this._bindEvents();
    }

    _drawGrid() {
        const g = this._lGrid;
        for (let i = 0; i <= this.GMAX; i++) {
            const [vx1, vy1] = this._toSVG(i, 0),        [vx2, vy2] = this._toSVG(i, this.GMAX);
            const [hx1, hy1] = this._toSVG(0, i),        [hx2, hy2] = this._toSVG(this.GMAX, i);
            g.appendChild(this._el('line', { x1: vx1, y1: vy1, x2: vx2, y2: vy2, stroke: '#ddd', 'stroke-width': 1 }));
            g.appendChild(this._el('line', { x1: hx1, y1: hy1, x2: hx2, y2: hy2, stroke: '#ddd', 'stroke-width': 1 }));

            const [lx, ly] = this._toSVG(i, -0.4);
            const tx = this._el('text', { x: lx, y: ly, 'text-anchor': 'middle', 'font-size': 18, fill: '#ccc', 'font-family': 'monospace', 'pointer-events': 'none' });
            tx.textContent = i; g.appendChild(tx);

            const [rx, ry] = this._toSVG(-0.5, i + 0.1);
            const ty = this._el('text', { x: rx, y: ry, 'text-anchor': 'middle', 'font-size': 18, fill: '#ccc', 'font-family': 'monospace', 'pointer-events': 'none' });
            ty.textContent = i; g.appendChild(ty);
        }
    }

    // ── Event bindings ─────────────────────────────────────────────────────────

    _bindEvents() {
        // Background click → append new vertex (add mode)
        this._bg.addEventListener('click', (e) => {
            if (this.tool !== 'add') return;
            const [gx, gy] = this._evGrid(e);
            this._appendVertex(this._snapV(gx), this._snapV(gy));
        });

        // Hover preview dot (add mode)
        this._bg.addEventListener('mousemove', (e) => {
            if (this.tool !== 'add') { this._clr(this._lPrev); return; }
            const [gx, gy] = this._evGrid(e);
            const [sx, sy] = this._toSVG(this._snapV(gx), this._snapV(gy));
            this._clr(this._lPrev);
            this._lPrev.appendChild(this._el('circle', { cx: sx, cy: sy, r: 10, fill: 'rgba(124,106,247,0.2)', stroke: '#7c6af7', 'stroke-width': 1.5 }));
        });
        this._bg.addEventListener('mouseleave', () => this._clr(this._lPrev));

        // Drag: update position while mouse held on a vertex
        this.svg.addEventListener('mousemove', (e) => {
            if (this._dragVertex < 0) return;
            const [gx, gy] = this._evGrid(e);
            this.geometry.vertices[this._dragVertex] = [this._snapV(gx), this._snapV(gy)];
            this._render();
            if (this.onUpdate) this.onUpdate('coord');
        });

        const endDrag = () => { this._dragVertex = -1; };
        this.svg.addEventListener('mouseup',    endDrag);
        this.svg.addEventListener('mouseleave', endDrag);
    }

    // ── Render ─────────────────────────────────────────────────────────────────

    _render() {
        this._renderPath();
        this._renderSegs();
        this._renderEdgeHandles();
        this._renderVertices();
    }

    _renderPath() {
        this._clr(this._lPath);
        const vs = this.geometry.vertices;
        if (vs.length < 2) return;
        const d = vs.map((v, i) => (i ? 'L' : 'M') + this._toSVG(v[0], v[1]).join(' ')).join(' ') + ' Z';
        this._lPath.appendChild(this._el('path', {
            d, stroke: '#bbb', 'stroke-width': 2,
            fill: 'rgba(100,150,255,0.07)', 'stroke-dasharray': '10,5'
        }));
    }

    _renderSegs() {
        this._clr(this._lSegs);
        const vs = this.geometry.vertices;
        const n  = vs.length;
        if (n < 2) return;

        for (let si = 0; si < this.geometry.segments.length; si++) {
            const [sn, en, aY] = this.geometry.segments[si];
            if (sn < 0 || en < 0 || sn >= n || en >= n) continue;

            const isSel = si === this.selectedSegment;

            // Collect vertices clockwise from sn to en
            const vIdxs = [];
            let j = sn;
            for (let k = 0; k <= n; k++) {
                vIdxs.push(j);
                if (j === en) break;
                j = (j + 1) % n;
            }

            const d       = vIdxs.map((vi, k) => (k ? 'L' : 'M') + this._toSVG(vs[vi][0], vs[vi][1]).join(' ')).join(' ');
            const rgb     = aY ? '210,60,60' : '40,160,40';
            const alpha   = isSel ? 1.0 : 0.4;
            const width   = isSel ? 22 : 7;
            const glowWidth = isSel ? 28 : 0;

            // Glow effect for selected segment (thicker background stroke)
            if (isSel && glowWidth > 0) {
                const glow = this._el('path', {
                    d,
                    stroke: `rgba(${rgb},0.25)`,
                    'stroke-width': glowWidth,
                    fill: 'none',
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    'pointer-events': 'none'
                });
                this._lSegs.appendChild(glow);
            }

            const path = this._el('path', {
                d,
                stroke: `rgba(${rgb},${alpha})`,
                'stroke-width': width,
                fill: 'none',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                cursor: 'pointer'
            });
            path.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectedSegment = isSel ? -1 : si;
                this.selectedVertex  = -1;
                this._render();
                if (this.onUpdate) this.onUpdate('segselect');
            });
            this._lSegs.appendChild(path);

            // Label at midpoint vertex of the segment
            const mid      = vIdxs[Math.floor(vIdxs.length / 2)];
            const [lx, ly] = this._toSVG(vs[mid][0], vs[mid][1]);
            const lbl = this._el('text', {
                x: lx + 14, y: ly - 14,
                'font-size': isSel ? 20 : 12,
                'font-weight': 'bold',
                fill: aY ? (isSel ? '#d00' : '#a01818') : (isSel ? '#0a0' : '#186018'),
                'font-family': 'monospace',
                'pointer-events': 'none'
            });
            lbl.textContent = 'S' + si + (aY ? ' Y' : ' X');
            this._lSegs.appendChild(lbl);
        }
    }

    _renderEdgeHandles() {
        this._clr(this._lEdgeHands);
        // Show midpoint insert handles only in Add mode when ≥2 vertices exist.
        if (this.tool !== 'add' || this.geometry.vertices.length < 2) return;

        const vs = this.geometry.vertices;
        const n  = vs.length;

        for (let i = 0; i < n; i++) {
            const next      = (i + 1) % n;
            const [ax, ay]  = this._toSVG(vs[i][0],    vs[i][1]);
            const [bx, by]  = this._toSVG(vs[next][0], vs[next][1]);
            const mx        = (ax + bx) / 2;
            const my        = (ay + by) / 2;
            const afterIdx  = i;

            const g = this._el('g', { cursor: 'cell' });
            g.appendChild(this._el('circle', {
                cx: mx, cy: my, r: 9,
                fill: 'rgba(124,106,247,0.15)',
                stroke: '#7c6af7',
                'stroke-width': 1.5,
                'stroke-dasharray': '3,2'
            }));
            const plus = this._el('text', {
                x: mx, y: my + 5,
                'text-anchor': 'middle',
                'font-size': 13, 'font-weight': 'bold',
                fill: '#7c6af7', 'pointer-events': 'none'
            });
            plus.textContent = '+';
            g.appendChild(plus);

            g.addEventListener('click', (e) => {
                e.stopPropagation();
                // Insert new vertex at the snapped midpoint of this edge.
                const gx = this._snapV((vs[afterIdx][0] + vs[next][0]) / 2);
                const gy = this._snapV((vs[afterIdx][1] + vs[next][1]) / 2);
                this.insertVertex(afterIdx, gx, gy);
            });

            this._lEdgeHands.appendChild(g);
        }
    }

    _renderVertices() {
        this._clr(this._lVertices);
        const vs = this.geometry.vertices;

        for (let i = 0; i < vs.length; i++) {
            const [cx, cy] = this._toSVG(vs[i][0], vs[i][1]);
            const sel      = i === this.selectedVertex;
            const g        = this._el('g', { cursor: 'grab' });

            if (sel) {
                // Outer glow ring (large, soft)
                g.appendChild(this._el('circle', { cx, cy, r: 36, fill: 'none', stroke: 'rgba(124,106,247,0.4)', 'stroke-width': 4 }));
                // Middle ring (medium, brighter)
                g.appendChild(this._el('circle', { cx, cy, r: 26, fill: 'none', stroke: 'rgba(124,106,247,0.6)', 'stroke-width': 2 }));
            }

            g.appendChild(this._el('circle', {
                cx, cy, r: sel ? 16 : 14,
                fill:   sel ? '#7c6af7' : '#fff',
                stroke: sel ? '#3030ff' : '#555',
                'stroke-width': sel ? 3.5 : 2.5
            }));

            // Vertex index
            const lbl = this._el('text', {
                x: cx, y: cy + 5,
                'text-anchor': 'middle', 'font-size': sel ? 18 : 14, 'font-weight': 'bold',
                fill: sel ? '#fff' : '#333', 'font-family': 'monospace', 'pointer-events': 'none'
            });
            lbl.textContent = i;
            g.appendChild(lbl);

            // Coordinate label — always visible below the vertex circle
            const clbl = this._el('text', {
                x: cx, y: cy + 30,
                'text-anchor': 'middle', 'font-size': 12, fill: '#888',
                'font-family': 'monospace', 'pointer-events': 'none'
            });
            clbl.textContent = vs[i][0] + ',' + vs[i][1];
            g.appendChild(clbl);

            g.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                this.selectedVertex  = i;
                this._dragVertex     = i;
                this.selectedSegment = -1;
                this._render();
                if (this.onUpdate) this.onUpdate('select');
            });

            this._lVertices.appendChild(g);
        }
    }

    // ── Geometry operations ────────────────────────────────────────────────────

    /** Append a new vertex at the end of the list. */
    _appendVertex(x, y) {
        const i = this.geometry.vertices.length;
        this.geometry.vertices.push([x, y]);
        this.geometry.nodeLimits.push([[], []]);
        this.selectedVertex  = i;
        this.selectedSegment = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    /** Insert a new vertex after vertex at index `afterIdx` (between afterIdx and afterIdx+1). */
    insertVertex(afterIdx, x, y) {
        const insertIdx = afterIdx + 1;
        this.geometry.vertices.splice(insertIdx, 0, [x, y]);
        this.geometry.nodeLimits.splice(insertIdx, 0, [[], []]);

        // Any vertex reference ≥ insertIdx must be incremented to stay valid.
        const remap = n => n >= insertIdx ? n + 1 : n;

        this.geometry.segments = this.geometry.segments
            .map(([s, e, aY]) => [remap(s), remap(e), aY]);

        this.geometry.nodeLimits = this.geometry.nodeLimits
            .map(([xl, yl]) => [xl.map(remap), yl.map(remap)]);

        this.geometry.overlapIllusionData = this.geometry.overlapIllusionData.map(o => ({
            upperLeftNode:  remap(o.upperLeftNode),
            lowerRightNode: remap(o.lowerRightNode)
        }));

        this.selectedVertex  = insertIdx;
        this.selectedSegment = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    /** Delete vertex at `idx`, reindexing all references. */
    deleteVertex(idx) {
        if (idx < 0 || idx >= this.geometry.vertices.length) return;
        this.geometry.vertices.splice(idx, 1);
        this.geometry.nodeLimits.splice(idx, 1);

        const rm = arr => arr.filter(n => n !== idx).map(n => n > idx ? n - 1 : n);

        this.geometry.segments = this.geometry.segments
            .filter(([s, e]) => s !== idx && e !== idx)
            .map(([s, e, aY]) => [s > idx ? s - 1 : s, e > idx ? e - 1 : e, aY]);

        this.geometry.nodeLimits = this.geometry.nodeLimits
            .map(([xl, yl]) => [rm(xl), rm(yl)]);

        this.geometry.overlapIllusionData = this.geometry.overlapIllusionData
            .filter(o => o.upperLeftNode !== idx && o.lowerRightNode !== idx)
            .map(o => ({
                upperLeftNode:  o.upperLeftNode  > idx ? o.upperLeftNode  - 1 : o.upperLeftNode,
                lowerRightNode: o.lowerRightNode > idx ? o.lowerRightNode - 1 : o.lowerRightNode
            }));

        const n = this.geometry.vertices.length;
        this.selectedVertex  = n === 0 ? -1 : Math.min(this.selectedVertex, n - 1);
        this.selectedSegment = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    updateVertex(idx, x, y) {
        if (idx < 0 || idx >= this.geometry.vertices.length) return;
        this.geometry.vertices[idx] = [+x, +y];
        this._render();
    }

    setVertexLimits(idx, xLims, yLims) {
        if (idx >= 0 && idx < this.geometry.nodeLimits.length)
            this.geometry.nodeLimits[idx] = [xLims, yLims];
    }

    addSegment(sn, en, aY) {
        this.geometry.segments.push([parseInt(sn), parseInt(en), aY ? 1 : 0]);
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    removeSegment(i) {
        this.geometry.segments.splice(i, 1);
        if (this.selectedSegment >= this.geometry.segments.length) this.selectedSegment = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    updateSegment(i, field, val) {
        const seg = this.geometry.segments[i];
        if (!seg) return;
        seg[field] = parseInt(val);
        this._render();
    }

    toggleSegmentAxis(i) {
        const seg = this.geometry.segments[i];
        if (!seg) return;
        seg[2] = seg[2] ? 0 : 1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    selectSegment(i) {
        this.selectedSegment = (this.selectedSegment === i) ? -1 : i;
        this.selectedVertex  = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('segselect');
    }

    addOverlap(ul, lr) {
        this.geometry.overlapIllusionData.push({ upperLeftNode: +ul, lowerRightNode: +lr });
        if (this.onUpdate) this.onUpdate('structure');
    }

    removeOverlap(i) {
        this.geometry.overlapIllusionData.splice(i, 1);
        if (this.onUpdate) this.onUpdate('structure');
    }

    updateOverlap(i, field, val) {
        const o = this.geometry.overlapIllusionData[i];
        if (!o) return;
        if (field === 'ul') o.upperLeftNode  = +val;
        else                o.lowerRightNode = +val;
    }

    loadGeometry(geom) {
        this.geometry = JSON.parse(JSON.stringify(geom));
        while (this.geometry.nodeLimits.length < this.geometry.vertices.length)
            this.geometry.nodeLimits.push([[], []]);
        this.selectedVertex  = -1;
        this.selectedSegment = -1;
        this._render();
        if (this.onUpdate) this.onUpdate('structure');
    }

    getGeometry() { return JSON.parse(JSON.stringify(this.geometry)); }

    setTool(t) {
        this.tool = t;
        this._bg.setAttribute('cursor', t === 'add' ? 'crosshair' : 'default');
        this._render(); // show/hide edge-insert handles
    }

    setSnap(s) { this.snap = +s; }

    destroy() { this._clr(this.svg); this.svg.setAttribute('viewBox', '0 0 1000 1000'); }
}
