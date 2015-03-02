define(['jquery', 'lib/iscroll', 'selectbox'], function ($) {

    return {
        'onSubmit': function (e) {
            var form = $(e.currentTarget),
                checkboxes = form.find('.checkbox').filter('[data-required]'),
                errors = form.find('.field.error');
            
            if (errors.size()) {
                e.preventDefault();
                return;
            }
            
            checkboxes.each(function () {
                var $this = $(this),
                    field = $this.closest('.field'),
                    input = $this.children('input'),
                    error = $this.data('error');
                
                if (!input.attr('checked')) {
                    $this.one('click', function (e) {
                        $this.next('.error').remove();
                        field.removeClass('error');
                    });
                    field.addClass('error');
                    $('<p>', {'class': 'error', 'html': error}).insertAfter($this).animate({opacity: 1});
                    e.preventDefault();
                }
            });
        },
        
        'remove': function () {
        	
        	$('.rect.del').on('click', function () {
        		
        		$('.people').remove();
        		
        	});
        	
        },


        
        'onBlur': function (e) {
            var $this = $(e.currentTarget),
                field = $this.closest('.field'),
                form = $this.closest('form');
            
            if (!form.size() || !$this.data('required')) return;
            
            $.ajax(form.attr('action'), {
                type: 'post',
                data: {
                    name: $this.attr('name'),
                    value: $this.val()
                },
                success: function (r) {
                    // Just as example we will rewrite 'r' with hardcode.
                    r = 'Password must be at least 4 characters long';
                    
                    if (r) {
                        $this.one('focus', function (e) {
                            $this.next('.error').remove();
                            field.removeClass('error');
                        });
                        field.addClass('error')
                        $('<p>', {'class': 'error', 'html': r}).insertAfter($this).animate({opacity: 1});
                    }
                }
            });
        },
        'onRangeChange': function(e){
            e.preventDefault();
            var range = $(e.currentTarget),
                wrap = range.parent(),
                input = wrap.children('input'),
                value = input.val();
            if(isNaN(value) || value < 1) value = 1;
            if(range.hasClass('plus')){
                value++;
            }else{
                value--;
            }
            if(value < 1) return;
            input.val(value);
        },
        'checkNumber': function(e){
            var charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57))
                return false;
            return true;
        },
        'init': function () {
            $('body')
                .on('blur.forms', 'input', $.proxy(this.onBlur, this))
                .on('submit.forms', 'form', $.proxy(this.onSubmit, this));
				$('a.rect.del').on('click', function () {
					var liHeight = $(this).closest('div').height();
    				$(this).closest('div').fadeOut(200);
    				$(this).closest('.people').fadeOut(200);    		
    				

    				return false;
    			});

            $('select.custom-select').selectbox();

            $('.range').on(window.clickend, "a",  $.proxy(this.onRangeChange, this));
            $('.range input').keypress($.proxy(this.checkNumber, this));
        }
    };
    
});
