export const createHovers = (selection, { groups }) => {
	let legendItems = selection.selectAll(".legend-item")
  groups
  	.on('mouseover', function(e, d) {
      // remove the hover class from all elements
      removeAllHovers(groups, legendItems)

      // add the hover class to the current element
    	// radar shapes
      let chart = d3.select(this).classed("hover", true).raise();
    	let siblings = selection
      	.selectAll('.radar-shape:not(.hover)')
      	.classed('not-hover', true)
      
      // legend items
      let mediaName = d.media
      let item = legendItems.filter(function(d) { 
        	d3.select(this).classed("not-hover",true)
          return d3.select(this).attr('data-media') === mediaName
      })
      .classed("hover", true)
      .classed("not-hover", false)
    })
    .on('mouseout', function() {
    	removeAllHovers(groups, legendItems)
    	let chart = d3.select(this).lower()
  	});
  
  legendItems
    .on('mouseover', function(e, d) {
      // remove the hover class from all elements
      removeAllHovers(groups, legendItems)
			
      if(!d3.select(this).classed("unchecked")){
        // add the hover class to the current element
    		// legend items
        let item = d3.select(this).classed("hover", true);
        let siblings = selection
          .selectAll('.legend-item:not(.hover)')
          .classed('not-hover', true)

        // radar shapes
        let mediaName = d.media
        let chart = groups
          .classed("not-hover",true)
          .filter(function(d) { 
            return d3.select(this).attr('data-media') === mediaName
          })
          .classed("hover", true)
          .classed("not-hover", false)
          .raise()
      }
    })
    .on('mouseout', function(e, d) {
    	removeAllHovers(groups, legendItems)
    	if(!d3.select(this).classed("unchecked")){
        let mediaName = d.media
        let chart = groups.filter(function(d) { 
            return d3.select(this).attr('data-media') === mediaName
        })
        .lower()
      }
  	});
}

export const removeAllHovers = function(groups, legendItems) {
  // remove the hover class from all elements
  groups.classed("hover", false);
  legendItems.classed("hover", false);
  groups.classed("not-hover", false);
  legendItems.classed("not-hover", false);
}