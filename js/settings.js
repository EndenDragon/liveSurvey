var settings = {
	view:{
		socket:'http://freeman01.ischool.uw.edu:3000/',
		charts:['none'], 
		controls:[
			{	
				id:'choice',
				type:'buttons', 
				options:function() {
					return [{id:'no', text:'No'}, {id:'yes', text:'Yes'}]
				}, 
				action:function(){
			        var value =  $(this)[0].id
			        view.socket.emit('chat message', value);
			        return false;
			    }
			}, 
			{	
				id:'input',
				type:'input', 
				label:'here we go:',
				action:function(){
			        var value =  $('#input').val()
			        view.socket.emit('chat message', value);
			        return false;
			    }
			}

		], 
		listeners: [
			{
				on:'chat message', 
				action:function(value) {
					console.log("heard ", value)
					d3.select('body').append('text').text(value)
				}
			}
		]
	},
}