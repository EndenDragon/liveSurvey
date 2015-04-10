var settings = {
	container:'container', 
	id:'map',
	date:'2014-6-30',
	encodeOpacity:false, 
	encodeWidth:false, 
	defaultOpacity:.5,
	finalOpacity:.2,
	defaultWidth:2,
	opacityRange:[.01, .1], 
	widthRange:[1,20],
	showMap:true, 
	dataFile:'data/data_start_stop.csv',
	routeFile:'data/formatted_routes.csv',
	color:'#2FCAFC', 
	backgroundColor:'none', 
	dataSource:'csv',
	timeFactor:150,
	maxSpeed:10,
	speedChange: -1,
	interval:10000, 
	disappear:true,
	disappearTime:0,
	center:[41.8944829010142, -87.6595687866211],
	zoom:12, 
	speedUp:true,
	startMinute:0*60, 
	totalMinutes:24*60,
}