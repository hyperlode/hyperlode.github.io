// http://stackoverflow.com/questions/3492636/use-two-methods-of-the-same-name-in-different-js-files



var fifteenSeg ={
	SEGMENT_NAMES : ["A","B","C","D","E","F","G","P","H","I","J","K","L","M","N"],
	add: function add( id, scale){
		
		var properties = shapeRowColSegmentFromId(id);
		svgElement = document.getElementById(SVG_ID);  
		centerX = properties.col * DIGITFIELD_WIDTH*SCALE +(DIGIT_WIDTH/2 + DIGIT_MARGIN_HORIZONTAL_LEFT)*SCALE; 
		centerY = properties.row * DIGITFIELD_HEIGHT*SCALE +(DIGIT_HEIGHT/2 + DIGIT_MARGIN_VERTICAL_TOP)*SCALE;
		
		
		var digit = document.createElementNS("http://www.w3.org/2000/svg", "g");
		//digit.setAttribute("xlink:href", "#g1");
		digit.setAttribute("id", id);
		
		
		svgElement.appendChild(digit);


		if(typeof(scale)==='undefined') scale = 1; //default argument 
		fifteenSeg.digit_add_Segment_Horizontal(digit, id+"_A", 0+centerX ,centerY + SEGMENT_HEIGHT, scale );
		fifteenSeg.digit_add_Segment_Vertical(digit, id+"_B", centerX + SEGMENT_HEIGHT/2 ,centerY  + SEGMENT_HEIGHT/2,scale );
		fifteenSeg.digit_add_Segment_Vertical(digit, id+"_C", centerX  + SEGMENT_HEIGHT/2, centerY  - SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Horizontal(digit, id+"_D", 0+centerX , centerY -SEGMENT_HEIGHT,scale );
		fifteenSeg.digit_add_Segment_Vertical(digit, id+"_E", centerX - SEGMENT_HEIGHT/2 , centerY - SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Vertical(digit, id+"_F", centerX - SEGMENT_HEIGHT/2 , centerY  + SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_HorizontalShort(digit, id+"_G", centerX  - SEGMENT_HEIGHT/4 , 0+centerY ,scale );
		fifteenSeg.digit_add_Segment_HorizontalShort(digit, id+"_H", centerX  + SEGMENT_HEIGHT/4 , 0+centerY ,scale );
		fifteenSeg.digit_add_Segment_VerticalStumpTop(digit, id+"_I", centerX , centerY - SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_VerticalStumpBottom(digit, id+"_L", centerX , centerY  + SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Slash(digit, id+"_J", centerX + SEGMENT_HEIGHT/4, centerY  - SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Backslash(digit, id+"_K", centerX + SEGMENT_HEIGHT/4, centerY  + SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Slash(digit, id+"_M", centerX - SEGMENT_HEIGHT/4, centerY  + SEGMENT_HEIGHT/2 ,scale );
		fifteenSeg.digit_add_Segment_Backslash(digit, id+"_N", centerX - SEGMENT_HEIGHT/4, centerY  - SEGMENT_HEIGHT/2 ,scale );
		digit.addEventListener("mouseover", 
		function(){},false);
		
		var shape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		shape.setAttribute("cx", (centerX + SEGMENT_HEIGHT/2 + DECPOINT_SPACE)*scale);
		shape.setAttribute("cy", (centerY + SEGMENT_HEIGHT )*scale);
		shape.setAttribute("r",  DECPOINT_DIAMETER/2*scale );
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
		skewer(digit, DIGIT_SKEW,0.5,0.5); //svgOperations.
	
	},
	
	digit_add_segment: function digit_add_segment(svgElement, id,  coords, centerX, centerY,scale){
		var shape = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
		shape.setAttribute("id", id );
		shape.setAttribute("points", "");
		//shape.setAttribute("class", "segmentOnColour");
		shape.setAttribute("class", "segment");
		shape.setAttribute("data-rel", "true");
		
		//shape.setAttribute("style", "stroke:black;stroke-width:3");
		shape.setAttribute("fill", FILL_COLOUR);
		shape.setAttribute("stroke", STROKE_COLOUR);
		shape.setAttribute("stroke-width", STROKE_WIDTH);
		shape.addEventListener("click", 
		function(){  if ($('input[name=segmentToggleTrigger]:checked').val() === "click"  || $('#segmentToggleTriggerBootstrap option:selected').val() == "click" ){	defineDigitsAndChangeColorOfSelectedSegment(shape.getAttribute("id")); }}, false);
		shape.addEventListener("mouseover", 
		function(){  if ($('input[name=segmentToggleTrigger]:checked').val() === "hover"   || $('#segmentToggleTriggerBootstrap option:selected').val() == "hover" ){	defineDigitsAndChangeColorOfSelectedSegment(shape.getAttribute("id")); } }, false);
		
		svgElement.appendChild(shape);
		for (var i = 0; i < coords.length; i++) {
		// console.log(shape);
			addPointToPolyLine(shape, shape,coords[i][0], coords[i][1] )				
		};
	},
	digit_add_Segment_Horizontal: function digit_add_Segment_Horizontal(svgElement, id,  centerX, centerY,scale){
		var coords = 
		[[(centerX - SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale, (centerY + SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/2) * scale, (centerY + 0) * scale ],
		[(centerX - SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale, (centerY - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale, (centerY - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/2) * scale, (centerY - 0) * scale ],
		[(centerX + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale, (centerY + SEGMENT_WIDTH/2) * scale ]];
		// console.log(coords);
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_Vertical:function digit_add_Segment_Vertical(svgElement, id,  centerX, centerY,scale){
		var coords = [
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY -SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX + 0) * scale, (centerY - SEGMENT_HEIGHT/2) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX - 0) * scale, (centerY + SEGMENT_HEIGHT/2) * scale ],
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale ]];
		
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_VerticalStumpTop:function digit_add_Segment_Vertical(svgElement, id,  centerX, centerY,scale){
		var coords = [
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY -SEGMENT_HEIGHT/2+SEGMENT_WIDTH/2) * scale ],
		[(centerX + 0) * scale, (centerY -SEGMENT_HEIGHT/2+SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY -SEGMENT_HEIGHT/2+SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX - 0) * scale, (centerY + SEGMENT_HEIGHT/2) * scale ],
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2-DIGIT_SEGMENT_POINTINESS) * scale ]];
		
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_VerticalStumpBottom:function digit_add_Segment_Vertical(svgElement, id,  centerX, centerY,scale){
		var coords = [
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY -SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX + 0) * scale, (centerY - SEGMENT_HEIGHT/2) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2+DIGIT_SEGMENT_POINTINESS) * scale ],
		[(centerX - SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX - 0) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ]];
		
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_HorizontalShort: function digit_add_Segment_HorizontalShort(svgElement, id,  centerX, centerY,scale){
		var coords = 
		[[(centerX - SEGMENT_HEIGHT/4+DIGIT_SEGMENT_POINTINESS) * scale, (centerY + SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/4) * scale, (centerY + 0) * scale ],
		[(centerX - SEGMENT_HEIGHT/4+DIGIT_SEGMENT_POINTINESS) * scale, (centerY - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4-DIGIT_SEGMENT_POINTINESS) * scale, (centerY - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4) * scale, (centerY - 0) * scale ],
		[(centerX + SEGMENT_HEIGHT/4-DIGIT_SEGMENT_POINTINESS) * scale, (centerY + SEGMENT_WIDTH/2) * scale ]];
		// console.log(coords);
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_Slash:function digit_add_Segment_Slash(svgElement, id,  centerX, centerY,scale){
		var LONG_SIDE = DIGIT_SEGMENT_SLASH_LONG_POINT_SIDE;
		var SHORT_SIDE = DIGIT_SEGMENT_SLASH_SHORT_POINT_SIDE;
		var coords = [
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2 + SHORT_SIDE) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2 - LONG_SIDE) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2 - SHORT_SIDE) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2 + LONG_SIDE) * scale ]];
		
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	},
	digit_add_Segment_Backslash:function digit_add_Segment_Backslash(svgElement, id,  centerX, centerY,scale){
		var LONG_SIDE = DIGIT_SEGMENT_SLASH_LONG_POINT_SIDE;
		var SHORT_SIDE = DIGIT_SEGMENT_SLASH_SHORT_POINT_SIDE;
		var coords = [
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2 + SHORT_SIDE) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2) * scale ],
		[(centerX - SEGMENT_HEIGHT/4 + SEGMENT_WIDTH/2) * scale, (centerY - SEGMENT_HEIGHT/2 + SEGMENT_WIDTH/2 + LONG_SIDE) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2 - SHORT_SIDE) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2) * scale ],
		[(centerX + SEGMENT_HEIGHT/4 - SEGMENT_WIDTH/2) * scale, (centerY + SEGMENT_HEIGHT/2 - SEGMENT_WIDTH/2 - LONG_SIDE) * scale ]];
		
		fifteenSeg.digit_add_segment(svgElement, id, coords, centerX, centerY, scale);
	}


	


};