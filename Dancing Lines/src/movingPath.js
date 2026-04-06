var MAXIMUM_AMOUNT_OF_NODES = 1000;
class MovingPath extends Path {

    constructor(pathGeometry, animationProperties, svg) {
        super(pathGeometry.vertices, svg, pathGeometry.pathProperties);

        this.animationProperties = animationProperties;
        this.pathProperties      = pathGeometry.pathProperties;
        this.vertices            = pathGeometry.vertices;
        this.segments            = pathGeometry.segments;
        this.nodeLimits          = pathGeometry.nodeLimits;
        this.overlapIllusionData = pathGeometry.overlapIllusionData;

        // One speed value per segment (units per millisecond, in the segment's axis)
        // Initialize with base speed ± variability
        this.segmentSpeeds = [];
        const baseSpeed = this.animationProperties.BASE_SPEED || 0.2;
        const variability = this.animationProperties.SPEED_VARIABILITY || 0;
        for (var i = 0; i < this.segments.length; i++) {
            let direction = Math.random() * 2 - 1; // -1 to 1, random sign
            let speedVariance = 1 + (Math.random() * 2 - 1) * variability; // 1 ± variability
            this.segmentSpeeds.push(direction * baseSpeed * speedVariance);
        }

        // Overlap-illusion mask rectangles
        let RECT_SCALE        = this.pathProperties.PATH_SCALE;
        let RECT_OFFSET_X     = this.pathProperties.PATH_OFFSET_X;
        let RECT_OFFSET_Y     = this.pathProperties.PATH_OFFSET_Y;
        let RECT_STROKE_COLOUR= this.pathProperties.STROKE_COLOUR;
        let RECT_FILL_COLOUR  = this.pathProperties.FILL_COLOUR;
        let RECT_MAX_X        = this.pathProperties.MAX_X;
        let RECT_MIN_X        = this.pathProperties.MIN_X;
        let RECT_MAX_Y        = this.pathProperties.MAX_Y;
        let RECT_MIN_Y        = this.pathProperties.MIN_Y;

        this.rectProperties = { RECT_SCALE, RECT_OFFSET_X, RECT_OFFSET_Y, RECT_STROKE_COLOUR, RECT_FILL_COLOUR, RECT_MAX_X, RECT_MIN_X, RECT_MAX_Y, RECT_MIN_Y };

        this.overlapIllusions = [];
        for (var overlapIndex = 0; overlapIndex < this.overlapIllusionData.length; overlapIndex++) {
            this.overlapIllusions.push(new Rect([[0.3, 0.4], [1, 1]], this.svg, this.rectProperties));
        }
        this.updateOverlaps();
    }

    // ── Overlap illusion masks ────────────────────────────────────────────────

    updateOverlaps() {
        let verts = this.getPathVertices();
        let strokeWidthCompensation = this.pathProperties.STROKE_WIDTH / 2;
        for (var overlapIndex = 0; overlapIndex < this.overlapIllusionData.length; overlapIndex++) {
            let overlap = this.overlapIllusions[overlapIndex];
            let ul = [
                verts[this.overlapIllusionData[overlapIndex].upperLeftNode][0]  + strokeWidthCompensation,
                verts[this.overlapIllusionData[overlapIndex].upperLeftNode][1]  + strokeWidthCompensation
            ];
            let lr = [
                verts[this.overlapIllusionData[overlapIndex].lowerRightNode][0] - strokeWidthCompensation,
                verts[this.overlapIllusionData[overlapIndex].lowerRightNode][1] - strokeWidthCompensation
            ];
            overlap.updateRectWithCoords([ul, lr]);
        }
    }

    // ── Acceleration management ───────────────────────────────────────────────

    applySpeedChangeOnBounce(segmentIndex) {
        // When a segment bounces, apply a small random change to its speed
        const baseSpeed = this.animationProperties.BASE_SPEED || 0.2;
        const changeRate = this.animationProperties.SPEED_CHANGE_ON_BOUNCE || 0.1; // 0-1, fraction of base speed
        const maxChange = baseSpeed * changeRate;
        const randomChange = (Math.random() * 2 - 1) * maxChange; // -maxChange to +maxChange
        this.segmentSpeeds[segmentIndex] += randomChange;
    }

    // ── Position update (physics) ─────────────────────────────────────────────

    segmentsPositionUpdate(deltaMs) {
        // Try to apply deltaMs. If any segment violates a boundary or node-limit,
        // halve deltaMs and retry. Commit once valid; invert the offending segment's speed.

        let isValid = false;
        let problematicSegmentIndex = -1;

        while (!isValid) {
            var updatedVerts  = JSON.parse(JSON.stringify(this.vertices));
            var updatedSpeeds = JSON.parse(JSON.stringify(this.segmentSpeeds));
            this.updateSegmentsSpeeds(deltaMs, updatedSpeeds);
            let returnNumber = this.updateSegmentsPosition(deltaMs, updatedVerts);
            if (returnNumber !== 666) {
                // A constraint was violated — try a smaller time step.
                deltaMs = deltaMs / 2;
                problematicSegmentIndex = returnNumber;
            } else {
                isValid = true;
            }
        }

        this.vertices      = updatedVerts;
        this.segmentSpeeds = updatedSpeeds;

        if (problematicSegmentIndex !== -1) {
            // Invert the bouncing segment's direction and apply small speed change
            this.segmentSpeeds[problematicSegmentIndex] *= -1;
            this.applySpeedChangeOnBounce(problematicSegmentIndex);
        }

        this.updatePathGraphics();
        return deltaMs;
    }

    updateSegmentsSpeeds(deltaMs, speedsToUpdate) {
        // No longer continuously update speeds - they're now fixed and only change on bounce
        for (var segment = 0; segment < this.segments.length; segment++) {
            speedsToUpdate[segment] = this.segmentSpeeds[segment];
        }
    }

    updateSegmentsPosition(deltaMs, vertsToUpdate) {
        for (var segmentIndex = 0; segmentIndex < this.segments.length; segmentIndex++) {
            let delta   = this.segmentSpeeds[segmentIndex] * deltaMs;
            let isValid = this.updateSegmentVertsWithDelta(segmentIndex, delta, vertsToUpdate);
            if (!isValid) return segmentIndex;
        }
        return 666;
    }

    updatePathGraphics() {
        super.updatePathWithVertices(this.vertices);
    }

    // ── Segment vertex displacement ───────────────────────────────────────────

    updateSegmentVertsWithDelta(segment_index, delta, vertsToUpdate) {
        // A segment is a group of consecutive edges — the subset of the closed polygon
        // running clockwise from startNode to endNode — that all slide together along
        // one axis (X if affectY=0, Y if affectY=1).
        //
        // Only vertices that share an edge aligned with the movement axis actually move;
        // the two "hinge" vertices at the segment boundaries stay fixed.

        let segment = this.segments[segment_index];

        var startNode              = segment[0];
        var endNode                = segment[1];
        var affectYElseXDirection  = segment[2]; // 1 → move Y, 0 → move X

        // Walk clockwise from startNode to endNode, collecting all vertices.
        var nodes = [startNode];
        var nextNode = startNode;
        var j = 0;
        while (nextNode !== endNode && j < MAXIMUM_AMOUNT_OF_NODES) {
            nextNode = (nextNode + 1 >= this.vertices.length) ? 0 : nextNode + 1;
            j++;
            if (j === MAXIMUM_AMOUNT_OF_NODES) {
                console.log("ASSERT ERROR: too many nodes.");
            }
            nodes.push(nextNode);
        }

        // Determine whether the start and end hinge vertices are included in the slide.
        // A hinge is included only if the edge leaving it is aligned with the movement axis.
        var includeStartNode = false;
        var includeEndNode   = false;

        if (nodes.length === 2) {
            // Pure edge — neither endpoint moves; the edge itself shifts.
            includeStartNode = false;
            includeEndNode   = false;
        } else {
            // Start hinge: included if its outgoing edge is axis-aligned with movement.
            if (!affectYElseXDirection && this.vertices[nodes[0]][0] === this.vertices[nodes[1]][0]) {
                includeStartNode = true;
            } else if (affectYElseXDirection && this.vertices[nodes[0]][1] === this.vertices[nodes[1]][1]) {
                includeStartNode = true;
            } else {
                nodes.shift();
            }

            // End hinge: included if its incoming edge is axis-aligned with movement.
            const last = nodes.length - 1, prev = nodes.length - 2;
            if (!affectYElseXDirection && this.vertices[nodes[last]][0] === this.vertices[nodes[prev]][0]) {
                includeEndNode = true;
            } else if (affectYElseXDirection && this.vertices[nodes[last]][1] === this.vertices[nodes[prev]][1]) {
                includeEndNode = true;
            } else {
                nodes.pop();
            }
        }

        var isValid = true;

        // Apply delta to the sliding axis of each included vertex.
        for (var i = 0; i < nodes.length; i++) {
            vertsToUpdate[nodes[i]][affectYElseXDirection] += delta;
            if (!super.isWithinBoundary(vertsToUpdate[nodes[i]])) {
                isValid = false;
            }
        }

        // Check node-limit constraints for every vertex in the path.
        for (var node = 0; node < vertsToUpdate.length; node++) {
            if (!this.isWithinNodeLimits(node, this.vertices, vertsToUpdate)) {
                isValid = false;
            }
        }

        return isValid;
    }

    // ── Colour setters ────────────────────────────────────────────────────────

    setFillColor(color) {
        super.setFillColor(color);
        for (const rect of this.overlapIllusions) {
            rect.setFillColor(color);
        }
    }

    // ── Node-limit constraint check ───────────────────────────────────────────

    isWithinNodeLimits(node, oldVerts, newVerts) {
        // Each vertex can have a list of "limit" vertices it is not allowed to pass
        // in either X or Y.  Checked by detecting a sign change in the relative delta.
        for (var direction = 0; direction < 2; direction++) {
            for (var i = 0; i < this.nodeLimits[node][direction].length; i++) {
                var checkNode = this.nodeLimits[node][direction][i];
                if (Math.sign(oldVerts[node][direction] - oldVerts[checkNode][direction]) !==
                    Math.sign(newVerts[node][direction] - newVerts[checkNode][direction])) {
                    return false;
                }
            }
        }
        return true;
    }
}
