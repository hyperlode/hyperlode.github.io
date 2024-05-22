
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

// function Chrono(chronoElement){
	// this.chronoElement = chronoElement;
	// this. chronoId = this.chronoElement.id;
	// this.granularity = 1000;
	// //this.start(chronoElement);
// }

// Chrono.prototype.start = function (){
	// //chrono element must have a div chronoId+"seconds"  and chronoId+"minutes" 
	
	// //http://stackoverflow.com/questions/5517597/plain-count-up-timer-in-javascript
	// var sec = 0;
	// function pad ( val ) { return val > 9 ? val : "0" + val; }
	// // this.chrono = setInterval( function(){
		
		// // document.getElementById(this.chronoId + "_seconds").innerHTML=pad(++sec%60);
		// // document.getElementById(this.chronoId + "_minutes").innerHTML=pad(parseInt(sec/60,10));
	// // }, 1000);
	
	// var that = this;
	
	// this.chrono = (function chrono(){
		// console.log("ooiio");
		// setTimeout(chrono, that.granularity);
		// document.getElementById(that.chronoId + "_seconds").innerHTML=pad(++sec%60);
		// document.getElementById(that.chronoId + "_minutes").innerHTML=pad(parseInt(sec/60,10));
	// }()
	// )
	
	
	// var buttonElement = document.getElementById(this.chronoId + "_button");
	
	// buttonElement.addEventListener('click', function(){
		// this.stop.bind(that)(); 
	// });
	// buttonElement.value = "RESET";
	
	
// }

// Chrono.prototype.stop = function (){
	// clearInterval ( this.chrono );
	// // chrono = "";
	// console.log(this.chrono);
	// var buttonElement = document.getElementById(this.id + "_button");
	// // buttonElement.addEventListener('click', function(){
		// // this.start.bind(this); 
	// // });
	 // buttonElement.value = "restart";
	
// }
// Chrono.prototype.reset = function(){
	// //chrono element must have a div chronoId+"seconds"  and chronoId+"minutes" 
	
	// document.getElementById(this.id + "seconds").innerHTML="00";
	// document.getElementById(this.id + "minutes").innerHTML="00";
// }



function padding(stringToBePadded, paddingCharacter, totalLength, padLeftElseRight){
	//will pad any string provided in first argument, with padding character provide in 2nd argument and truncate to lenght provided in third argument 
	// i.e. padding("lode","x","10")  -->  "xxxxxxlode"
	// i.e. padding("lode","x","10",true)  -->  "xxxxxxlode"
	// i.e. padding("lode","x","10",false)  -->  "lodexxxxxx"
	// i.e. padding("12","0","5")  -->  "00012"
	{
		padLeftElseRight = typeof padLeftElseRight !== 'undefined' ? padLeftElseRight : true;
	}
	if (stringToBePadded.length > totalLength){
		console.log("string to long to be padded");
		return stringToBePadded;
	}
	
	var paddingString = paddingCharacter.repeat(totalLength);//make long string of padding characters
	if ( padLeftElseRight){
		return String(paddingString+stringToBePadded).slice(-totalLength);
	}else{ 
		return String(stringToBePadded+paddingString).slice(0,totalLength); 
	}
}



function checkArrayContainsEmptyArrayAsElement(arr){
	//return true if at least one empty array!
	for (var i = 0; i<arr.length; i++){
		
		if (arr[i].length == 0){
			return true;
		}	
	}
	return false;
}

function arrayDeepCopy(array){
	//http://stackoverflow.com/questions/7486085/copying-array-by-value-in-javascript
	return array.slice();

}

function clone(obj) {
	// simple clone an object, so it is a completly different object, and there is no reference towards the old object anymore....
	// http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
	//combined with: http://stackoverflow.com/questions/10086333/duplicate-a-javascript-prototype-instance	
	// USAGE: var d2 = clone(d1);
	if (typeof obj == 'undefined'){
		console.log("ASSERT ERROR obj empty!");
	}
    if (null == obj || "object" != typeof obj) return obj;
    var copy = new obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
// function clone(obj) {
	// //cloning turns out to be surprisingly difficult! The JSON step looks cumbersome but appears to be the fastest.... (and in my case: the only working!	)
	// // // simple clone an object, so it is a completly different object, and there is no reference towards the old object anymore....
	// // // http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object/5344074#5344074
	// // // USAGE: var d2 = clone(d1);
	// if (typeof obj == 'undefined'){
		// console.log("ASSERT ERROR obj empty!");
	// }
	
	// return JSON.parse(JSON.stringify(obj));
     
// }


// function clone(obj) {
	// //simple clone an object, so it is a completly different object, and there is no reference towards the old object anymore....
	// //http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
	// //USAGE: var d2 = clone(d1);

    // if(obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
        // return obj;

    // var temp = obj.constructor(); // changed

    // for(var key in obj) {
        // if(Object.prototype.hasOwnProperty.call(obj, key)) {
			// console.log(obj);
            // obj['isActiveClone'] = null;
            // temp[key] = clone(obj[key]);
            // delete obj['isActiveClone'];
        // }
    // }    

    // return temp;
// }

function arrayIndexAsElement(length){
	var array = [];
	for (var i = 0; i< length; i++){
		array.push(i);
	}
	return array;
}



function shuffleZeroToLengthArray(length){
	//length is int
	
	return shuffle(arrayIndexAsElement(length));
}

function shuffle(array) {
  //http://bost.ocks.org/mike/shuffle/
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function createArrayWithMultipliedIndexAsValue(length, multiplier){
{
		multiplier = typeof multiplier !== 'undefined' ? multiplier : 1;
	}


	var a = [];
    for (var i = 0; i < length ; i++) {
         a.push(i*multiplier);
    }
    return a;
}

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
	//not an INT!!!
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomIntIncludingMinAndMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



//returns the index of a certain element in an array (prototype of array)
var indexOf = function(element) {
	// usage:
	// var myArray = [0,1,2],
    // needle = 1,
    // index = indexOf.call(myArray, needle); // 1
	
	//http://stackoverflow.com/questions/1181575/javascript-determine-whether-an-array-contains-a-value
	
    if(typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(element) {
            var i = -1, index = -1;
            for(i = 0; i < this.length; i++) {
                if(this[i] === element) {
                    index = i;
                    break;
                }
            }
            return index;
        };
    }
    return indexOf.call(this, element);
};


function beep() {
	//http://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
	//document.getElementsByTagName("button")[0].addEventListener("click",beep);
    var snd = new  Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}

function getKeys(associativeArray){
	//http://stackoverflow.com/questions/558981/iterating-through-list-of-keys-for-associative-array-in-json
	var keys = [];
	for (var key in associativeArray) {
		if (associativeArray.hasOwnProperty(key)) {
			keys.push(key);
		}
	}
	return keys;
}

// http://stackoverflow.com/questions/14832603/check-if-all-values-of-array-are-equal
Array.prototype.allValuesSame = function() {

    for(var i = 1; i < this.length; i++)
    {
        if(this[i] !== this[0])
            return false;
    }

    return true;
}

Array.prototype.allValuesUnique = function () {
    var r = new Array();
	var allUnique = true;
    checkLabel:for(var i = 0, n = this.length; i < n; i++)
    {
    	for(var x = 0, y = r.length; x < y; x++)
    	{
    		if(r[x]==this[i])
    		{
                allUnique = false;
    			break checkLabel;
    		}
    	}
    	r[r.length] = this[i];
    }
    return allUnique;
}

Array.prototype.remove = function() {
	//remove specific element.
	// var ary = ['three', 'seven', 'eleven'];

	// ary.remove('seven');

    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


// //http://stackoverflow.com/questions/840781/easiest-way-to-find-duplicate-values-in-a-javascript-array
Array.prototype.getUniqueValues = function () {
    var r = new Array();
    o:for(var i = 0, n = this.length; i < n; i++)
    {
    	for(var x = 0, y = r.length; x < y; x++)
    	{
    		if(r[x]==this[i])
    		{
                // alert('this is a DUPE!');
    			continue o;
    		}
    	}
    	r[r.length] = this[i];
    }
    return r;
}