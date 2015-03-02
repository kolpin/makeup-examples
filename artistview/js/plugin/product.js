define(['jquery', 'lib/iscroll', 'jqueryui', 'touch-punch', 'fileuploader'], function ($) {

    return {

        'onSelectImage': function(event, ui){
            console.log(ui);
        },
        'onMainImageSelect':function(e){
            var container = $(e.currentTarget).parent().parent(),
                items = container.children().removeClass('active');

            $(e.currentTarget).parent().addClass('active');
        },
        'init': function () {
            var self = this;
            var sortable = $('.product-images ul').sortable({
                'handle': 'img',
                'update':function(event, ui){

                }
            });

            $('body').on('click touchend', '.product-images ul li > span', $.proxy(this.onMainImageSelect, this));
        }
    };
    
});
