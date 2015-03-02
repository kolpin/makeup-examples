define(['jquery'], function ($) {
    return {
        // 'onWhoAreYou': function (e) {
            // e.preventDefault();
            // var $this = $(e.currentTarget),
                // fHeaders = this.more.children().find('h3:first'),
                // fUl = fHeaders.next();
            // this.whoYouAre.filter('.active').removeClass('active').find('input').prop('checked', false);
            // $this.addClass('active').find('input').prop('checked', true);
// 
            // if($this.parent().hasClass('business')){
                // $('.hide-business').stop().fadeOut(function(){
                    // $('#business-wrapper').stop().fadeIn();
                // });
            // }else{
                // $('#business-wrapper').stop().fadeOut(function(){
                    // $('.hide-business').stop().fadeIn();
                // });
// 
                // if($this.parent().hasClass('fan')){
                    // fHeaders.each(function(i){
                        // fHeaders.eq(i).stop().animate({height: 0}, function () {
                            // fHeaders.hide();
                        // });
                        // fUl.eq(i).stop().animate({height: 0}, function () {
                            // fUl.hide();
                        // });
                    // });
                    // $('.fan-hide').hide();
                // }else{
                    // fHeaders.each(function(i){
                        // fHeaders.eq(i).stop().animate({height: 33}, function () {
                            // fHeaders.show();
                        // });
                        // fUl.eq(i).stop().animate({height: fUl.eq(i).height('auto').height()}, function () {
                            // fUl.show();
                            // fUl.css('height', 'auto');
                        // });
// 
                    // });
                    // $('.fan-hide').show();
                // }
// 
                // if (this.inited) return;
                // this.inited = true;
// 
                // var block = this.whatsYourPassion.parent().parent().parent(),
                    // H = block.height('auto').height();
// 
                // block.height(0).animate({height: H, opacity: 1});
            // }
// 
// 
// 
// 
        // },
        
        'onWhatsYourPassion': function (e) {
            e.preventDefault();
            
            var $this = $(e.currentTarget).toggleClass('active'),
                parent = $this.parent().toggleClass('active'),
                index = $this.parent().index(),
                block = this.more.eq(index).children().stop(),
                currH = block.height(),
                H = block.height('auto').height();
            
            $this.find('input').prop('checked', $this.hasClass('active'));

            if ($this.hasClass('active')) {


                block.height(currH).show().animate({opacity: 1, height: H}, function () {
                    $(this).height('auto');
                    //open the more block
                    var mparent = block.closest('fieldset').addClass('active'),
                        mblock = mparent.children().children('div').stop(),
                        mcurrH = mblock.height(),
                        mH = mblock.height('auto').height();

                    mblock.height(mcurrH).animate({height: parent.hasClass('active') ? mH : 0}, function () {
                        if (mparent.hasClass('active')) $(this).height('auto');
                    });
                });
                if (this.whatsYourPassion.filter('.active').size() == 1) {
                    this.whatsYourPassionPrimary.children().prop('checked', false);
                    this.whatsYourPassionPrimary.eq(index).addClass('active').children().prop('checked', true);

                    block.parent().addClass('primary');
                } else {
                    this.whatsYourPassionPrimary.eq(index).removeClass('active').children().prop('checked', false);
                    block.parent().removeClass('primary');
                }
            } else {
                block.height(currH).animate({opacity: 0, height: 0}, function () {
                    $(this).hide();
                });
                if (block.parent().hasClass('primary')) {
                    this.whatsYourPassionPrimary.eq(index).removeClass('active').children().prop('checked', false);
                    block.parent().removeClass('primary');
                    var active_index = this.whatsYourPassion.filter('.active').eq(0).next().addClass('active').parent().index();
                    this.more.eq(active_index).addClass('primary');
                    this.whatsYourPassionPrimary.eq(active_index).children().prop('checked', true);
                }
            }
        },
        
        'onWhatsYourPassionPrimary': function (e) {
            var $this = $(e.currentTarget),
                index = $this.parent().index();
            
            if ($this.hasClass('active')) return;
            
            var i = this.more.filter('.primary').index();
            
            this.whatsYourPassionPrimary.eq(i).removeClass('active');
            this.more.eq(i).removeClass('primary');
            this.whatsYourPassion.eq(index).next().addClass('active');
            this.more.eq(index).addClass('primary');
        },
        
        'onCheckbox': function (e) {

            if ($(e.target).is('a')) return;
            e.preventDefault();

            var $this = $(e.currentTarget).toggleClass('active'),
                input = $this.find('input'),
                parent = $this.parent(),
                group = parent.children('.checkbox');

            input.prop('checked', $this.hasClass('active'));

            if (parent.parent().hasClass('checkbox-group')) {

                if (parent.find('.checkbox.active').size()) {
                    parent.parent().children('.checkbox').addClass('active').find('input').prop('checked', true);
                } else {
                    parent.parent().children('.checkbox').removeClass('active').find('input').prop('checked', false);
                }
            }

            if (parent.hasClass('checkbox-group')) {
                if ($this.hasClass('active')) {
                    parent.children('div').children('.checkbox').addClass('active').find('input').prop('checked', true);
                } else {
                    parent.children('div').children('.checkbox').removeClass('active').find('input').prop('checked', false);
                }
            }

            if (parent.parent().find('.checkbox').size() == parent.parent().find('[checked]').size()) {
                parent.parent().prev('h3').find('.checkbox').addClass('active').find('input').prop('checked', true);
            } else {
                parent.parent().prev('h3').find('.checkbox').removeClass('active').find('input').prop('checked', false);
            }
        },
        
        'onCheckboxAll': function (e) {
            e.stopPropagation();
            
            var $this = $(e.currentTarget).toggleClass('active'),
                checkboxes = $this.parent().next().find('.checkbox');
            
            if ($this.hasClass('active')) {
                checkboxes.addClass('active').find('input').prop('checked', true);
            } else {
                checkboxes.removeClass('active').find('input').prop('checked', false);
            }
        },
        
        'onCheckboxGroup': function (e) {
            var $this = $(e.currentTarget).parent().toggleClass('active'),
                group = $this.children('div').stop(),
                currH = group.height(),
                H = group.height('auto').height();
            
            group.height(currH).animate({height: $this.hasClass('active') ? H : 0});
        },
        
        'onMore': function (e) {
            var $this = $(e.currentTarget),
                parent = $this.closest('fieldset').toggleClass('active'),
                block = parent.children().children('div').stop(),
                currH = block.height(),
                H = block.height('auto').height();
            
            block.height(currH).animate({height: parent.hasClass('active') ? H : 0}, function () {
                if (parent.hasClass('active')) $(this).height('auto');
            });
        },

        'addAnotherLocation':function(e){
            e.preventDefault();
            var link = $(e.currentTarget),
                wrapper = link.parents('.another_location').eq(0),
                newLocation = wrapper.clone(true, true);
            newLocation.css('display', 'none');
            newLocation.find('.add_another_location').replaceWith('<a class="remove_another_location button dark" href="#">- remove another location</a>');
            $('.another_location:last').after(newLocation);
            newLocation.slideDown();
        },
        'removeAnotherLocation':function(e){
            e.preventDefault();
            var link = $(e.currentTarget),
                wrapper = link.parents('.another_location').eq(0);

            wrapper.stop().slideUp(function(){
                wrapper.remove();
            });
        },
        'init': function () {
        	this.node = $('#container');
        	if (!this.node.size()) return;

            this.whatsYourPassion = this.node.find('.whats-your-passion').find('.box').on(window.clickend, $.proxy(this.onWhatsYourPassion, this));
            this.whatsYourPassionPrimary = this.whatsYourPassion.next().on(window.clickend, $.proxy(this.onWhatsYourPassionPrimary, this));
//          this.checkboxes = this.node.find('.checkbox').on(window.clickend, $.proxy(this.onCheckbox, this));
            this.checkboxesGroup = this.node.find('.checkbox-group').children('.toggle').on(window.clickend, $.proxy(this.onCheckboxGroup, this));
            this.checkboxesAll = this.node.find('h3 .checkbox').on(window.clickend, $.proxy(this.onCheckboxAll, this));
			this.more = this.node.find('.more').children().on(window.clickend, 'h2 a', $.proxy(this.onMore, this));
            // this.whoYouAre.filter('.active').trigger('click');
            
            $('body').on(window.clickend, '.add_another_location', $.proxy(this.addAnotherLocation, this));
            $('body').on(window.clickend, '.remove_another_location', $.proxy(this.removeAnotherLocation, this));

        }
    };
});