var options = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Other']
var settings = {
	submitted:false,
	protect:true, 
	view:{
		id:'bar',
		socket:'http://freeman01.ischool.uw.edu:3002/',
		charts:['bar'],
		controls:[
			{	
				id:'choice',
				type:'buttons', 
				options:function() {
					return options.map(function(d){return {id:d, text:d}})
				}, 
				action:function(){
			        if(settings.submitted == true && settings.protect == true) return
			        var value =  $(this)[0].id
			    	var id = view.settings.id
			        view.socket.emit('chat message', {value:value, id:id});
			        settings.submitted = true
			        $('#view-subtitle').text("you've submitted!")
			        return false;
			    }
			}, 

		], 
		listeners:[
			{
				on:'chat message', 
				action:function(obj) {
					if(obj.id != view.settings.id) return
					var value = obj.value
					view.charts[0].settings.values.filter(function(d) {return d.category == value}).map(function(d) {d.value += 1})
					view.charts[0].draw()
				}
			}
		],
		titleText:"What is your class standing?", 
		subtitleText:'(click to share)', 
	},
	bar:{
		type:'bar',
		values:options.map(function(d) {
			return {category:d, value:0}
		})
	}
}