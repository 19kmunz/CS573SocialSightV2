import { select } from 'd3';
import { createTitle } from '../selectableTitle';
import { barChart } from './barChart';
import { backButton } from '../backButton';
import { getBarChartData } from './getBarChartData';

const titleTranslate = 65;
const height = window.innerHeight - 10 - titleTranslate;
const width = window.innerWidth - 10;
const margin = {
  top: 15,
  bottom: 50,
  left: 80,
  right: 30,
};

export const createBarChart = (
  container,
  data,
  setState
) => {
  const svg = select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height);

  select(container).call(createTitle, {
    questionTag: data.currentData.questionTag,
    titles: data.titles,
    width,
    margin,
    onChange: (qTag) => {
      let currentData = getBarChartData(
        data.totalData,
        qTag,
        data.currentData.media
      );
      setState((state) => ({
        ...state,
        data: {
          ...data,
          currentData: currentData,
        },
      }));
    },
  });
  svg
    .call(barChart, {
      data: data.currentData.data,
      questionTag:
        data.currentData.data.questionTag,
      scale: data.currentData.scale,
      titles: data.titles,
      max: data.currentData.max,
      width,
      height,
      margin,
      xAxisLabel: 'Likert Scale',
      yAxisLabel: '# of Responses',
    })
    .raise();

  svg.call(backButton, {
    height,
    setState,
  });
  select(container).call(createMediaSelect, {
    media: data.currentData.data.mediaText,
    mediaList: data.mediaList,
    width,
    onMediaChange: (media) => {
      let currentData = getBarChartData(
        data.totalData,
        data.currentData.questionTag,
        media
      );
      setState((state) => ({
        ...state,
        data: {
          ...data,
          currentData: currentData,
        },
      }));
    },
  });
};

const createMediaSelect = (
  container,
  {
    media,
    mediaList,
    onMediaChange,
    width,
    selectTop = 55,
    selectWidth = 150,
    selectHeight = 30,
    selectMargin = 5,
  }
) => {
  let topSelect = container
    .selectAll('.mediaSelect')
    .data([null])
    .join('select')
    .classed('mediaSelect', true)
    .style('width', selectWidth + 'px')
    .style('height', selectHeight + 'px')
    .style('position', 'absolute')
    .style(
      'top',
     	selectTop + 'px'
    )
    .style(
      'left',
      width - selectMargin - selectWidth + 'px'
    )
    .on('change', (event) => {
      onMediaChange(event.target.value);
    });
  topSelect
    .selectAll('.selectOptions')
    .data(mediaList)
    .join('option')
    .classed('selectOptions', true)
    .attr('value', (d) => d)
    .text((d) => d);
  topSelect
    .select("option[value='" + media + "']")
    .property('selected', true);
};
