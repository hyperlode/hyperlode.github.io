
<?php
// https://blog.hubspot.com/marketing/html-form-email
ini_set('display_errors', 1);
error_reporting(E_ALL ^ E_NOTICE);



if($_POST["message"]) {
    $name = $_POST['name'];
    $message = $_POST['message'];
    //$subject = $_POST['subject'];
    $email = $_POST['email'];
    $quote = isset($_POST['requestQuoteCheck']);
    $notifyAll = isset($_POST['generalUpdateCheck']);
    $notifyLuciebox = isset($_POST['lucieboxUpdateCheck']);
    $notifyQuoridor = isset($_POST['quoridorUpdateCheck']);
    
    
    $message = wordwrap($message, 70, "\r\n");
    
    $subject_line = "ameije.com contact from ". $name ." (";
    if ($quote){
        $subject_line =  $subject_line . "QUOTE, ";
    }
    if ($notifyAll){
        $subject_line =  $subject_line . "NOTIFY_ALL, ";
    }else{
        if ($notifyLuciebox){
            $subject_line =  $subject_line . "NOTIFY_LUCIEBOX, ";
        }
        if ($notifyQuoridor){
            $subject_line =  $subject_line . "NOTIFY_QUORIDOR, ";
        }
    }
    
     $subject_line =  $subject_line . ")";    
               
    $success = mail(
        "lodeameije@gmail.com",  // to email address
        $subject_line,  // subject
        "Reply to ". $email . "\r\n\r\n". $message  // message
        
        );
        
    if ($success){
        $success_html = "<p> Message sent! We will get back to you asap! </p>";
  
    }else{
        $success_html = "<p> Sorry, there was an error sending your message. Please try again or use a postal pigeon. </p>";
    }
    
    $output_html = <<<MULTILINETAG
         
        <html>
        <body>
          $success_html
        </body>
        </html>
MULTILINETAG;
    
    
}else{
     $output_html = readfile("contact_template.html");
            
    // $output_html = <<<LODESMULTILINESTRING
    
// LODESMULTILINESTRING;
            
}

echo($output_html);
    


?>

