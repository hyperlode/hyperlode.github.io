<?php


// class multiPlayerQuoridor{
//     $GLOBALS["mysql_hostname"] = "50.62.176.142";
//     $GLOBALS["mysql_username"] = "superlode";
//     $GLOBALS["mysql_password"] = "sl8afval";
//     $GLOBALS["mysql_database"] = "ameijeData";
    
    
    
//     public function __construct()
//     {
//         $sessionId = session_id();
//         if( strlen($sessionId) == 0)
//             throw new Exception("No session has been started.\n<br />Please add `session_start();` initially in your file before any output.");
    
//         $this->mysqli = new mysqli($GLOBALS["mysql_hostname"], $GLOBALS["mysql_username"], $GLOBALS["mysql_password"], $GLOBALS["mysql_database"]);
//         if( $this->mysqli->connect_error )
//             throw new Exception("MySQL connection could not be established: ".$this->mysqli->connect_error);
    
//         // $this->_validateUser();
//         // $this->_populateUserdata();
//         // $this->_updateActivity();

//     }
    
    
// }

?>


<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php echo '<p>MultiPlayerTest</p>'; ?> 
 
 <?php
	// $servername = "lode.ameije.com";
	$servername = "50.62.176.142"; //found in "remote Mysql" page of godaddy dashboard.
	$username = "superlode";
	$password = "sl8afval";
	$databasename = "quoridor";
	
	// Create connection
	$conn = new mysqli($servername, $username, $password,$databasename);

	// Check connection
	if ($conn->connect_error) {
		die("Connection failed: " . $conn->connect_error);
	} 
	
	echo "Connected successfully <br>";

	//select database
	//$db = mysql_select_db(databasename, $con);
	
//add record each time page is called	
	//$sql = "INSERT INTO `test`(`gameId`, `owner`, `date`) VALUES (10,'bbjbe','1984-07-16 12:23:23')";  //works!
	$sql = "INSERT INTO `activeGames`(`gameId`, `playerId1`, `playerId2`,`gameState`,`gameStarted`,`gameLastActivityPlayer1`,`gameLastActivityPlayer1`) VALUES (10,1,2,'n,s',".date("Y-m-d H:i:s").",".date("Y-m-d H:i:s").",".date("Y-m-d H:i:s")."')";  //works!
	
	echo sql ; 
if ($conn->query($sql) === TRUE) {	
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
	
	

?>
 
 </body>
</html>