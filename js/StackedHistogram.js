var StackedHistogram = function(sets) {
	var self = this
	var defaults = {
		height:100,
		bins:[100000, 500000, 1000000,5000000, 10000000, 100000000 ],
		xMin:0, 
		xMax:1,
		rectPadding:1,
		container:'container',
		formatCount:d3.format(",.0f"),
		margin:{top: 10, right: 50, bottom: 30, left: 50}, 
		getWidth:function() {
			return $(window).width() - self.settings.margin.left - self.settings.margin.right;
		},
		getHeight:function() {
			return $(window).height() - 50 - self.settings.margin.top - self.settings.margin.bottom;
		}
	}
	self.settings = $.extend(false, defaults, sets)

	// Define positioning functions
	self.svgPosition = function(svg){
		svg.attr("width", self.settings.width + self.settings.margin.left + self.settings.margin.right)
	    	.attr("height", self.settings.height + self.settings.margin.top + self.settings.margin.bottom)
	}

	self.gPosition = function(g){
		g.attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.margin.top - self.settings.rectHeight) + ")");
	}
	self.groupPosition = function(g) {
		g.attr("class", "bar")
	    	.attr("transform", function(d) {;return "translate(" + (self.xScale(d.x) - self.settings.rectWidth/2) + "," + self.yScale.range()[0] + ")"; });
	}
	self.rectFunction = function(rect) {

		rect.attr("x", 1)
	    	.attr("width", self.settings.rectWidth)
	    	// .attr("width", self.xScale(self.data[0].dx) - 1)
	    	// .attr("height", function(d) {return self.settings.height - self.yScale(d); });
	    	.attr('height', self.settings.rectHeight)
	    	.attr('y', function(d,i){return -i*(self.settings.rectHeight + self.settings.rectPadding)})
	}
	self.textFunction = function(text) {
		text.attr("dy", ".75em")
	    	.attr("y", 6)
		    .attr("x", self.xScale.range()[1]/(self.settings.bins*2))
		    .attr("text-anchor", "middle")
		    .text(function(d) { return self.settings.formatCount(d.y); });
	}
	self.init()
}

StackedHistogram.prototype.setScales = function() {
	var self = this
	var values = self.settings.values
	if(self.settings.getRange == true) {
		self.settings.xMin = d3.min(values, function(d){return d.value})
		self.settings.xMax = d3.max(values, function(d){return d.value})
	}
	self.settings.height = self.settings.getHeight()
	self.settings.width = self.settings.getWidth()
	self.xScale = d3.scale.linear().domain([0, d3.max(self.settings.bins.slice(0,self.settings.bins.length - 1))]).range([0, self.settings.width]);
	// self.xScale = d3.scale.linear().domain([self.settings.xMin, self.settings.xMax]).range([0, self.settings.width]);
	self.data = d3.layout.histogram().bins(self.settings.bins).value(function(d) {return d.value})(values);
	self.settings.mostRects = d3.max(self.data, function(d) {return d.length})
	self.settings.rectWidth = self.xScale(self.settings.bins[1]) - self.xScale(self.settings.bins[0]) - 2
	self.yScale = d3.scale.linear().domain([0, d3.max(self.data, function(d) { return d.y; })]).range([self.settings.height, 0]);
	self.settings.rectHeight = (self.yScale.range()[0]/(self.settings.mostRects)) - self.settings.rectPadding
	self.xAxis = d3.svg.axis()
	    .scale(self.xScale)
	    .tickFormat(d3.format('.2s'))
	    .orient("bottom");
}

StackedHistogram.prototype.init = function() {
	var self = this
	
	 self.setScales()

	self.svg = d3.select("#" + self.settings.container).append('div').append("svg")
	self.g = self.svg.append("g").call(self.gPosition)
	    

	self.xAxisLabel = self.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.height + self.settings.margin.top) + ")")

	self.draw()	
} 

StackedHistogram.prototype.draw = function() {
	var self = this
	self.setScales()
	self.svg.call(self.svgPosition)
	self.g.call(self.gPosition)
	var bars = self.g.selectAll(".bar")
	    .data(self.data, function(d) {return d.x})

	bars.exit().remove()

	var entering = bars.enter().append("g").call(self.groupPosition)
	
	self.rects = d3.selectAll('.bar').selectAll("rect")
		.data(function(d) {return d3.range(0,d.y); })

	self.rects.enter().append("rect").call(self.rectFunction)

	// self.text = d3.selectAll('.bar').selectAll("text")
	// 	.data(function(d) {return [d]; })

	// self.text.enter().append("text").call(self.textFunction)
	
	self.g.selectAll('.bar').transition().duration(500).call(self.groupPosition)
	self.rects.transition().duration(500).call(self.rectFunction)
	// self.g.selectAll('.bar rect').transition().duration(500).call(self.rectFunction)
	// self.g.selectAll('.bar text').transition().duration(500).call(self.textFunction)
	self.xAxisLabel.transition().duration(500)
		    .attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.height + self.settings.margin.top) + ")")
		    .call(self.xAxis);
}
