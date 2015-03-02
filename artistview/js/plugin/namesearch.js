define(['jquery'], function ($) {
	'use strict';
    return {

    	'userList' : function (e) {
    		this.users = ['John', 'mike', 'bill', 'clint',
    		'sam', 'yohn', 'mick',];
    		var input = $(e.target);
    		var searchResult = $.trim(input.val());
    		
    		var ul = $('.user-list ul');
    		
	   		if (searchResult !== ''){
	   			ul.html('');
	   			for (var v in this.users) {
	   				var name = this.users[v].toLowerCase();
	   				searchResult = searchResult.toLowerCase();
				 	var n = this.users[v].indexOf(searchResult);
					if (n > -1) {
						
						$('.user-list').slideDown(0);
								if(e.keyCode !== 8){
								$('.user-list ul ').append('<li data-id="'+ v +'">'+ this.users[v] +'</li>');
							};
							
					};	
	   			};
				$('.user-list ul li').on('click', this.selectUser);

   			} else {
   				$('.user-list').slideUp(0);
   			};
   		},

	   	'selectUser' : function(e) {
	   		var userName = $(this).text();
	   		this.userName = userName;
	   		var userId = $(e.target).data('id');
	   		$('#users').attr('data-id', userId);
	   		$('.target-input').val(this.userName);
	   		$('.user-list').slideUp(0);
	   	},
	   	
	   	'addUserBlock' : function (e){
	   		var userId = $('#users').attr('data-id');
			$('.blocked-users').append('<div><img src="img/userpic.jpg" alt="" /><a href="#" class="rect del"></a><p><span class="blocked-user-name">'+ this.users[userId] +'</span><br><small>Drummer (Vocalist, Guitarist)</small></p></div>');
 			
 			var input = $(e.currentTarget).parent().prev();
 			input.val('');
 			
 			$('.rect.del').on('click', function () {
				$(this).closest('div').fadeOut(100).remove();
				return false;
			});			
			
		},
    	
    	

    	

    	'init' : function () {
    					
			$('.rect.del').on('click', function () {
				$(this).closest('div').fadeOut(100).remove();
				return false;
			});			
    					
			$(document).click(function () {
				$('.user-list').hide();
				
			});
			


			$('input#users').on('keyup', $.proxy(this.userList, this));
			$('.button.black').on('click', $.proxy(this.addUserBlock, this));

    	}
    	
	};

});




