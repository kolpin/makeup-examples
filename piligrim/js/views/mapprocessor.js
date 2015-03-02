/*Стили для карты переменная mapStyles вынесены в staticdata.js*/
function MapProcessor(selector_id) {

    var self = this;
    this.selector = selector_id;


    this.tableid = 419167;
    this.table; // GViz Table visualization
    this.datatable; // Fusion Tables data in GViz Data Table object
    this.routeTimeout = 1000;

    this.map;
    this.layerCountries;
    this.geocoder;
    this.directionsDisplay;
    this.directionsService;
    this.request;
    this.cityRequest;


    //опции карты
    this.mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(55.758889, 37.621093),

        disableDefaultUI: true,
        styles: []
    };

    //опции пустого маркера
    this.markerOptions = {
        draggable: false,
        icon: "/content/img/map/marker_null.PNG"
    };
    //опции отображения маршрута
    this.rendererOptions = {
        preserveViewport: true,
        markerOptions: this.markerOptions,
        polylineOptions: {
            strokeColor: '#F15071',
            strokeOpacity: 0.5,
            strokeWeight: 2

        }
        /*suppressMarkers: true*/
    };

    //будет хранить объекты точек
    this.points = [];
    this.markersArray = [];

    this.isInit = false;

    this.circle; //радиус пробега

    //------------

    this.setMapOptions = function (mapoptions) {
        self.mapOptions = mapoptions;
    }

    this.setStyle = function (styles) {
        self.mapOptions.styles = styles;
    }
    //инициализируем карту
    this.init = function (callback) {
        self.map = new google.maps.Map(document.getElementById(self.selector), self.mapOptions);
        /*Окантовка стран*/
        self.layerCountries = new google.maps.FusionTablesLayer({
            query: {
                select: "kml_4326",
                from: this.tableid,
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
            }],
            options: { suppressInfoWindows: true }
        });
        // queryTable();

        self.layerCountries.setMap(self.map);

        self.directionsDisplay = new google.maps.DirectionsRenderer(self.rendererOptions);
        self.directionsService = new google.maps.DirectionsService();
        self.directionsDisplay.setMap(mainMap.map);
        self.directionsDisplay.setPanel(document.getElementById('listroutewrap'));


        for (i in countries) {
            this.makeMarker(countries[i].coords, countries[i].name, "/Content/img/map/marker_null.png", "Label Country")
        }

        google.maps.event.addListener(self.map, 'idle', function () {

            if (self.isInit) return;
            self.isInit = true;
            google.maps.event.addListener(self.map, 'zoom_changed', function () {
                var zoomLevel = self.getMapLevel();

                $("#" + self.selector).removeClass('poi-country poi-city poi-street poi-house');
                switch (zoomLevel) {
                    case 1:
                        $("#" + self.selector).addClass('poi-country');
                        self.map.setOptions({ styles: mapStylesCountry });
                        self.layerCountries.setMap(self.map);
                        break;
                    case 2:
                        $("#" + self.selector).addClass('poi-city');
                        self.map.setOptions({ styles: mapStylesCity });
                        self.layerCountries.setMap(null);
                        break;
                    case 3:
                        $("#" + self.selector).addClass('poi-street');
                        self.map.setOptions({ styles: mapStylesStreet });
                        self.layerCountries.setMap(null);
                        break;
                    case 4:
                        $("#" + self.selector).addClass('poi-house');
                        self.map.setOptions({ styles: mapStylesHouse });
                        self.layerCountries.setMap(null);
                        break;
                }
                self.drawCitiesLayer(false);
            });
            google.maps.event.addListener(self.map, 'dragend', function (ev) {
                self.drawCitiesLayer(true);
            });

        });


        if (typeof callback == 'function') {

            callback(self);
        }
    }

    //добавляем маркер на карту
    this.makeMarker = function (position, title, icon, css) {
        var marker = new MarkerWithLabel({

            position: position,
            icon: icon || "/Content/img/map/marker_main.PNG",
            map: self.map,
            labelContent: title,
            labelAnchor: new google.maps.Point(20, 5),
            labelClass: css || "PointLabels", // the CSS class for the label
            labelInBackground: false
        });
        return marker;
    }

    //маштабируем карту или получаем маштаб
    this.mapZoom = function (action) {
        var zoom = self.map.getZoom();
        if (action != undefined) {
            switch (action) {
                case 'plus':
                    zoom++;
                    break;
                case 'minus':
                    zoom--;
                    break;
            }
            zoom = (zoom >= 21) ? 21 : (zoom <= 3 ? 3 : zoom);
            self.map.setZoom(zoom);
            //onMapZoomChanged();
        }
        return zoom;
    }

    //получаем уровень карты
    this.getMapLevel = function(){
        var zoom = self.mapZoom();
        return getMapLevel(zoom);
    }

    this.drawPoint = function (myLatlng, title) {
        self.points.push(this.makeMarker(myLatlng, title));
    }

    this.addHalfwayPoint = function (myLatlng, title) {
        this.points.push(this.makeMarker(myLatlng, title, "/Content/img/map/marker_point.PNG", 'HalfwayPoint'));
    }

    this.addSecondaryPoint = function (myLatlng, title) {
        this.points.push(this.makeMarker(myLatlng, title, "/Content/img/map/marker_subcity.PNG", 'SecondaryPoint'));
    }

    //удаляет точки маршрута
    this.ClearPoints = function () {
        for (var i = 0; i < self.markersArray.length; i++) {
            self.markersArray[i].setMap(null);
        }
        self.markersArray = [];
        self.points = [];
    }

    //добавляет точку маршрута
    this.AddPoint = function(point){
        this.points.push(point);
    }


    //отображает точки маршрута на карте
    this.RenderPoints = function () {

        if (this.points.length > 1) {
            var lastIndex = this.points.length - 1;

            for (var i = 0; i < this.points.length; i++) {
                var point = this.points[i];
                var position = new google.maps.LatLng(point.lat, point.lng);
                self.markersArray.push(self.makeMarker(position, point.name));
            }
        }
    }

    //отображает точки маршрута на карте
    this.RenderDirectionPoints = function (directionResult) {
        if (directionResult.routes[0] != undefined) {
            var points = self.points,
                pointIndex = 0;
            self.ClearPoints();

            for (var key in directionResult.routes[0].legs) {
                var leg = directionResult.routes[0].legs[key];
                var start_location = leg.start_location
                var end_location = leg.end_location
                if (key == 0) {
                    self.markersArray.push(self.makeMarker(start_location, "<b>" + (pointIndex+1) + ".</b> " + points[pointIndex].name));
                    pointIndex++;
                }
                self.markersArray.push(self.makeMarker(end_location, "<b>" + (pointIndex + 1) + ".</b> " + points[pointIndex].name));
                pointIndex++;
            }

            self.map.panBy(0, 1); //костыль для отображения треугольников маркеров
        } else {
            this.RenderPoints();
        }

    }


    //инициализирует запрос постраения маршрута
    this.initRoute = function(callback){

        if(this.points.length > 1){

            this.startPoint = this.points[0];
            this.endPoint = this.points[this.points.length - 1];
            this.waypoints = [];
            var wayps = [];
            for (var i = 1; i < (this.points.length - 1) ; i++) {
                this.waypoints.push(this.points[i]);
                wayps.push({location : new google.maps.LatLng(this.points[i].lat, this.points[i].lng), stopover: true});
            }
        }else{

        }

        this.request = {
            origin: new google.maps.LatLng(this.startPoint.lat, this.startPoint.lng),
            destination: new google.maps.LatLng(this.endPoint.lat, this.endPoint.lng),
            waypoints: wayps,
            provideRouteAlternatives: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        this.sendRequest(callback);
    }

    //отправляем запрос на построение маршрута
    this.sendRequest = function (callback) {
        this.directionsService.route(this.request, function (result, status) {
            //$("#directionsPanel").text("ИДЕТ ОБРАБОТКА... (" + Math.floor(kk * 100 / batches.length) + "%)");
            if (status == google.maps.DirectionsStatus.OK) {
                //if (!self.directionsDisplay) self.directionsDisplay = new google.maps.DirectionsRenderer(self.rendererOptions);
                self.directionsDisplay.setDirections(result);
                self.fitMapToDitection(result);

                if (typeof callback == 'function') {
                    callback(result)
                }
            }
        });
    }

    //подгоняет размер карты под маршрут
    this.fitMapToDitection = function (directionResult) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < self.points.length; i++) {
            var bound = new google.maps.LatLng(self.points[i].lat, self.points[i].lng);
            bounds.extend(bound);
        }
        self.map.fitBounds(bounds);

        if (self.map.getZoom() > 7) self.map.setZoom(7); //если уровень карты больше 1 устанавливаем 1

        self.RenderDirectionPoints(directionResult);
    }

    this.drawCitiesTimeout;
    this.directionSubjectsCities = 0;
    this.drawCitiesLayer = function (redraw, callback, timeout) {
        if (!timeout) {
            if (self.drawCitiesTimeout) { clearTimeout(self.drawCitiesTimeout); self.drawCitiesTimeout = null; }
            self.drawCitiesTimeout = setTimeout(function () { self.drawCitiesLayer(redraw,callback,true); }, 500);
            return;
        }
        self.drawCitiesTimeout = null;

        if (redraw == true && !countProperties(self.pointscities)) return;

        var bounds = self.map.getBounds();
        var ne = bounds.getNorthEast(); // LatLng of the north-east corner
        var sw = bounds.getSouthWest(); // LatLng of the south-west corder

        try {
            self.cityRequest.abort();
        } catch (e) { }

        self.cityRequest = $.ajax({
            url: "http://xn--c1ajabmjpm.xn--80asehdb/Home/GetCities",
            data: { 'zoom': self.map.getZoom(), 'bounds': JSON.stringify({x: ne.lat(), y:ne.lng(), x2: sw.lat(), y2: sw.lng()}) },
            type: "post",
            dataType: "json",
            success: function (data) {
                data = getCities;
                if (redraw == false) {
                    for (var i in self.pointscities) {
                        self.pointscities[i].setMap(null);
                    }
                    self.pointscities = new Object();
                }

                var distanceroute = 0;
                if (self.getMapLevel() == 1) distanceroute = 40;
                if (self.getMapLevel() == 2) distanceroute = 20;
                if (self.getMapLevel() == 3) distanceroute = 10;

                for (var city in data) {

                    var routeCity = 0;
                    var lat = 0;
                    var lng = 0;
                    var distanceFromStart = 0;

                    if (mainMap.RouteLegs) {
                        for (var i in mainMap.RouteLegs)
                        {
                            for (var j in mainMap.RouteLegs[i].steps) {

                                distanceFromStart += mainMap.RouteLegs[i].steps[j].distance.value;

                                lat = mainMap.RouteLegs[i].steps[j].start_location.lat();
                                lng = mainMap.RouteLegs[i].steps[j].start_location.lng();

                                var distance = getDistanceFromLatLon(
                                    data[city].Lat + 0,
                                    data[city].Lng + 0,
                                    lat,
                                    lng
                                );

                                if (distance < distanceroute) {
                                    var pathcount = mainMap.RouteLegs[i].steps[j].path.length;
                                    for (var h = 0; h < pathcount; h ++)
                                    {
                                        var lat_p = mainMap.RouteLegs[i].steps[j].path[h].lat();
                                        var lng_p = mainMap.RouteLegs[i].steps[j].path[h].lng();

                                        var distance_p = getDistanceFromLatLon(
                                            data[city].Lat + 0,
                                            data[city].Lng + 0,
                                            lat_p,
                                            lng_p
                                        );
                                        if (distance_p < distance) {
                                            lat = lat_p;
                                            lng = lng_p;
                                        }
                                    }

                                    routeCity = 1;
                                    break;
                                }
                            }
                            if (routeCity == 1) break;
                        }

                    }


                    var specialClass = "";
                    var icon = "/Content/img/map/marker_subcity.PNG";
                    if (data[city].IsCapital == true) icon = "/Content/img/map/marker_capital.PNG";
                    if (self.getMapLevel() > 1) icon = "/Content/img/map/marker_null.PNG";

                    if (data[city].IsCapital) {
                        specialClass = "Capital";
                    }
                    if (routeCity == 1) {
                        icon = "/Content/img/map/marker_point.PNG";
                        specialClass = "Route";
                        if (self.getMapLevel() <=2) {
                            data[city].Lat = lat;
                            data[city].Lng = lng;
                        }
                    }

                    //is main city?
                    if (!$('.mcontainer .point[data-name="' + data[city].Name + '"]').length) {
                        if (!self.pointscities[data[city].Lat + "," + data[city].Lng]) {
                            //check near cities for antialastycs
                            var noadd = false;
                            for (var key in self.pointscities) {
                                if(getDistanceFromLatLon(
                                    self.pointscities[key].getPosition().lat(),
                                    self.pointscities[key].getPosition().lng(),
                                    data[city].Lat,
                                    data[city].Lng) < /*CHECK*/distanceroute) {
                                    //position same
                                    if (data[city].People > self.pointscities[key].people) {
                                        self.pointscities[key].setMap(null);
                                        delete self.pointscities[key];
                                    }
                                    else {
                                        noadd = true;
                                    }
                                }
                            }
                            if (!noadd) {
                                var addText = "";
                                if (routeCity) {
                                    self.directionSubjectsCities++;
                                    if (getMapLevel(self.map.getZoom())==2) {
                                        addText = " <span>" + parseInt(distanceFromStart / 1000) + " км</span>";
                                    }
                                }
                                self.pointscities[data[city].Lat + "," + data[city].Lng] =
                                    new MarkerWithLabel({
                                        position: new google.maps.LatLng(data[city].Lat, data[city].Lng),
                                        icon: icon,
                                        map: self.map,
                                        labelContent: data[city].Name + addText,
                                        labelAnchor: new google.maps.Point(20, 5),
                                        labelClass: "cityLabel" + specialClass, // the CSS class for the label
                                        labelInBackground: true,
                                        raiseOnDrag: false,
                                        people: data[city].People/*,
                                    handCursor: "default"*/
                                    });
                            }
                        }

                    }

                }

                if (typeof callback == "function") callback();

            }
        });

    }

    this.pointscities = new Object();


}

/*-----------------------------------------------------------------------------------------*/
var mainMap = new MapProcessor('map');
var mainPlaces = null; //инициализируем после инициализации карты
var mainMileage = null; //круг пробега
mainMap.setStyle(mapStylesCountry);


//инициализируем карту
google.maps.event.addDomListener(window, 'load',  mainMap.init(
    function () {


        $('.mapwrapper')
            .on('click', '.plus', function (e) {
                e.preventDefault();
                var zoom = mainMap.mapZoom('plus');
                if (zoom < 21) {
                    $('.mapwrapper .plus').removeClass('disabled');
                } else {
                    $('.mapwrapper .plus').addClass('disabled');
                }
                if (zoom > 0) {
                    $('.mapwrapper .minus').removeClass('disabled');
                } else {
                    $('.mapwrapper .minus').addClass('disabled');
                }

            })
            .on('click', '.minus', function (e) {
                e.preventDefault();
                var zoom = mainMap.mapZoom('minus');
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
                }, 500, function () {
                    // Animation complete.
                });
            })
            .on('click', '.close-history', function (e) {
                e.preventDefault();
                $("#history").stop().animate({
                    left: "-395px"
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

        mainPlaces = new PlacesProcessor(mainMap.map);
        //строим маршрут по умолчанию
        initMapRoute();
    })

);



function initMapRoute(){
    var points = $('.mcontainer').find('.point');
    mainMap.ClearPoints();
    try{
        mainPlaces.ClearPoints();
    }catch(e){}

    points.each(function () {
        if ($(this).data('id') != undefined) {
            var point = { id: $(this).data('id'), name: $(this).data('name'), lat: $(this).data('lat'), lng: $(this).data('lng') };
            mainMap.AddPoint(point);
        }

    });

    mainMap.initRoute(function (result) {
        //TODO: тут должны обрабатываться результаты
        //console.log(result);

        if (result.routes[0] != undefined) {

            var results = result.routes[0].legs;
            mainMap.RouteLegs = results;

            var zoomLevel = mainMap.getMapLevel();

            var distance = 0;
            var duration = 0;
            var citycounts = results.length+1;
            var subjcounts = 0;

            for (var i = 0; i < results.length ; i++) {
                distance += results[i].distance.value;
                duration += results[i].duration.value;

            }

            var km = Math.round(distance / 1000);
            $('#route-distance').text(number_format(km, 0, ',', ' ') + " км");
            var duration_minutes = duration / 60;
            var dhours = Math.floor(duration_minutes / 60);
            var dminutes = Math.round(duration_minutes % 60);

            var sdays = (Math.ceil(((duration_minutes / 60) / 12).toFixed(1) * 2) / 2);
            $('#route-duration').html(((dhours > 0) ? dhours + " ч " : "") + dminutes + " мин <span>(" + sdays.toString().replace(".", ",") + " световых " + transformWord(Math.round(sdays), "дней", "день", "дня") + ")</span>");
            $("#route-speed").html(Math.round(km / dhours) + " км/час <span>(средняя скорость)</span>");
            /*$("#route-subjects").html((citycounts + (self.directionSubjectsCities+0)), transformWord(citycounts, " населённых пунктов", " населённый пункт", " населённых пункта"));
            */
            //$("#route-probeg span").html(Math.round(km / sdays) + " км / день");

            //отображение ключевых точек перенесено в отображение маршрута функция RenderDirectionPoints

            mainMap.drawCitiesLayer(false, function () {
                mainPlaces.RenderPlaces(results);
                //citycounts += (mainMap.directionSubjectsCities ? mainMap.directionSubjectsCities : 0);
                $("#route-subjects").html(citycounts+" "+transformWord(citycounts, " населённых пунктов", " населённый пункт", " населённых пункта")/* <span>(" + results.length + " субъектов)</span>"*/);
            });

            //mainMap.showCircle();
        }


    });


}

function getCityByCoords(latlng) {
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //find country name
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {
                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            //this is the object you are looking for
                            city = results[0].address_components[i];
                            break;
                        }
                    }
                }
                //city data
                return city.long_name;

            } else {
                return null;
            }
        } else {
            return null;
        }
    });

}

function countProperties(obj) {
    var count = 0;

    for (var prop in obj) {
        if (obj.hasOwnProperty(prop))
            ++count;
    }

    return count;
}

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getMapLevel(zoom){
    if (zoom <= 7) return 1; //страна
    if (zoom > 7 && zoom < 12) return 2; //город
    if (zoom >= 12 && zoom < 16) return 3; //улица
    return 4; //дом
}


function onMapZoomChanged() {
    var objects = $('footer').find('.object');

    objects.each(function () {
        var $this = $(this),
            isActive = $this.hasClass("active"),
               type = $this.data("type");

        if (isActive) {
            //turn off
            $(".clmarker." + type).hide();
            mainPlaces.hideMarkers(type);
        }
        else {
            //turn on
            $(".clmarker." + type).show();
            mainPlaces.showMarkers(type);
        }
    });
}