define(['jquery', 'jqueryui', 'jplayer', 'jplaylist', 'lib/iscroll', 'lib/mousestop'], function ($) {
    return {
        'onScroll': function () {
            this.spot = this.node.offset().top + this.height;

            if(window.msie8){
                var offsetTop = document.getElementById('player').offsetTop;
            }else{
                var offsetTop =  this.holder.removeAttr('style').offset().top;
            }
            var bottom =  offsetTop + this.height;
            this.playlist.css({position: 'fixed'});
            if(this.playlist.hasClass('zoomed') == false && this.playlist.hasClass('fullscreen') == false){
                if (bottom >= this.spot){
                    this.holder.css('position', 'static');
                    this.playlist.css({position: 'absolute', bottom: '75px'});
                };
            }
        },

        'showPlaylist':function(e){
            e.preventDefault();

            var $this = $(e.currentTarget),
                type = $this.hasClass('music') ? 'music' : ($this.hasClass('video') ? 'video' : $this.hasClass('picture') ? 'picture' : 'music');
            this.options.children().removeClass('active');
            this.playlist.removeClass('fullscreen');
            $this.addClass('active');
            this.node.removeClass('music picture video').addClass(type);
            this.activePlaylist = type;
            this.playlist.removeClass('music picture video').addClass(type).stop().fadeIn(200);
            if(type == 'video'){
                this.loadPoster();
            }else if(type == 'picture'){
                this.slideShowInit();
            }
            if(type != 'picture'){
                try{
                    clearInterval(this.shto);
                }catch (e){}
                this.slideshowStart = false;
                this.updateMediaInfo();
                this.updatePlayButton();
            }

        },

        'hidePlaylist':function(e){
            e.preventDefault();
            var $this = this;
            this.options.children().removeClass('active');
            this.activePlaylist = '';
            $this.playlist.stop().fadeOut(200, function(){
                $this.playlist.removeClass('music picture video fullscreen zoomed');
                $this.node.removeClass('music picture video fullscreen');
                try{
                    clearInterval($this.shto);
                }catch (e){}
                $this.slideshowStart = false;
                $this.updateMediaInfo();
                $this.updatePlayButton();
            });
        },

        'removeItem': function(e){
            e.preventDefault();
            var self = this,
                li = $(e.currentTarget).parent(),
                ui = li.parent();
            li.fadeOut(300, function(){

                var activeType = (self.activePlaylist != "") ? self.activePlaylist : self.currentType,
                mediaCount = self.playlist.find('.list.' + activeType).find('li').length,
                index =  self.playlist.find('.list.' + activeType).find('li.current').data('item');

                var del_id=$(this).data("item");
 
                $(this).remove();
                self.updateListIndex(ui);

                if(index==del_id && mediaCount>1){
                    self.nextItem(e);
                }
                else if(mediaCount==1){
                    self.startItem(e);
                    self.player=null;
                    self.jp = e.jPlayer;
                    self.hidePlaylist(e);
                    setTimeout(function(){
                        self.status.children('img').prop('src', '');
                        self.status.find('.title').html('<a href="#"></a> - <b></b>');
                    },200);
                }
            });
        },

        'fullScreenToogle':function(e){
            e.preventDefault();
            var self = this;
            self.playlist.removeClass('zoomed');
            self.playlist.toggleClass('fullscreen');
            self.node.toggleClass('fullscreen');
            if(self.node.hasClass('fullscreen')){
                self.fullscreen();
                if(!window.msie){
                    self.fseto = setInterval(function(){
                        if(!self.isFullScreen()){
                            self.playlist.removeClass('fullscreen');
                            self.node.removeClass('fullscreen');
                            self.holder.css('margin-bottom', 0);
                            try{
                                clearInterval(self.fseto);
                            }catch (e){}
                        }
                    }, 200);
                }

            }else{
                self.fullscreenExit();
                try{
                    clearInterval(self.fseto);
                }catch (e){}
            }
            self.onScroll();

        },
        'isFullScreen': function() {
            if((window.fullScreen) ||
                (window.innerWidth == screen.width && window.innerHeight == screen.height)){
                return true;
            }else{
                return false;
            }
        },
        'fullscreen': function(){

            var docElement, request, self = this;
            docElement = document.documentElement;
            request = docElement.requestFullScreen || docElement.webkitRequestFullScreen || docElement.mozRequestFullScreen || docElement.msRequestFullScreen;
            if(typeof request!="undefined" && request){
                request.call(docElement);
            }

            self.holder.hover(function(){
                try{
                    clearTimeout( self.fsto);
                }catch (e){}
                $('body').css('cursor', 'default');
                self.holder.stop().animate({marginBottom: '0px'}, 300);
            });
            $('body').mousemove(function(){
                $('body').css('cursor', 'default');
                try{
                    clearTimeout( self.fsto);
                }catch (e){}
                //self.holder.stop().animate({marginBottom: '0px'}, 300);
            });

            $('body').mousestop(function(){
                try{
                    clearTimeout( self.fsto);
                }catch (e){}
                self.fsto = setTimeout(function(){
                    if(self.isFullScreen()){
                        self.holder.stop().animate({marginBottom: '-64px'}, 300, function(){
                            $('body').css('cursor', 'none');
                        });
                    }
                }, 3000);
            });
            self.fsto = setTimeout(function(){
                if(self.isFullScreen()){
                    self.holder.stop().animate({marginBottom: '-64px'}, 300, function(){
                        $('body').css('cursor', 'none');
                    });
                }
            }, 3000);
        },
        'fullscreenExit': function(){

            var docElement, request, self = this;
            docElement = document;
            request = docElement.cancelFullScreen|| docElement.webkitCancelFullScreen || docElement.mozCancelFullScreen || docElement.msCancelFullScreen || docElement.exitFullscreen;
            if(typeof request!="undefined" && request){
                request.call(docElement);
            }

            try{
                clearTimeout(self.fsto);
            }catch (e){ }

            self.holder.stop().animate({marginBottom: '0px'}, 0);
            $('body').css('cursor', 'default');
        },
        'zoomToogle': function(e){
            e.preventDefault();
            this.fullscreenExit();
            this.playlist.removeClass('fullscreen');
            this.node.removeClass('fullscreen');
            this.playlist.toggleClass('zoomed');
            this.onScroll();
        },
        'onWindowResize': function(e){

        },
        /**
         * return Media Info from playlist
         * @param index
         * @param type
         * @returns {{}}
         */
        'getMediaInfo': function(index, type){

            var current = this.playlist.find('.list.'+type).find('li').eq(index);
            if(current.length == 0) current = this.playlist.find('.list.picture').find('li').eq(0).addClass('current');

            var className = (type == 'picture' )?  '.show-item' : '.play-item',
                mediaData = current.find(className).eq(0).data(),
                media = {};
            if(mediaData == null) mediaData = {};
            media.title = (mediaData.title != undefined && mediaData.title.length) ? mediaData.title : 'Unknown Title';
            media.author = (mediaData.autor != undefined && mediaData.autor.length) ? mediaData.autor : 'Unknown Autor';
            media.album =  (mediaData.album != undefined && mediaData.album.length) ? mediaData.album : 'Unknown Album';
            media.cover = (mediaData.albumCover != undefined && mediaData.albumCover.length) ? mediaData.albumCover : '';

            switch(type){
                case 'picture':
                    media.image = mediaData.image;
                    break;
                case 'music':
                    media.source = {};
                    if(mediaData.sourceOga != undefined &&  mediaData.sourceOga.length){
                        media.source.oga = mediaData.sourceOga;
                    }
                    if(mediaData.sourceMp3 != undefined && mediaData.sourceMp3.length ){
                        media.source.mp3 = mediaData.sourceMp3;
                    }
                    if(mediaData.sourceM4a != undefined && mediaData.sourceM4a.length){
                        media.source.m4a = mediaData.sourceM4a;
                    }
                    break;
                case 'video':
                    media.source = {};
                    if(mediaData.sourceWebmv != undefined &&  mediaData.sourceWebmv.length){
                        media.source.webmv = mediaData.sourceWebmv;
                    }
                    if(mediaData.sourceOgv != undefined &&  mediaData.sourceOgv.length){
                        media.source.ogv = mediaData.sourceOgv;
                    }
                    if(mediaData.sourceM4v != undefined && mediaData.sourceM4v.length ){
                        media.source.m4v = mediaData.sourceM4v;
                    }
                    if(mediaData.image != undefined && mediaData.image.length){
                        media.source.poster = mediaData.image;
                    }
                    break;
            }
            return media;
        },
        /**
         * Update Media Info in bottom player
         * @param media
         */
        'updateMediaInfo': function(media){
            if(media == undefined) media = this.mediaInfo;
            this.status.children('img').prop('src', media.cover);
            //this.status.find('.title').children().text(media.author + " - " + media.title);
            this.status.find('.title').html('<a href="#">'+media.author+'</a> - <b>'+media.title+'</b>')
        },
        /**
         * Occurs when play button click
         * @param e
         */
        'startItem':function(e){
            e.preventDefault();
            if(this.activePlaylist == 'picture'){
                this.startSlideShow();
            }else{
                this.play();
            }
        },
        /**
         * Occurs when next button click
         * @param e
         */
        'nextItem':function(e){
            e.preventDefault();
            if(this.activePlaylist == 'picture'){
                this.showNextSlide();
                var sTime = (this.slideshowTime * 1000);
                if(this.slideshowStart){
                    try{
                        clearInterval(this.shto);
                    }catch (e){}
                    this.shto = setInterval($.proxy(this.showNextSlide, this), sTime)
                }
            }else{
                this.playNext();
            }
        },
        /**
         * Occurs when prev button click
         * @param e
         */
        'prevItem':function(e){
            e.preventDefault();
            if(this.activePlaylist == 'picture'){
                var sTime = (this.slideshowTime * 1000);
                if(this.slideshowStart){
                    try{
                        clearInterval(this.shto);
                    }catch (e){}
                    this.shto = setInterval($.proxy(this.showNextSlide, this), sTime)
                }
                this.showPrevSlide();
            }else{
                this.playPrev();
            }
        },
        //-------------- slideshow ----------------
        'slideShowInit': function(){
            var current =  this.playlist.find('.list.picture').find('li.current');
            if(current.length == 0) current = this.playlist.find('.list.picture').find('li').eq(0).addClass('current');
            var media = this.getMediaInfo(current.data('item'), 'picture');
            this.controlsPlay.children('.play').removeClass('played');
            this.playlist.find('#jp-player').children('img').prop('src', media.image).show();
            this.status.find('.play-bar').css('width', "0%");
            this.updateMediaInfo(media);
        },

        'startSlideShow':function(){
            if(this.slideshowStart){
                try{
                    clearInterval(this.shto);
                }catch (e){}
                this.slideshowStart = false;
                this.controlsPlay.children('.play').removeClass('played');
            }else{
                var sTime = (this.slideshowTime * 1000);
                this.shto = setInterval($.proxy(this.showNextSlide, this), sTime);
                this.controlsPlay.children('.play').addClass('played');
                this.slideshowStart = true;
            }
        },
        'showItem': function(e){
            e.preventDefault();
            var pItem = $(e.currentTarget).parents('li').eq(0);
            this.currentType = 'picture';
            this.showIndex(pItem.data('item'));
        },
        'showIndex':function(index){
            var current = this.playlist.find('.list.picture').find('li').removeClass('current').eq(index).addClass('current'),
                image = this.playlist.find('#jp-player').children('img'),
                media = this.getMediaInfo(current.data('item'), 'picture'),
                loader = this.loader;
            this.updateMediaInfo(media);
            if(!window.msie8){
                var newimage = image.clone();
                loader.show();
                newimage.prop('src', media.image).load(function(){
                    image.stop().fadeOut(200, function(){
                        image.prop('src', media.image);
                        image.stop().fadeIn(200);
                        loader.hide();

                        newimage.remove();
                    });

                });
            }else{
                image.prop('src', media.image);
            }

        },
        'showNextSlide':function($this){
            if($this == undefined) $this = this;
            var mediaCount = $this.playlist.find('.list.picture').find('li').length,
                index =  $this.playlist.find('.list.picture').find('li.current').data('item'),
                playIndex = index + 1;
            if(mediaCount == 0) return;
            if(playIndex >= mediaCount) playIndex = 0;
            this.showIndex(playIndex);
        },
        'showPrevSlide':function(){
            var mediaCount = this.playlist.find('.list.picture').find('li').length,
                index =  this.playlist.find('.list.picture').find('li.current').data('item'),
                playIndex = index - 1;
            if(mediaCount == 0) return;
            if(playIndex < 0) playIndex = mediaCount - 1;
            this.showIndex(playIndex);
        },
        'setSlideshowTime': function(e){
            e.preventDefault();
            var index = $(e.currentTarget).parent().index(),
                container = $(e.currentTarget).parents('.slideshow-time'),
                items = container.find('li').removeClass('selected');
            for(var i = 0; i<= index; i++){
                items.eq(i).addClass('selected');
            }
            container.find('.sec').text(index+1);
            this.slideshowTime = index+1;
            var sTime = (this.slideshowTime * 1000);
            if(this.slideshowStart){
                try{
                    clearInterval(this.shto);
                }catch (e){}
                this.shto = setInterval($.proxy(this.showNextSlide, this), sTime)
            }
        },

        //-------------- video/audio --------------
        'loadPoster': function(){
           var current =  this.playlist.find('.list.video').find('li.current').find('.play-item');
           if(current.length == 0) current = this.playlist.find('.list.video').find('li').eq(0).addClass('current').find('.play-item');
           var src = current.data('image');
           this.playlist.find('#jp-player').children('img').prop('src', src).show();
        },
        'updatePlayButton': function(){
            if(this.activePlaylist == 'picture') return;
            this.playlist.find('.video-play-icon').removeClass('pause');
            if(this.jp.status && this.jp.status.paused){
                this.controlsPlay.children('.play').removeClass('played');
            }else{
                this.controlsPlay.children('.play').addClass('played');
                if(this.currentType == 'video') this.playlist.find('.video-play-icon').addClass('pause');
            }
        },
        'play': function(){
            if(this.jp.status.paused){
                if(this.player==null)return;
                this.player.jPlayer('play');
            }else{
                if(this.player==null)return;
                this.player.jPlayer('pause');
            }
        },
        'playNext': function(e){
            if(typeof e != 'undefined') e.preventDefault();

            var activeType = (this.activePlaylist != "") ? this.activePlaylist : this.currentType,
                mediaCount = this.playlist.find('.list.' + activeType).find('li').length,
                index =  this.playlist.find('.list.' + activeType).find('li.current').data('item'),
                playIndex = index + 1;
            if(mediaCount == 0) return;
            if(playIndex >= mediaCount) playIndex = 0;
            this.playIndex(playIndex, this.jp.status.paused);
        },
        'playPrev': function(e){
            ////console.log('jPrevPlay');
            if(typeof e != 'undefined') e.preventDefault();
            var activeType = (this.activePlaylist != "") ? this.activePlaylist : this.currentType,
                mediaCount = this.playlist.find('.list.' + activeType).find('li').length,
                index =  this.playlist.find('.list.' + activeType).find('li.current').data('item'),
                playIndex = index - 1;
            if(mediaCount == 0) return;
            if(playIndex < 0) playIndex = mediaCount - 1;
            this.playIndex(playIndex, this.jp.status.paused);
        },
        'playIndex': function(index, paused){
            var activeType = (this.activePlaylist != "") ? this.activePlaylist : this.currentType;
            if(activeType == 'picture'){
                this.showIndex(index);
                return;
            }

            this.currentIndex = index;
            this.mediaInfo = this.getMediaInfo(index, activeType);
            this.updateMediaInfo(this.mediaInfo);
            this.player.jPlayer("setMedia",this.mediaInfo.source);

            this.playlist.find('.video-play-icon').removeClass('pause');
            if(!paused){
                this.player.jPlayer('play');
                this.playlist.find('li').removeClass('played');
                this.playlist.find('.list.'+activeType).find('li').removeClass('current played').eq(this.currentIndex).addClass('current played');
                if(this.currentType == 'video') this.playlist.find('.video-play-icon').addClass('pause');
                if(this.playlist.hasClass('video'))  this.loadPoster();
            }else{
                this.player.jPlayer('pause');
                this.playlist.find('li').removeClass('played');
                this.playlist.find('.list.'+activeType).find('li').removeClass('current played').eq(this.currentIndex).addClass('current');
            }
            this.updatePlayButton();
        },
        'mute': function(e){
            e.preventDefault();
            this.player.jPlayer('mute');
        },
        'unmute': function(e){
            e.preventDefault();
            this.player.jPlayer('unmute');
            if(this.jp.options.volume == 0){
                this.player.jPlayer('volume', (10 / 100));
            }
        },
        'setVolume': function(value){
            this.player.jPlayer('volume', (value / 100));
            //console.log(value);
            if(value < 50){
                this.controlsVolume.find('.mute').addClass('half');
            }else{
                this.controlsVolume.find('.mute').removeClass('half');
            }
            if(value <= 0){
                this.player.jPlayer('mute');
            }else{
                this.player.jPlayer('unmute');
            }
        },
        'playItem': function(e){
            e.preventDefault();
            var pItem = $(e.currentTarget).parents('li').eq(0),
                pIndex = pItem.data('item'),
                played = pItem.hasClass('played'),
                list = pItem.parents('.list').eq(0),
                type = list.hasClass('music') ? 'music' : (list.hasClass('video') ? 'video' : (list.hasClass('picture') ? 'picture' : 'music'));


            if(this.currentType != type || this.currentIndex != pIndex){
                this.currentType = type;
                this.playIndex(pIndex, played);
            }else{
                if(this.jp.status.paused){
                    this.player.jPlayer('play');
                }else{
                    this.player.jPlayer('pause');
                }
            }


        },
        'playVideo': function(e){
            e.preventDefault();
            var current =  this.playlist.find('.list.' + this.currentType).find('li.current');
            if(current.length == 0) current = this.playlist.find('.list.' + this.currentType).find('li').eq(0).addClass('current');
            if(this.currentType != 'video'){
                this.currentType = 'video';
                this.playIndex(current.data('item'), !this.jp.status.paused);
            }else{
                if(this.jp.status.paused){
                    this.player.jPlayer('play');
                }else{
                    this.player.jPlayer('pause');
                }
            }

        },
        'updateSeek': function(e){
            e.preventDefault();
            var $bar = $(e.currentTarget),
                offset = $bar.offset(),
                x = e.pageX - offset.left,
                w = $bar.width(),
                p = 100 * x / w;

            if(!this.jp.status.paused){
                this.player.jPlayer('play', p * (this.jp.status.duration / 100));
                $bar.children().css('width', p + "%");
            }

        },
        'onTimeUpdate':function(){
            if(this.activePlaylist == 'picture') return;
            this.status.find('.current-time').text($.jPlayer.convertTime(this.jp.status.currentTime));
            this.status.find('.play-bar').css('width', this.jp.status.currentPercentAbsolute + "%");
        },
        'updateListIndex':function(ui){
            var items = ui.children();
            items.each(function(i){
                $(this).data( 'item', i).attr('data-item', i);
            });
            this.updateCurrentIndex();
        },
        'updateCurrentIndex':function(){
            this.currentIndex = this.playlist.find('.list.' + this.currentType).find('li.current').data('item');
        },
        // jplayer event handlers for bottom fixed player
         'eventHandlers':{
             'ready': function(e){
                //console.log('player event ready');
                 var currentmedia = this.playlist.find('.list.' + this.currentType).find('li.current');
                 if(currentmedia.length == 0){
                     currentmedia = this.playlist.find('.list.' + this.currentType).find('li').eq(0).addClass('current');
                 }
                 if(currentmedia.length == 0) return;
                 this.playIndex(currentmedia.data('item'), true);
             },
             'play': function(e){
                 //console.log('player event play');
                 this.jp = e.jPlayer;
                 this.updatePlayButton();
                 this.status.find('.duration').hide();
                 this.status.find('.current-time').removeClass('blink').show();
                 this.playlist.find('li').removeClass('played');
                 this.playlist.find('.list.'+this.currentType).find('li').removeClass('current played').eq(this.currentIndex).addClass('current played');
             },
             'stop': function(e){
                 //console.log('player event stop');
                 this.jp = e.jPlayer;
                 this.updatePlayButton();
                 this.status.find('.current-time').removeClass('blink').hide();
                 this.status.find('.duration').show();
                 this.playlist.find('li').removeClass('played');
                 this.playlist.find('.list.'+this.currentType).find('li').removeClass('current played').eq(this.currentIndex).addClass('current');
             },
             'pause': function(e){
                 //console.log('player event pause');
                 this.jp = e.jPlayer;
                 this.updatePlayButton();
                 this.status.find('.duration').hide();
                 this.status.find('.current-time').addClass('blink').show();
                 this.playlist.find('li').removeClass('played');
                 this.playlist.find('.list.'+this.currentType).find('li').removeClass('current played').eq(this.currentIndex).addClass('current');
             },
             'ended': function(e){
                 //console.log('player event ended');
                 this.jp = e.jPlayer;
                 this.jp.status.paused = false;
                 this.playNext();
             },
             'seeking': function(e){
                 //console.log('player event seeking');
                 this.jp = e.jPlayer;
             },
             'seeked': function(e){
                 //console.log('player event seeked');
                 this.jp = e.jPlayer;
             },
             'timeupdate': function(e){
                 ////console.log('player event timeupdate');
                 this.jp = e.jPlayer;
                 this.onTimeUpdate();
                 ////console.log(e.jPlayer.status);
             },
             'volumechange': function(e){
                 ////console.log('player event volumechange');
                 this.jp = e.jPlayer;
                 if(this.jp.options.muted){
                     this.volumeControlSlider.slider('value', 0);
                     this.controlsVolume.children('.mute').hide();
                     this.controlsVolume.children('.unmute').show();
                 }else{
                     this.volumeControlSlider.slider('value', this.jp.options.volume * 100);
                     this.controlsVolume.children('.unmute').hide();
                     this.controlsVolume.children('.mute').show();
                 }

             },
             'progress': function(e){
                 // Occurs while the media is being downloaded.
                 //console.log('player event progress');
                 this.jp = e.jPlayer;
                 this.status.find('.current-time').removeClass('blink').hide();
                 this.status.find('.duration').text($.jPlayer.convertTime(this.jp.status.duration)).show();
                 this.volumeControlSlider.slider('value', this.jp.options.volume * 100);
             }
         },
        'init': function () {
            if (!(this.node = $('#player')).size()) return;
            var self = this;
            this.holder = this.node.children().not('.playlist');
            this.height = this.holder.height();
            this.node.find('.scroller').scrollbar();
            this.footer = $('body').children('footer');
            this.controlsPlay = this.node.find('.controls:first');
            this.controlsVolume = this.node.find('.controls:last');
            this.options = this.node.find('.options');
            this.status = this.node.find('.status');
            this.playlist = this.node.find('.playlist');
            this.loader = $('<div class="loader" style="display: none"></div>');
            this.playlist.find('.preview').append(this.loader);

            //default params
            this.currentType = 'music'; //current playing playlist type
            this.activePlaylist = '';   //current display playlist type
            this.currentIndex = 0;      //current index of media (video, audio)
            this.currentPictureIndex = 0;      //current index of picture
            this.mediaInfo = {};        //current media info (video, audio)
            this.mediaPctureInfo = {};  //current picture info
            this.slideshowTime = 1;     //slideshow time
            this.slideshowStart = false;     //slideshow start
            this.playerVolumeDefault = 37;

            this.jp = null;     //current jPlayer status/options
            this.shto = null;    //slideshow timeout object
            this.fsto = null;    //fullscreen timeout object
            this.fseto = null;    //fullscreen enabled timeout object

            //methods
            this.node.on(window.clickend, '.options a', $.proxy(this.showPlaylist, this));
            this.node.on(window.clickend, '.playlist > div > .close', $.proxy(this.hidePlaylist, this));
            this.node.on(window.clickend, '.toolbox .fullscreen', $.proxy(this.fullScreenToogle, this));
            this.node.on(window.clickend, '.toolbox .zoom', $.proxy(this.zoomToogle, this));

            $(window).on('scroll.player', $.proxy(this.onScroll, this)).trigger('scroll.player');
            $(window).resize(function(){
                $.proxy(this.onScroll, this);
            });

            this.volumeControlSlider = $( ".volume", this.controlsVolume ).slider({
                range: "min",
                value: self.playerVolumeDefault,
                min:0,
                max: 100,
                slide: $.proxy(function( event, ui ) {
                    this.setVolume(ui.value);
                }, this),
                create: function(){
                    if(self.playerVolumeDefault < 50){
                        self.controlsVolume.find('.mute').addClass('half');
                    }else{
                        self.controlsVolume.find('.mute').removeClass('half');
                    }
                }
            });
            //------ current Player -------
            this.player = $('#jp-player').jPlayer( {
                supplied: "mp3,m4a,oga,webma,m4v,ogv,webmv",
                swfPath: "../js/lib/",
                solution:"html,flash",
                wmode: "window",
                errorAlerts: true,
                warningAlerts: false,
                size: {
                    width: "100%",
                    height: "100%",
                    cssClass: "jp-video-360p"
                }
            });



            //bind events for jPlayer
            this.player.bind($.jPlayer.event.ready + ".jPlayer", $.proxy(this.eventHandlers.ready, this));
            this.player.bind($.jPlayer.event.play + ".jPlayer", $.proxy(this.eventHandlers.play, this));
            this.player.bind($.jPlayer.event.stop + ".jPlayer", $.proxy(this.eventHandlers.stop, this));
            this.player.bind($.jPlayer.event.pause + ".jPlayer", $.proxy(this.eventHandlers.pause, this));
            this.player.bind($.jPlayer.event.ended + ".jPlayer", $.proxy(this.eventHandlers.ended, this));
            this.player.bind($.jPlayer.event.seeking + ".jPlayer", $.proxy(this.eventHandlers.seeking, this));
            this.player.bind($.jPlayer.event.seeked + ".jPlayer", $.proxy(this.eventHandlers.seeked, this));
            this.player.bind($.jPlayer.event.timeupdate + ".jPlayer", $.proxy(this.eventHandlers.timeupdate, this));
            this.player.bind($.jPlayer.event.volumechange + ".jPlayer", $.proxy(this.eventHandlers.volumechange, this));
            this.player.bind($.jPlayer.event.progress + ".jPlayer", $.proxy(this.eventHandlers.progress, this));

            this.controlsPlay.on(window.clickend, '.play', $.proxy(this.startItem, this));
            this.controlsPlay.on(window.clickend, '.next', $.proxy(this.nextItem, this));
            this.controlsPlay.on(window.clickend, '.prev', $.proxy(this.prevItem, this));

            this.status.on(window.clickend, '.seek-bar', $.proxy(this.updateSeek, this));
            this.controlsVolume.on(window.clickend, '.mute', $.proxy(this.mute, this));
            this.controlsVolume.on(window.clickend, '.unmute', $.proxy(this.unmute, this));
            this.playlist.on(window.clickend, '.play-item', $.proxy(this.playItem, this));
            this.playlist.on(window.clickend, '.remove', $.proxy(this.removeItem, this));
            this.playlist.on(window.clickend, '.video-play-icon', $.proxy(this.playVideo, this));

            this.playlist.on(window.clickend, '.show-item', $.proxy(this.showItem, this));
            this.controlsVolume.on(window.clickend, '.slideshow-time a', $.proxy(this.setSlideshowTime, this));

            if(window.mobile){
                $('.scroller').css('overflow', 'auto');
            }

            var sortable = this.playlist.find('ul').sortable({
                'update':function(event, ui){
                    ui.item.removeAttr('style');
                    self.updateListIndex(ui.item.parent());

                }
            });
            sortable.disableSelection();

            sortable.each(function(){
                self.updateListIndex($(this));
            });
        }
    };
});