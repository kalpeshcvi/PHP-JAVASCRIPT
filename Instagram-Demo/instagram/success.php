<?php
  require 'instagram.class.php';
  require 'instagram.config.php';

  // Receive OAuth code parameter
  $code = $_GET['code'];

  // Check whether the user has granted access
  if (true === isset($code)) {

    // Receive OAuth token object
    $data = $instagram->getOAuthToken($code);
    // Take a look at the API response
    session_start();
    $_SESSION['userdetails']=$data;

    header('Location: map.php');
  } 
  else 
  {
    // Check whether an error occurred
    if (true === isset($_GET['error'])) {
      echo 'An error occurred: '.$_GET['error_description'];
    }
  }
?>
