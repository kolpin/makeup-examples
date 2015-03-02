define(['jquery', 'touch-punch'], function ($) {
    return {
        'calcCart':function(e){

            if(e != undefined){
                var link = $(e.currentTarget),
                    row = link.parents('.cart-table-row').eq(0);
                if(link.hasClass('remove')){
                    row.remove();
                }
            }
            var self = this,
                wrapper = $('.cart-table-center, .cart-table'),
                total_price = 0;


            if(wrapper.hasClass('confirmed') == false){
                $('.cart-table-row',wrapper).each(function(){
                    var row = $(this),
                        price = parseFloat(row.children('.price').text().replace('$','')),
                        count = row.children('.quantity').find('input').val(),
                        total = price * count;

                    total_price +=total;
                    row.children('.total').text('$'+self.formatNumber(total));

                });

                $('.cart-table-checkout .total span').text('$'+self.formatNumber(total_price));
            }

            return false;
        },
        'formatNumber': function(number, decimals, dec_point, thousands_sep){
            var i, j, kw, kd, km;

            // input sanitation & defaults
            if( isNaN(decimals = Math.abs(decimals)) ){
                decimals = 2;
            }
            if( dec_point == undefined ){
                dec_point = ".";
            }
            if( thousands_sep == undefined ){
                thousands_sep = " ";
            }

            i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

            if( (j = i.length) > 3 ){
                j = j % 3;
            } else{
                j = 0;
            }

            km = (j ? i.substr(0, j) + thousands_sep : "");
            kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
            //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
            kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
            return km + kw + kd;
        },
        'init': function () {

            $('.cart-table, .cart-table-center').on(window.clickend, ".plus, .minus, .remove", $.proxy(this.calcCart, this));
            $('.cart-table .range input, .cart-table-center .range input').blur( $.proxy(this.calcCart, this));
            this.calcCart();

        }
    };
});
