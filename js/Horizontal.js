var Horizontal = function(sets) {
	var self = this
	var defaults = {
		opacity:.4, 
		radius:10, 
		color:'blue', 
		cy:10,
		showText:true,
		container:'container',
		formatCount:d3.format(",.0f"),
		margin:{top: 10, right: 50, bottom: 30, left: 30}, 
		getWidth:function() {
			return $(window).width() - self.settings.margin.left - self.settings.margin.right - 50;
		},
		getHeight:function() {
			// return $(window).height()/2 - self.settings.margin.top - self.settings.margin.bottom;
			return 90
		}
	}
	self.settings = $.extend(false, defaults, sets)
	console.log('self.settings.color ', self.settings.color)
	// Define positioning functions
	self.svgPosition = function(svg){
		svg.attr("width", self.settings.width + self.settings.margin.left + self.settings.margin.right)
	    	.attr("height", self.settings.height + self.settings.margin.top + self.settings.margin.bottom)
	}

	self.gPosition = function(g){
		g.attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.height  - self.settings.radius)+ ")");
	}
	self.circleFunction = function(circle) {
		console.log('circle funk!')
		circle.attr('cx', function(d) {return self.xScale(d.value)})
			.attr('r', function(d) {console.log(d.radius);return d.radius == undefined ? self.settings.radius : d.radius})
			.attr('cy', self.settings.cy)
			.style('opacity', self.settings.opacity)
			.style('fill', self.settings.color)
			.attr('id', function(d){return  d.id} )
	}
	
	// self.rectFunction = function(rect) {

	// 	rect.attr("x", function(d) {return self.xScale(d.category)})
	//     	.attr("width", self.xScale.rangeBand())
	//     	.attr("y", function(d) {return self.yScale(d.value)})
	//     	.attr("height", function(d) {return self.settings.height - self.yScale(d.value); });
	// }
	// self.textFunction = function(text) {
	// 	text.attr("dy", ".75em")
	//     	.attr('class', 'text')
	//     	.attr("y", function(d) {return self.yScale(d.value) + 3})
	// 	    .attr("x", function(d) {return self.xScale(d.category) + self.xScale.rangeBand()/2})
	// 	    .attr("text-anchor", "middle")
	// 	    .text(function(d) { return self.settings.formatCount(d.value); })
	// 	    .style('visibility', function(d) {
	// 	    	return d.value == 0 | self.settings.showText == false? 'hidden' : 'visible'
	// 	    })
	// }
	self.init()
}

Horizontal.prototype.setScales = function() {
	var self = this
	// self.data = d3.keys(self.settings.values).map(function(d) {
	// 	return {
	// 		category:self.settings.values[d].category, 
	// 		value:self.settings.values[d].value
	// 	}
	// })
	self.data = self.settings.values
	self.settings.height = self.settings.getHeight()
	self.settings.width = self.settings.getWidth(self)
	var max = d3.max(self.data, function(d) {return d.value})
	var min = d3.min(self.data, function(d) {return d.value})
	self.xScale = d3.scale.linear().range([0, self.settings.width]).domain([min, max]);
	// self.yScale = d3.scale.linear().domain([0, d3.max(self.data, function(d) { return d.value; })]).range([self.settings.height, 0]);

	self.xAxis = d3.svg.axis()
	    .scale(self.xScale)
	    .tickFormat(d3.format('.2s'))
	    .orient("bottom");
}

Horizontal.prototype.init = function() {
	var self = this
	
	 self.setScales()

	self.svg = d3.select("#" + self.settings.container).append('div').attr('id', self.settings.id).attr('class', 'chart').append("svg")
	self.g = self.svg.append("g").call(self.gPosition)
	    

	self.xAxisLabel = self.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.height + self.settings.margin.top) + ")")

	self.draw()	
} 

Horizontal.prototype.draw = function() {
	var self = this
	self.setScales()
	self.svg.call(self.svgPosition)
	self.g.call(self.gPosition)
	console.log('data length ', self.data.length)
	self.circles = self.g.selectAll('circle').data(self.data)

	self.circles.enter().append("circle").call(self.circleFunction)

	// self.text = self.g.selectAll('text').data(self.data, function(d) {return d.category})

	// self.text.enter().append("text").call(self.textFunction)
	
	self.g.selectAll('circle').transition().duration(500).call(self.circleFunction)
	// self.g.selectAll('text').transition().duration(500).call(self.textFunction)
	self.xAxisLabel.transition().duration(500).call(self.xAxis);
}
