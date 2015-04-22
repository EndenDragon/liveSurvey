// Clickable mapping function
var Map = function (sets) {
	var self = this
	var defaults = {
		id:'map',
		container:'container',
		attribution:'<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>',
		tileUrl:'https://{s}.tiles.mapbox.com/v4/michaelfreeman.lc5jblfh/{z}/{x}/{y}.png?access_token=',
		accessToken:'pk.eyJ1IjoibWljaGFlbGZyZWVtYW4iLCJhIjoibE5leG9MRSJ9.YHTl3OfWurGattFSUzwhag',
		showMap:true,
		center:[1.054, -2.10],
		zoom:1, 
		circleSize:100000, 
		circleOpacity:.2,
		circleColor:'blue',
		circleStroke:false,
		circleWeight:1,
		clicks:0,
		getHeight:function() {return $('#' + self.settings.container).innerHeight() - $('#header').height() - 20}, 
		clickFunction:function(e){
			console.log('click function ', self.settings.clicks)
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
	$(window).resize(function() {self.setHeight()})
	self.settings = $.extend(false, defaults, sets)
	self.init()
	
}

Map.prototype.setHeight = function() {
	var self = this
	$('#container').height($(window).innerHeight())
	var height = self.settings.getHeight()
	d3.select('#' + self.settings.id).style('height', height + 'px')
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
 
	if(self.settings.showMap == true) {
		self.map.addLayer(mapboxTiles)	
	}
}
	

Map.prototype.addMarker = function(latlng, click, type) {
	var self = this
	var type = type == undefined ? 'circle' : type
	switch(type) {
		case 'circle':
			var newMarker = new L.circleMarker(latlng,  {
				radius:10,
				weight:self.settings.circleWeight, 
				fillOpacity:self.settings.circleOpacity, 
				fillColor:self.settings.circleColor,
			}).addTo(self.map);
			break;
	}
}
	
