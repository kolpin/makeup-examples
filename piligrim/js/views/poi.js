var place_type_group = {
    'gas_station': 'gas_station',
    'lodging': 'lodging',
    'food': 'food',
    'cafe': 'food',
    'atm': 'atm',
    'grocery_or_supermarket': 'market',
    'garden': 'poi',
    'bank': 'bank',
    'bar': 'food',
    'art_gallery': 'poi',
    'museum': 'poi',
    'park': 'poi',
    'zoo': 'poi'
}

function PlacesProcessor(map) {
    this.map = map;
    var self = this;
    var icon = '/Content/img/map/marker_main.PNG';
    var css = "placeLabel";
    this.places_type = ['gas_station', 'lodging', 'food', 'cafe', 'atm', 'grocery_or_supermarket', 'garden', 'bank', 'bar', 'art_gallery', 'museum', 'park', 'zoo'];

    this.poicache = new Object();

    this.markers_gas_station = [];
    this.markers_lodging = [];
    this.markers_food = [];
    this.markers_atm = [];
    this.markers_market = [];
    this.markers_bank = [];
    this.markers_poi = [];
    this.markers_all = [];

    this.mc_all //marker cluster 

    this.service = new google.maps.places.PlacesService(this.map);

    this.searchPlaces = function (location) {

        var request = {
            location: location,
            radius: '5000',
            types: self.places_type
            //rankBy: google.maps.places.RankBy.DISTANCE
        };

        self.service.search(request, self.callback);
    }

    this.callback = function (results) {
        for (var i = 0; i < results.length; i++) {
            var place = results[i];
            if (!(place.PlaceId in self.poicache)) {
                self.createMarker(place);
                self.poicache[place.PlaceId] = place;
            }
            
        }

        self.mc_all.addMarkers(self.markers_all);
        self.setPOICounts();
    }

    this.getMarkerType = function (types) {
        for (var i = 0; i < types.length; i++) {
            if (place_type_group[types[i]] !== undefined) {
                return place_type_group[types[i]];
            }
        }
        return 'poi';
    }

    this.createMarker = function (place) {
        var lat = place.Lat;
        var lng = place.Lng;
        var name = place.Name;
        var types = place.Types;
        var icon = "";               
        var type = self.getMarkerType(types);

        var marker = new MarkerWithLabel({
            position: new google.maps.LatLng(lat,lng),
            icon: icon,
            labelContent: '',
            labelAnchor: new google.maps.Point(20, 5),
            labelClass: (css + " " + type) || "PointLabels " + type, // the CSS class for the label
            labelInBackground: false
        });

      

        marker.Reference = place.Reference;
        marker.address = place.Address;
        marker.type = type;
        marker.name = name;
        marker.pnum = place.Id;

        switch (type) {
            case 'gas_station':
                marker.icon = "/Content/img/map/poi/gas_station.png";
                break;
            case 'lodging':
                marker.icon = "/Content/img/map/poi/lodging.png";
                break;
            case 'food':
                marker.icon = "/Content/img/map/poi/cafe.png";
                break;
            case 'atm':
                marker.icon = "/Content/img/map/poi/atm.png";
                break;
            case 'bank':
                marker.icon = "/Content/img/map/poi/bank.png";
                break;
            case 'market':
                marker.icon = "/Content/img/map/poi/market.png";
                break;
            default:
                marker.icon = "/Content/img/map/poi/garden.png";
                marker.type = "poi";
                break;
        }


        self.markers_all.push(marker);
        
        var iw = new google.maps.InfoWindow({
            content: name
        });
        google.maps.event.addListener(marker, "mouseover", function (e) { iw.open(map, this); });
        google.maps.event.addListener(marker, "mouseout", function (e) { iw.close(); });

        google.maps.event.addListener(marker, "click", function (e) {
            self.GetPlaceInfo(marker.Reference, marker.type, marker.pnum);
        });
    }


    this.GetPlaceInfo = function (reference, type, pnum) {
        $.ajax({
            url: "/Home/GetPOIDetails",
            data: { 'reference': reference, 'type': type, 'pnum': pnum },
            type: "post",
            dataType: "html",
            success: function (data) {
                $('#overlay').html(data).show();
            }
        });
    }

    this.onClustersRedraw = function () {        
        var zoom = self.map.getZoom();
        var level = getMapLevel(zoom);

/*
        if (level == 1) {
            $(".clusterwrap").hide();
        }
        */

    }

    this.RenderPlaces = function (markers) {
        self.ClearPlaces();
        self.poicache = {};
        var mcOptions = { gridSize: 50, maxZoom: 15, zoomOnClick: false };
        self.mc_all = new MarkerClusterer(self.map, [], mcOptions, self.onClustersRedraw);

        var points = [];
        for (var i in markers)
        {
            points.push({ Lat: markers[i].start_location.lat(), Lng: markers[i].start_location.lng() });
            for (var j in markers[i].steps)
            {
                var pathcount = markers[i].steps[j].path.length;
                for (var h = 0; h < pathcount; h += (1 + (pathcount/40)))//х POINTS PER PATH
                {
                    if (markers[i].steps[j].path[h]) {
                        points.push({ Lat: markers[i].steps[j].path[h].lat(), Lng: markers[i].steps[j].path[h].lng() });
                    }
                }
            }
        }

        $.ajax({
            url: "/Home/GetPOI",
            data: { 'route': JSON.stringify(points) },
            type: "post",
            dataType: "json",
            success: function (data) {
                self.callback(data);
            }
        });
    }


    //удаляет точки маршрута
    this.ClearPlaces = function () {
        self.markers_all = [];

        if (self.mc_all) {
            self.mc_all.clearMarkers();            
        }

    }

    this.setPOICounts = function () {
        var gas_station_length = 0;
        var lodging_length = 0;
        var food_length = 0;
        var atm_length = 0;
        var market_length = 0;
        var bank_length = 0;
        var poi_length = 0;

        for (var i = 0; i < self.markers_all.length; i++) {
            if (self.markers_all[i].type == "gas_station") gas_station_length++;
            if (self.markers_all[i].type == "lodging") lodging_length++;
            if (self.markers_all[i].type == "food") food_length++;
            if (self.markers_all[i].type == "atm") atm_length++;
            if (self.markers_all[i].type == "market") market_length++;
            if (self.markers_all[i].type == "bank") bank_length++;
            if (self.markers_all[i].type == "poi") poi_length++;
        }

        var objFuel = $(".object.fuel");
        objFuel.children('span').text(gas_station_length);
        if (gas_station_length > 0)  objFuel.addClass('active').removeClass('empty');
        else objFuel.removeClass('active').addClass('empty');

        var objShower = $(".object.shower");
        objShower.children('span').text(lodging_length);
        if (lodging_length > 0) objShower.addClass('active').removeClass('empty');
        else objShower.removeClass('active').addClass('empty');

        var objCoffe = $(".object.coffee");
        objCoffe.children('span').text(food_length);
        if (food_length > 0) objCoffe.addClass('active').removeClass('empty');
        else objCoffe.removeClass('active').addClass('empty');

        var objPit = $(".object.pit");
        objPit.children('span').text(atm_length);
        if (atm_length > 0) objPit.addClass('active').removeClass('empty');
        else objPit.removeClass('active').addClass('empty');

        var objDrink = $(".object.drink");
        objDrink.children('span').text(market_length);
        if (market_length > 0) objDrink.addClass('active').removeClass('empty');
        else objDrink.removeClass('active').addClass('empty');

        var objCard = $(".object.card");
        objCard.children('span').text(bank_length);
        if (bank_length > 0) objCard.addClass('active').removeClass('empty');
        else objCard.removeClass('active').addClass('empty');

        var objPhoto = $(".object.photo");
        objPhoto.children('span').text(poi_length);
        if (poi_length > 0) objPhoto.addClass('active');
        else objPhoto.removeClass('active').addClass('empty');
    }
     
    //скрывает маркеры определенного типа
    this.hideMarkers = function (type) {
        for (var i in self.markers_all) {
            var marker = self.markers_all[i];
            if (marker.type == type) {
                marker.setVisible(false);
            }
        }
    }

    //отображает маркеры определенного типа
    this.showMarkers = function (type) {
        for (var i in self.markers_all) {
            var marker = self.markers_all[i];
            if (marker.type == type) {
                marker.setVisible(true);
            }
        }
    }


    this.getClusterMaxIndex = function(){
        var maxIndex = 0;
        try{
            maxIndex = this.mc_all.getTotalClusters() - 1;
        }catch(e){}
        return maxIndex;
    }
}

function getClusterInfo(markers, cluster) {
    var references = [];
    for(var i = 0; i < markers.length; i++)
    {
        references.push({'name': markers[i].name, 'reference': markers[i].Reference, 'type': markers[i].type, 'address': markers[i].address, 'pnum': markers[i].pnum });

    }
    $.ajax({
        url: "/Home/GetCluster",
        data: { 'references': JSON.stringify(references), 'cluserIndex': cluster.cindex_, 'maxIndex': mainPlaces.getClusterMaxIndex() },
        type: "post",
        dataType: "html",
        success: function (data) {
            var overlay = $('#overlay');
            overlay.html(data);
            overlay.find('.mscroll').height($('#main').height() - 125);
            $('.mscroll', overlay).mCustomScrollbar({
                scrollInertia: 100
            });

            overlay.show();
            resizeOverlayPopup();
        }
    });
}

function resizeOverlayPopup() {
    var overlay = $('#overlay'),
            window = $(window),
            popup = overlay.find('.popup');
    popup.css('top', ($('#header').height() + 6) + "px");
    overlay.find('.mscroll').height($('#main').height() - ($(window).width() < 767 ? 100 : 115));
    if (overlay.width() < 690) {
        var pWidth = overlay.width() - 10;
        popup.width(pWidth).css('margin-left', (-pWidth / 2) + "px");
    } else {
        popup.width(684).css('margin-left', "-342px");
    }
}


$(function () {
    $(window).resize(function () {
        resizeOverlayPopup();
    });

    $('#overlay')
        .on('click', '.close', function (e) {
            e.preventDefault();
            var overlay = $('#overlay');
            overlay.fadeOut(function () {
                overlay.find('.popup').css('display', 'none');
            });
        })
        .on('click', '.back', function (e) {
            e.preventDefault();
            var overlay = $('#overlay');
            overlay.children('#point-feature').remove();
            overlay.children('#popup-points, .next-cluster, .prev-cluster').show();
            resizeOverlayPopup();
        })
        .on('click', '[data-reference]', function (e) {
            e.preventDefault();
            var link = $(e.currentTarget).addClass('visited'),
                reference = link.data('reference'),
                type = link.data('type'),
                pnum = link.data('pnum');

            $.ajax({
                url: "/Home/GetPOIDetails",
                data: { 'reference': reference, 'type': type, 'pnum': pnum, 'back': true },
                type: "post",
                dataType: "html",
                success: function (data) {
                    var overlay = $('#overlay');
                    overlay.children('#popup-points, .next-cluster, .prev-cluster').hide();

                    overlay.append(data);
                    $('.mscroll', overlay).mCustomScrollbar({
                        scrollInertia: 100
                    });
                    resizeOverlayPopup();
                }
            });
        })
        .on('click', '.next-cluster, .prev-cluster', function (e) {
            e.preventDefault();
            var index = $(e.currentTarget).data('index'),
                cluster = mainPlaces.mc_all.clusters_[index];
            $('#popup-points .mscroll').html('<div class="loader"></div>');
            getClusterInfo(cluster.markers_, cluster);
            //console.log(cluster);
        });
});