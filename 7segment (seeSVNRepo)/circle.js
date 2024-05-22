var CIRCLE_WIDTH = 10;
var CIRCLE_HEIGHT = CIRCLE_WIDTH;
var CIRCLE_MARGIN_HORIZONTAL_LEFT = 0;
var CIRCLE_MARGIN_VERTICAL_TOP = CIRCLE_MARGIN_HORIZONTAL_LEFT;
var CIRCLE_MARGIN_HORIZONTAL_RIGHT = CIRCLE_MARGIN_HORIZONTAL_LEFT;
var CIRCLE_MARGIN_VERTICAL_BOTTOM = CIRCLE_MARGIN_HORIZONTAL_LEFT;

var CIRCLEFIELD_WIDTH = CIRCLE_WIDTH + CIRCLE_MARGIN_HORIZONTAL_LEFT + DIGIT_MARGIN_HORIZONTAL_RIGHT;
var CIRCLEFIELD_HEIGHT = CIRCLE_HEIGHT + CIRCLE_MARGIN_VERTICAL_TOP + DIGIT_MARGIN_VERTICAL_BOTTOM;
var circle={
	SEGMENT_NAMES : ["P"],
	add : function add(id,scale){
		var properties = shapeRowColSegmentFromId(id);
		svgElement = document.getElementById(SVG_ID);  
		centerX = properties.col * CIRCLEFIELD_WIDTH*SCALE +(CIRCLE_WIDTH/2 + CIRCLE_MARGIN_HORIZONTAL_LEFT)*SCALE; 
		centerY = properties.row * CIRCLEFIELD_HEIGHT*SCALE +(CIRCLE_HEIGHT/2 + CIRCLE_MARGIN_VERTICAL_TOP)*SCALE;
		
		
		var digit = document.createElementNS("http://www.w3.org/2000/svg", "g");
		//digit.setAttribute("xlink:href", "#g1");
		digit.setAttribute("id", id);
		
		
		svgElement.appendChild(digit);
		
		var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		shape.setAttribute("cx", (centerX )*scale);
		shape.setAttribute("cy", (centerY )*scale);
		shape.setAttribute("r",  CIRCLE_WIDTH/2*scale );
		shape.setAttribute("fill", FILL_COLOUR);
		shape.setAttribute("stroke", STROKE_COLOUR);
		shape.setAttribute("stroke-width", STROKE_WIDTH);
		shape.setAttribute("id", id+"_P");
		shape.setAttribute("class", "segment");
		shape.setAttribute("data-rel", "true");
		shape.addEventListener("click", 
		function(){  if ($('input[name=segmentToggleTrigger]:checked').val() === "click"  || $('#segmentToggleTriggerBootstrap option:selected').val() == "click"){	defineDigitsAndChangeColorOfSelectedSegment(shape.getAttribute("id")); }}, false);
		shape.addEventListener("mouseover", 
		function(){  if ($('input[name=segmentToggleTrigger]:checked').val() === "hover"  || $('#segmentToggleTriggerBootstrap option:selected').val() == "hover"){	defineDigitsAndChangeColorOfSelectedSegment(shape.getAttribute("id")); } }, false);
		digit.appendChild(shape);
		
		//applying skew is not that easy!
		//skewer(digit, DIGIT_SKEW,0.5,0.5); //svgOperations.

	}

}