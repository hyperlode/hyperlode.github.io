var solutionCardId = "";
var solutionCardIds = [];
var userChosenCards = [];
var userChosenCardsPositions = [];
var numberOfCardsMissingFromSet = []; //cards to guess to complete a set 
var cardsFromSetAsGiven = [];
var cardsToChooseFrom = [];
var setSearchChrono;
var gameType;
var realGame;
var setBeingEvaluated;

var NUMBER_OF_PROPERTIES = 4;
var NUMBER_OF_VALUES_PER_PROPERTY = 3;  // is also number of cards per set
var NUMBER_OF_CARDS_PER_SET = NUMBER_OF_VALUES_PER_PROPERTY;
var CARD_WIDTH = 100;
var CARD_MAX_ROTATION_ANGLE = 0;
// var CARD_MAX_ROTATION_ANGLE = 2;


var score = 0;
var topScores  = [0,0,0,0,0,0]; //first three: sets found in 60 seconds, resp:1,2 or 3 card guesses,   last three: time to find 10 sets, in millis.

var user = "userName";

var USE_COOKIE = false;
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
GAME_ELEMENT_ID = "setGameControls";
GLOBAL_CONTROLS_ELEMENT_ID = "globalControls";
TRAINER_OPTIONS_CONTROLS_ELEMENT_ID = "trainerOptions";

SET_TRAINER_DIV_ID = "setTrainer"
SET_GAME_DIV_ID = "setGame"


//DOM

var CARD_ANIMATION_DELAY_CORRECT = 500;
var CARD_ANIMATION_DELAY_WRONG = 2000;
var MAX_CARDS_PER_ROW = 4; //4
// var GAME_CARDS_TYPE = "addCardSvg_special_Brainfuck";
// var GAME_CARDS_TYPE = "cards_classic_SET";
var GAME_CARDS_TYPE = "cards_babyBlanket";

var SET_CARDS_TO_GUESS = 2	;
var CARDS_TO_CHOOSE_FROM = 12; //12

var TIMER_COUNTDOWN_INIT_SECONDS = 60;

var GAME_TYPE_FREE_PRACTICE = 0; 
var GAME_TYPE_COUNT_DOWN = 1; //don't change hard coded in topscore saving
var GAME_TYPE_CHRONO = 2;//don't change hard coded in topscore saving
var GAME_TYPE_REAL_GAME = 3;
//var GAME_TYPE_DEFAULT = GAME_TYPE_FREE_PRACTICE;  
// var GAME_TYPE_DEFAULT = GAME_TYPE_REAL_GAME;  

var SETS_TO_PLAY_IN_CHRONO_GAME = 5;
var TIME_TO_PLAY_IN_COUNTDOWN_GAME_MILLIS = 60000;

docReady(function() { 
	var setBeingEvaluated = false;
	
	if (USE_COOKIE){
		//cookies NEVER work locally!!!!
		//set cookies and saved variables
		if (getCookie(COOKIE_USER_VAR) == "" || getCookie(COOKIE_TOPSCORE_VARS[0]) ==  ""){
			//popup window
			// user = prompt("Please enter your name:", "");
			user = "SuperSetPlayer";
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
	}
	
	
	//initialize DOM
	
    globalReset();

    initGlobalFunctionalityDOM();

    // if (gameType === GAME_TYPE_FREE_PRACTICE){
    //     initSetTrainer();
    // }else if (gameType === GAME_TYPE_REAL_GAME){
    //     initSetGame();
    // }
    console.log("initialized");
});

function initSetTrainer(){
    globalReset()
    gameType = GAME_TYPE_FREE_PRACTICE;
	displayHowToDOM();
	//displayUserDOM();
	displayScoreDOM();
	displayAndInitChronoDOM();

	//start free practice
	startFreePractice();
    var trainerDiv = document.getElementById(SET_TRAINER_DIV_ID);
	trainerDiv.style.display = "";
    gameLevelChanged();
    // startFreePractice();
    // numberOfCardsMissingFromSet = SET_CARDS_TO_GUESS;
}

function initSetGame(){
    globalReset()
    gameType = GAME_TYPE_REAL_GAME;
    var gameDiv = document.getElementById(SET_GAME_DIV_ID);
    gameDiv.style.display = "";
    
    // start real game
    realGame = new RealGame();
    realGame.start();
}

function globalReset(){
    hideAll();
    solutionCardId = "";
    solutionCardIds = [];
    userChosenCards = [];
    userChosenCardsPositions = [];
    numberOfCardsMissingFromSet = []; //cards to guess to complete a set 
    cardsFromSetAsGiven = [];
    cardsToChooseFrom = [];
    setBeingEvaluated = false;

}
function hideAll(){
    var gameDiv = document.getElementById(SET_GAME_DIV_ID);
    var trainerDiv = document.getElementById(SET_TRAINER_DIV_ID);
    gameDiv.style.display = "none";
    trainerDiv.style.display = "none";
}

function emptyChosenCardsField(makeVisibleInField){
    makeVisibleInField = typeof makeVisibleInField !== 'undefined' ? makeVisibleInField : true;
	
    for (var i = 0;i<userChosenCardsPositions.length ;i++){
		
        if (makeVisibleInField){
            setVisibiliyCardPositionDom("position_option_"+userChosenCardsPositions[i], true);
        }
		
        var setCardPosition = userChosenCards.length - i - 1;
        showBlankCardPositionDom("position"+ setCardPosition);
	}
	
	userChosenCards = [];
	userChosenCardsPositions = [];
	
	displayScoreDOM();
}

//DOM==================================================================
function initGlobalFunctionalityDOM(){
    var buttonsElement = document.getElementById(GLOBAL_CONTROLS_ELEMENT_ID);
	addButtonToExecuteGeneralFunction(buttonsElement,"Start Trainer", "buttonStartSetTrainer", "buttonStartSetTrainer" , initSetTrainer);
	addButtonToExecuteGeneralFunction(buttonsElement,"Start Game", "buttonStartSetGame", "buttonStartSetGame" , initSetGame);
	
}

function getCardOutline(width, height, id,cssClass){
	//add card outline
	var outlineStrokeWidth = 4;
	
	var cardOutline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	cardOutline.setAttribute('width', width-outlineStrokeWidth); 
	cardOutline.setAttribute('height', height - outlineStrokeWidth); 
	cardOutline.setAttribute('rx', width/14); 
	cardOutline.setAttribute('ry', width/14); 
	cardOutline.setAttribute('x', outlineStrokeWidth/2); 
	cardOutline.setAttribute('y', outlineStrokeWidth/2); 
	// cardOutline.setAttribute('style',  'fill:white;stroke:black;stroke-width:2;opacity:1'); 
	cardOutline.setAttribute('id', id);
	cardOutline.setAttribute('class', cssClass); // Apply CSS class
	return cardOutline;

}

function addCardSvg_classicSetGame(elementToAttachTo,width,id,quantityValue,shapeValue,colorValue, infillValue){
	//ratio:  width * 1.45 = height
	var height = width * 1.45;
	
	//add card
	
	addSvg(elementToAttachTo,id,width,height,"white","white");
	var card = document.getElementById(id);
	card.appendChild(getCardOutline(width, height, id+"_cardOutline", "cardOutline"));
		
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
function addCardSvg_babyBlanket(elementToAttachTo,width,id,quantityValue,shapeValue,colorValue, infillValue){
	//ratio:  width * 1.45 = height
	var height = width * 1.45;
	// var height = width * 2;
	
	//add card
	addSvg(elementToAttachTo,id,width,height,"blue","green");
	var card = document.getElementById(id);
	card.appendChild(getCardOutline(width, height, id+"_cardOutline", "cardOutline"));
		
	//set properties to value.
	//shape
	trianglePoints = "0.25 0.5 , 0.5 0 , 0.75 0.5";
	squarePoints = "0.25 0, 0.25 0.5, 0.75 0.5, 0.75 0";
	circlePoints = "0.8 0.25, 0.798 0.281, 0.792 0.312, 0.783 0.342, 0.771 0.371, 0.755 0.399, 0.737 0.425, 0.716 0.449, 0.692 0.471, 0.666 0.49, 0.638 0.506, 0.609 0.519, 0.579 0.529, 0.548 0.536, 0.517 0.54, 0.485 0.54, 0.454 0.536, 0.423 0.529, 0.393 0.519, 0.364 0.506, 0.336 0.49, 0.31 0.471, 0.286 0.449, 0.265 0.425, 0.247 0.399, 0.231 0.371, 0.219 0.342, 0.21 0.312, 0.204 0.281, 0.202 0.25, 0.204 0.219, 0.21 0.188, 0.219 0.158, 0.231 0.129, 0.247 0.101, 0.265 0.075, 0.286 0.051, 0.31 0.029, 0.336 0.01, 0.364 -0.006, 0.393 -0.019, 0.423 -0.029, 0.454 -0.036, 0.485 -0.04, 0.517 -0.04, 0.548 -0.036, 0.579 -0.029, 0.609 -0.019, 0.638 -0.006, 0.666 0.01, 0.692 0.029, 0.716 0.051, 0.737 0.075, 0.755 0.101, 0.771 0.129, 0.783 0.158, 0.792 0.188, 0.798 0.219"

	var shapesByValue= [circlePoints, squarePoints, trianglePoints];
	var symbolWidth = width/2;
	var symbolHeightIncludingWhiteSpace = symbolWidth/2.7;
		
	//color
	//var colorByValue = ["red","green","blue"];
	// var colorByValue = ["#F4A7B9","#A7D8F4","#F4E1A7"];
	// var colorByValue = ["#a8da65","#ef587e","#3bc0b3"]; //#e8e100 (yellow) "#a8da65"green,"#ef587e"pink,"#3bc0b3"blue
	var colorByValue = ["#f6aa2f","#ff0eb1","#3bc0b3"]; //#e8e100 (yellow) "#a8da65"green,"#ef587e"pink,"#3bc0b3"blue
	
	//pattern
	var vertical_hatch_id =  "vertical_hatch_"+id;
	add_pattern_vertical_lines(card, "vertical_hatch_"+id, colorByValue[colorValue], width/5000, width/1000);
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
		add_polygon(card,shapesByValue[shapeValue], colorByValue[colorValue],fillByValue[infillValue],symbolWidth*0.5, dy, symbolWidth);
	}
}

function addCardSvg_special_Brainfuck(elementToAttachTo,width,id, brightnessTextValue,textValue,colorValue, brightnessValue){
	//ratio:  width * 1.45 = height
	var height = width * 1.45;
	
	//add card
	addSvg(elementToAttachTo,id,width,height,"white","white");
	var card = document.getElementById(id);
	card.appendChild(getCardOutline(width, height, id+"_cardOutline", "cardOutline"));
	
	// //add card outline
	// var cardOutline = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	// cardOutline.setAttribute('width', width-outlineStrokeWidth); 
	// cardOutline.setAttribute('height', height - outlineStrokeWidth); 
	// cardOutline.setAttribute('rx', width/14); 
	// cardOutline.setAttribute('ry', width/14); 
	// cardOutline.setAttribute('x', outlineStrokeWidth/2); 
	// cardOutline.setAttribute('y', outlineStrokeWidth/2); 
	// cardOutline.setAttribute('style',  'fill:white;stroke:black;stroke-width:2;opacity:1'); 
	// card.appendChild(cardOutline);
		
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

// function initGameDom(){
// 	var setShowField = document.getElementById("topField");
// 	addDiv(setShowField, "card");
// }

function setVisibiliyCardPositionDom(elementToWhichCardIsAttachedId , isVisible){
	var cardDiv = document.getElementById(elementToWhichCardIsAttachedId);
	if (isVisible){
		cardDiv.style.visibility = "";
		rotateSvgCard(elementToWhichCardIsAttachedId,CARD_MAX_ROTATION_ANGLE);
	}else{
		cardDiv.style.visibility = "hidden";
		
	}
}

function showBlankCardPositionDom(elementToAttachToId){
    // console.log(elementToAttachToId);
	var cardDiv = document.getElementById(elementToAttachToId);
	cardDiv.innerHTML = "";
	var width = CARD_WIDTH;
	var height = width * 1.45;
	
	//add card
	var outlineStrokeWidth = 4;
	addSvg(cardDiv,"blank_"+elementToAttachToId, width ,height,"white","white");
	// var card = document.getElementById(id);

	refreshSvgCardsFix();
	
}

function refreshSvgCardsFix(){
	document.querySelectorAll(".card svg").forEach(s=> {
		s.style.background = 'transparent';
		s.style.border = '0px';
	});
}

function showCardDom(card, elementToAttachToId, isVisible){
    isVisible = typeof isVisible !== 'undefined' ? isVisible : true;
	var cardDiv = document.getElementById(elementToAttachToId);
	
	//cardId as title
	cardDiv.innerHTML = "";
	//card as svg
	if (GAME_CARDS_TYPE == "addCardSvg_special_Brainfuck"){
		addCardSvg_special_Brainfuck(cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));
	}else if( GAME_CARDS_TYPE == "cards_classic_SET"){
		addCardSvg_classicSetGame  (cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));
	}else if( GAME_CARDS_TYPE == "cards_babyBlanket"){
		addCardSvg_babyBlanket  (cardDiv,CARD_WIDTH, elementToAttachToId +"_"+card.getId() , card.getPropertyValue(0),card.getPropertyValue(1),card.getPropertyValue(2), card.getPropertyValue(3));	
	}else{
		console.log("error, select card visuals TYPE");
	}

	setVisibiliyCardPositionDom(elementToAttachToId, isVisible);
	rotateSvgCard(elementToAttachToId +"_"+card.getId(),  CARD_MAX_ROTATION_ANGLE);

}

function rotateSvgCard(cardId, maxAngle){
	// for a natural feel
	// document.querySelectorAll(".card").forEach(c=> {
	//     let a = 2 * max_angle * Math.random() - max_angle;
	//     c.style.transform = `rotate(${a}deg)`;
	//     c.style.transition = `transform ${transition_sec}s`;
	// });
	let a = 2 * maxAngle * Math.random() - maxAngle;  // angle neg or pos

	document.getElementById(cardId).style.transform = `rotate(${a}deg)`;

	refreshSvgCardsFix();
}

function addCardLocationToDom(elementToAttachTo,cardPosition){
	

	//create a div, show card and add it to the DOM 
	var cardDiv = addDiv(elementToAttachTo, "position" + cardPosition,  "card");
	cardDiv.innerHTML = '';
	return cardDiv;
}

function addSetCardLocationToDom(elementToAttachTo, cardPosition){
	// the cards picked by the user to for a set will be displayed here (player builds his set)
	
	var cardDiv= addCardLocationToDom(elementToAttachTo, cardPosition);
	cardDiv.addEventListener('click', function(){
        // console.log("card from potential set clicked");
		setCardClicked(cardPosition); 
	});
}

function addPossibleCardSolutionLocationToDom(elementToAttachTo, position){
	// this is the field of cards to choose from

    var optionContainer = addDiv(elementToAttachTo, "optionPosition" + position,"cardChoice");
	//var card  = new Card ("A" , 1, 1, true);
	//add card
	var cardDiv = addCardLocationToDom(optionContainer, "_option_"+position);
	
	//add click event to card
	cardDiv.addEventListener('click', function(){
        // console.log("table  card clicked");
		optionCardClicked(position); 
	});
	
	//add button
	//addButtonToExecuteGeneralFunction(optionContainer,"Chose", "optionButton", "optionButton"+ position, optionCardClicked, position);
}



function addSetCardLocationsToDom(cardsPerSet, cardsToChooseFrom){
	// build up the fields with option cards and set cards locations	

    // numberOfCardsMissingFromSet = numberOfCardsToGuess;
    var setShowField = document.getElementById("topField");
    setShowField.innerHTML = "";
    //prepare fields in dom
    
    //for (var i=0;i<valuesPerProperty - numberOfCardsToGuess;i++){
    for (var i=0;i< cardsPerSet;i++){
        addSetCardLocationToDom(setShowField, i);
        showBlankCardPositionDom("position"+ i);
    }

    var bottomField = document.getElementById("bottomField");
    // bottomField.innerHTML = "<p>Click all the cards that are needed to make a set together with the top cards, according to the SET game rules (needed cards = " + numberOfCardsToGuess + "): </p>";
    bottomField.innerHTML = "";

    //add space for the other cards.
    var div;
    for (var i=0; i<cardsToChooseFrom; i++){
        if ( i % MAX_CARDS_PER_ROW == 0 ){
            div = addDiv(bottomField, "bottomRow_" + i/MAX_CARDS_PER_ROW , "bottomRow");
        }
        addPossibleCardSolutionLocationToDom(div, i );
    }
}

//----------------------------functionality--------

function optionCardClicked(number){
    // card on the field is clicked
    
	//check if a set is being evaluated (there is a delay, showing the cards) if so, no cards should be clicked.
	if (setBeingEvaluated == true){
		console.log("evaluating");
		return ;
	}

	

	let chosenCard;
    if (gameType === GAME_TYPE_FREE_PRACTICE){

        chosenCard = cardsToChooseFrom[number];
        userChosenCards.push(chosenCard);
        userChosenCardsPositions.push(number);
        
        if (userChosenCards.length <= numberOfCardsMissingFromSet ){
            //add clicked card to the topfield set.
            var position = cardsFromSetAsGiven.length  + userChosenCards.length-1;
            showCardDom(chosenCard, "position" + position);
    
            //delete card from field (make blank)
            //showBlankCardPositionDom("position_option_"+number);
            setVisibiliyCardPositionDom("position_option_"+number, false);
        }
        
        if (userChosenCards.length == numberOfCardsMissingFromSet){
            setBeingEvaluated = true;
            //user has chosen number of cards
            userChosenCards.push.apply(userChosenCards, cardsFromSetAsGiven);
            
            if (areCardsASet( userChosenCards,NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY)){
                    correctSetAttempt();
                
            }else{
                wrongSetAttempt();
            }
        }
    
        // console.log(userChosenCards);

    }else if (gameType === GAME_TYPE_REAL_GAME){


		if (!realGame.playerIsActivated()){
			alert ("Press your player button first. Every player has a button. Choose your number. Press the buttons with your number when you see a set. Then choose the cards making up the set. If correct, your score will increase.")
			return 
		}

        chosenCard = realGame.getFieldCardByPosition(number);
        //check if a set is being evaluated (there is a delay, showing the cards) if so, no cards should be clicked.
        if (setBeingEvaluated == true){
            console.log("still evaluating");
            return ;
        }
        
        userChosenCards.push(chosenCard);
        userChosenCardsPositions.push(number);
        if (userChosenCards.length<= NUMBER_OF_CARDS_PER_SET ){
            
            //add clicked card to the topfield set.
            //var position = cardsFromSetAsGiven.length  + this.userChosenCards.length-1;
            let position = userChosenCards.length-1;
            showCardDom(chosenCard, "position"+position);
            
            //delete card from field as it's moved (make blank)
            setVisibiliyCardPositionDom("position_option_"+number, false);
        }

        if (userChosenCards.length == NUMBER_OF_CARDS_PER_SET){
            setBeingEvaluated = true;
            
            if (areCardsASet( userChosenCards,NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY)){
                console.log("set found!");
                realGame.correctSetAttempt(userChosenCards);
                setTimeout(resetFromCorrectSetAttempt, CARD_ANIMATION_DELAY_CORRECT ); 
                
            }else{
                console.log("wrong guess");
                realGame.wrongSetAttempt();
                
                score = 0;
                displayScoreDOM();
                setTimeout(resetFromWrongSetAttempt, CARD_ANIMATION_DELAY_WRONG ); 
            }
        }
    }
}


function setCardClicked(positionNumber){
    // clicked on one of the selected cards (to undo)
	
    //check if a set is being evaluated (there is a delay, showing the cards) if so, no cards should be clicked.
	if (setBeingEvaluated == true){
		console.log("still evaluating");
		return ;
	}
	
	userChosenCardsIndex = positionNumber - cardsFromSetAsGiven.length;
	
	if (positionNumber > cardsFromSetAsGiven.length -1 && positionNumber < userChosenCards.length  + cardsFromSetAsGiven.length ){
		//card position from a user selected card is clicked.
		
		//show last card as blank
		var blankPosition = userChosenCards.length  + cardsFromSetAsGiven.length -1;
		showBlankCardPositionDom("position" + blankPosition);
		
		var cardToBeRemovedFromSet = userChosenCards[userChosenCardsIndex];
		var positionOfCardToBeRemovedFromSetInOptionsField = userChosenCardsPositions[userChosenCardsIndex];

		//remove the selected card.
		userChosenCards.remove(cardToBeRemovedFromSet);
		userChosenCardsPositions.remove(positionOfCardToBeRemovedFromSetInOptionsField);
		
		//redisplay the set card on the field

        if (gameType == GAME_TYPE_FREE_PRACTICE){

            for (var i = 0; i< userChosenCards.length; i++){
                var pos = cardsFromSetAsGiven.length+i;
                showCardDom(cardsToChooseFrom[userChosenCardsPositions[0]], "position" +  pos);
            }
        }else if (gameType == GAME_TYPE_REAL_GAME){
            for (var i = 0; i< userChosenCards.length; i++){
                var pos = cardsFromSetAsGiven.length+i;
                var card = this.realGame.getFieldCardByPosition(userChosenCardsPositions[0])
                showCardDom(card, "position" +  pos);
            }
        }
		
		setVisibiliyCardPositionDom("position_option_"+positionOfCardToBeRemovedFromSetInOptionsField, true); //set card visible again in field
	}
}

function resetFromWrongSetAttempt(){
	//console.log("wrong set guess reset");
	
	if (gameType === GAME_TYPE_FREE_PRACTICE){
        setSearchChrono.Reset();
        score = 0;
        displayScoreDOM();
        
        emptyChosenCardsField(); //leave current round as it is, so a retry is possible.
        
	}else if (gameType === GAME_TYPE_REAL_GAME){
		emptyChosenCardsField();

    }else{
		emptyChosenCardsField();
		createSet_PlayOneRound(numberOfCardsMissingFromSet, false); //if wrongly guessed during a chrono game, new round .
	}
	setBeingEvaluated = false;
}

function resetFromCorrectSetAttempt(){
    
    if (gameType === GAME_TYPE_FREE_PRACTICE){
        emptyChosenCardsField(true);
        createSet_PlayOneRound(numberOfCardsMissingFromSet, false); //new round
        
	}else if (gameType === GAME_TYPE_REAL_GAME){
        emptyChosenCardsField(false);

    }

	setBeingEvaluated = false;
}

function areCardsASet(cards, numberOfProperties, number_of_values_per_property){
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
	
	//first card = random
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
	
	console.log("number of cards to choose from: " + fittingCards.getNumberOfCards());
	// var maxIterations = 10;
	// while(fittingCards.getNumberOfCards() >0 && maxIterations >0){
	while(fittingCards.getNumberOfCards() > 0){

        // pick a card that matches the SET requirement for the already picked cards
		var pickedCard = fittingCards.getRandomCard();
		// pickedCard.show();
        setBuilder.push (pickedCard);
        
		cardsToChooseFromProperties = completeCards.gameSET_getPropertiesOfMatchingCardsForAGivenAmountOfCards(setBuilder);
		if (checkArrayContainsEmptyArrayAsElement(cardsToChooseFromProperties)){
			//console.log("unvalid");
			fittingCards = new Cards(0, 0);
			
		}else{
			//console.log("valid");
			fittingCards = new Cards(numberOfProperties, valuesPerProperty, cardsToChooseFromProperties);
		}
		
		console.log("number of cards to choose from: " + fittingCards.getNumberOfCards());
		
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
