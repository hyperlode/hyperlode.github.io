
class Path {

	constructor(coords, svg, properties) {

		//properties: associative array with all the path properties.

		this.properties = properties
		this.svg = svg;
		this.coords = coords;
        // console.log(this.coords);
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
		this.svgElementPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
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
			return false;
		} else if (coord[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y > this.properties.MAX_Y) {
			return false;
		} else if (coord[0] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_X < this.properties.MIN_X) {
			return false;
		} else if (coord[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y < this.properties.MIN_Y) {
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
