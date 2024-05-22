//NEVER USE .innerhtml, it fucks up events that were added!!! Go javascript all the way!


Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

//replace all instances in a string http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript/1145525#1145525
 function replaceAllInstancesInString(str, search, replacement){
       return str.split(search).join(replacement);
    }

	


function addButton(elementToAttachTo,caption,name, id, func){
    var button = document.createElement("input");
    button.type = "button";
    button.value = caption;
	button.name = name;
	button.id = id;
    button.onclick = func;
    elementToAttachTo.appendChild(button);
	return button;
}

function addSelectList(elementToAttachTo, id, name, values ,func){
	//select list dropdown element
	//http://stackoverflow.com/questions/17001961/javascript-add-select-programmatically
	var selectList = document.createElement("select");
	selectList.id = id;
	selectList.name = name;
	selectList.onchange = func;
	repopulateSelectList(selectList, values);
	elementToAttachTo.appendChild(selectList);	
}
function repopulateSelectList(selectList,values){
	//give the selectList, not the id...
	while (selectList.length>0){
		selectList.remove(0);
	}
	for (var i = 0; i < values.length; i++) {
		selectList.add(new Option(values[i],values[i]));
	}
}

function addHtml(elementToAttachTo, htmlString){
	// dont use things like:   parametersDiv.innerHTML = parametersDiv.innerHTML + '<br>';  
	//because it destroys all the child elements of other elements!! (like: onclick, value,.... eventhandlers,...) 
	//do it nicely through the DOM!! 
	//http://stackoverflow.com/questions/595808/is-it-possible-to-append-to-innerhtml-without-destroying-descendants-onclick-fu
	
	var html = document.createElement("div");
	html.innerHTML = htmlString;
	
	//we won't append the div, only the contents, (that is the first child of the div)
	while (html.firstChild) {
        elementToAttachTo.appendChild(html.firstChild);
    }
	

}

 function delay(ms) {
	//terrible delay! use setTimeout( function_reference, timeoutMillis );  to release processor during delay!!!
	//http://stackoverflow.com/questions/24849/is-there-some-way-to-introduce-a-delay-in-javascript
	var cur_d = new Date();
	var cur_ticks = cur_d.getTime();
	var ms_passed = 0;
	while(ms_passed < ms) {
		var d = new Date();  // Possible memory leak?
		var ticks = d.getTime();
		ms_passed = ticks - cur_ticks;
		// d = null;  // Prevent memory leak?
	}
}


function addDiv(elementToAttachTo, id, className){
	className = typeof className !== 'undefined' ? className : "none";
	var div = document.createElement("div");
	div.id = id;
	div.className = className;
	elementToAttachTo.appendChild(div);
	return div;
}


function addParagraph(elementToAttachTo, text, name, id ){
	var paraElement = document.createElement("P");
	var p = document.createTextNode(text);
	paraElement.name = name;
	paraElement.id = id;
	paraElement.appendChild(p);  
	elementToAttachTo.appendChild(paraElement);  
	return paraElement;
}

function addBr(elementToAttachTo){
	var br = document.createElement("br");
	elementToAttachTo.appendChild(br);  
}

function addText(elementToAttachTo, text ,name, id ){
   var p = document.createTextNode(text);
	elementToAttachTo.appendChild(p);  
	return p;
}

// function addTextWithClick(elementToAttachTo, text ,name, id, func, arg ){
    // var textElement = document.createElement("P");
	// var p = document.createTextNode("paragraph<br>ijijd");
	
	
	
	// //p.type = "button";
  
	// textElement.name = name;
	// textElement.id = id;
    // // p.addEventListener('click', function(){
		// // func(arg); 
	// // });
	// textElement.addEventListener('click', function(){
		// alert("iejijfief");
	// });
	// textElement.appendChild(p);  
	// elementToAttachTo.appendChild(textElement);  

// }
function addLinkWithClick(elementToAttachTo, text,name, id, func, arg1,arg2 ){
    var emptyLink = document.createElement('span');
	// var linkText = document.createTextNode("fijeije");
	// emptyLink.appendChild(linkText);
	//emptyLink.innerHTML = text;
	
	emptyLink.text = text;
	
	//p.type = "button";
	//emptyLink.href = "#";
	emptyLink.name = name;
	emptyLink.id = id;	
    emptyLink.addEventListener('click', function(){
		alert("lode");
		//func(arg1,arg2); 
	});
	//emptyLink.onClick = function(){alert("lode");};
	
	
	//textElement.appendChild(p);  
	console.log(emptyLink);
	elementToAttachTo.appendChild(emptyLink);  

}



function addDivWithClick(elementToAttachTo, htmlString ,name, id, func, arg1,arg2 ){
    var textElement = document.createElement("div");
	//var p = document.createTextNode("paragraph<br>ijijd");
	
	textElement.innerHTML = htmlString;
	
	
	//p.type = "button";
  
	textElement.name = name;
	textElement.id = id;	
    textElement.addEventListener('click', function(){
			
		func(arg1,arg2); 
	});
	
	//textElement.appendChild(p);  
	elementToAttachTo.appendChild(textElement);  

}

function addTextBox(elementToAttachTo,text,name,id, size){

	
	var input = document.createElement("input");
	input.type = "text";
	input.id = id;
	input.name = name;
	input.value  = text;
	input.size  = size;
	elementToAttachTo.appendChild(input);
	return input
}

function addCheckBox(elementToAttachTo,id, name, checked, caption){
	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = name;
	checkbox.checked = checked;
	checkbox.id = id;
	elementToAttachTo.appendChild(checkbox);
	
	var label = document.createElement('label');
	label.setAttribute("for",checkbox.id);
	label.setAttribute ("id",id+"_label");
	label.innerHTML = caption;
	elementToAttachTo.appendChild(label);
	
	
}



function addButtonToExecuteGeneralFunction(elementToAttachTo,caption,name, id, func,arg){
    var button = document.createElement("input");
    button.type = "button";
    button.value = caption;
	button.name = name;
	button.id = id;
	
	if (arg.constructor === Array){
		if (arg.length == 2){
		//debugger;
				button.addEventListener('click', function(){
				func(arg[0],arg[1]); 
				//alert("dokeof");
				});
		}
	}else{
	
		button.addEventListener('click', function(){
		func(arg); });
	}
    elementToAttachTo.appendChild(button);
	return button;
}
	
//http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the
(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);	