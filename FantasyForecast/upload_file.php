<?php
$allowedExts = array("gif", "jpeg", "jpg", "png");
$temp = explode(".", $_FILES["file"]["name"]);
$extension = end($temp);

if ((($_FILES["file"]["type"] == "image/gif")
|| ($_FILES["file"]["type"] == "image/jpeg")
|| ($_FILES["file"]["type"] == "image/jpg")
|| ($_FILES["file"]["type"] == "image/pjpeg")
|| ($_FILES["file"]["type"] == "image/x-png")
|| ($_FILES["file"]["type"] == "image/png"))
&& ($_FILES["file"]["size"] < 40000)
&& in_array($extension, $allowedExts)) {
  if ($_FILES["file"]["error"] > 0) {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
  } else {
    echo "Upload: " . $_FILES["file"]["name"] . "<br>";
    echo "Type: " . $_FILES["file"]["type"] . "<br>";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " kB<br>";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br>";
	
	$i = -1;
	do {
		$i +=1;
		$name = (string)$i;
		if (strlen ($name)== 1 ){
			$name = "0".$name;
		}
	} while (file_exists("images/" .$name. ".". $extension  ));
	
	move_uploaded_file($_FILES["file"]["tmp_name"],"images/" .$name. ".". $extension);
    echo "Stored in: " . "images/" .$name. ".".$extension;
	
	
    // if (file_exists("images/" . $_FILES["file"]["name"])) {
      // echo $_FILES["file"]["name"] . " already exists. ";
    // } else {
      // move_uploaded_file($_FILES["file"]["tmp_name"],
      // "images/" . $_FILES["file"]["name"]);
      // echo "Stored in: " . "images/" . $_FILES["file"]["name"];
    // }
	
	
	
  }
} else {
  echo "Invalid file";
}
	echo "<a href= 'index.html' > To the forecast home page </a>";

?>
