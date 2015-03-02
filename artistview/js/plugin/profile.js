define(['jquery', 'jqueryui', 'colorpicker'], function ($) {
    return {
        currentView: 'index',

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
            if ($(window).width() < 740){
	          
	            var $params = {
	                1:0,
	                2:90,
	                3:180,
	                4:270
	            };
	            var $arrow_params = {
	                1:-10,
	                2:80,
	                3:170,
	                4:260
	            };
	            
	        } else if ($(window).width() < 1024){
	        	
	       	   var $params = {
	                1:-14,
	                2:66,
	                3:143,
	                4:223
	            };
	            var $arrow_params = {
	                1:-24,
	                2:56,
	                3:134,
	                4:214
	            };
	            
	        
			} else {
				
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
			}
            
            var $id = $this.data('colorpicker');
            $('#colorpicker').stop().animate({'margin-top': $params[$id]}, 250);
            $('#colorpicker_left_arrow').stop().animate({'top': $arrow_params[$id]}, 250);
           	$('#colorpicker_area').fadeIn();
        },


        'colorPickerInit': function (e) {
            $('body').on(window.clickend, '.colorpicker_input', $.proxy(this.onColorPickerClick, this));
            console.log('init');
           setTimeout(function() {
           		var onOpen = function (e) {
           			$('#colorpicker_1, #colorpicker_2, #colorpicker_3, #colorpicker_4').not(this).colorpicker("close");
           		};
           	
                var x = $('#colorpicker_1').colorpicker({
                    uid: '1',
                    closeOnOutside: false,
                    closeOnEscape: false,
                    alpha: true,
                    open: onOpen
                });
                $('#colorpicker_2').colorpicker({
                    uid: '2',
                    closeOnOutside: false,
                    closeOnEscape: false,
                    alpha: true,
                    open: onOpen
                });
                $('#colorpicker_3').colorpicker({
                    uid: '3',
                    closeOnOutside: false,
                    closeOnEscape: false,
                    alpha: true,
                    open: onOpen
                });
                $('#colorpicker_4').colorpicker({
                    uid: '4',
                    closeOnOutside: false,
                    closeOnEscape: false,
                    alpha: true,
                    open: onOpen
                });
                $('#colorpicker_1').colorpicker('open');
            }, 500);
        },

        'onColorPickerChange': function (e) {
        	alert();
            var $this = $(e.currentTarget);
            var $id = $this.attr('id');
            $('#' + $id).trigger('click');
        },

        'colorPickerInitMob': function (e) {
            $('body').on('keypress', '.colorpicker_input', $.proxy(this.onColorPickerChange, this));
            setTimeout(function() {
                $('#colorpicker_1m').colorpicker({
                    uid: '1m',
                    closeOnOutside: false,
                    alpha: true
                });
                $('#colorpicker_2m').colorpicker({
                    uid: '2m',
                    closeOnOutside: false,
                    alpha: true
                });
                $('#colorpicker_3m').colorpicker({
                    uid: '3m',
                    closeOnOutside: false,
                    alpha: true
                });
                $('#colorpicker_4m').colorpicker({
                    uid: '4m',
                    closeOnOutside: false,
                    alpha: true
                });
                $('.colorpicker_input').trigger('click');
            }, 500);
        },
		
		'onBlockShowMob': function(e) {
            var template=$(e.currentTarget);
            if (this.isMobile()) {
                if(template.parents('#container .container').hasClass('change-profile-picture')){
                    this.currentView="change-profile-picture";
                }
                else if(template.parents('#container .container').hasClass('customize-design')){
                    this.currentView="customize-design";
                }

                templateClass='#container .container.'+template.data('template');
                if(template.data('template')=='change-profile-alb-pic'||template.data('template')=='change-profile-pic'){
                    switch(this.currentView){
                        case 'change-profile-picture':
                            $(templateClass+' .myprofile-customize-header .title').html('CHANGE PROFILE<br/>PICTURE');
                            break;
                        case 'customize-design':
                            $(templateClass+' .myprofile-customize-header .title').html('CUSTOMIZE<br/>DESIGN');
                            break;
                    }
                }

                $('#container .container').hide();
                $('#container .container.'+template.data('template')).show();

                if(template.attr('data-template')=='change-color')
                    this.colorPickerInitMob();


            }
        },

        'onBlockBackMob': function(e) {
            var back=$(e.currentTarget);
            if (this.isMobile()) {
                backView=back.data('back');
                if(back.parents('#container .container').hasClass('change-profile-alb-pic')){
                    switch(this.currentView){
                        case 'change-profile-picture':
                            backView='change-profile-picture';
                            break;
                        case 'customize-design':
                            backView='customize-design';
                            break;
                    }
                }


                $('#container .container').hide();
                $('#container .container.'+backView).show();

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

        'isMobile':function() {
            var mob=false;
            var clientw =  $(window).width();
            if (window.mobile && clientw <= 739) mob=true;
            return mob;
        },

        'init': function () {
            $('body').on(window.clickend, '.button.blue.edit-button.rearrange', $.proxy(this.onBlockControlActivation, this))
                .on(window.clickend, '.control_area .close', $.proxy(this.onBlockControlRemove, this))
                .on(window.clickend, '.control_area .top', $.proxy(this.onBlockControlTop, this))
                .on(window.clickend, '.control_area .bttm', $.proxy(this.onBlockControlBottom, this))
				.on(window.clickend, '.mobile-page', $.proxy(this.onBlockShowMob, this))
                .on(window.clickend, '.myprofile-customize-header .back', $.proxy(this.onBlockBackMob, this))
                .on(window.clickend, '.button', $.proxy(this.onHideControlActivation, this))
                .on(window.clickend, '.customize.edit-information li a', function (e) {
                    var $this = $(e.currentTarget).toggleClass('active');
                });
                //$('.colorpicker_input').bind('click', this.colorPickerInit);
                //$('.colorpicker_input').bind('click', this.colorPickerInit);
        }
    };
});