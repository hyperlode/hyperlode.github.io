
<?php

//save.php code
 
//Show the image
echo '<img src="'.$_POST['foreCastPictureInput'].'" />';
 
//Get the base-64 string from data
$filteredData=substr($_POST['foreCastPictureInput'], strpos($_POST['foreCastPictureInput'], ",")+1);
 
//Decode the string
$unencodedData=base64_decode($filteredData);
 
 
$i = -1;
do {
	$i +=1;
	$name = (string)$i;
	
	if (strlen ($name)== 2 ){
		$name = "0".$name;
	}
	if (strlen ($name)== 1 ){
		$name = "00".$name;
	}

} while (file_exists("gallery/" .$name. ".png"  ));

$savePath= "gallery/" .$name. ".png";

move_uploaded_file($_FILES["file"]["tmp_name"],$savePath);

 
//Save the image

file_put_contents($savePath, $unencodedData);

//http://www.php.net//manual/en/function.imagecreatefrompng.php
$image = @imagecreatefrompng('gallery/'.$name.'.png');

 // http://www.php.net//manual/en/function.imagecropauto.php
//resource imagecropauto ( resource $image [, int $mode = -1 [, float $threshold = .5 [, int $color = -1 ]]] )
	
imagepng($image, $savePath, 9);

echo "Stored in: " . "gallery/" .$name. ".png <br>";
echo "<a href= 'index.html' > To the forecast home page </a><br>";
echo "<a href= 'gallery.php' > To the gallery </a>";
?>