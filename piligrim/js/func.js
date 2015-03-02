/* Библиотека вспомогательных функций */

/**
 *
 * @param number
 * @param decimals
 * @param dec_point
 * @param thousands_sep
 * @return {String}
 */
function number_format(number, decimals, dec_point, thousands_sep) {	// Format a number with grouped thousands
    var i, j, kw, kd, km;

    if (isNaN(decimals = Math.abs(decimals))) {
        decimals = 2;
    }
    if (dec_point == undefined) {
        dec_point = ",";
    }
    if (thousands_sep == undefined) {
        thousands_sep = ".";
    }
    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";
    if ((j = i.length) > 3) {
        j = j % 3;
    } else {
        j = 0;
    }
    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");
    return km + kw + kd;
}

/**
 * @param count количество
 * @param minut5 когда 5, 25
 * @param minuta1 когда 1, 21
 * @param minuti2 когда 2, 22
 */
function transformWord(count, minut5, minuta1, minuti2) {
    //"товаров", "товар", "товара"
    var words = [minut5, minuta1, minuti2];
    var index = count % 100;

    if (index >= 11 && index <= 14) { index = 0; }
    else { index = (index %= 10) < 5 ? (index > 2 ? 2 : index) : 0; }

    return (words[index]);
}