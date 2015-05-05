var settings = {
	protect:true, 
	submitted:false,
	view:{
		id:'chat',
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
				action:function(obj) {
					if(obj.id != view.settings.id) return
					var value = obj.value
					 $('#messages').append($('<li>').html(value));
				}
			}, 
		], 
		customEvents:[
			{
				ele:'.chat-form', 
				type:'form', 
				action:function(){
					if(settings.submitted == true && settings.protect == true) return false;
					var val = view.settings.user == undefined ? $('#m').val() : '<b>' + view.settings.user + '</b>: ' + $('#m').val()
			        view.socket.emit('chat message', {id:view.settings.id, value:val});
			        $('#m').val('');
			        $('.send-button').blur()
			        settings.submitted = true
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