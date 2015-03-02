define(['jquery'], function($) {
  return {
    'promote': function(link) {
      var p = $('#promote').find('form').find('p');
      var text = p.html();
      p.html(text.replace('{{name}}', link.data('name')));
    },

    'init': function() {

    }
  };
});