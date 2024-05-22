//test

var NUMBER_OF_TILES = 7;
var NUMBER_OF_TILES_PER_ROW = 7;
var NUMBER_OF_IMAGES = 11;
//var DISPLAY_NUMBER_OF_TILES_DEFAULT = 5;
var $days = ["Mon", "Tue","Wed","Thu","Fri","Sat","Sun"];
var $city = "Components";
var $temperatures = ["11\u00B0","11\u00B0","11\u00B0","11\u00B0","11\u00B0","11\u00B0","11\u00B0","11\\u00B0"];
var $minMaxes = ["8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0","8\u00B0/12\u00B0"];



$("document").ready(function () {
	// var $tilesMenu = '<div class =".tilesDialog"> </div>';
	
	var $visibilityOfTiles = [];
	
	for (var i =0;i<NUMBER_OF_TILES;i++){
		$visibilityOfTiles.push(true);
	}
	
    //var array = [];
	var $lastClickedPane;
	
	
	
	//create array with all the images for the tiles dialog window
	var images = [];
	for (var i = 0; i < NUMBER_OF_IMAGES; i++) {
		var selector = '' + i;
        if (selector.length ==1){
            selector = '0' + selector;
		}
		
		selector =  selector + '.png';
		
		$html = ('<div class= "preview_pane" id ="'  + i + '"> <img  src="'+ selector +'" class ="icon" alt="Click To Choose" > </div>');
		images.push($html);
	}
	
	
	$("#title").find(".changeableText").text($city);
	
	//populate the forecast elements with predefined settings.
	
	$stripVisibility =$('<div class="strip">  </div>');
	$stripHeading =$('<div class="strip">  </div>');
	$stripPane =$('<div class="strip">  </div>');
	
	$stripTemperature =$('<div class="strip">  </div>');
	$stripMinMax =$('<div class="strip">  </div>');
	
	$changeableText = $('<div class = "changeableText" > </div>');
	//<input type="checkbox" name="vehicle" value="Bike"> I have a bike<br><button class= "tileVisibilityButton" id="visibility">Toggle tile Visibility</button>
	$tileVisibility = $('<div class="visibility tile " id= "toName"> <input type="checkbox" class = "yuppie" name="visibility" id="checkboxtest" value="ON" checked>  </div>');
	$tileHeading = $('<div class="tileHeading tile " id= "toName"> <div class = "changeableText" >day </div> </div>');
	$tilePane = $('<div class= "pane tile " id = "toName" > <img  src="tile_chooseMe.png" class ="icon" alt="Click To Choose" > </div>');
	$tileTemperature = $('<div class="tileTemperature tile " id= "toName"> <div class = "changeableText"> top </div></div>'); //10&deg;
	$tileMaxMin = $('<div class="tileMaxMin tile" id= "toName"> <div class = "changeableText">12&deg; / 8&deg; </div></div>');
	for (var i = 0; i < NUMBER_OF_TILES; i++) { 
		
		// if (i%NUMBER_OF_TILES_PER_ROW == 0) {
			// $pane = $('<div class="paneStrip">  </div>');
			// $("#panes").append($tilePane);
		// }
		
		var selector = '' + i;
		if (selector.length == 1){
			selector = '0' + selector;
		}	
		//selector = 'pane_' + selector;
		
		//array.push($html);
		
		"'  + selector + '"
		
		$stripVisibility.append($tileVisibility.clone());
		$stripVisibility.find('#toName').attr('id', "visibilityButton_"+selector);
				
		$stripHeading.append($tileHeading.clone());
		$stripHeading.find('#toName').attr('id', "heading_"+selector);
		$stripHeading.find("#heading_"+selector).find(".changeableText").text(($days[i]))	;
		
		$stripPane.append($tilePane.clone());
		$stripPane.find('#toName').attr('id', "pane_"+selector);
		
		$stripTemperature.append($tileTemperature.clone());
		$stripTemperature.find('#toName').attr('id', "temperature_"+selector);
		$stripTemperature.find("#temperature_"+selector).find(".changeableText").text($temperatures[i])	;
		
		$stripMinMax.append($tileMaxMin.clone());
		$stripMinMax.find('#toName').attr('id', "minMax_"+selector);
		$stripMinMax.find("#minMax_"+selector).find(".changeableText").text(($minMaxes[i]))	;
	}
	$("#paneVisiblityButtons").append($stripVisibility);
	$("#headings").append($stripHeading);
	$("#icons").append($stripPane);
	$("#temperatures").append($stripTemperature);
	$("#minMaxs").append($stripMinMax);
	
	//-------------------------------------------------------------------
	//-----------action elements--------------------------------------
	//-------------------------------------------------------------------
	
	
	//visibility buttons only visible when hovering over 
	// $(".forecast_element").hover(function () {
		// //$('button').toggleClass("visible");
		// $(this).find('button').toggleClass("visible");
	
	// });
	
	
	//visibility buttons only visible when hovering over 
	$(".forecast_element").mouseover(function () {
		//$('button').toggleClass("visible");
		$(this).find('.toggleButton').addClass("visible");
	
	});
	$(".forecast_element").mouseleave(function () {
		//$('button').toggleClass("visible");
		$(this).find('.toggleButton').removeClass("visible");
	
	});
	
	
	// $('.tileVisibilityButton').click(function(){
	$('.yuppie').click(function(){
		//get id
		var $idString = $(this).parent().attr('id');
		var $id =  ( parseInt( $idString.substr($idString.length - 2))); //Number
		
		//set visibility of all tiles
		$visibilityOfTiles[$id] = this.checked;
		//alert(this.checked);
		//put all elements off with this id.
		//alert ($(this).parent().attr('id'));
		//alert($visibilityOfTiles);
		
		var $tileIds = ["#headings","#icons","#temperatures","#minMaxs"]

		
		for (var j=0;j<$tileIds.length;j++){
			// var $childrenff = $( "#headings" ).find('.strip').children();
			var $childrenff = $( $tileIds[j] ).find('.strip').children();
			
			for (var i=0;i<NUMBER_OF_TILES;i++){
				//if (window.console) console.log($($childrenff[i]).attr('id'));
				if ($visibilityOfTiles[i] == true){
					$($childrenff[i]).addClass("visible");
					$($childrenff[i]).removeClass("invisible");
				}else{
					$($childrenff[i]).addClass("invisible");
					$($childrenff[i]).removeClass("visible");
				}
			}
		}
		//apply visibility to tiles
		
	});
	
	//toggle the visibility of the forecast element (the whole strip at once)
    $('.toggleButton').click(function(){
		//var el = $("#panes");
		
		var el = $(this).parent().parent().parent().find('.strip') //find('.forecast_element');
		//if (window.console) console.log($(this).parent().parent().parent().attr('class'));
		//if (window.console) console.log($(this).parent().parent().parent().find('.forecast_element').attr('id'));
		if ( el.css("visibility") == "hidden"){
			el.css("visibility", "visible");
			el.css("height", "");
		}else{
			el.css("visibility", "hidden");
			el.css("height", "0px");
		}
	});
	
	
	
	//---------------------------------------------text input --------------------------------------------------
	// $(".tileHeading").click(function(){
	$(document).on('click', '.changeableText', function () {
		if (window.console) console.log($(this).attr('id'));
		var parent = $(this).parent();
		//$(this).replaceWith("<input type='text' class= 'tile' value='" + $(this).text() + "'");
		$(this).replaceWith("<input type='text' class= 'tile' id = 'textBox' value='"+ $(this).text()+"'>");
		//$(this).replaceWith("<p class = 'tile textInput'> test</p>");
		parent.children(":text").focus();
		//return false;
	});
	
	//$(document).on( 'focusout', handler )
	$(document).on( 'focusout', '#textBox',function(){
		
		if ($('#textBox').length){ //if still existing...(because, if enter is pressed, it is already removed in another action)
			//if (window.console) console.log("topppieeee");
			$newTileHeading = $changeableText.clone();
			//if (window.console) console.log($newTileHeading);
			$newTileHeading.text($('#textBox').val());
			//$('#textBox').remove();
			$('#textBox').replaceWith($newTileHeading);
		}
	});
	
	$(document).on('keypress','#textBox', function (e) {

	//if (window.console) console.log("foeijee");
		if (e.keyCode == 13){
			//if (window.console) console.log("foeijee");
			$newTileHeading = $changeableText.clone();
			//if (window.console) console.log($newTileHeading);
			$newTileHeading.text($('#textBox').val());
			//$('#textBox').remove();
			$('#textBox').replaceWith($newTileHeading);
		}
	});
	
	
	//---------------------------------------------icon chooser --------------------------------------------------
	
	//$(document).on('click', '.icon', function () {
	$(".icon").click(function () {
		//open or reopen (if clicked on another pane) the tiles dialog window
		
		if ($('.tilesDialog').length) {   //check if already exists
			//remove if already exists
			$('.tilesDialog').remove();
			$('.arrow-up_inPane').remove();
		}
		// if (window.console) console.log($(this).parent().attr('id'));
		
		// if (this.id != $lastClickedPane){ 
		if ($(this).parent().attr('id') != $lastClickedPane){ 
			//create the tilesdialog
			$(this).parent().append('<div class="arrow-up_inPane"> </div>');
			var $dialog = $('<div class ="tilesDialog"> </div>');
			$(this).parent().parent().append($dialog);
			
			//add images to the tilesdialog
			$.each(images, function( index, value ) {
				   $dialog.append(value); 
			});
			
			//remember the clicked pane	
			$lastClickedPane = $(this).parent().attr('id');
		}else{	
			//if clicked twice on same pane, the dialog just disappears..
			$lastClickedPane = "";
		}
		
	});
	
	//clicked on a picture in the tiles dialog window
	$(document).on('click', '.preview_pane', function () {
		//get source of clicked image (in pane)
		$src = $(this).find('img').attr('src');
		//add src to target image 
		$("#" + $lastClickedPane).find('img').attr('src', $src);
	});
	
	//removing the tiles dialog window  (http://stackoverflow.com/questions/16448042/how-do-i-remove-element-using-click-and-remove-in-jquery)
	$(document).on("click", ".tilesDialog", function(){
		$(this).remove();
		$('.arrow-up_inPane').remove();
		// $(this).parent().parent().parent().find('button').removeClass("visible");
		// if (window.console) console.log($(this).attr('class')); //.attr('class') .parent().parent().parent().parent()
		// if (window.console) console.log($(this)); //.attr('class') .parent().parent().parent().parent()
	});
});