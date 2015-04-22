var View = function (sets) {
	var self = this
	var defaults = {
		charts:['map'],
		getUser:false,
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
	
	// Get user
	if(self.settings.getUser == true){
		Apprise("Name", self.settings.userOptions)
	}
	else self.build()
}

View.prototype.build = function() {
	var self = this
	self.addTitle()
	self.buildControls()	
	self.charts = self.settings.charts.map(function(chart){
		switch(chart) {
			case 'map':
				return new Map(settings[chart])
				break;
			case 'chat':
				return new Chat(settings[chart])
		}
	})
	self.addEvents()
}

View.prototype.buildControls = function(){
	var self = this
	if(self.settings.controls == undefined) return
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

	// Add listeners
	self.settings.listeners.map(function(event){
		self.socket.on(event.on, event.action)
	})

	// Add custom events (ie, not controls)
	self.settings.customEvents.map(function(event){
		switch(event.type) {
			case 'form':
				$(event.ele).submit(event.action)
				break;
			case 'map':
				self.charts[0].map.on('click', event.action)
				break;	
		}
	})

	 
}
