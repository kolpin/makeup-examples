define(['jquery'], function ($) {
    return {
    	
    	'money' : function () {
    		
    		// dummy var
    		
    		var donated = 20000000,
    			box = $('.scriptnumber');
    			
    		box.html('$'+ donated);
    	},
    	
    	'placeholder' : function () {
    		
    		var text = $('.comment'),
    			textval = text.val();
    		
    		console.log(textval);
    	},
    	
    	'init' : function () {

    		
    		var donated = 2000000,
    			box = $('.scriptnumber');
    			
    		box.html('$'+ donated);
    		
    		
    		
    		
    		var text = $('.comment'),
    			textval = text.val();
    		

    		
    		text.on('click', function(){
    			text.val(' ');
    		});
    	}
    	
	};

});