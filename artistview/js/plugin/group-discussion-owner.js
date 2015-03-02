define(['jquery'], function($) {
  return {
    'initAccordion': function() {
      this.accordion_headers.click(function() {
        var panel = $(this).next();
        var isOpen = panel.is(':visible');
        panel[isOpen? 'slideUp': 'slideDown']()
          .trigger(isOpen? 'hide': 'show').removeClass('tab-edit');
        $(this).toggleClass('active');
        return false;
      });

      this.accordion_headers.on('open', function(e) {
        e.preventDefault();
        var $this = $(e.currentTarget);

        var panel = $this.next();
        panel['slideDown']().trigger('show');
        $(this).addClass('active');
      });

      this.accordion_headers.on('close', function(e) {
        e.preventDefault();
        var $this = $(e.currentTarget);

        var panel = $this.next();
        panel['slideUp']().trigger('hide');
        $(this).removeClass('active');
      });
    },

    'collapseAccordion': function() {
      this.accordion_headers.each(function() {
        $(this).trigger('close');
      });
    },

    'expandAccordion': function() {
      this.accordion_headers.each(function() {
        $(this).trigger('open');
      });
    },

    'initMessageForm': function() {
      var self = this;
      this.message_form.on('changed', function(event, tab) {
        var type = $(tab).attr('class').split(' ')[0];
        if (typeof self.accordion.find('.header-' + type).get(0) != 'undefined') {
          self.accordion.find('.header-' + type).trigger('open');
          self.accordion.find('.tab-' + type).addClass('tab-edit').find('ul.list').sortable('enable');
          self.accordion.find('h3:not(.header-' + type + ')').trigger('close').next().removeClass('tab-edit');
        } else {
          self.expandAccordion();
          self.accordion_headers.each(function() {
            $(this).next().removeClass('tab-edit').find('ul.list').sortable('disable');
          });
        }
      });
    },

    'init': function() {
      this.accordion = $('.accordion');
      this.accordion_headers = this.accordion.children('h3');
      this.initAccordion();

      this.accordion.find('ul.list').sortable().sortable('disable');

      this.message_form = $('.musician-write');
      this.initMessageForm();

      this.accordion.on('click', '.delete', function(e) {
        e.preventDefault();

        var ul = $(e.currentTarget).closest('ul');

        if (typeof ul.closest('.iscrollitem').next().get(0) != 'undefined') {
          ul.append(ul.closest('.iscrollitem').next().find('li:first-child').clone());
          ul.closest('.iscrollitem').next().find('li:first-child').remove();
        }

        $(e.currentTarget).closest('li').remove();
      })
    }
  };
});