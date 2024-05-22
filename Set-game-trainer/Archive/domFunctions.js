

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

	
function addChrono(elementToAttachTo, id, buttonElement, countDownMillis){
	//adds startbutton, minutes and seconds.
	var chronoElement = addDiv(elementToAttachTo, id);
	
	
	// addButton(chronoElement,"start","buttonName", id + "_button", setChrono);
	//var chrono = new Chrono(chronoElement);
	//console.log(chrono);
	//var buttonElement = addButton(chronoElement,"start","buttonName", id + "_button" );
	
	
	var chronoo = new SimpleTimer(10, buttonElement,countDownMillis);
	chronoo.secondsDiv =  addDiv(chronoElement, id+ "_seconds");
	chronoo.minutesDiv = addDiv(chronoElement, id+ "_minutes");
	chronoo.millisDiv =  addDiv(chronoElement, id+ "_millis");
	
	chronoo.ButtonSetToStart(); //has to be done here.
//	console.log(chronoo.Interval);
	
	//addButtonToExecuteGeneralFunction(chronoElement,"start","buttonName", id + "_button", chronoo.Start.bind(chronoo) );
	// buttonElement.addEventListener('click', function(){
		// chronoo.Start.bind(chronoo)(); 
	// });
	return chronoo;
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

function addButtonToExecuteGeneralFunction(elementToAttachTo,caption,name, id, func,arg){
    var button = document.createElement("input");
    button.type = "button";
    button.value = caption;
	button.name = name;
	button.id = id;
    button.addEventListener('click', function(){
		func(arg); 
	});
    elementToAttachTo.appendChild(button);
	
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

function addClassToElement(el, classText){
	el.className = el.className + classText;
}

function setElementBackgroundColor(el, color){
	//color can be hex or name
	//http://stackoverflow.com/questions/10205464/what-is-the-difference-between-background-and-background-color
	el.style.background = color;

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

function addTextBox(elementToAttachTo,text,name,id, size){

	
	var input = document.createElement("input");
	input.type = "text";
	input.id = id;
	input.name = name;
	input.value  = text;
	input.size  = size;
	elementToAttachTo.appendChild(input);
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