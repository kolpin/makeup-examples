define(['jquery', 'lib/iscroll', 'plugin/dropdowns'], function ($, Scroll, Dropdowns) {
    return {
        'searchGenre': ['Mike’s jazz club', 'Tony Berret’s music School', 'Jazz lovers', 'Mike’s jazz club', 'Tony Berret’s music School', 'Jazz in Chicago', 'Jazz lovers'],
        'availableCity': function(request, response){
            $.ajax({
                url: "http://geonames.org/searchJSON",
                dataType: "jsonp",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 12,
                    name_startsWith: request.term
                },
                success: function( data ) {
                    response( $.map( data.geonames, function( item ) {
                        return {
                            label: item.name,
                            value: item.name
                        }
                    }));
                }
            });

        },
        'showToogle': function(e){
            e.preventDefault();
            var title = $(e.currentTarget),
                wrapper = title.parent().toggleClass('active'),
                name = "All Genres",
                nameParts = [];

            if(title.hasClass('filter-genre') && !wrapper.hasClass('active')){
                var labels = wrapper.find('.genres').eq(0).find('label').filter('.checked');
                if(labels.length > 0){
                    labels.each(function(){
                        nameParts.push($(this).text());
                    });
                    name = nameParts.join(', ');
                }
                title.text(name);
            }

        },
        'onGenreChange': function(e){
            var label = $(e.currentTarget),
                input = label.children();

            if(input.prop('checked')){
                label.addClass('checked');
            }else{
                label.removeClass('checked');
            }
        },
        'initBredcrumbsFilter': function(){
            var genreTitle = this.node.find('.filter-genre'),
                genreName = "All genres",
                genreNameParts = [];

            this.node.find('.genres input').each(function(){
                if($(this).prop('checked')){
                    genreNameParts.push($(this).parent().addClass('checked').text());
                }else{
                    $(this).parent().removeClass('checked');
                }
            });
            
            if(genreNameParts.length > 0){
                genreName = genreNameParts.join(', ');
            }

            genreTitle.text(genreName);
        },
        'onCitySelect': function(e){
            var $this = $(e.currentTarget),
                label = $this.parent(),
                wrapper = $this.parents('.dropdown-wrapper').eq(0),
                input = wrapper.find('.ui-autocomplete-input').val(label.text()),
                title = wrapper.find('.dropdown-toggle').text(label.text());
            Dropdowns.hide();
        },
        'clearFilter': function(e){
            e.preventDefault();
            var $this = $(e.currentTarget),
                wrap = $this.parent(),
                input = wrap.find('.search-inner').val('');
        },
        'init':function(){
            this.node = $('.breadcrumbs');
            var self = this;
            this.node.on(window.clickend, '.filter-genre', $.proxy(this.showToogle, this))
                .on(window.clickend, '.genres label', $.proxy(this.onGenreChange, this));

            this.node.find('.fg-wrapper .search-inner').autocomplete({
                appendTo: '.fg-wrapper .target',
                minLength: 2,
                source: this.searchGenre,
                messages: {
                    noResults: '',
                    results: function() {}
                },
                open: function(event, ui){
                    $('.ui-autocomplete').css('top', 0);
                }

            });

            $('.searchall').on('click.dropdown  change.dropdown', 'input[type=checkbox]',  $.proxy(this.onSelectGenre, this));

            self.cityWidget = $('#city-dropdown input');
            if(self.cityWidget.length != 0)
            {
                self.cityWidget.autocomplete({
                    appendTo: '#city-dropdown',
                    minLength: 2,
                    source: $.proxy(this.availableCity, this),
                    select: $.proxy(this.onCitySelect, this),
                    messages: {
                        noResults: '',
                        results: function() {}
                    },
                    open: function(event, ui){
                        $('.ui-autocomplete').css('top', 0);
                        self.cityWidget.autocomplete('widget').append('<li class="more"><a href="#">Show more</a></li>');
                    }

                }).data('ui-autocomplete')._renderItem = function( ul, item ) {
                    var checked = '',
                        current = self.cityWidget.parent().prev('.dropdown-toggle').text();
                    if(item.label.toLowerCase() == current.toLowerCase()){
                        checked = 'checked';
                    }

                    var label = $( '<label class="'+checked+'">'+ item.label +'</label>'),
                        input = $('<input type="radio" name="city" '+checked+' />')
                            .on('change', $.proxy(self.onCitySelect, this));

                    label.prepend(input);

                    return $( "<li>" )
                        .append( label )
                        .appendTo( ul );
                };
            }
            $('.fg-wrapper .fg-inner').append('<a class="after" href="#"></a>')
            $('.fg-wrapper .fg-inner').on(window.clickend, 'a.after', $.proxy(this.clearFilter, this));
            this.initBredcrumbsFilter();
        }
    }
});
