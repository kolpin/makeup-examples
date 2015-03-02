define(['jquery'], function ($) {
    return {
        //zoom percentage, 1.2 =120%
        zoom : 1.2,

        'onHover':function(e){
            if($(window).width() < 739) return;
            //Set the width and height according to the zoom percentage
            var $this = $(e.currentTarget).addClass('zoomin'),
                width = $this.width() * this.zoom,
                height = $this.height() * this.zoom,
                moveLeft = - (width - $this.width()) / 2,
                moveTop = - (width - $this.height()) / 2;

            //Move and zoom the image
            $this.find('img').stop(false,true).animate({'width':width, 'height':height, 'top': moveTop, 'left':moveLeft}, {duration:200});

        },
        'onOut':function(e){
            if($(window).width() < 739) return;
            var $this = $(e.currentTarget).removeClass('zoomin'),
                width = $this.width(),
                height = $this.height();
            //Reset the image
            $this.find('img').stop(false,true).animate({'width': width, 'height': height, 'top':'0', 'left':'0'}, {duration:100});
        },
        'init':function(zoomto){            
            var self = this;
            if(zoomto)self.zoom=zoomto;

            $('.image-gallery ul li > div').hover($.proxy(self.onHover, self),  $.proxy(self.onOut, self));

        }
    }
});