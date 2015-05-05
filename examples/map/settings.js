var settings = {
	protect:true, 
	submitted:false,
	view:{
		id:'map',
		socket:'http://freeman01.ischool.uw.edu:3004/',
		charts:['map'], 
		listeners: [
			{
				on:'chat message', 
				action:function(obj) {
					if(obj.id != view.settings.id) return
					view.charts[0].addMarker(obj.latlng, false)
				}
			}
		], 
		customEvents:[
			{ 
				type:'map', 
				action:function(value) {
					if(settings.submitted == true && settings.protect == true) return
					var id = view.settings.id
			        view.socket.emit('chat message', {latlng:value.latlng, id:id});
			        $('#view-subtitle').text("you've submitted!")
			        settings.submitted = true
				}				
			}
		], 
		titleText:"Where did you grow up?", 
		subtitleText:'(click to add your mark)'
	},
	map:{
		type:'map',
	}
}