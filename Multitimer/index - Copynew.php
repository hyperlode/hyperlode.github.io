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
	
    <title>MultiTimer</title>

    <!-- Bootstrap core CSS -->
    <link href="http://www.ameije.com/bootstrap-3.3.2-dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="http://www.ameije.com/bootstrap-3.3.2-dist/css/bootstrap-theme.min.css" rel="stylesheet">

    <!-- Custom styles for this template -->
    <link href="theme.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <script src="../../../assets/js/ie-emulation-modes-warning.js"></script>

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
          <a class="navbar-brand" href="#">The MultiTimer</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="http://multitimer.ameije.com">Home</a></li>
            <li ><a href="manual.html">Manual</a></li>
            <li ><a href="contact.html">Contact</a></li>
           
           <!--  <li ><a href="manual.php">Test</a></li> -->
           
           
          </ul>
		  
		<ul class="nav navbar-nav navbar-right">
		 <li ><a href="http://www.ameije.com">extra</a></li>
        <li><a  href="http://www.ameije.com/cpanel" >admin</a></li>
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
	 
        <h1>The MultiTimer</h1>
        <p>The MultiTimer works much like a chess clock, without the two players limitation. We found out the fun way why: It adds an extra level of excitement to games! Additionally, it allows players with different skill levels to have a fun game together by assigning a time handicap. Really, it even makes playing scrabble with your parents fun again!
		</p>
		
	</div>
	<div class="row">
	
		<div class= "col-md-12">
			<h2>Maker Faire 2017: The MultiTimer and Friends</h2>
		</div>
		<div class= "col-md-9">
			<p>
			Wow! It's the third time already we participate. How on earth can we make it interesting again? Luckily, as we are one year further, there is one year of extra story telling, adventures and...groundbreaking updates! <br> 
			Because we are aware that not all people are MultiTimer aficionados, the friends of the MultiTimer prepared something very un-MultiTimery! 
			</p>
		</div>
		<div class= "col-md-3">
			
			<img width ="100%" src="/images/lodeHappy.jpg" alt="working on the MultiTimer">
		</div>		
	
		<div class= "col-md-12">
			<h2>MultiTimer, the Next Generation: KEEP IT SIMPLE</h2>
		</div>
		<div class= "col-md-9">
			<p>
			Ah ah ah, yes, we all know the theory: keep it simple, keep it simple. Yet, again, as the functionality of the MultiTimer reached new stratospheric heights, fewer and fewer people were reading through the trilogy manual... Time for a radical change! <br> The biggest changes: 
			<ul>
			<li>Every player has his own button. This was the final and necessary step to have a timer that's really reliable, even if players forget to press their button in the heat of an exciting game!</li> 
			<li> Setting up the timer became extremely easy. Advanced mode is only reachable for experienced users.</li>
			</ul>
			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/v5MultiTimer_3clocks.jpg" alt="3 prototypes">
		</div>		
	
		<div class= "col-md-12" >
			<h2>We have an online MultiTimer app!</h2>
		</div>
		<div class= "col-md-9" class="container" >
			<p>
			Use a basic multitimer in your browser! In two easy steps you have set up your own multitimer. Use the spacebar to switch players. <a href="http://lode.ameije.com/MultitimerApp/multitimer_app.html">Try it now!</a>
			</p>
		</div>
		
		<div class= "col-md-3">
		 <a href="http://lode.ameije.com/MultitimerApp/multitimer_app.html"><img src="/images/appIcon.png" width ="100%" alt="Click to start"></a>
		</div>
		
		
		<div class= "col-md-12">
			<h2>2016 New MultiTimers</h2>
		</div>
		<div class= "col-md-9">
			<p>
			The MultiTimer as an Arduino Uno shield: Because many people have an Arduino Uno lying around that isn't in use anyways. Finally, put it to good use! <br><br>
			The MultiTimer with an extra I/O board: 4 buttons and 4 relays give plenty of options! Let lamps light up in sequence, see which player is playing, and give every player a dedicated button (like on a real chess clock).<br> I am very happy with the changes. They work great! Unfortunately it's very quiet in enclosure land...
			
			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/multi-timers_2016.jpg" alt="all timers together">
		</div>		
		
		
		<div class= "col-md-12">
			<h2>Maker faire 2016 Aftermath</h2>
		</div>
		<div class= "col-md-9">
			<p>
			Big fun! The tensegrity structure looked great and got a lot of attention. Glad we did it. It covered up for the "minimalistic" booth we had :). It got more attention than the MultiTimer itself, so, contact me if you want more information about it or about the MultiTimer!  
			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/IMG_1163_squareb.jpg" alt="tensegrity Fluorescent">
		</div>
		
		
		
		
		
		
		
		
		
		<div class= "col-md-12">
			<h2>Maker faire 2016</h2>
		</div>
		<div class= "col-md-9">
			<p>
			This year we're at the Maker Faire, at the PNE in Vancouver, again! <br>
			If you never went to the Maker Faire, you should definetly check it out on Saturday and Sunday (June 11th and 12th).<br>
			I was hesitating to join the Maker Faire because I don't have too many new things to show off. I realized I should though, because it gives me a bit of stress to create things. Now I have: The MultiTimer as an Arduino Shield, an optional I/O panel, and a renewed pcb. All this to procrastinate the work on what is the hardest: Making a nice enclosure that is easy to make a larger quantities. <br>
			This time I know the through meaning of a booth (I used to think it always meant a physical construction), so I will not build a little house. Instead, I made one of my favorite constructions of all time: A tensegrity structure. For the fun of it, I exchange the rods for TL-bulbs. <br>
			Also check out our fun browers apps in <a href="extra/main/index.html">extra</a></li>, make your own weather forecast, or practice your SET skills, or see my moving mazes in the lab. <br>
			Don't forget to contact me if you would like to have a MultiTimer! I have all the components ready and it is always fun knowing that people actually use it!

			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/tensegrity_transport.jpg" alt="tensegrity on roof of car">
		</div>
		
		<div class= "col-md-12">
			<h2>How the real MultiTimer works</h2>
		</div>
		<div class= "col-md-9">
			<p>
			When a player finishes his turn, he presses the next player button. When all players have played, a new round starts again with the first player, his count down timer restarts from where it was stopped the previous round. This is different from an hour glass, where the time for a turn is always the same.
			</p>
		</div>
		<div class= "col-md-3">
		 <img width ="100%" src="/images/Multitimer_ChessClock.png" alt="A picture says it all...">
		</div>
		
		
		
		
		<div class= "col-md-12">
			<h2>Maker faire review.</h2>
		</div>
		<div class= "col-md-9">
			<p>
				The maker faire was a great event! I got lots of good reactions! And some critical feedback! Yippee, I was somebodies favorite (on the down side he called my super button an "upside down yoghurt container"):  <a href="http://www.vancitybuzz.com/2015/06/hundreds-flock-vancouvers-mini-maker-faire/"> Search for Lode, or scroll through the pictures until you see the Red Button</a>!
			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/booth_construction.jpg" alt="A picture says it all...">
		</div>
		
		<div class= "col-md-12">
			<h2>See it in action!</h2>
		</div>
		
		<div class= "col-md-9">
			<p>
			Hurray!! We will be at the Vancouver Mini Maker Faire the 6th and 7th of June 2015! There I will be showing of the possibilities of my MultiTimer.
			Proudly somewhere in <a href="http://makerfaire.ca/2015-vmmf-makers/"> the middle of the website </a>!
			</p>
		</div>
		<div class= "col-md-3">
			<img width ="100%" src="/images/multitimer_button.jpg" alt="multitimer with extra button">
		</div>
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
      <img src="/images/image00.jpg" alt="The MultiTimer in Technicolor">
     
      <div class="carousel-caption">
        3d printed enclosure
      </div>
	  
	  </div>
	  <!-- <div class="item"> -->
     <!-- <img src="/images/multitimer_wood_demo.jpg" alt="The MultiTimer lasercut layered enclosure"> -->
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
    <script src="http://www.ameije.com/bootstrap-3.3.2-dist/js/bootstrap.min.js"></script>
    <script src="http://www.ameije.com/bootstrap-3.3.2-dist/js/docs.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <script src="http://www.ameije.com/bootstrap-3.3.2-dist/assets/js/ie10-viewport-bug-workaround.js"></script>
  </body>
</html>
