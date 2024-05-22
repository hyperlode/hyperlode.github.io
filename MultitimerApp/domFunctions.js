
///////////////////
//getting properties from the DOM
///////////////////



function getElementHeight(element, isTotalHeight){
	// isTotalHeight triggers offsetHeight
	//The offsetHeight property is similar to the clientHeight property, but it returns the height including the padding, scrollBar and the border.
	//http://stackoverflow.com/questions/15615552/get-div-height-with-plain-javascript
	{
		isTotalHeight = typeof isTotalHeight !== 'undefined' ? isTotalHeight : true;
		
	}
	
	if (isTotalHeight){
		return  element.offsetHeight;
	}else{
		return element.clientHeight;
	}
}

function setElementHeight(element,pixelHeight, setAsMinimumHeight){
	//setAsMinimumHeight: is set, we define the minimum height, so it can still become higher if things change...
	{
		setAsMinimumHeight = typeof setAsMinimumHeight !== 'undefined' ? setAsMinimumHeight : false;
	}
	var heightStr = "" + pixelHeight + "px";
	if (setAsMinimumHeight){
		element.style.minHeight = heightStr; // pixels
	}else{
		element.style.height = heightStr; // pixels
	}
}

function setElementBackgroundColor(el, color){
	//color can be hex or name
	//http://stackoverflow.com/questions/10205464/what-is-the-difference-between-background-and-background-color
	el.style.background = color;

}

function equalizeHeights(elements){
	var heights = [];
	for (var i=0;i<elements.length;i++){
		heights.push(getElementHeight(elements[i],true));
	}
	
	var maxHeight =  heights[biggestElementIndex(heights)];
	
	for (var i=0;i<elements.length;i++){
		setElementHeight(elements[i],maxHeight,true);
	}
}
///////////////////
//changing the DOM
///////////////////


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

///////////////////
//Adding stuff to the DOM
///////////////////

function addButton(elementToAttachTo,caption,name, id, func){
    var button = document.createElement("input");
    button.type = "button";
    button.value = caption;
	button.name = name;
	button.className += "btn btn-default";  //bootstrap
	button.id = id;
    button.onclick = func;
    elementToAttachTo.appendChild(button);
	
}

function addSelectList(elementToAttachTo, id, name, values ,func){
	//select list dropdown element
	//http://stackoverflow.com/questions/17001961/javascript-add-select-programmatically
	var selectList = document.createElement("select");
	selectList.id = id;
	selectList.name = name;
	selectList.onchange = func;
	//selectList.class = "selectpicker"; //added 20150531
	repopulateSelectList(selectList, values);
	//addClassToElement(selectList, "selectpicker"); //bootstrap.
	
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

function addDiv(elementToAttachTo, id){
	var div = document.createElement("div");
	div.id = id;
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
	
	//input.className += "form-control";  //bootstrap
	//input.placeholder = "ttoiejije";
	elementToAttachTo.appendChild(input);
	return input;
}

function addLabel(elementToAttachTo,text){
	var label = document.createElement("label");
	//label.innerHTML = text;
	label.innerHTML= text;
	elementToAttachTo.appendChild(label);
	//console.log(label);
	return label;
}

function addParagraph(elementToAttachTo,text,id){
	var p = document.createElement("p");
	p.textContent = text;
	elementToAttachTo.appendChild(p);
	return p;
	
}
function addClassToElement(el, classText){
	el.className = el.className + classText;
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
	return checkbox;
	// // var label = document.createElement("label");
	// // //label.innerHTML = text;
	// // elementToAttachTo.appendChild(label);
	
	// // var checkbox = document.createElement('input');
	// // checkbox.type = "checkbox";
	// // checkbox.checked = checked;
	// // checkbox.id = id;
	// // label.appendChild(checkbox);
	// // addParagraph(label,caption,"killAtEndLabel")
	// // console.log(label);
	// // return label;
}


function addButtonToExecuteGeneralFunction(elementToAttachTo,caption,name, id, func,arg){
    var button = document.createElement("input");
    button.type = "button";
    button.value = caption;
	button.name = name;
	button.id = id;
    button.addEventListener('click', function(){
    func(arg); });
    elementToAttachTo.appendChild(button);
	
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