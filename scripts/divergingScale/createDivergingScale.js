import { getDivergingScaleData } from './getDivergingScaleData';
import { select } from 'd3';
import { createTitle } from '../selectableTitle';
import { divergingScale } from './divergingScale';
import { backButton } from '../backButton'

const height = window.innerHeight - 10 - 65;
const width = window.innerWidth - 10;
const margin = {
    top: 40,
    bottom: 50,
    left: 95,
    right: 30,
  }

export function createDivergingScale(container, data, setState) {
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
      let currentData = getDivergingScaleData(data.totalData, qTag)
      setState((state) => ({
        ...state,
        data: { ...data,
               currentData: currentData },
      }));
  }})
  svg.call(divergingScale, {
    data: data.currentData.pointsMap,
    width,
    height,
    margin,
    questionTag: data.currentData.questionTag,
    titles: data.titles,
    xAxisLabel: 'Percentage of Responses (%)',
    yAxisLabel: 'Social Media Names',
    scale: data.currentData.scale,
    warning: data.currentData.warning
  })
  .raise();
  
  svg
    .call(backButton, {
    	height,
      setState
  	})
}