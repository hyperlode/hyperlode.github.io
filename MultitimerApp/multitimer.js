var MULTITIMER_NUMBER_OF_TIMERS_INIT = 2;
var MULTITIMER_TIMESTRING_DEFAULT = "0h10m0s";
var EASYMODE = true;
var MULTITIMER_DEFAULT_TIMER_NAME = "Timer";
var RANDOMSTARTER_VALUE_IN_SELECTLIST= "Random starter!";
var BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS = ["Assign a count-down time", "Assign a count-up time", "Subtract a time", "Add a time"];
var TEXTBOX_DEFAULT_SIZE = 10;
var TIMER_COLORS = ["#016ecd","#4aafcd","#5ab75c","#faa632","#da4f4a"]; //http://www.color-hex.com/color-palette/2714

window.timers = new Array(); //MULTITIMER_NUMBER_OF_TIMERS_INIT
//var multitimerNames = new Array(); 
//var multitimerIds = new Array(); 

window.activeTimerId = -1;  //-1 is undefined! (i.e. with random player)
window.multitimerStatus = {running:false,paused:false,randomStarter:false, init:true};
window.multitimerTimersIdSequence = [];


//store timers data. 
window.multitimerData = {};

//todo: scroll to active timer when playing: document.getElementById('youridhere').scrollIntoView(); 	  //http://stackoverflow.com/questions/68165/javascript-to-scroll-long-page-to-div

// use an anonymous function
//jquery alternative: $("document").ready(function () {
docReady(function() { 
	window.multitimerStatus.init = true;
	

	
	////set refresh interval
	//setInterval(updateTime, 100); //2nd arg = millis : 1=once every milli, 1000=once every second
	
	////init graphics
	//svgEl = document.getElementById("fun");
	//addSvg(svgEl, "bolletjes",1000, 1000,"white");
	//window.minutesEdgeDetector = -100; //initialize edge detector
	
	
	/////////////////
	//add-timer field
	//////////////////
	
	
	var global_addTimer =  document.getElementById("global_addTimer");
	//addHtml(global_addTimer, '<form class="form-inline">');
	var form = document.createElement("form");
	form.className = form.className + "form-horizontal"; 
	global_addTimer.appendChild(form);
	
	//title
	addHtml(form, "<h2 class='col-xs-10 col-xs-offset-2'>Step 1: Add Timers</h2>")
	
	//http://getbootstrap.com/css/#forms-horizontal
	//set timer name
	var formDiv = addDiv(form, "timerName");
	formDiv.className = formDiv.className + "form-group";
	var label = addLabel(formDiv, "Name");
	label.className = label.className + "col-sm-2 control-label";
	var formInputDiv = addDiv(formDiv, "timerNameInput");
	formInputDiv.className = formInputDiv.className + "col-sm-10";
	var input = addTextBox(formInputDiv,MULTITIMER_DEFAULT_TIMER_NAME,"add_timer_name","add_timer_name",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	input.className = input.className + "form-control";
	input.oninput = DOMaddTimerNamePreview;
	
	
	//set timer time input
	var formDiv = addDiv(form, "timerTime");
	formDiv.className = formDiv.className + "form-group";
	var label = addLabel(formDiv, "Time");
	label.className = label.className + "col-sm-2 control-label";
	var formInputDiv = addDiv(formDiv, "timerTimeInput");
	formInputDiv.className = formInputDiv.className + "col-sm-10";
	var input = addTextBox(formInputDiv,MULTITIMER_TIMESTRING_DEFAULT,"set_addTimer_time_input","set_addTimer_time_input",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	input.className = input.className + "form-control";
	
	//checkbox "Kill at end"
	var formDiv = addDiv(form);
	addClassToElement(formDiv, "row");
	var checkBoxDiv = addDiv(formDiv);
	checkBoxDiv.className = checkBoxDiv.className + "col-sm-2";
	var checkBoxDiv = addDiv(formDiv, "checkBoxKillAtAndDiv");
	var checkBox = addCheckBox(checkBoxDiv, "killAtSetTime", "killAtSetTime", true, "Delete when time elapsed"); //Delete timer when countdown finished. (= Counting up disabled)
	addClassToElement(checkBox, "checkbox-inline");
	checkBoxDiv.className = checkBoxDiv.className + " col-sm-10";
	
	//button
	var formDiv = addDiv(form);
	addClassToElement(formDiv, "row");
	var div = addDiv(formDiv);
	div.className = div.className + "col-sm-2";
	var div = addDiv(formDiv, "buttonAddTimerDiv");
	addHtml(div, "<p id= 'addTimerNamePreview' >Name preview</p>")
	addButton(div, "Add Timer","Add", "multitimer_addTimer", addTimerFromDOM); 
	
	//document.getElementById("addTimerNamePreview").innerHTML= "hoitjes";
	div.className = div.className + " col-sm-10";
	
	// // //var input = addTextBox(formInputDiv,MULTITIMER_DEFAULT_TIMER_NAME,"add_timer_name","add_timer_name",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	// // // addHtml(global_addTimer, '<br>Time:');
	// // // addTextBox(global_addTimer,MULTITIMER_TIMESTRING_DEFAULT,"set_addTimer_time_input","set_addTimer_time_input",TEXTBOX_DEFAULT_SIZE);
	// // //addHtml(global_addTimer, '<br>');
	// // //addButton(global_addTimer, "AddTimer","Add", "multitimer_addTimer", addTimerFromDOM); 
	// // //addCheckBox(global_addTimer, "killAtSetTime", "killAtSetTime", true, "Delete timer when countdown finished. (= Counting up disabled)");
	
	
	
	
	///////////////////////
	//multitimer parameters 
	///////////////////////
	
	var multitimer_parameters = document.getElementById("multitimer_parameters");
	var form = document.createElement("form");
	addClassToElement(form,"form-horizontal"); 
	multitimer_parameters.appendChild(form);
	//title
	addHtml(form, "<h2 class='col-xs-10 col-xs-offset-2'>Step 2: Set MultiTimer</h2>")
	
	//sequence
	var formDiv = addDiv(form, "sequenceSetting");
	addClassToElement(formDiv, "form-group");
	var label = addLabel(formDiv, "Sequence");
	addClassToElement(label, "col-sm-2 control-label");
	var formInputDiv = addDiv(formDiv);
	addClassToElement(formInputDiv, "col-sm-10");
	//addSelectList(formInputDiv, "behaviour_setTime_selectList", "addOrSubtract_setTime_selectList", BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS);
	//addDiv(formInputDiv,"sequence");
	var label = addLabel(formInputDiv, "TestTest");
	label.id = "sequence";
	
	
	
	//button
	var formDiv = addDiv(form);
	addClassToElement(formDiv, "row");
	var div = addDiv(formDiv);
	div.className = div.className + "col-sm-2";
	var div = addDiv(formDiv);
	addButton(div, "Set Random Sequence","random_sequence", "multitimer_generateRandomSequence", randomSequence ); 
	div.className = div.className + " col-sm-10";
	document.getElementById("multitimer_generateRandomSequence").setAttribute('onclick','randomSequence();');
	
	var element = document.createElement('hr');
	div.appendChild(element);
	
	//set starter
	var formDiv = addDiv(form, "setStarter");
	addClassToElement(formDiv, "form-group");
	var label = addLabel(formDiv, "Starter");
	addClassToElement(label, "col-sm-2 control-label");
	var div = addDiv(formDiv);
	addClassToElement(div, "col-sm-10");
	//addSelectList(formInputDiv, "behaviour_setTime_selectList", "addOrSubtract_setTime_selectList", BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS);
	addSelectList(div, "startTimer_selectList", "startTimer_selectList", [] ,setActiveTimerFromMenu);
	
	
	//var parametersDiv = document.getElementById("multitimer_parameters");
	
	//addTextBox(parametersDiv,"","sequence","sequence",100);  //elementToAttachTo,text,name,id){
	// addHtml( parametersDiv,'Sequence of timers: ');
	
	// addDiv(parametersDiv, "sequence");
	
	// addButton(parametersDiv, "Set Random Sequence","random_sequence", "multitimer_generateRandomSequence", randomSequence ); 
	//document.getElementById("multitimer_generateRandomSequence").setAttribute('onclick','randomSequence();');
	// addHtml( parametersDiv,'<br><br>');
	// addHtml( parametersDiv,'Define start timer:');
	// addSelectList(parametersDiv, "startTimer_selectList", "startTimer_selectList", [] ,setActiveTimerFromMenu);

	
	
	
	//Multitimer setting:
	////////////////
	//set-time field
	////////////////
	var global_TimeSetting = document.getElementById("global_TimeSetting");
	var form = document.createElement("form");
	addClassToElement(form,"form-horizontal"); 
	global_TimeSetting.appendChild(form);
	
	//title
	addHtml(form, "<h2 class='col-xs-10 col-xs-offset-2'>Optional step: Edit </h2>")
	
	//set action
	var formDiv = addDiv(form, "setTimeAction");
	addClassToElement(formDiv, "form-group");
	var label = addLabel(formDiv, "Action");
	addClassToElement(label, "col-sm-2 control-label");
	var formInputDiv = addDiv(formDiv, "setTimeActionSelect");
	addClassToElement(formInputDiv, "col-sm-10");
	addSelectList(formInputDiv, "behaviour_setTime_selectList", "addOrSubtract_setTime_selectList", BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS);
	
	//set value
	var formDiv = addDiv(form, "setTimeValue");
	addClassToElement(formDiv, "form-group");
	var label = addLabel(formDiv, "Time");
	addClassToElement(label, "col-sm-2 control-label");
	var formInputDiv = addDiv(formDiv, "setTimeActionSelect");
	addClassToElement(formInputDiv, "col-sm-10");
	var input = addTextBox(formInputDiv,MULTITIMER_TIMESTRING_DEFAULT,"set_global_time_input","set_global_time_input",TEXTBOX_DEFAULT_SIZE);
	addClassToElement (input, "form-control");
	
	//Target
	var formDiv = addDiv(form, "setTimeTarget");
	addClassToElement(formDiv, "form-group");
	var label = addLabel(formDiv, "Target");
	addClassToElement(label, "col-sm-2 control-label");
	var formInputDiv = addDiv(formDiv, "setTimeActionSelect");
	addClassToElement(formInputDiv, "col-sm-10");
	addSelectList(formInputDiv, "setTimeTimer_selectList", "setTimeTimer_selectList", []);
	
	//button
	var formDiv = addDiv(form);
	addClassToElement(formDiv, "row");
	var div = addDiv(formDiv);
	addClassToElement(div, "col-sm-2");
	var div = addDiv(formDiv, "buttonAddTimerDiv");
	addButton(div, "Set","Set", "set_global_time_btn", setGlobalTime); 
	addClassToElement(div, "col-sm-10");
	// div.className = div.className + " col-sm-10";
	
	
	//equalize height of the three elements; should not be done if displayed below each other, but... let's not bother about that now!
	equalizeHeights([global_addTimer,multitimer_parameters,global_TimeSetting]);
	
	
	
	/////////////
	//start field
	/////////////	
	global_start = document.getElementById("global_start");
	//addButton(div, "Stop!","Stop", id+"_stop",  this.stopTimer.bind(this)); //bind this, makes sure we apply the function to the instance!
	addButton(global_start, "Start","Start", "multitimer_startPause", startMultitimer ); 
	
	addButton(global_start, "Next","Next", "multitimer_nextTimer", activateNextTimer ); 
		
	addButton(global_start, "Delete All Timers","Kill All Timers", "multitimer_deleteAllTimers", deleteAllTimers ); 	
	addButton(global_start, "Reset","Reset", "multitimer_restoreAllTimers", resetMultitimer ); 	
	addHtml(global_start,  "<br>Super Shortcuts: <br>SPACE or ENTER = Next Player <br> ESCAPE = (un)pause");
	
	
	
	
	//////////////////////
	//active timer display
	//////////////////////
	var activeTimerDiv = addDiv(document.getElementById("activeTimers"), "activeTimer");
	var activeTimerDispDiv = addDiv(activeTimerDiv, "activeTimerDisp");
	addHtml(activeTimerDispDiv,  "Time of active Timer will be displayed here! Press start or hit space to begin!");
	//title
	addHtml(activeTimerDiv, "<h2 class='row-centered' id='activeTimerName'></h2>");
	addHtml(activeTimerDiv, "<h1 class='row-centered' id='activeTimerTime'></h1>");
	addHtml(activeTimerDiv, "<h3 class='row-centered' id='activeTimerInfo'></h3>");
		
	//initDisplay("displaytest");
	
	
	//////////////////////
	//advanced parameters.
	//////////////////////
	if (!EASYMODE){
		globalEndTimeDiv = addDiv(document.getElementById("multitimer"), "global_endTimeField");
		//globalEndTimeDiv = document.getElementById("global_endTimeField");
		addCheckBox(globalEndTimeDiv, "killAtSetTime", "killAtSetTime", true, "Automatic kill at set time");
		addTextBox(globalEndTimeDiv, END_TIME_DEFAULT_SECONDS, "EndTime","endTimeTextBox");
		document.getElementById("killAtSetTime").onclick =setGlobalEnableKillTimeFromCheckBox;
		document.getElementById("endTimeTextBox").onkeypress = checkEndTime;
		document.getElementById("endTimeTextBox").onkeyup = checkEndTime;
		addButton(globalEndTimeDiv, "Set!","SetEndTime","setEndTime", setEndTime); //bind this, makes sure we apply the function to the instance! //http://stackoverflow.com/questions/21507320/using-function-prototype-bind-with-an-array-of-arguments (see cody's comment at solution)
	}
	
	//add timers 	
	// for (var i = 0; i<MULTITIMER_NUMBER_OF_TIMERS_INIT;i++){
		// addTimerFromDOM();
	// }
	DOMaddTimerNamePreview();
	//define sequence of timers
	setAutoSequence();
	populateStartTimerSelectMenu();
	populateSetTimeTimerSelectMenu();
	// timerNamesAndIdsToList();
	setActiveTimerFromMenu();
	// randomRadioValueChange();
	// radioIsStartDefinedTimerValueChange();
	setGlobalEnableKillTimeFromCheckBox();
	
	//save default state. (normally only saved when start pressed).
	saveMultitimer();
	
	
	
	setLayout();
	
});


// document.onkeydown = function(evt) {
	// //key press nicely working!
    // evt = evt || window.event;
    // var chr = evt.keyCode;
	// if ( chr == 27 || chr == 32) {
        // //console.log(chr);
		
		// if (document.activeElement.id !== "multitimer_startPause"){
			// activateNextTimer();
		// }
  // }
  
  
  
// };



document.onkeydown = function(e){
	//http://stackoverflow.com/questions/940180/using-prevent-default-to-take-over-spacebar
	console.log(e.keyCode);
	//e= e || window.event); you may need this statement to make sure IE doesn't keep the orginal event in motion
	var code;  
	if (e.keyCode) {
		code = e.keyCode;
	} else if (e.which) {
		code = e.which;
	}
	
	//space and enter for next 
	if (code == 32 || code == 13 ) {
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}
		//return false;
		activateNextTimer();
	}
	
	
	//esc for (un)pause
	if (code == 27) {
		if (e.stopPropagation) {
			e.stopPropagation();
			e.preventDefault();
		}
		//return false;
		pauseToggleMultitimer();
	}
	
	
	
	  
	
};

function initDisplay(id){
	//http://www.3quarks.com/en/SegmentDisplay/
  // var display = new SegmentDisplay(id);
  // display.pattern         = "##:##:##";
  // display.cornerType      = 2;
  // display.displayType     = 7;
  // display.displayAngle    = 9;
  // display.digitHeight     = 20;
  // display.digitWidth      = 12;
  // display.digitDistance   = 2;
  // display.segmentWidth    = 3;
  // display.segmentDistance = 0.5;
  // display.colorOn         = "rgba(0, 0, 0, 0.9)";
  // display.colorOff        = "rgba(0, 0, 0, 0.1)";
	
	var display = new SegmentDisplay(id);
  display.pattern         = "##:##:##";
  display.cornerType      = 2;
  display.displayType     = 7;
  display.displayAngle    = 9;
  display.digitHeight     = 200;
  display.digitWidth      = 120;
  display.digitDistance   = 20;
  display.segmentWidth    = 30;
  display.segmentDistance = 2;
  display.colorOn         = "rgba(0, 0, 0, 0.9)";
  display.colorOff        = "rgba(0, 0, 0, 0.005)";
	
	
	 window.lode = display;
	// console.log(display);
}

function updateDisplay(id,timeMillis){
	//disp = document.getElementById(id);
	//http://www.3quarks.com/en/SegmentDisplay/
	
	window.lode.setValue(millisToString(timeMillis,true,false,false,true,true,true));

}

function DOMaddTimerNamePreview(){
	var name = document.getElementById("add_timer_name").value;
	name = getUniqueNameFromNameInput(name);
	document.getElementById("addTimerNamePreview").innerHTML= "There are now " + timers.length + " timers.<br> Click to add timer " + name + " below." ;

}

function domDisplayActiveTimer(name, timeMillis, isCountUpElseCountDown){
	{
		 name= typeof name !== 'undefined' ?  name: "Random starter";
		 timeMillis= typeof  timeMillis!== 'undefined' ? timeMillis : "0";
		 isCountUpElseCountDown= typeof  isCountUpElseCountDown!== 'undefined' ?  isCountUpElseCountDown: false;
	}	
		
	
	
	
	var disp = document.getElementById("activeTimerDisp");
	var str = name;
	
//	str + = " is the active count down timer. Time remaining: " +  +
	if (isCountUpElseCountDown){
		//var timeStr = millisToString( timeMillis);
		var info = "Counting up";
	}else{
		timeMillis=  -timeMillis;
		var info = "Counting down";
	}
	
	str += millisToString( timeMillis);
	
	var dispActiveTimerTime = document.getElementById("activeTimerName");
	dispActiveTimerTime.innerHTML = name;
	var dispActiveTimerTime = document.getElementById("activeTimerTime");
	dispActiveTimerTime.innerHTML =  millisToString( timeMillis);
	var dispActiveTimerTime = document.getElementById("activeTimerInfo");
	dispActiveTimerTime.innerHTML = info;
	
	
	str += "<br> hit space or click next to switch to the next timer!";
	
	
	//updateDisplay("displaytest",timeMillis);
	
	
	
}

function updateMultitimerDisplay(){
	var disp = document.getElementById("activeTimerDisp");
	if (window.timers.length<1){
		disp.innerHTML = "Add timers to the multitimer to get started!";
		domDisplayActiveTimer("Add timers!", 0, true);
	}else if(window.activeTimerId == -1){
		disp.innerHTML = "Press the start button. If you don't chose a starting timer in the menu, a random timer will start.";
		setElementBackgroundColor(disp, "white");
		domDisplayActiveTimer("Random Starter!", 0, true);
	}else if (window.multitimerStatus.running || window.multitimerStatus.init){
		//disp.displayTimerAsActiveTimer();
	}else{
		disp.innerHTML = "NO STATUS";
	}
	setGlobalStartButtonDOM();
	
	
	
	if (window.activeTimerId !== -1){
		setElementBackgroundColor(disp, window.timers[getTimerIndexFromId(window.activeTimerId)].color);
		window.timers[getTimerIndexFromId(window.activeTimerId)].displayTimerAsActiveTimer();
	}else{
		
	}
}

function setLayout(){
	var d = document.getElementById("multitimer_startPause");
	d.className = d.className + "btn btn-success";
	
	
	//var d = document.getElementById("behaviour_setTime_selectList");
	//d.className = d.className + "selectpicker";
	// var timers = document.getElementsByClassName("timer");
    // [].forEach.call(timers, function () {
		
		// });
}

function refreshLayoutDOM(){
	equalizeHeights([document.getElementById("multitimer_parameters"),document.getElementById("global_addTimer"),document.getElementById("global_TimeSetting")]);

}

 

 function saveMultitimer(){
	//save general information
	window.multitimerData = {};
	window.multitimerData.general = {};
	//save timers
	window.multitimerData.timers = {};
	for (var i=0; i<window.timers.length; i++){
		window.multitimerData.timers[i] = {id:window.timers[i].id , 'name':window.timers[i].name, 'time':window.timers[i].timerTimeMillis, 'autokill':window.timers[i].enableKillTime}; 
	}
	
 }
 
 function resetMultitimer(){
	//console.log("resetting!");
	//console.log(window.multitimerData);
	deleteAllTimers();
	window.multitimerStatus = {running:false,paused:false,randomStarter:false, init:true};
	loadMultitimer(window.multitimerData);
 }
 
 function loadMultitimer(data){
	
	timerIndexes  = getKeys(data.timers);
	
	for (var i = 0; i<timerIndexes.length;i++){
		addTimer(data.timers[i].name, data.timers[i].time, data.timers[i].autokill);
	}
 }
 //dom
function setActiveTimerFromMenu(){
	if (!window.multitimerStatus.running){
		startTimerName = document.getElementById("startTimer_selectList").value; //returns the value!!! not the index!!! //todo not protected against multiple selected values, or i should implement that this is possible feature request! !!
		
		//console.log(startTimerName);
		
		if (startTimerName == RANDOMSTARTER_VALUE_IN_SELECTLIST){
			setActiveTimerById(-1);
		}else{
			setActiveTimerById(window.timers[getTimerIndexFromName(startTimerName)].id);
		}
	}
}

/////// functions ////////

function checkEndTime(){
	console.log(stringToMillis(document.getElementById("endTimeTextBox").value));
}


function setGlobalEnableKillTimeFromCheckBox(){
	var enable =  document.getElementById("killAtSetTime").checked;
	for (var i= 0; i<window.timers.length;i++){
		window.timers[i].setEnableKillTime(enable);
	}
}



//DOM
function populateSetTimeTimerSelectMenu(){
	var select = document.getElementById("setTimeTimer_selectList");
	var vals = ["All Timers"];
	for (var i= 0; i<window.timers.length;i++){
		vals.push(getTimerNameFromIndex(i));
	}
	//d(vals);
	repopulateSelectList(select, vals);
}

//DOM
function populateStartTimerSelectMenu(){
	var select = document.getElementById("startTimer_selectList");
	var vals = [RANDOMSTARTER_VALUE_IN_SELECTLIST];
	for (var i= 0; i<window.timers.length;i++){
		vals.push(getTimerNameFromIndex(i));
	}
	repopulateSelectList(select, vals);
	
}


//DOM
function setEndTime(){
	var millis = stringToMillis(document.getElementById("endTimeTextBox").value);
	for (var i= 0; i<window.timers.length;i++){
		
		document.getElementById(window.timers[i].id+"_killAtSetTime_label").innerHTML = "Automatic kill when timer reaches: " + millisToString(millis); 
		window.timers[i].killTimeMillis =  millis;
	}
	
}


function setActiveTimerById(id){
	window.activeTimerId = id;
	updateMultitimerDisplay();
	
	//window.timers[getTimerIndexFromId(window.activeTimerId)].displayTimerAsActiveTimer();
}

function activateNextTimer(){
	
	if ( ((!window.multitimerStatus.running && !window.multitimerStatus.randomStarter) || window.multitimerStatus.running) &&  window.activeTimerId !== -1 && window.timers.length>1){
		
		var timerRunning = window.timers[getTimerIndexFromId(window.activeTimerId)].status.running; //true or false
		if (timerRunning){
			window.timers[getTimerIndexFromId(window.activeTimerId)].status.running = false; //stop this timer (always...)
		}
		
		window.activeTimerId = getNextTimerId();
		setActiveTimerById(window.activeTimerId);
		
		if (timerRunning){
			startTimerById(window.activeTimerId);
		}
	}
}

function getTimerIndexFromId(id){
	for (var i= 0; i<window.timers.length;i++){
		if (window.timers[i].id == id){
			return i;
		}
	}
}

function getTimerIndexFromName(name){
	for (var i= 0; i<window.timers.length;i++){
		if (window.timers[i].name == name){
			return i;
		}
	}
}

function getTimerNameFromIndex(index){
	return window.timers[index].name;
}
function getTimerIdFromIndex(index){
	return window.timers[index].id;
}

function getTimerNameFromId(id){
	return getTimerNameFromIndex(getTimerIndexFromId(id));

}

function getTimerIds(){
	ids = [];
	for (var i = 0; i<window.timers.length; i++){
		ids.push(window.timers[i].id);
	}
	return ids;
}

function getTimerNames(){
	names = [];
	for (var i = 0; i<window.timers.length; i++){
		names.push(window.timers[i].name);
	}
	return names;
}

function multitimerIdExists(id){
	return ( indexOf.call(getTimerIds(), id) !== -1 ); // 1
}

function multitimerNameExists(name){
	return ( indexOf.call(getTimerNames(), name) !== -1 ); // 1
}

function randomSequence(){
	window.multitimerTimersIdSequence = shuffleZeroToLengthArray(window.timers.length);
	updateSequence();
	
}

function setAutoSequence(){
	window.multitimerTimersIdSequence = arrayIndexAsElement(window.timers.length)
	updateSequence();
}

function updateSequence(){
	//don't touch the original sequence list
	//ids = arrayDeepCopy(window.multitimerTimersIdSequence);
	
	//only take valid ids (don't include the deleted timers.)
	var ids = [];
	for (var i=0;i<window.multitimerTimersIdSequence.length;i++){
		id = window.multitimerTimersIdSequence[i];
		if (multitimerIdExists(id)){
			ids.push(id);
		}
	}
	
	//console.log(ids);
	
	//set up sequence
	var str = ""
	if (ids.length > 1) {
		//add sequence info to the timers 
		for (var i = 0; i<ids.length-1; i++){
			window.timers[getTimerIndexFromId(ids[i])].setNextTimerId(ids[i+1]);
		}
		window.timers[ getTimerIndexFromId(ids[ids.length-1])].setNextTimerId(ids[0]);
		
		//sequence string
		str += getTimerNameFromId(ids[0]);
		for (var i = 0; i<ids.length-1; i++){
			str += " --> "+getTimerNameFromId(ids[i+1]);
		}
		//str += " -back-to-> "+getTimerNameFromId(ids[0]);
		
	}else{
		str =  "At least 2 timers required for sequence"; 
	}
	document.getElementById("sequence").innerHTML= str;
	refreshLayoutDOM();
}



function setGlobalStartButtonDOM(){
	button = document.getElementById("multitimer_startPause");
	
	if (window.multitimerStatus.init){
		button.value = "Start";
		button.onclick = startMultitimer;
	}else if (window.multitimerStatus.paused){
		button.value = "Continue...";
		button.onclick = pauseToggleMultitimer;
	}else if (!window.multitimerStatus.paused){
		button.value = "Pause";
		button.onclick = pauseToggleMultitimer ;
	}else{
		button.value = "undefined";
	}
}

function startMultitimer(){

	saveMultitimer();

	//check incremental or absolute.
	if (!window.multitimerStatus.running && window.timers.length>0 ){
		// var setRandom = document.getElementById("isStartRandom").checked;
		if (window.activeTimerId == -1){
			var rand=getRandomIntIncludingMinAndMax(0,window.timers.length-1);
			setActiveTimerById(window.timers[rand].id);
			window.timers[rand].setTimerState(true);
		}else{ 
			window.timers[getTimerIndexFromId(window.activeTimerId)].setTimerState(true);
		}
		window.multitimerStatus.running = true;
		window.multitimerStatus.init = false;
	}
	setGlobalStartButtonDOM();
}

function pauseToggleMultitimer (){
	if (window.multitimerStatus.running){
		//if (window.multitimerStatus.paused ){
			window.timers[getTimerIndexFromId(window.activeTimerId)].setTimerState(window.multitimerStatus.paused); //toggle status
			window.multitimerStatus.paused = !window.multitimerStatus.paused;
		//}else{
		//	timers[getTimerIndexFromId(window.activeTimerId)].setTimerState(false);
		//}
	}
	setGlobalStartButtonDOM();
	
	
}

function getNextTimerId(){
	
	var activeTimerIndex = getTimerIndexFromId(window.activeTimerId);
	console.log("next id: " + window.timers[activeTimerIndex].getNextTimerId());
	return  window.timers[activeTimerIndex].getNextTimerId();
	

	// var nextId = 0; //if no timer is running, the first one in the array will be started...
	// //get first running timer
	// for (var i= 0; i<timers.length;i++){
		// // console.log ( timers[i].nextTimerId);
		// if (timers[i].status.running){
			
			// timers[i].setTimerState(false); 
			// nextId = timers[i].nextTimerId; 
			// // console.log("id:");
			// // console.log (nextId);
			// //timers[1].setTimerState(true); 
			// break; //make sure we have the first running timer (if multiple would be working...)
		// }
	// }
	// return nextId;
}

function startTimerById(id){

	timers[ getTimerIndexFromId(id)].setTimerState(true) ;
	
	setGlobalStartButtonDOM();
	
}



function timerStarted(id, timeStamp){

}

function timerStopped(id, timeStamp	){

}

function printTimerIds(){
	str = ""
	for (var i= 0; i<window.timers.length;i++){
		str = str +"---" + window.timers[i].id;
	}
	return str;
}

function getUniqueNameFromNameInput(name){
	//check name
	var nameOrig = name;
	//check if equilly named timers exist, if so, add a number. For the default name  always add a number!
	var nameAddition = 1;
	while(multitimerNameExists(name) || name == MULTITIMER_DEFAULT_TIMER_NAME){
		name = nameOrig + "_" + nameAddition;
		nameAddition++;
	};
	return name;
};

function addTimer(name, timeMillis, autoKill){
	//console.log(timeMillis);
	//search for an id for the new timer.
	var id = -1;
	var i = 0;
	var existsAlready = true;
	
	var ids  = getTimerIds();
	while(existsAlready){
		 id++;
		if (indexOf.call(ids, id) ==-1){ //get index of id in ids, if not exists, returns -1  (see general functions)
			existsAlready = false;
		}
	}

	name = getUniqueNameFromNameInput(name);
	
	
	var color = TIMER_COLORS [ id % TIMER_COLORS.length ];
	// console.log("color"+color);
	// console.log(id % TIMER_COLORS.length);
	//create timer
	window.timers.push( new Timer (id, name, timeMillis/1000, new Date(),EASYMODE, autoKill, color ));
	//timers.push( new Timer (id, name, timeMillis/1000, new Date(), test =  "lode"));
	
	//do the home work. define sequence of timers
	setAutoSequence();
	populateStartTimerSelectMenu();
	populateSetTimeTimerSelectMenu();
	// timerNamesAndIdsToList();
	updateMultitimerDisplay();
}

function addTimerFromDOM(){
		
	//get name
	var name = document.getElementById("add_timer_name").value;
	
	//get time
	var timeString = document.getElementById("set_addTimer_time_input").value;
	var countDownTimeMillis = -1 * stringToMillis(timeString);
	
	//get automatic kill at set time (i.e. zero for a count down timer)
	var autoKillAtSetTime = document.getElementById("killAtSetTime").checked;
		
	addTimer(name, countDownTimeMillis,autoKillAtSetTime);
	DOMaddTimerNamePreview(); //set preview for next timer...
	
}

function timerTimerElapsed(id){
	if (window.timers[getTimerIndexFromId(id)].setEnableKillTime){
		//console.log("todel: "+ timers[getTimerIndexFromId(id)].name);
		if ( id == window.activeTimerId ){
			deleteActiveTimer();
		}else{
			deleteTimer(id);
			//console.log("nonActiveTimerdeleted");
		}
		
	}
}

function deleteActiveTimer(){
	
	//if (timers[getTimerIndexFromId(window.activeTimerId)].setEnableKillTime){
		//console.log("todel: "+ timers[getTimerIndexFromId(window.activeTimerId)].name);
		
		deleteTimer(window.activeTimerId);
		
	//}
}




function deleteAllTimers(){
	pauseToggleMultitimer();
	window.multitimerStatus.running = false;
	
	while (window.timers.length >0){
		deleteTimer(window.timers[0].id);
	
	}
	// for (var j= 0; j<window.timers.length;j++){
		// deleteTimer(window.timers[j].id);
		// //d("testst: "+window.timers[j].id);
	// }
	
}

function deleteTimer(id){
	
	if (id == window.activeTimerId ){
		activateNextTimer();	
	}
	
	var indexToKill = getTimerIndexFromId(id);
	window.timers[indexToKill].killTimer(); //this will prepare the instance to be deleted

	parent = document.getElementById("timerfield");	
	child = document.getElementById("timer_" + id);
	//d(child);
	parent.removeChild(child);
	//d("deleted:" + "timer_" + id);
	//delete timer from list
	window.timers.splice( indexToKill, 1 );
	
	
	if (window.timers.length<1){
		//no more timers in the multitimer 
		window.multitimerStatus.running = false;
		window.multitimerStatus.paused = false;
		window.multitimerStatus.init = true;
		window.activeTimerId = -1;
	}
	
	//do chores
	updateSequence();
	populateStartTimerSelectMenu();
	populateSetTimeTimerSelectMenu();
	setGlobalStartButtonDOM();
	// timerNamesAndIdsToList();
	updateMultitimerDisplay();
}

function getTimeFromTextBox(inputFieldId){
	var timeString = document.getElementById(inputFieldId).value;
	
	var timeSeconds = stringToMillis(timeString) / 1000;
	//checkinput
	
	var countDownTimerRadio = document.getElementById("isCountDownTimer");
	// console.log(document.getElementById("isCountDownTimer").checked);
	//if (countDownTimerRadio.checked){
	
	//d(document.getElementById("addOrSubtract_setTime_selectList").value == "Subtract (for Countdown)" );
	// if ( document.getElementById("addOrSubtract_setTime_selectList").value == "Subtract (for Countdown)" ){
	if ( document.getElementById("behaviour_setTime_selectList").value == BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS[0] 
		|| document.getElementById("behaviour_setTime_selectList").value == BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS[2]  ){
	
		timeSeconds = -timeSeconds;
	}
	
	return timeSeconds;
	
}

function setGlobalTime(){
	//get time
	timeSeconds = getTimeFromTextBox("set_global_time_input");
	
	//check incremental or absolute.
	//var setAbsolute = document.getElementById("isSetTimeAbsolute");
	var setAbsoluteElseIncrement = document.getElementById("behaviour_setTime_selectList").value == BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS[0] || document.getElementById("behaviour_setTime_selectList").value == BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS[1] ;
	
	
	if (window.timers.length>0){
		var selectListValue  = document.getElementById("setTimeTimer_selectList").value;
		if ( selectListValue== "All Timers") {
			for(var i=0; i<window.timers.length; i++){
				window.timers[i].setTime(timeSeconds,setAbsoluteElseIncrement);
			}
		}else{
			window.timers[getTimerIndexFromName(selectListValue)].setTime(timeSeconds,setAbsoluteElseIncrement);
		}
	}
}


///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function updateTime(){
	//console.log(window.a);
    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    minutes = padding(minutes,'0',2,true)
	var seconds = currentTime.getSeconds()
	seconds = padding(seconds,'0',2,true)
	var millis = currentTime.getMilliseconds()
	millis = padding(millis,'0',3,true)
    var t_str = hours + ":" + minutes + ":" + seconds + ":" + millis + "";
    if(hours > 11){
        t_str += "PM";
    } else {
        t_str += "AM";
    }
	oneMinuteVisualize();
    // document.getElementById('time_span').innerHTML =  document.getElementById('time_span').innerHTML +" <br>" + t_str;
    document.getElementById('time_span').innerHTML =  t_str;
}

function oneMinuteVisualize(){
	var currentTime = new Date()
	
	//graphics
	if (window.minutesEdgeDetector !== currentTime.getMinutes()){
		window.a = createArrayWithMultipliedIndexAsValue(60,1); //window = global variable.... I guess window is the overlapping element.
		window.a= shuffle(window.a);
	}
	window.minutesEdgeDetector = currentTime.getMinutes();
		
	//init 
	if (document.getElementById("cirle_" + 0) == null){
		for (var i = 0; i <60;i++){
			
			var fakeTime = new Date();
			fakeTime.setTime(fakeTime - (i + 1)*1000); //subtrack seconds
			
			circleNumber = window.a[fakeTime.getSeconds()];
		
			//get position derived from id
			x = (circleNumber%6 ) * 10;
			y = Math.trunc((circleNumber/6 )) * 10;
			//id = padding(x,"-",4)+padding(y,"-",4);
			id = "cirle_" + circleNumber;
			
			

			//console.log(currentTime.getMinutes()%2);
			if (fakeTime.getMinutes()%2 == 0){
				color = "white";
			}else{
				color = "black";
			}
		
			if (document.getElementById(id) !== null){
				document.getElementById(id).remove(); //domFunctions.js
			}
			add_circle(document.getElementById("bolletjes"), x + 20 , y + 20 , 5,  id , color);
		}
	}
	
	
	//get id from the shuffeld list. 
	circleNumber = window.a[currentTime.getSeconds()];
	
	//get position derived from id
	x = (circleNumber%6 ) * 10;
	y = Math.trunc((circleNumber/6 )) * 10;
	//id = padding(x,"-",4)+padding(y,"-",4);
	id = "cirle_" + circleNumber;
			
	//console.log(currentTime.getMinutes()%2);
	if (currentTime.getMinutes()%2 == 0){
		color = "white";
	}else{
		color = "black";
	}
	
	if ( (document.getElementById(id).getAttribute('fill') !== color)) {
	
		//if (document.getElementById(id) !== null){
			document.getElementById(id).remove(); //domFunctions.js
		//}
		add_circle(document.getElementById("bolletjes"), x + 20 , y + 20 , 5,  id , color);
		//console.log(document.getElementById(id).getAttribute('id'));
	}
}

function delta(offsetTime){
	//argument should be of the Date type!
	return new Date() - offsetTime; 
}

function timeDiffWithNowMillis(millis){
	return nowMillisSinceEpoch()-millis; //return new millisSinceEpoch
}

function getTimeMillis(offsetTimeFromEpoch){
//offsetTimeFromEpoch should be Date object, so, if we do now minus argument, we have the millis that represent the time in the timer.
	return new Date() - offsetTimeFromEpoch; 
}


function nowMillisSinceEpoch(){
	return new Date().valueOf();
}

function convertTimeMillisToOffsetTimeFromEpoch(millis){
	// console.log("converted:");
	// console.log(new Date(new Date().valueOf() - millis).valueOf());
	return new Date(new Date().valueOf() - millis);
}

function millisToString(millis,doublePointAsDivider,autoTrunc,showMillis,showSecs,showMins,showHours){
	{
		showMillis = typeof showMillis !== 'undefined' ? showMillis : false;
		showSecs = typeof showSecs !== 'undefined' ? showSecs : true;
		showMins = typeof showMins !== 'undefined' ? showMins : true;
		showHours = typeof showHours !== 'undefined' ? showHours : true;
		autoTrunc = typeof autoTrunc !== 'undefined' ? autoTrunc : true;
		doublePointAsDivider = typeof doublePointAsDivider !== 'undefined' ? doublePointAsDivider : false;
	}

	var dividerDoublePoint = [":",":",":",":"];
	var dividerText = ["mil","s","m","h"];
	
	var divider;
	
	if (doublePointAsDivider){
		divider = dividerDoublePoint;
	}else{
		divider = dividerText;
	}

	var str = ""
	secs = millis/1000;
	mins = secs/60;
	hours = mins/60;
	
	if (autoTrunc){
		if(hours<1){
			showHours = false;
		}
		if(mins<1){
			showMins = false;
		}
		// if(secs<1){
			// showSecs = false;
		// }
		
	}
	
	
	
	if (showMillis){
		str = "" + millis%1000 + divider[0];
	}
	if (showSecs){
		str = padding(Math.floor(secs%60)+divider[1],"0",3,true) + str;
	}
	if(showMins){
		str = padding(Math.floor(mins%60) +divider[2],"0",3,true)+str;
	}
	
	if (doublePointAsDivider){
		str = str.slice(0,str.length-1);
		if(showHours){
				//str = Math.floor(hours%60) +divider[3]+str;
				str = padding(Math.floor(hours%60) +divider[3],"0",3,true)+str;
		}	
	
	}else{
		if(showHours){
			str = Math.floor(hours%60) +divider[3]+str;
		}
	
	}
	
	//console.log(str);
	return str;
}

// function millisToString(millis){
	
	// str = "" + millis%1000 + "mil";
	// secs = millis/1000;
	// str = Math.floor(secs%60)+"s:" + str;
	// mins = secs/60;
	// str = Math.floor(mins%60) +"m:"+str;
	// hours = mins/60;
	// str = Math.floor(hours%60) +"h:"+str;
	// return str;
	
// }

function d(str){
	console.log(str);
}

function stringToMillis(timeString){
	//str = (timeString.value != "" && !isNaN(timeString.value)) ? timeString.value : MULTITIMER_TIMESTRING_DEFAULT ; 
	//str = timeString;
	//d(	'--------------'+timeString + '--------------');
	//str should be like:   132h23m49s    the number dividede by the identifier.   123h29s is allowed.   600s is allowed, 600s30h is NOT allowed , 300h 30m is allowed.   300h:39m:122s  is allowed. 45:49  is allowed. (will auto ddddddd:hhhhhh:mmmmmmmm:ssssssssssssss) , 0.3h is allowed!, generalized text will appear next to input field. 
	//parsing
	//for (var i = 0; i <60;i++){
	seconds = 0;
	timeStrDetail = "";
	multiplier = 1;
	sequence = ["s","m","h","d"];
	sequenceMultiplier = [1,60,3600,86400];
	sequenceIndex = 0;
	for (var i = timeString.length-1; i>=0;i--){
		//d("i:"+i);
		chr = timeString.charAt(i);
		if (isNaN(chr) || chr== " "){
			//d("nan: " + chr); 
			if (!isNaN(parseInt(timeStrDetail))){
				seconds += parseInt(timeStrDetail) * sequenceMultiplier[sequenceIndex];
				timeStrDetail = "";
			}
			
		}else{
			timeStrDetail = chr + timeStrDetail;  //add number to the str. 
			//d( "detail" + timeStrDetail);
		}
		if ( chr == " " || chr == ":" ){ //chr == sequenceIndex[sequenceIndex] ||
			sequenceIndex++;
			//d("multiplier:"+sequenceMultiplier[sequenceIndex]);
			//multiplier = sequenceMultiplier[sequenceIndex];
		}
		switch (chr){
			case "s":
				sequenceIndex = 0;
				break;
			case "m":
				sequenceIndex = 1;
				break;
			case "h":
				sequenceIndex = 2
				break;
			case "u":
				sequenceIndex = 2;
				break;
			case "d":
				sequenceIndex = 3;
				break;
		}
		
	}
	if (!isNaN(parseInt(timeStrDetail))){
		seconds +=  parseInt(timeStrDetail)* sequenceMultiplier[sequenceIndex];
	}
	// d("result:" + seconds);
	return seconds * 1000;
	//replace spaces between numbers(!) by ":"

	//get rid of whitespace
	//replace u by h ! (uur ->hour)
	//check for d,h,m,s move  
	
}
