var options = ['None', 'Some HTML', 'Some JavaScript', 'Advanced JavaScript']
var settings = {
	submitted:false,
	protect:true, 
	view:{
		id:'horizontal',
		socket:'http://freeman01.ischool.uw.edu:3006/',
		charts:['horizontal'],
		getData:function(callback){
			d3.csv('gates_money.csv', function(error,data){
				settings['horizontal'].values = data.map(function(d,i) {
					var ret = {}
					ret.value = Number(d.total_amount)
					ret.id = i
					ret.category = d.organization
					return ret
				})
				callback()
			})
		},
		listeners:[
			{
				on:'chat message', 
				action:function(obj) {
					console.log('data ', obj)
					if(obj.id != view.settings.id) return
					var value = obj.value
					view.charts[0].settings.values = obj.data
					view.charts[0].draw()
				}
			}
		],
		customEvents:[
			{ 
				type:'horizontal', 
				action:function(value) {
					console.log('value ', value)
					var id = value.id
					if(settings.submitted == true && settings.protect == true) return
					view.charts[0].settings.values.filter(function(d,i) {return i == id}).map(function(d) {d.radius = d.radius == undefined ? 11 : d.radius + 1})
					var data = view.charts[0].settings.values
					view.socket.emit('chat message', {data:data, id:view.settings.id}) // emit socket event!
					$('#view-subtitle').text("you've submitted!")
					settings.submitted = true
				}				
			}
		],
		titleText:"Gates Foundation Educational Spending", 
		subtitleText:'click most expensive project', 
	},
	horizontal:{
		type:'horizontal',
		color:'rgb(122, 162, 92)'
		// values:options.map(function(d) {
		// 	return {category:d, value:0}
		// })
	}
}