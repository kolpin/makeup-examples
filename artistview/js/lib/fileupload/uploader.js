define(['jquery', 'jqueryui','lib/fileupload/jquery.fileupload','lib/fileupload/jquery.iframe-transport','lib/fileupload/jquery.knob','lib/fileupload/jquery.ui.widget'], function ($) {
    return {        

        'init': function () {         
            var self = this;            
            /*
            $('#drop a').click(function(){
                // Simulate a click on the file input button
                // to show the file browser dialog
                $(this).parent().find('input').click();
            });
            */
            // Initialize the jQuery File Upload plugin
            $('.fileupload').each(function () {
                var that = this;
                $(this).fileupload({                
                    
                    // This element will accept file drag/drop uploading
                    dropZone: $(".drag-file",that),
                    ul: $(that),

                    // This function is called when a file is added to the queue;
                    // either via the browse button, or via drag/drop:
                    add: function (e, data) {
                        if(typeof data.form != "undefined")this.ul = $("ul",data.form.context);
                        else this.ul = $("ul",e.target);
                        var tpl = $('<li class="working"><div class="icon"></div><input type="text" value="0" /><p></p><div class="progress"><span></span></div><a class="rect del" href="#"></a></li>');

                        // Append the file name and file size
                        var filename = data.files[0].name;var maxlength = 25;
                        if(this.ul.hasClass("right-place")||this.ul.hasClass("small-upload"))maxlength = 15;
                        if(filename.length>maxlength)filename=filename.substring(0,maxlength-1)+"...";

                        tpl.find('p').text(filename)
                                     .append('<i>' + self.formatFileSize(data.files[0].size) + '</i>');
                        // Add the HTML to the UL element
                        if(this.ul.hasClass("single-file"))this.ul.html("");
                        data.context = tpl.appendTo(this.ul);
                        // Initialize the knob plugin
                        tpl.find('input').knob();
                        // Listen for clicks on the cancel icon
                        tpl.find('a.rect').click(function(){

                            if(tpl.hasClass('working')){
                                jqXHR.abort();
                            }

                            tpl.fadeOut(function(){
                                tpl.remove();
                            });
                            return false;

                        });

                        // Automatically upload the file once it is added to the queue
                        var jqXHR = data.submit();
                    },

                    progress: function(e, data){

                        // Calculate the completion percentage of the upload
                        var progress = parseInt(data.loaded / data.total * 100, 10);

                        // Update the hidden input field and trigger a change
                        // so that the jQuery knob plugin knows to update the dial
                        data.context.find('input').val(progress).change();
                        data.context.find('.progress span').css("width",progress+"%");

                        if(progress == 100){
                            data.context.removeClass('working');
                        }
                    },

                    done: function (e, data) {
                        data.context.removeClass('working');
                        var result = JSON.parse(data.result);
                        if(result.status=="success"){
                            data.context.find('.progress').html("Conversion in progress").addClass("done");
                        }           
                        else data.context.find('.progress').html("File not support").addClass("done");
                    },

                    fail:function(e, data){
                        // Something has gone wrong!
                        data.context.addClass('error');
                    }

                });
            });


            // Prevent the default action when a file is dropped on the window
            $(document).on('drop dragover', function (e) {
                e.preventDefault();
            });


        },
        // Helper function that formats the file sizes
        formatFileSize: function(bytes) {
            if (typeof bytes !== 'number') {
                return '';
            }

            if (bytes >= 1000000000) {
                return (bytes / 1000000000).toFixed(2) + ' GB';
            }

            if (bytes >= 1000000) {
                return (bytes / 1000000).toFixed(2) + ' MB';
            }

            return (bytes / 1000).toFixed(2) + ' KB';
        }


    };

});
