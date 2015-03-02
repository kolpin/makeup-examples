define(['jquery', 'jqueryui'], function ($) {
    return {
        'hide': function () {
            if (!this.dropdown) return;
            
            this.dropdown.removeClass('active').stop().animate({opacity: 0}, 200, function () {
                $(this).hide().trigger('dropdown.closed');
            }).parent().removeClass('active');
            $(document).off('.dropdown');
        },
        
        'onToggle': function (e) {
            e.preventDefault();
            var self = this,
                $this = $(e.currentTarget),
                id = '#' + $this.data('dropdown') + '-dropdown',
                stick = $this.data('stick');

            $('.fg-wrapper').removeClass('active');

            if (this.id != id) this.hide();
            
            this.id = id;
            this.dropdown = $(this.id).stop().toggleClass('active');
            this.dropdown.parent().toggleClass('active');
            
            if (this.dropdown.hasClass('active')) {
                this.dropdown.show().animate({opacity: 1}, function () {
                    if (!stick) {
                        $(document).on('click.dropdown', function (e) {
                            var target = $(e.target);
                            if (!target.closest(self.id).size()) self.hide();
                        });
                    }
                });
              self.dropdown.trigger('dropdown.opened');
            } else {
                this.hide();
            }
        },

        'onSelectBoxChange': function (e){
            e.preventDefault();
            var option = $(e.currentTarget).addClass('active'),
                optionText = option.text(),
                optionValue = option.data('value'),
                container = option.parents('.dropdown-items').eq(0),
                wrapper = container.parent(),
                items = container.find('a').not(option).removeClass('active'),
                title = wrapper.children('.dropdown-toggle').text(optionText),
                input = wrapper.children('input').val(optionValue);
            this.hide();
        },
        'onMultiselectChangeCheckbox':function(e){
            var checkbox = $(e.currentTarget),
                wrapper = checkbox.parent().parent(),
                checked = checkbox.is(':checked');
            if(checked){
                wrapper.addClass('active');
            }else{
                wrapper.removeClass('active');
            }
        },
        'onMultiselectChangeRadio':function(e){
            var radio = $(e.currentTarget),
                name = radio.prop('name'),
                container = radio.parents('ul').eq(0);
            $('input[name='+name+']', container).each(function(){
                var wrapper = $(this).parent().parent(),
                    checked = $(this).is(':checked');
                if(checked){
                    wrapper.addClass('active');
                }else{
                    wrapper.removeClass('active');
                }
            });

        },
        'onSelectGroup':function(e){
            e.preventDefault();
            var active = $(e.currentTarget),
                activeSelector = active.data('value'),
                items = active.parents('.dropdown-items').eq(0).find('a').not(active),
                classes = [];

            items.each(function(){
                if($(this).data('value').length)
                    classes.push("." + $(this).data('value'));
            });
            var selector = classes.join(", ");
            var activeBlock = $(selector).filter(":visible");
            activeBlock.hide().addClass('hidden-mobile').removeProp('style');
            $("."+activeSelector).show().removeClass('hidden-mobile').removeProp('style');
        },
        'onSearchAll':function(e){
            var active = $(e.currentTarget),
                title = active.parents('.dropdown-multiselect').eq(0).children('.dropdown-toggle'),
                items = active.parents('.dropdown-items').eq(0).find('input'),
                genreAll = items.filter('.option-all'),
                names = [];

            if(active.hasClass('option-all')){
                items.prop('checked', false);
                items.parent().parent().removeClass('active');
                active.prop('checked', true).parent().parent().addClass('active');

            }else{
                genreAll.prop('checked', false).parent().parent().removeClass('active');
                if(items.filter(':checked').length == 0){
                    genreAll.prop('checked', true).parent().parent().addClass('active');
                }
            }

            items.filter(':checked').each(function(){
                $(this).parent().parent().addClass('active');
                names.push($(this).parent().text());
            });

            title.text(names.join(", "));
        },
        'init': function () {
            $('body').on('click.dropdown', '.dropdown-toggle', $.proxy(this.onToggle, this));
            $('body').on('click.dropdown', '.dropdown-selectbox .dropdown-items a', $.proxy(this.onSelectBoxChange, this));
            $('body').on('click.dropdown change.dropdown', '.dropdown-multiselect input[type=checkbox]', $.proxy(this.onMultiselectChangeCheckbox, this));
            $('body').on('click.dropdown change.dropdown', '.dropdown-multiselect input[type=radio]', $.proxy(this.onMultiselectChangeRadio, this));
            $('.searchall').on('click.dropdown  change.dropdown', 'input[type=checkbox]',  $.proxy(this.onSearchAll, this));
            $('.groups').on('click.dropdown', '.dropdown-items a', $.proxy(this.onSelectGroup, this));

        }
    };
});