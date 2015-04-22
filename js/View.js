var View = function (sets) {
	var self = this
	var defaults = {
		charts:['map'],
		titleContainer:'header',
		titleText:'Where did you grow up?', 
		subtitleText:'(click to add marker)'
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
	self.socket = new io.connect(self.settings.socket);
	self.addTitle()
	self.buildControls()
	self.addEvents()
	self.charts = self.settings.charts.map(function(chart){
		switch(chart) {
			case 'map':
				return new Map(settings[chart])
		}
	})
}

View.prototype.buildControls = function(){
	var self = this
	self.settings.controls.map(function(control){
		switch(control.type){
			case 'buttons':
				var options = control.options()
				options.map(function(ele){
					var button = $('<button>', {
						text:ele.text,
						id:ele.id, 
						click:control.action
					})
					$("#container").append(button)
				})
				break;
			case 'input':
				var input = $('<input>', {
					id:control.id, 
					keydown:function(event) {if(event.keyCode == 13)control.action()}
				})
				var label = $('<label>', {for:control.id,
					text:control.label
				})
				var submit = $('<button>',{text:'submit', click:control.action})
				$('#container').append(label).append(input).append(submit)
				break;
		}
	})
}

View.prototype.addEvents = function() {
	var self = this
	self.settings.listeners.map(function(event){
		self.socket.on(event.on, event.action)
	})
}
