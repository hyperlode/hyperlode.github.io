
function addSvg(elementToAppendTo, name,width, height,color_background,border_color){
	{
		color_background = typeof color_background !== 'undefined' ? color_background : "white";
		border_color = typeof border_color !== 'undefined' ? border_color : "black";
	}
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute('style', 'border: 1px solid '+ border_color+ ';background:' + color_background);
	svg.setAttribute('width', width);
	//svg.setAttribute('background', SVG_BACKGROUND);
	svg.setAttribute('id', name);
	svg.setAttribute('height', height);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	elementToAppendTo.appendChild(svg);
};



// var skewer = function(element, angle, x, y) {
function skewer(element, angle, x, y) {
  var box, radians, svg, transform;
  // x and y are defined in terms of the elements bounding box
  // (0,0)
  //  --------------
  //  |            |
  //  |            |
  //  --------------
  //             (1,1)
  // it defaults to the center (0.5, 0.5)
  // this can easily be modifed to use absolute coordinates
  if (isNaN(x)) {
    x = 0.5;
  }
  if (isNaN(y)) {
    y = 0.5;
  }
  box = element.getBBox();
  x = x * box.width + box.x;
  y = y * box.height + box.y;
  radians = angle * Math.PI / 180.0;
  svg = document.querySelector('svg');
  transform = svg.createSVGTransform();
  //creates this matrix
  // | 1 0 0 |  => see first 2 rows of
  // | 0 1 0 |     generic matrix above for mapping
  // translate(<cx>, <cy>)
  transform.matrix.e = x;
  transform.matrix.f = y;
  // appending transform will perform matrix multiplications
  element.transform.baseVal.appendItem(transform);
  transform = svg.createSVGTransform();
  // skewX(<skew-angle>)
  transform.matrix.c = Math.tan(radians);
  element.transform.baseVal.appendItem(transform);
  transform = svg.createSVGTransform();
  // translate(-<cx>, -<cy>)
  transform.matrix.e = -x;
  transform.matrix.f = -y;
  element.transform.baseVal.appendItem(transform);
};


function addPointToPolyLine(svgElement, polyline,x,y){
	//var polyline= document.getElementById('brecht');
	test = document.getElementById(SVG_ID);
	var point = test.createSVGPoint(); //create point but never add it to the DOM, this is to easily add integer points to the polyline!
	point.x = x;
	point.y = y;
	polyline.points.appendItem(point);
}

function add_polyline(svgElement){
	var shape = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
	shape.setAttribute("points", "20,20 40,25 60,40 80,120 120,140 200,180");
	shape.setAttribute("points", "20,20 40,25 60,40 80,120 120,140 200,180");
	shape.setAttribute("style", "fill:none;stroke:black;stroke-width:3");
	svgElement.appendChild(shape);
}

function add_pattern_diagonal_lines(svgElement){
	//to make it work: set the id of this as fill:url(#vertical_hatch)  where vertical_hatch is the id of this pattern
	//and dont forget to add this pattern as a def to the svg!
	// http://codepen.io/endlist/pen/qEjdKg
	var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
	pattern.setAttribute('id', "lines");
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    // pattern.setAttribute('width', 10);
    // pattern.setAttribute('height', 10);
	//var polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	// polygon.setAttribute("points", "5,0 10,10 0,10"); //triangles.
	// pattern.appendChild(polygon);
	pattern.setAttribute('width', 4);
	
	
    pattern.setAttribute('height', 4);
	var path =  document.createElementNS("http://www.w3.org/2000/svg", "path");
	path.setAttribute("d", "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2"); //http://stackoverflow.com/questions/13069446/simple-fill-pattern-in-svg-diagonal-hatching
	path.setAttribute("color", "black");
	path.setAttribute('stroke-width', 2);
	path.setAttribute('stroke', "yellow"); //http://codepen.io/endlist/pen/qEjdKg
	pattern.appendChild(path);
	
	svgElement.appendChild(pattern);
}
function add_pattern_vertical_lines(svgElement, id, color, strokeWidth, strokeDistance){
	color = typeof color !== 'undefined' ? color : "black";
	strokeWidth   = typeof strokeWidth !== 'undefined' ? strokeWidth : 1;
	strokeDistance = typeof strokeDistance !== 'undefined' ? strokeDistance : 10;
	//to make it work: set the id of this as fill:url(#vertical_hatch)  where vertical_hatch is the id of this pattern
	//and dont forget to add this pattern as a def to the svg!
	
	var pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
	pattern.setAttribute('id', id);
    pattern.setAttribute('patternUnits', 'userSpaceOnUse');
    pattern.setAttribute('width', strokeDistance);
    pattern.setAttribute('height',strokeDistance);
    pattern.setAttribute('patternTransform', 'rotate(45 0 0)');
	
	var line =  document.createElementNS("http://www.w3.org/2000/svg", "line");
	line.setAttribute('x1', '0');
	line.setAttribute('x2', strokeDistance);
	line.setAttribute('y1', '0');
	line.setAttribute('y2', strokeDistance);
	line.setAttribute('style', 'stroke:'+ color +'; stroke-width:'+ strokeWidth);
	pattern.appendChild(line);
	
	svgElement.appendChild(pattern);

	// line.setAttribute('patternTransform', 'rotate(45 0 0)');
	// <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
		// <line x1="0" y1="0" x2="0" y2="10" style="stroke:black; stroke-width:1" />
	// </pattern>
}

function add_polygon(svgElement,pointsAsString,strokeColor ,infill,xOffset,  yOffset, scale){
	//http://cssplant.com/clip-path-generator   to get the points easily
	pointsAsString = typeof pointsAsString !== 'undefined' ? pointsAsString : "200 200,300 350,400 200,300 50";
	xOffset = typeof xOffset !== 'undefined' ? xOffset : 0;
	yOffset = typeof yOffset !== 'undefined' ? yOffset : 0;
	infill = typeof infill !== 'undefined' ? infill : "white";
	scale = typeof scale !== 'undefined' ? scale : 1;
	var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
	shape.setAttribute("points", pointsAsString);
	// shape.setAttribute("y", yOffset);
	shape.setAttribute("transform" , 'translate(' + xOffset +' '+ yOffset + ")" + 'scale(' + scale +' '+ scale + ")");
	
	//
	
	// shape.setAttribute("points", "20,20 40,25 60,40 80,120 120,140 200,180");
	// shape.setAttribute("style", "fill:none;stroke:black;stroke-width:3");
	// shape.setAttribute("style", " fill:url(#lines)");
	// shape.setAttribute("style", " fill:url(#vertical_hatch)");
	shape.setAttribute("style", " stroke: "+ strokeColor +";fill:"+ infill +";stroke-width: " + scale/1000);
	
		
	svgElement.appendChild(shape);
}

function add_text(svgElement, text, color, size, x,y, font){ //, xOffset, yOffset
	var shape = document.createElementNS("http://www.w3.org/2000/svg", "text");
	
	shape.setAttribute("font-size",size);
	shape.setAttribute("fill",color);
	shape.setAttribute("x",x);
	shape.setAttribute("y",y);
	shape.setAttribute("font-family",font); //font-family="Verdana"
	shape.textContent = text;
	svgElement.appendChild(shape);	
}


function add_circle(svgElement, x, y, r, id, color){
	//20150512 lode
	{
		color = typeof color !== 'undefined' ? color : "black";
		
	}

	var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	// Set any attributes as desired
	shape.setAttribute("cx", x);
	shape.setAttribute("cy", y);
	shape.setAttribute("r",  r);
	shape.setAttribute("fill", color);
	shape.setAttribute("id", id);
	//console.log(id);
	svgElement.appendChild(shape);
};
