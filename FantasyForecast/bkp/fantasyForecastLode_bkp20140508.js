//test
$("document").ready(function () {
	
	// var $tilesMenu = '<div class =".tilesDialog"> </div>';
	var $tilesMenu = ('<div>', {class: 'tilesDialog'}); //equals: '<div class =".tilesDialog"> </div>'
	
    var array = [];
	var $lastClickedPane;
	
	var images = [];
	for (var i = 0; i < 3; i++) {
		var selector = '' + i;
        if (selector.length == 1)
            selector = '0' + selector;
		selector =  selector + '.png';
		
		$html = ('<div class= "preview_pane" id ="'  + i + '"> <img  src="'+ selector +'" class ="tile" alt="Click To Choose" > </div>');
		images.push($html);
		
	}
	if (window.console) console.log(images);
	
	$('.test').find('img').attr('id', "hoih") ;
	if (window.console) console.log($('.test').find('img').attr('id') );
	
	//var $parent; 
	$parent = $('<div class="paneStrip">  </div>');
    for (var i = 0; i < 14; i++) {
      
		
		 if (i%7 == 0) {
			$parent = $('<div class="paneStrip">  </div>');
			$("#panes").append($parent);
		 }
		
		
		
		var selector = '' + i;
        if (selector.length == 1)
            selector = '0' + selector;
        selector = 'pane_' + selector;
       // $html = '<div class= "pane" pane ="' + selector = '"> </div>";
        $html = $('<div class= "pane" id ="'  + selector + '"> <p id="tileTitle"> title </p> <img  src="tile_chooseMe.png" class ="tile" alt="Click To Choose" > </div>');
       
	   
	   // $html = ('<div>',{
						// class: 'pane',
		// id: selector, html: $('<p>',{id: 'tileTitle', html: "title"})
						// });
						
	   //array.push($(selector, response).html());
        array.push($html);
        $parent.append($html);
	}
    
    $(".pane").click(function () {
       //$(this).toggleClass('invisible');
	   //$(this).css("height","200px");
	   // $(this).parent().append($tilesMenu);
	   
	   if ($('.tilesDialog').length) {   //check if already exists
			//remove if already exists
			$('.tilesDialog').remove();
			$('.arrow-up_inPane').remove();
			
	   }
	   $(this).append('<div class="arrow-up_inPane"> </div>');
	   
	   var $dialog = $('<div class ="tilesDialog"> </div>');
	   
	   
	   $(this).parent().append($dialog);
	   
	   
	  
	    $.each(images, function( index, value ) {
			   $dialog.append(value); 
		});
		 
	   
	   // if (window.console) console.log($('.tilesDialog').length);
		//if (window.console) console.log(this.id);
		$lastClickedPane = this.id;
		if (window.console) console.log("ijihhih");
    });
	
	
	
	$(document).on('click', '.preview_pane', function () {
		// if (window.console) console.log(this.id);
		 // if (window.console) console.log( $lastClickedPane.find('img').attr('src'));
		 //if (window.console) console.log($lastClickedPane);
		
		//get source of clicked image (in pane)
		$src = $(this).find('img').attr('src');
		//add src to target image 
		$("#" + $lastClickedPane).find('img').attr('src', $src);
	});
	
	//removing the tiles dialog again (http://stackoverflow.com/questions/16448042/how-do-i-remove-element-using-click-and-remove-in-jquery)
	$(document).on("click", ".tilesDialog", function(){
		$(this).remove();
		$('pane_03').remove();
		$('.arrow-up_inPane').remove();
	});
});