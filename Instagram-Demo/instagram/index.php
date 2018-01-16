<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Instagram Demo for Circul8</title>
    <link rel="stylesheet" type="text/css" href="style.css">
  </head>
  <body>
  <h1 class="homepage-title">Instagram Demo for Circul8</h1>
  <?php
    session_start();
    if (!empty($_SESSION['userdetails'])) {
    	header('Location: map.php');
    }
    require 'instagram.class.php';
    require 'instagram.config.php';
    // Display the login button
    $loginUrl = $instagram->getLoginUrl();
    echo "<a class=\"button\" href=\"$loginUrl\">Sign in with Instagram</a>";
    ?>
  </body>
</html>