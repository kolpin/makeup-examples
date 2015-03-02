define(['jquery', 'lib/iscroll'], function ($) {
    return {
        'template':
            '<li>\
                <a href="#" class="search-img design-part">\
                    <img src="img/search/artist.png" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">Nikol</a>\
                    <span class="search-desc">Musician (Vocalist, Guitarist)</span>\
                    <span>Artist</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img song"></a>\
                    <a href="#" class="search-title">All of me</a>\
                    <span class="search-desc">By Daft Punk</span>\
                    <span>Song</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img music-part">\
                        <img src="img/search/album.png" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">Random access Deluxe </a>\
                    <span class="search-desc">Daft Punk</span>\
                    <span>Album</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img video music-part">\
                        <img src="img/search/video.jpg" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">Marbella Sessions </a>\
                    <span class="search-desc">Pink</span>\
                    <span>Video</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img film-part">\
                        <img src="img/search/image.jpg" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">In Perfect World </a>\
                    <span>Image</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img art-part">\
                        <img src="img/search/event.jpg" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">Chicago Music Summit</a>\
                    <span class="search-desc">at Chicago Cultural Center September 20</span>\
                    <span>Event</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img music-part">\
                        <img src="img/search/group.jpg" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">Rock in Chicago</a>\
                    <span class="search-desc">Rock</span>\
                    <span>Group</span>\
                </li>\
                <li>\
                    <a href="#" class="search-img design-part">\
                        <img src="img/search/product.png" alt="">\
                        <i></i>\
                    </a>\
                    <a href="#" class="search-title">T-shirt with Thadeus project portret</a>\
                    <span class="search-desc">$14</span>\
                    <span>Product</span>\
                </li>'
        ,

        'onAutocompile': function(e){

            e.preventDefault();
            var input = $(e.currentTarget),
                wrapper = this.node.find('.search-autocomplite'),
                target = wrapper.children('ul'),
                sString = input.val();
            if(sString.length > 3){
                target.html(this.template);
                wrapper.stop().fadeIn(300, function(){
                    wrapper.css('opacity', '1');
                });
            }else{
                wrapper.stop().fadeOut(300, function(){
                    target.children().remove();
                    wrapper.css('opacity', '0');
                });
            }
        },
        'hide': function(e){
            var $this = $(e.currentTarget),
                target = $this.filter('.search-autocomplite').eq(0);

            if(target.size() == 0)
                $('.search-autocomplite').fadeOut();
        },
        'init':function(){
            if(!(this.node = $('#search')).size()) return;
            this.node.children('fieldset').append('<div class="search-autocomplite"><ul></ul><div><a href="#">SHOW MORE</a></div></div>');

            $('#search input').keyup($.proxy(this.onAutocompile, this));
            $('body').on(window.clickend, "*", $.proxy(this.hide, this));
        }
    }
});