// $(function () {

var WRITING_ORIGIN_X = 0;
var WRITING_ORIGIN_Y = 0;

var NUMBER_OF_CHARACTERS_ON_LINE = 24;
var NUMBER_OF_LINES = 5;
var MAX_NUMBER_OF_CHARACTERS_ON_LINE = 50;
var MAX_NUMBER_OF_LINES = 50;

 var SVG_WIDHT = 1280;
 var SVG_HEIGHT = 800;
var SVG_ID = "writing_sheet";

var SEGMENT_WIDTH = 6;
var SEGMENT_HEIGHT = 25;
var DIGIT_SEGMENT_POINTINESS = 3;
var DIGIT_SEGMENT_SLASH_ANGLE = Math.atan((SEGMENT_HEIGHT-SEGMENT_WIDTH) / (SEGMENT_HEIGHT/2-SEGMENT_WIDTH));
var DIGIT_SEGMENT_SLASH_SHORT_POINT_SIDE = SEGMENT_WIDTH/2 / Math.sin(DIGIT_SEGMENT_SLASH_ANGLE);
var DIGIT_SEGMENT_SLASH_LONG_POINT_SIDE = SEGMENT_WIDTH/2 / Math.cos(DIGIT_SEGMENT_SLASH_ANGLE);

var DIGIT_MARGIN_HORIZONTAL_LEFT = 10;
var DIGIT_MARGIN_HORIZONTAL_RIGHT = 5;
var DIGIT_MARGIN_VERTICAL_TOP = 10;
var DIGIT_MARGIN_VERTICAL_BOTTOM = 10;

var DIGIT_SKEW= -7; //around center, if not wanted, change in function...

var DECPOINT_SPACE = 8;
var DECPOINT_DIAMETER = 6;




var FILL_COLOUR= "red";
var EMPTY_COLOUR= "#E6E6E6";
var STROKE_COLOUR= "white";
var STROKE_WIDTH = 0.1;
var SVG_BACKGROUND = "white";
var SCALE = 1;


var DIGIT_WIDTH= SEGMENT_HEIGHT + SEGMENT_WIDTH;
var DIGIT_HEIGHT= SEGMENT_HEIGHT * 2 + SEGMENT_WIDTH;
var DIGITFIELD_WIDTH = DIGIT_WIDTH + DIGIT_MARGIN_HORIZONTAL_LEFT + DIGIT_MARGIN_HORIZONTAL_RIGHT;
var DIGITFIELD_HEIGHT = DIGIT_HEIGHT + DIGIT_MARGIN_VERTICAL_TOP + DIGIT_MARGIN_VERTICAL_BOTTOM;

var shapeType;
$("document").ready(function () {

	
	//add event to the save to png button
    $('#buttonSaveAsPng').click(function(){
      saveSvgAsPng(document.getElementById(SVG_ID), "diagram.png", 3);
    });
 
	//set size in filed size input boxes
	document.getElementById("input_field_columns").value = NUMBER_OF_CHARACTERS_ON_LINE;
	document.getElementById("input_field_rows").value = NUMBER_OF_LINES;
	
	//textarea
	document.getElementById("textArea_imageAsText").value = "hoitjes";
	var name = document.getElementById("drawing");  
	addSvg(name, SVG_ID);
	
	svgPopulate();
	
	
	
	
	
	
	//var svg = document.getElementById('symbols');
	
	
	// var name = document.getElementById("drawing");  
	//addCanvas("drawing");
	// addCanvas(name);
	// var canvas = document.getElementById(SVG_ID);  
	// digit_add_Segment_Horizontal(canvas, 30, 30,5);
	// digit_add_Segment_Vertical(canvas, 30, 30,5);
	console.log( "readyeee!" );
	//var e= document.getElementById("shapeModez");
	
	
	//console.log(e.options[e.selectedIndex].value());
	
	 
});

function svgPopulate(){
	var ids = getAllDigitIds();
	for (var i=0;i<ids.length;i++){
			shape_add(ids[i],SCALE);
		}
};


function setShapeType(){
	if ($('input[name=shapeMode]:checked').val() === "circle"){
		shapeType = circle;
	}else if ($('input[name=shapeMode]:checked').val() === "sevSeg"){
		shapeType = sevSeg;
	}else if ($('input[name=shapeMode]:checked').val() === "fifteenSeg"){
		shapeType = fifteenSeg;
	}else if ($('#shapeModeBootstrap option:selected').val() == "circle"){
		shapeType = circle;
	}else if ($('#shapeModeBootstrap option:selected').val() == "sevSeg"){
		shapeType = sevSeg;
	}else if ($('#shapeModeBootstrap option:selected').val() == "fifteenSeg"){
		shapeType = fifteenSeg;
	}else{
		console.log("ASSERT ERROR: shape undefined");
		
	};
	// console.log(	$('#shapeModeBootstrap option:selected').val() == "Circle");
// console.log( "lode");
};

function shape_add(id,scale){
	console.log($('input[name=shapeMode]:checked').val());
	setShapeType();
	console.log(shapeType);
		shapeType.add(id,scale); 	
}



function getAllDigitIds(){
	returnArray =[];
	for (var row = 0; row < NUMBER_OF_LINES; row++) {
		for (var col = 0; col < NUMBER_OF_CHARACTERS_ON_LINE; col++) {
			returnArray.push(row + "_" + col);
		}
	}
	return returnArray;
};

function addSvg(elementToAppendTo, name){
	var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute('style', 'border: 1px solid black;background:' + SVG_BACKGROUND);
	svg.setAttribute('width', SVG_WIDHT);
	//svg.setAttribute('background', SVG_BACKGROUND);
	svg.setAttribute('id', name);
	svg.setAttribute('height', SVG_HEIGHT);
	svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
	elementToAppendTo.appendChild(svg);
};



function exportImage(){
	exportString = "";
	//add size rows, cols
	exportString += NUMBER_OF_LINES + "\n" + NUMBER_OF_CHARACTERS_ON_LINE+ "\n";
	
	var ids = getAllDigitIds();
	for (var id=0; id<ids.length; id++){
		var segVis =digit_getSegmentArrayVisibility(ids[id]);
		var segVisStr = segVis.join(",");
		if (id!=0){
		exportString += "DIGIT";
		}
		exportString += ids[id]+"," + segVisStr ; 
		
	}
	//console.log(exportString);
	//exportString = exportString.replace("true","1");
	exportString = exportString.split("true").join("1");
	//exportString = exportString.split("false").join("0");
	exportString = replaceAllInstancesInString(exportString,"false","0");
	exportString = "Comments \n" + exportString;
	exportString ="----EXPORT START----\n" + exportString;
	
	exportString += "\n" + "----EXPORT END----"
	//exportString = exportString.replace("false","0");
	//console.log(exportString);
	document.getElementById("textArea_imageAsText").value = exportString;
};

function shape_deleteAll(){
	var ids = getAllDigitIds();
	
	for (var i= 0; i<ids.length;i++){
		digit_remove(ids[i]);
	};
	NUMBER_OF_CHARACTERS_ON_LINE = 0;
	NUMBER_OF_LINES = 0;
	//console.log(digitIdsNew);
	document.getElementById("input_field_columns").value = NUMBER_OF_CHARACTERS_ON_LINE;
	document.getElementById("input_field_rows").value = NUMBER_OF_LINES;
};

function importImage(){
	shape_deleteAll();
	var imageText = document.getElementById("textArea_imageAsText").value;
	var imageElements = imageText.split("\n");
	console.log(imageElements);
	var digits = imageElements.slice(4, imageElements.length-1);
	console.log(imageElements);
	var digits = digits[0].split("DIGIT");
	 console.log(digits);
		
	document.getElementById("input_field_columns").value = imageElements[3];
	document.getElementById("input_field_rows").value = imageElements[2];
	
	digits_redefineQuantity(imageElements[2],imageElements[3]);
	// console.log(imageElements[2]);
	// console.log(imageElements[3]);
	
	
	for (var digit=0;digit<digits.length;digit++){
		var digitData = digits[digit].split(",");
		var vis = [];
		for (var i = 1;i<16;i++){
			vis.push(digitData[i]=="1"?true:false);
		}
		digit_change_segmentArray(digitData[0],vis);
	}
}

function importString() {
	// Ascii char table: starts at character 0x30 (='0')
	var characterTable = [ "1,1,1,1,1,1,0,.,0,0,0,0,0,0,0",
	"0,1,1,0,0,0,0,.,0,0,0,0,0,0,0","1,0,1,1,0,1,1,.,1,0,0,0,0,0,0","1,1,1,1,0,0,1,.,1,0,0,0,0,0,0",
	"0,1,1,0,1,0,1,.,1,0,0,0,0,0,0","1,1,0,1,1,0,1,.,1,0,0,0,0,0,0","1,1,0,1,1,1,1,.,1,0,0,0,0,0,0",
	"0,1,1,1,0,0,0,.,0,0,0,0,0,0,0","1,1,1,1,1,1,1,.,1,0,0,0,0,0,0","1,1,1,1,1,0,1,.,1,0,0,0,0,0,0",
	"","","","","","","", // skip 7 chars between numbers and capital letters
	"0,1,1,1,1,1,1,.,1,0,0,0,0,0,0","1,1,0,0,1,1,1,.,1,0,0,0,0,0,0","1,0,0,1,1,1,0,.,0,0,0,0,0,0,0",
	"1,1,1,0,0,1,1,.,1,0,0,0,0,0,0","1,0,0,1,1,1,1,.,1,0,0,0,0,0,0","0,0,0,1,1,1,1,.,1,0,0,0,0,0,0",
	"1,1,0,1,1,1,0,.,1,0,0,0,0,0,0","0,1,1,0,1,1,1,.,1,0,0,0,0,0,0","1,0,0,1,0,0,0,.,0,1,0,0,1,0,0",
	"1,1,1,0,0,0,0,.,0,0,0,0,0,0,0","0,0,0,0,1,1,1,.,0,0,1,1,0,0,0","1,0,0,0,1,1,0,.,0,0,0,0,0,0,0",
	"0,1,1,0,1,1,0,.,0,0,1,0,0,0,1","0,1,1,0,1,1,0,.,0,0,0,1,0,0,1","1,1,1,1,1,1,0,.,0,0,0,0,0,0,0",
	"0,0,1,1,1,1,1,.,1,0,0,0,0,0,0","1,1,1,1,1,1,0,.,0,0,0,1,0,0,0","0,0,1,1,1,1,1,.,1,0,0,1,0,0,0",
	"1,1,0,1,1,0,1,.,1,0,0,0,0,0,0","0,0,0,1,0,0,0,.,0,1,0,0,1,0,0","1,1,1,0,1,1,0,.,0,0,0,0,0,0,0",
	"0,0,0,0,1,1,0,.,0,0,1,0,0,1,0","0,1,1,0,1,1,0,.,0,0,0,1,0,1,0","0,0,0,0,0,0,0,.,0,0,1,1,0,1,1",
	"0,0,0,0,0,0,0,.,0,0,1,0,1,0,1","1,0,0,1,0,0,0,.,0,0,1,0,0,1,0"];
	
	var inputString = document.getElementById("textArea_imageAsText").value;
	
	// convert to capitals and remove all that's not a letter, number, space or dot
	inputString = inputString.toUpperCase();
	var cleanedString = "";
	var numChars = 0;
	
	var dotsAt = [];
	for (var i=0;i<inputString.length;i++){
		if((inputString.charCodeAt(i) >= 0x30 && inputString.charCodeAt(i) <= 0x39) || // 0-9
		   (inputString.charCodeAt(i) >= 0x41 && inputString.charCodeAt(i) <= 0x5A) || // A-Z
		    inputString[i]==' ') { // allow space
			// character is in range
			cleanedString += inputString[i];
			numChars++;
		}
		else if(inputString[i]=='.' && numChars > 0) { // allow dot if not at first position
			dotsAt.push(numChars-1);
		}
	}
	
	inputString = cleanedString;
	
	while( inputString.length % NUMBER_OF_CHARACTERS_ON_LINE != 0 )
		inputString += " ";
	var numLines = Math.ceil(inputString.length / NUMBER_OF_CHARACTERS_ON_LINE );
	
	exportString = "";
	//add size rows, cols
	exportString += numLines + "\n" + NUMBER_OF_CHARACTERS_ON_LINE+ "\n";
	var row = 0;
	var col = 0;
	var dotsCounter = 0;
	for (var i=0;i<inputString.length;i++){
		if (i!=0){
			exportString += "DIGIT";
		}
		exportString += row + "_" + col + ",";
		var nextChar;
		if( inputString[i] == ' ' )
			nextChar = "0,0,0,0,0,0,0,.,0,0,0,0,0,0,0";
		else
			nextChar = characterTable[inputString[i].charCodeAt(0)-0x30];
		if( dotsAt[dotsCounter] == i ) {
			nextChar = nextChar.replace('.','1');
			++dotsCounter;
		}
		else {
			nextChar = nextChar.replace('.','0');
		}
		exportString += nextChar;
		if( ++col >= NUMBER_OF_CHARACTERS_ON_LINE )
		{
			col = 0;
			++row;
		}
	}
	
	exportString = inputString + "\n" + exportString;
	exportString ="----EXPORT START----\n" + exportString;
	
	exportString += "\n" + "----EXPORT END----"
	//exportString = exportString.replace("false","0");
	//console.log(exportString);
	document.getElementById("textArea_imageAsText").value = exportString;

}


digits_redefineQuantity: function digits_redefineQuantity(){
	var newDigitsIdsArray = [];
	var colsInput = document.getElementById("input_field_columns");
	var rowsInput = document.getElementById("input_field_rows");
	
	
	
	//checkinput
	newCols = (colsInput.value != "" && !isNaN(colsInput.value)) ? colsInput.value : NUMBER_OF_CHARACTERS_ON_LINE ; 
	newRows = (rowsInput.value != "" && !isNaN(rowsInput.value)) ? rowsInput.value : NUMBER_OF_LINES ;
	
	newCols = newCols > MAX_NUMBER_OF_CHARACTERS_ON_LINE ? NUMBER_OF_CHARACTERS_ON_LINE : newCols;
	newRows = newRows > MAX_NUMBER_OF_LINES ? NUMBER_OF_LINES : newRows;
	
	shape_deleteAll();
	
	
	// console.log(newCols);
	// console.log(newRows);
	
	for (var row=0; row < newRows; row++){
		for (var col= 0; col<newCols; col++){
			newDigitsIdsArray.push(row +"_"+ col);
		}
	}
	
	var existingDigitsIdsArray = getAllDigitIds();
	
	var digitIdsToRemove = $(existingDigitsIdsArray).not(newDigitsIdsArray).get();
	for (var i=0;i<digitIdsToRemove.length;i++){
		digit_remove(digitIdsToRemove[i]);
	}
	
	//console.log(digitIdsToRemove);
	
	var digitIdsNew = $(newDigitsIdsArray).not(existingDigitsIdsArray).get();
	
	for (var i=0;i<digitIdsNew.length;i++){
		shape_add(digitIdsNew[i],SCALE);
	}
	
	NUMBER_OF_CHARACTERS_ON_LINE = newCols;
	NUMBER_OF_LINES = newRows;
	//console.log(digitIdsNew);
	document.getElementById("input_field_columns").value = NUMBER_OF_CHARACTERS_ON_LINE;
	document.getElementById("input_field_rows").value = NUMBER_OF_LINES;
	console.log(digitIdsNew);
	
	
	
	
	
	
};




function digit_changeAll_SingleSegment(segmentId, isSegmentVisible){
	//run through segments.
	for (var row = 0; row < NUMBER_OF_LINES; row++) {
		for (var col = 0; col < NUMBER_OF_CHARACTERS_ON_LINE; col++) {
			digit_change_singleSegment("" + row + "_" + col,segmentId,isSegmentVisible);
		}
	}
};

function digit_changeAll_AllSegments(isSegmentsVisible){
	
	//run through segments.
	for (var row = 0; row < NUMBER_OF_LINES; row++) {
		for (var col = 0; col < NUMBER_OF_CHARACTERS_ON_LINE; col++) {
			// console.log("" + row + "_" + col);
			digit_change_allSegments("" + row + "_" + col, isSegmentsVisible);
		}
	}
}




function makeSvgReadyForDigit(svgElement){
 $("<defs/>")
        .append($("<polyline/>", {id: "h-seg", points:"11 0, 37 0, 42 5, 37 10, 11 10, 6 5"}))
        .append($("<polyline/>", {id: "v-seg", points:"0 11, 5 6, 10 11, 10 34, 5 39, 0 39"}))
        .appendTo(svgElement);

};


function digit_change_singleSegment(id, segmentId, isSegmentVisible){
	var segIndex = shapeType.SEGMENT_NAMES.indexOf(segmentId);
	var seg = document.getElementById(id + "_" + shapeType.SEGMENT_NAMES[segIndex]);  
	changeSegmentColor(seg,isSegmentVisible);
}

function digit_change_segmentArray(id, segmentVisibilityArray){

	for (var segIndex = 0; segIndex < shapeType.SEGMENT_NAMES.length; segIndex++) { 
		var seg = document.getElementById(id + "_" + shapeType.SEGMENT_NAMES[segIndex]);  
		//console.log(id + "_" + shapeType.SEGMENT_NAMES[segIndex]);
		changeSegmentColor(seg,segmentVisibilityArray[segIndex]);
	}
};

function digit_getSegmentArrayVisibility(id){
	var arr = [];
	for (var segIndex = 0; segIndex < shapeType.SEGMENT_NAMES.length; segIndex++) { 
		var seg = document.getElementById(id + "_" + shapeType.SEGMENT_NAMES[segIndex]); 

		arr.push(segment_isVisible(seg));		
	}
	return arr;
};

function digit_change_allSegments(id,isSegmentsVisible){
	
	for (var segIndex = 0; segIndex < shapeType.SEGMENT_NAMES.length; segIndex++) { 
		var seg = document.getElementById(id + "_" + shapeType.SEGMENT_NAMES[segIndex]);  
		// console.log(id + "_" + shapeType.SEGMENT_NAMES[segIndex]);
		changeSegmentColor(seg,isSegmentsVisible);
	}
	
};


function shapeRowColSegmentFromId(id){
	var arr= id.split("_");
	
	if (arr.length ==3){
		return {row:arr[0],col:arr[1],segName:arr[2]};
	}else if (arr.length ==2){
		return {row:arr[0],col:arr[1]};
	}else{
		console.log("ASSERT ERROR: id cannot be split correctly");
	}
	
};







// function digit_remove_array(digitIds){

// };

function digit_remove(id){
	//extra dom functions: http://stackoverflow.com/questions/3387427/javascript-remove-element-by-id
	document.getElementById(id).remove();
};





function changeDigitMode_radioDefined(id){
	var idArray = id.split("_");
	row=idArray[0];
	col=idArray[1];
	
	returnArray =[];
	if ($('input[name=digitChangeMode]:checked').val() === "single" || $('#digitChangeModeBootstrap option:selected').val() == "single"){
		return [row + "_" + col];
	}else if ($('input[name=digitChangeMode]:checked').val() === "row" || $('#digitChangeModeBootstrap option:selected').val() == "row"){
		for(var i=0; i<NUMBER_OF_CHARACTERS_ON_LINE;i++){
			returnArray.push(row + "_" + i);
		};
		return returnArray;
		
	}else if ($('input[name=digitChangeMode]:checked').val() === "column" || $('#digitChangeModeBootstrap option:selected').val() == "column"){
		for(var i=0; i<NUMBER_OF_LINES;i++){
			returnArray.push(i + "_" + col);
		};
		return returnArray;
	}else if ($('input[name=digitChangeMode]:checked').val() === "cross"  || $('#digitChangeModeBootstrap option:selected').val() == "cross"){
		for (var i = 0; i < NUMBER_OF_LINES; i++) {
			for (var j = 0; j < NUMBER_OF_CHARACTERS_ON_LINE; j++) {
				if(i== row || j == col){
					returnArray.push(i+ "_" + j);
				}
			}
		}
		return returnArray;	
		
		
	}else if ($('input[name=digitChangeMode]:checked').val() === "all" || $('#digitChangeModeBootstrap option:selected').val() == "all"){
		return getAllDigitIds();
		
		
	
		
	}else {
		console.log("ASSERT ERROR: no digit change mode selected");
	}
	
	console.log("ahoieee");
};



function defineDigitsAndChangeColorOfSelectedSegment(triggerSegmentId){
	//get all segments to change
	var toChangeIdArray = changeDigitMode_radioDefined(triggerSegmentId);
	
	var segmentId = triggerSegmentId.split("_")[2];
	
	//change the color
	for (var index = 0; index < toChangeIdArray.length; index++){
		//console.log(toChangeIdArray[index]+ "_" + segmentId);
		var shp = document.getElementById(toChangeIdArray[index]+ "_" + segmentId);
		if (shp != null){
			changeSegmentColor_radioDefined(shp);
		};
	};
	
};
function segment_isVisible(shape){
	return (shape.getAttribute("data-rel") == "true")? true : false;
}

function changeSegmentColor_radioDefined(shape){
	
	// if ($('input[name=segmentChangeMode]:checked').val() === "on"){
		// changeSegmentColor(shape,true);
	// }else if ($('input[name=segmentChangeMode]:checked').val() === "off"){
		// changeSegmentColor(shape,false);
	// }else if ($('input[name=segmentChangeMode]:checked').val() === "toggle"){
		// changeSegmentColor(shape, shape.getAttribute("data-rel") == "false" )
		
	// }else 
	
	if ($('#segmentChangeModeBootstrap option:selected').val() == "on"){	
	changeSegmentColor(shape,true);
	}else if ($('#segmentChangeModeBootstrap option:selected').val() == "off"){	
	changeSegmentColor(shape,false);
	}else if ($('#segmentChangeModeBootstrap option:selected').val() == "toggle"){	
		changeSegmentColor(shape, shape.getAttribute("data-rel") == "false" )
		
		
	}else{
		console.log("ASSERT ERROR: NO FILL MODE");
	};
	
};

function changeSegmentColor(shape,isOn){
	shape.setAttribute("data-rel", isOn === true ? "true" : "false" );
	shape.setAttribute("fill", isOn === true ? FILL_COLOUR : EMPTY_COLOUR); //preserve this, for saving to png, the css is not checked!!!
};



