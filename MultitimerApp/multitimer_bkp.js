var MULTITIMER_NUMBER_OF_TIMERS_INIT = 2;
var MULTITIMER_TIMESTRING_DEFAULT = "0h10m0s";
var EASYMODE = true;
var MULTITIMER_DEFAULT_TIMER_NAME = "Timer";
var RANDOMSTARTER_VALUE_IN_SELECTLIST= "Random starter!";
var BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS = ["Assign a count-down time", "Assign a count-up time", "Subtract a time", "Add a time"];
var TEXTBOX_DEFAULT_SIZE = 10;

var timers = new Array(); //MULTITIMER_NUMBER_OF_TIMERS_INIT
//var multitimerNames = new Array(); 
//var multitimerIds = new Array(); 

var activeTimerId = -1;  //-1 is undefined! (i.e. with random player)
var multitimerStatus = {running:false,paused:false,randomStarter:false, init:true};
var multitimerTimersIdSequence = [];


//store timers data. 
var multitimerData = {};

//todo: scroll to active timer when playing: document.getElementById('youridhere').scrollIntoView(); 	  //http://stackoverflow.com/questions/68165/javascript-to-scroll-long-page-to-div

// use an anonymous function
//jquery alternative: $("document").ready(function () {
docReady(function() { 
	multitimerStatus.init = true;
	

	
	////set refresh interval
	//setInterval(updateTime, 100); //2nd arg = millis : 1=once every milli, 1000=once every second
	
	////init graphics
	//svgEl = document.getElementById("fun");
	//addSvg(svgEl, "bolletjes",1000, 1000,"white");
	//window.minutesEdgeDetector = -100; //initialize edge detector
	
	
	
	//Multitimer setting:
	
	//set-time field
	global_TimeSetting_div =  document.getElementById("global_TimeSetting");
	
	//addSelectList(global_TimeSetting_div, "absoluteOrIncrement_setTime_selectList", "absoluteOrIncrement_setTime_selectList", ["assign", "increment"] );
	addSelectList(global_TimeSetting_div, "behaviour_setTime_selectList", "addOrSubtract_setTime_selectList", BEHAVIOUR_SETTIME_SELECTLIST_OPTIONS);
	
	
	addHtml(global_TimeSetting_div, ' of ');
	addTextBox(global_TimeSetting_div,MULTITIMER_TIMESTRING_DEFAULT,"set_global_time_input","set_global_time_input",TEXTBOX_DEFAULT_SIZE);
	
	addHtml(global_TimeSetting_div, ' to ');
	

	//addSelectList(global_TimeSetting_div, "addOrSubtract_setTime_selectList", "addOrSubtract_setTime_selectList", ["Subtract (for Countdown)", "Add (for Countup)"]);
	//global_TimeSetting_div.innerHTML = global_TimeSetting_div.innerHTML + 'to ';
	addSelectList(global_TimeSetting_div, "setTimeTimer_selectList", "setTimeTimer_selectList", []);
	addHtml(global_TimeSetting_div, '<br>');
	addButton(global_TimeSetting_div, "Set","Set", "set_global_time_btn", setGlobalTime); 
	
	
	//add-timer field
	global_addTimer =  document.getElementById("global_addTimer");
	//addHtml(global_addTimer, '<form class="form-inline">');
	var form = document.createElement("form");
	form.className = form.className + "form-horizontal"; 
	global_addTimer.appendChild(form);
	
	//http://getbootstrap.com/css/#forms-horizontal
	
	var formDiv = addDiv(form, "timerName");
	formDiv.className = formDiv.className + "form-group";
	var label = addLabel(formDiv, "Name");
	label.className = label.className + "col-sm-2 control-label";
	var formInputDiv = addDiv(formDiv, "timerNameInput");
	formInputDiv.className = formInputDiv.className + "col-sm-10";
	var input = addTextBox(formInputDiv,MULTITIMER_DEFAULT_TIMER_NAME,"add_timer_name","add_timer_name",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	input.className = input.className + "form-control";
	
	
	var formDiv = addDiv(form, "timerTime");
	formDiv.className = formDiv.className + "form-group";
	var label = addLabel(formDiv, "Time");
	label.className = label.className + "col-sm-2 control-label";
	var formInputDiv = addDiv(formDiv, "timerTimeInput");
	formInputDiv.className = formInputDiv.className + "col-sm-10";
	var input = addTextBox(formInputDiv,MULTITIMER_TIMESTRING_DEFAULT,"set_addTimer_time_input","set_addTimer_time_input",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	input.className = input.className + "form-control";
	
	var checkBoxDiv = addDiv(form, "checkBoxKillAtAndDiv");
	var checkBox = addCheckBox(checkBoxDiv, "killAtSetTime", "killAtSetTime", true, "Delete timer when countdown finished. (= Counting up disabled)");
	checkBoxDiv.className = checkBoxDiv.className + "col-sm-10 col-sm-offset-2";
	
	//var input = addTextBox(formInputDiv,MULTITIMER_DEFAULT_TIMER_NAME,"add_timer_name","add_timer_name",TEXTBOX_DEFAULT_SIZE);  //elementToAttachTo,text,name,id){
	
	// addHtml(global_addTimer, '<br>Time:');
	// addTextBox(global_addTimer,MULTITIMER_TIMESTRING_DEFAULT,"set_addTimer_time_input","set_addTimer_time_input",TEXTBOX_DEFAULT_SIZE);
	addHtml(global_addTimer, '<br>');
	addButton(global_addTimer, "AddTimer","Add", "multitimer_addTimer", addTimerFromDOM); 
	
	//addCheckBox(global_addTimer, "killAtSetTime", "killAtSetTime", true, "Delete timer when countdown finished. (= Counting up disabled)");
	
	
	//start field
	global_start = document.getElementById("global_start");
	//addButton(div, "Stop!","Stop", id+"_stop",  this.stopTimer.bind(this)); //bind this, makes sure we apply the function to the instance!
	addButton(global_start, "Start","Start", "multitimer_startPause", startMultitimer ); 
	
	addButton(global_start, "Next","Next", "multitimer_nextTimer", activateNextTimer ); 
		
	addButton(global_start, "Delete All Timers","Kill All Timers", "multitimer_deleteAllTimers", deleteAllTimers ); 	
	addButton(global_start, "Reset","Reset", "multitimer_restoreAllTimers", resetMultitimer ); 	
	
	//document.getElementById("startTimer_selectList").onchange = setActiveTimerFromMenu;
	//document.getElementById("isStartRandom").onchange = randomRadioValueChange;
	//document.getElementById("isStartDefinedTimer").onchange = radioIsStartDefinedTimerValueChange;
	
	//multitimer parameters 
	
	var parametersDiv = document.getElementById("multitimer_parameters");
	
	//addTextBox(parametersDiv,"","sequence","sequence",100);  //elementToAttachTo,text,name,id){
	addHtml( parametersDiv,'Sequence of timers: ');
	
	addDiv(parametersDiv, "sequence");
	
	addButton(parametersDiv, "Set Random Sequence","random_sequence", "multitimer_generateRandomSequence", randomSequence ); 
	document.getElementById("multitimer_generateRandomSequence").setAttribute('onclick','randomSequence();');
	addHtml( parametersDiv,'<br><br>');
	addHtml( parametersDiv,'Define start timer:');
	addSelectList(parametersDiv, "startTimer_selectList", "startTimer_selectList", [] ,setActiveTimerFromMenu);
	
	
	//advanced parameters.
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
	
	//active timer display
	var activeTimerDiv = addDiv(document.getElementById("activeTimers"), "activeTimer");
	var activeTimerDispDiv = addDiv(activeTimerDiv, "activeTimerDisp");
	addHtml(activeTimerDispDiv,  "Time of active Timer will be displayed here! Press start or hit space to begin!");
	
	//add timers 	
	for (var i = 0; i<MULTITIMER_NUMBER_OF_TIMERS_INIT;i++){
		addTimerFromDOM();
	}
	
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

function setLayout(){
	var d = document.getElementById("multitimer_startPause");
	d.className = d.className + "btn btn-success";
	
	
	//var d = document.getElementById("behaviour_setTime_selectList");
	//d.className = d.className + "selectpicker";
	// var timers = document.getElementsByClassName("timer");
    // [].forEach.call(timers, function () {
		
		// });
}

 document.onkeydown = function(evt) {
	//key press nicely working!
    evt = evt || window.event;
    var chr = evt.keyCode;
	if ( chr == 27 || chr == 32) {
        //console.log(chr);
		activateNextTimer();
  }
};
 

 function saveMultitimer(){
	//save general information
	multitimerData = {};
	multitimerData.general = {};
	//save timers
	multitimerData.timers = {};
	for (var i=0; i<timers.length; i++){
		multitimerData.timers[i] = {id:timers[i].id , 'name':timers[i].name, 'time':timers[i].timerTimeMillis, 'autokill':timers[i].enableKillTime}; 
	}
	
 }
 
 function resetMultitimer(){
	//console.log("resetting!");
	//console.log(multitimerData);
	deleteAllTimers();
	multitimerStatus = {running:false,paused:false,randomStarter:false, init:true};
	loadMultitimer(multitimerData);
 }
 
 function loadMultitimer(data){
	
	timerIndexes  = getKeys(data.timers);
	
	for (var i = 0; i<timerIndexes.length;i++){
		addTimer(data.timers[i].name, data.timers[i].time, data.timers[i].autokill);
	}
 }
 //dom
function setActiveTimerFromMenu(){
	if (!multitimerStatus.running){
		startTimerName = document.getElementById("startTimer_selectList").value; //returns the value!!! not the index!!! //todo not protected against multiple selected values, or i should implement that this is possible feature request! !!
		if (startTimerName == RANDOMSTARTER_VALUE_IN_SELECTLIST){
			setActiveTimerById(-1);
		}else{
			setActiveTimerById(timers[getTimerIndexFromName(startTimerName)].id);
		}
	}
}

/////// functions ////////

function checkEndTime(){
	console.log(stringToMillis(document.getElementById("endTimeTextBox").value));
}


function setGlobalEnableKillTimeFromCheckBox(){
	var enable =  document.getElementById("killAtSetTime").checked;
	for (var i= 0; i<timers.length;i++){
		timers[i].setEnableKillTime(enable);
	}
}



//DOM
function populateSetTimeTimerSelectMenu(){
	var select = document.getElementById("setTimeTimer_selectList");
	var vals = ["All Timers"];
	for (var i= 0; i<timers.length;i++){
		vals.push(getTimerNameFromIndex(i));
	}
	//d(vals);
	repopulateSelectList(select, vals);
}

//DOM
function populateStartTimerSelectMenu(){
	var select = document.getElementById("startTimer_selectList");
	var vals = [RANDOMSTARTER_VALUE_IN_SELECTLIST];
	for (var i= 0; i<timers.length;i++){
		vals.push(getTimerNameFromIndex(i));
	}
	repopulateSelectList(select, vals);
	
}


//DOM
function setEndTime(){
	var millis = stringToMillis(document.getElementById("endTimeTextBox").value);
	for (var i= 0; i<timers.length;i++){
		
		document.getElementById(timers[i].id+"_killAtSetTime_label").innerHTML = "Automatic kill when timer reaches: " + millisToString(millis); 
		timers[i].killTimeMillis =  millis;
	}
	
}


function setActiveTimerById(id){
	activeTimerId = id;
	updateMultitimerDisplay();
	
	//timers[getTimerIndexFromId(activeTimerId)].displayTimerAsActiveTimer();
}

function activateNextTimer(){
	
	if ( ((!multitimerStatus.running && !multitimerStatus.randomStarter) || multitimerStatus.running) &&  activeTimerId !== -1 && timers.length>1){
		//d("lllodood");
		var timerRunning = timers[getTimerIndexFromId(activeTimerId)].status.running; //true or false
		if (timerRunning){
			timers[getTimerIndexFromId(activeTimerId)].status.running = false; //stop this timer (always...)
		}
		
		activeTimerId = getNextTimerId();
		setActiveTimerById(activeTimerId);
		
		if (timerRunning){
			startTimerById(activeTimerId);
		}
	}
}

function getTimerIndexFromId(id){
	for (var i= 0; i<timers.length;i++){
		if (timers[i].id == id){
			return i;
		}
	}
}

function getTimerIndexFromName(name){
	for (var i= 0; i<timers.length;i++){
		if (timers[i].name == name){
			return i;
		}
	}
}

function getTimerNameFromIndex(index){
	return timers[index].name;
}
function getTimerIdFromIndex(index){
	return timers[index].id;
}

function getTimerNameFromId(id){
	return getTimerNameFromIndex(getTimerIndexFromId(id));

}

function getTimerIds(){
	ids = [];
	for (var i = 0; i<timers.length; i++){
		ids.push(timers[i].id);
	}
	return ids;
}

function getTimerNames(){
	names = [];
	for (var i = 0; i<timers.length; i++){
		names.push(timers[i].name);
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
	multitimerTimersIdSequence = shuffleZeroToLengthArray(timers.length);
	updateSequence();
	
}

function setAutoSequence(){
	multitimerTimersIdSequence = arrayIndexAsElement(timers.length)
	updateSequence();
}

function updateSequence(){
	//don't touch the original sequence list
	//ids = arrayDeepCopy(multitimerTimersIdSequence);
	
	//only take valid ids (don't include the deleted timers.)
	var ids = [];
	for (var i=0;i<multitimerTimersIdSequence.length;i++){
		id = multitimerTimersIdSequence[i];
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
			timers[getTimerIndexFromId(ids[i])].setNextTimerId(ids[i+1]);
		}
		timers[ getTimerIndexFromId(ids[ids.length-1])].setNextTimerId(ids[0]);
		
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
}

function setGlobalStartButtonDOM(){
	button = document.getElementById("multitimer_startPause");
	
	if (multitimerStatus.init){
		button.value = "Start";
		button.onclick = startMultitimer;
	}else if (multitimerStatus.paused){
		button.value = "Continue...";
		button.onclick = pauseToggleMultitimer;
	}else if (!multitimerStatus.paused){
		button.value = "Pause";
		button.onclick = pauseToggleMultitimer ;
	}else{
		button.value = "undefined";
	}
}

function startMultitimer(){

	saveMultitimer();

	//check incremental or absolute.
	if (!multitimerStatus.running && timers.length>0 ){
		// var setRandom = document.getElementById("isStartRandom").checked;
		if (activeTimerId == -1){
			var rand=getRandomIntIncludingMinAndMax(0,timers.length-1);
			setActiveTimerById(timers[rand].id);
			timers[rand].setTimerState(true);
		}else{ 
			timers[getTimerIndexFromId(activeTimerId)].setTimerState(true);
		}
		multitimerStatus.running = true;
		multitimerStatus.init = false;
	}
	setGlobalStartButtonDOM();
}

function pauseToggleMultitimer (){
	if (multitimerStatus.running){
		//if (multitimerStatus.paused ){
			timers[getTimerIndexFromId(activeTimerId)].setTimerState(multitimerStatus.paused); //toggle status
			multitimerStatus.paused = !multitimerStatus.paused;
		//}else{
		//	timers[getTimerIndexFromId(activeTimerId)].setTimerState(false);
		//}
	}
	setGlobalStartButtonDOM();
	
	
}

function getNextTimerId(){
	
	var activeTimerIndex = getTimerIndexFromId(activeTimerId);
	console.log("next id: " + timers[activeTimerIndex].getNextTimerId());
	return  timers[activeTimerIndex].getNextTimerId();
	

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
	for (var i= 0; i<timers.length;i++){
		str = str +"---" + timers[i].id;
	}
	return str;
}


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

	//check name
	var nameOrig = name;
	//check if equilly named timers exist, if so, add a number. For the default name  always add a number!
	var nameAddition = 1;
	while(multitimerNameExists(name) || name == MULTITIMER_DEFAULT_TIMER_NAME){
		name = nameOrig + "_" + nameAddition;
		nameAddition++;
	};
	
	
	//create timer
	timers.push( new Timer (id, name, timeMillis/1000, new Date(),EASYMODE, autoKill));
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
}

function timerTimerElapsed(id){
	if (timers[getTimerIndexFromId(id)].setEnableKillTime){
		//console.log("todel: "+ timers[getTimerIndexFromId(id)].name);
		if ( id == activeTimerId ){
			deleteActiveTimer();
		}else{
			deleteTimer(id);
			//console.log("nonActiveTimerdeleted");
		}
		
	}
}

function deleteActiveTimer(){
	
	//if (timers[getTimerIndexFromId(activeTimerId)].setEnableKillTime){
		//console.log("todel: "+ timers[getTimerIndexFromId(activeTimerId)].name);
		
		deleteTimer(activeTimerId);
		
	//}
}


function updateMultitimerDisplay(){
	if (timers.length<1){
		document.getElementById("activeTimerDisp").innerHTML = "Add timers to the multitimer to get started!";
	}else if(activeTimerId == -1){
		document.getElementById("activeTimerDisp").innerHTML = "Start the game! Choose a timer to start, or go random!";
	}else if (multitimerStatus.running || multitimerStatus.init){
		timers[getTimerIndexFromId(activeTimerId)].displayTimerAsActiveTimer();
	}else{
		document.getElementById("activeTimerDisp").innerHTML = "NO STATUS";
	}
	setGlobalStartButtonDOM();
}

function deleteAllTimers(){
	pauseToggleMultitimer();
	multitimerStatus.running = false;
	
	while (timers.length >0){
		deleteTimer(timers[0].id);
	
	}
	// for (var j= 0; j<timers.length;j++){
		// deleteTimer(timers[j].id);
		// //d("testst: "+timers[j].id);
	// }
	
}

function deleteTimer(id){
	
	if (id == activeTimerId ){
		activateNextTimer();	
	}
	
	var indexToKill = getTimerIndexFromId(id);
	timers[indexToKill].killTimer(); //this will prepare the instance to be deleted

	parent = document.getElementById("timerfield");	
	child = document.getElementById("timer_" + id);
	//d(child);
	parent.removeChild(child);
	//d("deleted:" + "timer_" + id);
	//delete timer from list
	timers.splice( indexToKill, 1 );
	
	
	if (timers.length<1){
		//no more timers in the multitimer 
		multitimerStatus.running = false;
		multitimerStatus.paused = false;
		multitimerStatus.init = true;
		activeTimerId = -1;
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
	
	
	if (timers.length>0){
		var selectListValue  = document.getElementById("setTimeTimer_selectList").value;
		if ( selectListValue== "All Timers") {
			for(var i=0; i<timers.length; i++){
				timers[i].setTime(timeSeconds,setAbsoluteElseIncrement);
			}
		}else{
			timers[getTimerIndexFromName(selectListValue)].setTime(timeSeconds,setAbsoluteElseIncrement);
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

function millisToString(millis){
	
	str = "" + millis%1000 + "mil";
	secs = millis/1000;
	str = Math.floor(secs%60)+"s:" + str;
	mins = secs/60;
	str = Math.floor(mins%60) +"m:"+str;
	hours = mins/60;
	str = Math.floor(hours%60) +"h:"+str;
	return str;
	
}

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
