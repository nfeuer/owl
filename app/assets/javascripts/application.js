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



    // Deal with typed instead of spoken
    $("#readout").on('keyup', function (e) {
      if (e.keyCode == 13) {
          // grab output typed in
          var output = $("#readout").val()
          dialogue(output)
          $("#readout").val("")
          $("#readout").blur()
      }
    })






    // incidents menu click open
    $(".menu-item.incidents").on("click", function() {
        getIncidents()
    })

    // drawing mapping menu click open
    $(".menu-item.mapping").on("click", function() {
        showMapping()
    })

    // civilian data mapping menu click open
    $(".menu-item.civdata").on("click", function() {
        showCivilianData()
    })

    // weather menu click open
    $(".menu-item.weather").on("click", function() {
        showWeather()
    })
    
})




///////////////// get all incidents from db
function getIncidents() {

  $.get("/getincidents", function(data){

    // console.log(data)

    var ehtml = ''

    $(data).each(function(index,el){
      // console.log(el)
      ehtml = ehtml + '<div class="incident-item"><div class="row"><div class="col-sm-4"><h3>' + el.name + '</h3></div><div class="col-sm-4"><p><b>Created:</b> ' + el.date + '</p></div><div class="col-sm-4"><a data-confirm="Are you sure you want to delete this incident?" class="delete-btn" rel="nofollow" data-method="delete" href="/incidents/' + el.id + '">Delete</a></div></div></div>'
    })

    // append to action container
    $(".action-container").append('<div id="incident-list"><div class="row"><div class="col-sm-12">' + ehtml + '</div></div></div>')

    // add delete onclick
    $("#incident-list a.delete-btn").on("click", function() {
      $(this).parents(".incident-item").fadeOut("slow")
    })

    // remove menus and such
    removeMenu()
    removeActionElement()

    // fade in incidents
    setTimeout(function() {
      $(".action-container #incident-list").fadeIn("fast")
    },500)

  })
}

////////////////////////////// dashboard fade in UI
function showMenu() {

    // clear dashboard
    $(".action-element").fadeOut("fast")
    setTimeout(function() {
        $(".action-element").remove()
    }, 175)

    // clear readout
    // $("#readout").val(" ")


    $(".menu .menu-item").addClass("out")
    $(".menu").addClass("in")

    // delay
    var time = 100;

    $(".menu .menu-item").each(function(index, el) {

        setTimeout( function(){
          $(el).removeClass("out")
        }, time)
        time += 75;
    })
}

////////////////////////////// remove dashboard fade out UI
function removeMenu() {

    // clear readout
    // $("#readout").val(" ")

    // delay
    var time = 50;

    $(".menu .menu-item").each(function(index, el) {

        setTimeout( function(){
          $(el).addClass("out")
        }, time)
        time += 30;
    })

    setTimeout(function() {
        $(".menu").removeClass("in").addClass("out")
    }, 450)
}


////// remove action elements
function removeActionElement() {
    $(".action-element").first().fadeOut("fast")
    setTimeout(function() {
        $(".action-element").first().remove()
    }, 160)
}


//////// show the weather in the action area
function showWeather() {

    removeMenu()
    removeActionElement()
    
    // fade out current content
    $(".action-container .content-image").fadeOut("fast")
    
    setTimeout(function() {
        getForecast()
        getNowcast()
        getTropicalCurrentPosition()

        $(".weather-content").detach().appendTo(".action-container").fadeIn("fast")
    }, 550)
}


function showMapping() {
    
    removeMenu()
    removeActionElement()

    // $(".action-container .content-image").fadeOut("fast")
    // setTimeout(function(){
    //     $(".content-image").remove()
    //     $(".action-container").append("<img class='content-image' src='/assets/content_mapping.jpg' />")
    // }, 150)

    // setTimeout(function(){
    //     $(".action-container .content-image").css("opacity", "1")
    //     machineResponse = "I've shown location information for the current incident."
    //     writeDialogue(machineResponse, "machine")
    //     responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
    // }, 750)

    // if ($("#map").length < 1) {

    setTimeout(function(){

        $(".action-container").append('<div id="eye" class="action-element"></div>')
        var mapsHtml = '<div id="maps"><div id="navigation"><div class="navlist"><div id="directionsPanel" style="height 100%;"></div></div></div><div id="mapOverlay"><h3>Loading maps...<span></span></h3></div><div id="map"></div></div>'
        $("#eye").append(mapsHtml)

        $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&libraries=drawing&callback=initDrawingMap', function() { });
        

    }, 200)
}



function showCivilianData() {
    
    removeMenu()
    removeActionElement()

    setTimeout(function(){
        $(".action-container").append('<div id="civdata" class="action-element"><div id="maps"><div id="map"></div><div class="console"><h3>Fuel/Gas</h3></div></div></div>')
        var mapsHtml = '<div id="maps"><div id="navigation"><div class="navlist"><div id="directionsPanel" style="height 100%;"></div></div></div><div id="mapOverlay"><h3>Loading maps...<span></span></h3></div><div id="map"></div></div>'
        $("#eye").append(mapsHtml)
        $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&libraries=drawing&callback=initCivMap', function() { });
    }, 200)
}


function showResources() {

    removeMenu()
    removeActionElement()

    $(".action-container .content-image").fadeOut("fast")
    setTimeout(function(){
        $(".content-image").remove()
        $(".action-container").append("<img class='content-image' src='/assets/content_resources.jpg' />")
    }, 150)
    
    setTimeout(function(){
        $(".action-container .content-image").css("opacity", "1")
        machineResponse = "Here is an overview of incident resources."
        writeDialogue(machineResponse, "machine")
        responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
    }, 750)

}







//////////////////////////// weather functionality for weather dashboard

function getForecast(geocode) {

    var g;

    if (typeof geocode == "undefined") {
        g = "35.613,-77.366"
    } else {
        g = geocode
    }

    ////////////// get 4 day forecast
    $.get("/getweatherforecast?geoid=" + g, function(data){

        // grab the raw response and turn into json
        $("body").find(".data-response").html("").append(data)
        var jResponse = JSON.parse($(".data-response").html())

        //// unpack the json
        console.log(jResponse)

        var daypart = jResponse.daypart
        var dayofweek = jResponse.dayOfWeek
        var narrative = jResponse.narrative
        var tempmin = jResponse.temperatureMin
        var tempmax = jResponse.temperatureMax

        // iterate through days and add data
        $(".four-day-forecast .day-container").each(function(index, el) {

            /// add day of week
            $(this).find("h3").html(dayofweek[index])

            /// add temps
            var m = tempmin[index]
            var n = tempmax[index]
            if (m == null) { m = "" } else { m = m + "F"}
            if (n == null) { n = "" } else { n = n + "F"}
            $(this).find("h4").html(m + " / " + n)

            /// add description
            $(this).find("h5").html(narrative[index])

            // update icons
            var s = narrative[index].toLowerCase()
            if (s.includes("thunderstorm")) {
                $(this).find("img.icon").attr("src", "/assets/icon_thunderstorms.png")
            } else if (s.includes("windy")) {
                $(this).find("img.icon").attr("src", "/assets/icon_cloudy.png")
            } else if (s.includes("cloudy")) {
                $(this).find("img.icon").attr("src", "/assets/icon_cloudy.png")
            } else if (s.includes("sun")) {
                $(this).find("img.icon").attr("src", "/assets/icon_cloudy.png")
            } else if (s.includes("shower") || (s.includes("rain"))) {
                $(this).find("img.icon").attr("src", "/assets/icon_rainy.png")
            }            
        })
    })
}


function getNowcast(geocode) {

    var g;

    if (typeof geocode == "undefined") {
        g = "35.613/-77.366"
    } else {
        g = geocode
    }

    //////////////////// get nowcast for subtitle
    $.get("/weathernowcast?location=" + g, function(data){
        
        $("body").find(".data-response").html("").append(data)
        var jResponse = JSON.parse($(".data-response").html())

        //// unpack the json
        console.log(jResponse)

        var desc = jResponse.forecast.narrative_256char

        /// append description
        $(".weather-content p.description").html(desc)

        machineResponse = "Here is the current weather"
        writeDialogue(machineResponse, "machine")
        // responsiveVoice.speak(desc, "UK English Female", {rate: 1.075});

    })    
}

function getTropicalCurrentPosition() {

    $.get("/tropicalcurrent", function(data){
        
        $("body").find(".data-response").html("").append(data)
        var jResponse = JSON.parse($(".data-response").html())

        //// unpack the json
        console.log(jResponse)

        var advisoryinfo = jResponse.advisoryinfo
        var laststorm = advisoryinfo[0]
        var stormname = laststorm.storm_name
        var stormtype = laststorm.currentposition.storm_type
        var stormcategory = laststorm.currentposition.storm_sub_type

        /// append nomenclature
        $(".weather-content .warning em b").html(stormtype + " " + stormname)
        $(".weather-content .warning .storm-desc").html(stormcategory)
        

    })
}






function checknotifications() {

    $.get("/checknotifications", function(data){

        // get id of last notification and check if it matches last notification in panel
        var n = $(".notifications-list .notification").first()
        var nid = n.attr("id")
        console.log(nid)
        console.log(data)

        if (nid != data) {
            getnotification()
        }
    })
}

function checkpriorities() {

    $.get("/checkpriorities", function(data){

        // get id of last notification and check if it matches last notification in panel
        var n = $(".priorities-list .priority").first()
        var nid = n.attr("id")
        console.log(nid)
        console.log(data)

        if (nid != data) {
            getpriority()
        }
    })
}

function getnotification() {

    $.get("/getnotification", function(data){

        var nid = data.nid
        var t = data.title
        var c = data.content
        var tw = ""
        if (c.includes(":twitter")) {
            tw = '<div class="twitter"><i class="fab fa-twitter"></i></div>'
        }
        c = c.replace(":twitter", "").substring(0,30) + "..."

        // add notification
        var nhtml = '<div class="notification active out" id="' + nid + '">' + tw + '<div class="info"><h4>' + t + '</h4><p>' + c + '</p></div><div class="time"><p><span>1</span>mins</p></div></div>'
        $(".notifications-list").prepend(nhtml)
        setTimeout(function() {
            $(".notifications-list .notification.out").removeClass("out")
        }, 100)
    })
}

function getpriority() {

    $.get("/getpriority", function(data){

        var nid = data.nid
        var t = data.title
        var c = data.content
        var num = $(".priority").length + 1

        // add notification

        var phtml = '<div class="priority out" id="' + nid + '"><h4>' + t + '</h4><p>' + c + '</p><div class="num">' + num + '</div></div>'
        $(".priorities-list").append(phtml)

        setTimeout(function() {
            $(".priorities-list .priority.out").removeClass("out")
        }, 100)
    })
}




//////// geocode an address

function getLocation(g) {

    $.get("/getlocation?location=" + g, function(data){

        console.log(data)

        // append to raw response
        var raw = $(".data-response")
        raw.append(data)

        // grab the raw response and turn into json
        var jResponse = JSON.parse(raw.html())
        console.log(jResponse)

        // coordinates
        var lat = jResponse.location.latitude[0]
        var lon = jResponse.location.longitude[0]
        console.log(lat)
        console.log(lon)

        //// unpack the json
        

        // append to visible response section
        // p.find(".response").append("<p><b>Metadata:</b> " + JSON.stringify(jResponse) + "</p>")
    })
}






///// create an incident
function newincident(name, location) {

    var n = name
    var l = location

    $.get("/newincident?name=" + n + "&location=" + l, function(data) {
        console.log(data)
    })
}


// Validate filetypes

function validateFiles(inputFile) {
  var maxExceededMessage = "This file exceeds the maximum allowed file size (5 MB)";
  var extErrorMessage = "Only image file with extension: .jpg, .jpeg, .gif or .png is allowed";
  var allowedExtension = ["jpg", "jpeg", "gif", "png"];
  
  var extName;
  var maxFileSize = $(inputFile).data('max-file-size');
  var sizeExceeded = false;
  var extError = false;
  
  $.each(inputFile.files, function() {
    if (this.size && maxFileSize && this.size > parseInt(maxFileSize)) {sizeExceeded=true;};
    extName = this.name.toLowerCase().split('.').pop();
    if ($.inArray(extName, allowedExtension) == -1) {extError=true;};
  });
  if (sizeExceeded) {
    window.alert(maxExceededMessage);
    $(inputFile).val('');
  };
  
  if (extError) {
    window.alert(extErrorMessage);
    $(inputFile).val('');
  };
}








/////////////////////////////// Maps functionality for navigation and directions
//////////////////////////////  basic configurations and then functional elements

var map;
var newLat = 0;
var newLng = 0;
var panelDetails;
var adpSummary;
var routeTimeEst;
var routeDistEst;


function initDrawingMap() {

    console.log("going")

    var styles = [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.land_parcel",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#333333"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#555555"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#ffffff"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
    ]

    setTimeout(function(){

        var map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 35.613, lng: -77.366},
            zoom: 12,
            styles: styles,
            zoomControl: false,
            scaleControl: true,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
        });

        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: ['marker', 'circle', 'polygon', 'polyline', 'rectangle']
          },
          markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
          circleOptions: {
            fillColor: '#ffff00',
            fillOpacity: 1,
            strokeWeight: 5,
            clickable: false,
            editable: true,
            zIndex: 1
          },
          polygonOptions: {
            fillColor: '#ff0000',
            fillOpacity: .25,
            strokeColor: '#ff0000',
            strokeWeight: 3,
            clickable: true,
            editable: true,
            zIndex: 1
          }
        });
        drawingManager.setMap(map);
    }, 1000)

    setTimeout(function() {
        $("#maps").css("opacity", "1")
        $("#mapOverlay h3 span").css("width", "100%").css("opacity", "1")
    }, 150)
    setTimeout(function() {
        $("#mapOverlay").fadeOut("fast")
        $("#readout").val(" ")
    }, 600)
}



function initCivMap() {

    var styles = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#333333"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#555555"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ]

    // The location of Uluru
    // The map, centered at Uluru
    var map = new google.maps.Map(
      document.getElementById('map'), {
        zoom: 12,
        disableDefaultUI: true,
        center: {lat: 35.613, lng: -77.366},
        styles: styles
      });
    // The marker, positioned at Uluru

    var cyanDotBot = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#05bfc0',
        fillOpacity: 1,
        scale: 8,
        strokeColor: '#05bfc0',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(3, -2.5),
    };

    var redDot = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: 1,
        scale: 8,
        strokeColor: 'red',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(2.5, -2.5),
    };

    var greenDot = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'green',
        fillOpacity: 1,
        scale: 8,
        strokeColor: 'green',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(2.5, -2.5),
    };

    var orangeDot = {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'orange',
        fillOpacity: 1,
        scale: 8,
        strokeColor: 'orange',
        strokeWeight: 3,
        labelOrigin: new google.maps.Point(2.5, -2.5),
    };

    // make civilians points
    for (var i = 25 - 1; i >= 0; i--) {
        var rand = Math.floor((Math.random() * 800) + 1)/3000;
        var la = 35.5030 + rand

        var randl = Math.floor((Math.random() * 1000) + 1)/2000;
        var ln = -77.2000 - randl

        var marker = new google.maps.Marker({
            position: {lat: la, lng: ln},
            map: map,
            title: "Civilian",
            label: {text: "Civilian", color: "white", fontSize: "14px", fontWeight: "300"},
            icon: cyanDotBot
        });

        marker.addListener('click', function() {
            var e = $(this)
            $(".console h3").fadeOut("fast")
            $(".console p").fadeOut("fast")
            setTimeout(function() {
                $(".console h3").remove()
                $(".console p").remove()
                console.log(e[0])
                var l = e[0].label.text
                var lat = e[0].position.lat()
                var lng = e[0].position.lng()
                $(".console").html("<h3>" + l + "</h3><p>Latitude: " + lat + "</p><p>Longitude: " + lng + "</p><p>Added: 11:17 AM, Sept 27, 2018</p><p>Note:  Civilian has submitted they are present at this location.</p>").addClass("in")
            }, 160)
        });

        marker.addListener('mouseover', function() {
            marker.setIcon(redDot)
        });
    }

    /// make a few ems
    for (var i = 7 - 1; i >= 0; i--) {
        var rand = Math.floor((Math.random() * 800) + 1)/4000;
        var la = 35.5230 + rand

        var randl = Math.floor((Math.random() * 1000) + 1)/3000;
        var ln = -77.2000 - randl

        var marker = new google.maps.Marker({
            position: {lat: la, lng: ln},
            map: map,
            title: "EMS",
            label: {text: "EMS", color: "white", fontSize: "14px", fontWeight: "300"},
            icon: redDot
        });

        marker.addListener('click', function() {
            var e = $(this)
            $(".console h3").fadeOut("fast")
            setTimeout(function() {
                $(".console h3").remove()
                console.log(e[0])
                var l = e[0].label.text
                var lat = e[0].position.lat()
                var lng = e[0].position.lng()
                $(".console").html("<h3>" + l + "</h3><p>Latitude: " + lat + "</p><p>Longitude: " + lng + "</p><p>Added: 7:10 PM, Sept 27, 2018</p><p>Note:  Emergency medical services are present here for anyone in urgent need of care or medical supplies.</p>").addClass("in")
            }, 160)
        });
    }

    /// make a few food markers
    for (var i = 10 - 1; i >= 0; i--) {
        var rand = Math.floor((Math.random() * 800) + 1)/4000;
        var la = 35.5230 + rand

        var randl = Math.floor((Math.random() * 1000) + 1)/3000;
        var ln = -77.2000 - randl

        var marker = new google.maps.Marker({
            position: {lat: la, lng: ln},
            map: map,
            title: "Food",
            label: {text: "FOOD", color: "white", fontSize: "14px", fontWeight: "300"},
            icon: greenDot
        });

        marker.addListener('click', function() {
            var e = $(this)
            $(".console h3").fadeOut("fast")
            setTimeout(function() {
                $(".console h3").remove()
                console.log(e[0])
                var l = e[0].label.text
                var lat = e[0].position.lat()
                var lng = e[0].position.lng()
                $(".console").html("<h3>" + l + "</h3><p>Latitude: " + lat + "</p><p>Longitude: " + lng + "</p><p>Added: 2:36 PM, Sept 27, 2018</p><p>Note:  We have food and water present if you need.  Please come by and we will help.</p>").addClass("in")
            }, 160)
        });
    }

    /// make a few gas markers
    for (var i = 5 - 1; i >= 0; i--) {
        var rand = Math.floor((Math.random() * 800) + 1)/4000;
        var la = 35.5230 + rand

        var randl = Math.floor((Math.random() * 1000) + 1)/3000;
        var ln = -77.2000 - randl

        var marker = new google.maps.Marker({
            position: {lat: la, lng: ln},
            map: map,
            title: "Fuel, Oil, and Gas is Available Here",
            label: {text: "Fuel/Gas", color: "white", fontSize: "14px", fontWeight: "300"},
            icon: orangeDot
        });

        marker.addListener('click', function() {
            var e = $(this)
            $(".console h3").fadeOut("fast")
            setTimeout(function() {
                $(".console h3").remove()
                console.log(e[0])
                var l = e[0].label.text
                var lat = e[0].position.lat()
                var lng = e[0].position.lng()
                $(".console").html("<h3>" + l + "</h3><p>Latitude: " + lat + "</p><p>Longitude: " + lng + "</p><p>Added: 3:42 PM, Sept 27, 2018</p><p>Note:  We have a limited supply of gasoline and heating oil, please come and speak with us if you are in need of either.</p>").addClass("in")
            }, 160)
        });
    }
}



function initNewIncidentMap() {

    var styles = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#212121"
          }
        ]
      },
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "administrative.country",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "administrative.locality",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#181818"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#333333"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#555555"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#373737"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#3c3c3c"
          }
        ]
      },
      {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#4e4e4e"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "transit",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#000000"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#3d3d3d"
          }
        ]
      }
    ]

    // The location of Uluru
    // The map, centered at Uluru
    var map = new google.maps.Map(
    document.getElementById('map'), {
      zoom: 12,
      disableDefaultUI: true,
      center: {lat: 35.613, lng: -77.366},
      styles: styles
    });
}
    

function loadNewIncidentMap() {

    /// check if our map exists, if not then load it in

    if ($("#map").length < 1) {
      var mapsHtml = '<div id="maps"><div id="mapOverlay"></div><div id="map"></div></div>'
      $(".map-container").append(mapsHtml)

      $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&libraries=drawing&callback=initNewIncidentMap', function() { });
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

        // // normal destination
        loadCivilianDestination("grand central station")
    }, 750)

}


function loadCivilianMap() {

    /// check if our map exists, if not then load it in

    if ($("#map").length < 1) {
      var mapsHtml = '<div id="maps"><div id="navigation"><div class="navlist"><div id="directionsPanel" style="height 100%;"></div></div></div><div id="mapOverlay"><h3>Loading maps...<span></span></h3></div><div id="map"></div></div>'
      $("#civilian").append(mapsHtml)

      $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&libraries=drawing&callback=initCivilianMap', function() { });
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

        // // normal destination
        loadCivilianDestination("grand central station")
    }, 750)

}

function loadMap() {

    /// check if our map exists, if not then load it in

    if ($("#map").length < 1) {
      var mapsHtml = '<div id="maps"><div id="navigation"><div class="navlist"><div id="directionsPanel" style="height 100%;"></div></div></div><div id="mapOverlay"><h3>Loading maps...<span></span></h3></div><div id="map"></div></div>'
      $("#eye").append(mapsHtml)

      $.loadScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAwpA8PHX57_8RCU8iCCDdIEViCWrpy44k&libraries=drawing&callback=initDrawingMap', function() { });
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

function loadCivilianDestination(destination, scenic) {

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
        civilianMapsRequest(mapQuery, mapQuery, newLat, newLng, origin, origin, oLat, oLng, scenic)

    }, 1000)
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

function showPosition(position) {
    console.log("YOUR POSITION:")
    console.log(position.coords.latitude + 
    ", " + position.coords.longitude)

    return position.coords.latitude + ", " + position.coords.longitude
}

function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.log("Geolocation is not supported by this browser.")
    }
}


function civilianMapsRequest(destination, dName, dLat, dLng, origin, oName, oLat, oLng, scenic) {
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


    // var cyanDotTop = {
    //     path: google.maps.SymbolPath.CIRCLE,
    //     fillColor: '#05bfc0',
    //     fillOpacity: 1,
    //     scale: 8,
    //     strokeColor: '#05bfc0',
    //     strokeWeight: 3,
    //     labelOrigin: new google.maps.Point(19, -3),
    // };

    // var cyanDotBot = {
    //     path: google.maps.SymbolPath.CIRCLE,
    //     fillColor: '#05bfc0',
    //     fillOpacity: 1,
    //     scale: 8,
    //     strokeColor: '#05bfc0',
    //     strokeWeight: 3,
    //     labelOrigin: new google.maps.Point(23, -3),
    // };

    // new google.maps.Marker({
    //     position: {lat: dLat, lng: dLng},
    //     map: map,
    //     label: {text: dName, color: "white", fontSize: "28px", fontWeight: "300"},
    //     icon: cyanDotBot
    // });

    // new google.maps.Marker({
    //     position: {lat: oLat, lng: oLng},
    //     map: map,
    //         label: {text: oName, color: "white", fontSize: "28px", fontWeight: "300"},
    //     icon: cyanDotTop
    // });


    // Speak out the directions!
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

    new google.maps.Marker({
        position: {lat: 40.67, lng: -73.99},
        map: map,
            label: {text: "AYO", color: "white", fontSize: "28px", fontWeight: "300"},
        icon: cyanDotTop
    });


    // Speak out the directions!
}

jQuery.loadScript = function (url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}





///// generate random users to seed the database with a ton of random people
function generatePeople() {

  $.ajax({
    url: 'https://randomuser.me/api?results=250&nat=us,dk,fr,gb',
    dataType: 'json',
    success: function(data) {
      // console.log(data.results);

      data.results.forEach(function(el,index){
        var fullName = el.name.first + " " + el.name.last
        var fullUsername = el.name.first[0] + el.name.last

        $.get("/createuser?name=" + fullName + "&username=" + fullUsername)
      })
    }
  });
}




/////////// identify language in text

function identifyLanguage(text) {

    $.get("/identifylanguage?text=" + text, function(data){

        var d = data
        var j = JSON.parse(d).languages[0].language

        // console.log(d)
        console.log(j)

    })
}










function embedWaves() {

  var embed = '<canvas id="waves"></canvas>'
    $("#wavesContainer").append(embed)
    var waves = new SineWaves({
      el: document.getElementById('waves'),
      speed: 3,
      width: 300,
      height: 40,
      ease: 'SineInOut',
      wavesWidth: '100%',
      waves: [
      {
        timeModifier: .35,
        lineWidth: 1,
        amplitude: -10,
        wavelength: 100
      },
      {
        timeModifier: .6,
        lineWidth: 1,
        amplitude: -15,
        wavelength: 170
      },
      {
        timeModifier: 0.1,
        lineWidth: 2,
        amplitude: -5,
        wavelength: 250
      }
      ],

      // Called on window resize
      resizeEvent: function() {
      var gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
      gradient.addColorStop(0,"rgba(255,255,255, 0)");
      gradient.addColorStop(0.5,"rgba(255,255,255, 1)");
      gradient.addColorStop(1,"rgba(255,255,255, 0)");

      var index = -1;
      var length = this.waves.length;
      while(++index < length){
      this.waves[index].strokeStyle = gradient;
      }

      // Clean Up
      index = void 0;
      length = void 0;
      gradient = void 0;
      }
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
















////////////////////////// function dialogue for the dialogue stack
//////////////////// Dialogue Stack variables
var intents = []
var entities = []
var quantity = 0
var machineResponse = ""
var userResponse = ""
var context = ""
var showDemo;

function dialogue(text) {

    // clear metadata
    intents = []
    entities = []
    quantity = 0
    machineResponse = ""

    // Prepare dailogue text by downcasing
    var preparedText = text.toLowerCase()

    ////////////////////// Run through to find intents, calculate the intent here

    // Text wants to "create", so unify for add, new, create, start, etc.
    if (preparedText.includes("create") || preparedText.includes("add") || preparedText.includes("new") || preparedText.includes("start") || preparedText.includes("make")) {
        intents.push("add")
    }
    if (preparedText.includes("hello") || preparedText.includes("hi") || preparedText.includes("hey")) {
        intents.push("hello")
    }
    if (preparedText.includes("last") || preparedText.includes("recent")) {
        intents.push("recent")
    }
    if (preparedText.includes("fill") || preparedText.includes("fix") || preparedText.includes("check")) {
        intents.push("fix")
    }
    if (preparedText.includes("find") || preparedText.includes("show") || preparedText.includes("calculate") || preparedText.includes("see")) {
        intents.push("find")
    }
    if (preparedText.includes("help")) {
        intents.push("help")
    }
    if (preparedText.includes("save")) {
        intents.push("save")
    }
    if (preparedText.includes("upload") || preparedText.includes("up load") || preparedText.includes("load up") || preparedText.includes("loadup")) {
        intents.push("upload")
    }
    if (preparedText.includes("tutorial") || preparedText.includes("demo") || preparedText.includes("run through")) {
        if (preparedText.includes("manual") || preparedText.includes("directed")) {
          intents.push("manual tutorial")
        } else {
          intents.push("tutorial")
        }
    }
    if (preparedText.includes("average") || preparedText.includes("mean")) {
        intents.push("average")
    }
    if (preparedText.includes("merge")) {
        intents.push("merge")
    }
    if (preparedText.includes("top") || preparedText.includes("highest")) {
        intents.push("top")
    }
    if (preparedText.includes("setup") || preparedText.includes("set up")) {
        intents.push("setup")
    }
    if (preparedText.includes("say") || preparedText.includes("speak")) {
        intents.push("say")
    }
    if (preparedText.includes("play")) {
        intents.push("play")
    }
    if (preparedText.includes("can you text") || preparedText.includes("send a text") || preparedText.includes("text my friend")) {
        intents.push("text")
    }
    if (preparedText.includes("take me to") || preparedText.includes("direct me to") || preparedText.includes("direct to") || preparedText.includes("navigate me to") || preparedText.includes("navigate to")) {
        intents.push("navigate")
    }
    if (preparedText.includes("open")) {
        intents.push("open")
    }
    if (preparedText.includes("close")) {
        intents.push("close")
    }
    if (preparedText.includes("remove")) {
        intents.push("remove")
    }
    if (preparedText.includes("off")) {
        intents.push("off")
    }
    if (preparedText.includes("on")) {
        intents.push("on")
    }
    if (preparedText.includes("lock")) {
        intents.push("lock")
    }
    if (preparedText.includes("unlock")) {
        intents.push("unlock")
    }
    if (preparedText.includes("activate")) {
        intents.push("activate")
    }
    if (preparedText.includes("deactivate")) {
        intents.push("deactivate")
    }
    if (preparedText.includes("start")) {
        intents.push("start")
    }
    if (preparedText.includes("stop")) {
        intents.push("stop")
    }
    if (preparedText.includes("arm")) {
        intents.push("arm")
    }
    if (preparedText.includes("unarm")) {
        intents.push("unarm")
    }
    if (preparedText.includes("trigger")) {
        intents.push("trigger")
    }
    if (preparedText.includes("translate")) {
        intents.push("translate")
    }



    ////////////////////// Determine entities from text
    if (preparedText.includes("document") || preparedText.includes("documents") || preparedText.includes("doc")) {
        entities.push("document")
    }
    if (preparedText.includes("file")) {
        entities.push("file")
    }
    if (preparedText.includes("uploads") || preparedText.includes("upload")) {
        entities.push("upload")
    }
    if (preparedText.includes("map")) {
        entities.push("map")
    }
    if (preparedText.includes("tables")) {
        entities.push("tables")
    }
    if (preparedText.includes("presentation")) {
        entities.push("presentation")
    }
    if (preparedText.includes("api")) {
        entities.push("api")
    }
    if (preparedText.includes("video") || preparedText.includes("youtube")) {
        entities.push("video")
    }
    if (preparedText.includes("music") || preparedText.includes("song")) {
        entities.push("music")
    }
    if (preparedText.includes("media")) {
        entities.push("media")
    }
    if (preparedText.includes("contact")) {
        entities.push("contact")
    }
    if (preparedText.includes("window")) {
        entities.push("window")
    }
    if (preparedText.includes("door")) {
        entities.push("door")
    }
    if (preparedText.includes("climate") || preparedText.includes("weather")) {
        entities.push("weather")
    }
    if (preparedText.includes("dash")) {
        entities.push("dash")
    }
    if (preparedText.includes("menu")) {
        entities.push("menu")
    }
    if (preparedText.includes("port")) {
        entities.push("port")
    }
    if (preparedText.includes("engine")) {
        entities.push("engine")
    }
    if (preparedText.includes("trunk")) {
        entities.push("trunk")
    }
    if (preparedText.includes("lights")) {
        entities.push("lights")
    }
    if (preparedText.includes("charging")) {
        entities.push("charging")
    }
    if (preparedText.includes("emergency")) {
        entities.push("emergency")
    }
    if (preparedText.includes("flashers")) {
        entities.push("flashers")
    }
    if (preparedText.includes("roof")) {
        entities.push("roof")
    }
    if (preparedText.includes("theft alarm")) {
        entities.push("theft")
    }
    if (preparedText.includes("parking brake")) {
        entities.push("pbrake")
    }
    if (preparedText.includes("parking ticket")) {
        entities.push("pticket")
    }
    if (preparedText.includes("valet")) {
        entities.push("valet")
    }
    if (preparedText.includes("gas flap")) {
        entities.push("gflap")
    }
    if (preparedText.includes("english")) {
        entities.push("english")
    }
    if (preparedText.includes("spanish")) {
        entities.push("spanish")
    }
    if (preparedText.includes("french")) {
        entities.push("french")
    }
    if (preparedText.includes("german")) {
        entities.push("german")
    }
    if (preparedText.includes("korean")) {
        entities.push("korean")
    }
    if (preparedText.includes("resource")) {
        entities.push("resource")
    }
    if (preparedText.includes("notification")) {
        entities.push("notification")
    }
    if (preparedText.includes("priority")) {
        entities.push("priority")
    }
    if (preparedText.includes("incident")) {
        entities.push("incident")
    }
    if (preparedText.includes("civilian")) {
        entities.push("civilian")
    }

    ///////////////////////// Determine if there is a quantity mentioned, here we calculate quantities

    if (preparedText.includes("first") || preparedText.includes("second") || preparedText.includes("third") || preparedText.includes("1") || preparedText.includes("2") || preparedText.includes("3")) {

        if (preparedText.includes("first") || preparedText.includes("1")) {
            quantity = 1
        } else if (preparedText.includes("second") || preparedText.includes("2")) {
            quantity = 2
        } else if (preparedText.includes("third") || preparedText.includes("3")) {
            quantity = 3
        } else if (preparedText.includes("fourth") || preparedText.includes("4")) {
            quantity = 4
        } else if (preparedText.includes("fifth") || preparedText.includes("5")) {
            quantity = 5
        } else if (preparedText.includes("sixth") || preparedText.includes("6")) {
            quantity = 6
        } else if (preparedText.includes("seventh") || preparedText.includes("7")) {
            quantity = 7
        }

    } else if (preparedText.includes("one") || preparedText.includes("two") || preparedText.includes("three")) {
        if (preparedText.includes("one")) {
            quantity = 1
        } else if (preparedText.includes("two")) {
            quantity = 2
        } else if (preparedText.includes("three")) {
            quantity = 3
        } else if (preparedText.includes("four")) {
            quantity = 4
        } else if (preparedText.includes("five")) {
            quantity = 5
        } else if (preparedText.includes("six")) {
            quantity = 6
        } else if (preparedText.includes("seven")) {
            quantity = 7
        }
    }

    if (preparedText.includes("dozen")) {

        if (quantity == 0) {
            quantity = 1
        }
        quantity = quantity*12
    }



    //////////////// Dialogue Stack after we've determined intents and entitites

    // We just wanted to say hello!
    if (intents.indexOf("hello") > -1 && preparedText.length < 30) {

      machineResponse = "Hi there"

      setTimeout(function(){
        writeDialogue(machineResponse, "machine")
        responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
      }, 600)
    }







    /////// THIS IS A TEST DELETE IT LATER MADE FOR DEMO

    if (preparedText.includes("hurricane condition")) {

        setTimeout(function() {
            machineResponse = "This hurricane is currently a category 4 and about 100 miles in diameter.  You will likely avoid catastrophic damage, but will still experience strong winds and flash flooding. I recommend you seek shelter."
            writeDialogue(machineResponse, "machine")
            responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
        }, 750)
    }





    ////////// owl project dialogue stack flows
    ///////////////////////////////////////////////////////////////////////

    ////////// show dashboard/show menu
    if (intents.indexOf("find") > -1 && (entities.indexOf("dash") > -1 || entities.indexOf("menu") > -1)) {

        // show the menu!
        showMenu()
    } else if ((intents.indexOf("close") > -1 || intents.indexOf("remove") > -1) && (entities.indexOf("dash") > -1 || entities.indexOf("menu") > -1)) {

        // remove menu!
        removeMenu()
    }


    ////////// show weather and analytics
    if (intents.indexOf("find") > -1 && (entities.indexOf("weather") > -1 )) {

        // show the menu!
        showWeather()
    }

    ////////// show mapping
    if (intents.indexOf("find") > -1 && (entities.indexOf("map") > -1 )) {

        // show the menu!
        showMapping()

        setTimeout(function(){
            machineResponse = "Showing maps for geographical data"
            writeDialogue(machineResponse, "machine")
            // responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
        }, 300)
    }

    ////////// show resources
    if (intents.indexOf("find") > -1 && (entities.indexOf("resource") > -1 )) {

        // show the menu!
        showResources()
    }


    ////////// show resources
    if (intents.indexOf("find") > -1 && (entities.indexOf("civilian") > -1 )) {

        // show the menu!
        showCivilianData()

        setTimeout(function(){
            machineResponse = "Showing Civilian geographical data"
            writeDialogue(machineResponse, "machine")
            // responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1});
        }, 300)
    }





    //////////////////// create notifications

    if (entities.indexOf("notification") > -1 && intents.indexOf("add") > -1) {

        var t = ""
        var c = ""
        var tw = ""

        // separate
        if (preparedText.includes("title that says")) {
            t = preparedText.split("title that says")[1]
        }

        if (preparedText.includes("and text that says")) {
            c = t.split("and text that says")[1]
            t = t.split("and text that says")[0]
            t = t.replace("and text that says", "")
        }

        if (preparedText.includes("twitter")) {
            tw = " :twitter"
            t = t.replace("twitter", "")
        }

        /// finally, create the notification
        $.get("/createnotification?title=" + t + "&text=" + c + tw)

        // open notifications and update
        $(".notifications-container").addClass("open")

        setTimeout(function() {
            checknotifications()
        }, 250)

        setTimeout(function() {
            machineResponse = "Notification created."
            writeDialogue(machineResponse, "machine")
            responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1.075})
        }, 400)

        setTimeout(function() {
            $(".notifications-container").removeClass("open")
        }, 4000)
    }


    //////////////////// create priorities

    if (entities.indexOf("priority") > -1 && intents.indexOf("add") > -1) {

        var t = ""
        var c = ""

        // separate
        if (preparedText.includes("title that says")) {
            t = preparedText.split("title that says")[1]
        }

        if (preparedText.includes("and text that says")) {
            c = t.split("and text that says")[1]
            t = t.split("and text that says")[0]
            t = t.replace("and text that says", "")
        }

        // console.log("notification")
        // console.log(t)
        // console.log(c)

        /// finally, create the notification
        $.get("/createpriority?title=" + t + "&text=" + c)

        // open notifications and update
        $(".notifications-container").addClass("open")

        setTimeout(function() {
            checkpriorities()
        }, 250)

        setTimeout(function() {
            machineResponse = "Priority created."
            writeDialogue(machineResponse, "machine")
            responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1.075})
        }, 400)

        setTimeout(function() {
            $(".notifications-container").removeClass("open")
        }, 4000)
    }





    ///////// create an incident

    if (intents.indexOf("add") > -1 && entities.indexOf("incident") > -1) {

        var n = ""
        var l = ""

        // separate
        if (preparedText.includes("name is ")) {
            n = preparedText.split("name is ")[1]
        } else if (preparedText.includes("name it ")) {
            n = preparedText.split("name it ")[1]
        }

        if (preparedText.includes("location is ")) {
            l = n.split("location is ")[1]
            n = n.split("location is ")[0]
        }

        removeMenu()
        
        // create incident
        newincident(n,l)

        setTimeout(function() {
            machineResponse = "Incident created."
            writeDialogue(machineResponse, "machine")
            responsiveVoice.speak(machineResponse, "UK English Female", {rate: 1.075})
        }, 350)

        //// add visual UI stuffs
        var inchtml = '<div class="action-element incident"><h3>New Incident</h3><div class=row><div class=col-sm-4><h2>Hurricane Florence</h2><h4><b>Incident Owner:</b> Bryan</h4><h4><b>Location:</b> Greenville, North Carolina</h4><div class=managers><h4><b>Managers:</b></h4><div class=manager>BK</div><div class=manager>MP</div><div class=manager>CE</div><div class=manager>TR</div></div><div class=issues><h4><b>Anticipated Issues:</b> Flooding, Wind Damage, Electrical Outages</h4></div></div><div class="col-sm-8 map-container"></div></div></div>'
        $(".action-container").append(inchtml)

        loadNewIncidentMap()

        // update user incident in status bar if empty
        if ($(".status-bar .user-incident").text() == "") {
            $(".status-bar .user-incident").text(n)
            $(".status-bar .user-incident").removeClass("out")
        }
    }




    ////////// translate text
    if (intents.indexOf("translate") > -1) {

        if (entities.indexOf("english") > -1) {
            var text = preparedText.split("to english")[1]
            $.get("/translate?startlang=en&targetlang=en&text=" + text, function(data){
                console.log(data)
            })
        }

        if (entities.indexOf("french") > -1) {
            var text = preparedText.split("to french")[1]
            $.get("/translate?startlang=en&targetlang=fr&text=" + text, function(data){
                var r = JSON.parse(data).translations[0].translation
                console.log(r)
                machineResponse = r
                writeDialogue(machineResponse, "machine")
                responsiveVoice.speak(machineResponse, "French Female", {rate: 1})
            })
        }

        if (entities.indexOf("spanish") > -1) {
            var text = preparedText.split("to spanish")[1]
            console.log(text)
            $.get("/translate?startlang=en&targetlang=es&text=" + text, function(data){
                var r = JSON.parse(data).translations[0].translation
                console.log(r)
                machineResponse = r
                writeDialogue(machineResponse, "machine")
                responsiveVoice.speak(machineResponse, "Spanish Latin American Female", {rate: 1})
            })
        }

        if (entities.indexOf("german") > -1) {
            var text = preparedText.split("to german")[1]
            $.get("/translate?startlang=en&targetlang=de&text=" + text, function(data){
                var r = JSON.parse(data).translations[0].translation
                console.log(r)
                machineResponse = r
                writeDialogue(machineResponse, "machine")
                responsiveVoice.speak(machineResponse, "Deutsch Female", {rate: 1})
            })
        }

        if (entities.indexOf("korean") > -1) {
            var text = preparedText.split("to korean")[1]
            $.get("/translate?startlang=en&targetlang=ko&text=" + text, function(data){
                var r = JSON.parse(data).translations[0].translation
                console.log(r)
                machineResponse = r
                writeDialogue(machineResponse, "machine")
                responsiveVoice.speak(machineResponse, "Korean Female", {rate: 1})
            })
        }
    }







    // Log intents, entities
    console.log("Intents: " + intents)
    console.log("Entities: " + entities)



    // If we're in a place where we want the user input to show as a message...
    // and make sure there is a message

    if (typeof outputDialogue != "undefined") {
        writeDialogue(preparedText, "user")
    }

}








///////// output dialoge
function writeDialogue(m,t,d) {

    var delay = d
    var type = t

    if (typeof d == "undefined") {
      delay = 20000
    }

    // Create the message html object
    if (t == "user") {
        var messageHtml = '<div class="out message"><user>' + currentUsername + '<t>' + new Date().toLocaleTimeString() + '</t></user><span>' + m + '</span></div>'
    } else if (t == "machine") {
        var messageHtml = '<div class="out message"><div class="img-container"><img src="/assets/owl_icon_light.png" /></div><div class="content-container"><user>Owl<t>' + new Date().toLocaleTimeString() + '</t></user><span>' + m + '</span></div></div></div>'
    }

    // Append to conversation list
    $(".dialogue").append(messageHtml)

    // focus cursor back on readout
    $("#readout").focus()

    // Turn on new message
    setTimeout(function() {
      
      // Move the message
      $(".dialogue .out").removeClass("out")

      // eliminate readout
      $("#readout").val("")

      // scroll element
      var el = $(".dialogue .message").last()
      $(".dialogue").animate({scrollTop: el.offset().top});

      // prepare to fade this
      // setTimeout(function() {
      //     el.addClass("fadeout")

      //     setTimeout(function() {
      //       el.remove()
      //     }, 150)
      // }, delay)

    }, 120)
}







