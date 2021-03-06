var options = ['A', 'B', 'C', 'D', 'E']
var settings = {
	submitted:false,
	protect:true, 
	view:{
		id:'two-bars',
		socket:'http://freeman01.ischool.uw.edu:3001/',
		charts:['bar1', 'bar'], 
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
				type:'bar', 
				action:function(obj) {
					if(settings.submitted == true && settings.protect == true) return
					var id = view.settings.id
			        view.socket.emit('chat message', {value:obj.category, id:id});
			        $('#view-subtitle').text("you've submitted!")
			        settings.submitted = true
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
			var value = d == 'D' ? 2.04 : 2
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