define(['jquery', 'hoverIntent', 'plugin/map', 'select2'], function ($, _, map, select2) {
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

    initMap: function() {
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
    },

    participantFormat: function(item) {
      return '<p class="new_participant"><img src="' + item.img + '"/><span>' + item.text + '</span></p>';
    },

    'init': function () {
      $('.datepicker').datepicker({
        numberOfMonths: 1,
        firstDay: 1,
        dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        showOtherMonths: true,
        selectOtherMonths: true,
        beforeShowDay: $.proxy(this.getEventDays, this),
        dateFormat: 'MM dd'
      });

      $('.calendar_icon').on('click', function(e) {
        $(this).parent().find('.datepicker').datepicker( "show" );
      });

      $('.participants').find('input').select2({
        formatResult: this.participantFormat,
        formatSelection: this.participantFormat,
        data:[
          {
            id:0, img:'/img/events/avatar21x21.jpg', text: 'PANGAEA\'S PEOPLE (Global Arts Network)'
          },
          {
            id:1, img:'/img/events/avatar21x21.jpg', text: 'MIX PEOPLE (New York)'
          },
          {
            id:2, img:'/img/events/avatar21x21.jpg', text: 'SONY PLAY (Miami Label)'
          },
          {
            id:3, img:'/img/events/avatar21x21.jpg', text: 'MADONNA RECORDS (Global Net)'
          }
        ],
        width: 460,
        allowClear: true
      });

      $('.participants_list').on('click', '.del', function(e) {
        e.preventDefault();
        $(this).closest('li').fadeOut(400, function() {
          $(this).remove();
        });
      });
    }
  };
});