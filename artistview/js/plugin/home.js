define(['jquery', 'lib/video', 'selectbox'], function ($) {
    return {
        onResize: function () {
            this.ww = $(window).width();
            this.wh = $(window).height();
            
            if (this.video) {
                var width = 720,
                    height = 400,
                    w = this.node.width(),
                    h = this.node.height(),
                    r = w / h,
                    video = $(this.video.a).children('video, object').removeAttr('style').show();
                
                if (w * height / width > h) {
                    height = w * height / width;
                    video.css({left: 0, top: -(height - h) / 2, width: w, height: height});
                } else {
                    width = h * width / height;
                    video.css({top: 0, left: -(width - w) / 2, width: width, height: h});

                }
            }
        },
        
        onMouseMove: function (e) {
            var self = this,
                x = e.pageX / this.ww * 2 - 1,
                y = e.pageY / this.wh * 2 - 1;
            
            this.covers.eq(0).each(function (i) {
                var $this = $(this);
                if (x < 0) $this.css({left: 70 * (-x)}, 5);
                else $this.css({left: 70 * (-x)}, 5);
                if (y < 0) $this.css({top: 70 * (-y)}, 5);
                else $this.css({top: 70 * (-y)}, 5);
            });
        },
        
        onMouseLeave: function () {
            this.covers.eq(0).stop().animate({left: 0, top: 0}, 500);
        },

        popupShow: function(e){
            //DATE PICKER
            $.fn.mobileDate();
        },
        
        init: function () {
            if (!(this.node = $('#home')).size()) return;
            
            var text = this.node.children('.text')
                .on('mousemove', $.proxy(this.onMouseMove, this))
                .on('mouseleave', $.proxy(this.onMouseLeave, this));
            this.covers = this.node.children('.cover').children();
            
            if (window.mobile) {
                $('#video').remove();
            } else {
                this.video = videojs('video');
            }
            
            $(window).on('resize.home', $.proxy(this.onResize, this)).trigger('resize');
        }
    };
});