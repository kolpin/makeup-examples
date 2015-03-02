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

//iphone/ipad rotate bug fix
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
    var viewportmeta = document.querySelector('meta[name="viewport"]');
    if (viewportmeta) {
        viewportmeta.content = 'width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0';
        document.body.addEventListener('gesturestart', function () {
            viewportmeta.content = 'width=device-width, minimum-scale=0.25, maximum-scale=1.6';
        }, false);
    }
}


require.config({
    paths: {
        'jquery': 'lib/jquery',
        'jqueryui': 'lib/jquery-ui',
        'scrollbar': 'lib/scrollbar',
        'easing': 'lib/easing',
        'colorpicker': 'lib/jquery.colorpicker'
    },

    shim: {
        'jquery': {
            exports: '$'
        },
        'jqueryui': ['jquery'],
        'easing': ['jquery'],
        'scrollbar': ['jquery'],
        'colorpicker': ['jquery']		
    }
});

define('jquery', function () {
    return jQuery;
});

requirejs([
    'plugin/home',
    'plugin/dropdowns',
    'plugin/tabs',
    'plugin/first-login',
    'plugin/popups',
    'plugin/forms',
    'plugin/chat',
    'plugin/player',
    'plugin/profile',
    'plugin/album',
    'plugin/allgroups',
    'plugin/video',
    'plugin/write',
    'plugin/passions',
    'plugin/slideshow',
    'plugin/mobile',
    'easing',
    'jqueryui',
    'colorpicker'
], function (
    Home,
    Dropdowns,
    Tabs,
    FirstLogin,
    Popups,
    Forms,
    Chat,
    Player,
    Profile,
    Album,
    Allgroups,
    Video,
    Write,
    Passions,
    Slideshow,
    Mobile
) {
    if (window.mobile) $('body').addClass('mobile');
    
    Home.init();
    Dropdowns.init();
    Tabs.init();
    FirstLogin.init();
    Popups.init();
    Forms.init();
    Chat.init();
    Player.init();
    Profile.init();
    Album.init();
    Allgroups.init();
    Video.init();
    Write.init();
    Passions.init();
    Slideshow.init();
    
    Mobile.init();
    
    $('body')
        .on('click', '.checkbox', function (e) {
            if ($(e.target).is('a')) return;
            e.preventDefault();
            
            var $this = $(e.currentTarget).toggleClass('active'),
                input = $this.find('input'),
                parent = $this.parent(),
                group = parent.children('.checkbox');
            
            input.attr('checked', $this.hasClass('active'));
            
            if (parent.parent().hasClass('checkbox-group')) {
                if (group.size() == group.find('[checked]').size()) {
                    parent.parent().children('.checkbox').addClass('active').find('input').attr('checked', true);
                } else {
                    parent.parent().children('.checkbox').removeClass('active').find('input').attr('checked', false);
                }
            }
            
            if (parent.hasClass('checkbox-group')) {
                if ($this.hasClass('active')) {
                    parent.children('div').children('.checkbox').addClass('active').find('input').attr('checked', true);
                } else {
                    parent.children('div').children('.checkbox').removeClass('active').find('input').attr('checked', false);
                }
            }
            
            if (parent.parent().find('.checkbox').size() == parent.parent().find('[checked]').size()) {
                parent.parent().prev('h3').find('.checkbox').addClass('active').find('input').attr('checked', true);
            } else {
                parent.parent().prev('h3').find('.checkbox').removeClass('active').find('input').attr('checked', false);
            }
        })
        .on('click', '#edit-information li a', function (e) {
            var $this = $(e.currentTarget).toggleClass('active');
        });
});