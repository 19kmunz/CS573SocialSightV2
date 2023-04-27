import { getScale, agreeScale, frequencyScale } from '../scaleDefs.js'
const DUAL_MODE = true;

export function getDualDivergingScaleData(byQuestion, questionTag, dualModeMedia) {
  let theseQuestions = { ...byQuestion };
  if(DUAL_MODE) {
    for (let question in theseQuestions){
    	theseQuestions[question] = theseQuestions[question].filter((d) => {
        return dualModeMedia.includes(d.mediaText)
      })
    }
  }
  let { warning, scale } = getScale(questionTag)
  const pointsMap = d3.rollup(
    theseQuestions[questionTag],
    (v) => {
      let q = v[0];
      let keys = Object.keys(q.counts);
      let points = [];
      points = scale.map((tag) =>
        q.counts[tag] === undefined
          ? 0
          : q.counts[tag]
      );
      return points;
    },
    (d) => d.mediaText
  );
  return {
    questionTag: questionTag,
    scale: scale,
    pointsMap: pointsMap,
    media: dualModeMedia,
    warning: warning
  };
}