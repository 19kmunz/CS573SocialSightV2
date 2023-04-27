import { select } from 'd3';
const imgMap = {
  "SUMMARY":'https://i.imgur.com/ccUH3l5.png',
  "MULTI":'https://i.imgur.com/wZ6liss.png',
  "DUAL":'https://i.imgur.com/wPA9GlP.png',
  "SINGLE":'https://i.imgur.com/YHh2sdf.png'
}
const descriptionMap = {
  "SUMMARY":[
    'Summary View', 
    '',
    'Survey how social media compare on our synthesized',
    'scales of Community, Self-Expression, Discovery, and Agency.',
    'i.e.',
    'View all 12 social media in a Parallel Coordinates Chart.',
  ],
  "MULTI":[
    'All Social Media View',
    '',
    'Survey the general positive and negative leanings of all platforms.',
  	'i.e.',
    'View all 12 social media on our 26 questions',
    'in a sorted Diverging Likert Scale Chart.'
  ],
  "DUAL":[
    'Dual Social Media View',
    '',
    'Investigate the differences between two social media in particular',
    'i.e.',
    'View 2 social media of your choice on our 26 questions',
    'in a Diverging Likert Scale Chart.'
  ],
  "SINGLE":[
    'Single Social Media View',
    '',
    'Investigate questions on a single social media',
    'i.e.',
    'View 1 social media of your choice on our 26 question in a Bar Chart'
  ]
}
export const selectPage = (
  container,
  {
    width,
    height,
    onClick,
    labels = ["SUMMARY", "MULTI", "DUAL", "SINGLE"]
  }
) => {
  const selection = container
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height)
  
  let titleBottom = 50;
  let subtitleBottom = titleBottom + 35;
  selection
  	.selectAll('.select-title')
  	.data([null])
  	.join('text')
  	.classed('select-title', true)
  	.text("SocialSight: MQP Data on Social Media")
  	.attr('x', width/2)
  	.attr('y', titleBottom)
  selection
  	.selectAll('.select-subtitle')
  	.data([null])
  	.join('text')
  	.classed('select-subtitle', true)
  	.text("by Kiara Munz")
  	.attr('x', width/2)
  	.attr('y', subtitleBottom)
  
  let boxSize = 200
  let inbetweenMargin = 30
  let topMargin = subtitleBottom + inbetweenMargin
  let frontMargin = (width - (boxSize*4 + inbetweenMargin*3))/2
  let xPlacement = (d, i) => {return frontMargin + i * (boxSize + inbetweenMargin)}
  let yPlacement = (d, i) => {return topMargin }
  let textMargin = 25;

  let rects = selection
  	.selectAll('.select-rect')
  	.data(labels)
  	.join('rect')
  	.classed('select-rect', true)
  	.attr('width', boxSize)
  	.attr('height', boxSize)
  	.attr('x', xPlacement)
  	.attr('y', yPlacement)
  	.style('outline', 'black solid')
  	.style('fill', 'white')
  	.style('cursor', 'pointer')
  
  selection
  	.selectAll('.select-image')
  	.data(labels)
  	.join('image')
  	.classed('select-image', true)
  	.attr('href', d => imgMap[d])
  	.attr('width', boxSize)
  	.attr('height', boxSize - textMargin)
  	.attr('x', xPlacement)
  	.attr('y', yPlacement)
    .attr('preserveAspectRatio', 'xMidYMid slice')
  
  selection
  	.selectAll('.select-text')
  	.data(labels)
  	.join('text')
  	.classed('select-text', true)
  	.text(d => d)
  	.attr('width', boxSize)
  	.attr('height', boxSize)
  	.attr('x', (d,i) => xPlacement(d,i)+(boxSize/2))
  	.attr('y', (d,i) => yPlacement(d,i)+boxSize-(textMargin/2))
  
  let textTop = topMargin + boxSize + inbetweenMargin
  let descripMargin = 22;
  selection
  	.selectAll('.select-description')
  	.data(labels)
  	.join('g')
  	.classed('select-description', true)
    .attr('transform', `translate(${width/2}, ${textTop})`)
  	.attr('data-mode', (d) => d)
  	.style('display', 'none')
  	.each(function (d,i) {
    	select(this)
    		.selectAll('.select-description-item')
    		.data(descriptionMap[d])
    		.join('text')
    		.classed('select-description-item', true)
    		.text(dd => {return dd;})
    		.attr('y', (d, i) => i*descripMargin)
  	})
  rects
  	.on('mouseover', function(e, d) {
    	selection
      	.select(`.select-description[data-mode="${d}"]`)
  			.style('display', 'inline')
  	})
  	.on('mouseout', function() {
    	selection
      	.selectAll(`.select-description`)
  			.style('display', 'none')
  	})
  	.on('click', onClick)
}