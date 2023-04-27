import { getDualDivergingScaleData } from './getDualDivergingScaleData';
import { select } from 'd3';
import { createTitle } from '../selectableTitle';
import { dualDivergingScale } from './dualDivergingScale';
import { backButton } from '../backButton'

const margin = {
    top: 40,
    bottom: 50,
    left: 110,
    right: 30,
  }
const titleHeight = 50;
const yAxisWidth = 0;
const height = window.innerHeight - 10 - titleHeight;
const width = window.innerWidth - 10 - yAxisWidth;
export function createDualDivergingScale(container, data, setState) {
	select(container).call(dualDivergingScale, {
    data: data.currentData.pointsMap,
    questionTag: data.currentData.questionTag,
    scale: data.currentData.scale,
    titles: data.titles,
    mediaList: data.mediaList,
    currentMedia: data.currentData.media,
    width,
    height,
    margin,
    xAxisLabel: 'Percentage of Responses (%)',
    yAxisLabel: 'Social Media Names',
    titleHeight,
    yAxisWidth,
    warning: data.currentData.warning,
    onYAxisChange: (media, index) => {
      let newMedia = [...data.currentData.media]
      newMedia[index] = media
      console.log(data.currentData.media, newMedia)
      let currentData = getDualDivergingScaleData(data.totalData, data.currentData.questionTag, newMedia)
      setState((state) => ({
        ...state,
        data: { ...data,
               currentData: currentData },
      }));
    }
  })
  
  select(container).call(createTitle, { 
    questionTag: data.currentData.questionTag, 
    titles: data.titles, 
    width: width + yAxisWidth, 
    margin,
    onChange: (qTag) => {
      let currentData = getDualDivergingScaleData(data.totalData, qTag, data.currentData.media)
      setState((state) => ({
        ...state,
        data: { ...data,
               currentData: currentData },
      }));
    }
  })
  
  select(container)
  	.selectAll('svg')
    .call(backButton, {
    	height,
      setState
  	})
}