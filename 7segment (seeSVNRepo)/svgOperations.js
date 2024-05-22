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
	shape.setAttribute("style", "fill:none;stroke:black;stroke-width:3");
	svgElement.appendChild(shape);
}

function add_circle(svgElement){
	var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	// Set any attributes as desired
	shape.setAttribute("cx", 25);
	shape.setAttribute("cy", 25);
	shape.setAttribute("r",  20);
	shape.setAttribute("fill", "green");
	svgElement.appendChild(shape);
};
