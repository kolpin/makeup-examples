
(function($) {
    $.fn.mobileDate = function() {

        $("input.datetype").each(function(){
            var parent = $(this).parent();
            if (window.mobile) {
                if(!$("input.hiddendate",parent).length)
                    parent.append('<input type="date" class="hiddendate" />');
            }
            else {
                //convert to list
                if($(this).hasClass("dd")){
                    var select = '<select class="custom-select day-select" name="bussines_type">';
                    for(var i=1;i<=31;i++)select += '<option value="'+i+'">'+addNullDate(i)+'</option>';
                    select += '</select>';
                    $(this).replaceWith(select);
                }
                if($(this).hasClass("mm")){
                    var select = '<select class="custom-select month-select" name="bussines_type">';
                    for(var i=1;i<=12;i++)select += '<option value="'+i+'">'+addNullDate(i)+'</option>';
                    select += '</select>';
                    $(this).replaceWith(select);
                }
                if($(this).hasClass("yyyy")){
                    var select = '<select class="custom-select year-select" name="bussines_type">';
                    for(var i=2015;i>=1900;i--)select += '<option value="'+i+'">'+i+'</option>';
                    select += '</select>';
                    $(this).replaceWith(select);
                }                
            }
        });


        if (window.mobile) {
            $("input.hiddendate").on("blur change",function(e){
                var $this = $(this),
                    value = $this.val();

                //Does the input have "-", if so it is from the webkit datepicker, fix it
                if(value.indexOf("-") !== -1){
                    var cleanDateArray = value.split('-');
                    var inputs = $("input.datetype",$this.parent());
                    $.inputs=inputs;

                    $(inputs.get(0)).val(cleanDateArray[2]);
                    $(inputs.get(1)).val(cleanDateArray[1]);
                    $(inputs.get(2)).val(cleanDateArray[0]);

                }                 
            });
        }
        else {
            $(".custom-select").selectbox();

        }


        
    }
})(jQuery)

function addNullDate(date){
    if(date<10)return "0"+date;
    return date;
}