var settings = {
	view:{
		id:'map',
		socket:'http://freeman01.ischool.uw.edu:3000/',
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
					var id = view.settings.id
			        view.socket.emit('chat message', {latlng:value.latlng, id:id});
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