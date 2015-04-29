// Clickable mapping function
var Chat = function (sets) {
	var self = this
	var defaults = {
		id:'chat',
		container:'container',
		placeholder:'Type your response here'
	}
	self.settings = $.extend(false, defaults, sets)
	self.init()
}

Chat.prototype.init = function() {
	var self = this
	console.log('conatiner ', self.settings.container, ' height ', d3.select('#' + self.settings.container).style('height'))
	var height = Number(d3.select('#' + self.settings.container).style('height').split('px')[0]) - 100
	console.log('max height ', height)
	self.container = d3.select('#' + self.settings.container).append('div').attr('id', self.settings.id)
	self.chatBox = self.container.append('ul').attr('id', 'messages').style('max-height', height + 'px')
	self.form = self.container.append('form').attr("class", 'chat-form')
	self.input = self.form.append('input').attr('id', 'm').attr('autocomplete', 'off').attr('placeholder', self.settings.placeholder).attr('autofocus', 'autofocus')
	self.button = self.form.append('button').attr('class', 'send-button').text('Send')
}