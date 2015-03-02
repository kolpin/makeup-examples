define(['jquery'], function ($) {
    return {

        'onPaymentType': function(e) {
            var payment=$(e.currentTarget);
            $('.payment-type').removeClass('active');
            payment.addClass('active');
        },

        'onPaymentAmount': function(e) {
            var payment=$(e.currentTarget);
            var amount=$(payment).attr('data-amout');
            $('.amount-money li').removeClass('active');
            payment.addClass('active');
            $('#amount-money').val(amount);
        },

        'onShowToolTip': function(e) {
            var tipLink=$(e.currentTarget);
            //tipLink.toggleClass('active');
            $('.tooltip .wrapp-tip').fadeIn(200);
        },

        'onHideToolTip': function(e) {
            var tipLink=$(e.currentTarget);
           // tipLink.toggleClass('active');
            $('.tooltip .wrapp-tip').fadeOut(200);
        },


    	'init' : function () {
    		
            $('body').on(window.clickend, '.payment-type', $.proxy(this.onPaymentType, this))
                     .on(window.clickend, '.amount-money>li', $.proxy(this.onPaymentAmount, this))
            $('.tooltip a').hover($.proxy(this.onShowToolTip, this),$.proxy(this.onHideToolTip, this));
    	}

	};

});