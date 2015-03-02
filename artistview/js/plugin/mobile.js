define(['jquery'], function () {
    return {
        'onSearchTouch': function (e) {
            var self = this,
                $this = $(e.currentTarget),
                target = $(e.target),
                input = $this.find('input'),
                hide = function () {
                    $this.removeClass('open').stop().animate({width: 50});
                    input.stop().animate({opacity: 0}, function () {
                        input.trigger('blur');
                    });
                    $('body').off('.searchOff');
                };
            
            if (!$this.hasClass('open')) e.preventDefault();
            if (!target.is('button')) return;
            
            if ($this.toggleClass('open').hasClass('open')) {
                $this.stop().animate({width: '100%'});
                input.stop().animate({opacity: 1});
                $('body').on(window.clickend+'searchOff', function (e) {
                    var $target = $(e.target);
                    if (!$target.is('#search') && !$target.closest('#search').size()) hide();
                });
            } else {
                hide();
            }
        },
        
        'onNavTouch': function (e) {
            var $this = $(e.currentTarget),
                nav = $this.closest('nav'),
                links = nav.children(),
                hide = function () {
                    nav.removeClass('open');
                    links.removeClass('active');
                    $this.addClass('active');
                    links.not('.active').stop().animate({height: 0});
                    $('body').off('.navOff');
                };
            
            if (nav.hasClass('open')) {
                hide();
            } else if ($this.hasClass('active')) {
                e.preventDefault();
                nav.addClass('open');
                links.stop().animate({height: 40});
                
                $('body').on(window.clickend+'.navOff', function (e) {
                    var $target = $(e.target);
                    if (!$target.parent().is('nav')) hide();
                });
            }
        },
        
        'init': function () {
            $(window).on('resize', $.proxy(function () {
                $('body').off('.mobile');

                if ($(window).width() <= 739) {
                    $('body')
                        .on(window.clickend+'.mobile', '#search', $.proxy(this.onSearchTouch, this))
                        .on(window.clickend+'.mobile', 'nav a', $.proxy(this.onNavTouch, this));
                }
            }, this)).trigger('resize');

        }
    };
});