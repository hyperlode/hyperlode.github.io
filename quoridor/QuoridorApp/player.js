var NUMBER_OF_PLAYERS = 2;

function Players(players, startingPlayer){
	//for two players.
	if (players.length !=NUMBER_OF_PLAYERS){
		console.log("ASSERT ERROR: number of players MUST be two");
		return false;
	}
	
	this.players = players;	
	this.startingPlayer = startingPlayer;
	
	this.setup();
}

Players.prototype.setup = function (){
	console.log("starting player: " + this.startingPlayer.name );
	
	//set begin situation.
	this.startingPlayer.isPlaying = true;
	this.getOtherPlayer(this.startingPlayer).isPlaying = false;
	
}

Players.prototype.getOtherPlayer = function(player){
	var i = 0;
	
	while (this.players[i].id ==player.id){
		i++;
		if (i>NUMBER_OF_PLAYERS-1){
			console.log("ASSERT ERROR: no other player.");
		}
	}
	
	return this.players[i];
}


Players.prototype.getActivePlayer = function(){
	//check if there is only one active player
	var numberOfPlayingPlayers = 0;
	var playingPlayer;
	for (var i = 0; i< NUMBER_OF_PLAYERS;i++){
		if (this.players[i].isPlaying){
			playingPlayer = this.players[i];
			numberOfPlayingPlayers ++;
		}
	}
	
	if (numberOfPlayingPlayers > 1){
		console.log("ASSERT ERROR: Only one player can play at a time. (turnbased)");
		
	}else if (numberOfPlayingPlayers < 1){
		return false;
	}else{
		return playingPlayer;
	}	
}

Players.prototype.getNonActivePlayer = function(){
	//check if there is only one active player
	var numberOfInactivePlayers = 0;
	var nonPlayingPlayer;
	for (var i = 0; i< NUMBER_OF_PLAYERS;i++){
		if (!this.players[i].isPlaying){
			nonPlayingPlayer = this.players[i];
			numberOfInactivePlayers ++;
		}
	}
	
	if (numberOfInactivePlayers > 1){
		console.log("ASSERT ERROR: Only one player can be inactive at a time. (turnbased)");
		
	}else if (numberOfInactivePlayers < 1){
		return false;
	}else{
		return nonPlayingPlayer;
	}	
}

Players.prototype.setActivePlayer = function(player){
	if (this.getActivePlayer().id  = player.id){
		//do nothing
	}else{
		this.toggleActivePlayer();
	}
		
		
}

Players.prototype.toggleActivePlayer = function(){

	if (this.players[0].isPlaying && !this.players[1].isPlaying){
		this.players[0].isPlaying = false;
		this.players[1].isPlaying = true;
	}else if (this.players[1].isPlaying && !this.players[0].isPlaying){
		this.players[0].isPlaying = true;
		this.players[1].isPlaying = false;
	}else{
		console.log("ASSERT ERROR: playing and non playing players not correct.");
	}
}




function Player(){
	
	this.name = "Anonymous";
	this.id = undefined; //offical id, given as a constant PLAYER1 or PLAYER2
	this.isPlaying = false;
	this.movingDirection = undefined;
	
}

// Player.prototype.setName=function(name){
	// this.name = name;
// }


// Player.prototype.getName = function (){
	// return this.name;
// }