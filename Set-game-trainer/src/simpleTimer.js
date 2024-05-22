//http://www.dailycoding.com/posts/object_oriented_programming_with_javascript__timer_class.aspx
// Declaring class "Timer"
var SimpleTimer = function(interval, buttonElement)
{        
	//buttonElement = the button (not name, but the real element)
	//interval = timer tick interval in millis. 

    // Property: Frequency of elapse event of the timer in milliseconds
    this.interval = interval;
    this.buttonElement = buttonElement;
	this.millis = 0;
	this.secondsDiv;
	this.minutesDiv;
	this.millisDiv;
	
    // Property: Whether the timer is enable or not
    this.Enable = new Boolean(false);
    
    // Event: Timer tick
    this.Tick;
    
    // Member variable: Hold interval id of the timer
    var timerId = 0;
    
    // Member variable: Hold instance of this class
    var thisObject;
    thisObject = this;
	
    // Function: Start the timer
    this.Start = function()
    {
		
		startChronoGame();
		
		this.secondsDiv.innerHTML = 0;
		this.millis = 0;
		
		this.Enable = new Boolean(true);

        thisObject = this;
        if (thisObject.Enable)
        {
            thisObject.timerId = setInterval(
				function(){
					
						thisObject.Tick(); 
				
				}, thisObject.interval    //interval in millis
			);
        }
		this.ButtonSetToStop(); // stops the timer.
    };
    
	this.Tick = function (){
		this.millis += this.interval;
		this.secondsDiv.innerHTML = this.millis/1000 ;
	}
    
	this.Reset = function()
	{
			this.millis = 0;
	}
	
	// Function: Stops the timer
	this.Stop = function()
    {            
		stopChronoGame(); //link back to game
		thisObject.Enable = new Boolean(false);
		this.secondsDiv.innerHTML = "";
        clearInterval(thisObject.timerId);
		this.ButtonSetToStart();
    };
	
	this.ButtonSetToStop = function (){
			
		var elClone =  this.buttonElement.cloneNode(true);
		this.buttonElement.parentNode.replaceChild(elClone,  this.buttonElement);
		this.buttonElement = elClone;
		this.buttonElement.addEventListener('click', function(){
			thisObject.Stop.bind(thisObject)();
		});
		this.buttonElement.innerHTML = "Stop! ";
	}
	
	this.ButtonSetToStart = function (){
			
		var elClone =  this.buttonElement.cloneNode(true);
		this.buttonElement.parentNode.replaceChild(elClone,  this.buttonElement);
		this.buttonElement = elClone;
		this.buttonElement.addEventListener('click', function(){
			thisObject.Start.bind(thisObject)();
		})
		this.buttonElement.innerHTML = "Start!";
	}
};