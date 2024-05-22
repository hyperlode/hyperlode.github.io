<?php
session_start();//<!-- commentics -->
?>

<!DOCTYPE html>
<html lang="en">
  <head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/> <!-- commentics --> 
  
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">
	
    <title>Multi-Timer</title>

    <!-- Bootstrap core CSS -->
    <link href="/bootstrap-3.3.2-dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="/bootstrap-3.3.2-dist/css/bootstrap-theme.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="theme.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <script src="../../assets/js/ie-emulation-modes-warning.js"></script>

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body role="document">

    <!-- Fixed navbar -->
    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <!-- <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"> -->
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">The Multi-Timer</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="http://multitimer.ameije.com">Home</a></li>
            <li ><a href="manual.html">Manual</a></li>
            <li ><a href="contact.html">Contact</a></li>
           
           <!--  <li ><a href="manual.php">Test</a></li> -->
           
           
          </ul>
		  
		<ul class="nav navbar-nav navbar-right">
		 <li ><a href="extra/main/index.html">extra</a></li>
        <li><a  href="http://ameije.com/cpanel" >admin</a></li>
        <!-- <li class="dropdown"> -->
          <!-- <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Login <span class="caret"></span></a> -->
          <!-- <ul class="dropdown-menu" role="menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><a href="#">Something else here</a></li>
            <li class="divider"></li>
            <li><a href="#">Separated link</a></li>
          </ul> -->
        <!-- </li> -->
      </ul>
		  
		  
        </div><!--/.nav-collapse -->
		
		
		
      </div>
    </nav>

	
	
    <div class="container theme-showcase" role="main">

      <!-- Main jumbotron for a primary marketing message or call to action -->
      <div class="jumbotron">
        <h1>The Multi-Timer</h1>
        <p>The Multi-Timer works much like an advanced chess clock, without the two players limitation. It adds an extra level of excitement to games and prevents them from becoming boring. Really, it makes playing scrabble with your parents fun again!
		</p>
		
		 
		<h2>How it works</h2>
		<div class= "col-md-9">
		<p>
		When a player finishes his turn, he presses the next player button. When all players have played, a new round starts again with the first player, his count down timer restarts from where it was stopped the previous round. This is different from an hour glass, where the time for a turn is always the same.
		</p>
		</div>
		<div class= "col-md-3">
		 <img width = "200px" src="/images/Multitimer_ChessClock.png" alt="A picture says it all...">
		</div>
		<h2>See it in action!</h2>
		<p>
		Hurray!! We will be at the Vancouver Mini Maker Faire the 6th and 7th of June! There I will be showing of the possibilities of my Multi-Timer.
		Proudly somewhere in <a href="http://makerfaire.ca/2015-vmmf-makers/"> the middle of the website </a>!
		</p>
		
		
		
      </div>



   <!-- <img src="/images/image00.jpg"  -->
   <!-- class="img-rounded"> -->

   
   <div id="carousel-example-generic" class="carousel slide" data-ride="carousel">
  <!-- Indicators -->
  <ol class="carousel-indicators">
    <li data-target="#carousel-example-generic" data-slide-to="0" class="active"></li>
    <li data-target="#carousel-example-generic" data-slide-to="1"></li>
    <li data-target="#carousel-example-generic" data-slide-to="2"></li>
  </ol>

  <!-- Wrapper for slides -->
  <div class="carousel-inner" role="listbox">
    <div class="item active">
      <img src="/images/image00.jpg" alt="The Multi-Timer in Technicolor">
     
      <div class="carousel-caption">
        3d printed enclosure
      </div>
	  
	  </div>
	  <!-- <div class="item"> -->
     <!-- <img src="/images/multitimer_wood_demo.jpg" alt="The Multi-Timer lasercut layered enclosure"> -->
      <!-- <div class="carousel-caption"> -->
        <!-- prototype -->
      <!-- </div> -->
    <!-- </div> -->
	<div class="item">
		<img src="/images/IMG_7374.jpg" alt="Prototype 2 at work">
		<div class="carousel-caption">
			prototype 2 at work
		</div>
    </div>
	
	<div class="item">
		<img src="/images/enclosurePrinting_IMG_8241.jpg" alt="3D printing enclosures">
		<div class="carousel-caption">
			making some enclosures
		</div>
    </div>
	  
   
   
  </div>

  <!-- Controls -->
  <a class="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
    <span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
    <span class="sr-only">Previous</span>
  </a>
  <a class="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
    <span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
    <span class="sr-only">Next</span>
  </a>
</div>
   
   
   
   	<!-- commentics -->
	
<?php
$cmtx_identifier = '1';
$cmtx_reference = 'Page One';
$cmtx_path = 'administration/commentics/';
require $cmtx_path . 'includes/commentics.php'; //don't edit this line



?>
   
    </div> <!-- /container -->

	

	
	

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>
    <script src="bootstrap-3.3.2-dist/js/bootstrap.min.js"></script>
    <script src="bootstrap-3.3.2-dist/js/docs.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="bootstrap-3.3.2-dist/assets/js/ie10-viewport-bug-workaround.js"></script>
  </body>
</html>
