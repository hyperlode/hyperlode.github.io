var solutionCardId = "";
var solutionCardIds = [];
var userChosenCards = [];
var userChosenCardsPostions = [];
var numberOfCardsMissingFromSet ; //cards to guess to complete a set 
var cardsFromSetAsGiven = [];
var cardsToChooseFrom = [];
var setSearchChrono;
var gameType;

var NUMBER_OF_PROPERTIES = 4;
var NUMBER_OF_VALUES_PER_PROPERTY = 3;
var CARD_WIDTH = 100;


var score = 0;
var topScores  = [0,0,0,0,0,0]; //first three: sets found in 60 seconds, resp:1,2 or 3 card guesses,   last three: time to find 10 sets, in millis.

var user = "userName";

var COOKIE_USER_VAR = "cookieUserxx";
var COOKIE_TOPSCORE_VARS = [ "top_1guess","top_2guess","top_3guess","topTime_1guess","topTime_2guess","topTime_3guess"];
// var COOKIE_TOPSCORE_1GUESS = "top_1guess";
// var COOKIE_TOPSCORE_2GUESS = "top_2guess";
// var COOKIE_TOPSCORE_3GUESS = "top_3guess";
var COOKIES_DAYS_TILL_EXPIRATION = 30;
SCORE_ELEMENT_ID = "score";
USER_ELEMENT_ID = "user";
INFO_ELEMENT_ID = "info";
BUTTONS_ELEMENT_ID = "buttons";
BUTTON_MAIN_ELEMENT_ID = "mainButton";
CHRONO_ELEMENT_ID = "gameChrono";

// clientservices@tangerine.ca 
//DOM

var CARD_ANIMATION_DELAY = 200;
var MAX_CARDS_PER_ROW = 4;
// var GAME_CARDS_TYPE = "addCardSvg_special_Brainfuck";
var GAME_CARDS_TYPE = "cards_classic_SET";
var SET_CARDS_TO_GUESS = 2	;
var CARDS_TO_CHOOSE_FROM = 12;

var TIMER_COUNTDOWN_INIT_SECONDS = 60;

var GAME_TYPE_FREE_PLAY = 0; 
var GAME_TYPE_COUNT_DOWN = 1; //don't change hard coded in topscore saving
var GAME_TYPE_CHRONO = 2;//don't change hard coded in topscore saving
var GAME_TYPE_DEFAULT = GAME_TYPE_CHRONO;

var SETS_TO_PLAY_IN_CHRONO_GAME = 10;
var TIME_TO_PLAY_IN_COUNTDOWN_GAME_MILLIS = 60000;

docReady(function() { 

	//cookies NEVER work locally!!!!
	//set cookies and saved variables
		if (getCookie(COOKIE_USER_VAR) == "" || getCookie(COOKIE_TOPSCORE_VARS[0]) ==  ""){
		//popup window
		user = prompt("Please enter your name:", "");
		setCookie(COOKIE_USER_VAR, user, COOKIES_DAYS_TILL_EXPIRATION);
		
		for (var i = 0; i< topScores.length; i++){
			 setCookie(COOKIE_TOPSCORE_VARS[i], topScores[i],  COOKIES_DAYS_TILL_EXPIRATION);
		}
	
	}else{
		var topScoresList = ""
		for (var i = 0; i< topScores.length; i++){
			topScores[i] = getCookie(COOKIE_TOPSCORE_VARS[i]);
			topScoresList += COOKIE_TOPSCORE_VARS[i] + ": "+ topScores[i] + "\n";
		}
		
		var nameIsValid = window.confirm("Welcome back " + getCookie(COOKIE_USER_VAR) + "!\nBeat your topscores: \n" + topScoresList);
		
		//all ok
		//renew cookie for next time...
		user =  getCookie(COOKIE_USER_VAR);
		for (var i = 0; i< topScores.length; i++){
			 setCookie(COOKIE_TOPSCORE_VARS[i], topScores[i],  COOKIES_DAYS_TILL_EXPIRATION);
		}

	}
	
	//initialize DOM
	numberOfCardsMissingFromSet = SET_CARDS_TO_GUESS;
	
	displayHowToDOM();
	displayUserDOM();
	displayScoreDOM();
	
	
	gameTypeChanged(); //define gametype and set timer.
	//displayButtonsDOM();
	
	
	//start game
	startFreeGame();
	
});


// function startGameWithNumberOfCardsToGuess(number){
	
	// // createSet_PlayOneRound(number,true);
	// numberOfCardsMissingFromSet = number;
	// startGame();
	
// }




//----------game-----------------

function gameTypeChanged(){
	
	var e = document.getElementById("gameTypeBootstrap");
	if (e){ //console.log(e);
		//check if gametype changer is existing.
		gameType = e.value;
	}else{
		gameType = GAME_TYPE_DEFAULT;
	}
	displayAndInitChronoDOM();
}

function gameLevelChanged(){
	
	var e = document.getElementById("gameLevelBootstrap");
	// var strUser = e.options[e.selectedIndex].value;	
	//cardsToGuess = e.value;	
	
	numberOfCardsMissingFromSet = e.value;
	//createSet_PlayOneRound(numberOfCardsMissingFromSet,true);
	startFreeGame();
}

function startFreeGame(){
	score = 0;
	
	// var e = document.getElementById("gameLevelBootstrap");
	// // var strUser = e.options[e.selectedIndex].value;	
	// cardsToGuess = e.value;	
	createSet_PlayOneRound( numberOfCardsMissingFromSet,true);
	displayScoreDOM();
	
	// var timerDiv = document.getElementById("gameTimer");
	//var timer  = new Timer("hoitjes", "countdown", 60 , 0, true, false, "white","gameTimer");
	//addTimer("gameTimer",TIMER_COUNTDOWN_INIT_SECONDS, "timer1");
};


function createSet_PlayOneRound(numberOfCardsToGuess, gameStartup){
	gameStartup = typeof gameStartup !== 'undefined' ? gameStartup : false;
	numberOfProperties = NUMBER_OF_PROPERTIES; //i.e. shape, quantity, color, infill
	valuesPerProperty =NUMBER_OF_VALUES_PER_PROPERTY; // i.e 3 (for the color: red, green and blue,   for the infill: solid, stripes, blank   ,.....
	
	var numberOfCardsToGuess = numberOfCardsToGuess;
	var optionsToChooseFrom = CARDS_TO_CHOOSE_FROM;
	
	
	if (gameStartup){
		//if first round, add elements to the dom
		numberOfCardsMissingFromSet = numberOfCardsToGuess;
		var setShowField = document.getElementById("topField");
		//prepare fields in dom
		//set length is always equal to number of values per property
		//for (var i=0;i<valuesPerProperty - numberOfCardsToGuess;i++){
		for (var i=0;i<valuesPerProperty ;i++){
			addSetCardLocationToDom(setShowField,i);
			showBlankCardPositionDom("position"+ i);
		}
		
		var bottomField = document.getElementById("bottomField");
		// bottomField.innerHTML = "<p>Click all the cards that are needed to make a set together with the top cards, according to the SET game rules (needed cards = " + numberOfCardsToGuess + "): </p>";
		bottomField.innerHTML = "";
		
		var div;
		for (var i=0;i<optionsToChooseFrom;i++){
			//for (var j=0;j<optionsToChooseFrom;j++){
			if ( i % MAX_CARDS_PER_ROW == 0 ){
				div = addDiv(bottomField, "bottomRow_" + i/MAX_CARDS_PER_ROW , "bottomRow");
			}
			addPossibleCardSolutionLocationToDom(div, i );
			//}
		}
		
	}
	
	
	//complete set
	var set = getFullSet(numberOfProperties, valuesPerProperty);
	
	//possible cards to chose from
	cardsToChooseFrom = []; //reset options.
	var deck = new Deck (numberOfProperties, valuesPerProperty);
	for (var i=0;i<optionsToChooseFrom-numberOfCardsToGuess;i++){
		deck.shuffle(); //(set[i].getId());
		cardsToChooseFrom.push(deck.takeOffTopCard());
	}
	//reset the cards the user has clicked.
	userChosenCards = [];
	
	//transfer solution cards from complete solution to "cards to choose from"
	solutionCardIds = [];
	for (var i=0;i<numberOfCardsToGuess;i++){
		var solutionCard = set.pop(); 
		solutionCardIds.push(solutionCard.getId());
		cardsToChooseFrom.push(solutionCard);
	}
	shuffle(cardsToChooseFrom); // shuffle cards
	
	cardsFromSetAsGiven = set; // the set cards that are shown to the user are memorized as globals.
	
	//add cards
	for (var i=0;i<set.length;i++){
		//cards from set.
		showCardDom(set[i],"position"+i);
	}
	for (var i=0;i<cardsToChooseFrom.length;i++){
		//possible answer cards
		
		showCardDom(cardsToChooseFrom[i], "position_option_"+ i);
	}
}

//==================game =========================
function mainButtonClicked(){
		//console.log("difsjeifja");
}

function setCardClicked(positionNumber){
	// console.log("click");
	// console.log(cardsFromSetAsGiven.length);
	// console.log(userChosenCards.length);
	userChosenCardsIndex = positionNumber - cardsFromSetAsGiven.length;
	
	if (positionNumber > cardsFromSetAsGiven.length -1 && positionNumber < userChosenCards.length  + cardsFromSetAsGiven.length ){
		//card position from a user selected card is clicked.
		
		console.log(userChosenCards);
		console.log(userChosenCardsPostions);
		//show last card blank
		var blankPosition = userChosenCards.length  + cardsFromSetAsGiven.length -1;
		showBlankCardPositionDom("position"+blankPosition);
		
		
		var cardToBeRemovedFromSet = userChosenCards[userChosenCardsIndex];
		var positionOfCardToBeRemovedFromSetInOptionsField = userChosenCardsPostions[userChosenCardsIndex];
		//remove the selected card.
		userChosenCards.remove(cardToBeRemovedFromSet);
		userChosenCardsPostions.remove(positionOfCardToBeRemovedFromSetInOptionsField);
		
		console.log(userChosenCards);
		console.log(userChosenCardsPostions);
		//refresh the set cards
		for (var i = 0; i< userChosenCards.length; i++){
			var pos = cardsFromSetAsGiven.length+i;
			showCardDom(cardsToChooseFrom[userChosenCardsPostions[0]], "position"+ pos);
		}
		
		setVisibiliyCardPositionDom("position_option_"+positionOfCardToBeRemovedFromSetInOptionsField, true); //set card visible again in field
		
		console.log(positionOfCardToBeRemovedFromSetInOptionsField);
	}
}

function optionCardClicked(number){

	userChosenCards.push(cardsToChooseFrom[number]);
	userChosenCardsPostions.push(number);
	
	// if (userChosenCards.length + cardsFromSetAsGiven.length <= NUMBER_OF_VALUES_PER_PROPERTY ){
	if (userChosenCards.length  <= numberOfCardsMissingFromSet ){
		console.log(userChosenCards.length);
		//add clicked card to the topfield set.
		var position = cardsFromSetAsGiven.length  + userChosenCards.length-1;
		showCardDom(cardsToChooseFrom[number], "position"+position);
		//delete card from field (make blank)
		//showBlankCardPositionDom("position_option_"+number);
		setVisibiliyCardPositionDom("position_option_"+number, false);
	}
	
	if (userChosenCards.length == numberOfCardsMissingFromSet){
		//user has chosen number of cards
		userChosenCards.push.apply(userChosenCards, cardsFromSetAsGiven);
		
		if (areCardsASet( userChosenCards,NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY)){
			console.log("found!");
			score++;
			
			
			if (gameType == GAME_TYPE_CHRONO && score >= SETS_TO_PLAY_IN_CHRONO_GAME){
				//if number of cards exceeded, go to reset game (it is finished then!
				chronoGameEnded();
			}
			
			displayScoreDOM();
			setTimeout(resetFromCorrectSetAttempt, CARD_ANIMATION_DELAY ); 
			
		}else{
			console.log("wrong");
			console.log(userChosenCards);
			//delay(1000);
			updateTopScore(score,true);
			
			score = 0;
			displayScoreDOM();
			setTimeout(resetFromWrongSetAttempt, CARD_ANIMATION_DELAY ); 
			
			
			if (gameType == GAME_TYPE_CHRONO){
				//reset and restart.
			}
			
			
		}
	}
}



function updateTopScore(amount, highestUpdateElseLowest){
	highestUpdateElseLowest = typeof highestUpdateElseLowest !== 'undefined' ? highestUpdateElseLowest : true;
	//countdown is one
	//chrono is two
	
	
	// console.log(gameType);
	// console.log(numberOfCardsMissingFromSet);
	// console.log("check topscore");
	// console.log(numberOfCardsMissingFromSet-1);
	// console.log((gameType - 1)*3 + numberOfCardsMissingFromSet-1);
	// console.log(topScorePosition);
	//if ( (highestUpdateElseLowest && amount > topScores[ getTopScorePositionInTopScores()])  ||  (!highestUpdateElseLowest && amount < topScores[ getTopScorePositionInTopScores()]) ){
	var compareAmount = amount
	var scoreToCompareTo = topScores[ getTopScorePositionInTopScores()];
	if (!highestUpdateElseLowest){
		// if (scoreToCompareTo == 0){
			// scoreToCompareTo = 66666666;
			
		// }
		scoreToCompareTo = -scoreToCompareTo;
		compareAmount  = -compareAmount; 
	}
	console.log(compareAmount);
	console.log(scoreToCompareTo);
	if ( compareAmount > scoreToCompareTo || (scoreToCompareTo == 0 )){
		
		
		topScores[getTopScorePositionInTopScores()] = amount;
	
		console.log("new topscore");
	}
	
	for (var i = 0; i< topScores.length; i++){
		 setCookie(COOKIE_TOPSCORE_VARS[i], topScores[i],  COOKIES_DAYS_TILL_EXPIRATION);
	}
}

function chronoGameEnded(){
	
	setSearchChrono.Stop();
	updateTopScore(setSearchChrono.millis,false);
	// setSearchChrono.millis;
	console.log("game ended");
	//console.log(setSearchChrono.getMillis()); //returns error "not a function for a for me unknown reason
	
	score = 0;
	
}

function resetGame(){
	
	
	resetFromWrongSetAttempt();
	
	if (gameType == GAME_TYPE_CHRONO){
		setSearchChrono.Start();
	}
	
}

function resetFromWrongSetAttempt(){
	console.log("reset");
	//repetion if repeated, no problem, if reset by timer, score setting is done here!
	
	if (gameType == GAME_TYPE_COUNT_DOWN){
		updateTopScore(score,true);
	}
	
	score = 0;
	displayScoreDOM();
	for (var i = 0;i<userChosenCardsPostions.length ;i++){
		setVisibiliyCardPositionDom("position_option_"+userChosenCardsPostions[i], true);
		var setCardPosition = userChosenCards.length - i - 1;
		showBlankCardPositionDom("position"+ setCardPosition);
	}
	
	userChosenCards = [];
	userChosenCardsPostions = [];
}

function resetFromCorrectSetAttempt(){
	for (var i = 0;i<userChosenCardsPostions.length ;i++){
		setVisibiliyCardPositionDom("position_option_"+userChosenCardsPostions[i], true);
		var setCardPosition = userChosenCards.length - i - 1;
		showBlankCardPositionDom("position"+ setCardPosition);
	}
	
	userChosenCards = [];
	userChosenCardsPostions = [];
	createSet_PlayOneRound(numberOfCardsMissingFromSet); //restart the game
}

//DOM==================================================================

// function displayAndInitChronoDOM(){
	// addButton(chronoElement,"start","buttonName", id + "_button", setChrono);
// } 

function displayAndInitChronoDOM(){
	var chronoElement = document.getElementById(CHRONO_ELEMENT_ID);
	chronoElement.innerHTML = "";
	var buttonElement = document.getElementById(BUTTON_MAIN_ELEMENT_ID);
	//buttonElement.caption("Start game!");
	
	var countDownTimerMillis = TIME_TO_PLAY_IN_COUNTDOWN_GAME_MILLIS;
	if (gameType == GAME_TYPE_CHRONO ){
		countDownTimerMillis = -1; //if chrono no init time.
	}
	setSearchChrono = addChrono(chronoElement, "setTimer",buttonElement,countDownTimerMillis ); //simpleTimer
}

function displayButtonsDOM(){
	var buttonsElement = document.getElementById(BUTTONS_ELEMENT_ID);
	for (var i = 1; i< NUMBER_OF_VALUES_PER_PROPERTY+1; i++){
		addButtonToExecuteGeneralFunction(buttonsElement,"Guess " + i +" cards", "optionButton", "setCardsNumber_" + i, startGameWithNumberOfCardsToGuess,  i );
	}
	
	// addButtonToExecuteGeneralFunction(buttonsElement,"Start 60s Game", "optionButton", "button_60s_start", st, 60);
	// addButtonToExecuteGeneralFunction(buttonsElement,"Guess 10 Sets", "optionButton", "button_10sets_start", setCardsToGuess, 60);
	//set number of 
}

function displayHowToDOM(){
	var infoElement = document.getElementById(INFO_ELEMENT_ID);
	//infoElement.innerHTML = '<p> <a href= "https://boardgamegeek.com/boardgame/1198/set">game SET</a> of 999 games  trainer. <br> Press Start, then find sets for as long as the clock ticks! Work fast, but, be warned, when you make a mistake, your score is set to zero! <br>Free practice doesn\'t count towards your topScore!</p> <br><p>Click all the cards that are needed to make a set together with the top cards, according to the SET game rules.  </p>';
	infoElement.innerHTML = '<p> <a href= "https://boardgamegeek.com/boardgame/1198/set">game SET</a> of 999 games  trainer. <br> Press Start, then find sets for as long as the clock ticks! Work fast, but, be warned, when you make a mistake, your score is set to zero! <br>Free practice doesn\'t count towards your topScore!</p> ';
}

function displayUserDOM(){
	var userElement = document.getElementById(USER_ELEMENT_ID);
	userElement.innerHTML= "Good luck practicing, " + user;
}

function getTopScorePositionInTopScores(){
	return (numberOfCardsMissingFromSet-1)+ (gameType - 1)*3  ; 
}

function displayScoreDOM(){
	var scoreElement = document.getElementById(SCORE_ELEMENT_ID);
	
	var topScoreString = ""
	// for (var i = 1; i<topScores.length+1; i++){
		// topScoreString += "Your top score for " +i + " card guess: " +  topScores[i-1] + " <BR> ";
	// // scoreElement.innerHTML = "TopScore 1 card guess: "+ topScore_1guess +" <BR> "+"TopScore 2 card guess: "+ topScore_2guess +" <BR> "+"TopScore 3 card guess: : "+ topScore_3guess +" <BR> "+" Score: " + score;
	// }
	
	topScoreString += "Your top score for " +numberOfCardsMissingFromSet + " card guess: " +  topScores[getTopScorePositionInTopScores()] + " <BR> ";
	
	scoreElement.innerHTML = topScoreString + " Score: " + score;
}

function addCardSvg_classicSetGame(elementToAttachTo,width,id,quantityValue,shapeValue,colorValue, infillValue){
	//ratio:  width * 1.45 = height
	var height = width * 1.45;
	
	//add card
	var outlineStrokeWidth = 4;
	addSvg(elementToAttachTo,id,width,height,"white","white");
	var card = document.getElementById(id);
	
	//add card outline
	var cardOutline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	cardOutline.setAttribute('width', width-outlineStrokeWidth); 
	cardOutline.setAttribute('height', height - outlineStrokeWidth); 
	cardOutline.setAttribute('rx', width/14); 
	cardOutline.setAttribute('ry', width/14); 
	cardOutline.setAttribute('x', outlineStrokeWidth/2); 
	cardOutline.setAttribute('y', outlineStrokeWidth/2); 
	cardOutline.setAttribute('style',  'fill:white;stroke:black;stroke-width:2;opacity:1'); 
	card.appendChild(cardOutline);
		
	//set properties to value.
	//shape
	peanutPoints = "0.14 0.54,0.20 0.51,0.25 0.44,0.31 0.44,0.41 0.45,0.55 0.53,0.72 0.53,0.84 0.44,0.92 0.32,0.94 0.22,0.93 0.14,0.90 0.09,0.78 0.19,0.70 0.20,0.64 0.19,0.53 0.16,0.41 0.10,0.30 0.06,0.19 0.09,0.12 0.20,0.07 0.30,0.09 0.46,0.11 0.54,0.17 0.54";
	diamondPoints = "0 0.25 , 0.5 0.5 , 1 0.25, 0.5 0" ; //"200 200,300 350,400 200,300 50" 
	pillPoints = " 0.25 0.5, 0.75 0.5 , 0.815 0.491, 0.875 0.467, 0.927 0.427, 0.967 0.375, 0.991 0.315, 1 0.25, 0.991 0.185, 0.967 0.125, 0.927 0.073, 0.875 0.033, 0.815 0.009, 0.75 0, 0.25 0 ,0.185 0.009, 0.125 0.033, 0.073 0.073, 0.033 0.125, 0.009 0.185, 0.0 0.250, 0.009 0.315, 0.033 0.375, 0.073 0.427, 0.125 0.467, 0.185 0.491	";
	var shapesByValue= [diamondPoints, pillPoints, peanutPoints];
	var symbolWidth = width/2;
	var symbolHeightIncludingWhiteSpace = symbolWidth/2.7;
		
	//color
	var colorByValue = ["red","green","blue"];
	
	//pattern
	var vertical_hatch_id =  "vertical_hatch_"+id;
	add_pattern_vertical_lines(card, "vertical_hatch_"+id, colorByValue[colorValue],width/5000, width/1000);
	fill_blank = "white";
	fill_solid = colorByValue[colorValue];
	fill_hatch = "url(#"+vertical_hatch_id+")"; //defined in svgOperations...
	var fillByValue = [fill_blank, fill_solid, fill_hatch];
	
	//quantity
	var cardsQuantity = quantityValue + 1; 
		
	//add properties
	for (var i=0; i<cardsQuantity;i++){
		var multiplier = -cardsQuantity + 1 + i * 2;
		var dy = height/2 -symbolHeightIncludingWhiteSpace/1.5 +  multiplier  * symbolHeightIncludingWhiteSpace; // symbols always in middle.   -symbolHeightIncludingWhiteSpace/1.5 is by trial and error :(
		
		//add shape
		add_polygon(card,shapesByValue[shapeValue], colorByValue[colorValue],fillByValue[infillValue],symbolWidth/2, dy, symbolWidth);
	}
}

function addCardSvg_special_Brainfuck(elementToAttachTo,width,id, brightnessTextValue,textValue,colorValue, brightnessValue){
	//ratio:  width * 1.45 = height
	var height = width * 1.45;
	
	//add card
	var outlineStrokeWidth = 4;
	addSvg(elementToAttachTo,id,width,height,"white","white");
	var card = document.getElementById(id);
	
	//add card outline
	var cardOutline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	cardOutline.setAttribute('width', width-outlineStrokeWidth); 
	cardOutline.setAttribute('height', height - outlineStrokeWidth); 
	cardOutline.setAttribute('rx', width/14); 
	cardOutline.setAttribute('ry', width/14); 
	cardOutline.setAttribute('x', outlineStrokeWidth/2); 
	cardOutline.setAttribute('y', outlineStrokeWidth/2); 
	cardOutline.setAttribute('style',  'fill:white;stroke:black;stroke-width:2;opacity:1'); 
	card.appendChild(cardOutline);
		
	// //set properties to value.
	//text
	var textByValue= ["green", "red", "blue"];
	
	var symbolWidth = width/3.5;
	// var symbolHeightIncludingWhiteSpace = symbolWidth/2.7;
		
	//color and colorbrightness by values
	var colorByValue = [["Red","DarkRed","Salmon"], ["Green","LightGreen","DarkGreen"],["blue","LightSkyBlue","Navy"]]; //http://html-color-codes.info/color-names/
	
	//color by value
	var colorByValue = [["red"],["green"],["blue"]]; //http://html-color-codes.info/color-names/
	
	//size by value
	var sizeByValue = [symbolWidth / 1.5, symbolWidth, symbolWidth * 1.5];
	
	// //pattern
	// add_pattern_vertical_lines(card, colorByValue[colorValue],width/5000, width/1000);
	// fill_blank = "white";
	// fill_solid = colorByValue[colorValue];
	// fill_hatch = "url(#vertical_hatch)"; //defined in svgOperations...
	// var fillByValue = [fill_blank, fill_solid, fill_hatch];
	
	// //brightness text
	var brightnessTextByValue = ["","dark ", "light "];
		
	//font 
	var fontByValue = ['monospace', 'sans-serif', 'serif'];
		
	//add properties
	//for (var i=0; i<cardsQuantity;i++){
		//var multiplier = - cardsQuantity + 1 + i * 2;
		//var dy = height/2 -symbolHeightIncludingWhiteSpace/1.5 +  multiplier  * symbolHeightIncludingWhiteSpace; // symbols always in middle.   -symbolHeightIncludingWhiteSpace/1.5 is by trial and error :(
		
		//add shape
		//add_text(card,brightnessTextByValue[brightnessValue] + textByValue[textValue], colorByValue[colorValue][brightnessValue],symbolWidth, 3, 40);
		add_text(card, textByValue[textValue], colorByValue[colorValue], sizeByValue[brightnessValue], 3, 40, fontByValue[brightnessTextValue]);
	//}
}



function initGameDom(){
	var setShowField = document.getElementById("topField");
	addDiv(setShowField, "card");
		
}

function setVisibiliyCardPositionDom(elementToWhichCardIsAttachedId , isVisible){
	var cardDiv = document.getElementById(elementToWhichCardIsAttachedId);
	if (isVisible){
		cardDiv.style.visibility = "";
	}else{
		cardDiv.style.visibility = "hidden";
	}
		
}

function showBlankCardPositionDom(elementToAttachToId){
	var cardDiv = document.getElementById(elementToAttachToId);
	cardDiv.innerHTML = "";
	var width = CARD_WIDTH;
	var height = width * 1.45;
	
	//add card
	var outlineStrokeWidth = 4;
	addSvg(cardDiv,"blank_"+elementToAttachToId, width ,height,"white","white");
	// var card = document.getElementById(id);
	
	
}

function showCardDom(card, elementToAttachToId){
	var cardDiv = document.getElementById(elementToAttachToId);
	
	//cardId as title
	//cardDiv.innerHTML = "<p>"+ card.getId() +"</p>";
	cardDiv.innerHTML = "";
	//card as svg
	
	//addCardSvg(cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));
	
	if (GAME_CARDS_TYPE == "addCardSvg_special_Brainfuck"){
		addCardSvg_special_Brainfuck(cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));
	}else if( GAME_CARDS_TYPE == "cards_classic_SET"){
		addCardSvg_classicSetGame  (cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));	
	}else{
		console.log("error, select GAME TYPE");
	}
	
}




function addCardLocationToDom(elementToAttachTo,cardPosition){
	//create a div, show card and add it to the DOM
	var cardDiv = addDiv(elementToAttachTo, "position" + cardPosition,  "card");
	
	// cardDiv.innerHTML = div.innerHTML + 'Extra stuff';
	cardDiv.innerHTML = '';
	//cardDiv.innerHTML = '<p>empty card</p>';
	
	return cardDiv;
}

function addSetCardLocationToDom(elementToAttachTo,cardPosition){
	
	var cardDiv= addCardLocationToDom(elementToAttachTo,cardPosition);
	cardDiv.addEventListener('click', function(){
    setCardClicked(cardPosition); });
}

function addPossibleCardSolutionLocationToDom(elementToAttachTo,position){
	var optionContainer = addDiv(elementToAttachTo, "optionPosition" + position,"cardChoice");
	var card  = new Card ("A" , 1, 1, true);
	//add card
	var cardDiv = addCardLocationToDom(optionContainer, "_option_"+position);
	
	//add click event to card
	cardDiv.addEventListener('click', function(){
    optionCardClicked(position); });
	
	//add button
	//addButtonToExecuteGeneralFunction(optionContainer,"Chose", "optionButton", "optionButton"+ position, optionCardClicked, position);
	
}


//----------------------------functionality--------




function areCardsASet(cards ,  numberOfProperties , number_of_values_per_property ){
	var cardsPerSet = number_of_values_per_property;
	
	//check if length is ok, if not, then already for sure not a set (even when it is longer, and potentially contains a set!)
	if (cards.length !== cardsPerSet){
		return false;
	}	
	//analyse properties of given cards 
	if (cards.length == 1){
		return true; //if only one card, and a set contains only one card, then: always true!
	}
	
	// possibleCardPropertyValues = []; //store all cards
	
	// var neededPropertyValues = []; //for each property valid value(s) for the given cards to create a set
	var setRequirementsOkForEachProperty = [];
	for (var i =0;i<numberOfProperties; i++){
		//assume false for requirements met for each property
		setRequirementsOkForEachProperty.push(false);
	}
		
	for (var i =0;i<numberOfProperties; i++){
		//get properties from given cards
		var propertyValues = []; // for one property all values of this set minus one card.
		for (var j =0;j<cards.length ; j++){	
			propertyValues.push(cards[j].getPropertyValue(i));
		}
		
		if (propertyValues.allValuesSame() ){
			setRequirementsOkForEachProperty[i] = true; //simply the same value
		}else if (propertyValues.allValuesUnique ()){
			setRequirementsOkForEachProperty[i] = true;
		}else{
			//if all values not unique or all the same, for sure not a set!
			return false;
		}
	}
	
	for (var i =0;i<numberOfProperties.length; i++){
		//assume false for requirements met for each property
		if (!setRequirementsOkForEachProperty[i]){
			return false; // if one of the properties was not true, no set
		}
	}
	
	return true;
}









function showIdOfACard(card){
	console.log(card.getId());
}


function getFullSet(numberOfProperties, valuesPerProperty ){
	var completeCards= new Cards(numberOfProperties, valuesPerProperty);
	var setBuilder = []
	setBuilder.push(completeCards.getRandomCard());
	var cardsToChooseFromProperties = completeCards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
	var fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
	var allFittingCards = fittingCards.getAllCards();
	
	while(fittingCards.getNumberOfCards() >0){
	
		var pickedCard = fittingCards.getRandomCard();
		setBuilder.push (pickedCard);
		cardsToChooseFromProperties = completeCards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
		if (checkArrayContainsEmptyArrayAsElement(cardsToChooseFromProperties)){
			fittingCards = new Cards(0, 0);
		}else{
			fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
		}
		allFittingCards = fittingCards.getAllCards();
	}
	return setBuilder;
}

function showFullSet(numberOfProperties, valuesPerProperty){
	// numberOfProperties = 4; //i.e. shape, quantity, color, infill
	// valuesPerProperty = 3; // i.e 3 (for the color: red, green and blue,   for the infill: solid, stripes, blank   ,.....
	var completeCards= new Cards(numberOfProperties, valuesPerProperty);
	var setBuilder = []
	setBuilder.push(completeCards.getRandomCard());
	var cardsToChooseFromProperties = completeCards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
	var fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
	var allFittingCards = fittingCards.getAllCards();
	console.log("number of cards to choose from: " + fittingCards.getNumberOfCards());
	// var maxIterations = 10;
	// while(fittingCards.getNumberOfCards() >0 && maxIterations >0){
	while(fittingCards.getNumberOfCards() >0){
		// maxIterations--;
		// console.log("---adding a card:----");
		// console.log(fittingCards);
		var pickedCard = fittingCards.getRandomCard();
		// pickedCard.show();
		setBuilder.push (pickedCard);
		// console.log("prepare for next card:");
		cardsToChooseFromProperties = completeCards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
		if (checkArrayContainsEmptyArrayAsElement(cardsToChooseFromProperties)){
			//console.log("unvalid");
			fittingCards = new Cards(0, 0);
			
		}else{
			//console.log("valid");
			fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
		}
		
		console.log("number of cards to choose from: " + fittingCards.getNumberOfCards());
		//fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
		allFittingCards = fittingCards.getAllCards();
		
	}
	
	for (var i=0;i<setBuilder.length;i++){
		setBuilder[i].show();
	}
	// console.log(maxIterations);
}


function showAGenuineSetSet(){
	//get perfect set. from the game SET 
	numberOfProperties = 4; //i.e. shape, quantity, color, infill
	valuesPerProperty = 3; // i.e 3 (for the color: red, green and blue,   for the infill: solid, stripes, blank   ,.....
	var cards= new Cards(numberOfProperties, valuesPerProperty);
	setBuilder = []
	setBuilder.push(cards.getRandomCard());
	setBuilder.push(cards.getRandomCard());
	
	var cardsToChooseFromProperties = cards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
	var fittingCards = new Cards(numberOfProperties, valuesPerProperty,cardsToChooseFromProperties);
	setBuilder.push(fittingCards.getRandomCard());
	
	console.log(setBuilder);
	for (var i=0;i<3;i++){
		setBuilder[i].show();
	}
	
}

//-----------------------------------------------------------------------------------------
//---------------------------DECK --------------------------------------------------------------
//-----------------------------------------------------------------------------------------
function Deck(properties, valuesForEachProperty,cardsPerDeck,isCardRepeatable){
	//properties = how many properties as in: colour, quantity,....
	//valuesForEachProperty = how many possible values does each property has
	//cardsPerDeck = how many cards do you want in your deck
	//isCardRepeatable = repetition of same card allowed in deck? 
	
	isCardRepeatable = typeof isCardRepeatable !== 'undefined' ? isCardRepeatable : false;
	cardsPerDeck = typeof cardsPerDeck !== 'undefined' ? cardsPerDeck : Math.pow(valuesForEachProperty, properties);
	
	//create cards
	this.allCards = new Cards(properties,valuesForEachProperty);
	
	//check requirements
	if (cardsPerDeck>this.allCards.getNumberOfCards() && !isCardRepeatable){
		console.log("ASSERT ERROR impossible number of unique cards asked.")
		// console.log(cardsPerDeck)
		// console.log(this.allCards.getNumberOfCards());
		cardsPerDeck = this.allCards.getNumberOfCards();
	}
	
	if (cardsPerDeck <=0){
		console.log("ASSERT ERROR zero or less than zero cards per deck...")
	}
	
	//init deck
	if (cardsPerDeck == this.allCards.getNumberOfCards()){
		// console.log("complete pack");
		this.deck = this.allCards.getAllCards();
		this.shuffle();
	}else if (isCardRepeatable){
		this.deck = []
		for (i=0;i<cardsPerDeck;i++){
			// this.deck.push(this.allCards.getRandomCard());
			// var index = getRandomIntIncludingMinAndMax(0,this.allCards.getNumberOfCards()-1);
			// console.log(index);
			this.deck.push(this.allCards.getRandomCard());
		}
	}else {
		//if card is not repeatable max amount of cards is number of cards.
		this.deck = this.allCards.getAllCards();
		this.shuffle();
		this.deck = this.deck.slice(0,cardsPerDeck);
	}
}
	
Deck.prototype.takeOffSpecificCard = function(id){
	this.deck.remove(id);
	// for (var i=0;i<this.getSize;i++){
		// if (this.deck[i].getId() = id;
		
	// }
	
}
Deck.prototype.takeOffTopCard = function(){
	return this.deck.pop();
}

Deck.prototype.getSize = function(){
	return this.deck.length;
}

Deck.prototype.shuffle = function(){
 // return generalFunctions.shuffle(this.cards);
	shuffle(this.deck);
}

Deck.prototype.show = function(){
	console.log("The deck contains " + this.getSize() + " cards: ");
	for (i=0;i<this.getSize();i++){
		this.deck[i].show();
		// console.log(this.deck[i]);
	}
}

//-----------------------------------------------------------------------------------------
//---------------------------CARDS --------------------------------------------------------------
//-----------------------------------------------------------------------------------------

function Cards(numberOfProperties, valuesForEachProperty, propertiesValues){
	propertiesValues = typeof propertiesValues !== 'undefined' ? propertiesValues : []; //this is an array: index is property, per element a list (or single element) with possible values.
	this.cards = [];
	
	
	if (propertiesValues.length>0){
		//SPECIAL CASE specific propertise provided in lists.
		// console.log("special case");
		if (numberOfProperties !== propertiesValues.length){
			console.log("ASSERT ERROR provide properties in list, have a length that doesnt match the number of Properties indicated.");
			console.log(propertiesValues);
			throw "ASSERT ERROR";
		}
		
		//if one of the possible values lists has no elements, than it is invalid. 
		var valid = true;
		for (var i =0 ; i<propertiesValues.length; i++){	
			if (propertiesValues[i].length == 0){
				valid = false;
			}
		}
		if (!valid){
			console.log("ASSERT ERROR some properties have no possible values ...");
			console.log(propertiesValues);
			throw "ASSERT ERROR";
		}
		
		
		
		
		
		//create cards
		var numberOfCards = 0
		for(var i = 0; i<numberOfProperties; i++){
			if (numberOfCards == 0){
				numberOfCards = propertiesValues[i].length;   
			}else{
				numberOfCards *= propertiesValues[i].length;   
			}
		}
		// if (numberOfCards == 0 ){
			// return 
		// }
		for(var i = 0; i<numberOfCards; i++){
			this.cards.push(new Card(i,numberOfProperties,valuesForEachProperty,false));
		}
		// console.log(this.cards);
		// console.log(propertiesValues);
		var afterHowManyCardsRepeatCycleDelayer = 0;
		for (var property = 0; property<numberOfProperties;property++){
			for(var i = 0; i<this.cards.length; i++){
				propertyIndex = Math.floor((i%Math.pow(propertiesValues[property].length, property - afterHowManyCardsRepeatCycleDelayer + 1)) / Math.pow(propertiesValues[property].length, property - afterHowManyCardsRepeatCycleDelayer));
				this.cards[i].setPropertyValue(property, propertiesValues[property][propertyIndex]);
			}
			 
			 if ((propertiesValues[property].length) == 1){
				//if there is an "equal property", than next "all different property" switching has to be delayed. ...
				afterHowManyCardsRepeatCycleDelayer += 1 ;
			}
		}
		// console.log(this.cards.length);
		// console.log(this.cards);
	}else{	
		//NORMAL CASE
		// console.log("normal case");
		if (numberOfProperties !== 0 && valuesForEachProperty !== 0){
			for (var i = 0; i<Math.pow(valuesForEachProperty, numberOfProperties); i++){
				//add new card. total number of possible cards = valuesPerProperty^numberOfProperties
				this.cards.push(new Card(i,numberOfProperties,valuesForEachProperty,false));
				// console.log(i);
				for (var property = 0; property<numberOfProperties;property++){
					//for every card, fill in all its properties with proper values, so all cards are unique.
					//i.e. 3 properties, 4 values per property:   0,0,0,0   1,0,0,0    2,0,0,0   0,1,0,0   1,1,0,0 ...
					this.cards[i].setPropertyValue(property, Math.floor((i%Math.pow(valuesForEachProperty, property+1)) / Math.pow(valuesForEachProperty, property)));
				}
				// this.cards[i].setProperty(0,Math.floor(i%valuesForEachProperty));
				// this.cards[i].setProperty(1, Math.floor((i%Math.pow(valuesForEachProperty, 2)) / Math.pow(valuesForEachProperty, 1)));
				// this.cards[i].setProperty(2, Math.floor((i%Math.pow(valuesForEachProperty, 3)) / Math.pow(valuesForEachProperty, 2)));
				// this.cards[i].setProperty(3, Math.floor((i%Math.pow(valuesForEachProperty, 4)) / Math.pow(valuesForEachProperty, 3)));
				
			}
		}
	}
	
	//set the id from its properties for each card
	for(var i = 0; i<this.cards.length; i++){
		this.cards[i].setIdFromProperties();
	}
	
	//check if we have a normal set or not...
	this.allCombinationsAvailable = true; // normal case, we will build all combinations 
	if (Math.pow(valuesForEachProperty, numberOfProperties) != this.cards.length){
		this.allCombinationsAvailable = false;
	}
	// console.log("all possible combinations present: " +this.allCombinationsAvailable);
	// console.log("numjber of cards:: " +this.cards.length);
	
	this.numberOfProperties = numberOfProperties;
	this.valuesForEachProperty = valuesForEachProperty;
	
	this.sumOffAllPropertyValues = 0; //calculate once for use in functions here. 
	this.allPossiblePropertyValues = []; //calculate once for use in functions here. 
	for (var i =0;i<this.valuesForEachProperty; i++){	
		this.sumOffAllPropertyValues+=i;
		this.allPossiblePropertyValues.push(i);
		// console.log("sumOffAllPropertyValues");
		// console.log(this.sumOffAllPropertyValues);
		// console.log(this.valuesForEachProperty);
	}
}

Cards.prototype.getNumberOfCards = function(){
	//the number of existing different cards.
	return this.cards.length;
}


Cards.prototype.show = function(){
	console.log("there are " + this.getNumberOfCards() + " cards:");
	for (i=0;i<this.getNumberOfCards();i++){
		this.cards[i].show();
	}
}

Cards.prototype.getAllCards = function() {
	//returns copy of the cards array. (so, by val, not by reference!!)
	return this.cards.slice();
}

Cards.prototype.getRandomCard = function(){
	if (this.cards.length == 0){
		return null;
	}else{
		return clone(this.cards[getRandomIntIncludingMinAndMax(0,this.getNumberOfCards()-1)]); //returns a copy of the element of the array (so byval, NOT by reference!!!)
	}
	// return clone(this.cards[0]); //returns a copy of the element of the array (so byval, NOT by reference!!!)
}
Cards.prototype.getCard = function(index){
	return clone(this.cards[index]); //returns a copy of the element of the array (so byval, NOT by reference!!!)
}

Cards.prototype.gameSET_howManyCardsPerSet = function(){
	//you can't play set if you have 2 values per property and want 5 cards in a set.
	//cards per set equals amount of valuesPerProperty.
	return this.valuesForEachProperty; 
	
}

Cards.prototype.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards = function( SETBuilder ){
	//check if cards indeed make for a set (all properties unique or equal) (for a three card game, with 3 values, this is always true.)
	//for each property, run through both cards, check 
	
	// if (SETMinusOneCard.length > this.gameSET_howManyCardsPerSet() -1){
		// console.log("ASSERT ERROR: it will be hard to find matching cards (only if all cards are equal it will work....");
		// console.log(SETMinusOneCard.length);
		// console.log(this.gameSET_howManyCardsPerSet() -1);
	// }
	
	possibleCardPropertyValues = []; //store all cards
	
	var neededPropertyValues = []; //for each property valid value(s) for the given cards to create a set
	for (var i =0;i<this.numberOfProperties; i++){
		
		//get properties from given cards
		var propertyValues = []; // for one property all values of this set minus one card.
		for (var j =0;j<SETBuilder.length ; j++){	
			// console.log(SETMinusOneCard[j].allValuesSame ()
			propertyValues.push(SETBuilder[j].getPropertyValue(i));
		}
		
		//analyse properties of given cards 
		if (SETBuilder.length == 1){
			//if there is only one card, all cards are allowed... (even the same card!)
			neededPropertyValues.push(this.allPossiblePropertyValues.slice());
		}else if (propertyValues.allValuesSame() ){
			
			// console.log("all values the same");
			neededPropertyValues.push([propertyValues[0]]); //simply the same value
		}else if (propertyValues.allValuesUnique ()){
			// console.log("all values unique");
			//check remaining possibilities:
			var remaining  = this.allPossiblePropertyValues.slice();
			var uniques = propertyValues.getUniqueValues();
			//check if all values are unique. if not, not good!
			if (uniques.length != propertyValues.length){
				console.log("ASSERT ERROR: non unique values for a property (but also not all equal!)");
			}
			
			//here we take the values we have out of the potential values (so all remaing values are valid values to be chosen from)
			for (var j =0;j<propertyValues.length; j++){	
				remaining.remove(propertyValues[j]);
				// var index = remaining.indexOf(propertyValues[j]);
				// if (index > -1) {
					// remaining = remaining.splice(index, 1);
				// }
				// this.cards[i].setPropertyValue(property, Math.floor((i%Math.pow(valuesForEachProperty, property+1)) / Math.pow(valuesForEachProperty, property)));
			}
			
			// shuffle(remaining);
			// neededPropertyValues.push(remaining[0]);
			// console.log("remaining:");
			// console.log(remaining);
			neededPropertyValues.push(remaining);
			// neededPropertyValues.push(this.sumOffAllPropertyValues - propertyValues.reduce(function(a, b) { return a + b; }, 0)); //the missing value is the sum of all values, - the sum of all values in this "set minus one card" if we have a 0 and a 2      0+1+2  - 0+2  = 1 so one is missing value for this property
		}else{
			console.log("ASSERT ERROR: illegal set!");
			//
			// console.log(SETMinusOneCard);
			neededPropertyValues = [];
			for (var k =0;k<this.numberOfProperties; k++){	
				neededPropertyValues.push([]);
				// 
			}
			return possibleCardPropertyValues
		}
	}
	
	var valid = true;
	//if one of the values is zero, than it is invalid. 
	for (var i =0 ; i<neededPropertyValues.length; i++){	
		if (neededPropertyValues[i].length == 0){
			valid = false;
		}
	}
	
	//check for valid propertiesList.
	if ( !valid || neededPropertyValues.length !== this.numberOfProperties){
		neededPropertyValues = [];
		for (var k =0;k<this.numberOfProperties; k++){	
			neededPropertyValues.push([]);
			// 
		}	
	}
	
	
	
	//we now have a list from all the propertyvalues, we can build a list of possible cards from it.
	
	return neededPropertyValues;
}

// Cards.prototype.gameSET_getCardPropertiesForMissingCard = function( SETMinusOneCard ){
	// //check if cards indeed make for a set (all properties unique or equal) (for a three card game, with 3 values, this is always true.)
	// //for each property, run through both cards, check 
	
	// if (SETMinusOneCard.length !== this.gameSET_howManyCardsPerSet() -1){
		// console.log("ASSERT ERROR: there should be a set minus one card provided.");
		// console.log(SETMinusOneCard.length);
		// console.log(this.gameSET_howManyCardsPerSet() -1);
	// }
	
	// var neededPropertyValues = []; //for each property the needed value to complete a set 
	// for (var i =0;i<this.numberOfProperties; i++){
		// var propertyValues = []; // for one property all values of this set minus one card.
		
		// for (var j =0;j<this.gameSET_howManyCardsPerSet()  -1; j++){	
			
			// // console.log(SETMinusOneCard[j].allValuesSame ()
			// propertyValues.push(SETMinusOneCard[j].getPropertyValue(i));
			
		// }
		// // console.log("propertyValues equal: " + propertyValues.allValuesSame ());
		// // console.log("propertyValues unique: " + propertyValues.allValuesUnique ());
		
		// if (propertyValues.allValuesSame ()){
			// neededPropertyValues.push(propertyValues[0]); //simply the same value
		// }else if (propertyValues.allValuesUnique ()){
			// neededPropertyValues.push(this.sumOffAllPropertyValues - propertyValues.reduce(function(a, b) { return a + b; }, 0)); //the missing value is the sum of all values, - the sum of all values in this "set minus one card" if we have a 0 and a 2      0+1+2  - 0+2  = 1 so one is missing value for this property
		// }else{
			// console.log("ASSERT ERROR: illegal card!");
			// console.log("actually, not neccessarily bad code, just means that there is a bad set here. depending on start conditions: how many propertyvalues? how many cards per set? ");
			// console.log("just means: invalid set!");
			// console.log(SETMinusOneCard);
		// }
	// }
	// return neededPropertyValues;
// }
	


//------------------------------------------------------------------------
//------------------------CARD ------------------------------------------------
//------------------------------------------------------------------------
function Card (id , numberOfProperties, numberOfValuesForEachProperty, isPropertiesDefinedById,properties){
	isPropertiesDefinedById = typeof isPropertiesDefinedById !== 'undefined' ? isPropertiesDefinedById : false;
	id = typeof id !== 'undefined' ? id : "noName";
	properties = typeof properties !== 'undefined' ? properties : [];
	this.id = id;
	this.numberOfValuesForEachProperty = numberOfValuesForEachProperty;
	
	this.properties = [];
	for (var i = 0;i<numberOfProperties;i++){
		this.properties.push("X");
	}
		
	if (properties.length >0 ){
		//if properties provided: check length, and if all values are "valid"
		console.log("aha");
		console.log(properties);
		if (properties.length == numberOfProperties){
			for (var i = 0;i<numberOfProperties;i++){
				if (!(properties[i] >=0 || properties[i]< numberOfValuesForEachProperty)){
					console.log("ASSERT ERROR value outside range ");
					console.log(numberOfValuesForEachProperty);
					console.log(properties.slice());
					this.properties[i] = properties[i];
				}
				
			}
		}else{
			console.log("ASSERT ERROR length of properties not valid. ");
			console.log(properties.length);
			console.log(numberOfProperties);
			
		}
		
	}else if (isPropertiesDefinedById ){
		this.setPropertiesFromId();
	}
	
	
	
	
}



	
Card.prototype.getNumberOfProperties = function(){
	return this.properties.length;
}

Card.prototype.getPropertyValue = function(property){
	return this.properties[property];
}

Card.prototype.getNumberOfValuesPerProperty = function(numberOfValuesForEachProperty){
	return this.numberOfValuesForEachProperty = numberOfValuesForEachProperty;
}

Card.prototype.setPropertyValue = function(property, value){
	//properties have just a numeric value.
	this.properties[property] = value;
}
Card.prototype.setPropertiesFromId = function (){
	// console.log(this.id);
	// console.log(this.properties);
	if (this.id.length !== this.properties.length){
		console.log("ASSERT ERROR: ID should be a string of chars of the same length as there are properties. (and chars to choose from should be no more than possible propertievalues. A=0, B=2,....)");
	}
	for (i=0;i<this.properties.length;i++){
		var value = this.id.charCodeAt(i) - 65 ; //ascii A=65
		if (value<0 || value > this.numberOfValuesForEachProperty -1){
			console.log("ASSERT ERROR: provided value derived from id is not a valid value, value: " + value );
			throw "aborted program on assert error.";
		}
		// console.log(this.numberOfValuesForEachProperty -1);
		this.properties[i] = this.id.charCodeAt(i) - 65 ; //ascii A=65
	}
}
Card.prototype.getPropertiesAsChars = function(property, value){
	//get property as letter 0 = A, 1 = B,...
	var asChars = [];
	for (var i=0;i<this.properties.length;i++){
		asChars.push(String.fromCharCode(65 + this.properties[i]));
	}
	
	return asChars;
}


Card.prototype.setIdFromProperties = function(id){
	this.id = this.getPropertiesAsChars().join("");
	this.isPropertiesDefinedById = true;
}

Card.prototype.show = function(){
	// console.log(this.id);
	if (this.isPropertiesDefinedById){
		console.log(this.id);
	}else{
		console.log(this.properties.join("-"));
	}
}

Card.prototype.getId = function(){
	return this.id;
}