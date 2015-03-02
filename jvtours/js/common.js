var currSlide = 1,
    click = true,
    rotate = true,
    current_address = 'Газетный пер., 12',
    count_places = 0,
    count_places_ot = 0,
    setInervalMain = 0,
    showText = true,
    form = getParams("form"),
    alltour = false
    instant_form = false,
	rotateInterval = 0;

function getParams(key) {
    var s = window.location.search;
    s = s.match(new RegExp(key + '=([^&=]+)'));
    return s ? s[1] : false;
}
$(function() {

    $('input[name=mobile_phone]').mask("+7 999 9999999");

    /* ordertours active*/

    $('.accomm').on("click", function() {
        var id = $(this).data('aid');
        $('.ordertours_form input[name=accomm_id]').val(id);
        $('.accomm').removeClass('active');
        $(this).addClass('active');
    });

    count_places_ot = parseInt($('.ordertours_form .tours.active .places b').text());

    $('.ordertours_form .otours').on("click", function() {
        var id = $(this).data('id');
        $('.ordertours_form input[name=otour_id]').val(id);
        $('.otours').removeClass('active');
        $(this).addClass('active');
        count_places_ot = parseInt($('.ordertours_form .otours.active .places b').text());
        $('.ordertours_form .count_people').text(1);

        $('.ordertours_form .plus').removeClass('passive');
        $('.ordertours_form .minus').addClass('passive');
    });
    $('.ordertours_form .otours:first').trigger("click");

    $('.ordertours_form .minus').on("click", function() {

        var cnt = parseInt($('.ordertours_form .count_people').text());
        cnt--;
        if (count_places_ot > cnt) $('.ordertours_form .plus').removeClass('passive');
        if (cnt <= 0) cnt = 1;
        if (cnt == 1) $('.ordertours_form .minus').addClass('passive');
        $('.ordertours_form .count_people').text(cnt);
        $('.ordertours_form input[name=count_people]').val(cnt);
        return false;
    });
    $('.ordertours_form .plus').on("click", function() {
        var cnt = parseInt($('.ordertours_form .count_people').text());
        if (!$(this).hasClass('passive')) {
            cnt++;
            if (count_places_ot == cnt) $(this).addClass('passive');
            if (cnt > 1) $('.ordertours_form .minus').removeClass('passive');
            $('.ordertours_form .count_people').text(cnt);
            $('.ordertours_form input[name=count_people]').val(cnt);
        }
        return false;
    });



    //$('.header-contacts .animated').animate({top:0},2000);

    $('.price_hold .to_order').on("mouseover", function() {
        var tag_i = $(this).find('i');
        tag_i.stop(true, true).animate({'margin-left': 16+'px'}, 200, function() {
            tag_i.stop(true, true).animate({'margin-left': 8+'px'}, 200);
        });
    });

    $('.further').on("mouseover", function() {
        var tag_i = $(this).find('i');
        tag_i.stop(true, true).animate({'margin-left': 32+'px'}, 200, function() {
            tag_i.stop(true, true).animate({'margin-left': 14+'px'}, 200);
        });
    });




    $('.item_preview:first').addClass('active');

    $(window).on('resize', function () {
        setTravelWrapHeight();
        cropToFit();
        setOrdSuccWrapHeight();
        cropToFitOrdSucc();
        setOrderTourSizes();
        $('.scroll_tour_wrap .columns').masonry();
    }).trigger("resize");

    /* tours active*/
    if (form) {
        $('.opacity_popup, .popup_application_to_order  ').fadeOut();
        $('.popup_ordertours').fadeIn();
        $(window).trigger("resize");
    }

    count_places = parseInt($('.order_form .tours.active .places b').text());

    $('.order_form .tours').on("click", function() {
        var id = $(this).data('id');
        $('input[name=tour_id]').val(id);
        $('.tours').removeClass('active');
        $(this).addClass('active');
        count_places = parseInt($('.order_form .tours.active .places b').text());
        $('.order_form .count_people').text(1);

        $('.order_form .plus').removeClass('passive');
        $('.order_form .minus').addClass('passive');
    });
    $('.order_form .tours:first').trigger("click");
    $('.order_form .minus').on("click", function() {

        var cnt = parseInt($('.order_form .count_people').text());
        cnt--;
        if (count_places > cnt) $('.order_form .plus').removeClass('passive');
        if (cnt <= 0) cnt = 1;
        if (cnt == 1) $('.order_form .minus').addClass('passive');
        $('.order_form .count_people').text(cnt);
        $('input[name=count_people]').val(cnt);
        return false;
    });
    $('.order_form .plus').on("click", function() {
        var cnt = parseInt($('.order_form .count_people').text());
        if (!$(this).hasClass('passive')) {
            cnt++;
            if (count_places == cnt) $(this).addClass('passive');
            if (cnt > 1) $('.order_form .minus').removeClass('passive');
            $('.order_form .count_people').text(cnt);
            $('input[name=count_people]').val(cnt);
        }
        return false;
    });

    /*Tabs card*/

    $('.selection li a').on("click", function() {
        $('.selection li a').removeClass('active');
        $(this).addClass('active');
        var symbol = $(this).data('symbol');
        $('.number_card').hide();
        $('.number_card.td_'+symbol).show();
        return false;
    });
    $('.selection li a:first').trigger("click");

    /* Tabs address */

    $('.cont_tabs .num_tab').on("click", function() {
        //$('.cont_tabs .num_tab').css('color', '#5e5e5e');
        var id = $(this).data('item');

        var addr = $('.edit_address #address').val();
        if (addr == '') {
            $('#addr_text').text(current_address);
        }
        $('.edit_address').fadeOut(100);
        $('.tab_content').hide();
        $('.tc_'+id).show();
        $('.cont_tabs li').removeClass('active');
        $(this).parent().addClass('active');
        $('.tabs_wrapper').jScrollPane({showArrows:false});

        if (id == 1) calcRoute("walking", "Москва, м. Савёловская", "panel_1");
        if (id == 2) calcRoute("walking", "Москва, м. Белорусская", "panel_2");
        if (id == 3) calcRoute("driving", current_address, "panel_3");
    })

    /* Certificate Avers/Revers */
    $.support.css3d = supportsCSS3D();
    var container = $('.cert_img');

    $('.refresh_cert').on("click", function(e) {
        var angle=0;
        var rI = setInterval(function(){
            angle-=3;
            $('.refresh_cert').rotate(angle);
            if (angle == -360) {
                container.toggleClass('flipped');
                $('.cert_wrapper .text span').hide();
                if (container.hasClass('flipped')) $('.cert_wrapper .text span.text_revers').fadeIn();
                else $('.cert_wrapper .text span.text_avers').fadeIn();
                if(!$.support.css3d){
                    $('.avers').toggle();
                }
                clearInterval(rI);
            }
        },1);


        //Rotate('.refresh_cert');
        //container.toggleClass('flipped');
        //$('.cert_wrapper .text span').hide();
        //if (container.hasClass('flipped')) $('.cert_wrapper .text span.text_revers').fadeIn();
        //else $('.cert_wrapper .text span.text_avers').fadeIn();
        //if(!$.support.css3d){
        //    $('.avers').toggle();
        //}
        //setTimeout(function() {
        //    $('.refresh_cert').rotate(0);
        //    RotateStop();
        //},1000)
        e.preventDefault();


//        if (rotate) {
//            rotate = false;
//            Rotate('.refresh_cert');
//            setTimeout(function() {
//                $('.cert_wrapper .text span').hide();
//                if ($('.cert_img').hasClass('avers')) {
//                    $('.cert_img').removeClass('avers').addClass('revers');
//                    $('.cert_wrapper .text span.text_revers').fadeIn();
//                }
//                else {
//                    $('.cert_img').removeClass('revers').addClass('avers');
//                    $('.cert_wrapper .text span.text_avers').fadeIn();
//                }
//            }, 600);
//            $('.cert_img').rotate3Di(
//                180,
//                1200,
//                {
//                    direction: 'clockwise',
//                    sideChange: function(front) {
//                    },
//                    complete: function() {
//                        $('.refresh_cert').rotate(0);
//                        RotateStop();
//                        rotate = true;
//                    }
//                }
//            );
//        }
//        return false;
    });

    /* Edit address */

    $('#edit').on("click", function() {
        $('.edit_address #address').val($('#addr_text').text());
        $('.edit_address').fadeIn(100);
        return false;
    });
    $('#apply').on("click", function() {
        var address = $('.edit_address #address').val();
        if (address == '') {
            $('.edit_address #address').css({'border' : '1px solid #f54b4c', 'background':'#f54b4c', 'color': '#ffffff'});
        }
        else {
            current_address = address;
            $('.edit_address #address').css({'border' : '1px solid #c4c4c4', 'background':'#f5f5f5', 'color': '#5e5e5e'});
            $('#addr_text').text(address);
            $('.edit_address').fadeOut(100);
            calcRoute("driving", address, "panel_3");
        }
        return false;
    });

    /* Hover text color*/

    $('.num_tab span a').hover(function() {
        $(this).parents('.num_tab').css('color', '#5e5e5e');
    }, function() {
        $(this).parents('.num_tab').css('color', '');
    });

    /*Show map*/

        $('.slide_map i, .see_on_map').on("click", function() {
            $('.slide_map').fadeOut(300, function(){
                $('.cont_wrap').stop().animate({left: -827+'px'}, 1000, function() {
                    $('.half_opacity_left').css('z-index', '1');
                    $('.icons_map').show();

                });
            });
        });

        $('.half_opacity_left .icons_map.back ').on("click", function() {
            $('.half_opacity_left').css('z-index', '-1');
            $('.icons_map').fadeOut(300, function(){
                $('.cont_wrap').stop().animate({left: 0}, 1000, function() {
                    $('.slide_map').show();
                });
            })
        });

        $('#cont_map .print, #cont_map .close').hover(function() {
            $('#cont_map .opacity_map').show();
        }, function() {
            $('#cont_map .opacity_map').hide();
        });

    /*Personal a: opacity*/

    $('.personal a, .photos_wrap a, .mini_photos a, .video_wrap a').hover(function() {
        $('.opacity_img', this).stop(true, true).fadeIn(300);
    }, function() {
        $('.opacity_img', this).stop(true, true).fadeOut(300);
    });

    /*Show/Hide Opacity*/
    //$('.hover').hover(function() {
    //    $('.img_slide .opacity').stop(true,true).fadeIn(300, function() {
    //        $('.hide_hover').show();
    //        if (parseInt($('.item_preview.active').css('left')) < 0) $('.product_by.hide_hover').hide();
    //    });
    //    showText = true;
    //}, function() {
    //    $('.img_slide .opacity').stop(true,true).fadeOut(300);
    //    $('.hide_hover').hide();
    //    showText = false;
    //});

    /*Refresh slides*/

    $('.refresh').on("click", function() {
		clearInterval(setInervalMain);
		refreshMain();
		setInervalMain = setInterval(function() {
			refreshMain();
		}, 6000);
		return false;
    });

    setInervalMain = setInterval(function() {
		refreshMain();
	}, 6000);

    /*Slide right*/

    $('.slide_right').on("click", function() {
        var parent = $(this).parents('.item_preview');
        var slideWidth = $('.travel_preview_wrap').width();
        $('.product_by').fadeOut(300, function() {
            parent.animate({left: -slideWidth+'px'}, 1000);
        });
        clearInterval(setInervalMain);
        return false;
    });

    /*Slide left*/

    $('.slide_left').on("click", function() {
		clearInterval(setInervalMain);
        var parent = $(this).parents('.item_preview');
        var slideWidth = $('.travel_preview_wrap').width();
        parent.animate({left: 0}, 1000, function() {
            $('.product_by').fadeIn(300);
			setInervalMain = setInterval(function() {
				refreshMain();
            }, 6000);
		});
        return false;
    });

    /* Show/Hide popup window */

    $('.faq').on('click', function() {
        $('.opacity_popup, .popup_faq').fadeIn();
        $(window).trigger('resize');
        return false;
    });
    $('.close_faq, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_faq').fadeOut();
        return false;
    });
    $('.cont-manager, .cont_us_link').on('click', function() {
        $('.opacity_popup, .popup_cont_manager').fadeIn();
        return false;
    });
    $('.close_cnt_mngr, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_cont_manager').fadeOut();
        return false;
    });
    $('.subscribe').on('click', function() {
        $('.opacity_popup, .popup_subscribe').fadeIn();
        return false;
    });
    $('.close_subs, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_subscribe').fadeOut();
        return false;
    });
    $('.other-sites').on('click', function() {
        $('.opacity_popup, .popup_other_sites').fadeIn();
        return false;
    });
    $('.close_other, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_other_sites').fadeOut();
        return false;
    });
    $('.copy').on('click', function() {
        $('.opacity_popup, .popup_copy').fadeIn();
        return false;
    });
    $('.close_copy, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_copy').fadeOut();
        return false;
    });
    $('.contacts, .header-contacts .phone').on('click', function() {
        $('.opacity_popup, .popup_contacts').fadeIn();
        $('.cont_tabs .num_tab:first').click();
        deleteMarkers();
        initialize();
        return false;
    });
    $('#cont_map .close, .close_cont, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_contacts').fadeOut();
        return false;
    });
    $('.to_order').on('click', function() {
        //$('.opacity_popup, .popup_order').fadeIn();
        $('.opacity_popup, .popup_application_to_order  ').fadeOut();
        $('.popup_ordertours').fadeIn();
        $(window).trigger("resize");
        return false;
    });
    $('.close_order, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_order').fadeOut();
        return false;
    });
    $('.pay_card').on('click', function() {
        var scroll = $('body').scrollTop();
        $('.popup_pay_card').css('top', scroll+27);
        $('.opacity_popup, .popup_pay_card').fadeIn();
        return false;
    });
    $('.close_pay_card, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_pay_card').fadeOut();
        return false;
    });
    $('.close_order_success, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_order_success').fadeOut();
        return false;
    });

    $('.application').on('click', function() {
        if (instant_form) {
            $('.popup_ordertours').fadeIn();
            $(window).trigger("resize");
        } else {
            $('.opacity_popup, .popup_application_to_order').fadeIn();
            $(window).trigger("resize");
        }
        return false;
    });
    $('.travel-application').on("click", function() {
        $('.application').trigger("click");
        return false;
    })
    $('.close_application, .opacity_popup').on('click', function() {
        $('.opacity_popup, .popup_application_to_order  ').fadeOut();
        return false;
    });

    $('.ultours li a').on('click', function() {
        alltour = true;
        $('.opacity_popup, .popup_application_to_order  ').fadeOut();
        $('.opacity_popup, .popup_ordertours').fadeIn();
        $(window).trigger("resize");
        return false;
    });
    $('.close_ordertours').on('click', function() {
        $('.popup_ordertours').fadeOut();
        if (alltour) {
            $('.opacity_popup, .popup_application_to_order').fadeIn();
        }
        return false;
    });


    $(this).keydown(function(eventObject){
        if (eventObject.which == 27) {
            $('.opacity_popup, .popup_faq').fadeOut();
            $('.opacity_popup, .popup_cont_manager').fadeOut();
            $('.opacity_popup, .popup_subscribe').fadeOut();
            $('.opacity_popup, .popup_other_sites').fadeOut();
            $('.opacity_popup, .popup_copy').fadeOut();
            $('.opacity_popup, .popup_contacts').fadeOut();
            $('.photo_slider .close_img').trigger("click");
            $('.opacity_popup, .popup_order').fadeOut();
            $('.opacity_popup, .popup_pay_card').fadeOut();
            $('.opacity_popup, .popup_order_success').fadeOut();
            $('.opacity_popup, .img_wrapper').fadeOut();
            $('.opacity_popup, .popup_application_to_order').fadeOut();
            $('.popup_ordertours').fadeOut();
        }
    });

    /* Validate Fitback */
    if (checkClassContacts()) $('.fitback_form .send_button').addClass('success');
    else $('.fitback_form .send_button').removeClass('success');

    $('.fitback_form input, .fitback_form textarea').on("change keyup", function() {
        if (checkClassContacts()) $('.fitback_form .send_button').addClass('success');
        else $('.fitback_form .send_button').removeClass('success');
//        if ($(this).attr('name') == 'user_email'){
//            if (!isValidEmailAddress($(this).val())) $(this).addClass('error');
//            else $(this).removeClass('error');
//        }
//        else {
            $(this).removeClass('error');
//        }
    });
    $('.fitback_form').on("submit", function() {
        return validateFormContacts();
    });
    $('.fitback_form .send_button').on("mouseover", function() {
        if ($(this).hasClass('success')) {
            var tag_i = $(this).find('i');
            tag_i.stop(true, true).animate({'margin-left': 32+'px'}, 200, function() {
                tag_i.stop(true, true).animate({'margin-left': 14+'px'}, 200);
            });
        }
    });

    /* Validate rss */
    if (checkClassRss()) $('.rss_form .send_button').addClass('success');
    else $('.rss_form .send_button').removeClass('success');

    $('.rss_form input').on("change keyup", function() {
        if (checkClassRss()) $('.rss_form .send_button').addClass('success');
        else $('.rss_form .send_button').removeClass('success');
//        if ($(this).attr('name') == 'user_email'){
//            if (!isValidEmailAddress($(this).val())) $(this).addClass('error');
//            else $(this).removeClass('error');
//        }
//        else {
            $(this).removeClass('error');
//        }
    });
    $('.rss_form').on("submit", function() {
        return validateFormRss();
    });
    $('.rss_form .send_button').on("mouseover", function() {
        if ($(this).hasClass('success')) {
            var tag_i = $(this).find('i');
            tag_i.stop(true, true).animate({'margin-left': 32+'px'}, 200, function() {
                tag_i.stop(true, true).animate({'margin-left': 14+'px'}, 200);
            });
        }
    });


    /* Validate ordertour */
    if (checkClassOrdTour()) $('.ordertours_form .send_button').addClass('success');
    else $('.ordertours_form .send_button').removeClass('success');

    $('.ordertours_form input').on("change keyup", function() {
        if (checkClassOrdTour()) $('.ordertours_form .send_button').addClass('success');
        else $('.ordertours_form .send_button').removeClass('success');
//        if ($(this).attr('name') == 'user_email'){
//            if (!isValidEmailAddress($(this).val())) $(this).addClass('error');
//            else $(this).removeClass('error');
//        }
//        else {
        $(this).removeClass('error');
//        }
    });
    $('.ordertours_form').on("submit", function() {
        return validateFormOrdTour();
    });
    $('.ordertours_form .send_button').on("mouseover", function() {
        if ($(this).hasClass('success')) {
            var tag_i = $(this).find('i');
            tag_i.stop(true, true).animate({'margin-left': 32+'px'}, 200, function() {
                tag_i.stop(true, true).animate({'margin-left': 14+'px'}, 200);
            });
        }
    });
	
});

function refreshMain() {
	var angle=0;
	rotateInterval = setInterval(function(){
		angle-=3;
		$('.refresh').rotate(angle);
		if (angle == -360) {
			currSlide++;
			if (currSlide > $('.item_preview').length) currSlide = 1;
			refreshPreview(currSlide);
			clearInterval(rotateInterval);
		}
	},5);
}

function supportsCSS3D() {
    var props = [
        'perspectiveProperty', 'WebkitPerspective', 'MozPerspective'
    ], testDom = document.createElement('a');

    for(var i=0; i<props.length; i++){
        if(props[i] in testDom.style){
            return true;
        }
    }

    return false;
}
var rotateInterval;
function Rotate(element) {
    var angle=0;
    rotateInterval = setInterval(function(){
        angle-=3;
        $(element).rotate(angle);
    },10);
}
function RotateStop() {
    clearInterval(rotateInterval);
}

function refreshPreview(curr) {
    //Rotate('.refresh');
    //console.log(curr);
    cropToFit();
    if (showText) {
        $('.hide_hover').fadeOut(300, function() {
            $('.item_preview').stop().animate({opacity: 0}, 1000);
            $('.ip_'+curr).stop().animate({opacity: 1}, 1000, function() {
                $('.hide_hover').fadeIn(300);
                $('.item_preview').removeClass('active');
                $('.ip_'+curr).addClass('active');
                $('.refresh').rotate(0);
                //RotateStop();
            });
        });
    } else {
        $('.item_preview').stop().animate({opacity: 0}, 1000);
        $('.ip_'+curr).stop().animate({opacity: 1}, 1000, function() {
            $('.item_preview').removeClass('active');
            $('.ip_'+curr).addClass('active');
            $('.refresh').rotate(0);
            //RotateStop();
        });
    }
}

function setTravelWrapHeight() {
    var bodyHeight = parseInt($('body').height());
    var travelWrapHeight = bodyHeight - 83;

    if (typeof(ismain) != "undefined" && ismain == true) travelWrapHeight = bodyHeight;

    $('.travel_preview_wrap').height(travelWrapHeight);

    var slideWidth = $('.travel_preview_wrap').width();
    var slideHeight = $('.travel_preview_wrap').height();

    $('.item_preview').width(slideWidth*2).height(slideHeight);
    $('.img_slide, .text_slide').width(slideWidth).height(slideHeight);
    if (parseInt($('.item_preview.active').css('left')) < 0) {
        $('.item_preview.active').css({left: -slideWidth+'px'});
        $('.product_by').hide();
    }
    if (typeof(ismain) != "undefined" && ismain == true) $('.slide_right').css('top', (slideHeight/2-15+83)+'px');
    else $('.slide_right').css('top', (slideHeight/2-15)+'px');
    $('.text_slide > .slide_left').css('top', (slideHeight/2-15)+'px');
    $('.text_rel .slide_left').css('top', (slideHeight/2-106-15)+'px');
    //$('.popup_faq, .popup_tours').css({'height': (bodyHeight-60)+'px'})

    //$('.popup_faq .scroll_wrap, .faq_content').height(bodyHeight-198);
    $('.scroll_tour_wrap').height(bodyHeight-250);
    $('.scroll_tour_wrap .columns').masonry( 'on', 'layoutComplete', function() {
        $('.popup_application_to_order .scroll_tour_wrap').height(400);
        $('.popup_application_to_order .scroll_tour_wrap').jScrollPane({
            height: 400,
            showArrows:false
        });
    } );
    $('.faq_content, .scroll_tour_wrap').jScrollPane({
        showArrows:false
    });
}
function cropToFit() {
    var img = $('.item_preview .img_slide img.slide_bg');
    var imgWidth = Number(img.attr('width'));
    var imgHeight = Number(img.attr('height'));
    var windowWidth = $('.travel_preview_wrap').width();
    var windowHeight =  $('.travel_preview_wrap').height();

    var style = calculateStyle(imgWidth, imgHeight, windowWidth, windowHeight);

    img.css(style);
}
function setOrdSuccWrapHeight() {
    var bodyHeight = parseInt($('body').height());
    var travelWrapHeight = bodyHeight - 83;
    $('.order_succes_wrap').height(travelWrapHeight);

    //карточка товара
    $('.travel-img-wrapp').height(bodyHeight);
    cropToFitCardTravel();
    $('.travel-img-wrapp .opacity').width("100%").height($('.travel-img-wrapp').height());
    $('.card-travel-content').height(bodyHeight - 122);
    //---------------

    var slideWidth = $('.order_succes_wrap').width();
    var slideHeight = $('.order_succes_wrap').height();

    $('.order_succes_wrap .slide_bg').width(slideWidth).height(slideHeight);


    var faq_content = $('.faq_rel').height();
	if (parseInt(faq_content+145) < parseInt(bodyHeight-60)) {
		$('.popup_faq').css({'height': (faq_content+145)+'px'});
		$('.popup_faq .scroll_wrap, .faq_content').height(faq_content+20);
	} else {
		$('.popup_faq').css({'height': (bodyHeight-60)+'px'});
		$('.popup_faq .scroll_wrap, .faq_content').height(bodyHeight-198);
	}
    $('.faq_content').jScrollPane({
        showArrows:false
    });
}
function cropToFitCardTravel() {
    var img = $('.travel-img-wrapp .bg-img');
    var imgWidth = Number(img.attr('width'));
    var imgHeight = Number(img.attr('height'));
    var windowWidth = $('.travel-img-wrapp').width();
    var windowHeight =  $('.travel-img-wrapp').height();

    var style = calculateStyle(imgWidth, imgHeight, windowWidth, windowHeight);

    img.css(style);
}

function cropToFitOrdSucc() {
    var img = $('.order_succes_wrap .slide_bg');
    var imgWidth = Number(img.attr('width'));
    var imgHeight = Number(img.attr('height'));
    var windowWidth = $('.order_succes_wrap').width();
    var windowHeight =  $('.order_succes_wrap').height();

    var style = calculateStyle(imgWidth, imgHeight, windowWidth, windowHeight);

    img.css(style);
}
function calculateStyle(imgWidth, imgHeight, windowWidth, windowHeight) {
    var imgRatio = imgWidth / imgHeight;
    var windowRatio = windowWidth / windowHeight;

    var imgTop = 0, imgLeft = 0;

    if (imgRatio >= windowRatio) {
        imgHeight = windowHeight;
        imgWidth = Math.round((imgHeight) * imgRatio);
    } else {
        imgWidth = windowWidth;
        imgHeight = Math.round((imgWidth) / imgRatio);
    }

    if (imgWidth != windowWidth) {
        imgLeft = Math.round((windowWidth - imgWidth) / 2);
    }

    if (imgHeight != windowHeight) {
        imgTop = Math.round((windowHeight - imgHeight) / 2);
    }

    return {
        width: imgWidth,
        height: imgHeight,
        left: imgLeft,
        top: imgTop
    };
}
function isValidEmailAddress(emailAddress) {
    var pattern = /^[a-z0-9_\.\-]+@([a-z0-9\-]+\.)+[a-z]{2,4}$/i;
    return pattern.test(emailAddress);
}
function validateFormContacts() {
    var user_name = $('#contact_name').val();
    var user_email = $('#contact_email').val();
    var user_phone = $('#contact_phone').val();
    var message = $('#contact_body').val();
    var valid = true;
    if (user_name.trim() == '') { $('#contact_name').addClass('error'); valid = false; }
    else $('#contact_name').removeClass('error');
    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) { $('#contact_email').addClass('error'); valid = false; }
    else $('#contact_email').removeClass('error');
    if (user_phone.trim() == '') { $('#contact_phone').addClass('error'); valid = false; }
    else $('#contact_phone').removeClass('error');
    if (message.trim() == '') { $('#contact_body').addClass('error'); valid = false; }
    else $('#contact_body').removeClass('error');
    return valid;
}
function checkClassContacts() {
    var user_name = $('#contact_name').val();
    var user_email = $('#contact_email').val();
    var user_phone = $('#contact_phone').val();
    var message = $('#contact_body').val();
    var valid = true;
    if (user_name.trim() == '') valid = false;
    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) valid = false;
    if (user_phone.trim() == '') valid = false;
    if (message.trim() == '') valid = false;
    return valid;
}

function validateFormRss() {
    var user_name = $('.rss_form #subscriber_name').val();
    var user_email = $('.rss_form #subscriber_email').val();
    var valid = true;

    if (user_name.trim() == '') { $('.rss_form #subscriber_name').addClass('error'); valid = false; }
    else $('.rss_form #subscriber_name').removeClass('error');

    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) { $('.rss_form #subscriber_email').addClass('error'); valid = false; }
    else $('.rss_form #subscriber_email').removeClass('error');

    return valid;
}
function checkClassRss() {
    var user_name = $('.rss_form #subscriber_name').val();
    var user_email = $('.rss_form #subscriber_email').val();
    var valid = true;
    if (user_name.trim() == '') valid = false;
    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) valid = false;
    return valid;
}
function setOrderTourSizes() {
    $('.popup_ordertours').width($('body').width()).height($('body').height());
}

function validateFormOrdTour() {
    var user_name = $('.ordertours_form input[name=user_name]').val();
    var user_email = $('.ordertours_form input[name=user_email]').val();
    var user_phone = $('.ordertours_form input[name=mobile_phone]').val();
    var valid = true;

    if (user_name.trim() == '') { $('.ordertours_form input[name=user_name]').addClass('error'); valid = false; }
    else $('.ordertours_form input[name=user_name]').removeClass('error');

    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) { $('.ordertours_form input[name=user_email]').addClass('error'); valid = false; }
    else $('.ordertours_form input[name=user_email]').removeClass('error');

    if (user_phone.trim() == '') { $('.ordertours_form input[name=mobile_phone]').addClass('error'); valid = false; }
    else $('.ordertours_form input[name=mobile_phone]').removeClass('error');

    return valid;
}
function checkClassOrdTour() {
    var user_name = $('.ordertours_form input[name=user_name]').val();
    var user_email = $('.ordertours_form input[name=user_email]').val();
    var user_phone = $('.ordertours_form input[name=mobile_phone]').val();
    var valid = true;
    if (user_name.trim() == '') valid = false;
    if (user_email.trim() == '' || !isValidEmailAddress(user_email)) valid = false;
    if (user_phone.trim() == '') valid = false;
    return valid;
}