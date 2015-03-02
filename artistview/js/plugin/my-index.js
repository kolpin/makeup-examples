

define(['jquery', 'jqueryui', 'touch-punch', 'placeholder'], function ($) {
    return {

        'init': function () {
            $.Placeholder.init({ color : "#aaa" });
            $(".music-wrapper").animate({height:"95px"});
 

        }        
    };
});