define(['jquery', 'plugin/home', 'plugin/profile', 'lib/scrollbar', 'colorbox'], function ($, Home, Profile, ScrollBar) {
    return {
        currentView: 'index',
        useColorbox: true,
        callback: undefined,

        'show': function (e) {
            e.preventDefault();
            var self = this,
                $this = $(e.currentTarget),
                id = $this.data('template'),
                template = $('#template-' + id).html();


                if($this.parents('.popup').attr('id')=='customize-design'){
                   this.currentView='customize-design';
                }
                else if($this.parents('.popup').attr('id')=='change-profile-picture'){
                   this.currentView='change-profile-picture';
                }
            //console.log(template);
            var clientw =  $(window).width();
            //set delay show popup if user-agent apple
            var isApple = navigator.userAgent.match(/iPhone|iPad|iPod|Safari/i);
            var shodelay =  (id == 'watch-intro') ? 0 : (isApple ? 500 : 300);

            try{
                clearTimeout(window.popuptimeout);
            }catch (e){}

            if ((/*window.mobile && */clientw <= 739)) {
			  if($(template).attr("data-no-mobile-popup")) return;
              window.popuptimeout = setTimeout(function(){
                  self.popup = $(template).appendTo('body').animate({opacity: 1});
                  var video = self.popup.find('video'),
                      v = false;
                  if (video.size()) v = videojs(video.attr('id')).play();
                  if (Home.video) Home.video.pause();
                  $('#container-popup').remove();
                  $('<div>', {'id': 'container-popup'}).insertBefore('#home, #container').append(self.popup);
                  $('#container-popup').blur();
                  $('header').addClass('popuped');
                  $('#home, #container').hide();

                  $("#back").show();

                  $('#back').children().off(window.clickend).on(window.clickend, function (event) {
                      if ((/*window.mobile && */clientw <= 739)) {
                          $('header').removeClass('popuped');
                          $('#home, #container').show();
                      }
                      if (Home.video) Home.video.play();
                      if (v) v.dispose();
                      self.popup.parent().remove();
                  });

                if (typeof self.callback == 'function' && self.callback != '') {
                  self.callback($this);
                }
              }, shodelay);


            } else {

                if(self.useColorbox){
                    $.colorbox({
                        transition: 'fade', //changed to 'none' to avoid blue border when loading
                        close:'',
                        scrolling: false,
                        html:template,
                        onComplete: function(){
                            //$('#cboxWrapper').on(window.clickend, '.close', $.colorbox.close);

                            if(id=='more-photos-albums'|| id=='more-photos'){
                                switch(self.currentView){
                                    case 'change-profile-picture':
                                        $("#"+id+" h2").html('CHANGE PROFILE PICTURE');
                                        break;
                                    case 'customize-design':
                                        $("#"+id+" h2").html('CUSTOMIZE DESIGN');
                                        break;
                                }
                            }
                            else if(id=='edit-category'){
                                var category = $($this).parent().contents()
                                    .filter(function() {
                                        return this.nodeType === 3;
                                    }).eq(2),
                                    valCat = category.text();
                                $('.popup .category-name').val($.trim(valCat));
                                $('#cboxWrapper').on(window.clickend, '.save', function(){
                                    console.log(category[0]);
                                    category[0].textContent = $('.popup .category-name').val();
                                    $.colorbox.close();
                                });
                            }
                            else if(id=='add-category'){
                                $('#cboxWrapper').on(window.clickend, '.save', function(){
                                    var categoryName = $('.popup .category-name').val();
                                    var template =$('<span><a class="delete popup-toggle" data-template="delete-category" href="#"></a><a class="edit popup-toggle" data-template="edit-category" href="#"></a>'+categoryName+'<i>0</i></span>');
                                    $.colorbox.close();
                                });

                            }
                            else if(id=='delete-category'){
                                var valCat=$($this).parent().contents()
                                    .filter(function() {
                                        return this.nodeType === 3;
                                    }).text();
                                $('.popup .title-delete').html($.trim(valCat));
                            }

                            var video = $('#cboxWrapper').find('video'),
                                v = false;


                            if (video.size()){
                                v = videojs(video.attr('id')).play();
                                if(isApple) $('#cboxWrapper').find('.vjs-poster').hide();
                            }

                            if (Home.video) Home.video.pause();

                            if(window.mobile){
                                $('#cboxWrapper').find('.scroller').css('overflow', 'auto');
                            }else{
                                $('#cboxWrapper').find('.scroller').scrollbar();
                            }

                            $('#cboxWrapper').on(window.clickend, '.close, .cancel, .popup-toogle', function (e) {
                                var $this = $(e.currentTarget);

                                try{
                                    if (v) v.dispose();
                                }catch (e){

                                }


                                if (Home.video) Home.video.play();
                                if ($this.hasClass('close') && id === 'customize-design2' && window.msie8) {
                                    $('#ie_bg').remove();
                                }

                                    $.colorbox.close();
                            });

                            if (typeof self.callback == 'function' && self.callback != '') {
                              self.callback($this);
                            }
                        }
                    })
                }else{
                    window.popuptimeout = setTimeout(function(){
                        this.popup = $(template).appendTo('body').animate({opacity: 1});


                        if(id=='more-photos-albums'|| id=='more-photos'){
                            switch(self.currentView){
                                case 'change-profile-picture':
                                    $("#"+id+" h2").html('CHANGE PROFILE PICTURE');
                                    break;
                                case 'customize-design':
                                    $("#"+id+" h2").html('CUSTOMIZE DESIGN');
                                    break;
                            }
                        }

                        var video = this.popup.find('video'),
                            v = false;


                        if (video.size()){
                            v = videojs(video.attr('id')).play();
                            if(isApple) this.popup.find('.vjs-poster').hide();
                        }
                        if (Home.video) Home.video.pause();

                        $('body').css('overflow', 'hidden');
                        this.popup.find('.scroller').scrollbar();
                        this.popup.on('click', function (e) {
                            var $this = $(e.target);

                            if ($this.hasClass('close') || $this.hasClass('cancel') || $this.hasClass('popup-toggle') || $this.parent().is('body')) {
                                if (Home.video) Home.video.play();
                                $(e.currentTarget).animate({opacity: 0}, function () {
                                    $(this).remove();
                                    if (!$('.popup').size()) $('body').css('overflow', 'visible');
                                    if (v) v.dispose();
                                });
                            }
                            if ($this.hasClass('close') && id === 'customize-design2' && window.msie8) {
                                $('#ie_bg').remove();
                            }
                        });

                      if (typeof self.callback == 'function' && self.callback != '') {
                        self.callback($this);
                      }
                    }, shodelay);
                }
            }
            //sign up button

            if (id === 'customize-design2') {
                Profile.colorPickerInit();
            }
        },
        'init': function (onShow) {
            if(typeof onShow != "undefined")this.callback = onShow;
            //$('body').on(window.mobile ? 'touchend' : 'click', '.popup-toggle', $.proxy(this.show, this));
            $('body').on(window.clickend, '.popup-toggle', $.proxy(this.show, this));
        }
    };
});