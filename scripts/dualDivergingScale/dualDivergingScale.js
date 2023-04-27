import {
  select,
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  schemePuOr as colorScheme,
} from 'd3';
import { createTitle } from '../selectableTitle';

const color = colorScheme[6].reverse();

export const dualDivergingScale = (
  container,
  {
    data,
    questionTag,
    scale,
    titles,
    currentMedia,
    mediaList,
    width,
    height,
    margin,
    xAxisLabel,
    yAxisLabel,
    titleHeight,
    yAxisWidth,
    onYAxisChange,
    warning,
  }
) => {
  const selection = container
    .selectAll('svg')
    .data([null])
    .join('svg')
    .classed('graph', true)
    .attr('width', width)
    .attr('height', height)
    .style('top', titleHeight + 'px')
    .style('left', yAxisWidth + 'px');

  // Calculate
  let linkedData = [];
  data.forEach(function (value, key) {
    const total = d3.sum(value);
    linkedData.push({
      media: key,
      points: calculateBoxes(value, total),
    });
  });
  let sortedLinkedData = linkedData.sort(
    (a, b) => {
      return (
        currentMedia.indexOf(a.media) -
        currentMedia.indexOf(b.media)
      );
    }
  );
  let sortedBoxData = sortedLinkedData.map(
    (d) => d.points
  );
  let sortedMediaData = sortedLinkedData.map(
    (d) => d.media
  );
  const dataLength = sortedLinkedData.length;

  // Render
  const maxPositivePercentage = 100;
  const maxNegativePercentage = 100;
  const xScale = scaleLinear()
    .rangeRound([
      margin.left,
      width - margin.right,
    ])
    .domain([
      -1 * maxNegativePercentage,
      maxPositivePercentage,
    ])
    .nice();
  const yScale = scaleBand()
    .range([height - margin.bottom, margin.top])
    .domain(Array.from(Array(dataLength).keys()))
    .paddingInner(0.2)
    .paddingOuter(0.15);
  
  selection.call(createLegend, {
    width,
    margin,
    scale,
    xAxisLabel,
    yAxisLabel,
  });

  if (!warning) {
    selection.call(createBars, {
      data: sortedBoxData,
      xScale,
      yScale,
    });
    
    selection.selectAll('.warningText').remove();
  } else {
    selection
      .selectAll('.warningText')
      .data([
        'This question has a different scale than other questions,',
        'so it requires a different type of summary viz!',
      	'Hopefully, coming soon!',
        'Go to Single View if you are curious.',
      ])
      .join('text')
      .classed('warningText', true)
      .text((d) => d)
      .attr(
        'x',
        margin.left +
          (width - margin.left - margin.right) / 2
      )
      .attr(
        'y',
        (d, i) =>
          margin.top +
          (height - margin.top - margin.bottom) /
            2 -
          45 +
          i * 30
      )
      .style('text-anchor', 'middle');
    
    selection.selectAll('.bars').remove();
  }

  container.call(createAxes, {
    selection,
    data: sortedMediaData,
    mediaList,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel,
    yAxisWidth,
    titleHeight,
    onYAxisChange,
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
    .classed('bars', true);
  topGroup
    .selectAll('.bar')
    .data(data)
    .join('g')
    .classed('bar', true)
    .attr('transform', (d, i) => {
      return `translate(0,${yScale(i)})`;
    })
    .each(function (boxes, i) {
      // Place
      select(this)
        .selectAll('rect')
        .data(boxes)
        .join('rect')
        .classed('subbar', true)
        .attr('x', (d) => xScale(d.start))
        .attr(
          'width',
          (d) => xScale(d.end) - xScale(d.start)
        )
        .attr('height', yScale.bandwidth)
        .attr('fill', (d, i) => color[i]);
    });
}

function createAxes(
  container,
  {
    selection,
    data, // the current media
    mediaList, // all the media
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel,
    xAxisLabelOffset = 45,
    yAxisLabelOffset = 5,
    yAxisWidth,
    titleHeight,
    onYAxisChange,
  }
) {
  yScale = yScale.domain(data);
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
  selection
    .selectAll('.yAxis')
    .selectAll('text')
    .remove();

  let topSelect = container
    .selectAll('.yAxisLabel')
    .data(data)
    .join('select')
    .classed('yAxisLabel', true)
    .style('width', yAxisWidth - 10 + 'px')
    .style('top', (d, i) => {
      return (
        titleHeight +
        yScale(d) +
        yScale.bandwidth() / 2 -
        10 +
        'px'
      );
    })
    .style('left', yAxisLabelOffset + 'px')
    .style('postion', 'absolute')
    .attr('data-index', (d, i) => i)
    .on('change', (event) => {
      onYAxisChange(
        event.target.value,
        event.target.getAttribute('data-index')
      );
    });
  topSelect.each(function (media, i) {
    let newMediaList = mediaList.filter((m) => {
      return media === m || !data.includes(m);
    });
    select(this)
      .selectAll('.selectOptions')
      .data(newMediaList)
      .join('option')
      .classed('selectOptions', true)
      .attr('value', (d) => d)
      .text((d) => d);
  });
  topSelect.each(function (media, i) {
    select(this)
      .select("option[value='" + media + "']")
      .property('selected', true);
  });

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

function createLegend(
  selection,
  {
    width,
    margin,
    scale,
    legendOffset = 35,
    titleOffset = 15,
  }
) {
  // Legend
  let topGroup = selection
    .selectAll('.legend')
    .data([null])
    .join('g')
    .classed('legend', true)
    .attr(
      'transform',
      `translate(${0}, ${
        margin.top - legendOffset
      })`
    );
  let binded = topGroup
    .selectAll('.legend-item')
    .data(scale, (d, i) => d);
  binded.exit().remove();
  binded
    .enter()
    .append('g')
    .classed('legend-item', true)
    .attr('data-label', (d) => d)
    .attr('transform', function (d, i) {
      let cumLength = scale
        .slice(0, i)
        .reduce((acc, el) => acc + el.length, 0);
      return `translate(${
        40 * i + 8 * cumLength
      }, 0)`;
    })
    .call((g) =>
      g
        .append('text')
        .text((d) => d)
        .attr('y', 12)
        .attr('x', 25)
        .style('font-size', '0.6em')
    )
    .call((g) =>
      g
        .append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .style('fill', (d, i) => color[i])
    );
  let legendWidth = topGroup
    .node()
    .getBoundingClientRect().width;
  topGroup.attr(
    'transform',
    `translate(${(width - legendWidth) / 2}, ${
      margin.top - legendOffset
    })`
  );
}

function calculateBoxes(arr, total) {
  let percents = {};
  arr.forEach((d, j) => {
    percents[j] = (d * 100) / total;
  });

  let boxes = [];
  // start will be disagrees: 0, 1, 2
  var start =
    -1 *
    (percents[0] + percents[1] + percents[2]);
  [0, 1, 2, 3, 4, 5].forEach(function (val) {
    boxes[val] = {
      idx: val,
      start: start,
      end: (start += percents[val]),
      n: percents[val],
    };
  });
  return boxes;
}
