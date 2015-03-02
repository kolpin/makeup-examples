define(['jquery'], function () { 
	'use strict';
		
	function InfoBox(opts) {
						  google.maps.OverlayView.call(this);
						  this.latlng_ = opts.latlng;
						  this.map_ = opts.map;
						  this.marker_ = opts.marker;
						  this.offsetVertical_ = -195;
						  this.offsetHorizontal_ = -90;
						  this.height_ = 80;
						  this.width_ = 227;
						  this.info = opts.info;
						  
						  ;
						  var me = this;
						  this.boundsChangedListener_ = google.maps.event.addListener(this.map_, "bounds_changed", function() {
							  return me.panMap.apply(me);
						  });
			

							google.maps.event.addListener(this.map_, "click", function() {
								var el = event.target;
							 	if ($(el).hasClass('close')) me.remove();
						  	});
						  	//console.log(opts);


						  this.setMap(this.map_);
						}

						/* InfoBox extends GOverlay class from the Google Maps API
						 */
						InfoBox.prototype = new google.maps.OverlayView();

						/* Creates the DIV representing this InfoBox
						 */
						InfoBox.prototype.remove = function() {
						  if (this.div_) {
							this.div_.parentNode.removeChild(this.div_);
							this.div_ = null;
						  }
						  if (this.marker_) {
						  	this.marker_.infoBox = false;
						  }
					  	  this.setMap(null);
					  	  this.map_ = null;
						};

						/* Redraw the Bar based on the current projection and zoom level
						 */
						InfoBox.prototype.draw = function() {
						  if (!this.map_) return;
						  
						  // Creates the element if it doesn't exist already.
						  this.createElement();
						  if (!this.div_) return;

						  // Calculate the DIV coordinates of two opposite corners of our bounds to
						  // get the size and position of our Bar
						  var pixPosition = this.getProjection().fromLatLngToDivPixel(this.latlng_);
						  if (!pixPosition) return;
						  
						  // Find center coordinates of info box
						  var latLngPosition = this.getProjection().fromDivPixelToLatLng(new google.maps.Point(pixPosition.x - 50, pixPosition.y + this.offsetVertical_ / 2));
						  if (latLngPosition) {
						  	this.map_.setCenter(latLngPosition);
						  }
						
						  // Now position our DIV based on the DIV coordinates of our bounds
						  this.div_.style.width = this.width_ + "px";
						  this.div_.style.left = (pixPosition.x + this.offsetHorizontal_) + "px";
						  this.div_.style.height = this.height_ + "px";
						  this.div_.style.top = (pixPosition.y + this.offsetVertical_) + "px";
						  this.div_.style.display = 'block';
						};

						/* Creates the DIV representing this InfoBox in the floatPane.  If the panes
						 * object, retrieved by calling getPanes, is null, remove the element from the
						 * DOM.  If the div exists, but its parent is not the floatPane, move the div
						 * to the new pane.
						 * Called from within draw.  Alternatively, this can be called specifically on
						 * a panes_changed event.
						 */
						
						InfoBox.prototype.createElement = function() {
						  var panes = this.getPanes();
						  var div = this.div_;
						  if (!div) {
							// This does not handle changing panes.  You can set the map to be null and
							// then reset the map to move the div.
                if (typeof $('#pin-popup').get(0) == 'undefined') {
                  return false;
                }
							div = this.div_ = document.createElement("div");
							div.className = 'pin-popup';
							div.style.width = this.width_ + "px";
							div.style.height = this.height_ + "px";
							var contentDiv = document.createElement("div");
							
		
							
							contentDiv.innerHTML = $('#pin-popup').html()
													  .replace(/%logo%/g, '<img src="' + this.info.logo + '">')
													  .replace(/%title%/g, decodeURIComponent(this.info.title.replace(/\+/g, ' ')))
													  .replace(/%description%/g, decodeURIComponent(this.info.description.replace(/\+/g, ' ')));

							div.appendChild(contentDiv);
							div.style.display = 'none';
							panes.floatPane.appendChild(div);
							this.panMap();
						  } else if (div.parentNode != panes.floatPane) {
							// The panes have changed.  Move the div.
							div.parentNode.removeChild(div);
							panes.floatPane.appendChild(div);
						  } else {
							// The panes have not changed, so no need to create or move the div.
						  }
						};

						/* Pan the map to fit the InfoBox.
						 */
						InfoBox.prototype.panMap = function() {
						  // if we go beyond map, pan map
						  var map = this.map_;
						  var bounds = map.getBounds();
						  if (!bounds) return;

						  // center the map to the new shifted center
						  //map.setCenter(new google.maps.LatLng(this.latlng_.jb, this.latlng_.kb));

						  // Remove the listener after panning is complete.
						  google.maps.event.removeListener(this.boundsChangedListener_);
						  this.boundsChangedListener_ = null;
						};
	
	
	
			
	return {
		'icons': [
			'/img/music-pin.png',
			'/img/film-pin.png',
			'/img/design-pin.png',
			'/img/theater-pin.png',
			'/img/art-pin.png',
			'/img/contact-us/map-pin.png'
		],
		
		'markers': [],
		
		'container': null,
		
		'handleMarkerClick': function (marker, data) {
			var map = this.map;
			
			map.panTo(marker.getPosition());
			
			if (this.infoBox) this.infoBox.remove();
			this.infoBox = new InfoBox({latlng: marker.getPosition(), map: this.map, marker: this, info: data});
			//console.log(this.infoBox);
		},
		
		'update': function (data) {
			// ---------Draw all markers---------
			var marker,
				markers = this.markers,
				icons = this.icons,
				self = this,
				handler;
			
			for (var i = 0, l = data.length, marker; i < l; i++) {
				marker  =   new google.maps.Marker({
					'map':		this.map,
					'icon':		icons[data[i].type],
					'position':	new google.maps.LatLng(data[i].lat, data[i].lng),
					'title':	data[i].title
				});
				
				handler = (function (marker, data) {
					return $.proxy(function () {
						this.handleMarkerClick(marker, data);
					}, self);
				})(marker, data[i]);
				
				google.maps.event.addListener(marker, 'click', handler);
				//google.maps.event.addListener(this.map, 'click', handler);
				
				markers.push({'type': data[i].type, 'marker': $(marker).data({'id': data[i].id, 'type': data[i].type})[0]});
			}
			//});
		},
		'expand': function () {
			var map = $('.google-map');
			var mapContainer = this.mapContainer;		
			mapContainer.animate({height:441}, 300);
      this.container.addClass('expanded');
			google.maps.event.trigger(map, "resize");
		},
		
		'collapse': function () {
			var map = $('.google-map');
			var mapContainer = this.mapContainer;
			mapContainer.animate({height:150},300);
      this.container.removeClass('expanded');
			google.maps.event.trigger(map, "resize");
		},
		
		'init': function (data) {
			this.container = $('.map');
			this.mapContainer = this.container.find('.google-map');

			var mapOptions = {
	    		zoom: 10,
			    center: new google.maps.LatLng(56.958863802416495, 24.113788654739437) // set latitude and longtitude of map center
	  		};
	  		
	  		
	  		
	  		this.map = new google.maps.Map(this.mapContainer.get(0), mapOptions);
	  		
	  		//console.log(this.map);
	  		// ---------pop-up box hide on click--------    
		    	
		    	var box = this.container.find(".pin-popup"),
		    		link = this.container.find('a');
		    		//console.log(box);
		    	link.on('click' , function (e) {
					alert(1);		    	
		    		box.hide();
		    		
		    		return false;
		    	});
		    		
		    	

	  		//---------maximize animation---------
	  		
		    var button = this.container.find('.button');
		    var minButton = this.container.find('.min-button');
		    var map = this.map;
		    button.on('click', $.proxy(function() {
		    	button.hide();
		    	this.expand();
		    	// ---------map resize function start---------
			google.maps.event.addListener(map, "idle", function(){
				google.maps.event.trigger(map, 'resize'); 
			});	

			this.map.setZoom( this.map.getZoom() - 1);
			this.map.setZoom( this.map.getZoom() + 1);
				// ---------map resize function end
		    	minButton.show();
		    }, this));
		    
		    //---------minimize animation---------
		    
		    var button = this.container.find('.button');
		    var minButton = this.container.find('.min-button');
		    minButton.on('click', $.proxy(function() {
		    	minButton.hide();
		    	this.collapse();
		    	button.fadeIn(300);
		    	minButton.hide();
		    }, this));
		    // Set initial markers
		    this.update(data);
		    
		    //console.log('map updated')
		    
		    
		   			
		}
		
	};		
	
});
	
	
