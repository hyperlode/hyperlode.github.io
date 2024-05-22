

// function Cell (bool wallNorth, bool wallEast, bool wallSouth, bool wallWest, bool pawnPlayerA, bool pawnPlayerB){
function Cell (row, col, openToNorth, openToEast, openToSouth, openToWest){
	this.row = row;
	this.col = col;
	this.id = 9*row + col; //i.e. id 10  = cell 
	this.position = [row,col];
	this.openSides = [openToNorth, openToEast, openToSouth, openToWest]; //will change during the game
	this.sideHasExistingNeighbourCell = [openToNorth, openToEast, openToSouth, openToWest]; //never change this
	this.occupiedByPawn = 0;
	
	//console.log(this.row);
	
}


Cell.prototype.getId = function(){
	return this.id;
}
Cell.prototype.getRowColFromId = function(){
	return [parseInt(this.id/9), this.id%9];
}

Cell.prototype.getIsOccupied = function(){
	return this.occupiedByPawn ;
};
Cell.prototype.printToConsole = function(){
	console.log('----- row: %d -- col: %d -------',this.row, this.col);
	console.log(this.occupiedByPawn);
	console.log (this.openSides);
	
	
}
Cell.prototype.isSideOpen = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	
	return this.openSides[direction];
}

Cell.prototype.isThereAnExistingNeighbourOnThisSide = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	////4NE, 5SE, 6, SW, 7 NW
	
	var directionsToCheckForDiagonals_lookUpTable = [ [0,1],[1,2],[2,3],[3,0]];
	
	if (direction<4){
	
		return this.sideHasExistingNeighbourCell[direction];
	}else if (direction <8){
		//both diag neighbours have to exist to return true.
		return this.sideHasExistingNeighbourCell[directionsToCheckForDiagonals_lookUpTable [direction-4][0] ] &&
			   this.sideHasExistingNeighbourCell[directionsToCheckForDiagonals_lookUpTable [direction-4][1] ];
	}else if (direction < 12){
			return this.isThereAnExistingNeighbourOnThisSide(direction - 8);
	}else{
		//if (PRINT_ASSERT_ERRORS){
		console.log("ASSERT ERROR DIRECITON NOT EXISTING");
		//}
		return 666;
	}
}
Cell.prototype.closeSide = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	this.openSides[direction] = false;
}
Cell.prototype.openSide = function(direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	this.openSides[direction] = true;
}
Cell.prototype.acquirePawn= function(player){
	if(this.occupiedByPawn >0){
		//if (PRINT_ASSERT_ERRORS){
			console.log("ASSERT ERROR: cell already contains pawn");
		//}
		return false;
	}else{
		this.occupiedByPawn = player+1;
		return true;
	}
}
Cell.prototype.releasePawn =function(player){
	if(this.occupiedByPawn <1){
		//if (PRINT_ASSERT_ERRORS){
			console.log("ASSERT ERROR: cell does not contain pawn");
		//}
		return false;
	}else{
		this.occupiedByPawn = 0;
		return true;
	}
}

Cell.prototype.getNeighbourId= function (direction){
	//direction: 0 is North, 1 E, 2S, 3 West
	//4NE, 5SE, 6, SW, 7 NW , 8NN, 9 EE, 10 SS, 11, WW
	if (!this.isThereAnExistingNeighbourOnThisSide(direction)){
		if(PRINT_ASSERT_ERRORS){
			console.log("ASSERT ERROR neighbour not existing");
		}
		return -666;
	}
	//assert neighbour is existing. 
	switch (direction){
		case NORTH:
			//north
			return this.id -9;
			break;	
		case EAST:
			//east
			return this.id+1;
			break;
		case SOUTH: //s
			return this.id+9;
			break;
		case WEST://w
			return this.id-1;
			break;
		case NORTHEAST: //ne
			return this.id-8;
			break;
		case SOUTHEAST: //se
			return this.id+10;
			break;
		case SOUTHWEST: //sw
			return this.id+8;
			break;
		case NORTHWEST: //nw
			return this.id-10;
			break;
		case NORTHNORTH:
			return this.id - 18;
			break;
		case EASTEAST:
			return this.id +2;
			break;
		case SOUTHSOUTH:
			return this.id +18;
			break;
		case WESTWEST:
			return this.id -2;
			break;
			
		
	}
}