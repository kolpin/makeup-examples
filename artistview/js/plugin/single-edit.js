

define(['jquery', 'jqueryui', 'touch-punch'], function ($) {
    return {

        'init': function () {
            
                     

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

            setTimeout(function(){$(".whats-your-passion li.music .box").click();},10);
            
            }
    };
});

