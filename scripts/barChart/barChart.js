import {
  select,
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  schemePuOr as colorScheme,
} from 'd3';
import { mediaColors } from '../mediaColors'

export const barChart = (
  selection,
  {
    data,
    width,
    height,
    margin,
    questionTag,
    titles,
    xAxisLabel,
    yAxisLabel,
    scale,
    max,
  }
) => {  
  const xScale = scaleBand()
    .range([
      margin.left,
      width - margin.right,
    ])
    .domain(scale)
  	.paddingOuter(0.2)
    .paddingInner(0.2);
  const yScale = scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0, max]);
  
  // Calculate
  selection.call(createBars, {
    data,
    xScale,
    yScale,
  });
  selection.call(createAxes, {
    data,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel,
  });
};

function createBars(
  selection,
  { data, xScale, yScale }
) {
  let topGroup = selection
  	.selectAll('.bars')
    .data([null])
    .join('g')
  	.classed("bars", true)
  topGroup
    .selectAll('.bar')
    .data(Object.keys(data.counts))
    .join('rect')
    .classed('bar', true)
    .attr('x', (d) => xScale(d))
    .attr('y', (d) => yScale(data.counts[d]))
    .attr('width', (d) => xScale.bandwidth())
    .attr('height', (d) => yScale(0) - yScale(data.counts[d]))
    .style('fill', (d, i) => mediaColors[data.mediaText])
}

function createAxes(
  selection,
  {
    data,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel,
    xAxisLabelOffset = 50,
    yAxisLabelOffset = 40,
  }
) {
  const yAxis = axisLeft(yScale);
  selection
    .selectAll('.yAxis')
    .data([null])
    .join('g')
    .classed('yAxis', true)
    .attr(
      'transform',
      'translate(' + xScale.range()[0] + ',0)'
    )
    .call(yAxis);

  const xAxis = axisBottom(xScale);
  selection
    .selectAll('.xAxis')
    .data([null])
    .join('g')
    .classed('xAxis', true)
    .attr(
      'transform',
      'translate(0,' + yScale.range()[0] + ')'
    )
    .call(xAxis);

  selection
    .selectAll('.yAxisLabel')
    .data([null])
    .join('text')
    .classed('yAxisLabel', true)
    .text(yAxisLabel)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .attr(
      'y',
      xScale.range()[0] - yAxisLabelOffset
    )
    .attr(
      'x',
      -(yScale.range()[0] + yScale.range()[1]) / 2
    );

  selection
    .selectAll('.xAxisLabel')
    .data([null])
    .join('text')
    .classed('xAxisLabel', true)
    .text(xAxisLabel)
    .attr('text-anchor', 'middle')
    .attr(
      'x',
      (xScale.range()[0] + xScale.range()[1]) / 2
    )
    .attr(
      'y',
      yScale.range()[0] + xAxisLabelOffset
    );
}