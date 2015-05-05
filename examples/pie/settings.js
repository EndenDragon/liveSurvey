var options = ['A', 'B', 'C', 'D', 'E']
var settings = {
	submitted:false,
	protect:false, 
	view:{
		id:'pie',
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['pie', 'bar'], 
		listeners:[
			{
				on:'chat message', 
				action:function(obj) {
					if(obj.id != view.settings.id) return
					var value = obj.value
					view.charts[1].settings.values.filter(function(d) {return d.category == value}).map(function(d) {d.value += 1})
					view.charts[1].draw()
				}
			}
		],
		customEvents:[
			{ 
				type:'pie', 
				action:function(value) {
					view.socket.emit('chat message', {value:value.data.category, id:view.settings.id})
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
			var value = d == 'E' ? 2.04 : 2
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