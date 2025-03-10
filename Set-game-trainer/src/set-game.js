
NO_ACTIVE_PLAYER = 666;
PICK_CARDS_FROM_SET_MILLIS = 7000;

class RealGame{

    start(){

        var MAX_CARDS_ON_FIELD = 16; // 16 is a bug right there!!!! there can be more than 16 cards needed for a set to occur
        addSetCardLocationsToDom(NUMBER_OF_CARDS_PER_SET,MAX_CARDS_ON_FIELD);
        
        //complete set
        this.deck = new Deck (NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY);
    
        // console.log(this.set);
        // console.log("lode");
        
        this.fieldCards = [];
        for(var i=0;i<MAX_CARDS_ON_FIELD;i++){  // 16 is a bug right there!!!! 
            this.fieldCards[i] = false;
        }
    
        this.deck.shuffle(); 

        // add next card button
        this.playerScores = [0];
        
        let setGameDiv = document.getElementById(GAME_ELEMENT_ID);
        setGameDiv.innerHTML = "";
        addButtonToExecuteGeneralFunction(setGameDiv, "Add extra player to the game", "addPlayerSawSetButton", "addPlayerSawSetButton", this.addPlayer.bind(this));
        addBr(setGameDiv);
        addCheckBox(setGameDiv,"checkboxNoCardAddingIfSetOnTable", "checkboxNoCardAddingIfSetOnTable", false, "Prevent card drawing if a SET is on the table");
        addBr(setGameDiv);
        this.addDeckButtonToDOM();
        addBr(setGameDiv);
        addBr(setGameDiv);
        let dummyCard = new Card("lode",NUMBER_OF_PROPERTIES,NUMBER_OF_VALUES_PER_PROPERTY,true,[0,0,0,0]);
        
        for (var i=0;i<MAX_CARDS_ON_FIELD;i++){
            this.addCardToField(dummyCard, i,false);
        }
        this.thereIsASetOnTheTable = false;
        this.userChosenCards = []
        // this.setPickCardButton();
        this.activePlayer = NO_ACTIVE_PLAYER;
        this.countDownMillis = 0;
    }
    
    addDeckButtonToDOM(){

        var setShowField = document.getElementById("topField");

        // https://jsfiddle.net/r7yrh7z5/1/
		
		var drawCardButton = document.createElement("button");
    	drawCardButton.id = "addCardButton";
		drawCardButton.name = "addCardButton";	
		drawCardButton.onclick = this.addDeckCardToField.bind(this);
        drawCardButton.style.display = "inline-block";
        drawCardButton.style.cursor = "pointer";
        drawCardButton.style.backgroundColor = "transparent";
        drawCardButton.style.backgroundRepeat = "no-repeat";
        drawCardButton.style.border = "3px solid white"; //"3px solid #E77019";
        drawCardButton.style.borderRadius = "0px";
        setShowField.appendChild(drawCardButton);
        
        let ElementToAddSvgTo = drawCardButton;
        
        var width = 100;
        var height = width * 1.45;
        
        var id = "yooomanne"
        //add card
        
        addSvg(ElementToAddSvgTo, id ,width + 100 , height, "white", "white");
        var card = document.getElementById(id);
        card.style.width = width + 20;
        card.style.height = width * 1.5;
        
        for (var i = 2;i<83;i++){
	    let cardNumber = i-1;
            // style.transform = `rotate(${a}deg)`;

            let outline = getCardOutline(width, height, `draw_card_${cardNumber}`, "cardOutline");
    		
            // outline.style.transform = `rotate(${10*i + 10}deg)`;
            let max_angle = 2;
            let a = 2 * max_angle * Math.random() - max_angle;
            // outline.style.transform = `translate(${2*i}px,0) rotate(${a}deg`;
            //outline.style.transform = `translate(${0*i}px,0) rotate(${a}deg`;
	    outline.style.transform = `translate(10px,0) rotate(${a}deg`;
            card.appendChild(outline);

            add_text(card, `Draw (${cardNumber}/81)`, "black", 12, 20,50,"sans-serif", `draw_card_text_${cardNumber}`);
        }
    }

    addPlayer(){
        // if only one player we dont bother about special buttons. if more than one player, each player gets a button they have to press when they see a set. 
        // after clicking the SET button, they then have to choose the correct cards.
        
        if (this.playerScores.length <= 1 ){
            // add two buttons if there was only one player.
            this.addPlayerSawSetButton(0);        
        }
        
        this.playerScores.push(0);
        this.addPlayerSawSetButton(this.playerScores.length-1);
        this.updatePlayerSetButton(0,0); // 
    }
    
    addPlayerSawSetButton(playerId){
        let setGameDiv = document.getElementById(GAME_ELEMENT_ID);
        
        let playerbutton = addButtonToExecuteGeneralFunction(setGameDiv, 
            "dummydummy", 
            "player_" + playerId + "_SET_trigger", 
            "player_" + playerId + "_SET_trigger", 
            this.playerTriggersSet.bind(this), playerId
            );
		playerbutton.style.height = "70px";
		playerbutton.style.width = "150px";
		playerbutton.style.whiteSpace = "normal";
		playerbutton.style.marginRight = "20px";
		playerbutton.style.marginLeft = "20px";
		playerbutton.style.marginBottom= "20px";
        this.updatePlayerSetButton(playerId,0);
    }

    playerTriggersSet(playerId){
        
        if (this.activePlayer != NO_ACTIVE_PLAYER){
            console.log(`Player ${this.activePlayer + 1} is already player. One one active player at a time allowed`);
            return;
        }

        this.activePlayer = playerId;
        this.countDownMillis = PICK_CARDS_FROM_SET_MILLIS;
        this.playerChooseSetAnimation();
    }

    playerChooseSetAnimation(){
        this.countDownMillis -= 1000;
        if (this.activePlayer == NO_ACTIVE_PLAYER ){
            // finished.
            console.log("finished")
            this.countDownMillis = 0;

        }else if (this.countDownMillis > 0){
            console.log(this.countDownMillis);
            this.updatePlayerSetButton(this.activePlayer, this.countDownMillis / 1000 );
            setTimeout(this.playerChooseSetAnimation.bind(this), 1000 ); 
        }else{
            // out of time
            this.wrongSetAttempt();
        }
    }

    updatePlayerSetButton(playerId, timeDotsDisplay){
        // updates the value of the text on the players' button
        // timeDotsDisplay amount of time left for a player to choose a set in the field.
        if (this.playerScores.length <=1){
            // no funcitonality yet for one player scores.
            return;
        }

        let displayPlayerId = playerId + 1;
        let timeLeftText = "";
        if (timeDotsDisplay != 0){
            timeLeftText = " (seconds left: " + timeDotsDisplay +"s)";
        }

        document.getElementById("player_" + playerId + "_SET_trigger").value = 
            "Player " + displayPlayerId + " SET trigger! (score=" + this.playerScores[playerId] + ") " + timeLeftText; 
    }

    playerIsActivated()
    {
        if (this.playerScores.length <= 1){
            return true;
        }

        if (this.activePlayer != NO_ACTIVE_PLAYER){
            return true;
        }
        return false;
    }

    addDeckCardToField(){
		let blockIfSetOnField = document.getElementById("checkboxNoCardAddingIfSetOnTable").checked;
        
        if (this.activePlayer != NO_ACTIVE_PLAYER){
            console.log(`Not allowed to draw cards while a SET was called. (caller = Player ${this.activePlayer + 1})`);
            return;
        }

        if (this.thereIsASetOnTheTable && blockIfSetOnField){
            console.log("set on the table. Find it before continuing!");
            return;
        }

        let i=0;
        while (this.fieldCards[i] !== false){
            i++;
            if (i>this.fieldCards.length-1 ){
                console.log("ASSERT ERROR, no room in the field");
                return;
            }
        }
		
        if (this.deck.getSize() == 0){
            console.log("no more cards left. Start a new game.");
            alert("Game finished! Start a new game to keep playing!");
            return;
        }
        
		let s = this.deck.getSize();
		document.getElementById(`draw_card_${s}`).remove();
		document.getElementById(`draw_card_text_${s}`).remove();
		
        let newCardIndex = i;
        this.fieldCards[newCardIndex] = this.deck.takeOffTopCard();
        let newCard = this.fieldCards[newCardIndex];
        this.addCardToField(newCard, newCardIndex, true);

        this.thereIsASetOnTheTable = this.checkForSetOnField();
    }

    checkForSetOnField(){

        var cards = this.getAllCardsOnTheField();

        for (var i=0;i<cards.length;i++){
            let card = cards[i];
            if (this.checkForSetWithCard(card, this.getAllCardsOnTheFieldMinusTheOneProvided(card) ))
            {
                return true;
            }
        }
        return false;
    }

    checkForSetWithCard(cardToBePartOfSet, otherCardsOnField){
        
        if (otherCardsOnField.length < NUMBER_OF_CARDS_PER_SET - 1){
            // never set if not enough cards
            console.log("not enough cards to check for set");
            return false;
        }
        
        // check for set
        // new card, check with all other cards on the table. 
        
        for (var secondCardIndex = 0; secondCardIndex < otherCardsOnField.length - 1 ; secondCardIndex++){
            let secondCard = otherCardsOnField[secondCardIndex];
            
            for (var thirdCardIndex = secondCardIndex+1; thirdCardIndex < otherCardsOnField.length; thirdCardIndex++){
                let thirdCard = otherCardsOnField[thirdCardIndex];
                if (areCardsASet([cardToBePartOfSet, secondCard, thirdCard], NUMBER_OF_PROPERTIES, NUMBER_OF_VALUES_PER_PROPERTY)){
                    console.log("SET found with cards at positions: " + this.getPositionOfCardOnField(cardToBePartOfSet) + " " + this.getPositionOfCardOnField(secondCard) + " " + this.getPositionOfCardOnField(thirdCard));
                    return true;
                }
            }
        }
        return false;
    }

    wrongSetAttempt(){
        console.log("wrong");
        
        this.decreasePlayerScore(this.activePlayer);
        this.updatePlayerSetButton(this.activePlayer,0);
        this.activePlayer = NO_ACTIVE_PLAYER;
        this.countDownMillis = 0;
        resetFromWrongSetAttempt();
    }
    
    correctSetAttempt(cardsToBeRemoved){
        for (var i=0;i<cardsToBeRemoved.length;i++) {
            let card = cardsToBeRemoved[i];
            let position = this.getPositionOfCardOnField(card);
            this.deleteCardFromField(position);
        }   
        this.thereIsASetOnTheTable = this.checkForSetOnField();

        console.log("correct");

        this.increasePlayerScore();
        this.updatePlayerSetButton(this.activePlayer, 0);
        this.activePlayer = NO_ACTIVE_PLAYER;
    }

    decreasePlayerScore(){
        let playerIdScore = this.activePlayer;
        if (this.playerScores.length == 1){
            playerIdScore = 0;
        }else if (this.activePlayer == NO_ACTIVE_PLAYER){
            console.log("ASSERT ERROR, no active player...");
        }

        if (this.playerScores[playerIdScore] > 0){
            this.playerScores[playerIdScore]--;
        }
    }

    increasePlayerScore(){

        let playerIdScore = this.activePlayer;
        if (this.playerScores.length == 1){
            playerIdScore = 0;

        }else if (this.activePlayer == NO_ACTIVE_PLAYER){
            console.log("ASSERT ERROR, no active player...");
        }

        this.playerScores[playerIdScore]++;
    }

    getAllCardsOnTheFieldMinusTheOneProvided(cardNotToBeIncluded){
        
        let filteredOnField = [];
        let excludeId = cardNotToBeIncluded.getId();
        let allOnField = this.getAllCardsOnTheField();
        for(var i=0;i<allOnField.length;i++){
            let card = allOnField[i];
            if (card.getId() !== excludeId){
                filteredOnField.push(card);
            }
        }
        return filteredOnField;
    }

    getAllCardsOnTheField(){
        let fieldCardsStacked = [];
        for (var i=0;i<this.fieldCards.length-1;i++){
            if (this.fieldCards[i] !== false){
                fieldCardsStacked.push(this.fieldCards[i]);
            }
        }
        return fieldCardsStacked;
    }

    getPositionOfCardOnField(card){
        for(var i=0;i<this.fieldCards.length;i++){
            let el = this.fieldCards[i];
            if (el != false){
                // console.log(typeof(el));
                let fieldCardId = el.getId();
                if (card.getId() == fieldCardId  ){
                    return i;
                }
            }
        }
        console.log("ASSERT ERROR, requested card not on field.");
    }

    getFieldCardByPosition(position){
        return this.fieldCards[position];
    }
    
    addCardToField(card, index, visible){
        showCardDom(card, "position_option_"+ index, visible);
    }

    deleteCardFromField(index){
        this.fieldCards[index] = false;
        setVisibiliyCardPositionDom("position_option_" + index, false);
    }
    
}