import { csvParse, select } from 'd3';

import { selectPage } from './scripts/select';

import { createRadarChart } from './scripts/radarChart/createRadarChart';
import { getRadarData } from './scripts/radarChart/getRadarData';

import { createDivergingScale } from './scripts/divergingScale/createDivergingScale';
import { getDivergingScaleData } from './scripts/divergingScale/getDivergingScaleData';

import { createDualDivergingScale } from './scripts/dualDivergingScale/createDualDivergingScale';
import { getDualDivergingScaleData } from './scripts/dualDivergingScale/getDualDivergingScaleData';
import { dualDivergingScale } from './scripts/dualDivergingScale/dualDivergingScale'

import { createBarChart } from './scripts/barChart/createBarChart';
import { getBarChartData } from './scripts/barChart/getBarChartData';

let DEFAULT_MODE = 'SELECT';
// WARNING IF THE SCALES ARE NOT SIZE 6 THERE IS ERROR
const DUAL_MODE = true;
const DEFAULT_QUESTION = 'C3';
const DEFAULT_DUAL_MEDIAS = ["Facebook", "Instagram"]
const DEFAULT_MEDIA = "Facebook"

export const viz = (
  container,
  { state, setState }
) => {
  // state.data could be:
  // * undefined
  // * 'LOADING'
  // * { totalData: byQuestion, 
  //  	 currentData: {...},
  //	 	 titles: [],
  // 		 mediaList: [],
	// 		 radarData: {...}
  //		 memory: { MULTI: undefined/{questionTag: questionTag},
  //				DUAL: undefined/{ medias: [first, second], questionTag: questionTag},
  //				SINGLE: undefined/{ media: media, questionTag: questionTag} }
	//	}
  // 
  // state.mode could be:
  // * undefined. SUMMARY, MULTI, DUAL, SINGLE, SELECT
  const { data, mode, memory } = state;
  
  if (mode === undefined) {
    setState((state) => ({
      ...state,
      mode: 'SELECT',
    }));
  }
  
  if (memory === undefined) {
    setState((state) => ({
      ...state,
      memory: {},
    }));
  }

  if (data === undefined) {
    setState((state) => ({
      ...state,
      data: 'LOADING',
    }));
    retrieveData(setState)
  }

  if (mode && mode === 'SELECT') {
    select(container).selectAll("*").remove()
    select(container).call(selectPage, { 
      width: window.innerWidth - 10, 
      height: window.innerHeight - 10,
    	onClick: function(e, d) {
        let currData
        switch (d) {
          case "SUMMARY":
            currData = data.radarData
            break;
          case "MULTI":
            if(memory.MULTI !== undefined) {
            	currData = getDivergingScaleData(data.totalData, memory.MULTI.questionTag)
            } else {
            	currData = getDivergingScaleData(data.totalData, DEFAULT_QUESTION)
            }
            break;
          case "DUAL":
            if(memory.DUAL !== undefined) {
            	currData = getDualDivergingScaleData(data.totalData, memory.DUAL.questionTag, memory.DUAL.medias)
            } else {
            	currData = getDualDivergingScaleData(data.totalData, DEFAULT_QUESTION, DEFAULT_DUAL_MEDIAS)
            }
            break;
          case "SINGLE":
            if(memory.SINGLE !== undefined) {
            	currData = getBarChartData(data.totalData, memory.SINGLE.questionTag, memory.SINGLE.media)
            } else {
            	currData = getBarChartData(data.totalData, DEFAULT_QUESTION, DEFAULT_MEDIA)
            }
            break;
        }
        select(container).selectAll("*").remove()
        setState((state) => ({
          ...state,
          mode: d,
          data: { ...data,
                 currentData: currData },
        }));
      }
  	})
  } else if (mode && data && data !== 'LOADING') {
    switch (mode) {
      case "SUMMARY":
        createRadarChart(container, data.radarData, setState)
        break;
      case "MULTI":
        createDivergingScale(container, data, setState)
        break;
      case "DUAL":
        createDualDivergingScale(container, data, setState)
        break;
      case "SINGLE":
        createBarChart(container, data, setState)
        break;
    }
  }
  
  
};

function retrieveData(setState) {
  fetch(
    'https://gist.githubusercontent.com/19kmunz/05e3b7fc059da24cb38c1a8bc66433c8/raw/784690b048b0fdbcd3d197e84295b41203994681/MongoDbDataWithReverseTag.csv'
  )
  .then((response) => response.text())
  .then((csvString) => {
    let totalData = parseData(csvString)
    let radarData = getRadarData(csvString)
    let titles = getQuestionTitles(totalData)
    let mediaList = getMediaList(totalData)
    //let currentData = getDualDivergingScaleData(totalData, DEFAULT_QUESTION, DEFAULT_DUAL_MEDIAS)
    let currentData = getBarChartData(totalData, DEFAULT_QUESTION, DEFAULT_MEDIA)
    //let currentData = getDivergingScaleData(totalData, DEFAULT_QUESTION)
    let data = { currentData, totalData, titles, mediaList, radarData }
    setState((state) => ({
      ...state,
      data,
    }));
  });
}

function parseData(csvString){
  let data = csvParse(csvString);

  let countData = data.map((d) => {
    return {
      _id: d._id,
      qTag: d.qTag,
      mediaText: d.mediaText,
      title: d.title,
      counts: JSON.parse(d.points).reduce(
        (counts, num) => {
          let scaleNum = JSON.parse(
            d.scale
          )[num - 1];
          counts[scaleNum] =
            (counts[scaleNum] || 0) +1;
          return counts; 
        },
        {}
      ),
    };
  });
  //const byMedia = d3.group(countData, d => d.mediaText)
  const byQuestion = Object.fromEntries(
    d3.group(countData, (d) => d.qTag)
  );
  return byQuestion
}

function getQuestionTitles(byQuestion) {
  let options = {}
  Object.keys(byQuestion).forEach( (key) => {
    options[key] = ({ questionTag: key, title: byQuestion[key][0].title })
  });
  return options
}

function getMediaList(byQuestion) {
  let firstKey = Object.keys(byQuestion)[0]
  return byQuestion[firstKey].map((obj) => { return obj.mediaText })
}



