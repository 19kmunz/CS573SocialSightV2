import { csvParse } from 'd3';
export const getRadarData = (csvString) => {
  let data = csvParse(csvString);
  let groupedByMedia = d3.group(data, d => d.mediaText);
  let mediaObject = [];
  groupedByMedia.forEach( (media) => {
      let groupedByHuman = d3.group(media, q => q.human)
      let humanMappedToMeans = {};
      groupedByHuman.forEach(questionsForHuman => {
          let points = extractPointsFromQuestions(questionsForHuman);
          humanMappedToMeans[questionsForHuman[0].human]=6-d3.mean(points)
      })
      humanMappedToMeans["media"]=media[0].mediaText
    mediaObject.push(humanMappedToMeans)
  })
  return mediaObject
}

function extractPointsFromQuestions(questions) {
    let points = [];
    questions.forEach((question) => {
        switch (question.reverseTag) {
            case "reverse":
                // Ex. 6 needs to be 1. p-1=5, mapping[5] = 1
                const mapping = [6, 5, 4, 3, 2, 1];
                const reversed = JSON.parse(question.points).map(p => mapping[p - 1] || p)
                points.push(reversed)
                break;
            case "ad":
                // 1 - No ad, 2-7 STR A - STR D. Need 1-6 STR A - STR D
                points.push(JSON.parse(question.points).filter(p => p > 1).map(p => p - 1))
                break;
            case "info":
                //console.log(question.points)
                break;
            default:
                points.push(JSON.parse(question.points))
        }
    })
    return d3.merge(points)
}