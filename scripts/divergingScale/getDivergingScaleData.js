import { getScale } from '../scaleDefs.js'

export function getDivergingScaleData(byQuestion, questionTag) {
  let {warning, scale} = getScale(questionTag)
  const pointsMap = d3.rollup(
    byQuestion[questionTag],
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
    warning: warning
  };
}