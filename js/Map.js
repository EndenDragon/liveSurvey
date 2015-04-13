// Clickable mapping function
var Map = function (sets) {
	var self = this
	var defaults = {
		id:'map',
		container:'container',
		attribution:'<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
		tileUrl:'https://{s}.tiles.mapbox.com/v4/michaelfreeman.lmgiepbm/{z}/{x}/{y}.png?access_token=',
		accessToken:'pk.eyJ1IjoibWljaGFlbGZyZWVtYW4iLCJhIjoibE5leG9MRSJ9.YHTl3OfWurGattFSUzwhag',
		showMap:true,
		center:[47.6097, -122.3331],
		zoom:8, 
		getHeight:function() {return $('#' + self.settings.container).innerHeight() - $('#header').height() - 20}, 
		clickFunction:function(e){
	        self.settings.clicks ++ 
	            if(self.settings.clicks == 1) {
	                setTimeout(function() {
	                    if(self.settings.clicks == 1) {
	                        self.addMarker(e.latlng)
	                        self.settings.clicks = 0
	                    }
	                }, 300)
	            }
	        else {
	            self.settings.clicks = 0
	        }
	       
	    }
	}
	self.settings = $.extend(false, defaults, sets)
	self.init()
	
}

Map.prototype.init = function() {
	var self = this
	self.settings.height = self.settings.getHeight()
	self.container = d3.select('#' + self.settings.container)
		.append('div')
		.attr('id', self.settings.id)
		.style('height', self.settings.height + 'px')
		.style('background-color', self.settings.backgroundColor)
	

	L.mapbox.accessToken = self.settings.accessToken
	var mapboxTiles = L.tileLayer(self.settings.tileUrl + L.mapbox.accessToken, {
	    attribution: self.settings.attribution
	});

	self.map = L.map('map', {
	    center: self.settings.center,
	    zoom: self.settings.zoom,
	})

	self.markerGroup = new L.LayerGroup();
 
    self.map.on('click', self.settings.clickFunction)

	if(self.settings.showMap == true) {
		self.map.addLayer(mapboxTiles)	
	}
}
	

Map.prototype.addMarker = function(latlng, click) {
	var self = this
	console.log(latlng, click)
	var newMarker = new L.marker(latlng).addTo(self.map);
	if(click != false) socket.emit('chat message', latlng);
}
	
