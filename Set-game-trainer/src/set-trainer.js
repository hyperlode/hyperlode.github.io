// -------DOM -----------------


function displayAndInitChronoDOM(){
	var chronoElement = document.getElementById(CHRONO_ELEMENT_ID);
	chronoElement.innerHTML = "";
	var buttonElement = document.getElementById(BUTTON_MAIN_ELEMENT_ID);
	
	setSearchChrono = addChrono(chronoElement, "setTimer",buttonElement ); //simpleTimer set in domFunctions.js because why do things simple if it can be complicated.
}
function addChrono(elementToAttachTo, id, buttonElement, countDownMillis){
	//adds startbutton, minutes and seconds.
	var chronoElement = addDiv(elementToAttachTo, id);
	
	var chronoo = new SimpleTimer(20, buttonElement,countDownMillis);
	chronoo.secondsDiv =  addDiv(chronoElement, id+ "_seconds");
	chronoo.minutesDiv = addDiv(chronoElement, id+ "_minutes");
	chronoo.millisDiv =  addDiv(chronoElement, id+ "_millis");
	
	chronoo.ButtonSetToStart(); //has to be done here.
	return chronoo;
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
	infoElement.innerHTML = '<h1>SET Trainer</h1><p> <a href= "https://boardgamegeek.com/boardgame/1198/set">Description and rules.</a><br>Start the game	and pick five sets as fast as possible.<br>If a mistake is made, the game restarts.<br>There is always a SET to be found!</p> ';
}

function displayUserDOM(){
	var userElement = document.getElementById(USER_ELEMENT_ID);
	userElement.innerHTML= "Enable cookies to save your top score.!";
}

function getTopScorePositionInTopScores(){
	return (numberOfCardsMissingFromSet - 1) + (GAME_TYPE_CHRONO - 1) * 3; 
}

function displayScoreDOM(){
	var scoreElement = document.getElementById(SCORE_ELEMENT_ID);
	
	var topScoreString = ""
	// for (var i = 1; i<topScores.length+1; i++){
		// topScoreString += "Your top score for " +i + " card guess: " +  topScores[i-1] + " <BR> ";
	// // scoreElement.innerHTML = "TopScore 1 card guess: "+ topScore_1guess +" <BR> "+"TopScore 2 card guess: "+ topScore_2guess +" <BR> "+"TopScore 3 card guess: : "+ topScore_3guess +" <BR> "+" Score: " + score;
	// }
	topScoreString += "Your top score for " +numberOfCardsMissingFromSet + " card guess: " +  topScores[getTopScorePositionInTopScores()]/1000  + " seconds <BR> ";
	
	scoreElement.innerHTML = topScoreString + " Found sets: " + score;
}

// function displayAndInitChronoDOM(){
	// addButton(chronoElement,"start","buttonName", id + "_button", setChrono);
// } 



//----------game-----------------

//function gameTypeChanged(){
//	
//	var e = document.getElementById("gameTypeBootstrap");
//	if (e){ //console.log(e);
//		//check if gameType changer is existing.
//		gameType = e.value;
//	}else{
//		gameType = GAME_TYPE_DEFAULT;
//	}
//	displayAndInitChronoDOM();
//}

function gameLevelChanged(){
	
	var e = document.getElementById("gameLevelBootstrap");
	// var strUser = e.options[e.selectedIndex].value;	
	//cardsToGuess = e.value;	
	
	numberOfCardsMissingFromSet = e.value;
	//createSet_PlayOneRound(numberOfCardsMissingFromSet,true);
	
	if (gameType !== GAME_TYPE_FREE_PRACTICE){
		setSearchChrono.Stop();
		console.log("stopped game");
	}
	startFreePractice();
	console.log("change level");
}

function createSet_PlayOneRound(numberOfCardsToGuess, gameStartup){
	gameStartup = typeof gameStartup !== 'undefined' ? gameStartup : false;

	numberOfProperties = NUMBER_OF_PROPERTIES; //i.e. shape, quantity, color, infill
	valuesPerProperty =NUMBER_OF_VALUES_PER_PROPERTY; // i.e 3 (for the color: red, green and blue,   for the infill: solid, stripes, blank   ,.....
	
	// var numberOfCardsToGuess = numberOfCardsToGuess;
	var optionsToChooseFrom = CARDS_TO_CHOOSE_FROM; //total number of cards open on the table to look for a set
	
	if (gameStartup){
		//set length is always equal to number of values per property
		// options to choose from: set cards field size
		addSetCardLocationsToDom(valuesPerProperty, optionsToChooseFrom)
	}
	
	//complete set
	var set = getFullSet(numberOfProperties, valuesPerProperty);
	
	//possible cards to choose from (that are spread open on the table)
	cardsToChooseFrom = []; //reset options.
	var deck = new Deck (numberOfProperties, valuesPerProperty);
	
	//take out solution cards from deck (so there will never be a same card shown on the table).
	solutionCardIds = [];
	for (var i=0;i<set.length;i++){
		//console.log("set card: (take away from deck)" + set[i].getId());
		deck.takeOffSpecificCard(set[i].getId());
	}
	
	for (var i=0;i<optionsToChooseFrom-numberOfCardsToGuess;i++){
		deck.shuffle(); 
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
		showCardDom(set[i],"position" + i);
	}
	for (var i=0;i<cardsToChooseFrom.length;i++){
		//possible answer cards
		
		showCardDom(cardsToChooseFrom[i], "position_option_"+ i);
	}
}

//==================game =========================


function wrongSetAttempt(){
	console.log("wrong guess");
	// console.log(userChosenCards);
	
	score = 0;
	displayScoreDOM();
	setTimeout(resetFromWrongSetAttempt, CARD_ANIMATION_DELAY_WRONG ); 
	
	if (gameType == GAME_TYPE_CHRONO){
		//reset and restart.
	}
}

function correctSetAttempt(){
	console.log("set found!");
	score++;
	
	if (gameType == GAME_TYPE_CHRONO && score >= SETS_TO_PLAY_IN_CHRONO_GAME){
		//if number of cards exceeded, go to reset game (it is finished then!
		chronoGameEnded();
	}
	
	displayScoreDOM();
	setTimeout(resetFromCorrectSetAttempt, CARD_ANIMATION_DELAY_CORRECT ); 
}



// function trainerOptionCardClicked(number){

	
// 	//check if a set is being evaluated (there is a delay, showing the cards) if so, no cards should be clicked.
// 	if (setBeingEvaluated == true){
// 		console.log("evaluating");
// 		return ;
// 	}
	
// 	userChosenCards.push(cardsToChooseFrom[number]);
// 	userChosenCardsPositions.push(number);
	
// 	// if (userChosenCards.length + cardsFromSetAsGiven.length <= NUMBER_OF_VALUES_PER_PROPERTY ){
// 	if (userChosenCards.length  <= numberOfCardsMissingFromSet ){
// 		//add clicked card to the topfield set.
// 		var position = cardsFromSetAsGiven.length  + userChosenCards.length-1;
// 		showCardDom(cardsToChooseFrom[number], "position" + position);
// 		//delete card from field (make blank)
// 		//showBlankCardPositionDom("position_option_"+number);
// 		setVisibiliyCardPositionDom("position_option_"+number, false);
// 	}
	
// 	if (userChosenCards.length == numberOfCardsMissingFromSet){
// 		setBeingEvaluated = true;
// 		//user has chosen number of cards
// 		userChosenCards.push.apply(userChosenCards, cardsFromSetAsGiven);
		
// 		if (areCardsASet( userChosenCards,NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY)){
// 			console.log("set found!");
// 			score++;
			
// 			if (gameType == GAME_TYPE_CHRONO && score >= SETS_TO_PLAY_IN_CHRONO_GAME){
// 				//if number of cards exceeded, go to reset game (it is finished then!
// 				chronoGameEnded();
// 			}
			
// 			displayScoreDOM();
// 			setTimeout(resetFromCorrectSetAttempt, CARD_ANIMATION_DELAY_CORRECT ); 
			
// 		}else{
// 			console.log("wrong guess");
// 			console.log(userChosenCards);
			
// 			score = 0;
// 			displayScoreDOM();
// 			setTimeout(resetFromWrongSetAttempt, CARD_ANIMATION_DELAY_WRONG ); 
			
// 			if (gameType == GAME_TYPE_CHRONO){
// 				//reset and restart.
// 			}
// 		}
// 	}
// }

function updateTopScore(amount, highestUpdateElseLowest){
	// distinguish between "is lower better or higher better?"
	//i.e. in chrono game, lower time is better!
	highestUpdateElseLowest = typeof highestUpdateElseLowest !== 'undefined' ? highestUpdateElseLowest : true;

	var compareAmount = amount
	var scoreToCompareTo = topScores[ getTopScorePositionInTopScores()];
	if (!highestUpdateElseLowest){
		scoreToCompareTo = -scoreToCompareTo;
		compareAmount  = -compareAmount; 
	}

	if ( compareAmount > scoreToCompareTo || (scoreToCompareTo == 0 )){
		topScores[getTopScorePositionInTopScores()] = amount;
		console.log("new topscore");
		if (scoreToCompareTo == 0){
			alert ("First top score set to: " + amount + "ms.");
		}else{
			alert ("New top score! new: " + amount + "ms, old: " + scoreToCompareTo + "ms.");
		}
	}else{
			alert ("pwaap pwaaaap... No new top score. Your score: " + amount + "ms, top score: " + scoreToCompareTo + "ms.");
	}
	if (USE_COOKIE){
		for (var i = 0; i< topScores.length; i++){
			setCookie(COOKIE_TOPSCORE_VARS[i], topScores[i],  COOKIES_DAYS_TILL_EXPIRATION);
		}
	}
}

function chronoGameEnded(){
	//finished chrono game when asked number of sets is reached.
	updateTopScore(setSearchChrono.millis,false);
	setSearchChrono.Stop();
	console.log("game ended.");
	startFreePractice();
}

function startFreePractice(){
	setBeingEvaluated = false;
	gameType = GAME_TYPE_FREE_PRACTICE;
	score = 0;
	createSet_PlayOneRound( numberOfCardsMissingFromSet,true);
	displayScoreDOM();
};

function startChronoGame(){
	setBeingEvaluated = false;
	gameType = GAME_TYPE_CHRONO;
	emptyChosenCardsField();
	createSet_PlayOneRound(numberOfCardsMissingFromSet, true); //new game
}

function stopChronoGame(){
	gameType = GAME_TYPE_FREE_PRACTICE;
	emptyChosenCardsField();
}

function startRealGame(){
	setBeingEvaluated = false;
	gameType = GAME_TYPE_REAL_GAME;
	emptyChosenCardsField();

}
