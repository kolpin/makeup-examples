define(['jquery', 'easing'], function ($) {
  return {
    'onMouseMove': function(e) {
      if ($(window).width() > 1023) {
        var x = Math.sin(e.pageX / $(window).width()) * 100,
          y = Math.sin(e.pageY / $(window).height()) * 100;

        if (x < 0) this.controls.css({backgroundPositionX: x });
        else this.controls.css({backgroundPositionX: -x});

        if (y < 0) this.controls.css({backgroundPositionY: y});
        else this.controls.css({backgroundPositionY: -y});
      }
    },

    'init': function() {
      var video_wrap = $('.video_wrap'),
        video = video_wrap.find('video'),
        controls = video_wrap.find('.controls');

      this.controls = controls;

      controls.find('li:nth-child(1)').animate({left: 0}, 600, 'easeInQuad');

      controls.find('li:nth-child(2)').animate({left: 0}, 600, 'easeOutQuad');

      controls.find('li:nth-child(3)').animate({opacity: 1}, 600, 'easeInExpo');

      controls.find('li:nth-child(4)').animate({right: 0}, 600, 'easeOutQuad');

      controls.find('li:nth-child(5)').animate({right: 0}, 600, 'easeInQuad');

      controls.find('.play_video').on('click', function(e) {
        e.preventDefault();
        controls.fadeOut(function() {
          video.fadeIn(function() {
            video.get(0).play();
          });
        });
      });

      controls.on('mousemove', $.proxy(this.onMouseMove, this));
    }
  };
});
