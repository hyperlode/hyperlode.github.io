<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
 <?php echo '<p>Hello World</p>'; ?> 
 
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
	$sql = "INSERT INTO `test`(`gameId`, `owner`, `date`) VALUES (10,'brecht','".date("Y-m-d H:i:s")."')";  //works!
	
	echo sql ; 
if ($conn->query($sql) === TRUE) {	
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}
	
	

?>
 
 </body>
</html>