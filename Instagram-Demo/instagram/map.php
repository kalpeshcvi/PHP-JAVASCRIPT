<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8 />
  <title></title>
  <script src='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.js'></script>
  <link href='https://api.mapbox.com/mapbox.js/v3.0.1/mapbox.css' rel='stylesheet' />
  <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
  <?php
    session_start();
    if (!isset($_SESSION['userdetails'])) {
      header('Location: index.php');
    }
  ?>
  <div class="header">
  <h1 class="title">
    Welcome To Circul8
  </h1>
  <span>
    <a href='?id=logout'>
      <img src="http://instagram.com/accounts/logout/" width="0" height="0" />
      Log out
    </a>
  </span>
  <?php
    session_start();
    if($_GET['id']=='logout'){
      unset($_SESSION['userdetails']);
      session_destroy();
      header('Location: index.php');
    }
    require 'instagram.class.php';
    require 'instagram.config.php';

    if (!empty($_SESSION['userdetails'])){
      $data=$_SESSION['userdetails'];
      $instagram->setAccessToken($data);
    }
    require 'function.php';
    $tag = 'love';
    $return = instagram_api_curl_connect('https://api.instagram.com/v1/tags/' . $tag . '/media/recent?access_token='.$data->access_token);
  ?>
  </div>
  <div id='map-popups-js' class='map'> </div>
  <!-- Setting up map marker object -->
  <script>
    L.mapbox.accessToken = 'pk.eyJ1IjoicnVzaGlsdHJhaW5lZSIsImEiOiJjamNiaTh1ejkwMzA0MndvM3Z2czc1d3YzIn0.gaOLkpfg8thqpdD7f82UPA';
    var mapPopupsJS = L.mapbox.map('map-popups-js', 'mapbox.light');
    var myLayer = L.mapbox.featureLayer().addTo(mapPopupsJS);

    var geojson = [
      <?php
        $i = 1;
        foreach ( $return->data as $post ) {
          if(!empty($post->location->longitude) && !empty($post->location->latitude)) {
            ?>
            {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [<?php echo $post->location->longitude; ?>, <?php echo $post->location->latitude; ?>]
              },
              properties: {
                title: '<?php echo $post->location->name; ?>',
                image: '<?php echo $post->images->standard_resolution->url; ?>',
                'marker-color': '#3bb2d0',
                'marker-size': 'large',
                'marker-symbol': '<?php echo $i; ?>',
              }
            },
            <?php
            $i++;
          }
        }
      ?>
    ];

    // Setting up a custom icon on each marker based on their required properties.
    myLayer.on('layeradd', function(e) {
      var marker = e.layer,
        feature = marker.feature;
      var content = '<p><strong>' + feature.properties.title + '</strong></p><img src="' + feature.properties.image + '" alt="" height="200" width="200">';
      marker.bindPopup(content);
    });
    myLayer.setGeoJSON(geojson);
    mapPopupsJS.scrollWheelZoom.disable();
  </script>
</body>
</html>

