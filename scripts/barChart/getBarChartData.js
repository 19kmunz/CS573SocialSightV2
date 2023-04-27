import { getScale } from '../scaleDefs.js'

export function getBarChartData(byQuestion, questionTag, media) {
  let theseQuestions = { ...byQuestion }
  for (let question in theseQuestions){
    theseQuestions[question] = theseQuestions[question].filter((d) => {
      return d.mediaText === media
    })[0]
  }
  let { scale } = getScale(questionTag)
  const data = theseQuestions[questionTag]
  // Get max for yScale
  let max = 0;
  Object.keys(theseQuestions).forEach((key) => {
    let countValues = Object.values(theseQuestions[key].counts)
    let questionMax = Math.max(...countValues)
    max = (questionMax > max && key !== 'D3' && key !== 'D2') ? questionMax : max
  });
  return {
    scale: scale,
    data: data,
    media: media,
    questionTag: questionTag,
    max: max
  };
}
