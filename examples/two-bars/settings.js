var options = ['A', 'B', 'C', 'D', 'E']
var settings = {
	submitted:false,
	protect:false, 
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['bar1', 'bar'], 
		listeners:[
			{
				on:'chat message', 
				action:function(value) {
					console.log('value ', value)
					view.charts[1].settings.values.filter(function(d) {return d.category == value}).map(function(d) {d.value += 1})
					// view.charts[0].settings.values.push(value)
					view.charts[1].draw()
				}
			}
		],
		customEvents:[
			{ 
				type:'bar', 
				action:function(value) {
					console.log('clicked ', value)
					view.socket.emit('chat message', value.category)
				}				
			}
		],
		titleText:"Which bar is tallest?", 
		subtitleText:'(click bar to vote)', 
	},
	bar1:{
		type:'bar',
		id:'bar1',
		values:options.map(function(d) {
			var value = d == 'C' ? 2.3 : 2
			return {category:d, value:value}
		}), 
		getWidth:function(chart) {
			return $(window).width()*1/2 - chart.settings.margin.left - chart.settings.margin.right;
		},
		showText:false,
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