define(['jquery'], function($) {
  return {
    'onRadio': function(e) {
      var label = $(e.currentTarget);
      $('.field.type label').removeClass('active');
      label.addClass('active');
    },

    'init': function() {
      $('body .field.type').on(window.clickend, 'label', $.proxy(this.onRadio, this));
    }
  };
});