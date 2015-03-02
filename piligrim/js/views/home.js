
var cache = [
         { label: "Салават", value: "Салават", country: "РОС", distance: "2 446 км" },
         { label: "Самара", value: "Самара", country: "РОС", distance: "3 446 км" },
         { label: "Санкт-Петербург", value: "Санкт-Петербург", country: "РОС", distance: "446 км" },
         { label: "Саранск", value: "Саранск", country: "РОС", distance: "3 446 км" },
         { label: "Саратов", value: "Саратов", country: "РОС", distance: "3 446 км" },
         { label: "Севастополь", value: "Севастополь", country: "УКР", distance: "346 км" },
         { label: "Северодвинск", value: "Северодвинск", country: "УКР", distance: "1 446 км" },
         { label: "Северодонецк", value: "Северодонецк", country: "УКР", distance: "3 446 км" },
         { label: "Сумы", value: "Сумы", country: "УКР", distance: "3 446 км" },
         { label: "Солигорск", value: "Солигорск", country: "РОС", distance: "3 446 км" },
         { label: "Сочи", value: "Сочи", country: "РОС", distance: "3 446 км" },
         { label: "Москва", value: "Москва", country: "РОС", distance: "3 446 км" },
         { label: "Киев", value: "Киев", country: "УКР", distance: "3 446 км" }
]

var sortstart = false;




$(function () {
    var titleShowTimeout = null;

    resizeMapWrap();

    $('.selector').on('click', 'a', function (e) {
        e.preventDefault();
        /*$('.selector').find('li').removeClass('active');
        $(this).parent().addClass('active');*///FIXME
    });

    $('.mcontainer').sortable({
        items: "li:not(.last)",
        axis: "x",
        handle: '.toggle',
        containment: "header.row",
        start: function (event, ui) {
            $('.item-toggle').hide();
            sortstart = true;
        },
        stop: function (event, ui) {
            $('.item-toggle').hide();
            sortstart = false;
        },
        update: function (event, ui) {
            $('.item-toggle').hide();
            recalcPointsNumbers();
            initMapRoute();
        }
    });
    $('.mcontainer').disableSelection();

    $('.mcontainer')
        .on('click', '.toggle', function (e) {
            e.preventDefault();
            if ($(this).parent().hasClass('disabled')) return;

            var toggle = $(this).next('.item-toggle'),
                isVisible = toggle.is(":visible"),
                search = toggle.find('.ssity'),
                last = $(this).parent();

            //if ($(this).parent().hasClass('last')) {
            //    //addPointTop();
            //} else {
                $('.item-toggle').hide();
                if (isVisible) {
                    toggle.hide().find('.mCSB_container').html('');
                } else {
                    toggle.show().find('.mCSB_container').html('');
                    search.trigger('keyup');
                    setTogglePosition(toggle);
                }
            //}

            //Hide remove button if 2 city
            if ($(".mcontainer li").length - 1 == 2) $(".remove").parent(".last-hidden").hide();
            else $(".remove").parent(".last-hidden").show();
            $(".mcontainer li.last").find('.last-hidden').hide();
        })
        .on('click', '.remove', function (e) {
            e.preventDefault();
            $(this).parents('li').eq(0).remove();
            recalcPointsNumbers();
        });

    $(document)
        .on('keyup', '.ssity', function (e) {
            getCitySource(e);
        })
        .on('click', '.item-toggle a', function (e) {
            e.preventDefault();
            var link = $(e.currentTarget),
                container = link.parents('li').eq(0);

            if (container.hasClass('last')) {
                addPoint(container, link);
                return;
            }
            var toggleLink = container.find('.toggle'),
                label = link.children('.title').text(),
                pointId = link.data('id'),
                pointLat = link.data('lat'),
                pointLng = link.data('lng'),
                pointName = link.data('name');

            toggleLink.children('span').removeClass('noborder').text(label).attr('title', pointName);;
            toggleLink.data('id', pointId).attr('data-id', pointId);
            toggleLink.data('name', pointName).attr('data-name', pointName);
            toggleLink.data('lat', pointLat).attr('data-lat', pointLat);
            toggleLink.data('lng', pointLng).attr('data-lng', pointLng);

            container.find('.item-toggle').hide().find('.mCSB_container').html('');
            recalcPointsNumbers();
            initMapRoute();
        })
        .on('mouseover', '.point', function (e) { //показывает подсказку для точки
            var link = $(e.currentTarget),
                title = link.children('span').text(),
                container = link.parent();
            if (container.hasClass('last')) return;
            titleShowTimeout = setTimeout(function () {
                container.append('<span class="otitle">' + title + '</span>');
            }, 1000);

        })
        .on('mouseout', '.point', function (e) { //скрывает подсказку для точки
            clearTimeout(titleShowTimeout);
            var link = $(e.currentTarget),
               container = link.parent();
            container.children('.otitle').remove();
        })
        .on('click', '.route-toggle', function (e) {
            e.preventDefault();
            $("#route-selector").stop(false, true).fadeToggle();
            initRSIscroll();
        })
        .on('click', '*', function (e) { //скрывает оверлей с поиском города
            var target = $(e.target);
            
            if (!target.parents('.item-toggle').size() && !target.hasClass('toggle') && !target.parents('.toggle').size()) {
                $('.item-toggle').hide();
            }
        });


    $(window).resize(function () {
        resizeMapWrap();
        recalcPointsNumbers();
        resizeScroll();
        initRSIscroll();
    });

    initRSIscroll();
    resizeScroll();


    $('.rs-item').on('touchmove', function (e) {
        console.log(e);
    });

    $('.fancybox').fancybox();

    $("footer")
        .on('click', '.object', function (e) {
            e.preventDefault();
            var $this = $(this);
            if ($this.hasClass('empty')) return false;

            var isActive = $this.hasClass("active"),
                type = $this.data("type");

            $this.toggleClass("active");

            if (isActive) {
                //turn off
                $(".clmarker." + type).addClass('hide');
                mainPlaces.hideMarkers(type);
            }
            else {
                //turn on
                $(".clmarker." + type).removeClass('hide');
                mainPlaces.showMarkers(type);
            }
        })
        .on('mouseover', '.object', function () {
            var title = $(this).children('.otitle');
            titleShowTimeout = setTimeout(function () {
                title.show();
            }, 1000);
        })
        .on('mouseout', '.object', function () {
            var title = $(this).children('.otitle');
            clearTimeout(titleShowTimeout);
            title.hide();
        });

    

});


var rswrapper = null;
function initRSIscroll() {
    var ulwidth = (($('#rs-wrapper').find('li').length * 367) - 250);

    $('#rs-wrapper ul').width(ulwidth);

    if (rswrapper == null) {
        rswrapper = new IScroll('#rs-wrapper', {
            mouseWheel: true,
            scrollbars: false,
            scrollX: true,
            scrollY: true,
            bounceTime: 300,
            preventDefault: false,
            shap: ($(window).width() <= 325 ? true : false),
            
        });
    } else {
        rswrapper.refresh();
    }
    rswrapper.on('onScroll', function () {
        console.log(this);
    });
    
}

function resizeScroll() {
    $('.scroll')
        .height(($('#history').height() - 36))
        .mCustomScrollbar({
            scrollInertia: 100
        });

    
}

function resizeMapWrap() {
    var height = $(window).height() - ($("#header").height() + $("#footer").height()) - 1;
    $("#map").height(height);

}

function setTogglePosition(object) {
    //object.css({ "left": "0" }).show();
    var windowWidth = $(window).width(),
        objectWidth = object.width(),
        offset = object.offset().left,
        input = object.find('input');

    if ((objectWidth + offset + 5) > windowWidth) {
        var left = windowWidth - (objectWidth + offset + 12);
        object.css({ "left": left + "px" });
    } else {
        object.css({ "left": "0" });
    }
    input.focus();
    input.get(0).selectionStart = input.val().length;
}


var termCityAjax = null, termCityTimeout = null;
function getCitySource(e) {
    var input = $(e.currentTarget),
                term = input.val(),
                container = input.parents('li').eq(0),
                iToggle = container.find('.item-toggle'),
                appendTo = container.find('.append'),
                toggleLink = container.find('.toggle'),
                currentCity = toggleLink.data('id'),
                html = "";

    //Определяем ближайший город для просчета расстояния
    var nearcity = container.prev("li");
    if (!nearcity.length) nearcity = container.next("li");
    nearcity = $("a", nearcity).data("id");
    //определяем первую точку
    var firstcity = $('.mcontainer .point').filter(':first').data("id");

    //определяем другие выбранные точки
    var selected = [];
    $('.mcontainer .point').not(toggleLink).each(function () {
        selected.push($(this).data("id"));
    });

    var cities = [];
    try{
        termCityAjax.abort();
        clearTimeout(termCityTimeout);
    } catch (e) { }

    termCityTimeout = setTimeout(function () {

        var lastCityId = nearcity;
        termCityAjax = $.ajax({
            url: "/Home/CityAutocomplete",
            data: { 'term': term, 'lastCityId': lastCityId },
            type: "post",
            dataType: "json",
            acync: false,
            success: function (data) {

                //{ label: "Саратов", value: "Саратов", country: "РОС", distance: "3 446 км" }

                if (data.length > 0) {
                    for (var key in data) {
                        var item = data[key];
                        if ($.inArray(item.Id, selected) == -1) {
                            var distance = item.Distance;
                            if (distance == -1 || item.Id == firstcity) distance = "&nbsp;";

                            var active = (item.Id == currentCity) ? 'class="active"' : '';
                            html += '<a href="#" data-id="' + item.Id + '" data-lat="' + item.Lat + '" data-lng="' + item.Lng + '" data-name="' + item.Name + '" ' + active + '><span class="title">' + item.Name + '</span> <span class="distance">' + distance + '</span><span class="country">' + item.CountryShort + '</span></a>';
                        }
                      
                    }
                }
                if (appendTo.find('.mCSB_container').size()) {
                    var appendC = appendTo.find('.mCSB_container').eq(0);
                    appendC.children().remove();
                    appendC.html(html);
                } else {
                    appendTo.children().remove();
                    appendTo
                   .html(html).mCustomScrollbar({
                       scrollInertia: 50,
                       axis: "y",
                       advanced: { updateOnContentResize: true },
                       callbacks: {
                           onOverflowYNone: function () {
                               iToggle.width(265);
                               setTogglePosition(iToggle.removeClass('float-size'));
                           },
                           onOverflowY: function () {
                               iToggle.width(306);
                               setTogglePosition(iToggle.removeClass('float-size'));
                           }
                       }


                   });

                }


               
            }
        });
    }, 300);


    

   
}

//Вычисляем ширину и номера точек 
function recalcPointsNumbers() {
    var container = $('.mcontainer'),
        cWidth = container.width(),
        items = container.children(":not(.last)"),
        iWidth = (((cWidth - 50) / items.length) - 26).toFixed(4);
    number = 1;

    items.each(function () {
        var $this = $(this),
            $toggle = $this.find('.toggle');

        if ($this.css('width', 'auto').width() > iWidth) {
            $this.width((iWidth < 85 ? 50 : iWidth));
        } else {
            $this.css('width', 'auto');
        }
        $toggle.find('i').text(number);
        number++;
    });

    if (items.size() < 5) {
        container.children('.last').removeClass('disabled');
    } else {
        container.children('.last').addClass('disabled');
    }
}

//добавляем точку
function addPointTop() {
    var container = $('.mcontainer'),
        last = container.children('.last'),
        item = last.clone();
    item.removeClass('last').find('.item-toggle').removeClass('.float-size');
    last.before(item);
    recalcPointsNumbers();
    $('.item-toggle').hide();

    setTogglePosition(item.find('.item-toggle').removeClass('float-size'));
    if (container.find('.point').size() >= 6) {
        last.addClass('disabled');
    }
}

function addPoint(last, link) {
    var container = $('.mcontainer'),
        item = last.clone();

    last.find('.item-toggle').hide();

    last.find('.ssity').val('');
    last.find('.mCSB_container').html('');


    item.removeClass('last').find('.item-toggle').removeClass('.float-size');
    var toggleLink = item.find('.toggle'),
                label = link.children('.title').text(),
                pointId = link.data('id'),
                pointLat = link.data('lat'),
                pointLng = link.data('lng'),
                pointName = link.data('name');

    toggleLink.children('span').removeClass('noborder').text(label);
    toggleLink.data('id', pointId).attr('data-id', pointId);
    toggleLink.data('name', pointName).attr('data-name', pointName);
    toggleLink.data('lat', pointLat).attr('data-lat', pointLat);
    toggleLink.data('lng', pointLng).attr('data-lng', pointLng);

    item.find('.item-toggle').hide().find('.mCSB_container').html('');
    last.before(item);
    recalcPointsNumbers();
    initMapRoute();
}