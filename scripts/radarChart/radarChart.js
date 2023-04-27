import { select, scaleLinear, scalePoint, schemeDark2, line, axisLeft, axisBottom } from 'd3';
import { createRadarChartAxesAndLabels } from './radarAxes';
import { mediaColors } from '../mediaColors'
import { createLegend } from './radarLegend'
import { createHovers } from './radarHover'
export const radarChart = (
  selection,
  {
    data,
    width,
    height,
    margin = {
      top: 50,
      bottom: 40,
      left: 30,
      right: 130,
    },
  	attributes = ["D", "A", "C", "S"],
  	titleOffset = 10,
  	title = 'MQP Data: Social Media on Human Scales'
  }
) => {
  /*
     C S D A
  */
  let xScale = scalePoint().domain(attributes).range([margin.left, width - margin.right]).padding(0.3)
  let yScale = scaleLinear().domain([0,6]).range([height - margin.bottom, margin.top])
  console.log(data)
  data.sort((a,b) => Object.keys(mediaColors).indexOf(a.media) - Object.keys(mediaColors).indexOf(b.media)) 
  
  selection.call(createRadarChartAxesAndLabels, {
    xScale,
    yScale,
    attributes
  });
  let shapes = selection
    .selectAll(".shapes")
    .data([null])
  	.join('g')
  	.classed("shapes", true)
  
  let groups = shapes
  	.selectAll(".radar-shape")
  	.data(data)
  	.join("path")
  	.classed("radar-shape", true)
    .attr("d", (d) => getPathString(d, {attributes, xScale, yScale}))
    .attr("stroke", (d, i) => mediaColors[d.media])
  	.attr("data-media", (d) => d.media)
  
  selection.call(createLegend, {
    width,
    height,
    margin,
    data,
    color: mediaColors
  })
  
	selection.call(createHovers, { groups })
  
  selection
  	.selectAll('.radar-title')
  	.data([null])
  	.join('text')
  	.classed('radar-title', true)
  	.text(title)
  	.attr('transform', `translate(${width/2},${titleOffset})`)
}

const getPathString = (media, { attributes, xScale, yScale }) => {
  let coords = []
  attributes.forEach((d) => {
    coords.push([xScale(d), yScale(media[d])])
  })
  return line()(coords)
}
