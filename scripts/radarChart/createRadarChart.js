import { radarChart } from './radarChart';
import { select } from 'd3';
import { backButton } from '../backButton'

let height = window.innerHeight-10;
let realWidth = window.innerWidth -10;
let width = 4*height/3

export const createRadarChart = (container, data, setState) => {
  const svg = select(container)
    .selectAll('svg')
  	.data([null])
  	.join('svg')
    .attr('width', realWidth)
    .attr('height', height)
  const groups = svg
  	.selectAll('g')
  	.data([null])
  	.join('g')
  	.attr('transform', `translate(${(realWidth - width)/2}, ${0})`)
  	.classed('radar-svg', true);
  radarChart(
    groups,
    { data,
    width,
    height }
  );
  
 	svg
    .call(backButton, {
    	height,
      setState
  	})
  svg
  	.selectAll('.disclaimer')
  	.data(['DISCLAIMER:', 
           'These scales',
           'were NOT', 
           'put through',
           'Factor Analysis.', 
           'I cannot ensure', 
           'Scientific',
           'Validity.', 
           'This viz is for', 
           'inspiration',
           'purposes only.'])
  	.join('text')
  	.classed('disclaimer', true)
  	.attr('x', realWidth-15)
  	.attr('y', (d,i) => 280+(i*20))
  	.text(d => d)
  	
}