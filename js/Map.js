// To do
/*
	- Add stations?
	- Date selector?
	- Put on chloropleth poverty map?
*/
var data,map,widthScale, opacityScale, routes, timeFactor;
var lines = {}
var drawMap = function () {
	var height = $('#container').innerHeight() - $('#header').height()
	console.log('height ', height)
	d3.select('#' + settings.container).append('div').attr('id', settings.id).style('height', height + 'px')
	d3.select('#map').style('background-color', settings.backgroundColor)
	d3.select('body').style('background-color', settings.backgroundColor)

	L.mapbox.accessToken = 'pk.eyJ1IjoibWljaGFlbGZyZWVtYW4iLCJhIjoibE5leG9MRSJ9.YHTl3OfWurGattFSUzwhag';
	var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v4/michaelfreeman.lmgiepbm/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
	    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
	});

	map = L.map('map', {
	    center: settings.center,
	    zoom: settings.zoom,
	})

	var controls = {'Show map': mapboxTiles}
	L.control.layers({},controls).addTo(map);
	if(settings.showMap == true) {
		map.addLayer(mapboxTiles)	
	}
	
	d3.select('#label-left').append('text').text('Chicago')
	d3.select('#label-middle').append('text').text('bikers')
	d3.select('#label-right').append('text').text('(6/28/2014)')
	window.setTimeout(function() {d3.select('#label').transition().duration(2000).style('opacity', 0).each('end', function() {drawLinesByMinute()})}, 2000)
}

drawMap()


var map, newMarker, markerLocation;
var clicks = 0
$(function(){
	// Initialize the map
	var map = L.map('map').setView([38.487, -75.641], 8);
	L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
    	maxZoom: 18
	}).addTo(map);
	newMarkerGroup = new L.LayerGroup();
    map.on('click', function(e){
        clicks ++ 
            if(clicks == 1) {
                setTimeout(function() {
                    if(clicks == 1) {
                         var newMarker = new L.marker(e.latlng).addTo(map);                 
                        clicks = 0
                    }
                }, 300)
            }
        else {
            clicks = 0
        }
       
    });
});