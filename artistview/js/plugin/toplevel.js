define(['jquery', 'lib/iscroll', 'plugin/tabs'], function ($, Iscroll, Tabs) {
    return {
        'onTabChange': function(e){
            var active = $(e.currentTarget),
                wrapper = active.parents('.guests, .musicians-singles, .musicians-albums').eq(0),
                tabs = active.parents('.top').find('.tabs').children().removeClass('active'),
                activeSelector = active.data('value'),
                items = active.parents('.dropdown-items').eq(0).find('a').not(active),
                classes = [];

            items.each(function(){
                if($(this).data('value').length)
                    classes.push("." + $(this).data('value'));
            });

            var selector = classes.join(", "),
                activeBlock = $(selector, wrapper).filter(":visible");
            activeBlock.stop().fadeOut(function(){
                activeBlock.css({'display':'none', 'opacity': 0});

                $("."+activeSelector, wrapper).stop().show(0, function(){
                    tabs.eq($(this).index()).addClass('active');
                    Tabs.iscrollInit($("."+activeSelector, wrapper).find('.iscroll'));
                    $("."+activeSelector, wrapper).stop().animate({'opacity':1});
                });
            });
        },
        'init': function() {
            $('.guests, .musicians-singles, .musicians-albums').on(window.clickend, '.dropdown-items a', $.proxy(this.onTabChange, this));
        }
    };
});

