var View = function (sets) {
	var self = this
	var defaults = {
		charts:['map'],
		titleContainer:'header',
		titleText:'Where are you?', 
		subtitleText:'(click to add pin)'
	}
	self.settings = $.extend(false, defaults, sets)
	self.init()
}

View.prototype.addTitle = function() {
	var self = this
	d3.select('#' + self.settings.titleContainer)
		.append('div')
		.attr('id', 'view-title')
		.text(self.settings.titleText)

	if(self.settings.subtitleText != undefined) {
		d3.select('#' + self.settings.titleContainer)
			.append('div')
			.attr('id', 'view-subtitle')
			.text(self.settings.subtitleText)
	}
}
View.prototype.init = function() {
	var self = this
	self.addTitle()
	self.charts = self.settings.charts.map(function(chart){
		switch(chart) {
			case 'map':
				return new Map(settings[chart])
		}
	})
}