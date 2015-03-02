

define(['jquery', 'jqueryui', 'touch-punch'], function ($) {
    return {

        'init': function () {
        	
        	
        	
        	//mobile dropdown display none;
        	
        	$('.bg-wrapper').find('.selectbox').hide();
        	
        	
            
            $( "#album_list ul" ).sortable({
                update: function(){

                },
                stop: function(event,ui){
                    if($(".mymusic-singles").hasClass("editable"))return true;
                    var x = event.pageX;
                    var y = event.pageY;
                    $(".all-galleries li").removeClass("hovered");
                    $(".all-galleries li").each(function(){
                        if(
                            y>=$(this).offset().top && y<$(this).offset().top+$(this).height() && 
                            x>=$(this).offset().left && x<$(this).offset().left+$(this).width()
                            ){
                            if(!$(this).hasClass("sel"))$(ui.item).remove();
                        }

                    });
                },
                sort: function(event,ui){
                    if($(".mymusic-singles").hasClass("editable"))return true;
                    var x = event.pageX;
                    var y = event.pageY;
                    $(".all-galleries li").removeClass("hovered");
                    $(".all-galleries li").each(function(){
                        if(
                            y>=$(this).offset().top && y<$(this).offset().top+$(this).height() && 
                            x>=$(this).offset().left && x<$(this).offset().left+$(this).width()
                            ){
                            $(this).addClass("hovered");
                        }
                    });
                }

            });
           

            var dropfileswrapp = $(".drag-file");
            dropfileswrapp.ondragover = function() {
                $(this).addClass('hover');
                return false;
            };                
            dropfileswrapp.ondragleave = function() {
                $(this).removeClass('hover');
                return false;
            };
            dropfileswrapp.ondrop = function(event){
                event.preventDefault();
                $(this).removeClass('hover');
                var file = event.dataTransfer.files[0];                
                /* FILE LOAD */

                return false;                
            };

            setTimeout(function(){$(".whats-your-passion li.music .box").click();},10)
            

        }        
    };
    
    
    
});