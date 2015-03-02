define(['jquery'], function ($) {
    return {
        template : '',
        'onFormButtonClick': function (e) {
            var search_input = $('input[name="search_in_groups"]');
            var search_text = search_input.val();
            var data = {};
            data.search_text = search_text;
            if (!this.checkData(search_text)) {
                search_input.addClass('error');
            } else {
                search_input.removeClass('error');
                //this.sendAjax('search.php', data);
                var data = { // this is EXAMPLE data returned from php
                    1: {
                        image: "../img/allgroups/chicago.png",
                        icon: "img/albums/label_red.png",
                        icons: [1, 2, 3, 4],
                        private: 1,
                        content: {
                            title: "Title 1",
                            category: "Musicians",
                            category_link: "#",
                            category_links: {
                                1: {
                                    text: "Drummers",
                                    link: "#"
                                }
                            },
                            location: "Chicago, IL",
                            location_link: "#",
                            owner: "Shakira",
                            owner_link: "#",
                            description: "Lorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit amet...",
                            description_link: "#"
                        },
                        members: "8",
                        members_link: "#",
                        friends: "3",
                        discussions: "7",
                        discussions_link: "#",
                        messages: "4",
                        messages_link: "#",
                        images: {
                            1: {image: "../img/allgroups/pic.png", link: "#"},
                            2: {image: "../img/allgroups/pic.png", link: "#"},
                            3: {image: "../img/allgroups/pic.png", link: "#"},
                            4: {image: "../img/allgroups/pic.png", link: "#"},
                            5: {image: "../img/allgroups/pic.png", link: "#"},
                            6: {image: "../img/allgroups/pic.png", link: "#"}
                        }
                    },
                    2: {
                        image: "../img/allgroups/chicago.png",
                        icon: "img/albums/label_blue.png",
                        icons: [1, 3, 4],
                        private: 0,
                        content: {
                            title: "Title 2",
                            category: "Musicians22",
                            category_link: "#",
                            category_links: {
                                1: {
                                    text: "Drummers",
                                    link: "#"
                                },
                                2: {
                                    text: "Vocalists",
                                    link: "#"
                                }
                            },
                            location: "Chicago, IL",
                            location_link: "#",
                            owner: "Shakira",
                            owner_link: "#",
                            description: "Lorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit amet...",
                            description_link: "#"
                        },
                        members: "218",
                        members_link: "#",
                        friends: "163",
                        discussions: "157",
                        discussions_link: "#",
                        messages: "411",
                        messages_link: "#",
                        images: {}
                    },
                    3: {
                        image: "../img/allgroups/chicago.png",
                        icon: "img/albums/label_yellow.png",
                        icons: [1],
                        private: 1,
                        content: {
                            title: "Title 3",
                            category: "Musicians22321",
                            category_link: "#",
                            category_links: {
                                1: {
                                    text: "Drummers",
                                    link: "#"
                                }
                            },
                            location: "Chicago, IL321",
                            location_link: "#",
                            owner: "Shakira",
                            owner_link: "#",
                            description: "Lorem ipsum dolor sit amet...",
                            description_link: "#"
                        },
                        members: "28",
                        members_link: "#",
                        friends: "63",
                        discussions: "57",
                        discussions_link: "#",
                        messages: "41",
                        messages_link: "#",
                        images: {
                            1: {image: "../img/allgroups/pic.png", link: "#"},
                            2: {image: "../img/allgroups/pic.png", link: "#"},
                            3: {image: "../img/allgroups/pic.png", link: "#"},
                            4: {image: "../img/allgroups/pic.png", link: "#"},
                            5: {image: "../img/allgroups/pic.png", link: "#"}
                        }
                    }
                };
                this.addData(data);
            }
            return false;
        },

        'checkData': function(text) {
            text = $.trim(text);
            if (!text) return false;
            else return true;
        },

        'addData': function (data) {
            var _this = this;
            this.template = $('#template').html();
            $('#allgroups_list').stop().animate({'opacity': 0}, 500, function() {
                $(this).html('');
                var template = _this.template;
                var html = '';
                var _class = ' right';
                for (var v in data) {
                    _class = (_class) ? '' : ' right';
                    html += _this.addDataItem(data[v], template, _class);
                }
                $('#allgroups_list').html(html);
                $('#allgroups_list').stop().animate({'opacity': 1}, 500);
            });
        },

        'addDataItem': function (data, template, _class) {
            template = template.replace('{class}', _class);
            template = template.replace('{image}', data.image);
            template = template.replace('{icon}', data.icon);
            template = template.replace('{private}', data.private ? 'block' : 'none');
            template = template.replace('{title}', data.content.title);
            template = template.replace('{category}', data.content.category);
            template = template.replace('{category_link}', data.content.category_link);
            template = template.replace('{location}', data.content.location);
            template = template.replace('{location_link}', data.content.location_link);
            template = template.replace('{owner}', data.content.owner);
            template = template.replace('{owner}', data.content.owner_link);
            template = template.replace('{description}', data.content.description);
            template = template.replace('{description_link}', data.content.description_link);
            template = template.replace('{members}', data.members);
            template = template.replace('{members_link}', data.members_link);
            template = template.replace('{friends}', data.friends);
            template = template.replace('{discussions}', data.discussions);
            template = template.replace('{discussions_link}', data.discussions_link);
            template = template.replace('{messages}', data.messages);
            template = template.replace('{messages_link}', data.messages_link);
            var icons_html = '';
            for (var v in data.icons) {
                icons_html += '<i class="i-'+ data.icons[v] +'"></i>';
            }
            template = template.replace('{icons}', icons_html);
            var category_links_html = '';
            for (var v in data.content.category_links) {
                category_links_html += ((!category_links_html)  ? '' : ',&nbsp;') + '<a href="'+ data.content.category_links[v].link +'">'+ data.content.category_links[v].text +'</a>';
            }
            template = template.replace('{category_links}', category_links_html);
            var images_html = '';
            for (var v in data.images) {
                images_html += '<li><a href="'+ data.images[v].link +'"><img src="'+ data.images[v].image +'" alt="" title=""></a></li>';
            }
            template = template.replace('{images}', images_html);
            return template;
        },

        /*'sendAjax': function (link, data) {
            $.ajax({
                type: 'POST',
                dataType: 'json',
                url: link,
                data: data,
                success: function(data) {
                    alert('ok');
                },
                failure: function (data) {
                    alert('Epic fail');
                }
            });
        },*/

        'init': function () {
            $('#search_in_groups').on('submit', $.proxy(this.onFormButtonClick, this));
        }
    };
});