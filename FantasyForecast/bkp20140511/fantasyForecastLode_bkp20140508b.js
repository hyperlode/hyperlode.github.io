//test
$("document").ready(function () {
	
	// var $tilesMenu = '<div class =".tilesDialog"> </div>';
	
    var array = [];
	var $lastClickedPane;
	
	//create array with all the images for the tiles dialog window
	var images = [];
	for (var i = 0; i < 9; i++) {
		var selector = '' + i;
        if (selector.length == 1)
            selector = '0' + selector;
		selector =  selector + '.png';
		
		$html = ('<div class= "preview_pane" id ="'  + i + '"> <img  src="'+ selector +'" class ="tile" alt="Click To Choose" > </div>');
		images.push($html);
	}
	
	//if (window.console) console.log(images);
	
	//$('.test').find('img').attr('id', "hoih") ;
	//if (window.console) console.log($('.test').find('img').attr('id') );
	
	//populate the fore cast elements with predefined settings.
	$parent = $('<div class="paneStrip">  </div>');
	for (var i = 0; i < 7; i++) { //debug MAGIC number (number of forecast tiles)
		if (i%7 == 0) {
			$parent = $('<div class="paneStrip">  </div>');
			$("#panes").append($parent);
		}
		
		var selector = '' + i;
		if (selector.length == 1)
			selector = '0' + selector;
		selector = 'pane_' + selector;
		$html = $('<div class= "pane" id ="'  + selector + '"> <p class="tileTitle"> day </p> <img  src="tile_chooseMe.png" class ="tile" alt="Click To Choose" > </div>');

		array.push($html);
		$parent.append($html);
	}
	
	
	//-------------------------------------------------------------------
	//-----------action elements--------------------------------------
	//-------------------------------------------------------------------
	
	
	//visibility buttons only visible when hovering over 
	// $(".play_field").hover(function () {
		// //$('button').toggleClass("visible");
		// $(this).find('button').toggleClass("visible");
	
	// });
	//visibility buttons only visible when hovering over 
	$(".play_field").mouseover(function () {
		//$('button').toggleClass("visible");
		$(this).find('button').addClass("visible");
	
	});
	$(".play_field").mouseleave(function () {
		//$('button').toggleClass("visible");
		$(this).find('button').removeClass("visible");
	
	});
	
	//toggle the visibility of the forecast element
    $('button').click(function(){
		//var el = $("#panes");
		
		var el = $(this).parent().parent().parent().find('.forecast_element') //find('.forecast_element');
		if (window.console) console.log($(this).parent().parent().parent().attr('class'));
		if (window.console) console.log($(this).parent().parent().parent().find('.forecast_element').attr('id'));
		if ( el.css("visibility") == "hidden"){
			el.css("visibility", "visible");
			el.css("height", "");
		}else{
			el.css("visibility", "hidden");
			el.css("height", "0px");
		}
	});
	
	
    $(".pane").click(function () {
		//open or reopen (if clicked on another pane) the tiles dialog window
		
		if ($('.tilesDialog').length) {   //check if already exists
			//remove if already exists
			$('.tilesDialog').remove();
			$('.arrow-up_inPane').remove();
		}
		
		
		if (this.id != $lastClickedPane){ 
			//create the tilesdialog
			$(this).append('<div class="arrow-up_inPane"> </div>');
			var $dialog = $('<div class ="tilesDialog"> </div>');
			$(this).parent().append($dialog);
			
			//add images to the tilesdialog
			$.each(images, function( index, value ) {
				   $dialog.append(value); 
			});
			
			//remember the clicked pane	
			$lastClickedPane = this.id;
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