define(['jquery', 'lib/iscroll'], function ($) {
    return {
        'onTooltipClick': function(e){
            e.preventDefault();
            var $this = $(e.currentTarget).toggleClass('active'),
                holder = $this.children();
            if($(window).width() <= 739){
                var top = (holder.height());
                holder.css({'top':  -top + 'px'});
            }else{
                var top = (holder.height() / 2) + 3;
                holder.css({'top':  -top + 'px'});
            }

            if($this.hasClass('active')){
                holder.stop().fadeIn(300, function(){
                    holder.css('opacity', 1);
                });
            }else{
                holder.stop().fadeOut(300, function(){
                    holder.css('opacity', 0);
                });
            }
        },
        'onTooltipHover':function(e){
            var $this = $(e.currentTarget),
                holder = $this.children();
            if($this.hasClass('active') || $(window).width() <= 769) return;
            var top = (holder.height() / 2) + 3;
            holder.css({'top':  -top + 'px'}).stop().fadeIn(300, function(){
                holder.css('opacity', 1);
            });

        },
        'onTooltipOut':function(e){
            var $this = $(e.currentTarget);
            if($this.hasClass('active') || $(window).width() <= 739) return;
            $this.children().stop().fadeOut(300, function(){
                holder.css('opacity', 0);
            });
        },
        'init':function(){
            $('body').on(window.clickend, '.tooltip', $.proxy(this.onTooltipClick, this));
            $('.tooltip').hover($.proxy(this.onTooltipHover, this), $.proxy(this.onTooltipOut, this));
        }
    }
});