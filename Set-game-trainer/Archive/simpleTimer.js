//http://www.dailycoding.com/posts/object_oriented_programming_with_javascript__timer_class.aspx
// Declaring class "Timer"
var SimpleTimer = function(interval, buttonElement, countDownTimerTime)
{        
	//countDownTimerTime = in millis
	//buttonElement = the button (not name, but the real element)
	//interval = timer tick interval in millis. 

	countDownTimerTime = typeof countDownTimerTime !== 'undefined' ? countDownTimerTime : -1;
	
	if (countDownTimerTime == -1){
		console.log ("set as chrono");
		this.isChronoElseCountdown = true;
	}else{
		console.log ("set as countdown");
		this.isChronoElseCountdown = false;
		this.countDownMillis = countDownTimerTime;
	}
	
	
    // Property: Frequency of elapse event of the timer in milliseconds
    this.interval = interval;
    this.buttonElement = buttonElement;
	this.millis = 0;
	this.secondsDiv;
	this.minutesDiv;
	this.millisDiv;
	
	//var el = document.getElementById('el-id'),
	
	
    // Property: Whether the timer is enable or not
    this.Enable = new Boolean(false);
    
    // Event: Timer tick
    this.Tick;
    
    // Member variable: Hold interval id of the timer
    var timerId = 0;
    
    // Member variable: Hold instance of this class
    var thisObject;
    thisObject = this;
	
	// this.buttonElement.addEventListener('click', function(){
		// thisObject.Start.bind(thisObject)(); 
	// });
	
	// this.ButtonSetToStart();
	
    // Function: Start the timer
    this.Start = function()
    {
		this.secondsDiv.innerHTML = 0;
		
		if (this.isChronoElseCountdown){
			this.millis = 0;
		}else{
			this.millis = this.countDownMillis;
		}
		
		
		this.Enable = new Boolean(true);

        thisObject = this;
        if (thisObject.Enable)
        {
            thisObject.timerId = setInterval(
				function(){
					
						thisObject.Tick(); 
				
				}, thisObject.interval
			);
        }
		
		this.ButtonSetToStop(); // stops the timer.
		//this.ButtonSetToStart(); //immediate restart
		
    };
    
	this.Tick = function (){
		if (this.isChronoElseCountdown){
			this.millis += this.interval;
				
			
		}else{
			this.millis -= this.interval;
			
			if (this.millis < 0){
				this.millis = 0;
				this.Stop();
				resetGame();
			}
		}
		
		this.secondsDiv.innerHTML = this.millis;
	}
	
	// this.GetMillis= function(){
		// return this.millis;
	// };
    
	// Function: Stops the timer
    this.Stop = function()
    {            
		thisObject.Enable = new Boolean(false);
        clearInterval(thisObject.timerId);
		this.ButtonSetToStart();
		
    };
	
	this.ButtonSetToStop = function (){
			
		var elClone =  this.buttonElement.cloneNode(true);
		this.buttonElement.parentNode.replaceChild(elClone,  this.buttonElement);
		this.buttonElement = elClone;
		this.buttonElement.addEventListener('click',mainButtonClicked());
		this.buttonElement.addEventListener('click', function(){
			thisObject.Stop.bind(thisObject)();
			
		});
		this.buttonElement.innerHTML = "Stop! ";
	}
	
	this.ButtonSetToStart = function (){
			
		var elClone =  this.buttonElement.cloneNode(true);
		this.buttonElement.parentNode.replaceChild(elClone,  this.buttonElement);
		this.buttonElement = elClone;
		this.buttonElement.addEventListener('click',mainButtonClicked());
		this.buttonElement.addEventListener('click', function(){
			thisObject.Start.bind(thisObject)();
		})
		this.buttonElement.innerHTML = "Start!";
	}
	

};