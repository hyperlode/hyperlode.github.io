var END_TIME_DEFAULT_SECONDS = 0;
var ENABLE_KILL_AT_END = true;
var KILL_TIME_MILLIS = 0;
var BACKGROUND_COLOR_DEFAULT = "white";
//library: moment.js  (if you are fed up with internal timing libs)
//window.timerIds = new Array();

function convertTimeMillisToOffsetTimeFromEpoch(millis){
	// console.log("converted:");
	// console.log(new Date(new Date().valueOf() - millis).valueOf());
	return new Date(new Date().valueOf() - millis);
}


function Timer(id, name, timeSeconds , initTime, isEasyMode, autoKillAtSetTime, color,divToAttachToId){
	{
		initTime = typeof initTime !== 'undefined' ? initTime : new Date();
		timeMillis = typeof timeMillis !== 'undefined' ? timeMillis : 0;
		isEasyMode = typeof isEasyMode !== 'undefined' ? isEasyMode : true;
		autoKillAtSetTime = typeof autoKillAtSetTime !== 'undefined' ? autoKillAtSetTime : ENABLE_KILL_AT_END;
		color = typeof color !== 'undefined' ? color : BACKGROUND_COLOR_DEFAULT;
		divToAttachToId = typeof divToAttachToId !== 'undefined' ? divToAttachToId : "timerfield";
		
	}
	//console.log("test" + autoKillAtSetTime);
	this.easy = isEasyMode;
	this.name = name;
	this.id = id;
	this.initTime = initTime; //initTimeInMillisSinceEpoch
	this.pauseStartTime = new Date();
	this.color = color;
	
	this.status = {"init":true,"running":false, "paused":true};
	
	
	this.timerTimeMillis =timeSeconds *1000; //actual time of the timer, in milliseconds
	this.killTimeMillis = 0;//
	
	this.setFakeTime =convertTimeMillisToOffsetTimeFromEpoch(this.timerTimeMillis); //timerTimeMillis
	
	this.nextTimerId;
	
	
	//console.log(this.setFakeTime.getSeconds());
	//this.setFakeTime = delta(this.initTime);
	
	
	var div = document.getElementById(divToAttachToId);
	var form = document.createElement("form");
	form.id = "timer_" + this.id ;
	addClassToElement(form, "form-horizontal timer col-xs-12 col-sm-6 col-md-2 col-lg-2");
	//addClassToElement(form, " timer ");
	//addClassToElement(form," form-horizontal "); 
	div.appendChild(form);
	
	
	// var div = document.getElementById("timerfield");
	// addDiv(div,"timer_" + this.id );
	// //document.body.appendChild(div);
	// addClassToElement(form, "form-horizontal timer col-xs-12 col-sm-6 col-md-2 col-lg-2");
	
	
	//set background color
	setElementBackgroundColor(form, this.color);
	
	
	// display name
	// var dispName = document.createElement("div");
	// dispName.id = this.id+"_dispName";
	// div.appendChild(dispName);
	// //document.getElementById(dispName.id).innerHTML = this.name +" with id:" + this.id;//this.timerTime.getSeconds() +":"+ this.timerTime.getMilliseconds();
	
	addHtml(form, "<h2 class='col-xs-12'>"+this.name+"</h2>");
	
	
	//display time
	// var timeDisp = document.createElement("div");
	// timeDisp.id = this.id+"_timeDisp";
	// div.appendChild(timeDisp);
	// this.displayTimeDOM;
	
	addHtml(form, "<h3 id='" + this.id+"_timeDisp" + "' class='col-xs-12'>" +"time"+ "</h3>");
	
	
	
	// //display butttons
	// var buttonField = document.createElement("div");
	// buttonField.id = this.id+"_buttons";
	// div.appendChild(buttonField);
	
	//addButton(div, "Stop!","Stop", id+"_stop",  this.stopTimer.bind(this)); //bind this, makes sure we apply the function to the instance!
	//addButton(buttonField, "Kill!","Kill", this.id+"_kill", this.killTimer.bind(this)); //bind this, makes sure we apply the function to the instance!
	//addButton(buttonField, "Kill!","Kill", this.id+"_kill", "deleteTimer(" + this.id +")"); //bind this, makes sure we apply the function to the instance!
	
	if(this.easy){
		//button
		var formDiv = addDiv(form);
		addClassToElement(formDiv, "row");
		// var div = addDiv(formDiv);
		// div.className = div.className + "col-sm-0";
		var div = addDiv(formDiv);
		//addButtonToExecuteGeneralFunction(div, "Kill Now!","Kill", this.id+"_kill", deleteTimer,this.id); //bind this, makes sure we apply the function to the instance!
		div.className = div.className + " col-sm-12";
		// document.getElementById(this.id+"_kill").setAttribute('onclick',this.setEnableKillTimeFromCheckBox.bind( this));
		
		
		//checkbox "Kill at end"
		// var formDiv = addDiv(form);
		// addClassToElement(formDiv, "row");
		// var checkBoxDiv = addDiv(formDiv);
		// var checkBox = addCheckBox(checkBoxDiv, this.id+"_killAtSetTime", "killAtSetTime", autoKillAtSetTime, "Kill at zero time");
		// addClassToElement(checkBox, "checkbox-inline");
		// checkBoxDiv.className = checkBoxDiv.className + " col-sm-12";
		
		
		// // addButtonToExecuteGeneralFunction(buttonField, "Kill!","Kill", this.id+"_kill", deleteTimer,this.id); //bind this, makes sure we apply the function to the instance!
		// // addCheckBox(buttonField, this.id+"_killAtSetTime", "killAtSetTime", autoKillAtSetTime, "Automatic kill when time's up!");
		// // document.getElementById(this.id+"_killAtSetTime").onclick = this.setEnableKillTimeFromCheckBox.bind( this);
		
		
		
		
	}else{
		addButtonToExecuteGeneralFunction(buttonField, "Kill!","Kill", this.id+"_kill", deleteTimer,this.id); //bind this, makes sure we apply the function to the instance!
		//start button for individual timer.
		addButton(buttonField, "Start!","Start", this.id+"_start", this.setTimerState.bind.apply( this.setTimerState, [this,true])); //bind this, makes sure we apply the function to the instance! //http://stackoverflow.com/questions/21507320/using-function-prototype-bind-with-an-array-of-arguments (see cody's comment at solution)
		this.setTimerStartButtonDOM();
	
		//end time
		var endTimeField = document.createElement("div");
		endTimeField.id = this.id+"_endTimeField";
		div.appendChild(endTimeField);
		
		addCheckBox(endTimeField, this.id+"_killAtSetTime", "killAtSetTime", autoKillAtSetTime, "Automatic kill at set time");
		addTextBox(endTimeField, END_TIME_DEFAULT_SECONDS, "EndTime", this.id+"_endTimeTextBox");
		document.getElementById(this.id+"_killAtSetTime").onclick = this.setEnableKillTimeFromCheckBox.bind( this);
		document.getElementById(this.id+"_endTimeTextBox").onkeypress = this.checkKillTime.bind( this);
		document.getElementById(this.id+"_endTimeTextBox").onkeyup = this.checkKillTime.bind( this);
		addButton(endTimeField, "Set!","SetEndTime", this.id+"_setEndTime", this.setKillTimeFromTextBox.bind( this)); //bind this, makes sure we apply the function to the instance! //http://stackoverflow.com/questions/21507320/using-function-prototype-bind-with-an-array-of-arguments (see cody's comment at solution)
	}
	// addButton(div, "Stop!","Stop", id+"_stop", stopTimer);
	// addButton(div, "Kill!","Kill", id+"_kill", destroyTimer);
	//addButton(div, "Pause!","Pause", id+"_pause", pause);
	//console.log(div.name);
	
	
	//add buttons
	//create timer log
	//add creation time
	
	//refresh display.
	this.displayTimeDOM();
	
	//update interval
	
	setInterval(this.refresh.bind(this), 100); //2nd arg = millis : 1=once every milli, 1000=once every second
	this.setKillTime(KILL_TIME_MILLIS);
	this.setEnableKillTime(autoKillAtSetTime);
	
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

Timer.prototype.setEnableKillTime= function(enable){
	this.enableKillTime	= enable;
	
	if (!this.easy){
		document.getElementById(this.id+"_killAtSetTime").checked = enable;
	}
}

Timer.prototype.setEnableKillTimeFromCheckBox= function(){
	this.setEnableKillTime(document.getElementById(this.id+"_killAtSetTime").checked);
}
Timer.prototype.setKillTimeFromTextBox = function(){
	var millis = stringToMillis(document.getElementById(this.id+"_endTimeTextBox").value);
		document.getElementById(this.id+"_killAtSetTime_label").innerHTML = "Automatic kill when timer reaches: " + millisToString(millis); 
		this.setKillTime( millis );
}
		
Timer.prototype.setKillTime = function(killTimeMillis){
	this.killTimeMillis = killTimeMillis;
}

Timer.prototype.checkKillTime = function(){
	d(stringToMillis(document.getElementById(this.id+"_endTimeTextBox").value)/1000);
}


Timer.prototype.displayTimeDOM = function(){

	//local timer display
	//time is always displayed "positive" 
	if (this.timerTimeMillis < 0){
		document.getElementById(this.id+"_timeDisp").innerHTML =millisToString( -this.timerTimeMillis);//this.timerTime.getSeconds() +":"+ this.timerTime.getMilliseconds();
	}else{
		document.getElementById(this.id+"_timeDisp").innerHTML =millisToString( this.timerTimeMillis);//this.timerTime.getSeconds() +":"+ this.timerTime.getMilliseconds();
	}
	
	//active timer big display
	this.displayTimerAsActiveTimer();
};

Timer.prototype.setNextTimerId = function (id){
	this.nextTimerId = id;
}
Timer.prototype.getNextTimerId = function (){
	return this.nextTimerId ;
}

// Timer.prototype.setTime = function (timeSeconds, countDownElseChrono, absoluteElseIncremental){
Timer.prototype.setTime = function (timeSeconds,absoluteElseIncremental){
	//if time is negative, it will be a countdown, otherwise, count up.
	{
		absoluteElseIncremental = typeof absoluteElseIncremental !== 'undefined' ? absoluteElseIncremental : true;
		//countDownElseChrono = typeof countDownElseChrono !== 'undefined' ? countDownElseChrono : true;
	}
	
	if (absoluteElseIncremental){
		this.setFakeTime = convertTimeMillisToOffsetTimeFromEpoch(timeSeconds*1000);
		this.timerTimeMillis = timeSeconds*1000;
	}else{
		this.setFakeTime =  convertTimeMillisToOffsetTimeFromEpoch(this.timerTimeMillis + timeSeconds*1000);
		this.timerTimeMillis = this.timerTimeMillis + timeSeconds*1000;
	}
	
	this.displayTimeDOM();
}
Timer.prototype.displayTimerAsActiveTimer = function(){
	//active timer field, only update when running... what if in pause, and next timer ?
		
	// if (this.timerTimeMillis < 0){
		// document.getElementById("activeTimerDisp").innerHTML = this.name + " is the active count down timer. Time remaining: " + millisToString( -this.timerTimeMillis) + "<br> hit space or click next to switch to the next timer!";//this.timerTime.getSeconds() +":"+ this.timerTime.getMilliseconds();
	// }else{
		// document.getElementById("activeTimerDisp").innerHTML = this.name + " is the active timer. Counting up time: " +  millisToString( this.timerTimeMillis)+ "<br> hit space or click next to switch to the next timer!";//this.timerTime.getSeconds() +":"+ this.timerTime.getMilliseconds();
	// }
	
	domDisplayActiveTimer(this.name, this.timerTimeMillis, this.timerTimeMillis > 0)
	
	
}


Timer.prototype.refresh = function(){
	var now  = new Date();
	if (this.status.running){
		this.timerTimeMillis =  now- this.setFakeTime;
		this.displayTimeDOM();
		this.displayTimerAsActiveTimer();
		
		if ( this.timerTimeMillis > this.killTimeMillis && this.enableKillTime) {
			//check if time elapsed, if so, kill!
			
			//set time nicely to zero, for display esthetics!
			this.timerTimeMillis = 0;
			this.displayTimerAsActiveTimer();
			
			timerTimerElapsed(this.id);
		}
	
	}
	
}

Timer.prototype.setTimerStartButtonDOM = function(){

	if (!this.easy){
		if (this.status.running){
			//start
			document.getElementById(this.id+"_start").onclick= this.setTimerState.bind.apply( this.setTimerState, [this,false]); 
			document.getElementById(this.id+"_start").value = "Stop";
		}else{
			//stop
			document.getElementById(this.id+"_start").onclick= this.setTimerState.bind.apply( this.setTimerState, [this,true]); 
			document.getElementById(this.id+"_start").value = "Start";
		}
	}
}



Timer.prototype.setTimerState = function(letTimerRun) {
// Timer.prototype.setTimerState = function(letTimerRun, nowForSeamlessPassing) {
	// {
		// nowForSeamlessPassing = typeof nowForSeamlessPassing !== 'undefined' ? nowForSeamlessPassing : new Date();
		
	// }
	// console.log(typeof nowForSeamlessPassing);
	nowForSeamlessPassing = new Date();
	
	// console.log("before set state:");	
	// console.log(this.timerTimeMillis);	
	// console.log(nowForSeamlessPassing.valueOf());	
	// console.log(typeof nowForSeamlessPassing);	
	if (letTimerRun){
	
		//start
		
		
		// this.setFakeTime = convertTimeMillisToOffsetTimeFromEpoch(this.timerTimeMillis);
		this.setFakeTime = new Date(nowForSeamlessPassing.valueOf()  - this.timerTimeMillis);
		//this.status.running = true;
		this.status = {"init":false,"running":true, "paused":false};
		//send out global signal 
		timerStarted(this.id,nowForSeamlessPassing); 
	
	}else{
	
		//stop 
	
		
		//this.status.running = false;
		this.status = {"init":false,"running":false, "paused":false};
		//fix the timer time and display it. (wont be updated during pause!)
		this.pauseStartTime = nowForSeamlessPassing;
		this.timerTimeMillis = this.pauseStartTime - this.setFakeTime; 
		this.displayTimeDOM();
		//send out global signal 
		timerStopped(this.id,this.pauseStartTime);
	}
	
	this.setTimerStartButtonDOM();
	
	
	//return this.pauseStartTime;  //return the exact time of start pause, so other timing process can be linked seamless (with the same time stamp)
};

// Timer.prototype.stopTimer = function() {
	// console.log(this.id);
	// console.log(this.initTime);
	// console.log(this.timerTime);
// };

Timer.prototype.killTimer = function() {
	this.setTimerState(false);
	//deleteTimer(); //you cannot delete the instance from within itself!
	
	// console.log(this.id);
	// console.log(this.initTime);
	// console.log(this.timerTimeMillis);
};
// Timer.prototype.addButton = function() {};
// Timer.prototype.addButton = function() {};

