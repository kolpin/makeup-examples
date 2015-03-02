define(['jquery', 'hoverIntent', 'plugin/map'], function ($, _, map) {
  return {
    eventDays: [
      [1, 26], [2, 6], [3, 17],
      [4, 27], [5, 25], [6, 6],
      [7, 4], [8, 17], [9, 7],
      [10, 1], [11, 22], [12, 12],
      [12, 13], [12, 15]
    ], //текущие евенты, в формате месяц/день

    getEventDays: function(date) {
      for (var i = 0; i < this.eventDays.length; i++) {
        if (date.getMonth() == this.eventDays[i][0] - 1
          && date.getDate() == this.eventDays[i][1]) {
          return [true, 'event_day'];
        }
      }
      return [true, ''];
    },

    'init': function () {
      map.init([
      	{	//HERE WILL BE JSON
      		'lat': 56.958863802416495,
      		'lng': 24.113788654739437,
      		'title': 'Chicago music festival',
      		'description': 'at Chicago Cultural Center<br />September 30',
      		'avatar': '...',
      		'type': 0,
      		'logo': '/img/valbum-1.jpg'
      	},
      	{
      		'lat': 56.858863802416495,
      		'lng': 24.123788654739437,
      		'title': 'Chicago music festival',
      		'description': 'at Chicago Cultural Center<br />September 30',
      		'avatar': '...',
      		'type': 2,
      		'logo': '/img/valbum-1.jpg'
      	},
      	{
      		'lat': 56.811863802416495,
      		'lng': 24.195488654739437,
      		'title': 'Chicago music festival',
      		'description': 'at Chicago Cultural Center<br />September 30',
      		'avatar': '...',
      		'type': 3,
      		'logo': '/img/valbum-1.jpg'
      	}
      ]);
      
      
      var calendar_wrap = $('.calendar_wrap');
      var calendar = calendar_wrap.find('.calendar');

      calendar.datepicker({
        numberOfMonths: 3,
        firstDay: 1,
        dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        showOtherMonths: true,
        selectOtherMonths: true,
        beforeShowDay: $.proxy(this.getEventDays, this)
      }).hide();

      calendar_wrap.on('click', '.show_calendar', function(e) {
        e.preventDefault();
        calendar.slideToggle();
      });

      $('[data-toggle=hover]').hoverIntent(function() {
          $($(this).data('target')).toggle();
      });

      $('#date_range').on('click', 'a', function(e) {
        e.preventDefault();
        $('.choose_date_range').find('.date_range_value').text($(this).data('days'));
      });
    }
    
  };
});