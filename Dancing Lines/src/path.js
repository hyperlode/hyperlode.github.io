
class Path {

	constructor(vertices, svg, properties) {

		this.properties = properties;
		this.svg = svg;
		this.vertices = vertices;
		this.pathString = this.closedPathStringFromVertices();
		this.createSvgPath();
	}

	closedPathStringFromVertices() {
		// Converts [[x,y], ...] vertex list to a closed SVG path string: "M x y L x y ... Z"
		var str = '';
		for (var i = 0; i < this.vertices.length; i++) {
			str += (i === 0 ? 'M ' : 'L ');
			str += this.vertices[i][0] + ' ' + this.vertices[i][1] + ' ';
		}
		return str + 'Z';
	}

	createSvgPath() {
		this.svgElementPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.svgElementPath.setAttribute("id", "lode");
		this.svgElementPath.setAttribute("d", this.pathString);
		this.svgElementPath.setAttribute("stroke", this.properties.STROKE_COLOUR);
		this.svgElementPath.setAttribute("stroke-width", this.properties.STROKE_WIDTH);
		this.svgElementPath.setAttribute("opacity", 1);
		this.svgElementPath.setAttribute("fill", this.properties.FILL_COLOUR);
		this.svgElementPath.setAttribute("fill-rule", this.properties.FILL_RULE || 'evenodd');
		this.svgElementPath.setAttribute("transform", " translate(" + this.properties.PATH_OFFSET_X + " " + this.properties.PATH_OFFSET_Y + ") scale(" + this.properties.PATH_SCALE + " " + this.properties.PATH_SCALE + ")");
		this.svg.appendChild(this.svgElementPath);
	}

	updatePathWithVertices(vertices) {
		this.vertices = vertices;
		this.pathString = this.closedPathStringFromVertices();
		this.svgElementPath.setAttribute("d", this.pathString);
	}

	getPathVertices() {
		return this.vertices;
	}

	setStrokeColor(color) {
		this.properties.STROKE_COLOUR = color;
		this.svgElementPath.setAttribute("stroke", color);
	}

	setFillColor(color) {
		this.properties.FILL_COLOUR = color;
		this.svgElementPath.setAttribute("fill", color);
	}

	setFillRule(rule) {
		this.properties.FILL_RULE = rule;
		this.svgElementPath.setAttribute("fill-rule", rule);
	}

	setStrokeWidth(width) {
		this.properties.STROKE_WIDTH = width;
		this.svgElementPath.setAttribute("stroke-width", width);
	}

	isWithinBoundary(vertex) {
		if (vertex[0] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_X > this.properties.MAX_X) return false;
		if (vertex[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y > this.properties.MAX_Y) return false;
		if (vertex[0] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_X < this.properties.MIN_X) return false;
		if (vertex[1] * this.properties.PATH_SCALE + this.properties.PATH_OFFSET_Y < this.properties.MIN_Y) return false;
		return true;
	}
}
