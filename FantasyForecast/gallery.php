<!DOCTYPE html>
<html>
	<head>
		<title>Custom Forecast</title>
		 <link rel='stylesheet' type='text/css' href='fantasyForecastGallery.css'/>
		<!-- <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script> -->
		
	</head>
	<body>
		<div id="gallery">
		<?php
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
				//echo "gallery/" .$name. ".png" ;
				if (file_exists("gallery/" .$name. ".png"  )) {
				
					echo "<img class='forecastPicture' src='gallery/".$name. ".png'> <br>";
				}
			} while (file_exists("gallery/" .$name. ".png"  ));
			//$i -=1;
			
			echo "<a 
			href= 'index.html' > To the forecast home page </a>";
		?>
		
		</div>
	</body>
</html>