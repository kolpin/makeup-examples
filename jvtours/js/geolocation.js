var map;
var directionsDisplay, drivingLine, startM, finishM, sMarker, fMarker;
var directionsService = new google.maps.DirectionsService();
var pos;
var markers = [];
function initialize() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var mapOptions = {
        zoom: 7,
        center: new google.maps.LatLng(55.80128097, 37.66113281),
        disableDefaultUI: true
        //mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    // Try HTML5 geolocation
    //if(navigator.geolocation) {
    //    navigator.geolocation.getCurrentPosition(function(position) {
    //        pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    //        map.setCenter(pos);
    //    }, function() {
    //        handleNoGeolocation(true);
    //    });
    //} else {
    //    // Browser doesn't support Geolocation
    //    handleNoGeolocation(false);
    //}
}

function sklonenie(n, forms) {
    return n%10==1&&n%100!=11?forms[0]:(n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?forms[1]:forms[2]);
}
function calcRoute(travel, address, id_panel) {
    var trMode;
    var start = address;
    var end = "МОСКВА, УЛ. ПРАВДЫ, 21, СТР. 1";
    if (travel == "walking") trMode = google.maps.TravelMode.WALKING;
    if (travel == "driving") trMode = google.maps.TravelMode.DRIVING;

    if(typeof(drivingLine) !== 'undefined') drivingLine.setMap(null);
    var request = {
        origin:start,
        destination:end,
        travelMode:trMode,
        unitSystem: google.maps.UnitSystem.METRIC
    };
    directionsService.route(request, function(result, status) {
        console.log(result);
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);

            drivingLine = new google.maps.Polyline({
                path: result.routes[0].overview_path,
                strokeColor: "#f54b4c",
                strokeOpacity: .75,
                strokeWeight: 3
            });
            drivingLine.setMap(map);
            deleteMarkers();
            var tmpmarker, tmpmarker2;
            startM = new google.maps.LatLng(result.routes[0].legs[0].start_location.k,result.routes[0].legs[0].start_location.B);
            tmpmarker = new google.maps.Marker({
                position: startM,
                map: map,
                icon: new google.maps.MarkerImage(
                    "img/ico/marker_start.PNG",
                    new google.maps.Size(7, 7),
                    new google.maps.Point(0, 0)
                )
            });
            markers.push(tmpmarker);
            finishM = new google.maps.LatLng(result.routes[0].legs[0].end_location.k,result.routes[0].legs[0].end_location.B);
            tmpmarker2 = new google.maps.Marker({
                position: finishM,
                map: map,
                icon: new google.maps.MarkerImage(
                         "img/ico/marker_finish.PNG",
                         new google.maps.Size(55, 55),
                         new google.maps.Point(0,0),
                         new google.maps.Point(21, 54)
                )
            });
            markers.push(tmpmarker2);

            map.fitBounds(result.routes[0].bounds);


            tmpDirectRes = result.routes;
            var steps = tmpDirectRes[0].legs[0].steps;
            for (var i in steps) {
                $('#'+id_panel).append(
                    "<li>" + steps[i].instructions + ", - " + steps[i].distance.value + "м</li>"
                );
            }
            $('.tabs_wrapper').jScrollPane({showArrows:false});
            if (id_panel == "panel_3") {
                var totalDistance = 0;
                var totalDuration = 0;
                var legs = result.routes[0].legs;
                for(var i=0; i<legs.length; ++i) {
                    totalDistance += legs[i].distance.value;
                    totalDuration += legs[i].duration.value;
                }

                //$('#car_dist').text( (totalDistance/1000)+ "км , " + (Math.round( totalDuration / 60 ))+ "мин.");
                var forms = ['час', 'часа', 'часов'];
                minutes = 1;
                var hours = 0;
                if(minutes >= 60){
                    hours = (minutes / 60) - (minutes / 60)%1;
                    minutes = minutes % 60;
                }
                $('#car_dist').text( (totalDistance/1000).toFixed(1)+ " км, " + (hours>=1?hours+' '+sklonenie(hours,forms) + ' ':'') + (minutes>0?minutes+" мин.":''));

            }
        }
    });
}
function deleteMarkers() {
     if (markers) {
         for (var i in markers) {
             markers[i].setMap(null);
         }
     }
}
function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Ваш браузер не поддерживает Геолакацию';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}

//google.maps.event.addDomListener(window, 'load', initialize);