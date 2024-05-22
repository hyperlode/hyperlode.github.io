
function Board(){
	this.cells =[];
	this.walls_1 = []; //store walls;
	this.walls_2 = []; //store walls;
	
	this.init();
	this.boardGraph= {};
	this.boardGraphWithoutOpponent= {};
	this.boardGraph = this.boardCellsToGraph(true);
	this.shortestPathPerPlayer = [[]];
}

Board.prototype.isThereAWinner = function(){
	isPlayer1Winner = false;
	
	//check player 1 on winning cells?
	if (FINISH_CELLS_LOOKUP_TABLE[PLAYER1].indexOf(this.getPawnCellId(PLAYER1)) != -1){
		isPlayer1Winner = true;  //player1 won
		//console.log("tnpssem");
	}
	//check player2
	if (FINISH_CELLS_LOOKUP_TABLE[PLAYER2].indexOf(this.getPawnCellId(PLAYER2)) != -1 ){
		
		if (isPlayer1Winner){
			//return 2 winners error
			console.log("ASSERT ERROR: TWO WINNERS, BOTH PAWNS ON WINNING FIELD");
			return [false,666];
		}else{
			//return player 2 winner
			return [true,PLAYER2];
		}
	}else if (isPlayer1Winner){
		//return player 1 winner
		return [true,PLAYER1];
	}else{
		return [false,666];
	}
	//return no winners
	return [false,666];
}

Board.prototype.isCurrentBoardLegal = function (){
	//check if each player can reach a finish field.
	this.boardGraph = this.boardCellsToGraph(true);
	
	for(var player =0;player<2;player++){
		if (!this.getShortestPathToFinish(player)){
			console.log("checked board for player %d, invalid position",player);
			
			return false;
		}
	}
	return true;
}

Board.prototype.getShortestPathToFinish = function (player){
	//get cell with player.
	//var finishCellsLookupTable = [["0","1","2","3","4","5","6","7","8"],["72","73","74","75","76","77","78","79","80"]]; //valid finish cellIDs for player 1 and player 2
	//var finishCellsLookupTable = [[0,1,2,3,4,5,6,7,8],[72,73,74,75,76,77,78,79,80]]; //valid finish cellIDs for player 1 and player 2
	
	
	var shortestPath = this.getShortestPathToFinishRaw(player, this.boardGraph);
	
	if (shortestPath.length == 0){
		// in some odd situations, there is a shortest path to the other side, but the other players pawn is blocking the way.
		// as a matter of fact, the rules are unclear here, a nitpicky person might indeed complain that this is an "illegal" move, as there 
		// is temporarily no route for the pawn to the other side (as long as the opponent doesn't move), well, smartasses aside, we better 
		// check if there is a valid move if the opponent was not in the way (and how long the valid route is. 
		
		//temporarily remove opponent pawn
		var opponent = (player - 1) * -1;
		var opponentPlayerCell = this.getPawnCellId(opponent);
		var celltest = this.cells[this.pawnCellsIds[0]];
		var cell = this.cells[this.pawnCellsIds[opponent]];
				   //this.cells[this.pawnCellsIds[player]];

		cell.releasePawn(opponent); //release pawn
		
		this.boardGraphWithoutOpponent = this.boardCellsToGraph(true); //create a new graph without the opponent
		
		//check shortest route
		var shortestPathWithoutOpponent = this.getShortestPathToFinishRaw(player, this.boardGraphWithoutOpponent);	
		
		//place opponent pawn back. 
		cell.acquirePawn(opponent);//acquire pawn
		
		//check if a shortest path is found now.
		if (shortestPathWithoutOpponent.length == 0){
			console.log("real issue here!");
			return false;
		}else{
			console.log ("exceptional situation where opponent is actually blocking the route if it doesnt move!")
			return true;
		}
	}
	var shortestPathToInt=[];
	for (var i=0;i<shortestPath.length;i++){
		shortestPathToInt.push(parseInt(shortestPath[i]));
	}
	shortestPath = shortestPathToInt;
	this.shortestPathPerPlayer[player] = shortestPath;
	// console.log("shortestPath per pl:");
	// console.log(this.shortestPathPerPlayer);
	return shortestPath;
	
	/**/
	
	
	
	//console.log(searchGraph.findPaths(playerCell));
}

Board.prototype.getShortestPathToFinishRaw = function(player, boardGraph){
	
	
	var playerCell = this.getPawnCellId(player);
	// console.log(player);
	
	
	var searchGraph = new Graph(boardGraph );
	var shortestPath = [];
	
	var pathToFinish = [];
	
	for (var finishCell=0;finishCell<9;finishCell++){
		
		pathToFinish = searchGraph.findShortestPath(""+playerCell, ""+FINISH_CELLS_LOOKUP_TABLE[player][finishCell]);
		//check if player is on finish cell of other party FINISH_CELLS_LOOKUP_TABLE
		if (pathToFinish != null){
			if (pathToFinish.length < shortestPath.length || shortestPath.length == 0){ //if shorter or no shortest path yet existing, save as shortest path
				shortestPath = pathToFinish ;
				
				// console.log(shortestPath);
			}
		}
	}	
	return shortestPath
}

Board.prototype.boardCellsToGraph = function (weighted){
	
	//create graph with cellIds as vertexes and edges are accessible nieghbours.
	var graph = {};
	var extendedDirectionsLookUpTable= [[NORTHNORTH,NORTHEAST,NORTHWEST],[EASTEAST,NORTHEAST,SOUTHEAST],[SOUTHSOUTH,SOUTHEAST,SOUTHWEST],[WESTWEST,NORTHWEST,SOUTHWEST]]; 
	for (var cellId=0; cellId<this.cells.length;cellId++){
	//for (var cellId=0; cellId<3;cellId++){
		//check neighbours of the cell. not necessaraly physical neighbours, as pawns can jump.
		var neighbours= [];
		
		for (var direction = 0; direction <4;direction++){
			//check neighbours
			var neighbourId = this.cells[cellId].getNeighbourId(direction);
			//console.log("directiontest: %d ... %d", direction,neighbourId);
			
			//console.log(neighbourId);
			if (neighbourId>=0){
				
				var containsPawnIfSoWhichPlayer = this.cells[neighbourId].getIsOccupied();
				
				//console.log("pawn: %d ... ", containsPawnIfSoWhichPlayer);
				if (containsPawnIfSoWhichPlayer){
					//console.log("cellId of whom pawn is neighbour:",cellId, "direction:",direction, "player:",containsPawnIfSoWhichPlayer);
						//console.log("neighbourId");
						//console.log(neighbourId);
						//console.log(direction);
						
					//if neighbours contains the opposing pawn, "neighbouring cells" become jump cells
					//cell contains pawns, check all jump directions. i.e. n contains pawn--> ne, nn, nw.
					
					//first check straight jump
					if (this.movePawnStraightJump(cellId, extendedDirectionsLookUpTable[direction][0], true,true)){
						neighbours.push(this.cells[cellId].getNeighbourId(extendedDirectionsLookUpTable[direction][0]));
						
					}else {
						//check diagonal jump (both sides)
						for (var n=1;n<3;n++){
							// console.log("cellId:", cellId, "n: ", n);
							
							//console.log (this.movePawnDiagonalJump(cellId,extendedDirectionsLookUpTable[direction][n],true,true));
							if (this.movePawnDiagonalJump(cellId,extendedDirectionsLookUpTable[direction][n],true,true)){
								neighbours.push(this.cells[cellId].getNeighbourId(extendedDirectionsLookUpTable[direction][n]));
								// console.log("diagonal jump. cell: ", cellId, "direction: ",extendedDirectionsLookUpTable[direction][n], "targetCell:" ,this.cells[cellId].getNeighbourId(extendedDirectionsLookUpTable[direction][n]) );
							}
						}	
					}
					
				}else{
					//player
					//console.log("direction:%d" ,direction);
					if (this.movePawnSingleCell(cellId, direction,true,true)){
						neighbours.push(this.cells[cellId].getNeighbourId(direction));
						
					};
					
				}
			}
				
			
			
		}
		//console.log(cellId);
		//console.log(neighbours);
		if (neighbours.length > 0){
			graph[cellId] = neighbours;
		}
	}
	
	if (weighted){
		var weightedGraph = {}
		for (var i = 0; i< Object.keys(graph).length; i++){
			
			var subgraph = {};
			if (i in graph){ //check if key exists.
				for(var j =0; j<graph[i].length; j++){
					subgraph[""+graph[i][j]]=1;
					
				}
				weightedGraph[""+i]=subgraph;
			}
			// console.log(subgraph);
		}
		//console.log("weightedGraph");
		//console.log(weightedGraph);
		return weightedGraph;
	}else{
	
		return graph;
	}
	//return graph;
}


Board.prototype.wallNotationToCellAndOrientation = function (verboseCoordinate){
	//returns startcellId and isNorthSouthOriented orientation as [id, orientation]
	//verboseCoordinate = string of two characters, one letters, one number. number from [1,8], letter [a,h]  i.e. b2 or 5C
	//verboseCoordinate :  i.e.   starting with a letter = vertical, starting with a number is horizontal. , letters and numbers indicate the wall lines on the board (between the cells), the crossing of the wall lines indicates the center point of the wall.
	//end result = four cells with each a direction.
	
	//get vertical wall line
	if (verboseCoordinate.length != 2){
		if (PRINT_ASSERT_ERRORS){
			console.log("ASSERT ERROR  not a wall move, notation should be two characters");
		}
		return false;
	}
	//var wallLines = verboseCoordinate.split('');
	var charVals = [verboseCoordinate.charCodeAt(0), verboseCoordinate.charCodeAt(1)];
	var isLetter =[];
	var values  = [];
	//convert chars to wall lines 
	//https://webserver2.tecgraf.puc-rio.br/cd/img/vectorfont_default.png
	for(var i=0;i<2;i++){
		if (charVals[i]>= 49 && charVals[i]<=56){
			//number
			isLetter[i] =false;
			values.push(charVals[i]-48);
		}else if (charVals[i]>= 65 && charVals[i]<=72){
			//capital
			isLetter[i] =true;
			values.push(charVals[i]-64);
		}else if (charVals[i]>= 97 && charVals[i]<=104){
			//small letter
			isLetter[i] =true;
			values.push(charVals[i]-96);
		}else{
			//assert error
			if (PRINT_ASSERT_ERRORS){
				console.log("ASSERT ERROR not a wall move, invalid character in notation to place a wall.");
			}
			return false;
		}
	}
	var isNorthSouthOriented = false;
	//check validity
	if (isLetter[0] == isLetter[1]){
		//check if both are number or letter
		if (PRINT_ASSERT_ERRORS){
			console.log("ASSERT ERROR: should be a letternumber or numberletter")
		}
		return false;
	}else if (isLetter[0]){
		isNorthSouthOriented = true;
		startCellCol = (values[0]-1);
		startCellRow = (8-values[1]);
	}else{
		isNorthSouthOriented = false;
		startCellRow = (8-values[0]);
		startCellCol = (values[1]-1);
	}
	
	return [this.rowColToCellId(startCellRow,startCellCol) , isNorthSouthOriented];
	//get startcell row and col
}







Board.prototype.getWallCenterPointWithOrientationFromStartCellIdAndOrientation = function(startCellId, orientation){
	//wall = [ horizontalLine, verticalLine, isOrientationNorthSouth]
	//console.log(startCellId);
	var rowCol = this.cells[startCellId].getRowColFromId();
	return [rowCol[0]+1 , rowCol[1]+1, orientation];
}
Board.prototype.getStartCellIdAndOrientationFromWallCenterPointWithOrientation = function(row, col, orientation){
	//wall = [ horizontalLine, verticalLine, isOrientationNorthSouth]
	//console.log(startCellId);
	var startCellId = (row-1)*9 + (col-1);
	return [startCellId, orientation];
}
Board.prototype.getWalls = function (){
	return [this.walls_1 , this.walls_2];
}

Board.prototype.getWallsCombined = function (){
	//all walls together
	return this.walls_1.concat(this.walls_2);
}


Board.prototype.isCenterPointAvailableForWallPlacement = function(startCellId, orientation){
	//check if centerpoint is already occupied.
	var wallCenterPointAndOrientation = this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, orientation);
	//console.log(wallCenterPointAndOrientation);
	var walls = this.getWallsCombined();
	var positionIsAvailable = true
	//console.log(walls);
	for (var i=0;i<walls.length;i++){	
		
		if (walls[i][0] == wallCenterPointAndOrientation[0] && walls[i][1] == wallCenterPointAndOrientation[1]){
			positionIsAvailable=false;
			return positionIsAvailable;
		}
	}
	return positionIsAvailable;
}

Board.prototype.isPositionAvailableForWallPlacement = function(startCellId, isNorthSouthOriented){
	
	return this.placeWall(PLAYER1,startCellId, isNorthSouthOriented, true);
}

Board.prototype.isWallPositionAvailableByVerboseCoordinate= function (player,verboseCoordinate){
	var wallCoords = this.wallNotationToCellAndOrientation(verboseCoordinate);
	if(!wallCoords){
		//notation unvalid
		return false;
	}
	return this.placeWall(player, wallCoords[0],wallCoords[1],true );
}

Board.prototype.placeWallByVerboseCoordinate= function (player,verboseCoordinate){
	var wallCoords = this.wallNotationToCellAndOrientation(verboseCoordinate);
	if(!wallCoords){
		//notation unvalid
		return false;
	}
	return this.placeWall(player, wallCoords[0],wallCoords[1],false );
}
Board.prototype.removeLastWall = function(player){

	if (this.getWalls()[player].length == 0){
		console.log("no walls to undo");
		return false;
	}
	
	var lastWall = this.getWalls()[player].pop();//remove last wall fromlist.
	// console.log(lastWall);
	var lastWallCoords = this.getStartCellIdAndOrientationFromWallCenterPointWithOrientation(lastWall[0],lastWall[1],lastWall[2]);
	
	var lastWallStartCellId = lastWallCoords[0];
	var lastWallOrientationIsNorthSouth = lastWallCoords[1];
	
	var startCell = this.cells[lastWallStartCellId];
	var neighEastId = startCell.getNeighbourId(EAST);
	var neighSouthId = startCell.getNeighbourId(SOUTH);
	var neighSouthEastId = startCell.getNeighbourId(SOUTHEAST);
	// console.log(lastWallCoords[0]);
	// console.log(neighEastId);
	// console.log(neighSouthId);
	// console.log(neighSouthEastId);
	var allInvolvedCellsIds = [lastWallStartCellId, neighEastId, neighSouthEastId, neighSouthId];
	//--> pattern for 4 cells: startcell, then east, then southeast, then south
	var sidesForNorthSouthOrientation = [EAST,WEST,WEST,EAST];
	var sidesForEastWestOrientation = [SOUTH,SOUTH,NORTH,NORTH];
	
	//decide which sides are affected.
	var sidesToChange = sidesForEastWestOrientation; ////assume east west oriented
	if (lastWallOrientationIsNorthSouth){
		sidesToChange = sidesForNorthSouthOrientation;//north south oriented
	}
	//console.log(lastWallCoords);
	//remove Wall from cells.
	for (var i=0;i<4;i++){
		this.cells[allInvolvedCellsIds[i]].openSide(sidesToChange[i]) ;
	}
}

Board.prototype.placeWall = function (player, startCellId, isNorthSouthOriented, onlyCheckAvailabilityDontPlaceWall){
	//wall covers always two cells, 
	//if east west oriented: at South of startcell, and eastern neighbour cell
	// if north east : at East o fstartcell, and southern neighbour cell
	
	var startCell = this.cells[startCellId];
	
	//check if within board limits:
	if (!(startCell.row >=0 && startCell.row<=7 && startCell.col >=0 && startCell.col<=7)){
		if (!onlyCheckAvailabilityDontPlaceWall){
			console.log("ASSER ERROR WRONG CELL as wall start identifier ");
			console.log("-------------------------");
			console.log(startCell);
		}	
		return false;
	}
	
	//first check if centerpoint is available
	if (!this.isCenterPointAvailableForWallPlacement(startCellId, isNorthSouthOriented)){
		if (!onlyCheckAvailabilityDontPlaceWall){
			console.log("centerpoint wall occupied. wall cannot be placed.");
		}
		
		return false;
	}	
	
	//check borders in cells.
	//assume neighbours existing.
	//for (var i=0; i<4;i++){
	
	var neighEastId = startCell.getNeighbourId(EAST);
	var neighSouthId = startCell.getNeighbourId(SOUTH);
	var neighSouthEastId = startCell.getNeighbourId(SOUTHEAST);
	
	
	var allInvolvedCellsIds = [startCellId, neighEastId, neighSouthEastId, neighSouthId];
	//--> pattern for 4 cells: startcell, then east, then southeast, then south
	var sidesForNorthSouthOrientation = [EAST,WEST,WEST,EAST];
	var sidesForEastWestOrientation = [SOUTH,SOUTH,NORTH,NORTH];
	
	//decide which sides are affected.
	var sidesToChange = sidesForEastWestOrientation;
	if (isNorthSouthOriented){
		sidesToChange = sidesForNorthSouthOrientation;
	}
	
	var isAllAffectedSideOpen = true;
	
	//console.log(allInvolvedCellsIds);
	//console.log(sidesToChange);
	//check if sides are already occupied.
	for (var i=0;i<4;i++){
		//console.log(this.cells[allInvolvedCellsIds[i]].isSideOpen(sidesToChange[i]));
		if( !this.cells[allInvolvedCellsIds[i]].isSideOpen(sidesToChange[i])){
			isAllAffectedSideOpen=false;
		}
	}
	if (!isAllAffectedSideOpen){
		//wall cannot be placed because another wall is blocking its path somewhere.
		if (!onlyCheckAvailabilityDontPlaceWall){
			console.log("position not valid for wall placement");
		} 
		return false;
	}
	
	
	//check completed, return results if only simulation.
	if (onlyCheckAvailabilityDontPlaceWall){
		return true;
	}
	
	//place wall
	for (var i=0;i<4;i++){
		this.cells[allInvolvedCellsIds[i]].closeSide(sidesToChange[i]) ;
	}
	
	
	//store wall as wall (cells is not enough, we have to know the exact wall, for the gaps...)
	if (player == PLAYER1){
		this.walls_1.push(this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, isNorthSouthOriented));
		
	}else{
		this.walls_2.push(this.getWallCenterPointWithOrientationFromStartCellIdAndOrientation(startCellId, isNorthSouthOriented));
		
	}
	return true;
	
}

Board.prototype.init = function (){
	var id=0;
	
	//cell numbering:
	//  0,0 ---> + col
	//  |
	//  |
	//  V +row
	
	//indication of sides and "wall" lines. Hx = horizontal, Vx= vertical, (x,x) =cell
	//    H0        H0
	//V0  (0,0)  V1  (0,1) V2  (0,2)  ....
	//    H1        H1 
	//V0  (1,0)  V1  (1,1) V2  (1,2)   ....
	//    H1        H1   ....
	//   ....      .... 
	for (var row=0; row<9;row++){
		for (var col=0; col<9;col++){
			
			this.cells.push(new Cell(row,col, row>0, col<8, row<8, col>0 ));
			//this.cells[this.cells.length - 1].printToConsole();
			//console.log(row);
		}
	}
	//define cells with pawns.
	this.pawnCellsIds = [this.rowColToCellId(8,4), this.rowColToCellId(0,4)];
	this.cells[this.pawnCellsIds[PLAYER1]].acquirePawn(PLAYER1);
	this.cells[this.pawnCellsIds[PLAYER2]].acquirePawn(PLAYER2);
	
	
};



Board.prototype.getAllNeighBourCellIds= function(cellId){
	var activeCell = this.cells[cellId];
	var neighbourIds = [];
	for (var i=0;i<12;i++){
		//for every direction that exists, we color the pawn circle in the correct cell.
		//get cell id of active direction
		//id of player cell = 
		neighbourIds.push(activeCell.getNeighbourId(i));
	}
	return neighbourIds;
}

Board.prototype.getPawnAllNeighBourCellIds= function(player){
	
	//for the 12 directions.
	var cellId = this.pawnCellsIds[player];
	return this.getAllNeighBourCellIds(cellId);
	
}

Board.prototype.getValidPawnMoveDirections = function(player){
	var validDirections = []
	for (var i =0;i<12;i++){
		validDirections.push(this.movePawn(player,i,true));
	}
	return validDirections;
}

Board.prototype.movePawn = function(player, direction,isSimulation){
	var isValidMove;
	if (direction< 4){
		isValidMove = this.movePawnSingleCell(player, direction,isSimulation,false);
		
	}else if (direction <8){
		isValidMove =  this.movePawnDiagonalJump(player, direction,isSimulation,false);
		
	}else if (direction <12){
		isValidMove = this.movePawnStraightJump(player, direction,isSimulation,false);
		 
	}else{
		if (!isSimulation){
			console.log("ASSERT ERROR: non valid pawn move direction");
		};
		isValidMove = false;
	}
	
	return isValidMove;
	
}

Board.prototype.movePawnStraightJump = function(player, twoStepsDirection, isSimulation, playerContainsStartCellIdInsteadOfPlayer){
	//player is the jumping player.
	//twostepsdirection nn,ee,ss,ww
	//isSimulation-> does not output console log.
	
	
	if (playerContainsStartCellIdInsteadOfPlayer){
		var cell = this.cells[player];
	}else{
		var cell = this.cells[this.pawnCellsIds[player]];
	}
	
	singleStepDirection = twoStepsDirection-8;
	//check if neighbour cell exists
	if (!cell.isThereAnExistingNeighbourOnThisSide(twoStepsDirection)){
		if (!isSimulation){
			console.log("ASSERT ERROR: no neighbour cell existing");
		}
		return false;
	}
	
	//get the two neighbour ids.
	var neighbourId = cell.getNeighbourId(singleStepDirection);
	var twoNeighbourdIds = cell.getNeighbourId(twoStepsDirection);
	// console.log(this.pawnCellsIds[player]);
	// console.log(neighbourId);
	// console.log(twoNeighbourdIds);
	
	//check if direction not blocked by wall
	if (!cell.isSideOpen(singleStepDirection) || !this.cells[neighbourId].isSideOpen(singleStepDirection)){
		if (!isSimulation){
			console.log("one or two walls in the way, can't jump in direction %d (N=0, E=1, S=2, W=3)", singleStepDirection);
		}
		return false;
	}
	
	//check if neighbour has pawn
	if (!this.cells[neighbourId].getIsOccupied()){
		if (!isSimulation){
			console.log("Can only jump if neighbour has a pawn");
		}
		return false
	}
	
	
	
	// console.log(this.pawnCellsIds[player]);
	// console.log(neighbourId);
	//console.log(twoNeighbourdIds);
	
	if (!isSimulation){
		//make the move
		cell.releasePawn(player); //release pawn for current cell
		
		this.pawnCellsIds[player] = twoNeighbourdIds; 
		
		this.cells[this.pawnCellsIds[player]].acquirePawn(player);//acquire pawn
	}
	
	return true;
	
}

// Board.prototype.checkDiagonal(cellId, firstDirection, secondDirection, debugPrint){
	
// }

Board.prototype.movePawnDiagonalJump = function(player, diagonalDirection, isSimulation,playerContainsStartCellIdInsteadOfPlayer){
	//check if neighbour cell exists
	
	if (playerContainsStartCellIdInsteadOfPlayer){
		var cell = this.cells[player];
	}else{
		var cell = this.cells[this.pawnCellsIds[player]];
	}

	if (!cell.isThereAnExistingNeighbourOnThisSide(diagonalDirection)){
		//this works, if both orthogonals existing, diagonal is existing too
		if(!isSimulation){
			console.log("ASSERT ERROR: no neighbour cell existing");
		}
		if (player == 31){
			console.log("llloodee 6 ");
		}
		return false;
	}
	
	
	
	// lookupTable = [[NORTH,EAST],[SOUTH,EAST],[SOUTH,WEST],[NORTH,WEST]] ; //ne, se,sw,nw
	lookupTable = [[NORTH,EAST],[SOUTH,EAST],[SOUTH,WEST],[NORTH,WEST]] ; //ne, se,sw,nw
	
	//FAULTY:neighbour id can be one of both, i.e. to go NE --> we can go first east then north, or first north than east.... --> the neighbour having the opponent pawn is the neighbour --> ERROR, not always true! If there is a wall between the non pawn containing neighbour and the diagonal end square, this fails!
	
	//first direction: should be the direction to the neighbour with the pawn
	//second direction: is the extra direction to complete the diagonal jump
	
	//there are two paths --> i.e. NE  N--> E  or E--> N  because of the way walls can be put, and because playerContainsStartCellIdInsteadOfPlayer, we have to check both paths to 
	
	/*
	|o X     if x is the cell that checks if there is a jump to SW, and o is a pawn, and | is a wall, we have to check S--> W  AND W-->S to be sure, because both neighbours contain a pawn.
	| |o
	
	 o X
	   o
	 ___
	*/
	
	
	var neighbourId = cell.getNeighbourId(lookupTable[diagonalDirection - 4][0]); //assume one direction for neighbour
	var firstDirection = lookupTable[diagonalDirection - 4][0];
	var secondDirection = lookupTable[diagonalDirection - 4][1];
	
	//console.log(neighbourId);
	//console.log(neighbourId);
	//console.log(this.cells[neighbourId].getIsOccupied());
	var numberOfPathsToCheck = 1;
	
	if (this.cells[neighbourId].getIsOccupied() && this.cells[ cell.getNeighbourId(lookupTable[diagonalDirection - 4][1])].getIsOccupied()){
		//check both paths. i.e. SE :  S--> W  AND W-->S
		numberOfPathsToCheck = 2;
		
		
	}
	var pathNumber  = 0;
	
	var overalValidDiagonalMove = false;
	while (pathNumber < numberOfPathsToCheck && !overalValidDiagonalMove ){ //&& validDiagonalMove == false
		var validDiagonalMove = true;
		pathNumber++;
		
		if (!this.cells[neighbourId].getIsOccupied() || ( pathNumber==2) ){   //	
			
			//console.log("other neighbour");
			neighbourId = cell.getNeighbourId(lookupTable[diagonalDirection - 4][1]); //... assume the other neighbour. the real check for the correct pawn follows later...
			firstDirection = lookupTable[diagonalDirection - 4][1];
			secondDirection = lookupTable[diagonalDirection - 4][0];
		}
		
		//check neighbour containing pawn
		if (!this.cells[neighbourId].getIsOccupied()){
			//console.log (this.cells[neighbourId].getIsOccupied() == player+1);
			if(!isSimulation){
				console.log ("no pawn detected at adjecent cell, no jump allowed.");
			}
			validDiagonalMove = false;
		}
		
		//check neighbour containing other pawn
		if (!playerContainsStartCellIdInsteadOfPlayer && this.cells[neighbourId].getIsOccupied() == player+1 ){
			
			//console.log (this.cells[neighbourId].getIsOccupied() == player+1);
			if(!isSimulation){
				console.log ("no opposite player pawn detected at adjecent cell, no jump allowed.");
			}
			validDiagonalMove = false;
		}
		
		//get the second  neighbour id
		var twoNeighbourdIds = this.cells[neighbourId].getNeighbourId(secondDirection);
	//	console.log("diagtest:");
	//	console.log(diagonalDirection);
	//	console.log(this.pawnCellsIds[player]);
	//	console.log(neighbourId);
	//	console.log(twoNeighbourdIds);
		
		
		//check wall blocking move from cell to neighbour
		if (!cell.isSideOpen(firstDirection)){
			if(!isSimulation){
				console.log ("no diagonal jump allowed, not possible to move to reach neighbour cell");
			}
			validDiagonalMove = false;
		}
		
		//check wall blocking straight jump from neighbour to second neighbour
		if (this.cells[neighbourId].isSideOpen(firstDirection)){
			if(!isSimulation){
				console.log ("no diagonal jump allowed, the forward side has to be blocked, otherwise it would be a straight jump");
			}
			validDiagonalMove = false;
		}
			
		//check wall blocking diag jump from neighbour to second neighbour
		if (!this.cells[neighbourId].isSideOpen(secondDirection)){
			if(!isSimulation){
				console.log ("no diagonal jump allowed, a side ways side is preventing the jump.");
			}	
			validDiagonalMove = false;
		}
		
		if (validDiagonalMove == true){
			overalValidDiagonalMove = true;
		}
		
	}	
	
	// if (validDiagonalMove==false){
		// return false;
	// }
	if(!overalValidDiagonalMove){
		return false;
	}
	
	if (!isSimulation){
		//do actual move.
		//make the move
		cell.releasePawn(player); //release pawn for current cell
		this.pawnCellsIds[player] = twoNeighbourdIds; 
		this.cells[this.pawnCellsIds[player]].acquirePawn(player);//acquire pawn
	}
	return true;
	
}

Board.prototype.movePawnSingleCell = function(player, direction, isSimulation,playerContainsStartCellIdInsteadOfPlayer){
	//check if neighbour cell exists
	
	
	
	//check for walls, sides and other pawn, notify event "win" 
	
	//side check
	//check if neighbour cell exists 
	if (playerContainsStartCellIdInsteadOfPlayer){
		var cell = this.cells[player];
	}else{
		var cell = this.cells[this.pawnCellsIds[player]];
	}
	if (!cell.isThereAnExistingNeighbourOnThisSide(direction)){
		if(!isSimulation){
			console.log("ASSERT ERROR: no neighbour cell existing");
		}
		return false;
	}
	
	//check if direction not blocked by wall
	if (!cell.isSideOpen(direction)){
		if(!isSimulation){
			console.log("wall in the way, can't move in direction %d (N=0, E=1, S=2, W=3)", direction);
		}
		
		return false;
	}
	
	//check if direction not blocked by other pawn
	var neighbour = cell.getNeighbourId(direction); //get neighbour id
	
	if (this.cells[neighbour].getIsOccupied()){
		if (!isSimulation){
			console.log("cant move, destination cell contains other pawn. Please perform a jump move.");
		}
		return false
	}
	
	if (!isSimulation){
		//make the move
		cell.releasePawn(player); //release pawn
		this.pawnCellsIds[player] = neighbour;
		cell = this.cells[this.pawnCellsIds[player]];
		cell.acquirePawn(player);//acquire pawn
	}
	return true;
	
}



Board.prototype.rowColToCellId = function(row,col){
	//cell id is cell index in this.cells
	return row*9+col;
}


Board.prototype.getPawnCellId = function(player){
	if (player == PLAYER1 || player == PLAYER2){
		return this.pawnCellsIds[player];
	}else{
		console.log("ASSERT ERROR NO VALID PLAYER");
		return -666;
	}
}

Board.prototype.getPawnCoordinates = function(player){
	//console.log("playercell: %d ", this.pawnCellsIds[player]);
	return  this.cells[this.pawnCellsIds[player]].getRowColFromId();
}
