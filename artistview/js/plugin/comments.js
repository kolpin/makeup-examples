define(['jquery', 'lib/iscroll'], function ($) {
	'use strict';
    return {
		'selection': function (e) {
			
			var target = $(e.currentTarget);
			var div = target.next();
			var labels = div.find('label');
			if (target.hasClass('active'))
			{
				labels.addClass('active');
	 			target.on('click', function () {
	 				labels.removeClass('active');
	 			});
			}
		},

       	
        'init': function () {
             $('body').on(window.clickend, '.block-passions label', $.proxy(this.selection, this));

        }
    };
});