
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
	
