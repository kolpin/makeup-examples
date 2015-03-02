define(['jquery', 'lib/iscroll'], function ($) {
    return {
        'onClick': function (e) {
            var $this = $(e.currentTarget).toggleClass('active'),
                block = $this.parent().next().stop(),
                currH = block.height(),
                H = block.height('auto').height();
            
            block.height(currH).animate({height: $this.hasClass('active') ? H : 0});
        },
        'initActive':function(){
            $('.block-store-menu h2 a').each(function(){
                var $this = $(this),
                    block = $this.parent().next().stop(),
                    H = block.height('auto').height();
                    block.height(($this.hasClass('active') ? H : 0));
            });
            $('.block-passions h2 a').each(function(){
                var $this = $(this),
                    block = $this.parent().next().stop(),
                    H = block.height('auto').height();
                block.height(($this.hasClass('active') ? H : 0));
            });
        },
        'init': function () {
            $('body').on(window.clickend, '.block-passions h2 a, .block-store-menu h2 a', $.proxy(this.onClick, this));
            this.initActive();
        }
    };
});