var Bar = function(sets) {
	var self = this
	var defaults = {
		height:100,
		bins:10,
		xMin:0, 
		xMax:1,
		showText:true,
		container:'container',
		formatCount:d3.format(",.0f"),
		margin:{top: 10, right: 30, bottom: 30, left: 30}, 
		getWidth:function() {
			return $(window).width()*2/3 - self.settings.margin.left - self.settings.margin.right;
		},
		getHeight:function() {
			return $(window).height()/2 - self.settings.margin.top - self.settings.margin.bottom;
		}
	}
	self.settings = $.extend(false, defaults, sets)

	// Define positioning functions
	self.svgPosition = function(svg){
		svg.attr("width", self.settings.width + self.settings.margin.left + self.settings.margin.right)
	    	.attr("height", self.settings.height + self.settings.margin.top + self.settings.margin.bottom)
	}

	self.gPosition = function(g){
		g.attr("transform", "translate(" + self.settings.margin.left + "," + self.settings.margin.top + ")");
	}
	
	self.rectFunction = function(rect) {

		rect.attr("x", function(d) {return self.xScale(d.category)})
	    	.attr("width", self.xScale.rangeBand())
	    	.attr("y", function(d) {return self.yScale(d.value)})
	    	.attr("height", function(d) {return self.settings.height - self.yScale(d.value); });
	}
	self.textFunction = function(text) {
		text.attr("dy", ".75em")
	    	.attr('class', 'text')
	    	.attr("y", function(d) {return self.yScale(d.value) + 3})
		    .attr("x", function(d) {return self.xScale(d.category) + self.xScale.rangeBand()/2})
		    .attr("text-anchor", "middle")
		    .text(function(d) { return self.settings.formatCount(d.value); })
		    .style('visibility', function(d) {
		    	return d.value == 0 | self.settings.showText == false? 'hidden' : 'visible'
		    })
	}
	self.init()
}

Bar.prototype.setScales = function() {
	var self = this
	self.data = d3.keys(self.settings.values).map(function(d) {
		return {
			category:self.settings.values[d].category, 
			value:self.settings.values[d].value
		}
	})
	self.settings.height = self.settings.getHeight()
	self.settings.width = self.settings.getWidth(self)
	self.xScale = d3.scale.ordinal().rangeRoundBands([0, self.settings.width], .1).domain(self.data.map(function(d) { return d.category; }));
	self.yScale = d3.scale.linear().domain([0, d3.max(self.data, function(d) { return d.value; })]).range([self.settings.height, 0]);

	self.xAxis = d3.svg.axis()
	    .scale(self.xScale)
	    .orient("bottom");
}

Bar.prototype.init = function() {
	var self = this
	
	 self.setScales()

	self.svg = d3.select("#" + self.settings.container).append('div').attr('id', self.settings.id).attr('class', 'chart').append("svg")
	self.g = self.svg.append("g").call(self.gPosition)
	    

	self.xAxisLabel = self.svg.append("g")
	    .attr("class", "x axis")
	    .attr("transform", "translate(" + self.settings.margin.left + "," + (self.settings.height + self.settings.margin.top) + ")")

	self.draw()	
} 

Bar.prototype.draw = function() {
	var self = this
	self.setScales()
	self.svg.call(self.svgPosition)
	self.g.call(self.gPosition)




	
	self.rects = self.g.selectAll('rect').data(self.data, function(d) {return d.category})

	self.rects.enter().append("rect").call(self.rectFunction)

	self.text = self.g.selectAll('text').data(self.data, function(d) {return d.category})

	self.text.enter().append("text").call(self.textFunction)
	
	self.g.selectAll('rect').transition().duration(500).call(self.rectFunction)
	self.g.selectAll('text').transition().duration(500).call(self.textFunction)
	self.xAxisLabel.transition().duration(500).call(self.xAxis);
}
