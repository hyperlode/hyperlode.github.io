function testlode(){
    console.log("efeoef");
    //globalReset();
}
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
}