function CountDownTimer(duration, granularity,displayElementId) {
  this.duration = duration;
  this.initialSetTime = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
  this.displayElement = document.getElementById(displayElementId);
  console.log(this.displayElement);
}


CountDownTimer.prototype.start = function() {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
      that = this,
      diff, obj;
	console.log(this.granularity);
  (function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);

    if (diff > 0) {
		console.log(diff);
		
      setTimeout(timer, that.granularity);
    } else {
      diff =that.duration; //diff=0;
	  that.duration = that.initialSetTime;
	  resetFromWrongSetAttempt();
	  
	  
      that.running = false;
    }
	obj = CountDownTimer.parse(diff);
    that.displayElement.innerHTML = "<p>"+ diff +"</p>"
    
	// that.tickFtns.forEach(function(ftn) {
      // ftn.call(this, obj.minutes, obj.seconds);
    // }, that);
  }());
  //this.tickkk;
  //setTimeout(this.tick(), this.granularity);
  // this.tick();
}
// CountDownTimer.prototype.start = function() {
  // if (this.running) {
    // return;
  // }
  // this.running = true;
  // var start = Date.now(),
      // that = this,
      // diff, obj;
	// console.log(this.granularity);
  // (function timer() {
    // diff = that.duration - (((Date.now() - start) / 1000) | 0);

    // if (diff > 0) {
      // setTimeout(timer, that.granularity);
    // } else {
      // diff = 0;
      // that.running = false;
    // }
	// console.log("yoheeeei");
    // obj = CountDownTimer.parse(diff);
    // // that.tickFtns.forEach(function(ftn) {
      // // ftn.call(this, obj.minutes, obj.seconds);
    // // }, that);
  // }());
  // //this.tickkk;
  // //setTimeout(this.tick(), this.granularity);
  // // this.tick();
// }


CountDownTimer.prototype.tick = function(){
	setTimeout(this.tick, this.granularity ); 
	console.log("ticck");
		
}



CountDownTimer.prototype.onTick = function(ftn) {
  if (typeof ftn === 'function') {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function() {
  return !this.running;
};

CountDownTimer.parse = function(seconds) {
  return {
    'minutes': (seconds / 60) | 0,
    'seconds': (seconds % 60) | 0
  };
};
// CountDownTimer.prototype.updateDisplay = function(){
	
// }

function addTimer(elementToAttachToId,timeSeconds,id){
	var element = document.getElementById(elementToAttachToId);
	element.innerHTML = "";
	//add field
	var div  = addDiv(element, id + "_dispTime","none");
	//create Timer
	console.log(id + "_dispTime");
	div.innerHTML = timeSeconds;
	var countDownTimer = new CountDownTimer (timeSeconds, 1000, id + "_dispTime");
	
	//timer.onTick();
	//add button
	addButton(element,"start!","startCountdownButton", id + "_startCountdownButton", countDownTimer.start.bind(countDownTimer) );
	
	
	
}

// function stopTimer()

 function format(minutes, seconds) {
        minutes = minutes < 10 ? "0" + minutes : minutes;
    
		minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ':' + seconds;
    }
