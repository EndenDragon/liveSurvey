var options = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Other']
var settings = {
	submitted:false,
	protect:false, 
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
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
			        view.socket.emit('chat message', value);
			        settings.submitted = true
			        return false;
			    }
			}, 

		], 
		listeners:[
			{
				on:'chat message', 
				action:function(value) {
					view.charts[0].settings.values.filter(function(d) {return d.category == value}).map(function(d) {d.value += 1})
					view.charts[0].draw()
				}
			}
		],
		titleText:"What is your class standing?", 
		subtitleText:'', 
	},
	bar:{
		type:'bar',
		values:options.map(function(d) {
			return {category:d, value:0}
		})
	}
}