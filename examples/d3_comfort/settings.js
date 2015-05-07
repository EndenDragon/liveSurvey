var settings = {
	submitted:false, 
	protect:true,
	view:{
		id:'d3-comfort',
		socket:'http://freeman01.ischool.uw.edu:3003/',
		charts:['histogram'],
		controls:[
			{
				id:'slider', 
				type:'slider-confirm',
				labels:[
					'Not comfortable', 
					'Somewhat comfortable', 
					'Very comfortable'
				],
				max:10, 
				min:-10, 
				value:0, 
				width:200,
				action:function() {
					if(settings.submitted == true && settings.protect == true) return
					var value = $('#slider').slider('value')
					view.socket.emit('chat message', {value:value, id:view.settings.id})
					$('#view-subtitle').text("you've submitted!")
					settings.submitted = true
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
		titleText:"How comfortable are you with D3?", 
		subtitleText:'slide, then click "submit"', 
	},
	histogram:{
		type:'histogram',
		xMin:-10,
		xMax:10,
		values:[]
	}
}