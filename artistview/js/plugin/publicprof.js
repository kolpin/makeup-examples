define(['jquery'], function ($) {
	'use strict';
    return {
    	

    	'userList' : function (e) {
    	
    		this.users = ['john', 'mike', 'bill', 'clint', 'sam', 'mick'];
    		var input = $(e.target);
    		var searchResult = $.trim(input.val());
    		var ul = input.next().find('ul');

	   		if (searchResult !== '') {
	   			ul.html('');
	   			for (var v in this.users) {
	   				var name = this.users[v].toLowerCase();
	   				searchResult = searchResult.toLowerCase();
				 	var n = this.users[v].indexOf(searchResult);
				 	var user = this.users[v];

					if (n > -1) {
						$('input:focus').next().slideDown(0);
						if (e.keyCode !== 8){
							$('.user-list ul').append('<li data-id="'+ v +'">'+ this.users[v] +'</li>');
						};
					};
	   			};
				$('.user-list ul li').on('click', this.selectUser);
				$('.user-list ul li').on('click', this.addUserBlock);
   			} else {
   				$('.user-list').slideUp(0);
   				//$('.user-list ul li ').replaceWith('');
   			};
   		},

	   	'selectUser' : function(e) {
	   		this.userName = $(this).text();
	   		var userId = $(e.target).data('id');
	   		var input = $(e.target).parent().parent().prev();
	   		 input.attr('data-id', userId);
	   		 input.val(this.userName);
	   		 $(this).parent().parent().slideUp(0);
	   	},
	   	
	   	'addUserBlock' : function (e){
	   		var input = $(e.target).parent().parent().prev();
	   		var name = input.val();
			var valueOfInput = '<div class="people"><div><img src="img/albums-edit/people.png" />'+name+' <a href="#" class="rect del"></a></div></div>';
			input.closest('.right-wrapper').prepend(valueOfInput);
			
			
		//hiding name when clicked on close
			
			$('a.rect.del').on('click', function () {
				var liHeight = $(this).closest('div').height();
    			$(this).closest('div').fadeOut(200);
    			$(this).closest('.people').fadeOut(200);    		
    				return false;
    		});
		// 
    	},
    	    	

    	
    	

    	'init' : function () {

			$(document).click(function () {
				$('.user-list').hide();
				$('.people-input').val('');
			
			});
			
			$('input.people-input').on('keyup', $.proxy(this.userList, this));
			$('.button.black').on('click', $.proxy(this.blockUser, this));


    	}
    	
	};

});