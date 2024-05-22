//test

var NUMBER_OF_TILES = 7;
var NUMBER_OF_TILES_PER_ROW = 7;
var NUMBER_OF_IMAGES = 11;

$("document").ready(function () {
	
	// var $tilesMenu = '<div class =".tilesDialog"> </div>';
	
    //var array = [];
	var $lastClickedPane;
	
	//create array with all the images for the tiles dialog window
	var images = [];
	for (var i = 0; i < NUMBER_OF_IMAGES; i++) {
		var selector = '' + i;
        if (selector.length == 1)
            selector = '0' + selector;
		selector =  selector + '.png';
		
		$html = ('<div class= "preview_pane" id ="'  + i + '"> <img  src="'+ selector +'" class ="icon" alt="Click To Choose" > </div>');
		images.push($html);
	}
	
	//if (window.console) console.log(images);
	
	
	
	
	
	//$('.test').find('img').attr('id', "hoih") ;
	//if (window.console) console.log($('.test').find('img').attr('id') );
	//populate the fore cast elements with predefined settings.
	
	$stripPane =$('<div class="strip">  </div>');
	$stripHeading =$('<div class="strip">  </div>');
	$stripTemperature =$('<div class="strip">  </div>');
	$stripMinMax =$('<div class="strip">  </div>');
	
	$changeableText = $('<div class = "changeableText" > </div>');
	$tileHeading = $('<div class="tileHeading tile " id= "toName"> <div class = "changeableText" >day </div> </div>');
	$tilePane = $('<div class= "pane tile " id = "toName" > <img  src="tile_chooseMe.png" class ="icon" alt="Click To Choose" > </div>');
	$tileTemperature = $('<div class="tileTemperature tile " id= "toName"> <div class = "changeableText"> 10&deg; </div></div>');
	$tileMaxMin = $('<div class="tileMaxMin tile" id= "toName"> <div class = "changeableText">12&deg; / 8&deg; </div></div>');
	for (var i = 0; i < NUMBER_OF_TILES; i++) { //debug MAGIC number (number of forecast tiles)
		
		// if (i%NUMBER_OF_TILES_PER_ROW == 0) {
			// $pane = $('<div class="paneStrip">  </div>');
			// $("#panes").append($tilePane);
		// }
		
		var selector = '' + i;
		if (selector.length == 1)
			selector = '0' + selector;
			
		//selector = 'pane_' + selector;
		
		
		//array.push($html);
		
		"'  + selector + '"
		
		$stripPane.append($tilePane.clone());
		$stripPane.find('#toName').attr('id', "pane_"+selector);
		
		$stripHeading.append($tileHeading.clone());
		$stripHeading.find('#toName').attr('id', "heading_"+selector);
		
		$stripTemperature.append($tileTemperature.clone());
		$stripTemperature.find('#toName').attr('id', "temperature_"+selector);
		
		$stripMinMax.append($tileMaxMin.clone());
		$stripMinMax.find('#toName').attr('id', "minMax"+selector);
	}
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
		$(this).find('button').addClass("visible");
	
	});
	$(".forecast_element").mouseleave(function () {
		//$('button').toggleClass("visible");
		$(this).find('button').removeClass("visible");
	
	});
	
	//toggle the visibility of the forecast element
    $('button').click(function(){
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
	$(document).on( 'focusout', function(){
		//if (window.console) console.log("topppieeee");
		$newTileHeading = $changeableText.clone();
		//if (window.console) console.log($newTileHeading);
		$newTileHeading.text($('#textBox').val());
		//$('#textBox').remove();
		$('#textBox').replaceWith($newTileHeading);
	});
	
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