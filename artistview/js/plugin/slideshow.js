define(['jquery', 'lib/iscroll', 'colorbox'], function ($) {
    return {
        'active': 0,
        
        'onArrowsClick': function (e) {
            var $this = $(e.currentTarget),
                parent = $this.parent(),
                img = parent.children('img').eq(-1),
                slides = parent.children('p'),
                index = this.active - 1 < 0 ? slides.size() - 1 : this.active - 1;
            
            if ($this.hasClass('next')) index = this.active + 1 >= slides.size() ? 0 : this.active + 1;

            img.stop().animate({opacity: 0}, function () {
                $(this).remove();
            });
            $('<img>', {'src': slides.eq(index).data('image')}).insertAfter(img).animate({opacity: 1});
            parent.parent().children('p').html(slides.eq(index).html());
            
            this.active = index;
        },
        'onFullscreenClick':function(e){
            e.preventDefault();
            var $this = $(e.currentTarget),
                parent = $this.parent(),
                img = parent.children('img').eq(-1);
            $.colorbox({
                'href':img.prop('src'),
                'onOpen': function(){
                    $('#cboxTitle').html('<h2>Title</h2>');
                }
            });

        },
        'init': function () {
            this.node = $('div.slideshow');
            
            $('body').on(window.clickend, 'div.slideshow .prev, div.slideshow .next', $.proxy(this.onArrowsClick, this));
            $('body').on(window.clickend, 'div.slideshow .fullscreen', $.proxy(this.onFullscreenClick, this));

        }
    };
});