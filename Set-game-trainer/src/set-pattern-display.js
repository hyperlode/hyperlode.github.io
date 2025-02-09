function testlode() {
	console.log("efeoef");
	globalReset();
}

function display_pattern(numberOfCardsToGuess) {
	numberOfProperties = NUMBER_OF_PROPERTIES; //i.e. shape, quantity, color, infill
	valuesPerProperty = NUMBER_OF_VALUES_PER_PROPERTY; // i.e 3 (for the color: red, green and blue,   for the infill: solid, stripes, blank   ,.....
	MAX_CARDS_PER_ROW = 9;
	var numberOfCardsToGuess = numberOfCardsToGuess;
	// var optionsToChooseFrom = CARDS_TO_CHOOSE_FROM;
	var optionsToChooseFrom = 100;

	var bottomField = document.getElementById("bottomField");
	// bottomField.innerHTML = "<p>Click all the cards that are needed to make a set together with the top cards, according to the SET game rules (needed cards = " + numberOfCardsToGuess + "): </p>";
	bottomField.innerHTML = "";
	var MAX_CARDS_ON_FIELD = 81;
	addSetCardLocationsToDom(NUMBER_OF_CARDS_PER_SET,MAX_CARDS_ON_FIELD);

	var div;
	for (var i = 0; i < optionsToChooseFrom; i++) {
		console.log(" ok ok ok ok")
		if (i % MAX_CARDS_PER_ROW == 0) {
			div = addDiv(bottomField, "bottomRow_" + i / MAX_CARDS_PER_ROW, "bottomRow");


		}
	}

	this.deck = new Deck (NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY);
    
        // console.log(this.set);
        // console.log("lode");
        
        this.fieldCards = [];
        for(var i=0;i<16;i++){
            this.fieldCards[i] = false;
        }
    
        this.deck.shuffle(); 

		let dummyCard = new Card("lode",NUMBER_OF_PROPERTIES,NUMBER_OF_VALUES_PER_PROPERTY,true,[0,0,0,0]);
        
        // for (var i=0;i<100;i++){
        //     this.addCardToField(dummyCard, i,false);
        // }

		setupSetPatternField(81,9);
		this.deck.show();
		
		addCardToField(this.deck.takeOffTopCard(), 10, true);
		

}

function addCardToField(card, index, visible){
	showCardDom(card, "position_option_"+ index, visible);
}



function setupSetPatternField( cardsToChooseFrom, cardsPerRow){

	// build up the fields with option cards and set cards locations	

    // numberOfCardsMissingFromSet = numberOfCardsToGuess;
    // var setShowField = document.getElementById("topField");
    // setShowField.innerHTML = "";
    // //prepare fields in dom
    
    // //for (var i=0;i<valuesPerProperty - numberOfCardsToGuess;i++){
    // for (var i=0;i< 100;i++){
    //     addSetCardLocationToDom(setShowField, i);
    //     showBlankCardPositionDom("position"+ i);
    // }

    var bottomField = document.getElementById("bottomField");
    // bottomField.innerHTML = "<p>Click all the cards that are needed to make a set together with the top cards, according to the SET game rules (needed cards = " + numberOfCardsToGuess + "): </p>";
    bottomField.innerHTML = "";

    //add space for the other cards.
    var div;
    for (var i=0; i<cardsToChooseFrom; i++){
		console.log("added: " + i);
        if ( i % cardsPerRow == 0 ){
            div = addDiv(bottomField, "bottomRow_" + i/cardsPerRow , "bottomRow");
        }
        addPossibleCardSolutionLocationToDom(div, i );
    }
}
