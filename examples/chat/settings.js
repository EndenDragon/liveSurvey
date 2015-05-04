var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['chat'], 
		getUser:true,
		userPrompt:"Enter your UW NetID",
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
		titleText:"What has been your favorite topic of this course?", 
		subtitleText:'(type response below)'
	},
	chat:{
		type:'chat',
	},
}