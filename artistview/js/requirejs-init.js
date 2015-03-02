'use strict';
function isMobile() {
    if('ontouchend' in document) return true;
    if(navigator.userAgent.match(/Android/i)) return true;
    if(navigator.userAgent.match(/iPhone|iPad|iPod/i)) return true;
    if(navigator.userAgent.match(/Opera Mini/i)) return true;
    if(navigator.userAgent.match(/IEMobile/i)) return true;
    if(navigator.userAgent.match(/BlackBerry/i)) return true;
    return false;
}
//window.mobile = 'ontouchend' in document;
window.mobile = isMobile();
window.clickend = ('ontouchend' in document) ? 'touchend' : 'click';

window.msie8 = /MSIE 8.0/.test(navigator.userAgent);
window.msie7 = /MSIE 7.0/.test(navigator.userAgent);
window.msie = isIE();

//iphone/ipad rotate bug fix
if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        document.body.addEventListener('gesturestart', function () {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
    }
    if(navigator.userAgent.match(/iPad/i))document.getElementsByTagName('body')[0].className+=' ipad';
}

require.config({    
    waitSeconds: 200,
    paths: {
        'jquery': 'lib/jquery',
        'jqueryui': 'lib/jquery-ui',
        'scrollbar': 'lib/scrollbar',
        'easing': 'lib/easing',
        'colorpicker': 'lib/jquery.colorpicker',
		'colorbox': 'lib/jquery.colorbox',
        'touch-punch': 'lib/jquery.ui.touch-punch',
        'jplayer': 'lib/jquery.jplayer',
        'jplaylist': 'lib/jplayer.playlist',
        'jinspector': 'lib/jquery.jplayer.inspector',
        'iefixcss' : 'lib/selectivizr',
        'placeholder' : 'lib/jquery.placeholder',
        'selectbox' : 'lib/jquery.selectbox',
        'hoverIntent' : 'lib/jquery.hoverIntent',
        'select2' : 'lib/select2/select2',
        'fileuploader': 'lib/fileupload/uploader',
        'camera-slider': 'lib/jquery.camera',
        'jquery-mobile': 'lib/jquery.mobile.custom',
        'event-drag': 'lib/jquery.event.drag'
    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'jqueryui': ['jquery'],
        'easing': ['jquery'],
        'scrollbar': ['jquery'],
        'colorpicker': ['jquery', 'jqueryui'],
        'touch-punch' : ['jqueryui'],
        'jplayer': ['jquery'],
        'jplaylist': ['jquery', 'jplayer'],
        'jinspector': ['jquery', 'jplayer'],
        'iefixcss' : ['jquery'],
        'placeholder' : ['jquery'],
        'selectbox' : ['jquery'],
        'hoverIntent' : ['jquery'],
        'select2' : ['jquery'],
        'fileuploader' : ['jquery', 'jqueryui'],
        'camera-slider' : ['jquery'],
        'jquery-mobile' : ['jquery'],
        'event-drag' : ['jquery-mobile']
    }
});

define('jquery', function () {
    return jQuery;
});

$(document).ready(function(){

    $('body')
        .on(window.clickend, '.checkbox', function (e) {
            if ($(e.target).is('a')) return;
            e.preventDefault();

            var $this = $(e.currentTarget).toggleClass('active'),
                input = $this.find('input'),
                parent = $this.parent(),
                group = parent.children('.checkbox');

            input.attr('checked', $this.hasClass('active'));

            if (parent.parent().hasClass('checkbox-group')) {
                if (parent.find('.checkbox.active').size()) {
                    parent.parent().children('.checkbox').addClass('active').find('input').attr('checked', true);

                } else {
                    parent.parent().children('.checkbox').removeClass('active').find('input').attr('checked', false);
                }
            }

            if (parent.hasClass('checkbox-group')) {
                if ($this.hasClass('active')) {
                    parent.children('div').children('.checkbox').addClass('active').find('input').attr('checked', true);
                    parent.addClass('active');
                    var group =parent.children('div').stop(),
                        currH = group.height(),
                        H = group.height('auto').height();

                    group.height(currH).animate({height: H});
                } else {

                    parent.children('div').children('.checkbox').removeClass('active').find('input').attr('checked', false);
                    parent.removeClass('active');
                    var group =parent.children('div').stop(),
                        currH = group.height();
                    group.height(currH).animate({height: 0});
                }
            }

            if (parent.parent().find('.checkbox').size() == parent.parent().find('[checked]').size()) {
                parent.parent().prev('h3').find('.checkbox').addClass('active').find('input').attr('checked', true);
            } else {
                parent.parent().prev('h3').find('.checkbox').removeClass('active').find('input').attr('checked', false);
            }
        })
        .on(window.clickend, '#edit-information li a', function (e) {
            var $this = $(e.currentTarget).toggleClass('active');
        });

});

$(window).load(function(){
    requirejs([
        'plugin/search'

    ], function (
        Search

        ) {
        Search.init();

    });
});

function isIE(){
    if(/MSIE/.test(navigator.userAgent)){ //IE LTE 11
        return true;
    }else if(!!navigator.userAgent.match(/Trident.*rv[ :]*11\./)){ //IE 11
        return true;
    }
    return false;
}