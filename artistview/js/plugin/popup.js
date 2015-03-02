define(['jquery'], function () {
    return {
        'show': function (e) {
            var self = this,
                $this = $(e.currentTarget),
                id = $this.data('template'),
                template = $('#template-' + id).html();
            
            this.popup = $(template).appendTo('body').animate({opacity: 1});
            var video = this.popup.find('video'),
                v = false;
            if (video.size()) v = videojs(video.attr('id')).play();

            
            $('<div>', {'id': 'container-popup'}).appendTo('body');
            
            this.popup.on('click', function (e) {
                var $this = $(e.target);
                
                if ($this.hasClass('close') || $this.hasClass('cancel') || $this.parent().is('body')) {
                    $(e.currentTarget).animate({opacity: 0}, function () {
                        $(this).remove();
                        if (v) v.dispose();
                    });
                }
            });
        },
        
        'init': function () {
            $('body').on('click', '[rel="popup"]', $.proxy(this.show, this));
        }
    };
});