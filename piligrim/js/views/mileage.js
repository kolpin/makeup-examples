function Mileage(map) {
    var self = this;
    this.map = map;
    this.circle = null;
    this.dragCircle = null;
    this.marker = null;



    this.createCircle = function (radius) {

        var options = {
            strokeColor: "#c1c0bc",
            strokeOpacity: 0.7,
            strokeWeight: 1,
            strokePosition: google.maps.StrokePosition.INSIDE,
            fillColor: "#c1c0bc",
            fillOpacity: 0.1,
            map: self.map,
            draggable: true,
            clickable: true,
            zIndex: 999,
            center: self.map.getCenter(),
            radius: radius,
            visible: false
        }
        self.circle = new google.maps.Circle(options);
        var dragOptions = {
            strokeColor: "#FF0000",
            strokeOpacity: 0,
            strokeWeight:5,
            strokePosition: google.maps.StrokePosition.OUTSIDE,
            fillColor: "#c1c0bc",
            fillOpacity: 0.1,
            map: self.map,
            zIndex: 1000,
            draggable: true,
            clickable: true,
            zIndex: 1,
            center: self.map.getCenter(),
            radius: radius,
            visible: false
        }
        self.dragCircle = new google.maps.Circle(dragOptions);

        self.marker = new google.maps.Marker({
            position: self.map.getCenter(),
            map: self.map,
            clickable: false,
            icon: {
                url: "/Content/img/map/mapdrag.png",
                anchor: {x:13, y:13}
                }, 
            visible: false
        });

        google.maps.event.addListener(self.circle, 'mouseover', function (e) {
            //console.log('notdrag');
            self.circle.setDraggable(false);
            self.dragCircle.setDraggable(false);
            self.marker.setVisible(false);
            self.map.setOptions({ draggingCursor: 'default' });
        });
        google.maps.event.addListener(self.dragCircle, 'mousemove', function (e) {
            //console.log('drag');
            self.circle.setDraggable(true);
            self.dragCircle.setDraggable(true);
            self.marker.setPosition(e.latLng);
            self.marker.setVisible(true);
            self.map.setOptions({ draggingCursor: 'auto' });
        });
        google.maps.event.addListener(self.dragCircle, 'mouseout', function (e) {
            self.marker.setVisible(false);
        });
        google.maps.event.addListener(self.dragCircle, 'drag', function (e) {
            self.marker.setVisible(true);
            self.circle.setCenter(self.dragCircle.getCenter());
        });
        google.maps.event.addListener(self.dragCircle, 'mousedown', function (e) {
            self.marker.setVisible(true);
        });
        google.maps.event.addListener(self.map, 'mousemove', function (e) {
            self.marker.setPosition(e.latLng);
        });


    }

    this.destroy = function(){
        try {
            self.circle.setMap(null);
            self.dragCircle.setMap(null);
        } catch (e) { }
        self.circle = null;
        self.dragCircle = null;
    }

    this.getCircleRadius = function () {
        var distance = parseInt($('#distance').val().replace(' ', ''));
        if (isNaN(distance)) distance = 0;
        return (distance * 1000) / 2;
    }

    this.setRadius = function (radius) {
        self.circle.setRadius(radius);
        self.dragCircle.setRadius(radius);
    }

    this.updateDistance = function () {
        var radius = self.getCircleRadius();
        if (radius == 0) {
            self.destroy();
        } else {
            if (self.circle == null) {
                self.createCircle(radius);
            } else {
                self.setRadius(radius);
            }
            self.show();
        }
    }

    this.show = function () {
        self.circle.setVisible(true);
        self.dragCircle.setVisible(true);
    }

    this.hide = function () {
        self.circle.setVisible(false);
        self.dragCircle.setVisible(false);
    }
}

$(function () {

    $('#distance')
        .keydown(function (e) {
            // Allow: backspace, delete, tab, escape, enter and .
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 116, 190]) !== -1 ||
                // Allow: Ctrl+A
                (e.keyCode == 65 && e.ctrlKey === true) ||
                // Allow: home, end, left, right
                (e.keyCode >= 35 && e.keyCode <= 39)) {
                // let it happen, don't do anything
                return;
            }
            if ($(this).val().length >= 5) e.preventDefault();
            // Ensure that it is a number and stop the keypress
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        })
        .on('change keyup', function () {
            var value = parseInt($(this).val().replace(' ', ''));

            if (!isNaN(value)) {
                if (value > 1000) value = 1000;
                else if (value < 0) value = 0;
                $(this).val(number_format(value, 0, '', ' '));
            } else {
                $(this).val(0);
            }
            $(this).width($(this).val().length * 5 + 10);
        })
        .on('focus', function () { $(this).parent().addClass('focus'); })
        .on('blur', function () { $(this).parent().removeClass('focus'); $("#distance-slider").slider('value', $(this).val()) })
        .trigger('keyup');

    $("#distance-slider").slider({
        min: 0,
        max: 1000,
        step: 10,
        value: parseInt($('#distance').val().replace(" ", "")),
        slide: function (event, ui) {
            $('#distance').val(number_format(ui.value, 0, '', ' ')).trigger('keyup');
        }
    });

    $("#route-probeg").on('click', function (e) {
        e.preventDefault();
        $('#mileage').toggle();
    });

    $(document).on('click', '*', function (e) {
        var target = $(e.target);
        //console.log(target.parent('#route-probeg'));
        if (target.parents('#mileage').size() == 0 && target.parent('#route-probeg').size() == 0) {
            if ($('#mileage').is(':visible')) {
                $('#mileage').hide();
                var distance = $('#distance').val();
                if (parseInt(distance) > 0) {
                    $('#route-probeg span').text(distance + ' км / день');
                } else {
                    $('#route-probeg span').text('установить');
                }
                if (mainMileage == null) {
                    mainMileage = new Mileage(mainMap.map);
                }
                mainMileage.updateDistance();

            }

        }
    });
});