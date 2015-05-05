var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['histogram'],
		controls:[
			{
				id:'slider', 
				type:'slider-confirm',
				max:10, 
				min:-10, 
				value:0, 
				width:200,
				action:function() {
					var value = $('#slider').slider('value')
					view.socket.emit('chat message', {value:value, id:view.settings.id})
				}
			}

		], 
		listeners:[
			{
				on:'chat message', 
				action:function(obj) {
					if(obj.id != view.settings.id) return
					var value = obj.value
					view.charts[0].settings.values.push(value)
					view.charts[0].draw()
				}
			}
		],
		titleText:"How useful was this platform?", 
		subtitleText:'slide, then click "submit"', 
	},
	histogram:{
		type:'histogram',
		xMin:-10,
		xMax:10,
		values:[]
	}
}