define(['jquery', 'lib/iscroll'], function ($) {
    return {
        iScrollSnap:'li',
        iScrolls: new Array(),
        updateTimeOut: null,
        touchScroll: true,

        'onTableTab': function (e) {
            var $this = $(e.currentTarget),
                parent = $this.parent();
            
            if (parent.hasClass('active')) return;
            
            var tabs = $this.closest('table'),
                contentsHolder = tabs.next().stop(),
                contents = contentsHolder.children(),
                currIndex = tabs.find('.active').index(),
                currDiv = contents.eq(currIndex).stop(),
                nextIndex = parent.index(),
                nextDiv = contents.eq(nextIndex).stop(),
                nextHeight = nextDiv.show().height();
            
            nextDiv.hide();
            
            contentsHolder.height(contentsHolder.height()).animate({height: nextHeight}, window.msie8 ? 0 : 'normal');
            currDiv.animate({opacity: 0}, window.msie8 ? 0 : 'normal', function () {
                $(this).hide();
                nextDiv.show().animate({opacity: 1}, window.msie8 ? 0 : 'normal', function () {
                    contentsHolder.stop().height('auto');
                });
            });
            
            tabs.find('td').removeClass('active');
            parent.addClass('active');
        },
        
        'onDivTab': function (e) {
            var $this = $(e.currentTarget);
            if($this.parents('.guests').size() || $this.parents('.musicians-singles').size() || $this.parents('.musicians-albums').size()){
                e.preventDefault();
                var activeIndex = $this.index(),
                    mobileTabsWrapper = $this.parents('.top').find('.dropdown-selectbox'),
                    mobileTabs = $('.dropdown-items', mobileTabsWrapper).find('a').removeClass('active'),
                    title = mobileTabs.eq(activeIndex).addClass('active').text();
                $('.dropdown-toggle', mobileTabsWrapper).text(title);
            }

            if ($this.hasClass('active')) return;
            
            var self = this,
                tabs = $this.closest('.tabs'),
                contentsHolder = tabs.parent().next().stop(),
                contents = contentsHolder.children(),
                currIndex = tabs.find('.active').index(),
                currDiv = contents.eq(currIndex).stop(),
                nextIndex = $this.index(),
                nextDiv = contents.eq(nextIndex).stop().show(),
                iscroll = nextDiv.find('.iscroll');
            
            if (iscroll.size()) self.iscrollInit(iscroll);
            
            var nextHeight = nextDiv.height();
            nextDiv.hide();
            
            contentsHolder.height(contentsHolder.height()).animate({height: nextHeight}, window.msie8 ? 0 : 'normal');
            currDiv.animate({opacity: 0}, window.msie8 ? 0 : 'normal', function () {
                $(this).hide();
                nextDiv.show().animate({opacity: 1}, window.msie8 ? 0 : 'normal', function () {
                    contentsHolder.stop().height('auto');
                });
                if (iscroll.size()) self.iscrollInit(iscroll);
            });
            
            tabs.find('.active').removeClass('active');
            $this.addClass('active');
        },
        
        'iscrollInit': function (elems) {
            var self = this;
            
            elems.each(function () {
                var $this = $(this).show(),
                    iscroll = $this.data('iscroll');
                
                var width = $this.width() + ($this.data('space') || 0),
                    holder = $this.children(),
                    blocks = holder.children(),
                    amount = blocks.size(),
                    nav = $this.closest('.tabs-contents').parent().children('.top').find('.nav');

                nav.children().not('.all').remove();
                
                if (amount > 1) {
                    var navInner = '';
                    if (!window.mobile || true) {
                        navInner += '<a class="prev"></a>';
                    }
                    for (var i = 0; i < amount; i++) {
                        navInner += '<a data-i="' + i + '" class="disk' + ((iscroll && i == iscroll.currPageX) || (!iscroll && i == 0) ? ' active' : '') + '"></a>';
                    }
                    if (!window.mobile || true) {
                        navInner += '<a class="next"></a>';
                    }
                    
                    nav.html(nav.html() + navInner).off('click touchend')
                        .on('click', '.prev', function (e) {
                            var iscroll = $this.data('iscroll'),
                                curr = iscroll.currPageX - 1;
                            
                            $this.data('iscroll').scrollToPage(curr, 0, 1000);
                        })
                        .on(window.mobile ? 'touchend' : 'click', '.disk', function (e) {
                            var index = $(e.currentTarget).data('i');
                            $this.data('iscroll').scrollToPage(index, 0, 1000);
                        })
                        .on('click', '.next', function (e) {
                            var iscroll = $this.data('iscroll'),
                                curr = iscroll.currPageX + 1;
                            
                            $this.data('iscroll').scrollToPage(curr, 0, 1000);
                        });
                    
                    if (window.msie8) setTimeout(function () {nav.children().removeClass('active').filter('.disk').eq(0).addClass('active');}, 0);
                    
                    holder.width(width * amount);
                    blocks.width(width);
                    
                    if (!iscroll) {
                        var iscrollObj=new iScroll($this[0], {
                            momentum: false,
                            snap: self.iScrollSnap,
                            hScrollbar: false,
                            vScrollbar: false,
                            noTouchEvents: !self.touchScroll,
                            onScrollEnd: function () {
                                nav.children('.disk').removeClass('active').eq(this.currPageX).addClass('active');
                            }
                        });
                        self.iScrolls.push(iscrollObj);
                        $this.data('iscroll', iscrollObj);
                        
                        if (!window.mobile) $this.data('iscroll').disable();
                    } else {
                        iscroll.refresh();
                        curr = iscroll.currPageX;
                        iscroll.scrollToPage(curr, 0, 0);
                    }
                }
            });
        },

        'onWriteType': function(e){
            e.preventDefault();
            var $this = $(e.currentTarget);
            if($this.hasClass('active')) return;
            var wrapper = $this.parents('.musician-write').eq(0);

            $('.types a', wrapper).removeClass('active');
            var type = $this.prop('class');
            $this.addClass('active');
            $('fieldset', wrapper).stop().hide();
            $('fieldset.'+type, wrapper).stop().fadeIn(function() {
              wrapper.trigger('changed', $this);
            });
        },
        'init': function (iScrollSnap, touchScroll) {
            var self = this;
            if(iScrollSnap)this.iScrollSnap = iScrollSnap;
            if(iScrollSnap)this.touchScroll = touchScroll;
            
            $('table.tabs').each(function () {
                $(this).on(window.mobile ? 'touchend' : 'click', 'a', $.proxy(self.onTableTab, self));
            });
            
            $('div.tabs').each(function () {
                $(this).on(window.mobile ? 'touchend' : 'click', 'a', $.proxy(self.onDivTab, self));
            });
            
            var recreateIScroll = function(){
                $('.tabs-contents').each(function () {
                    self.iscrollInit($(this).children('div').filter(':visible').find('.iscroll'));
                });

                $('body').on( window.clickend, '.musician-write .types a', $.proxy(self.onWriteType, self));
            }

            $(window).on("resize",function(){
                if(self.updateTimeOut)clearTimeout(self.updateTimeOut);
                self.updateTimeOut = setTimeout(recreateIScroll,200);
            });
        }
    };
});
