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
		Apprise(self.settings.userPrompt, self.settings.userOptions)
	}
	// else self.build()
	self.build()
}

View.prototype.build = function() {
	var self = this
	self.addTitle()
	self.buildControls()	
	self.charts = self.settings.charts.map(function(chart){
		switch(settings[chart].type) {
			case 'map':
				return new Map(settings[chart])
				break;
			case 'chat':
				return new Chat(settings[chart])
				break;
			case 'histogram':
				return new Histogram(settings[chart])
				break;
			case 'bar':
				return new Bar(settings[chart])
				break;
			case 'pie':
				return new Pie(settings[chart])
				break;
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
			case 'slider-confirm':
				var sliderTooltip = function(event, ui) {
				    var curValue = ui.value || control.value;
				    var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + curValue + '</div><div class="tooltip-arrow"></div></div>';
				    $('.ui-slider-handle').html(tooltip);
				   
				}
				$("#container").append('<div id=' + control.id + '-wrapper>')				
				$('#' + control.id + '-wrapper').append('<div id=' + control.id + ' class="slider">')
				$('#' + control.id).slider({
					min:control.min == undefined ? 0 : control.min, 
					max:control.max == undefined ? 10 : control.max, 
					value:control.value == undefined ? 5 : control.value, 
					create: sliderTooltip,
    				slide: sliderTooltip, 
    				width:control.width == undefined ? '200px' : control.width,
    				stop:function() { $('.ui-slider-handle').blur()}

				})
				$('#' + control.id).append("<div id=slider-labels style='font-size:12px; margin-top:25px; text-align:center;'>")
				$('#slider-labels').append('<div style="width:33%;text-align:left;"><span>' + control.labels[0] + '</span></div>')
				$('#slider-labels').append('<div style="width:33%;text-align:center;"><span>' + control.labels[1] + '</span></div>')
				$('#slider-labels').append('<div style="width:33%;text-align:right;"><span>' + control.labels[2] + '</span></div>')

				var submit = $('<button>',{text:'submit', click:control.action})
				$('#' + control.id + '-wrapper').append(submit)
				break;
		}
	})
}

View.prototype.addEvents = function() {
	var self = this

	// Add listeners
	if(self.settings.listeners != undefined) {
		self.settings.listeners.map(function(event){
			self.socket.on(event.on, event.action)
		})
	}

	// Add custom events (ie, not controls)
	if(self.settings.customEvents != undefined) {
		self.settings.customEvents.map(function(event){
			switch(event.type) {
				case 'form':
					$(event.ele).submit(event.action)
					break;
				case 'map':
					self.charts[0].map.on('click', event.action)
					break;	
				case 'pie':
					self.charts[0].g.selectAll('.arc').on('click', event.action)
					break;	
				case 'bar':
					self.charts[0].g.selectAll('rect').on('click', event.action)
					break;
			}
		})
	}
}
