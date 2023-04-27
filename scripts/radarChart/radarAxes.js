import { axisLeft, axisBottom, select } from 'd3';
export function createRadarChartAxesAndLabels (
  selection,
  {
    labels = { "C": "Community",
              "S": "Self-expression",
              "D": "Discovery",
              "A": "Agency" },
  	attributes,
  	xScale,
  	yScale,
    axisLabelOffset = yScale.range()[0] + 25,
  }
) {

  let axes = selection
    .selectAll(".radar-axes")
    .data([null])
  	.join('g')
  	.classed("radar-axes", true)
  let labelObjects = selection
    .selectAll(".radar-labels")
    .data([null])
  	.join('g')
  	.classed("radar-labels", true)
  axes
  	.selectAll('.radar-axis')
  	.data(attributes)
  	.join('g')
  	.classed('radar-axis', true)
  	.attr( 
      'transform',
      (d) => 'translate(' + (xScale(d)) + ',0)'
    )
  	.each(function(d, i) {
    	select(this)
    		.call(axisLeft(yScale).ticks(3))
  	})
  labelObjects
  	.selectAll('.radar-label')
  	.data(attributes)
  	.join('text')
  	.classed('radar-label', true)
  	.text(d => labels[d])
  	.attr('transform', d => `translate(${xScale(d)},${axisLabelOffset})`)
}
