//[lat,lng]
var points = [];

var stops;
var batches;
var itemsPerBatch; // google API max - 1 start, 1 stop, and 8 waypoints
var itemsCounter;
var wayptsExist;
var request;
var waypts;
var lastIndex;
var start;
var end;
var combinedResults;
var unsortedResults; // to hold the counter and the results themselves as they come back, to later sort
var directionsResultsReturned;
var directionsService;
var directionsDisplay;
var markerOptions;
var rendererOptions;
var directionsDisplay;
var directionsService;

var timeout = 1000;

$(function () {
    //markerOptions = {
    //    draggable: false,
    //    icon: "/Content/img/map/marker_null.PNG"
    //};
    //rendererOptions = {
    //    preserveViewport: true,
    //    markerOptions: markerOptions,
    //    polylineOptions: {
    //        strokeColor: '#F15071',
    //        strokeOpacity: 0.5,
    //        strokeWeight: 2

    //    }
    //    /*suppressMarkers: true*/
    //};

    //directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
    //directionsService = new google.maps.DirectionsService();
    //directionsDisplay.setMap(mainMap.map);
    //initRoute();
    //setClickEvent();
});

function setClickEvent() {
    google.maps.event.addListener(mainMap.map, "click", function (event) {
        // place a marker
        points.push([event.latLng.lat(), event.latLng.lng()]);
        initRoute();
    });
}
function drawMarkers() {
    for (var i = 0; i < pointsmarkers.length; i++) {
        if (pointsmarkers[i]) pointsmarkers[i].setMap(null);
    }
    pointsmarkers.length = 0;
    for (i = 0; i < points.length; i++) {

        addDirectionMarker(new google.maps.LatLng(points[i][0], points[i][1]), "/Content/img/map/marker_main.PNG", "Город №" + (i + 1));
    }
}

function initRoute() {
    stops = points;
    batches = [];
    itemsPerBatch = 8; // google API max - 1 start, 1 stop, and 8 waypoints
    itemsCounter = 0;
    wayptsExist = stops.length > 0;
    waypts = [];
    lastIndex = 0;
    start = 0;
    end = 0;
    unsortedResults = [{}]; // to hold the counter and the results themselves as they come back, to later sort
    directionsResultsReturned = 0;

    while (wayptsExist) {
        var subBatch = [];
        var subitemsCounter = 0;

        for (var j = itemsCounter; j < stops.length; j++) {
            subitemsCounter++;
            subBatch.push({
                location: new google.maps.LatLng(stops[j][0], stops[j][1]),
                stopover: true
            });
            if (subitemsCounter == itemsPerBatch) break;
        }

        itemsCounter += subitemsCounter;
        batches.push(subBatch);
        wayptsExist = itemsCounter < stops.length;
        // If it runs again there are still points. Minus 1 before continuing to 
        // start up with end of previous tour leg
        itemsCounter--;
    }
    calcRoute(batches, directionsService, directionsDisplay);
    drawMarkers();
}

function calcRoute(batches, _directionsService, _directionsDisplay, k) {
    // to hold the counter and the results themselves as they come back, to later sort

    if (!directionsService) directionsService = _directionsService;
    if (!directionsDisplay) directionsDisplay = _directionsDisplay;
    if (!k) k = 0;
    if (k >= batches.length) return;

    lastIndex = batches[k].length - 1;
    start = batches[k][0].location;
    end = batches[k][lastIndex].location;

    // trim first and last entry from array
    waypts = [];
    waypts = batches[k];
    waypts.splice(0, 1);
    waypts.splice(waypts.length - 1, 1);

    request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    sendrequest(k);
}


function sendrequest(kk) {
    directionsService.route(request, function (result, status) {
        //$("#directionsPanel").text("ИДЕТ ОБРАБОТКА... (" + Math.floor(kk * 100 / batches.length) + "%)");
        if (status == window.google.maps.DirectionsStatus.OK) {

            var unsortedResult = {
                order: kk,
                result: result
            };
            unsortedResults.push(unsortedResult);
            directionsResultsReturned++;
            if (directionsResultsReturned == batches.length) // we've received all the results. put to map
            {
                // sort the returned values into their correct order
                unsortedResults.sort(function (a, b) {
                    return parseFloat(a.order) - parseFloat(b.order);
                });
                var count = 0;
                for (var key in unsortedResults) {
                    if (unsortedResults[key].result != null) {
                        if (unsortedResults.hasOwnProperty(key)) {
                            if (count == 0) // first results. new up the combinedResults object
                                combinedResults = unsortedResults[key].result;
                            else {
                                // only building up legs, overview_path, and bounds in my consolidated object. This is not a complete
                                // directionResults object, but enough to draw a path on the map, which is all I need
                                combinedResults.routes[0].legs = combinedResults.routes[0].legs.concat(unsortedResults[key].result.routes[0].legs);
                                combinedResults.routes[0].overview_path = combinedResults.routes[0].overview_path.concat(unsortedResults[key].result.routes[0].overview_path);

                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getNorthEast());
                                combinedResults.routes[0].bounds = combinedResults.routes[0].bounds.extend(unsortedResults[key].result.routes[0].bounds.getSouthWest());
                            }
                            count++;
                        }
                    }
                }
                //directionsDisplay.setDirections(combinedResults);
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(combinedResults);
                    /*$("#directionsPanel").empty();
                    $("#printLink").remove();
                    $("#directionsPanel").before("<p id='printLink'><a href='javascript:printDirections();'>Print Directions</a></p>");
                */
                } else {
                    alert("Sorry! Unable to determine a valid route");
                }
            }
        }
        else {
            setTimeout(function () { calcRoute(batches, directionsService, directionsDisplay, kk); }, (timeout));
            return;
        }
        setTimeout(function () { calcRoute(batches, directionsService, directionsDisplay, kk + 1); }, (timeout));
    });
}


function makeMarker(position, icon, title, css) {
    new MarkerWithLabel({
        position: position,
        icon: icon || "/Content/img/map/marker_main.PNG",
        map: mainMap,
        labelContent: title,
        labelAnchor: new google.maps.Point(20, 5),
        labelClass: css || "PointLabels", // the CSS class for the label
        labelInBackground: false
    });
}




var pointsmarkers = [];
function addDirectionMarker(position, icon, title) {
    pointsmarkers.push(makeMarker(position,icon,title));
}
