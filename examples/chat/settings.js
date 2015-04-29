var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['chat'], 
		getUser:true,
		userPrompt:"What's your name?",
		userOptions:{
			input:true, 
			buttons:{
				confirm:{
					text:'Submit',
					action:function(e){
						view.settings.user = e.input
						Apprise('close')
						view.build()
					}
				}
			}
		},
		listeners: [
			{
				on:'chat message', 
				action:function(value) {
					 $('#messages').append($('<li>').html(value));
				}
			}, 
		], 
		customEvents:[
			{
				ele:'.chat-form', 
				type:'form', 
				action:function(){
					var val = view.settings.user == undefined ? $('#m').val() : '<b>' + view.settings.user + '</b>: ' + $('#m').val()
			        view.socket.emit('chat message', val);
			        $('#m').val('');
			        $('.send-button').blur()
			        return false;
			    }, 
			},
		], 
		titleText:"What's up?", 
		subtitleText:'(type response below)'
	},
}