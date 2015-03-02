define(['jquery', 'select2'], function($, select2) {
  return {
    'sharePopupInit': function() {
      var popup = $('#share');

      popup.find('.select2').select2({
        width: '100%'
      });
    },

    'init': function() {

    }
  };
});