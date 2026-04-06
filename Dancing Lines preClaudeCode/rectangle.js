
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
		// console.log(this.properties);
		this.svgElementRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		this.svgElementRect.setAttribute("id", "mask");
		this.svgElementRect.setAttribute("width", this.rectData.width);
		this.svgElementRect.setAttribute("height", this.rectData.height);
		this.svgElementRect.setAttribute("stroke", this.properties.RECT_STROKE_COLOUR);
		this.svgElementRect.setAttribute("stroke-width", "0");
		this.svgElementRect.setAttribute("opacity", 1);
		this.svgElementRect.setAttribute("fill", this.properties.RECT_FILL_COLOUR);
		
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
