export function getScale(question) {
  switch (question) {
    case 'C1':
    case 'C2':
    case 'C3':
    case 'C6':
    case 'D1':
    case 'D5':
    case 'D6':
    case 'D7':
    case 'D8':
    case 'A3':
    case 'A4':
      return {
        warning: false,
        name: 'frequency',
        scale: frequencyScale,
      };
    case 'A2':
      return {
        warning: true,
        name: 'ad',
        scale: adScale,
      };
    case 'D3':
      return {
        warning: true,
        name: 'type',
        scale: typeScale,
      };
    case 'D2':
      return {
        warning: true,
        name: 'time',
        scale: timeScale,
      };
    default:
      return {
        warning: false,
        name: 'agree',
        scale: agreeScale,
      };
  }
}

export const agreeScale = [
  'Strongly Disagree',
  'Disagree',
  'Slightly Disagree',
  'Slightly Agree',
  'Agree',
  'Strongly Agree',
];

export const frequencyScale = [
  'Never',
  'Very Rarely',
  'Rarely',
  'Occasionally',
  'Frequently',
  'Very Frequently',
];

export const adScale = [
  'No Ads',
  'Strongly Agree',
  'Agree',
  'Slightly Agree',
  'Slightly Disagree',
  'Disagree',
  'Strongly Disagree',
];
export const timeScale = [
  '<10 Min',
  '~30 Min',
  '~1 Hr',
  '>1 Hr',
];
export const typeScale = [
  'Video',
  'Image',
  'Text',
  'No Priority',
];
