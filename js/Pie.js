var Pie = function(sets) {
	var self = this
	var defaults = {
		height:100,
		bins:10,
		xMin:0, 
		xMax:1,
		container:'container',
		formatCount:d3.format(",.0f"),
		margin:{top: 10, right: 30, bottom: 30, left: 30}, 
		getWidth:function() {
			return $(window).width()*2/3 - self.settings.margin.left - self.settings.margin.right;
		},
		getRadius: function() {
			return Math.min(self.settings.width, self.settings.height)/2
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
		g.attr("transform", "translate(" + self.settings.width/2 + "," + self.settings.height/2 + ")");
	}
	
	self.arcFunction = function(arc) {

		arc.attr("d", self.arc)
			.attr('class', 'arc')
			.attr('id', function(d) {return d.data.category})
      		.style("fill", function(d) { return 'green'; });
	}
	self.textFunction = function(text) {
		text.attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
	      	.attr("dy", ".35em")
	      	.style("text-anchor", "middle")
	      	.text(function(d) {return d.data.category; });
	}
	self.init()
}

Pie.prototype.setScales = function() {
	var self = this
	self.data = d3.keys(self.settings.values).map(function(d) {
		return {
			category:self.settings.values[d].category, 
			value:self.settings.values[d].value
		}
	})
	self.settings.height = self.settings.getHeight()
	self.settings.width = self.settings.getWidth(self)
	self.radius = self.settings.getRadius()
	self.pie = d3.layout.pie()
    	.sort(null)
    	.value(function(d) { return d.value; });

	self.arc = d3.svg.arc()
    	.outerRadius(self.radius - 10)
    	.innerRadius(0);
}

Pie.prototype.init = function() {
	var self = this
	
	 self.setScales()

	self.svg = d3.select("#" + self.settings.container).append('div').attr('id', self.settings.id).attr('class', 'chart').append("svg")
	self.g = self.svg.append("g").call(self.gPosition)
	    
	self.draw()	
} 

Pie.prototype.draw = function() {
	var self = this
	self.setScales()
	self.svg.call(self.svgPosition)
	self.g.call(self.gPosition)
	var groups = self.g.selectAll(".group")
	    .data(self.pie(self.data), function(d) { return d.data.category})

	groups.exit().remove()

	var entering = groups.enter().append("g").attr('class', 'group')
	
	self.arcs = d3.selectAll('.group').selectAll(".arc")
		.data(function(d) {return [d];}, function(d){return d.data.group})

	self.arcs.exit().remove()

	self.arcs.enter().append("path").call(self.arcFunction)

	self.text = d3.selectAll('.group').selectAll("text")
		.data(function(d) {return [d]; })

	self.text.enter().append("text").call(self.textFunction)
	
	self.g.selectAll('.group path').transition().duration(500).call(self.arcFunction)
	self.g.selectAll('.group text').transition().duration(500).call(self.textFunction)

	
}
