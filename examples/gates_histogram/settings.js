var settings = {
	submitted:false, 
	protect:true,
	view:{
		id:'useful',
		getData:function(callback){
			d3.csv('gates_money.csv', function(error,data){
				settings['histogram'].values = data.map(function(d) {
					var ret = {}
					ret.value = Number(d.total_amount)
					ret.category = d.organization
					return ret
				})
				callback()
			})
		},
		socket:'http://freeman01.ischool.uw.edu:3003/',
		charts:['histogram'],
		// controls:[
		// 	{
		// 		id:'slider', 
		// 		type:'slider-confirm',
		// 		labels:[
		// 			'very distracting', 
		// 			'neutral', 
		// 			'awesome'
		// 		],
		// 		max:10, 
		// 		min:-10, 
		// 		value:0, 
		// 		width:200,
		// 		action:function() {
		// 			if(settings.submitted == true && settings.protect == true) return
		// 			var value = $('#slider').slider('value')
		// 			view.socket.emit('chat message', {value:value, id:view.settings.id})
		// 			$('#view-subtitle').text("you've submitted!")
		// 			settings.submitted = true
		// 		}
		// 	}

		// ], 
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
		titleText:"Gates Foundation Educational Spending", 
		subtitleText:'', 
	},
	histogram:{
		type:'stackedHistogram',
		getRange:true,
		// xMin:-10,
		// xMax:10,
		values:[]
	}
}