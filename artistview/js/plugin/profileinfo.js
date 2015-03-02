define(['jquery', 'lib/iscroll'], function ($) {
	'use strict';
    return {
		'onClick': function (e) {
			var curr = $(e.currentTarget);
			var allCheckbox = curr.parent().next();
			var mainCheckbox = allCheckbox.find('.checkbox.new');
			var ulWrapper = mainCheckbox.next();
			
			if(!$(curr).hasClass('active')){
				curr.addClass('active');
				allCheckbox.slideDown('300');
				
				if(!$(mainCheckbox).hasClass('active')){
					ulWrapper.slideDown('600');
				}
				
			}
			else{
				curr.removeClass('active');
				allCheckbox.slideUp('300');
			}
		
			
		},
		
		// 1 div  height auto;
		//posle checkbox new  ehight auto
		
		
		'validation': function(e){
			var curr = $(e.currentTarget);
			var ulWrapper = curr.next();
			var height	= ulWrapper.height();
			if(!$(curr).parent().hasClass('active')){
				var currHeight = ulWrapper.attr('data-height');
				ulWrapper.animate({'height':currHeight},300);
				
			}
			else{
				ulWrapper.attr('data-height',height);
				ulWrapper.animate({'height':0},300);
				
			}
		},
		
       	
        'init': function () {
        	
        	//$('.music ul li div div').css('height', 'auto');
			
            $('body').on(window.clickend, '.block-passions h2 a', $.proxy(this.onClick, this));
            $('body').on(window.clickend, '.music ul li div .checkbox.new', $.proxy(this.validation, this));  
        }
    };
});