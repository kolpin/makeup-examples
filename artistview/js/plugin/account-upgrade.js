define(['jquery', 'lib/iscroll'], function ($) {
    return {
        'onHandleClick':function(e){
            e.preventDefault();
            if($(window).width() >= 739){ return false; }

            var icon = $(e.currentTarget),
                wrap = icon.parents('.plan-features').eq(0),
                block = wrap.children('.legend'),
                values = wrap.children('.values');

            if(wrap.hasClass('active')){
                try{
                    block.stop().animate({
                        height: 0},{
                        complete: function(){

                            wrap.removeClass('active');
                            block.hide();
                            values.hide();
                        }
                    });
                }catch (e){
                    wrap.removeClass('active');
                    block.stop().css({'height': '0px', 'display':'none'});
                    values.hide();
                }


            }else{
                values.show();
                var currH = wrap.hasClass('active') ? block.height() : 0,
                    H = block.height('auto').height();

                try{
                    block.stop().height(currH).show().animate(
                        {height: H},{
                            complete: function(){
                                block.prop('style', false);
                                wrap.addClass('active');
                            }
                        });
                }catch (e){
                    block.stop().css({'height': H, 'display':'block'}).prop('style', false);
                    wrap.addClass('active');
                }

            }
            return false;
        },
        'changeTab': function(e){
            e.preventDefault();
            var $this = $(e.currentTarget).parent();
            $this.parent().find('li').removeClass('active');
            $this.addClass('active');
        },
        'init':function(){
            $('.plan-features').on(window.clickend, "a.icon", $.proxy(this.onHandleClick, this));
            $('.subscribe-tabs').on(window.clickend, "a", $.proxy(this.changeTab, this));
        }
    }
});
