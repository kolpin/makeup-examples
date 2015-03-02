define(['jquery'], function ($) {
    return {
        'zi': 70,
        'logs': $(),
        
        'onChatDown': function (e) {
            var $this = $(e.currentTarget);
            
            this.block = $this.parent().css('z-index', ++this.zi);
            this.offset = [e.pageX - this.block.offset().left, e.pageY - this.block.offset().top];
            
            $('body').addClass('unselectable')
                .on('mousemove.chat', $.proxy(this.onChatMove, this))
                .on('mouseup.chat', $.proxy(this.onChatUp, this))
                .on('mouseleave.chat', $.proxy(this.onChatUp, this));
        },
        
        'onChatMove': function (e) {
            var sl = $(document).scrollLeft(),
                st = $(document).scrollTop(),
                l = e.pageX - sl,
                t = e.pageY - st;
            
            this.block.css({left: l - this.offset[0], top: t - this.offset[1]});
            
            this.position(this.block);
        },
        
        'position': function (blocks) {
            var sl = $(document).scrollLeft(),
                st = $(document).scrollTop(),
                ww = $(window).width(),
                wh = $(window).height();
            
            blocks.each(function () {
                var el = $(this),
                    height = el.innerHeight() + 6,
                    width = el.innerWidth() + 12,
                    left = el.offset().left,
                    top = el.offset().top;
                
                if (left - sl < 0) el.css({left: 0});
                if (top - st - 17 < 0) el.css({top: 0 + 17});
                if (left + width + 17> sl + ww) el.css({left: ww - width - 17});
                if (top + height > st + wh) el.css({top: wh - height});
            });
        },
        
        'onChatUp': function () {
            $('body').removeClass('unselectable').off('mousemove.chat mouseup.chat mouseleave.chat');
        },
        
        'onChatClose': function (e) {
            this.chat.stop().animate({opacity: 0}, function () {
                $(this).hide();
            });
            
            this.toggle.parent().removeClass('active');
        },
        
        'onToggle': function (e) {
            var $this = $(e.currentTarget).parent().toggleClass('active'),
                template = $('#template-chat').html();
            
            if ($this.hasClass('active')) {
                this.chat = $(template).appendTo('body').animate({opacity: 1}).on('click', 'li a', $.proxy(this.onChatLog, this));
                this.chat.css({left: $(window).width() / 2 - this.chat.innerWidth() / 2, top: $(window).height() / 2 - this.chat.innerHeight() / 2});
            } else {
                this.onChatClose();
            }
        },
        
        'onChatLog': function (e) {
            $('body').trigger('click');
            var $this = $(e.currentTarget),
                left = $this.offset().left - $(document).scrollLeft(),
                top = $this.offset().top - $(document).scrollTop(),
                template = $('#template-chat-log').html();
            
            if ($this.hasClass('active')) return;
            $this.addClass('active');
            
            var log = $(template).appendTo('body').animate({opacity: 1}).on('click', '.close', $.proxy(this.onLogClose, this)).data('toggle', $this).css('z-index', ++this.zi),
                l = Math.floor(left + $this.innerWidth() + 30),
                t = Math.floor(top - 40);
            
            this.logs = this.logs.add(log);
            log.css({left: l, top: t});
            this.position(log);
            if (l != parseInt(log.css('left'))) {
                log.css({left: left - log.innerWidth() - 50});
            }
        },
        
        'onLogClose': function (e) {
            var $this = $(e.currentTarget),
                block = $this.parent();
            
            block.stop().animate({opacity: 0}, function () {
                $(this).hide();
            });
            block.data('toggle').removeClass('active');
        },
        
        'onChatFocus': function (e) {
            $(e.currentTarget).css('z-index', ++this.zi);
        },
        
        'onResize': function () {
            this.position(this.logs);
        },
        
        'init': function () {
            var self = this;
            
            this.toggle = $('#chat-toggle').on(window.clickend, $.proxy(this.onToggle, this));
            $('body')
                .on('mousedown.chat', '.chat-log h2', $.proxy(this.onChatDown, this))
                .on('mousedown.chat', '.chat-log', $.proxy(this.onChatFocus, this))
                .on(window.clickend+'.chat', '#chat .close', $.proxy(this.onChatClose, this))
                .on(window.clickend+'.chat', '#chat-dropdown li a', $.proxy(this.onChatLog, this));
            
            $(window)
                .on('resize.chat', $.proxy(this.onResize, this));
        }
    };
});