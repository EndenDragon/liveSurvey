var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['map'], 
		listeners: [
			{
				on:'chat message', 
				action:function(value){
					view.charts[0].addMarker(value.latlng, false)
				}
			}
		], 
		customEvents:[
			{ 
				type:'map', 
				action:function(value) {
					view.socket.emit('chat message', {latlng:value.latlng})
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