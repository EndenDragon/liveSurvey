var options = ['A', 'B', 'C', 'D', 'E']
var settings = {
	submitted:false,
	protect:true, 
	view:{
		id:'pie',
		socket:'https://titanembeds.com:949/',
		charts:['pie', 'bar'], 

		// Action is exectued when a socket hears the "on" event
		listeners:[
			{
				on:'chat message', 
				action:function(obj) {
					console.log('data ', obj)
					if(obj.id != view.settings.id) return
					var value = obj.value
					view.charts[1].settings.values = obj.data
					view.charts[1].draw()
				}
			}
		],
		customEvents:[
			{ 
				type:'pie', 
				action:function(value) {
					if(settings.submitted == true && settings.protect == true) return
					view.charts[1].settings.values.filter(function(d) {return d.category == value.data.category}).map(function(d) {d.value += 1})
					var data = view.charts[1].settings.values
					view.socket.emit('chat message', {data:data, id:view.settings.id}) // emit socket event!
					$('#view-subtitle').text("you've submitted!")
					settings.submitted = true
				}				
			}
		],
		titleText:"Which segment is largest?", 
		subtitleText:'(click segment to vote)', 
	},
	pie:{
		type:'pie',
		id:'pie',
		values:options.map(function(d) {
			var value = d == 'D' ? 2.04 : 2
			return {category:d, value:value}
		}), 
		getWidth:function(chart) {
			return $(window).width()*1/2 - chart.settings.margin.left - chart.settings.margin.right;
		},
	},
	bar:{
		type:'bar',
		id:'bar',
		values:options.map(function(d) {
			return {category:d, value:0}
		}), 
		getWidth:function(chart) {
			return $(window).width()*1/3 - chart.settings.margin.left - chart.settings.margin.right;
		},
	}
}