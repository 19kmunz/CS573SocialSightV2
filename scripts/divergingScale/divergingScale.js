import {
  select,
  scaleLinear,
  scaleBand,
  axisLeft,
  axisBottom,
  schemePuOr as colorScheme,
} from 'd3';

const color = colorScheme[6];

export const divergingScale = (
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
    warning,
  }
) => {
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
        2 *
          (a.points[3].n +
            a.points[4].n +
            a.points[5].n >
            b.points[3].n +
              b.points[4].n +
              b.points[5].n) -
        1
      ); // true - 1, false - 0. 2*true - 1 = 1, 2*false - 1 = -1
    }
  );
  let sortedBoxData = sortedLinkedData.map(
    (d) => d.points
  );
  let sortedMediaData = sortedLinkedData.map(
    (d) => d.media
  );
  const dataLength = sortedLinkedData.length;

  const maxPositivePercentage =
    sortedBoxData[dataLength - 1][3].n +
    sortedBoxData[dataLength - 1][4].n +
    sortedBoxData[dataLength - 1][5].n;
  const maxNegativePercentage =
    sortedBoxData[0][0].n +
    sortedBoxData[0][1].n +
    sortedBoxData[0][2].n;
  
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
    .paddingInner(0.33);

  // Render
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
    selection.call(createAxes, {
      data: sortedMediaData,
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
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
  selection,
  {
    data,
    xScale,
    yScale,
    xAxisLabel,
    yAxisLabel,
    xAxisLabelOffset = 45,
    yAxisLabelOffset = 65,
  }
) {
  yScale = yScale.domain(data);
  const yAxis = axisLeft(yScale);
  selection
    .selectAll('.y-Axis')
    .data([null])
    .join('g')
    .classed('y-Axis', true)
    .attr(
      'transform',
      'translate(' + xScale.range()[0] + ',0)'
    )
    .call(yAxis);

  const xAxis = axisBottom(xScale);
  selection
    .selectAll('.x-Axis')
    .data([null])
    .join('g')
    .classed('x-Axis', true)
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
