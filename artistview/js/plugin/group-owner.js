define(['jquery', 'select2'], function($, select2) {
  return {
    last_active_comment: 'undefined',
    onLastActionAvatarMouseOver: function(e) {
      var li = $(e.currentTarget);
      var ul = li.closest('ul');
      ul.find('li').removeClass('active');
      li.addClass('active');
      this.last_active_comment = li;
    },
    onLastActionAvatarMouseOut: function(e) {
      var li = $(e.currentTarget);
      li.removeClass('active');
    },
    onLastActionMouseOut: function(e) {
      if (typeof this.last_active_comment == 'undefined') {
        var ul = $(e.currentTarget);
        ul.find('li:first-child').addClass('active');
      } else {
        this.last_active_comment.addClass('active');
      }
    },
    'init': function() {
      $('body .discussions .last_actions').on({
        mouseenter: $.proxy(this.onLastActionAvatarMouseOver, this),
        mouseleave: $.proxy(this.onLastActionAvatarMouseOut, this)
      }, 'li');

      $('body .discussions').on({
        mouseleave: $.proxy(this.onLastActionMouseOut, this)
      }, '.last_actions');

      var my_groups_dropdown = $('#my-groups-dropdown');

      my_groups_dropdown.find('.select2').select2({
        width: 280,
        dropdownCssClass: 'my-groups-dropdown-items'
      });

      my_groups_dropdown.find('.select2').on('select2-opening', function() {

        if (typeof $('.my-groups-dropdown-items').find('.select2-totals').get(0) == 'undefined') {
          $('.my-groups-dropdown-items').find('.select2-search').after('<div class="select2-totals">Showing 10 of 153</div>');
        }

        $('.my-groups-dropdown-items').find('.select2-search').find('input').attr('placeholder', 'Search in Groups');
      });

      my_groups_dropdown.find('.select2').on('select2-selecting', function(event) {
        my_groups_dropdown.prev().trigger('click');
        alert('Do something with ' + event.object.text);
      });

      my_groups_dropdown.on('dropdown.opened', function() {
        $(this).find('.select2').select2('open');
        $('#select2-drop-mask').hide();
      });

      my_groups_dropdown.on('dropdown.closed', function() {
        $(this).find('.select2').select2('close');
      });
    }
  };
});