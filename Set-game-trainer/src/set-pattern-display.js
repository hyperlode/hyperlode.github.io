function testlode() {
	console.log("efeoef");
	globalReset();
}


function get_pattern_as_id_array() {
	// let array_string_single_set_windows = ["1BsP", "3RsS", "2RhP", "3BoS", "1BhP", "2GhS", "2BsP", "1BoD", "1RoS", "3RhS", "1BoS", "1BsS", "1GoD", "3BsP", "1RhS", "2GoP", "3BoP", "2BhS", "3GsS", "2RhD", "3RhP", "2GhD", "3GhP", "3BoD", "3BhD", "3RsD", "2RsP", "1GsP", "2BoS", "1RsS", "2RhS", "1GoP", "3RsP", "1GsD", "1RhD", "1BhS", "3BhS", "2BoP", "2BsD", "1RoP", "1RsP", "1GsS", "1RoD", "3GhD", "1GhD", "2BoD", "2BsS", "2RsS", "3BhP", "3GoD", "2RoP", "3GhS", "2RoS", "2RsD", "2GoD", "3BsD", "3RoP", "3GsD", "2GsD", "1GoS", "3RhD", "3GoP", "3GoS", "1RsD", "3RoS", "1BsD", "3BsS", "2BhP", "1RhP", "1GhP", "2GhP", "2GsS", "2GoS", "3RoD", "2RoD", "1GhS", "1BoP", "2GsP", "3GsP", "1BhD", "2BhD"]
	let array_string_single_set_windows = ["1BoP", "3BsD", "1BsS", "2RsP", "3RsS", "1BhD", "2RoP", "1RoP", "1BhP", "3RoS", "1RhD", "3BhP", "1BoS", "2GoS", "1GoD", "1RsP", "2GsS", "1GhD", "1BsP", "1RoD", "3BhD", "2RhS", "1RoS", "1GsS", "2BsD", "3RhS", "3GoS", "3RhD", "2BoD", "1RsS", "2BhS", "1GsP", "1RsD", "3GoD", "3GhD", "2GsP", "1GoS", "2GhD", "2GoD", "3RsP", "3RsD", "3RhP", "2BhP", "1BhS", "2RoD", "2RsS", "3BoD", "1GoP", "3BhS", "3GsP", "2BoS", "3BoS", "2BhD", "3GhS", "3RoD", "3RoP", "1RhS", "2BsS", "1BoD", "2RhP", "3BsP", "2BsP", "3GsS", "2BoP", "1GhS", "3GoP", "3BsS", "3GhP", "3GsD", "1GhP", "2RoS", "2GhP", "2RhD", "2GoP", "1RhP", "1BsD", "2GsD", "3BoP", "2GhS", "1GsD", "2RsD"]
	// for provide card properties: 1 = count, 2=colour, 3=infill, 4=shape
	//for card id: 1 = count, 2=shpae, 3=colour, 4 = infill

	// prop to card id: --> 1:1, 2:4, 3:2, 4:3
	const mapPosition1 = { "1": "A", "2": "B", "3": "C" };
	const mapPosition2 = { "R": "A", "G": "B", "B": "C" }; // 2 is shpae
	const mapPosition3 = { "o": "A", "s": "B", "h": "C" };
	const mapPosition4 = { "D": "A", "P": "B", "S": "C" };
	// console.log(array_string);
	array_string_converted_not_yet_right_positioned = array_string_single_set_windows.map(item => {
		let newString =
			mapPosition1[item[0]] +
			mapPosition2[item[1]] +
			mapPosition3[item[2]] +
			mapPosition4[item[3]];
		return newString;
	});
	array_string_converted_to_card_ids = array_string_converted_not_yet_right_positioned.map(item => {
		let newString =
			item[0] +
			item[3] +
			item[1] +
			item[2];
		return newString;
	});
	// console.log(array_string_converted_to_card_ids);
	return array_string_converted_to_card_ids;
}

function display_pattern(numberOfCardsToGuess) {

	this.deck = new Deck(NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY);

	// cards per pattern
	PATTERN_CARDS_COUNT = 81; // 9rowsx9cols
	PATTERN_CARDS_PER_ROW = 9; // aka number of cols

	// amount of patterns displayed
	PATTERN_ROWS = 3; //3 // repeating of pattern
	PATTERN_COLS = 3; //3
	PATTERNS = PATTERN_ROWS * PATTERN_COLS;


	TOTAL_CARDS = PATTERN_CARDS_COUNT * PATTERNS;
	TOTAL_CARDS_PER_ROW_OF_CARDS_IN_PATTERN_GRID = PATTERN_CARDS_PER_ROW * PATTERN_COLS;

	TOTAL_CARDS_PER_PATTERN_ROW = PATTERN_CARDS_COUNT * PATTERN_COLS;

	let dummyCard = new Card("lode", NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY, true, [0, 0, 0, 0]);
	setupSetPatternField(TOTAL_CARDS, TOTAL_CARDS_PER_ROW_OF_CARDS_IN_PATTERN_GRID);
	set_pattern = get_pattern_as_id_array();

	for (var index_in_pattern = 0; index_in_pattern < PATTERN_CARDS_COUNT; index_in_pattern++) {
		card_id = set_pattern[index_in_pattern];
		card = this.deck.returnCardById(card_id);

		console.log(index_in_pattern);
		// first row of patterns.
		row_index = (Math.floor(index_in_pattern / PATTERN_CARDS_PER_ROW)) * PATTERN_CARDS_PER_ROW * PATTERN_COLS;
		col_index = index_in_pattern % PATTERN_CARDS_PER_ROW;

		// add all cards to field (all cards all patterns)
		for (var pattern_row_index = 0; pattern_row_index < PATTERN_ROWS; pattern_row_index++) {
			for (var pattern_col_index = 0; pattern_col_index < PATTERN_COLS; pattern_col_index++) {
				addCardToField(card, row_index + col_index + TOTAL_CARDS_PER_PATTERN_ROW * pattern_row_index + pattern_col_index * PATTERN_CARDS_PER_ROW, true);
			}
		}
		
		// hardcoded example for 9x9 pattern, in a 3x3 patterns grid
		// addCardToField(card, row_index + col_index , true);
		// addCardToField(card, row_index + col_index + 9, true);
		// addCardToField(card, row_index + col_index + 18, true);
		// // second row of patterns
		// addCardToField(card, row_index + col_index + 243, true);
		// addCardToField(card, row_index + col_index + 243 + 9, true);
		// addCardToField(card, row_index + col_index + 243 + 18, true);
		// // third row of patterns
		// addCardToField(card, row_index + col_index + 243*2, true);
		// addCardToField(card, row_index + col_index + 243*2 + 9, true);
		// addCardToField(card, row_index + col_index + 243*2 + 18, true);
	}
}

function addCardToField(card, index, visible) {
	showCardDom(card, "position_option_" + index, visible);
}



function setupSetPatternField(cardsToChooseFrom, cardsPerRow) {

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
	for (var i = 0; i < cardsToChooseFrom; i++) {
		// console.log("added: " + i);
		if (i % cardsPerRow == 0) {
			div = addDiv(bottomField, "bottomRow_" + i / cardsPerRow, "bottomRow");
		}
		addPossibleCardSolutionLocationToDom(div, i);
	}
}
