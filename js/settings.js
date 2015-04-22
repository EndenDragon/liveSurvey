var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['map', 'chat'], 
		getUser:false,
		userOptions:{
			input:true, 
			buttons:{
				confirm:{
					text:'test',
					action:function(e){
						view.settings.user = e.input
						Apprise('close')
						view.build()
					}
				}
			}
		},
		controls:[
			{	
				id:'choice',
				type:'buttons', 
				options:function() {
					return [{id:'no', text:'No'}, {id:'yes', text:'Yes'}]
				}, 
				action:function(){
			        var value =  $(this)[0].id
			        view.socket.emit('chat message', value);
			        return false;
			    }
			}, 
			{	
				id:'input',
				type:'input', 
				label:'here we go:',
				action:function(){
			        var value =  $('#input').val()
			        view.socket.emit('chat message', value);
			        return false;
			    }
			}, 

		], 
		listeners: [
			// {
			// 	on:'chat message', 
			// 	action:function(value) {
			// 		console.log("heard ", value)
			// 		d3.select('body').append('text').text(value)
			// 	}
			// },
			// {
			// 	on:'chat message', 
			// 	action:function(value) {
			// 		 $('#messages').append($('<li>').html(value));
			// 	}
			// }, 
			{
				on:'chat message', 
				action:function(value){
					view.charts[0].addMarker(value.latlng, false)
				}
			}
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
			{ 
				type:'map', 
				action:function(value) {
					view.socket.emit('chat message', {latlng:value.latlng})
				}				
			}
		], 
		titleText:"What's up?", 
		subtitleText:'(type response below)'
	},
}