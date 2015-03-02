define(['jquery', 'lib/iscroll'], function ($) {
    return {
        'onTypeChange': function (e) {
            this.types.removeClass('active');
            
            var self = this,
                $this = $(e.currentTarget).addClass('active'),
                index = $this.index();
            
            this.blocks.hide().eq(index).show();
        },
        
        'init': function () {
            this.node = $('.musician-write');
            this.types = this.node.find('.types').children().on(window.clickend, $.proxy(this.onTypeChange, this));
            this.blocks = this.node.find('fieldset');
        }
    };
});