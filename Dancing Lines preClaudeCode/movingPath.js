var MAXIMUM_AMOUNT_OF_NODES = 1000;
class MovingPath extends Path {

    constructor(pathGeometry, animationProperties, svg) {
        super(pathGeometry.coords, svg, pathGeometry.pathProperties);

        this.animationProperties = animationProperties;
        this.pathProperties = pathGeometry.pathProperties;
        this.coords = pathGeometry.coords;
        this.segments = pathGeometry.segments;
        this.nodeLimits = pathGeometry.nodeLimits;
        this.overlapIllusionData = pathGeometry.overlapIllusionData;

        this.segmentSpeeds = [];
        for (var i = 0; i < this.segments.length; i++) {
            this.segmentSpeeds.push(0);
        }

        // fake overlap
        let RECT_SCALE = this.pathProperties.PATH_SCALE;
        let RECT_OFFSET_X = this.pathProperties.PATH_OFFSET_X;
        let RECT_OFFSET_Y = this.pathProperties.PATH_OFFSET_Y;
        let RECT_STROKE_COLOUR = this.pathProperties.STROKE_COLOUR;
        let RECT_FILL_COLOUR = this.pathProperties.FILL_COLOUR;
        let RECT_MAX_X = this.pathProperties.MAX_X;
        let RECT_MIN_X = this.pathProperties.MIN_X;
        let RECT_MAX_Y = this.pathProperties.MAX_Y;
        let RECT_MIN_Y = this.pathProperties.MIN_Y;

        this.rectProperties = { RECT_SCALE, RECT_OFFSET_X, RECT_OFFSET_Y, RECT_STROKE_COLOUR, RECT_FILL_COLOUR, RECT_MAX_X, RECT_MIN_X, RECT_MAX_Y, RECT_MIN_Y }; //easy way to initialize an associative array! 

        this.overlapIllusions = [];
        for (var overlapIndex = 0; overlapIndex < this.overlapIllusionData.length; overlapIndex++) {
            this.overlapIllusions.push(new Rect([[0.3, 0.4], [1, 1]], this.svg, this.rectProperties));
        }
        this.updateOverlaps();
        this.accelerations = [];
        for (var i = 0; i < this.segments.length; i++) {
            this.accelerations.push(0);
        }
    }

    //-------------------------ACTIONS ----------------
    // moveSegmentByDelta(segment, delta) {
    //     // deprecated
    //     var segment = 0;
    //     this.moveSegmentWithBounceback(segment, delta);
    //     this.updatePathWithCoords(this.coords);
    // }

    updateOverlaps() {
        //let mask move at desired position
        let coords = this.getPathCoords();
        let strokeWidthCompensation = this.pathProperties.STROKE_WIDTH / 2;
        let ul;
        let lr;
        for (var overlapIndex = 0; overlapIndex < this.overlapIllusionData.length; overlapIndex++) {
            let overlap = this.overlapIllusions[overlapIndex];

            // no clue what the vertical vs horizontal is supposed to mean. 
            // if (this.overlapIllusionData[overlapIndex].isverticalOverlapLapVisibleElseHorizontal) {
            ul = [
                coords[this.overlapIllusionData[overlapIndex].upperLeftNode][0] + strokeWidthCompensation,
                coords[this.overlapIllusionData[overlapIndex].upperLeftNode][1] + strokeWidthCompensation
            ];
            lr = [
                coords[this.overlapIllusionData[overlapIndex].lowerRightNode][0] - strokeWidthCompensation,
                coords[this.overlapIllusionData[overlapIndex].lowerRightNode][1] - strokeWidthCompensation
            ];
            // } else {
            //     // ul = [coords[4][0] + strokeWidthCompensation, coords[4][1] + strokeWidthCompensation];
            //     // lr = [coords[6][0] - strokeWidthCompensation, coords[6][1] - strokeWidthCompensation];
            //     console.log(this.overlapIllusionData[overlapIndex].upperLeftNode);

            //     ul = [
            //         coords[this.overlapIllusionData[overlapIndex].upperLeftNode][0] + strokeWidthCompensation,
            //         coords[this.overlapIllusionData[overlapIndex].upperLeftNode][1] + strokeWidthCompensation
            //     ];
            //     lr = [
            //         coords[this.overlapIllusionData[overlapIndex].lowerRightNode][0] - strokeWidthCompensation,
            //         coords[this.overlapIllusionData[overlapIndex].lowerRightNode][1] - strokeWidthCompensation
            //     ];
            // }

            overlap.updateRectWithCoords([ul, lr]);

        }
        // if (this.rectProperties.MASK_IS_VERTICAL) {
        // 	ul = [coords[0][0] + strokeWidthCompensation, coords[0][1] + strokeWidthCompensation];
        // 	lr = [coords[2][0] - strokeWidthCompensation, coords[2][1] - strokeWidthCompensation];
        // } else {
        // 	ul = [coords[4][0] + strokeWidthCompensation, coords[4][1] + strokeWidthCompensation];
        // 	lr = [coords[6][0] - strokeWidthCompensation, coords[6][1] - strokeWidthCompensation];

        // }
        // this.mask.updateRectWithCoords([ul, lr]);


    }

    resetAccelerations() {
        for (var i = 0; i < this.segments.length; i++) {
            this.accelerations[i] = 0;

        }
    }

    randomAccelerationsUpdate(probability) {
        // probability = integer. bigger number = lower chance that acceleration will change, for each segment separately. 
        // 0 = always update
        // 1000000000000000 = updates like... never...
        for (var i = 0; i < this.segments.length; i++) {
            let randomInt = Math.floor(Math.random() * probability);
            if (randomInt == 0) {
                // console.log("acceleration update")
                let negativeOrPositive = (Math.random() * 2 - 1);
                var acc = negativeOrPositive * this.animationProperties.ACCELERATION_MULTIPLIER; //float between -1 and + 1
                this.accelerations[i] = acc;
            }
        }
    }

    randomSegmentChange() {
        // deprecated
        var randomSegment = Math.floor(Math.random() * this.segments.length);
        var randomDelta = Math.random() * 2 - 1; //float between -1 and + 1
        this.moveSegmentByDelta(randomSegment, randomDelta);
    }

    //-------------------------UPDATES--------

    segmentsPositionUpdate(deltaMs) {
        // assume things are valid, until they're not. 
        // if not valid, the updateDeltams will be divided by two until valid, the acceleration sign of the violating segment reversed, and the new deltaMs returned.  


        let isValid = false;
        let problematicSegmentIndex = -1;

        while (!isValid) {
            var updatedCoords = JSON.parse(JSON.stringify(this.coords)); //deepcopy of array with objects.
            var updatedSpeeds = JSON.parse(JSON.stringify(this.segmentSpeeds)); //deepcopy of array with objects.
            this.updateSegmentsSpeeds(deltaMs, updatedSpeeds);
            let returnNumber = this.updateSegmentsPosition(deltaMs, updatedCoords);
            if (returnNumber != 666) {
                // there was a problem. A boundary was crossed by a segment. We'll redo all calculations but for a smaller delta. Until it works! 
                // apply smaller delta to try again 
                deltaMs = deltaMs / 2;
                problematicSegmentIndex = returnNumber; // take note of the segment that caused the problem, its speed will need to be inverted for the next updatecycle.
            } else {
                isValid = true;
            }
        }

        // commit updated data
        this.coords = updatedCoords;
        this.segmentSpeeds = updatedSpeeds;

        if (problematicSegmentIndex != -1) {
            // invert direction of problematic segment, it bounced...
            this.segmentSpeeds[problematicSegmentIndex] *= -1;
        }

        this.updatePathGraphics();
        // console.log(deltaMs);

        return deltaMs;
    }

    updateSegmentsSpeeds(deltaMs, speedsToUpdate) {
        //update all segment speed
        for (var segment = 0; segment < this.segments.length; segment++) {
            speedsToUpdate[segment] = this.segmentSpeeds[segment] + this.accelerations[segment] * deltaMs / 1000; //speed in unity-units per second  //
        }
    }

    updateSegmentsPosition(deltaMs, coordsToUpdate) {
        //update all segments

        for (var segmentIndex = 0; segmentIndex < this.segments.length; segmentIndex++) {
            let delta = this.segmentSpeeds[segmentIndex] * deltaMs;
            // this.moveSegmentWithBounceback(segmentIndex, delta, coordsToUpdate);
            let isValid = this.updateSegmentCoordsWithDelta(segmentIndex, delta, coordsToUpdate);
            if (!isValid) {
                // take note of fault segment. 
                // console.log("Boundary passed at segment: " + (segmentIndex + 1));

                return segmentIndex;
            }
        }
        return 666;
    }

    updatePathGraphics() {
        super.updatePathWithCoords(this.coords);
    }

    //--------------------------------------------

    updateSegmentCoordsWithDelta(segment_index, delta, coordsToUpdate) {

        let segment = this.segments[segment_index];
        // When the path is created (always a string of nodes, closed loop) segments are also defined.
        // A segment contains all nodes between a given start and end node (defined in the segment). all node coordinates of a segment are affected. 
        //  a segment can roll over from last node to first node. 

        //the path is a closed, so, there are two sequences of nodes between any two points. For each segment, there are two paths. Depending on the chosen path, the X OR Y coordinate can be adjusted.

        //segment = number as defined in the path data.
        //direction always clockwise.
        //delta = change of coordinate.
        //bounceBackAtLimits (bool)  if a limit is hit, the speed is inverted.  -->DISABLED: will only neutralize if invalid. needs to be sorted out higher level. because, when bouncing back, all needs to be checked again(i.e. not running into other border, or other segments).

        //get all the nodes.
        var startNode = segment[0];
        var endNode = segment[1];
        var affectYElseXDirection = segment[2]; // if 1 : y coords will be affected, if 0 x coords will be affected,

        var nodes = [startNode];

        //get all nodes that are in the segment.
        var j = 0;
        var nextNode = startNode;
        while (nextNode != endNode || j > MAXIMUM_AMOUNT_OF_NODES) {
            nextNode += 1;
            j++;
            if (j == MAXIMUM_AMOUNT_OF_NODES) {
                console.log("ASSERT ERROR: too many nodes. ");
            }
            if (nextNode >= this.coords.length) {
                nextNode = 0;
            }
            nodes.push(nextNode);
        }


        var includeStartNode = false; // does fist node move along or not?
        var includeEndNode = false;

        //figure out if edge (else segment).
        if (nodes.length == 2 && nodes[1] == endNode) {
            includeStartNode = false;
            includeEndNode = false;
            //console.log("edge");
        } else {

            //orientation will define if start and / or endnode are included in the movement.
            //start node
            if (this.coords[nodes[0]][0] == this.coords[nodes[1]][0] && !affectYElseXDirection) {
                includeStartNode = true;
            } else if (this.coords[nodes[0]][1] == this.coords[nodes[1]][1] && affectYElseXDirection) {
                includeStartNode = true;
            } else {
                nodes.shift(); // take out first node
                includeStartNode = false;
            }

            //end node
            // if end node x coord == second to end node x  and  NOT affectYElseXDirection: includeEnd note
            // if end node y coord == second to end node y  and  affectYElseXDirection: includeEnd note
            // else , do not include end node
            if (this.coords[nodes[nodes.length - 1]][0] == this.coords[nodes[nodes.length - 2]][0] && !affectYElseXDirection) {
                includeEndNode = true;

            } else if (this.coords[nodes[nodes.length - 1]][1] == this.coords[nodes[nodes.length - 2]][1] && affectYElseXDirection) {
                includeEndNode = true;
            } else {
                nodes.pop(); // take out last node
                includeEndNode = false;
            }
        }

        // var oldCoords = JSON.parse(JSON.stringify(this.coords)); //deepcopy of array with objects.

        var isValid = true;
        for (var i = 0; i < nodes.length; i++) {
            coordsToUpdate[nodes[i]][affectYElseXDirection] += delta;

            // check for boundary validity
            if (!super.isWithinBoundary(coordsToUpdate[nodes[i]])) {
                isValid = false;
            }
        }
        for (var node = 0; node < coordsToUpdate.length; node++) {
            // //check for user defined node validity.
            let coordsBeforeDelta = this.coords;
            if (!this.isWithinNodeLimits(node, coordsBeforeDelta, coordsToUpdate)) {
                isValid = false;
            }
        }


        // --> no need to undo here.
        // //if movement not valid, revert the delta for all nodes
        // if (!valid) {
        //     for (var i = 0; i < nodes.length; i++) {
        //         this.coords[nodes[i]][affectYElseXDirection] -= delta;

        //     }
        // }
        // return valid;
        return isValid;
    }

    // moveSegmentWithBounceback(segment, delta) {
    //     var isValid = this.updateSegmentCoordsWithDelta(segment, delta);

    //     // if (!isValid) {

    //     //     // bounce 
    //     //     this.segmentSpeeds[segment] = -this.segmentSpeeds[segment];
    //     //     //try to apply the new coords. If again a violation (i.e. too fast bounceback and segment runs into other segment) divide the speed by two and try again.
    //     //     while (!isValid && Math.abs(this.segmentSpeeds[segment]) >= 0.01) {
    //     //         // console.log(segmentSpeeds[segment]);
    //     //         this.segmentSpeeds[segment] = this.segmentSpeeds[segment] / this.animationProperties.HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA;
    //     //         console.log(segment);
    //     //         isValid = this.updateSegmentCoordsWithDelta(segment, this.segmentSpeeds[segment]);
    //     //     }
    //     // }
    //     return isValid
    // }

    isWithinNodeLimits(node, oldCoords, newCoords) {

        // for every node, there is the possibility to provide nodes that cannot be passed in x or y direction. 
        // check for x and y
        for (var direction = 0; direction < 2; direction++) { // direction: 0 = x, y = 1
            for (var i = 0; i < this.nodeLimits[node][direction].length; i++) {
                // it's perfectly possible that there is no limit assigned. The node is then free to move unconstrained.
                //data from coord to check
                var checkNode = this.nodeLimits[node][direction][i];

                if (Math.sign(oldCoords[node][direction] - oldCoords[checkNode][direction]) != Math.sign(newCoords[node][direction] - newCoords[checkNode][direction])) {
                    // Math.sign returns  1 if pos, -1 if neg, 0 if zero.
                    return false;
                }
            }
        }
        return true;
    }
}
