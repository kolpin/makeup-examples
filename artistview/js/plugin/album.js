define(['jquery', 'jqueryui'], function ($) {
    return {
        'template' :
            '<li>\
                <div class="ago">{ago}</div>\
                <img class="img" src="{img}" alt="{alt}" title="{title}">\
                <div class="txt">\
                    <strong class="name">{name}</strong>\
                    {text}\
                </div>\
            </li>',
        'onFormButtonClick': function (e) {
            var data = {};
            var textarea = $('#comment_form [name="text"]');
            data.name = 'Andy';
            data.text = textarea.val();
            data.img = $('#comment_form img').attr('src');
            data.ago = '1 min ago';
            if (!this.checkData(data.text)) {
                textarea.addClass('error');
            } else {
                textarea.removeClass('error');
                this.addData(data);
                //this.sendAjax('ajax.php', data);
            }
            return false;
        },

        'checkData': function(text) {
            text = $.trim(text);
            if (!text) return false;
            else return true;
        },

        'addData': function (data) {
            var $before = $('.comments_area li.new');
            var tmp = this.template,
                txt = data.text;
            txt = txt.replace(/</g, '&lt;');
            txt = txt.replace(/>/g, '&gt;');
            tmp = tmp.replace('{img}', data.img);
            tmp = tmp.replace('{name}', data.name);
            tmp = tmp.replace('{text}', txt);
            tmp = tmp.replace('{ago}', data.ago);
            $before.before(tmp);
            $before.find('.txt').val('');
        },

        /*'sendAjax': function (link, data) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: link,
                data: data,
                success: function(data) {
                },
                failure: function (data) {
                    alert('Epic fail');
                }
            });
        },*/

        'onBlocksLoad': function () {
            $('.album_block').each(function() {
                var h = $(this).find('.txt').height();
                var status = $(this).data('closed');
                if (status) $(this).addClass('closed');
                $(this).attr('data-height', h);
            });
        },

        'stopAni': false,
        'aniTime': 1000,

        'onBlockClick': function (e) {
            if (this.stopAni) return false;
            var _this = this;
            this.stopAni = true;
            var $this = $(e.currentTarget).parent();
            var $txt = $this.find('.txt');
            if ($this.hasClass('closed')) {
                $txt.css('height', 0);
                $txt.css('opacity', 0);
                $this.removeClass('closed');
                $txt.animate({
                    'height': $this.data('height'),
                    'opacity': 1
                }, _this.aniTime, function() {
                    _this.stopAni = false;
                });
            } else {
                $txt.animate({
                    'height': 0,
                    'opacity': 0
                }, _this.aniTime, function() {
                    $this.addClass('closed');
                    _this.stopAni = false;
                });
            }
        },

        'setWidth': function() {
            var max_w = 250;
            $('#album_list ul li div .title').each(function() {
                var w = $(this).width();
                if (w > max_w) max_w = w;
            });
            if (max_w > 250) {
                $('#album_list ul li div .title').each(function() {
                    $(this).width(max_w);
                });
            }

           var body_width = $(window).width();
            if(body_width >= 739){
                //$('.block-album-cover').insertBefore('.center-top h1.title');
                $('.image-gallery-info .text').removeAttr('style');
                $('.comments form textarea').removeAttr('style');
            }else if(body_width < 739){
                //$('.block-album-cover').insertBefore('.center-top h1.title');
                var container_width = $('.image-gallery-info').width();
                var pic_width = $('.pic').outerWidth();
                var title_width = container_width - pic_width - 40;
                $('.image-gallery-info .text').width(title_width);
                var fswidth = $('.comments form').width();
                $('.comments form textarea').width(fswidth - 95);
            }

            $(window).resize(function () {
                var body_width = $(window).width();
                if(body_width >= 739){
                    //$('.block-album-cover').insertBefore('.center-top h1.title');
                    $('.image-gallery-info .text').removeAttr('style');
                    $('.comments form textarea').removeAttr('style');
                }else if(body_width < 739){
                    //$('.block-album-cover').insertBefore('.center-top h1.title');
                    var container_width = $('.image-gallery-info').width();
                    var pic_width = $('.pic').outerWidth();
                    var title_width = container_width - pic_width - 40;
                    $('.image-gallery-info .text').width(title_width);
                    var fswidth = $('.comments form').width();
                    $('.comments form textarea').width(fswidth - 95);
                }

            });


        },
        onMoreDescription: function(e){
            e.preventDefault();
            var link = $(e.currentTarget),
                block = link.parent().toggleClass('exp'),
                text = block.parent('.text').toggleClass('exp');

        },
        'init': function () {
            this.setWidth();
            this.onBlocksLoad();
            $('body').on(window.clickend, '.album_block button', $.proxy(this.onBlockClick, this))
                .on(window.clickend, '#comment_form button', $.proxy(this.onFormButtonClick, this))
                .on(window.clickend, '.text p .more', $.proxy(this.onMoreDescription, this));

            $(".image-gallery.new ul li").hover(function(){
                $("span",this).stop().slideDown("fast");
            },function(){
                $("span",this).stop().slideUp("fast");
            });

        }
    };
});