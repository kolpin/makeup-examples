define(['jquery', 'plugin/profile', 'jqueryui', 'colorpicker'], function ($, Profile) {
    return {
        // currentView: 'index',
// 
        // 'onBlockControlActivation': function (e) {
//         	
            // $('section.rltv').toggleClass('active');
            // return false;
        // },
// 
        // 'onBlockControlTop': function (e) {
            // var $this = $(e.currentTarget),
            // $obj = $this.parent().parent(),
            // $prev = $obj.prev();
            // if ($prev.hasClass('rltv')) $obj.insertBefore($prev);
        // },
// 
        // 'onBlockControlBottom': function (e) {
            // var $this = $(e.currentTarget),
            // $obj = $this.parent().parent(),
            // $next = $obj.next();
            // if ($next.hasClass('rltv')) $obj.insertAfter($next);
        // },
// 
        // 'onBlockControlRemove': function (e) {
            // var $this = $(e.currentTarget);
            // $this.parent().parent().remove();
        // },
// 
        // 'onColorPickerClick': function (e) {
            // var $this = $(e.currentTarget);
            // var $params = {
                // 1: 0,
                // 2: 30,
                // 3: 60,
                // 4: 90
            // };
            // var $arrow_params = {
                // 1: 32,
                // 2: 110,
                // 3: 190,
                // 4: 270
            // };
            // var $id = $this.attr('data-colorpicker');
            // $('#colorpicker').stop().animate({'margin-top': $params[$id]}, 250);
            // $('#colorpicker_left_arrow').stop().animate({'top': $arrow_params[$id]}, 250);
            // $('#colorpicker_area').fadeIn();
        // },
// 
// 
        // 'colorPickerInit': function (e) {
            // $('body').on(window.clickend, '.colorpicker_input', $.proxy(this.onColorPickerClick, this));
            // setTimeout(function() {
                // $('#colorpicker_1').colorpicker({
                    // uid: '1',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_2').colorpicker({
                    // uid: '2',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_3').colorpicker({
                    // uid: '3',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_4').colorpicker({
                    // uid: '4',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_1').trigger('click');
            // }, 500);
        // },
// 
        // 'onColorPickerChange': function (e) {
            // var $this = $(e.currentTarget);
            // var $id = $this.attr('id');
            // $('#'+$id).trigger('click');
        // },
// 
        // 'colorPickerInitMob': function (e) {
            // $('body').on('keypress', '.colorpicker_input', $.proxy(this.onColorPickerChange, this));
            // setTimeout(function() {
                // $('#colorpicker_1m').colorpicker({
                    // uid: '1m',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_2m').colorpicker({
                    // uid: '2m',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_3m').colorpicker({
                    // uid: '3m',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('#colorpicker_4m').colorpicker({
                    // uid: '4m',
                    // closeOnOutside: false,
                    // alpha: true
                // });
                // $('.colorpicker_input').trigger('click');
            // }, 500);
        // },
//         
        'init' : function() {
        	Profile.colorPickerInit();
        },
      }; 
 });	