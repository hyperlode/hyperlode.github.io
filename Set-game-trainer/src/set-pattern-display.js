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

	var div;
	for (var i = 0; i < optionsToChooseFrom; i++) {
		console.log(" ok ok ok ok")
		if (i % MAX_CARDS_PER_ROW == 0) {
			div = addDiv(bottomField, "bottomRow_" + i / MAX_CARDS_PER_ROW, "bottomRow");

			
		}
	}

}