// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require jquery
//= require_tree .



$(document).ready(function() {

})










/////////////////////////////// Maps functionality for navigation and directions
//////////////////////////////  basic configurations and then functional elements

var map;
var newLat = 0;
var newLng = 0;
var panelDetails;
var adpSummary;
var routeTimeEst;
var routeDistEst;


function loadMap() {

    /// check if our map exists, if not then load it in

    if ($("#map").length < 1) {
      var mapsHtml = '<div id="maps"><div id="navigation"><div class="navlist"><div id="directionsPanel" style="height 100%;"></div></div></div><div id="mapOverlay"><h3>Loading maps...<span></span></h3></div><div id="map"></div></div>'
      $("#eye").append(mapsHtml)

      $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&callback=initMap', function() { });
    }

    ///// Maps functionality

    // Fade in maps after a second so we don't get background flicker!
    setTimeout(function() {
        $("#maps").css("opacity", "1")
        $("#mapOverlay h3 span").css("width", "100%").css("opacity", "1")
    }, 150)
    setTimeout(function() {
        $("#mapOverlay").fadeOut("fast")
        $("#readout").val(" ")
    }, 600)

	setTimeout(function() {

		// scenic route
		// loadDestination(dest, true)

		// normal destination
		loadDestination("grand central station")
	}, 750)

}

function loadDestination(destination, scenic) {

    mapQuery = destination
    mapAction = ""

    var origin = "410 south 4th street brooklyn new york"
    var oLat = 0
    var oLng = 0

    // Geocode origin & dest
    var geocoder; geocoder = new google.maps.Geocoder(); geocoder.geocode( { 'address': origin }, function(results, status) { if (status == 'OK') {oLat = results[0].geometry.location.lat();oLng = results[0].geometry.location.lng();} else {console.log('GeoCode failed: ' + status);}})
    geocoder = new google.maps.Geocoder(); geocoder.geocode( { 'address': mapQuery}, function(results, status) { if (status == 'OK') {newLat = results[0].geometry.location.lat();newLng = results[0].geometry.location.lng();} else {console.log('GeoCode failed: ' + status);}})

    setTimeout(function() {

        // var newDLat = newCoords[0]
        // var newDLng = newCoords[1]

        // console.log(newLat)
        // console.log(newLng)

        // fade in navigation panel
        $("#navigation").fadeIn("fast")

        // Maps request function is set up as below:
        // mapsRequest(destination, dName, dLat, dLng, origin, oName, oLat, oLng)
        mapsRequest(mapQuery, mapQuery, newLat, newLng, origin, origin, oLat, oLng, scenic)

    }, 1000)
}

function removeMap() {

    $("#readout").val(" ")
    $("#map").fadeOut("slow")
}

// Set destination, origin and travel mode.

function getGeocode(address, lat, lng) {
    var geocoder; geocoder = new google.maps.Geocoder(); geocoder.geocode( { 'address': address}, function(results, status) { if (status == 'OK') {lat = results[0].geometry.location.lat();lng = results[0].geometry.location.lng();} else {console.log('GeoCode failed: ' + status);}})
}

function mapsRequest(destination, dName, dLat, dLng, origin, oName, oLat, oLng, scenic) {
    var tm = 'DRIVING'
    if (scenic == true) {
      tm = 'BICYCLING'
    }
    var request = {
      destination: destination,
      origin: origin,
      travelMode: tm
    };

    var directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: "#00ffff"
        }
    });

    // Pass the directions request to the directions service.
    var directionsService = new google.maps.DirectionsService();
    directionsService.route(request, function(response, status) {
      console.log("STATUS ------")
      console.log(status)
      console.log(response)
      if (status == 'OK') {
        // Display the route on the map.
        directionsDisplay.setDirections(response);
        directionsDisplay.setPanel(document.getElementById('directionsPanel'))
        panelDetails = directionsDisplay.panel

        setTimeout(function() {
            routeTimeEst = $("span[jstcache=82]").text()
            routeDistEst = $("span[jstcache=56]").text()

            // replace goal icon
            $('img[jstcache="67"]').parent().html("<img src='/assets/icon_destination.png' />")

            // prepend with icons
            $("span[jstcache=56]").html('<img src="/assets/icon_distance.png" />' + routeDistEst)
            $("span[jstcache=58]").html('<img src="/assets/icon_stopwatch.png" />About ' + routeTimeEst)

            // Add time remaining
            var d = new Date();
            var h = d.getHours()
            var m = d.getMinutes()
            var minInt = routeTimeEst.replace(/[^0-9.]/g, "")
            var est = parseInt(m) + parseInt(minInt)
            var totalEst = ((parseInt(h) + 11) % 12 + 1) + ":" + ((minInt + 59) % 60 + 1);
            $(".adp-summary").append('<span><i class="far fa-clock"></i> ' + totalEst + '</span>')
        }, 200)

        setTimeout(function() {

            responsiveVoice.speak("About " + routeDistEst + ", and should take " + routeTimeEst + ".", "UK English Female", {rate: 1});

            // Set destination in HM emulator
            $.ajax({ type: 'GET', url: '/setdestination?lat=' + dLat + '&lon=' + dLng + '&dest=' + dName });
        }, 1000)
      }
    });

    var cyanDotTop = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#05bfc0',
        fillOpacity: 1,
        scale: 8,
        strokeColor: '#05bfc0',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(19, -3),
    };

    var cyanDotBot = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#05bfc0',
        fillOpacity: 1,
        scale: 8,
        strokeColor: '#05bfc0',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(23, -3),
    };

    new google.maps.Marker({
        position: {lat: dLat, lng: dLng},
        map: map,
        label: {text: dName, color: "white", fontSize: "28px", fontWeight: "300"},
        icon: cyanDotBot
    });

    new google.maps.Marker({
        position: {lat: oLat, lng: oLng},
        map: map,
            label: {text: oName, color: "white", fontSize: "28px", fontWeight: "300"},
        icon: cyanDotTop
    });


    // Speak out the directions!
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.7128, lng: -74.0059},
    zoom: 10,
    zoomControl: false,
    scaleControl: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#0b1732"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#038f94"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1a3646"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#4b6878"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#64779e"
          }
        ]
      },
      {
        "featureType": "administrative.province",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#4b6878"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#051d2d"
          }
        ]
      },
      {
        "featureType": "landscape.man_made",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#040f27"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#01151e"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#0a1a3a"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#6f9ba5"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1d2c4d"
          }
        ]
      },
      {
        "featureType": "poi.business",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#023e58"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#124750"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#fff"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#033751"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#054f62"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#014b80"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
          {
            "color": "#255763"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#b0d5ce"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#023e58"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#02294a"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#98a5be"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#1d2c4d"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#283d6a"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3a4762"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#0e1626"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#4e6d70"
          }
        ]
      }
    ]
    });
}

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}





///////////// message array sorting function.  This is used specifically to sort arrays with dats in the [2] place
// it is used like:  a.sort(sortFunction);

function sortFunction(a, b) {
    if (a[2] === b[2]) {
        return 0;
    }
    else {
        return (a[2] < b[2]) ? -1 : 1;
    }
}



