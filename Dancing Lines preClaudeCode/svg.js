
class Rect {
	constructor(coords, svg, properties) {
		//coords should be : [[ulx,uly],[lrx,lry]]   u = upper, l = lower, r = right, l=left.
		this.svg = svg;
		this.properties = properties;
		this.coords = coords;
		this.getRectDataFromCoords();
		this.createSvgRect();
	}

	getRectDataFromCoords() {

		this.rectData = { "width": 0, "height": 0, "offset_x": 0, "offset_y": 0 };

		this.rectData.width = this.coords[1][0] - this.coords[0][0];
		this.rectData.height = this.coords[1][1] - this.coords[0][1];
		this.rectData.offset_x = this.coords[0][0];
		this.rectData.offset_y = this.coords[0][1];

		if (this.rectData.width < 0) {
			console.log("ASSERT ERROR: invalid rect data: width " + this.rectData.width);
		}
		if (this.rectData.height < 0) {
			console.log("ASSERT ERROR: invalid rect data: heigth" + this.rectData.heigth);
		}
		// if (this.rectData.offset_x < 0){
		// console.log("ASSERT ERROR: invalid rect data: offset_x" + this.rectData.offset_x);
		// }
		// if (this.rectData.offset_y < 0 ){
		// console.log("ASSERT ERROR: invalid rect data: offset_y " + this.rectData.offset_y);
		// }
	}

	createSvgRect() {
		this.svgElementRect = document.createElementNS(document.rootElement.namespaceURI, "rect");
		this.svgElementRect.setAttribute("id", "mask");
		this.svgElementRect.setAttribute("width", this.rectData.width);
		this.svgElementRect.setAttribute("height", this.rectData.height);
		this.svgElementRect.setAttribute("stroke", this.properties.STROKE_COLOUR);
		this.svgElementRect.setAttribute("stroke-width", "0");
		this.svgElementRect.setAttribute("opacity", 1);
		this.svgElementRect.setAttribute("fill", this.properties.FILL_COLOUR);
		this.svgElementRect.setAttribute("transform", " translate(" + (this.properties.RECT_SCALE * this.rectData.offset_x + this.properties.RECT_OFFSET_X) + " " + (this.properties.RECT_SCALE * this.rectData.offset_y + this.properties.RECT_OFFSET_Y) + ") scale(" + this.properties.RECT_SCALE + " " + this.properties.RECT_SCALE + ")");
		this.svg.appendChild(this.svgElementRect);
	}

	updateRectWithCoords(coords) {
		this.coords = coords;
		this.getRectDataFromCoords();

		this.svgElementRect.setAttribute("width", this.rectData.width);
		this.svgElementRect.setAttribute("height", this.rectData.height);
		this.svgElementRect.setAttribute("transform", " translate(" + (this.properties.RECT_SCALE * this.rectData.offset_x + this.properties.RECT_OFFSET_X) + " " + (this.properties.RECT_SCALE * this.rectData.offset_y + this.properties.RECT_OFFSET_Y) + ") scale(" + this.properties.RECT_SCALE + " " + this.properties.RECT_SCALE + ")");
	}
}

class Path {

	constructor(coords, svg, properties) {

		//properties: associative array with all the path properties.

		this.properties = properties
		this.svg = svg;
		this.coords = coords;
		this.pathString = this.closedPathStringFromCoords();
		this.createSvgPath();
	}

	closedPathStringFromCoords() {
		//converts double array with x, y coords. to closed path string of the type "M150 0 L75 200 L225 200 Z" 
		var str = '';
		var i;
		for (i = 0; i < this.coords.length; i++) {
			if (i != 0) {
				str += "L ";
			} else {
				str += "M ";
			}
			str += this.coords[i][0] + " " + this.coords[i][1];
			str += " ";
		}
		str += "Z";
		return str;
	}

	createSvgPath() {
		this.svgElementPath = document.createElementNS(document.rootElement.namespaceURI, "path");
		this.svgElementPath.setAttribute("id", "lode");
		this.svgElementPath.setAttribute("d", this.pathString);
		this.svgElementPath.setAttribute("stroke", this.properties.STROKE_COLOUR);
		this.svgElementPath.setAttribute("stroke-width", this.properties.STROKE_WIDTH);
		this.svgElementPath.setAttribute("opacity", 1);
		this.svgElementPath.setAttribute("fill", this.properties.FILL_COLOUR);
		this.svgElementPath.setAttribute("transform", " translate(" + this.properties.PATH_OFFSET_X + " " + this.properties.PATH_OFFSET_Y + ") scale(" + this.properties.PATH_SCALE + " " + this.properties.PATH_SCALE + ")");
		this.svg.appendChild(this.svgElementPath);
	}

	pathStringToCoords(pathString) {
		//convert typical closed path to its point coordinates. MUST BE OF THE TYPE: "M 150 0 L 75 200 L 225 200 Z" 
		//converts to double array with x, y coords.

		var coords = [];
		//console.log(pathString);
		coordsHalfSplit = pathString.split("L");

		for (var i = 0; i < coordsHalfSplit.length; i++) {
			var pureCoords;
			if (i == 0) {
				//first coord
				pureCoords = coordsHalfSplit[i].substring(2, coordsHalfSplit[i].length - 1);
			} else if (i == coordsHalfSplit.length - 1) {
				//last coord
				pureCoords = coordsHalfSplit[i].substring(1, coordsHalfSplit[i].length - 2);
			} else {
				//normal coord )
				pureCoords = coordsHalfSplit[i].substring(1, coordsHalfSplit[i].length - 1);
			}
			var coordAsStrings = pureCoords.split(" ");
			var coord = [];
			for (var j = 0; j < coordAsStrings.length; j++) {
				coord.push(parseFloat(coordAsStrings[j]));
			}
			coords.push(coord);
		}
		return coords;
	}

	updatePathWithCoords(coords) {

		this.coords = coords;
		this.pathString = this.closedPathStringFromCoords();
		this.svgElementPath.setAttribute("d", this.pathString);
	}

	getPathCoords() {
		//var pathString = pathObj.getAttribute("d");
		//return pathStringToCoords(pathString);
		return this.coords;
	}

	isWithinBoundary(coord) {
		//coord = [X,Y] 
		if (coord[0] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_X > this.properties.MAX_X) {
			//console.log(coord[0]*PATH_SCALE);
			return false;
		} else if (coord[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y > this.properties.MAX_Y) {
			//console.log(coord[1]*PATH_SCALE  );	
			return false;
		} else if (coord[0] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_X < this.properties.MIN_X) {
			//console.log(coord);
			////console.log(PATH_SCALE);
			//console.log(coord[0]*PATH_SCALE  );
			return false;
		} else if (coord[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y < this.properties.MIN_Y) {
			//console.log(coord[1]*PATH_SCALE  );
			return false;
		} else {
			return true;
		}
	}

	// changeNodeCoords(coords, startNode, numberOfNodes, direction, delta ){
	// //StartNode = coord number
	// //number of nodes = affected coords starting from StartNode
	// //direction = "x" or "y"

	// var dir;
	// if (direction == "x"){
	// dir =0;
	// }else if (direction == "y"){
	// dir = 1;
	// }else{
	// console.log("not a valid direction");
	// return;
	// }

	// //check if not too many nodes.
	// if (startNode + numberOfNodes > coords.length){
	// console.log("ASSERT ERROR too many nodes error");
	// return ;
	// }
	// if (startNode <0 || numberOfNodes <0){
	// console.log("ASSERT ERROR negative number of nodes affected.");
	// return;
	// }

	// for (var i = 0;i<numberOfNodes;i++){
	// coords[startNode + i][dir] += delta;
	// }
	// return coords;
	// }
}

class MovingPath extends Path {

	constructor(coords, segments, nodeLimits, animationProperties, svg, pathProperties) {
		super(coords, svg, pathProperties);

		this.animationProperties = animationProperties;
		this.coords = coords;
		this.segments = segments;
		this.nodeLimits = nodeLimits;

		this.segmentSpeeds = [];
		for (var i = 0; i < segments.length; i++) {
			this.segmentSpeeds.push(0);
		}
	}

	//-------------------------ACTIONS ----------------
	moveSegmentByDelta(segment, delta) {
		var segment = 0;
		this.moveSegmentWithBounceback(segment, delta);
		this.updatePathWithCoords(this.coords);
	}

	randomAccelerationsUpdate() {

		this.accelerations = [];
		for (var i = 0; i < this.segments.length; i++) {
			var acc = (Math.random() * 2 - 1) * this.animationProperties.ACCELERATION_MULTIPLIER; //float between -1 and + 1
			this.accelerations.push(acc);
		}
		this.segmentsUpdate(this.accelerations);
	}

	randomSegmentChange() {
		var randomSegment = Math.floor(Math.random() * this.segments.length);
		var randomDelta = Math.random() * 2 - 1; //float between -1 and + 1
		this.moveSegmentByDelta(randomSegment, randomDelta);
	}

	//-------------------------UPDATES--------

	segmentsUpdate(accelerations) {
		this.updateSegmentsSpeeds(accelerations);
		this.updateSegmentsPosition();
		this.updatePathGraphics();
	}

	updateSegmentsSpeeds(accelerations) {
		//update all segments
		for (var segment = 0; segment < this.segments.length; segment++) {
			this.segmentSpeeds[segment] += accelerations[segment] * this.animationProperties.LOOP_PERIOD_MS / 1000; //speed in unity-units per second  //- FRICTION_DECELERATION * this.animationProperties.LOOP_PERIOD_MS/1000
		}
	}

	updateSegmentsPosition() {
		//update all segments
		for (var segment = 0; segment < this.segments.length; segment++) {
			this.moveSegmentWithBounceback(segment, this.segmentSpeeds[segment] * this.animationProperties.LOOP_PERIOD_MS / 1000);
		}
	}

	updatePathGraphics() {
		super.updatePathWithCoords(this.coords);
	}

	//--------------------------------------------

	moveSegment(segment, delta) {
		//a segment is defined by the path creator. it contains all nodes between a given start and end node (defined in the segment). all node coordinates of a segment are affected. 
		//the path is a closed, so, there are two sequences of nodes between any two points. For each segment, there are two paths. Depending on the chosen path, the X OR Y coordinate can be adjusted.

		//segment = number as defined in the path data.
		//direction always clockwise.
		//delta = change of coordinate.
		//bounceBackAtLimits (bool)  if a limit is hit, the speed is inverted.  -->DISABLED: will only neutralize if invalid. needs to be sorted out higher level. because, when bouncing back, all needs to be checked again(i.e. not running into other border, or other segments).

		//get all the nodes.
		var startNode = this.segments[segment][0];
		var endNode = this.segments[segment][1];
		var nodes = [startNode];

		//get all nodes that are affected.
		var j = 0;
		var nextNode = startNode;
		while (nextNode != endNode || j > 20) {
			nextNode += 1;
			j++;
			if (nextNode >= this.coords.length) {
				nextNode = 0;
			}
			nodes.push(nextNode);
		}

		var orientation = this.segments[segment][2];
		var includeStartNode = false;
		var includeEndNode = false;

		//figure out if edge (else segment).
		if (nodes.length == 2 && nodes[1] == endNode) {
			//moveEdge(coords, startNode, delta);
			//return [coords, true];
		} else {

			//orientation will define if start and / or endnode are included in the movement.
			//start node
			if (this.coords[nodes[0]][0] == this.coords[nodes[1]][0] && !orientation) {
				includeStartNode = true;
			} else if (this.coords[nodes[0]][1] == this.coords[nodes[1]][1] && orientation) {
				includeStartNode = true;
			} else {
				nodes.shift();
				includeStartNode = false;
			}
			//end node
			if (this.coords[nodes[nodes.length - 1]][0] == this.coords[nodes[nodes.length - 2]][0] && !orientation) {
				includeEndNode = true;

			} else if (this.coords[nodes[nodes.length - 1]][1] == this.coords[nodes[nodes.length - 2]][1] && orientation) {
				includeEndNode = true;
			} else {
				nodes.pop();
				includeEndNode = false;
			}
		}

		var oldCoords = JSON.parse(JSON.stringify(this.coords)); //deepcopy of array with objects.

		var valid = true;
		for (var i = 0; i < nodes.length; i++) {

			this.coords[nodes[i]][orientation] += delta;

			// check for boundary validity
			if (!super.isWithinBoundary(this.coords[nodes[i]])) {
				valid = false;
			}
		}

		// var test2 = test.slice(); //how to deepcopy array javascript with values

		for (var node = 0; node < this.coords.length; node++) {
			// //check for user defined node validity.
			if (!this.isWithinNodeLimits(node, oldCoords, this.coords)) {
				valid = false;
			}
		}

		//if movement not valid, revert.
		if (!valid) {
			// console.log("not valid");
			for (var i = 0; i < nodes.length; i++) {
				this.coords[nodes[i]][orientation] -= delta;

			}
		}
		return valid;
	}

	moveSegmentWithBounceback(segment, delta) {
		var feedback = this.moveSegment(segment, delta);

		if (!feedback) {
			this.segmentSpeeds[segment] = -this.segmentSpeeds[segment];
			//try to apply the new coords. If again a violation (i.e. too fast bounceback and segment runs into other segment) divide the speed by two and try again.
			while (!feedback && Math.abs(this.segmentSpeeds[segment]) >= 0.01) {
				// console.log(segmentSpeeds[segment]);
				this.segmentSpeeds[segment] = this.segmentSpeeds[segment] / this.animationProperties.HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA;
				feedback = this.moveSegment(segment, this.segmentSpeeds[segment]);
			}
		}
		//return feedback.coords;
	}

	isWithinNodeLimits(node, oldCoords, newCoords) {
		// check for x and y
		for (var direction = 0; direction < 2; direction++) {
			for (var i = 0; i < this.nodeLimits[node][direction].length; i++) {
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

class Dance {
	constructor(danceProperties) {

		this.iteration = 0;


		let MASK_IS_VERTICAL = danceProperties.MASK_IS_VERTICAL;

		//path properaties
		let STROKE_WIDTH = 0.05;
		let PATH_SCALE = danceProperties.SCALE; //200;

		let PATH_OFFSET_X = danceProperties.OFFSET_X;//200
		let PATH_OFFSET_Y = danceProperties.OFFSET_Y;//200
		let MAX_X = 1000;
		let MIN_X = 0;
		let MAX_Y = 1000;
		let MIN_Y = 0;
		let STROKE_COLOUR = danceProperties.STROKE_COLOUR; //"black"
		let FILL_COLOUR = danceProperties.FILL_COLOUR; //"white";

		this.pathProperties = { PATH_SCALE, PATH_OFFSET_X, PATH_OFFSET_Y, STROKE_WIDTH, STROKE_COLOUR, FILL_COLOUR, MAX_X, MIN_X, MAX_Y, MIN_Y }; //easy way to initialize an associative array! 
		console.log(this.pathProperties);

		//mask properties
		let RECT_SCALE = PATH_SCALE;
		let RECT_OFFSET_X = PATH_OFFSET_X;
		let RECT_OFFSET_Y = PATH_OFFSET_Y;

		this.rectProperties = { RECT_SCALE, RECT_OFFSET_X, RECT_OFFSET_Y, STROKE_COLOUR, FILL_COLOUR, MAX_X, MIN_X, MAX_Y, MIN_Y, MASK_IS_VERTICAL }; //easy way to initialize an associative array! 

		//animation properties
		let LOOP_PERIOD_MS = 10;
		let ACCELERATION_MULTIPLIER = danceProperties.ACCELERATION_MULTIPLIER; //0.03;//0.03 default
		// let FRICTION_DECELERATION = 0.01 ;//speeds slow down naturally.
		let HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA = 2;
		this.animationProperties = { LOOP_PERIOD_MS, ACCELERATION_MULTIPLIER, HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA }

		this.init();
	}

	init() {

		let svg = document.rootElement;//var svg = document.querySelector('svg');
		this.initBasePath(this.animationProperties, svg, this.pathProperties);
		this.mask = new Rect([[0.3, 0.4], [1, 1]], svg, this.rectProperties);

		// initSmallPath(animationProperties, svg, pathProperties);

		this.animate();
	}

	animate() {

		//create base path
		this.basePath.randomAccelerationsUpdate();

		//let mask move at desired position
		let coords = this.basePath.getPathCoords();
		let strokeWidthCompensation = this.pathProperties.STROKE_WIDTH / 2;
		let ul;
		let lr;
		if (this.rectProperties.MASK_IS_VERTICAL) {
			ul = [coords[0][0] + strokeWidthCompensation, coords[0][1] + strokeWidthCompensation];
			lr = [coords[2][0] - strokeWidthCompensation, coords[2][1] - strokeWidthCompensation];
		} else {
			ul = [coords[4][0] + strokeWidthCompensation, coords[4][1] + strokeWidthCompensation];
			lr = [coords[6][0] - strokeWidthCompensation, coords[6][1] - strokeWidthCompensation];

		}
		this.mask.updateRectWithCoords([ul, lr]);

		this.iteration++;
		//if (iteration <3){
		window.setTimeout(function () { this.animate(); }.bind(this), this.animationProperties.LOOP_PERIOD_MS);
		//}
	}

	initBasePath(animationProperties, svg, pathProperties) {

		//specific path info
		//define paths always clockwise.
		let coords = [[2, 0], [3, 0], [3, 4], [0, 4], [0, 1], [4, 1], [4, 2], [1, 2], [1, 3], [2, 3]];
		let segments = [[9, 2, 1], [9, 2, 0], [4, 7, 0], [4, 7, 1], [3, 8, 0], [3, 8, 1], [2, 9, 1], [2, 9, 0]];
		let nodeLimits = [
			[[8], [9]],
			[[], []],
			[[], []],
			[[], []],
			[[], []],
			[[], []],
			[[7], [8]],
			[[], []],
			[[], []],
			[[], []]
		]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]

		this.basePath = new MovingPath(coords, segments, nodeLimits, animationProperties, svg, pathProperties);
	}
}

function init_path(evt) {
	//https://stackoverflow.com/questions/10546135/appending-path-child-within-svg-using-javascript
	//d = new Dance({MASK_IS_VERTICAL:true, SCALE:10, OFFSET_X:100, OFFSET_Y:100, STROKE_COLOUR:"black", FILL_COLOUR:"white"});
	//e = new Dance({MASK_IS_VERTICAL:true, SCALE:10, OFFSET_X:200, OFFSET_Y:200, STROKE_COLOUR:"red", FILL_COLOUR:"red"});

	testDance();
	// singleDance();
	//danceWorld();
}

function testDance() {
//specific path info
	//define paths always clockwise.
	let coords = [[2, 0], [3, 0], [3, 4], [2, 4]]; // nodes with their x-y coord (node0, ....)
	let segments = []; // [node_start, node_stop, direction (1=vertical , 0=horizontal (or is it clockwise vs ccw?)]  will move all inbetween nodes 
	let nodeLimits = [
		[[], []],
		[[], []],
		[[], []],
		[[], []]
	]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]


	this.animationProperties = { LOOP_PERIOD_MS, ACCELERATION_MULTIPLIER, HACK_SPEED_DIVISOR_IF_ILLEGAL_DELTA };

	let dance = new MovingPath(coords, segments, nodeLimits, animationProperties, svg, pathProperties);

}

function singleDance() {
	classic = new Dance({ MASK_IS_VERTICAL: true, SCALE: 200, OFFSET_X: 200, OFFSET_Y: 200, STROKE_COLOUR: "black", FILL_COLOUR: "white", ACCELERATION_MULTIPLIER: "0.3" });


	//specific path info
	//define paths always clockwise.
	let coords = [[2, 0], [3, 0], [3, 4], [0, 4], [0, 1], [4, 1], [4, 2], [1, 2], [1, 3], [2, 3]]; // nodes with their x-y coord (node0, ....)
	let segments = [[9, 2, 1], [9, 2, 0], [4, 7, 0], [4, 7, 1], [3, 8, 0], [3, 8, 1], [2, 9, 1], [2, 9, 0]]; // [node_start, node_stop, direction (1=vertical , 0=horizontal (movement of the start and stop node)]  will move all inbetween nodes 
	let nodeLimits = [
		[[8], [9]],
		[[], []],
		[[], []],
		[[], []],
		[[], []],
		[[], []],
		[[7], [8]],
		[[], []],
		[[], []],
		[[], []]
	]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]

	let dance = new MovingPath(coords, segments, nodeLimits, animationProperties, svg, pathProperties);

}

function danceWorld() {

	let MAX_OFFSET = 100;
	let MAX_SCALE = 100;

	let SCALE = 1;

	let numberOfDances = 1000;
	for (let i = 0; i < numberOfDances; i++) {
		let OFFSET_X = (Math.random() * MAX_OFFSET - 1);
		let OFFSET_Y = (Math.random() * MAX_OFFSET - 1);
		//let SCALE = ( Math.random()*MAX_SCALE - 1);
		// let SCALE = ( MAX_SCALE);
		SCALE += MAX_SCALE / numberOfDances;
		new Dance({ MASK_IS_VERTICAL: true, SCALE, OFFSET_X, OFFSET_Y, STROKE_COLOUR: "black", FILL_COLOUR: "white", ACCELERATION_MULTIPLIER: SCALE / 100 });
	}


}

// function initSmallPath(animationProperties, svg, pathProperties){
// let coords = [[1,1], [3, 1], [3, 2.5], [2, 2.5], [2, 2], [1, 2]];
// // let segments = [[2,3,1],[0,5,0]];
// let segments = [[2,3,1]];
// let nodeLimits = [
// [[4],[]],
// [[],[]],
// [[],[]],
// [[],[4]],
// [[],[]],
// [[],[]]
// ]; //each node has for every orientation limit nodes (coordinate cant be passing the speific orientation [  ..., <node>[[<nodes in x direction not to be crossed>],[<nodes in y direction not to be crossed>]],....]
// let dance = new MovingPath (coords, segments, nodeLimits, animationProperties, svg, pathProperties);
//}

function circle_click(evt) {
	var circle = evt.target;
	var currentRadius = circle.getAttribute("r");

	if (currentRadius == 100) {
		circle.setAttribute("r", currentRadius * 2);
	} else {
		circle.setAttribute("r", currentRadius * 0.5);
	}
}

function make_shape(evt) {
	var svg = document.rootElement;//var svg = document.querySelector('svg');
	var shape = document.createElementNS(document.rootElement.namespaceURI, "circle");			//var shape = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

	shape.setAttribute("cx", 25);
	shape.setAttribute("cy", 25);
	shape.setAttribute("r", 20);
	shape.setAttribute("style", "fill: green");

	svg.appendChild(shape);

}