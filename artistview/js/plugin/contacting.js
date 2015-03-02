define(['jquery', 'lib/iscroll'], function ($) {
	'use strict';
    return {
		'onClick': function (e) {
			
			var target = $(e.currentTarget);
			this.target = target;
			target.toggleClass('active');
			var expandableDiv = target.parent().next();
			var ul = expandableDiv.find('ul');	
			var li = ul.find('li');
			var checkboxGroup = li.find('div');
			var divWithRadios = checkboxGroup.find('div');
			var trigger = checkboxGroup.find('.checkbox.new');
			var input = trigger.find('input');

			
			
			if (target.hasClass('active'))
			{
				if (trigger.length > 0 )
				{	
					
					expandableDiv.animate({height:140},300);
					divWithRadios.animate({height:100},300);
				}	
				else
				{
					expandableDiv.animate({height:80},300);
					divWithRadios.animate({height:100},300);
					
				};
				
				
			}
			else
				{
					expandableDiv.animate({height:0},300);
					divWithRadios.animate({height:0},300);
				};
				
			
		
		},
		
		'validation': function(e){
			
			var target = $(e.currentTarget);
			this.target = target;
			var divWithRadios = target.next();
			var expandableDiv = target.prev().parent().parent().parent().parent().parent().parent();
			
			
			
			if (target.hasClass('active'))
			{   
				expandableDiv.animate({height:80},{duration:300, queue:false}),
				divWithRadios.animate({height:0, paddingTop:0, opacity:0},{duration:300, queue:false});
			}
			else
			{
				expandableDiv.animate({height:140}, 500, false);
				divWithRadios.animate({height:100, opacity:1}, 200, false);
			}
			
		
				
		},
		
       	
        'init': function () {
        	
            $('body').on(window.clickend, '.block-passions h2 a', $.proxy(this.onClick, this));
             $('body').on(window.clickend, '.music ul li div .checkbox.new', $.proxy(this.validation, this)); 
        }
    };
});