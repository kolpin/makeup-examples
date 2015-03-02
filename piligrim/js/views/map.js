var geocoder; //geocoder
var mainMap;
var layer; // Fusion Tables layer
var tableid = 419167;
var table; // GViz Table visualization
var datatable; // Fusion Tables data in GViz Data Table object


function initializeMap() {

    var mapOptions = {
        zoom: 15,        
        center: new google.maps.LatLng(55.758889, 37.621093),
        disableDefaultUI: true,
        styles: mapStylesCountry
    };
    geocoder = new google.maps.Geocoder();

    mainMap = new google.maps.Map(document.getElementById('map'), mapOptions);

    /*Окантовка стран*/
    layer = new google.maps.FusionTablesLayer({
        query: {
            select: "kml_4326",
            from: tableid,
            where: "sovereignt in ('Ukraine', 'Belarus','Russia','Azerbaijan','Armenia','Georgia','Kazakhstan','Kyrgyzstan','Moldova','Tajikistan','Turkmenistan','Uzbekistan') "
        },
        styles: [{
            polygonOptions: {
                strokeColor: '#000000',
                strokeOpacity: "0.1",
                strokeWeight: "1",
                fillColor: '#CAC9C7',
                fillOpacity: "0"
            }
        }]
    });
    // queryTable();
    layer.setMap(mainMap);

    for(i in countries) {
        makeMarker(countries[i].coords, "/Content/img/map/marker_null.png", countries[i].name, "Label Country")
    }


    $('.mapwrapper')
        .on('click', '.plus', function (e) {
            e.preventDefault();
            var zoom = map.getZoom();
            mainMap.setZoom(++zoom);
            if (zoom < 21) {
                $(this).removeClass('disabled');
            } else {
                $(this).addClass('disabled');
            }
            if (zoom > 0) {
                $('.mapwrapper .minus').removeClass('disabled');
            } else {
                $('.mapwrapper .minus').addClass('disabled');
            }
            
        })
        .on('click', '.minus', function (e) {
            e.preventDefault();
            var zoom = mainMap.getZoom();
            mainMap.setZoom(--zoom);
            if (zoom < 21) {
                $('.mapwrapper .plus').removeClass('disabled');
            } else {
                $('.mapwrapper .plus').addClass('disabled');
            }
            if (zoom > 0) {
                $(this).removeClass('disabled');
            } else {
                $(this).addClass('disabled');
            }
        })
        .on('click', '.history', function (e) {
            e.preventDefault();
            $(".mapwrapper .controls").hide();
            $("#history").stop().animate({
                left: 0
            }, 500, function() {
                // Animation complete.
            });
        })
        .on('click', '.close-history', function (e) {
            e.preventDefault();
            $("#history").stop().animate({
                left: "-370px"
            }, 500, function () {
                $(".mapwrapper .controls").show();
            });
        });

    $('#history')
        .on('click', '.history-item', function (e) {
            e.preventDefault();
            var item = $(e.currentTarget),
                unselect = false;

            $('.history-item')
                .removeClass('unselect')
                .each(function () {
                    var $this = $(this);
                    if (unselect) {
                        $this.addClass('unselect');
                    }
                    if (item.index() == $this.index()) {
                        unselect = true;
                    }
                });
        });
}

//google.maps.event.addDomListener(window, 'load', initializeMap);


/*
google.maps.event.addListener(map, 'zoom_changed', function () {

    var zoomLevel = map.getZoom();
    document.getElementById('zoomLevel').innerHTML = 'Zoom Level: ' + zoomLevel;

    if (zoomLevel > 10) {
        map.setOptions(highLevelStyles);
    } else {
        map.setOptions(lowLevelStyles);
    }
});*/


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


function codeAddress(address) {

    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            console.log(results);
            //map.setCenter(results[0].geometry.location);
            //var marker = new google.maps.Marker({
            //    map: map,
            //    position: results[0].geometry.location
            //});
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}
