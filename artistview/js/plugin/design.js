define(['jquery', 'jqueryui', 'colorpicker'], function ($) {
    return {
        'onBlockControlActivation': function (e) {
            $('section.rltv').toggleClass('active');
            return false;
        },

        'onBlockControlTop': function (e) {
            var $this = $(e.currentTarget),
            $obj = $this.parent().parent(),
            $prev = $obj.prev();
            if ($prev.hasClass('rltv')) $obj.insertBefore($prev);
        },

        'onBlockControlBottom': function (e) {
            var $this = $(e.currentTarget),
            $obj = $this.parent().parent(),
            $next = $obj.next();
            if ($next.hasClass('rltv')) $obj.insertAfter($next);
        },

        'onBlockControlRemove': function (e) {
            var $this = $(e.currentTarget);
            $this.parent().parent().remove();
        },

        'onColorPickerClick': function (e) {
            var $this = $(e.currentTarget);
            var $params = {
                1: 0,
                2: 30,
                3: 60,
                4: 90
            };
            var $arrow_params = {
                1: 32,
                2: 110,
                3: 190,
                4: 270
            };
            var $id = $this.attr('data-colorpicker');
            $('#colorpicker').stop().animate({'margin-top': $params[$id]}, 250);
            $('#colorpicker_left_arrow').stop().animate({'top': $arrow_params[$id]}, 250);
            $('#colorpicker_area').fadeIn();
        },

        'colorPickerInit': function (e) {
                $('#colorpicker_1').colorpicker({
                    //uid: '1',
                    closeOnOutside: false,
                    alpha: true
                });
        },
		
		'onCustomizePopup': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container:first').hide();
                $('#container .container.customize-block').show();
            }
        },

        'onCustomizeBack': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container.customize').hide();
                $('#container .container:first').show();
            }
        },

        'onHideControlActivation': function(e) {
            e.preventDefault();
            var button = $(e.currentTarget);
            var clientw =  $(window).width();
            if(!button.hasClass('rearrange')){
                $('section.rltv').removeClass('active');
            }
        },

        'onMorePhotosMob': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.more-photos').show();
            }
        },

        'onMorePhotosMobBack': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.customize-block').show();
            }
        },

        'onMorePhotosBgMob': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.more-photos-bg').show();
            }
        },

        'onMorePhotosMobBgBack': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.customize-block').show();
            }
        },

        'onChangeColorMob': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.change-color').show();
            }
        },

        'onChangeColorMobBack': function() {
            var clientw =  $(window).width();
            if (window.mobile || clientw <= 739) {
                $('#container .container').hide();
                $('#container .container.customize-block').show();
            }
        },

        'init': function () {
            $('body').on(window.clickend, '.page-colors input', $.proxy(this.colorPickerInit, this));
        }
    };
});