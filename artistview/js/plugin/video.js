define(['jquery'], function ($) {
    return {
        'onClick': function() {
           // var _class = $('.video_carousel .play').attr('class');
            var _class = $('.video_container .play').attr('class');
            var id = this.carousel.current + 1;
            if (_class.indexOf('stop') === -1) this.play(id);
            else this.pause(id, false);
            return false;
        },

        'play': function(id) {
            videojs('video_' + id).play();
            //$('.video_carousel .play').addClass('stop');
            $('.video_container .play').addClass('stop');
        },

        'pause': function(id, secondary_video) {
            var video = videojs('video_' + id);
           // $('.video_carousel .play').removeClass('stop');
            $('.video_container .play').removeClass('stop');
            video.pause();
            if (secondary_video) {
                var time = video.currentTime();
                videojs(secondary_video).currentTime(time);
            }
        },

        'carousel': {
            count: 0,
            current: 0,
            interval: 2000,
            width: 0,
            container: {},
            init: function() {
                var _this = this;
                _this.container = $('.video_carousel #cont');
                _this.count = _this.container.find('video').length;
                if (_this.count < 2) return;
                _this.width = $('.video_carousel').width();
                $('.video_carousel #cont').width(_this.count * _this.width);
                _this.clone();
            },
            clone: function() {
                var _this = this;
                var firstElem = _this.container.find('div.video_area').first();
                var lastElem = _this.container.find('div.video_area').last();
                firstElem = firstElem.clone();
                lastElem = lastElem.clone();
                firstElem.id = 'dsadad';
                firstElem.appendTo('.video_carousel #cont').attr('id', 'video_last').css('right', -_this.width);
                lastElem.appendTo('.video_carousel #cont').attr('id', 'video_first').css('left', -_this.width);
                $('#video_last').find('video').attr('id', 'video_last_video');
                $('#video_first').find('video').attr('id', 'video_first_video');
            },
            onPrev: function() {
                var _this = this;
                var marginLeft = 0;
                var callback = false;
                this.carousel.current--;
                marginLeft = this.carousel.current * this.carousel.width;
                if (this.carousel.current === -1) {
                    this.pause(this.carousel.current + 2, 'video_last_video');
                    callback = true;
                    this.carousel.current = this.carousel.count - 1;
                }
                this.carousel.container.stop().animate({'marginLeft': - marginLeft}, 1000, function() {
                    if (callback) {
                        _this.carousel.container.css('marginLeft', - _this.carousel.current * _this.carousel.width);
                    }
                });
            },
            onNext: function() {
                var _this = this;
                var marginLeft = 0;
                var callback = false;
                this.carousel.current++;
                marginLeft = this.carousel.current * this.carousel.width;
                if (this.carousel.current === this.carousel.count) {
                    this.pause(1, 'video_first_video');
                    callback = true;
                    this.carousel.current = 0;
                }
                this.carousel.container.stop().animate({'marginLeft': - marginLeft}, 1000, function() {
                    if (callback) {
                        _this.carousel.container.css('marginLeft', 0);
                    }
                });
            }
        },
        'onWindowResize': function(){

        },
        'init': function () {
            this.windowWidth = ($(window).width() >= 739) ? 'wide': 'mobile';
//            $('body').on(window.clickend, '.video_carousel .play', $.proxy(this.onClick, this))
//                .on(window.clickend, '.video_carousel .prev, .prev-next-mobile .prev', $.proxy(this.carousel.onPrev, this))
//                .on(window.clickend, '.video_carousel .next, .prev-next-mobile .next', $.proxy(this.carousel.onNext, this));

            $('body').on(window.clickend, '.video_container .play', $.proxy(this.onClick, this));
            $(window).resize($.proxy(this.onWindowResize, this));
            //this.carousel.init();
        }
    };
});