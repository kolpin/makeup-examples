function PlacesProcessor(map) {
    this.map = map;
    var self = this;
    var icon = '/Content/img/map/marker_main.PNG';
    var css = "placeLabel";
    this.places_type = ['gas_station', 'lodging', 'food', 'cafe', 'atm', 'grocery_or_supermarket', 'garden', 'bank', 'bar', 'art_gallery', 'museum', 'park', 'zoo'];

    this.markers_gas_station = [];
    this.markers_lodging = [];
    this.markers_food = [];
    this.markers_atm = [];
    this.markers_market = [];
    this.markers_bank = [];
    this.markers_poi = [];
    this.markers_all = [];

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

    this.callback = function (results, status) {
        
        if (status == google.maps.places.PlacesServiceStatus.OK) {           
          
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                self.createMarker(results[i]);
            }            

            self.mc_all.addMarkers(self.markers_all);
            self.setPOICounts();
        }
    }

    this.createMarker = function (place) {
        var position = place.geometry.location;
        var name = place.name;
        var icon = "";               

        var marker = new MarkerWithLabel({
            position: position,
            icon: icon,
            labelContent: '',
            labelAnchor: new google.maps.Point(20, 5),
            labelClass: css || "PointLabels", // the CSS class for the label
            labelInBackground: false
        });

        if ($.inArray('gas_station', place.types)!=-1) {
            marker.icon = "/Content/img/map/poi/gas_station.png";
            marker.type = "gas_station";
        }
        else if ($.inArray('lodging', place.types) != -1) {
            marker.icon = "/Content/img/map/poi/lodging.png";
            marker.type = "lodging";
        }
        else if ($.inArray('food', place.types) != -1 || $.inArray('cafe', place.types) != -1) {
            marker.icon = "/Content/img/map/poi/cafe.png";
            marker.type = "food";
        }
        else if ($.inArray('atm', place.types) != -1) {
            marker.icon = "/Content/img/map/poi/atm.png";
            marker.type = "atm";
        }
        else if ($.inArray('bank', place.types) != -1) {
            marker.icon = "/Content/img/map/poi/bank.png";
            marker.type = "bank";
        }
        else if ($.inArray('grocery_or_supermarket', place.types) != -1) {
            marker.icon = "/Content/img/map/poi/grocery_or_supermarket.png";
            marker.type = "market";
        }
        else {
            marker.icon = "/Content/img/map/poi/garden.png";
            marker.type = "poi";
        }


        self.markers_all.push(marker);
        
        var iw = new google.maps.InfoWindow({
            content: name
        });
        google.maps.event.addListener(marker, "click", function (e) { iw.open(map, this); });
        
    }

    this.RenderPlaces = function (markers) {
        self.ClearPlaces();

        var mcOptions = { gridSize: 50, maxZoom: 15 };
        self.mc_all = new MarkerClusterer(self.map, [], mcOptions);

        for (var i = 0; i < markers.length; i++) {
            var marker = markers[i];
            //console.log(marker.getPosition());
            self.searchPlaces(marker.getPosition());
        }
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

        $(".object.fuel span").text(gas_station_length);
        $(".object.shower span").text(lodging_length);
        $(".object.coffee span").text(food_length);
        $(".object.pit span").text(atm_length);
        $(".object.drink span").text(market_length);
        $(".object.card span").text(bank_length);
        $(".object.photo span").text(poi_length);
    }
     
    

}