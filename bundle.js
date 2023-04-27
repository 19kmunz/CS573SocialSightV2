(function (d3$1) {
  'use strict';

  const imgMap = {
    "SUMMARY":'https://i.imgur.com/ccUH3l5.png',
    "MULTI":'https://i.imgur.com/wZ6liss.png',
    "DUAL":'https://i.imgur.com/wPA9GlP.png',
    "SINGLE":'https://i.imgur.com/YHh2sdf.png'
  };
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
  };
  const selectPage = (
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
      .attr('height', height);
    
    let titleBottom = 50;
    let subtitleBottom = titleBottom + 35;
    selection
    	.selectAll('.select-title')
    	.data([null])
    	.join('text')
    	.classed('select-title', true)
    	.text("SocialSight: MQP Data on Social Media")
    	.attr('x', width/2)
    	.attr('y', titleBottom);
    selection
    	.selectAll('.select-subtitle')
    	.data([null])
    	.join('text')
    	.classed('select-subtitle', true)
    	.text("by Kiara Munz")
    	.attr('x', width/2)
    	.attr('y', subtitleBottom);
    
    let boxSize = 200;
    let inbetweenMargin = 30;
    let topMargin = subtitleBottom + inbetweenMargin;
    let frontMargin = (width - (boxSize*4 + inbetweenMargin*3))/2;
    let xPlacement = (d, i) => {return frontMargin + i * (boxSize + inbetweenMargin)};
    let yPlacement = (d, i) => {return topMargin };
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
    	.style('cursor', 'pointer');
    
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
      .attr('preserveAspectRatio', 'xMidYMid slice');
    
    selection
    	.selectAll('.select-text')
    	.data(labels)
    	.join('text')
    	.classed('select-text', true)
    	.text(d => d)
    	.attr('width', boxSize)
    	.attr('height', boxSize)
    	.attr('x', (d,i) => xPlacement(d,i)+(boxSize/2))
    	.attr('y', (d,i) => yPlacement()+boxSize-(textMargin/2));
    
    let textTop = topMargin + boxSize + inbetweenMargin;
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
      	d3$1.select(this)
      		.selectAll('.select-description-item')
      		.data(descriptionMap[d])
      		.join('text')
      		.classed('select-description-item', true)
      		.text(dd => {return dd;})
      		.attr('y', (d, i) => i*descripMargin);
    	});
    rects
    	.on('mouseover', function(e, d) {
      	selection
        	.select(`.select-description[data-mode="${d}"]`)
    			.style('display', 'inline');
    	})
    	.on('mouseout', function() {
      	selection
        	.selectAll(`.select-description`)
    			.style('display', 'none');
    	})
    	.on('click', onClick);
  };

  function createRadarChartAxesAndLabels (
    selection,
    {
      labels = { "C": "Community",
                "S": "Self-expression",
                "D": "Discovery",
                "A": "Agency" },
    	attributes,
    	xScale,
    	yScale,
      axisLabelOffset = yScale.range()[0] + 25,
    }
  ) {

    let axes = selection
      .selectAll(".radar-axes")
      .data([null])
    	.join('g')
    	.classed("radar-axes", true);
    let labelObjects = selection
      .selectAll(".radar-labels")
      .data([null])
    	.join('g')
    	.classed("radar-labels", true);
    axes
    	.selectAll('.radar-axis')
    	.data(attributes)
    	.join('g')
    	.classed('radar-axis', true)
    	.attr( 
        'transform',
        (d) => 'translate(' + (xScale(d)) + ',0)'
      )
    	.each(function(d, i) {
      	d3$1.select(this)
      		.call(d3$1.axisLeft(yScale).ticks(3));
    	});
    labelObjects
    	.selectAll('.radar-label')
    	.data(attributes)
    	.join('text')
    	.classed('radar-label', true)
    	.text(d => labels[d])
    	.attr('transform', d => `translate(${xScale(d)},${axisLabelOffset})`);
  }

  const mediaColors = {
    "Twitch": "#653da7",
    "Instagram": "#C13584",
    "YouTube": "#cd201f",
    "Reddit": "#ff4500",
    "Snapchat": "#E1D71A",
    "4Chan": "#42922c",
    "TikTok": "#00D1CA",
    "Twitter": "#3ab0ff",
    "Facebook": "#1977f3",
    "LinkedIn": "#0274b3",
    "Tumblr": "#00405d",
    "BeReal": "#000000"
  };

  const createHovers = (selection, { groups }) => {
  	let legendItems = selection.selectAll(".legend-item");
    groups
    	.on('mouseover', function(e, d) {
        // remove the hover class from all elements
        removeAllHovers(groups, legendItems);

        // add the hover class to the current element
      	// radar shapes
        let chart = d3.select(this).classed("hover", true).raise();
      	let siblings = selection
        	.selectAll('.radar-shape:not(.hover)')
        	.classed('not-hover', true);
        
        // legend items
        let mediaName = d.media;
        let item = legendItems.filter(function(d) { 
          	d3.select(this).classed("not-hover",true);
            return d3.select(this).attr('data-media') === mediaName
        })
        .classed("hover", true)
        .classed("not-hover", false);
      })
      .on('mouseout', function() {
      	removeAllHovers(groups, legendItems);
      	let chart = d3.select(this).lower();
    	});
    
    legendItems
      .on('mouseover', function(e, d) {
        // remove the hover class from all elements
        removeAllHovers(groups, legendItems);
  			
        if(!d3.select(this).classed("unchecked")){
          // add the hover class to the current element
      		// legend items
          let item = d3.select(this).classed("hover", true);
          let siblings = selection
            .selectAll('.legend-item:not(.hover)')
            .classed('not-hover', true);

          // radar shapes
          let mediaName = d.media;
          let chart = groups
            .classed("not-hover",true)
            .filter(function(d) { 
              return d3.select(this).attr('data-media') === mediaName
            })
            .classed("hover", true)
            .classed("not-hover", false)
            .raise();
        }
      })
      .on('mouseout', function(e, d) {
      	removeAllHovers(groups, legendItems);
      	if(!d3.select(this).classed("unchecked")){
          let mediaName = d.media;
          let chart = groups.filter(function(d) { 
              return d3.select(this).attr('data-media') === mediaName
          })
          .lower();
        }
    	});
  };

  const removeAllHovers = function(groups, legendItems) {
    // remove the hover class from all elements
    groups.classed("hover", false);
    legendItems.classed("hover", false);
    groups.classed("not-hover", false);
    legendItems.classed("not-hover", false);
  };

  function createLegend(
    selection,
    {
      width,
      height,
      margin,
      data,
      color,
      legendXOffset = width - 130,
      legendYOffset = 60,
      boxSize = 15,
    	boxSpacing = 25,
    	legendTitle = 'Toggle Here ☑️'
    }
  ) {
    // Legend
    let topGroup = selection
      .selectAll('.legend')
      .data([null])
      .join('g')
      .classed('legend', true)
      .attr(
        'transform',
        `translate(${legendXOffset}, ${
        margin.top+legendYOffset
      })`
      );
    topGroup
    	.selectAll('.legend-title')
    	.data([null])
      .join('text')
      .classed('legend-title', true)
    	.text(legendTitle)
    	.attr(
        'transform',
        `translate(0, ${
        -boxSpacing + boxSize
      })`
      );
    topGroup
      .selectAll('.legend-item')
      .data(data)
      .join('g')
      .classed('legend-item', true)
    	.attr("data-media", (d) => d.media)
      .attr(
        'transform',
        (d, i) => {
          let jump = 0;
          //if (i > 5) { jump = 230 }
          return `translate(0, ${boxSpacing*i + jump})`
        }
      )
      .call((g) =>
        g
          .append('text')
          .text((d) => d.media)
          .attr('y', 12)
          .attr('x', 25)
      )
      .call((g) =>
        g
          .append('rect')
          .attr('width', boxSize)
          .attr('height', boxSize)
          .style('fill', (d, i) => color[d.media])
          .attr('stroke', (d) => color[d.media])
      )
    	.on("click", function(e, d) {
      	// create check uncheck functionality
      	let item = d3.select(this);
        // legend item
        let isUnchecked = !item.classed("unchecked");
      	item.classed("unchecked", isUnchecked);
      
      	// radar shapes
      	let mediaValue = d.media;
      	let radarShapes = selection
        	.selectAll(".radar-shape");
        radarShapes.filter(function(d) { 
            return d3.select(this).attr('data-media') === mediaValue
          })
        	.classed("unchecked", isUnchecked);
      
      	// deal with hovers
      	if(isUnchecked){
      		removeAllHovers(radarShapes, selection.selectAll(".legend-item"));
        } else {
          item.node().dispatchEvent(new MouseEvent('mouseover'));
        }
    	});
  }

  const radarChart = (
    selection,
    {
      data,
      width,
      height,
      margin = {
        top: 50,
        bottom: 40,
        left: 30,
        right: 130,
      },
    	attributes = ["D", "A", "C", "S"],
    	titleOffset = 10,
    	title = 'MQP Data: Social Media on Human Scales'
    }
  ) => {
    /*
       C S D A
    */
    let xScale = d3$1.scalePoint().domain(attributes).range([margin.left, width - margin.right]).padding(0.3);
    let yScale = d3$1.scaleLinear().domain([0,6]).range([height - margin.bottom, margin.top]);
    console.log(data);
    data.sort((a,b) => Object.keys(mediaColors).indexOf(a.media) - Object.keys(mediaColors).indexOf(b.media)); 
    
    selection.call(createRadarChartAxesAndLabels, {
      xScale,
      yScale,
      attributes
    });
    let shapes = selection
      .selectAll(".shapes")
      .data([null])
    	.join('g')
    	.classed("shapes", true);
    
    let groups = shapes
    	.selectAll(".radar-shape")
    	.data(data)
    	.join("path")
    	.classed("radar-shape", true)
      .attr("d", (d) => getPathString(d, {attributes, xScale, yScale}))
      .attr("stroke", (d, i) => mediaColors[d.media])
    	.attr("data-media", (d) => d.media);
    
    selection.call(createLegend, {
      width,
      height,
      margin,
      data,
      color: mediaColors
    });
    
  	selection.call(createHovers, { groups });
    
    selection
    	.selectAll('.radar-title')
    	.data([null])
    	.join('text')
    	.classed('radar-title', true)
    	.text(title)
    	.attr('transform', `translate(${width/2},${titleOffset})`);
  };

  const getPathString = (media, { attributes, xScale, yScale }) => {
    let coords = [];
    attributes.forEach((d) => {
      coords.push([xScale(d), yScale(media[d])]);
    });
    return d3$1.line()(coords)
  };

  const chevronPath =
    'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z';
  const backButton = (
    selection,
    { height, setState }
  ) => {
    let group = selection
      .selectAll('.back')
      .data([null])
      .join('g')
      .classed('back', true)
      .attr(
        'transform',
        `translate(${10}, ${height - 20})`
      )
      .on('click', function (e, d) {
        setState((state) => {
          if (state.mode !== 'SUMMARY') {
          	let memory = state.memory;
            memory[state.mode] = {
              questionTag:
                state.data.currentData.questionTag
            };
            if (state.mode === 'DUAL') {
              memory[state.mode].medias =
                state.data.currentData.media;
            } else if (state.mode === 'SINGLE') {
              memory[state.mode].media =
                state.data.currentData.media;
            }
            return {
              ...state,
              memory: memory,
              mode: 'SELECT',
            };
          } else {
            return {
              ...state,
              mode: 'SELECT',
            };
          }
        });
      });

    group
      .selectAll('.back-rect')
      .data([null])
      .join('rect')
      .classed('back-rect', true)
      .attr('width', 120)
      .attr('height', 17)
      .attr('rx', 5)
      .style('fill', 'white')
      .style('stroke', 'black')
      .style('stroke-width', 1);

    group
      .selectAll('.back-chevron')
      .data([null])
      .join('path')
      .classed('back-chevron', true)
      .attr('d', chevronPath)
      .attr('fill-rule', 'evenodd');

    group
      .selectAll('.back-text')
      .data([null])
      .join('text')
      .classed('back-text', true)
      .text('Return Home')
      .attr('x', 20)
      .attr('y', 2);
  };

  let height = window.innerHeight-10;
  let realWidth = window.innerWidth -10;
  let width = 4*height/3;

  const createRadarChart = (container, data, setState) => {
    const svg = d3$1.select(container)
      .selectAll('svg')
    	.data([null])
    	.join('svg')
      .attr('width', realWidth)
      .attr('height', height);
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
    	});
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
    	.text(d => d);
    	
  };

  const getRadarData = (csvString) => {
    let data = d3$1.csvParse(csvString);
    let groupedByMedia = d3.group(data, d => d.mediaText);
    let mediaObject = [];
    groupedByMedia.forEach( (media) => {
        let groupedByHuman = d3.group(media, q => q.human);
        let humanMappedToMeans = {};
        groupedByHuman.forEach(questionsForHuman => {
            let points = extractPointsFromQuestions(questionsForHuman);
            humanMappedToMeans[questionsForHuman[0].human]=6-d3.mean(points);
        });
        humanMappedToMeans["media"]=media[0].mediaText;
      mediaObject.push(humanMappedToMeans);
    });
    return mediaObject
  };

  function extractPointsFromQuestions(questions) {
      let points = [];
      questions.forEach((question) => {
          switch (question.reverseTag) {
              case "reverse":
                  // Ex. 6 needs to be 1. p-1=5, mapping[5] = 1
                  const mapping = [6, 5, 4, 3, 2, 1];
                  const reversed = JSON.parse(question.points).map(p => mapping[p - 1] || p);
                  points.push(reversed);
                  break;
              case "ad":
                  // 1 - No ad, 2-7 STR A - STR D. Need 1-6 STR A - STR D
                  points.push(JSON.parse(question.points).filter(p => p > 1).map(p => p - 1));
                  break;
              case "info":
                  //console.log(question.points)
                  break;
              default:
                  points.push(JSON.parse(question.points));
          }
      });
      return d3.merge(points)
  }

  function getScale(question) {
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

  const agreeScale = [
    'Strongly Disagree',
    'Disagree',
    'Slightly Disagree',
    'Slightly Agree',
    'Agree',
    'Strongly Agree',
  ];

  const frequencyScale = [
    'Never',
    'Very Rarely',
    'Rarely',
    'Occasionally',
    'Frequently',
    'Very Frequently',
  ];

  const adScale = [
    'No Ads',
    'Strongly Agree',
    'Agree',
    'Slightly Agree',
    'Slightly Disagree',
    'Disagree',
    'Strongly Disagree',
  ];
  const timeScale = [
    '<10 Min',
    '~30 Min',
    '~1 Hr',
    '>1 Hr',
  ];
  const typeScale = [
    'Video',
    'Image',
    'Text',
    'No Priority',
  ];

  function getDivergingScaleData(byQuestion, questionTag) {
    let {warning, scale} = getScale(questionTag);
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

  let tomSelected;
  function createTitle(selection, { questionTag, titles, width, margin, onChange, titleOffset = 50 }) {
    let select = selection
      .selectAll('.title');
    if(select.size() === 0){
      let options = Object.values(titles).map( (title) => {
        return { value: title.questionTag, text: title.title }
      });
      select
        .data([null])
        .join('select')
        .classed('title', true)
        .style("width", width - 15 + 'px')
        .on('change', (event) => {
          onChange(event.target.value);
        });

      tomSelected = new TomSelect(".title",{
        options: options,
        items: [questionTag]
      });
    } else {
      select
      	.on('change', (event) => {
          onChange(event.target.value);
        });
    }
  }

  const color = d3$1.schemePuOr[6];

  const divergingScale = (
    selection,
    {
      data,
      width,
      height,
      margin,
      questionTag,
      titles,
      xAxisLabel,
      yAxisLabel,
      scale,
      warning,
    }
  ) => {
    // Calculate
    let linkedData = [];
    data.forEach(function (value, key) {
      const total = d3.sum(value);
      linkedData.push({
        media: key,
        points: calculateBoxes(value, total),
      });
    });
    let sortedLinkedData = linkedData.sort(
      (a, b) => {
        return (
          2 *
            (a.points[3].n +
              a.points[4].n +
              a.points[5].n >
              b.points[3].n +
                b.points[4].n +
                b.points[5].n) -
          1
        ); // true - 1, false - 0. 2*true - 1 = 1, 2*false - 1 = -1
      }
    );
    let sortedBoxData = sortedLinkedData.map(
      (d) => d.points
    );
    let sortedMediaData = sortedLinkedData.map(
      (d) => d.media
    );
    const dataLength = sortedLinkedData.length;

    const maxPositivePercentage =
      sortedBoxData[dataLength - 1][3].n +
      sortedBoxData[dataLength - 1][4].n +
      sortedBoxData[dataLength - 1][5].n;
    const maxNegativePercentage =
      sortedBoxData[0][0].n +
      sortedBoxData[0][1].n +
      sortedBoxData[0][2].n;
    
    const xScale = d3$1.scaleLinear()
      .rangeRound([
        margin.left,
        width - margin.right,
      ])
      .domain([
        -1 * maxNegativePercentage,
        maxPositivePercentage,
      ])
      .nice();
    const yScale = d3$1.scaleBand()
      .range([height - margin.bottom, margin.top])
      .domain(Array.from(Array(dataLength).keys()))
      .paddingInner(0.33);

    // Render
    selection.call(createLegend$1, {
      width,
      margin,
      scale,
      xAxisLabel,
      yAxisLabel,
    });
    
    if (!warning) {
      selection.call(createBars, {
        data: sortedBoxData,
        xScale,
        yScale,
      });
      selection.call(createAxes, {
        data: sortedMediaData,
        xScale,
        yScale,
        xAxisLabel,
        yAxisLabel,
      });
      selection.selectAll('.warningText').remove();
    } else {
      selection
        .selectAll('.warningText')
        .data([
          'This question has a different scale than other questions,',
          'so it requires a different type of summary viz!',
          'Hopefully, coming soon!',
          'Go to Single View if you are curious.',
        ])
        .join('text')
        .classed('warningText', true)
        .text((d) => d)
        .attr(
          'x',
          margin.left +
            (width - margin.left - margin.right) / 2
        )
        .attr(
          'y',
          (d, i) =>
            margin.top +
            (height - margin.top - margin.bottom) /
              2 -
            45 +
            i * 30
        )
        .style('text-anchor', 'middle');

      selection.selectAll('.bars').remove();
    }
  };

  function createBars(
    selection,
    { data, xScale, yScale }
  ) {
    let topGroup = selection
      .selectAll('.bars')
      .data([null])
      .join('g')
      .classed('bars', true);
    topGroup
      .selectAll('.bar')
      .data(data)
      .join('g')
      .classed('bar', true)
      .attr('transform', (d, i) => {
        return `translate(0,${yScale(i)})`;
      })
      .each(function (boxes, i) {
        // Place
        d3$1.select(this)
          .selectAll('rect')
          .data(boxes)
          .join('rect')
          .classed('subbar', true)
          .attr('x', (d) => xScale(d.start))
          .attr(
            'width',
            (d) => xScale(d.end) - xScale(d.start)
          )
          .attr('height', yScale.bandwidth)
          .attr('fill', (d, i) => color[i]);
      });
  }

  function createAxes(
    selection,
    {
      data,
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
      xAxisLabelOffset = 45,
      yAxisLabelOffset = 65,
    }
  ) {
    yScale = yScale.domain(data);
    const yAxis = d3$1.axisLeft(yScale);
    selection
      .selectAll('.y-Axis')
      .data([null])
      .join('g')
      .classed('y-Axis', true)
      .attr(
        'transform',
        'translate(' + xScale.range()[0] + ',0)'
      )
      .call(yAxis);

    const xAxis = d3$1.axisBottom(xScale);
    selection
      .selectAll('.x-Axis')
      .data([null])
      .join('g')
      .classed('x-Axis', true)
      .attr(
        'transform',
        'translate(0,' + yScale.range()[0] + ')'
      )
      .call(xAxis);

    selection
      .selectAll('.yAxisLabel')
      .data([null])
      .join('text')
      .classed('yAxisLabel', true)
      .text(yAxisLabel)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr(
        'y',
        xScale.range()[0] - yAxisLabelOffset
      )
      .attr(
        'x',
        -(yScale.range()[0] + yScale.range()[1]) / 2
      );

    selection
      .selectAll('.xAxisLabel')
      .data([null])
      .join('text')
      .classed('xAxisLabel', true)
      .text(xAxisLabel)
      .attr('text-anchor', 'middle')
      .attr(
        'x',
        (xScale.range()[0] + xScale.range()[1]) / 2
      )
      .attr(
        'y',
        yScale.range()[0] + xAxisLabelOffset
      );
  }

  function createLegend$1(
    selection,
    {
      width,
      margin,
      scale,
      legendOffset = 35,
      titleOffset = 15,
    }
  ) {
    // Legend
    let topGroup = selection
      .selectAll('.legend')
      .data([null])
      .join('g')
      .classed('legend', true)
      .attr(
        'transform',
        `translate(${0}, ${
        margin.top - legendOffset
      })`
      );
    let binded = topGroup
      .selectAll('.legend-item')
      .data(scale, (d, i) => d);
    binded.exit().remove();
    binded
      .enter()
      .append('g')
      .classed('legend-item', true)
      .attr('data-label', (d) => d)
      .attr('transform', function (d, i) {
        let cumLength = scale
          .slice(0, i)
          .reduce((acc, el) => acc + el.length, 0);
        return `translate(${
        40 * i + 8 * cumLength
      }, 0)`;
      })
      .call((g) =>
        g
          .append('text')
          .text((d) => d)
          .attr('y', 12)
          .attr('x', 25)
          .style('font-size', '0.6em')
      )
      .call((g) =>
        g
          .append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .style('fill', (d, i) => color[i])
      );
    let legendWidth = topGroup
      .node()
      .getBoundingClientRect().width;
    topGroup.attr(
      'transform',
      `translate(${(width - legendWidth) / 2}, ${
      margin.top - legendOffset
    })`
    );
  }

  function calculateBoxes(arr, total) {
    let percents = {};
    arr.forEach((d, j) => {
      percents[j] = (d * 100) / total;
    });

    let boxes = [];
    // start will be disagrees: 0, 1, 2
    var start =
      -1 *
      (percents[0] + percents[1] + percents[2]);
    [0, 1, 2, 3, 4, 5].forEach(function (val) {
      boxes[val] = {
        idx: val,
        start: start,
        end: (start += percents[val]),
        n: percents[val],
      };
    });
    return boxes;
  }

  const height$1 = window.innerHeight - 10 - 65;
  const width$1 = window.innerWidth - 10;
  const margin = {
      top: 40,
      bottom: 50,
      left: 95,
      right: 30,
    };

  function createDivergingScale(container, data, setState) {
    const svg = d3$1.select(container)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width$1)
      .attr('height', height$1);
    
  	d3$1.select(container).call(createTitle, { 
      questionTag: data.currentData.questionTag, 
      titles: data.titles, 
      width: width$1, 
      margin,
      onChange: (qTag) => {
        let currentData = getDivergingScaleData(data.totalData, qTag);
        setState((state) => ({
          ...state,
          data: { ...data,
                 currentData: currentData },
        }));
    }});
    svg.call(divergingScale, {
      data: data.currentData.pointsMap,
      width: width$1,
      height: height$1,
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
      	height: height$1,
        setState
    	});
  }

  function getDualDivergingScaleData(byQuestion, questionTag, dualModeMedia) {
    let theseQuestions = { ...byQuestion };
    {
      for (let question in theseQuestions){
      	theseQuestions[question] = theseQuestions[question].filter((d) => {
          return dualModeMedia.includes(d.mediaText)
        });
      }
    }
    let { warning, scale } = getScale(questionTag);
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

  const color$1 = d3$1.schemePuOr[6].reverse();

  const dualDivergingScale = (
    container,
    {
      data,
      questionTag,
      scale,
      titles,
      currentMedia,
      mediaList,
      width,
      height,
      margin,
      xAxisLabel,
      yAxisLabel,
      titleHeight,
      yAxisWidth,
      onYAxisChange,
      warning,
    }
  ) => {
    const selection = container
      .selectAll('svg')
      .data([null])
      .join('svg')
      .classed('graph', true)
      .attr('width', width)
      .attr('height', height)
      .style('top', titleHeight + 'px')
      .style('left', yAxisWidth + 'px');

    // Calculate
    let linkedData = [];
    data.forEach(function (value, key) {
      const total = d3.sum(value);
      linkedData.push({
        media: key,
        points: calculateBoxes$1(value, total),
      });
    });
    let sortedLinkedData = linkedData.sort(
      (a, b) => {
        return (
          currentMedia.indexOf(a.media) -
          currentMedia.indexOf(b.media)
        );
      }
    );
    let sortedBoxData = sortedLinkedData.map(
      (d) => d.points
    );
    let sortedMediaData = sortedLinkedData.map(
      (d) => d.media
    );
    const dataLength = sortedLinkedData.length;

    // Render
    const maxPositivePercentage = 100;
    const maxNegativePercentage = 100;
    const xScale = d3$1.scaleLinear()
      .rangeRound([
        margin.left,
        width - margin.right,
      ])
      .domain([
        -1 * maxNegativePercentage,
        maxPositivePercentage,
      ])
      .nice();
    const yScale = d3$1.scaleBand()
      .range([height - margin.bottom, margin.top])
      .domain(Array.from(Array(dataLength).keys()))
      .paddingInner(0.2)
      .paddingOuter(0.15);
    
    selection.call(createLegend$2, {
      width,
      margin,
      scale,
      xAxisLabel,
      yAxisLabel,
    });

    if (!warning) {
      selection.call(createBars$1, {
        data: sortedBoxData,
        xScale,
        yScale,
      });
      
      selection.selectAll('.warningText').remove();
    } else {
      selection
        .selectAll('.warningText')
        .data([
          'This question has a different scale than other questions,',
          'so it requires a different type of summary viz!',
        	'Hopefully, coming soon!',
          'Go to Single View if you are curious.',
        ])
        .join('text')
        .classed('warningText', true)
        .text((d) => d)
        .attr(
          'x',
          margin.left +
            (width - margin.left - margin.right) / 2
        )
        .attr(
          'y',
          (d, i) =>
            margin.top +
            (height - margin.top - margin.bottom) /
              2 -
            45 +
            i * 30
        )
        .style('text-anchor', 'middle');
      
      selection.selectAll('.bars').remove();
    }

    container.call(createAxes$1, {
      selection,
      data: sortedMediaData,
      mediaList,
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
      yAxisWidth,
      titleHeight,
      onYAxisChange,
    });
  };

  function createBars$1(
    selection,
    { data, xScale, yScale }
  ) {
    let topGroup = selection
      .selectAll('.bars')
      .data([null])
      .join('g')
      .classed('bars', true);
    topGroup
      .selectAll('.bar')
      .data(data)
      .join('g')
      .classed('bar', true)
      .attr('transform', (d, i) => {
        return `translate(0,${yScale(i)})`;
      })
      .each(function (boxes, i) {
        // Place
        d3$1.select(this)
          .selectAll('rect')
          .data(boxes)
          .join('rect')
          .classed('subbar', true)
          .attr('x', (d) => xScale(d.start))
          .attr(
            'width',
            (d) => xScale(d.end) - xScale(d.start)
          )
          .attr('height', yScale.bandwidth)
          .attr('fill', (d, i) => color$1[i]);
      });
  }

  function createAxes$1(
    container,
    {
      selection,
      data, // the current media
      mediaList, // all the media
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
      xAxisLabelOffset = 45,
      yAxisLabelOffset = 5,
      yAxisWidth,
      titleHeight,
      onYAxisChange,
    }
  ) {
    yScale = yScale.domain(data);
    const yAxis = d3$1.axisLeft(yScale);
    selection
      .selectAll('.yAxis')
      .data([null])
      .join('g')
      .classed('yAxis', true)
      .attr(
        'transform',
        'translate(' + xScale.range()[0] + ',0)'
      )
      .call(yAxis);
    selection
      .selectAll('.yAxis')
      .selectAll('text')
      .remove();

    let topSelect = container
      .selectAll('.yAxisLabel')
      .data(data)
      .join('select')
      .classed('yAxisLabel', true)
      .style('width', yAxisWidth - 10 + 'px')
      .style('top', (d, i) => {
        return (
          titleHeight +
          yScale(d) +
          yScale.bandwidth() / 2 -
          10 +
          'px'
        );
      })
      .style('left', yAxisLabelOffset + 'px')
      .style('postion', 'absolute')
      .attr('data-index', (d, i) => i)
      .on('change', (event) => {
        onYAxisChange(
          event.target.value,
          event.target.getAttribute('data-index')
        );
      });
    topSelect.each(function (media, i) {
      let newMediaList = mediaList.filter((m) => {
        return media === m || !data.includes(m);
      });
      d3$1.select(this)
        .selectAll('.selectOptions')
        .data(newMediaList)
        .join('option')
        .classed('selectOptions', true)
        .attr('value', (d) => d)
        .text((d) => d);
    });
    topSelect.each(function (media, i) {
      d3$1.select(this)
        .select("option[value='" + media + "']")
        .property('selected', true);
    });

    const xAxis = d3$1.axisBottom(xScale);
    selection
      .selectAll('.xAxis')
      .data([null])
      .join('g')
      .classed('xAxis', true)
      .attr(
        'transform',
        'translate(0,' + yScale.range()[0] + ')'
      )
      .call(xAxis);

    selection
      .selectAll('.xAxisLabel')
      .data([null])
      .join('text')
      .classed('xAxisLabel', true)
      .text(xAxisLabel)
      .attr('text-anchor', 'middle')
      .attr(
        'x',
        (xScale.range()[0] + xScale.range()[1]) / 2
      )
      .attr(
        'y',
        yScale.range()[0] + xAxisLabelOffset
      );
  }

  function createLegend$2(
    selection,
    {
      width,
      margin,
      scale,
      legendOffset = 35,
      titleOffset = 15,
    }
  ) {
    // Legend
    let topGroup = selection
      .selectAll('.legend')
      .data([null])
      .join('g')
      .classed('legend', true)
      .attr(
        'transform',
        `translate(${0}, ${
        margin.top - legendOffset
      })`
      );
    let binded = topGroup
      .selectAll('.legend-item')
      .data(scale, (d, i) => d);
    binded.exit().remove();
    binded
      .enter()
      .append('g')
      .classed('legend-item', true)
      .attr('data-label', (d) => d)
      .attr('transform', function (d, i) {
        let cumLength = scale
          .slice(0, i)
          .reduce((acc, el) => acc + el.length, 0);
        return `translate(${
        40 * i + 8 * cumLength
      }, 0)`;
      })
      .call((g) =>
        g
          .append('text')
          .text((d) => d)
          .attr('y', 12)
          .attr('x', 25)
          .style('font-size', '0.6em')
      )
      .call((g) =>
        g
          .append('rect')
          .attr('width', 15)
          .attr('height', 15)
          .style('fill', (d, i) => color$1[i])
      );
    let legendWidth = topGroup
      .node()
      .getBoundingClientRect().width;
    topGroup.attr(
      'transform',
      `translate(${(width - legendWidth) / 2}, ${
      margin.top - legendOffset
    })`
    );
  }

  function calculateBoxes$1(arr, total) {
    let percents = {};
    arr.forEach((d, j) => {
      percents[j] = (d * 100) / total;
    });

    let boxes = [];
    // start will be disagrees: 0, 1, 2
    var start =
      -1 *
      (percents[0] + percents[1] + percents[2]);
    [0, 1, 2, 3, 4, 5].forEach(function (val) {
      boxes[val] = {
        idx: val,
        start: start,
        end: (start += percents[val]),
        n: percents[val],
      };
    });
    return boxes;
  }

  const margin$1 = {
      top: 40,
      bottom: 50,
      left: 110,
      right: 30,
    };
  const titleHeight = 50;
  const yAxisWidth = 0;
  const height$2 = window.innerHeight - 10 - titleHeight;
  const width$2 = window.innerWidth - 10 - yAxisWidth;
  function createDualDivergingScale(container, data, setState) {
  	d3$1.select(container).call(dualDivergingScale, {
      data: data.currentData.pointsMap,
      questionTag: data.currentData.questionTag,
      scale: data.currentData.scale,
      titles: data.titles,
      mediaList: data.mediaList,
      currentMedia: data.currentData.media,
      width: width$2,
      height: height$2,
      margin: margin$1,
      xAxisLabel: 'Percentage of Responses (%)',
      yAxisLabel: 'Social Media Names',
      titleHeight,
      yAxisWidth,
      warning: data.currentData.warning,
      onYAxisChange: (media, index) => {
        let newMedia = [...data.currentData.media];
        newMedia[index] = media;
        console.log(data.currentData.media, newMedia);
        let currentData = getDualDivergingScaleData(data.totalData, data.currentData.questionTag, newMedia);
        setState((state) => ({
          ...state,
          data: { ...data,
                 currentData: currentData },
        }));
      }
    });
    
    d3$1.select(container).call(createTitle, { 
      questionTag: data.currentData.questionTag, 
      titles: data.titles, 
      width: width$2 + yAxisWidth, 
      margin: margin$1,
      onChange: (qTag) => {
        let currentData = getDualDivergingScaleData(data.totalData, qTag, data.currentData.media);
        setState((state) => ({
          ...state,
          data: { ...data,
                 currentData: currentData },
        }));
      }
    });
    
    d3$1.select(container)
    	.selectAll('svg')
      .call(backButton, {
      	height: height$2,
        setState
    	});
  }

  const barChart = (
    selection,
    {
      data,
      width,
      height,
      margin,
      questionTag,
      titles,
      xAxisLabel,
      yAxisLabel,
      scale,
      max,
    }
  ) => {  
    const xScale = d3$1.scaleBand()
      .range([
        margin.left,
        width - margin.right,
      ])
      .domain(scale)
    	.paddingOuter(0.2)
      .paddingInner(0.2);
    const yScale = d3$1.scaleLinear()
      .range([height - margin.bottom, margin.top])
      .domain([0, max]);
    
    // Calculate
    selection.call(createBars$2, {
      data,
      xScale,
      yScale,
    });
    selection.call(createAxes$2, {
      data,
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
    });
  };

  function createBars$2(
    selection,
    { data, xScale, yScale }
  ) {
    let topGroup = selection
    	.selectAll('.bars')
      .data([null])
      .join('g')
    	.classed("bars", true);
    topGroup
      .selectAll('.bar')
      .data(Object.keys(data.counts))
      .join('rect')
      .classed('bar', true)
      .attr('x', (d) => xScale(d))
      .attr('y', (d) => yScale(data.counts[d]))
      .attr('width', (d) => xScale.bandwidth())
      .attr('height', (d) => yScale(0) - yScale(data.counts[d]))
      .style('fill', (d, i) => mediaColors[data.mediaText]);
  }

  function createAxes$2(
    selection,
    {
      data,
      xScale,
      yScale,
      xAxisLabel,
      yAxisLabel,
      xAxisLabelOffset = 50,
      yAxisLabelOffset = 40,
    }
  ) {
    const yAxis = d3$1.axisLeft(yScale);
    selection
      .selectAll('.yAxis')
      .data([null])
      .join('g')
      .classed('yAxis', true)
      .attr(
        'transform',
        'translate(' + xScale.range()[0] + ',0)'
      )
      .call(yAxis);

    const xAxis = d3$1.axisBottom(xScale);
    selection
      .selectAll('.xAxis')
      .data([null])
      .join('g')
      .classed('xAxis', true)
      .attr(
        'transform',
        'translate(0,' + yScale.range()[0] + ')'
      )
      .call(xAxis);

    selection
      .selectAll('.yAxisLabel')
      .data([null])
      .join('text')
      .classed('yAxisLabel', true)
      .text(yAxisLabel)
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr(
        'y',
        xScale.range()[0] - yAxisLabelOffset
      )
      .attr(
        'x',
        -(yScale.range()[0] + yScale.range()[1]) / 2
      );

    selection
      .selectAll('.xAxisLabel')
      .data([null])
      .join('text')
      .classed('xAxisLabel', true)
      .text(xAxisLabel)
      .attr('text-anchor', 'middle')
      .attr(
        'x',
        (xScale.range()[0] + xScale.range()[1]) / 2
      )
      .attr(
        'y',
        yScale.range()[0] + xAxisLabelOffset
      );
  }

  function getBarChartData(byQuestion, questionTag, media) {
    let theseQuestions = { ...byQuestion };
    for (let question in theseQuestions){
      theseQuestions[question] = theseQuestions[question].filter((d) => {
        return d.mediaText === media
      })[0];
    }
    let { scale } = getScale(questionTag);
    const data = theseQuestions[questionTag];
    // Get max for yScale
    let max = 0;
    Object.keys(theseQuestions).forEach((key) => {
      let countValues = Object.values(theseQuestions[key].counts);
      let questionMax = Math.max(...countValues);
      max = (questionMax > max && key !== 'D3' && key !== 'D2') ? questionMax : max;
    });
    return {
      scale: scale,
      data: data,
      media: media,
      questionTag: questionTag,
      max: max
    };
  }

  const titleTranslate = 65;
  const height$3 = window.innerHeight - 10 - titleTranslate;
  const width$3 = window.innerWidth - 10;
  const margin$2 = {
    top: 15,
    bottom: 50,
    left: 80,
    right: 30,
  };

  const createBarChart = (
    container,
    data,
    setState
  ) => {
    const svg = d3$1.select(container)
      .selectAll('svg')
      .data([null])
      .join('svg')
      .attr('width', width$3)
      .attr('height', height$3);

    d3$1.select(container).call(createTitle, {
      questionTag: data.currentData.questionTag,
      titles: data.titles,
      width: width$3,
      margin: margin$2,
      onChange: (qTag) => {
        let currentData = getBarChartData(
          data.totalData,
          qTag,
          data.currentData.media
        );
        setState((state) => ({
          ...state,
          data: {
            ...data,
            currentData: currentData,
          },
        }));
      },
    });
    svg
      .call(barChart, {
        data: data.currentData.data,
        questionTag:
          data.currentData.data.questionTag,
        scale: data.currentData.scale,
        titles: data.titles,
        max: data.currentData.max,
        width: width$3,
        height: height$3,
        margin: margin$2,
        xAxisLabel: 'Likert Scale',
        yAxisLabel: '# of Responses',
      })
      .raise();

    svg.call(backButton, {
      height: height$3,
      setState,
    });
    d3$1.select(container).call(createMediaSelect, {
      media: data.currentData.data.mediaText,
      mediaList: data.mediaList,
      width: width$3,
      onMediaChange: (media) => {
        let currentData = getBarChartData(
          data.totalData,
          data.currentData.questionTag,
          media
        );
        setState((state) => ({
          ...state,
          data: {
            ...data,
            currentData: currentData,
          },
        }));
      },
    });
  };

  const createMediaSelect = (
    container,
    {
      media,
      mediaList,
      onMediaChange,
      width,
      selectTop = 55,
      selectWidth = 150,
      selectHeight = 30,
      selectMargin = 5,
    }
  ) => {
    let topSelect = container
      .selectAll('.mediaSelect')
      .data([null])
      .join('select')
      .classed('mediaSelect', true)
      .style('width', selectWidth + 'px')
      .style('height', selectHeight + 'px')
      .style('position', 'absolute')
      .style(
        'top',
       	selectTop + 'px'
      )
      .style(
        'left',
        width - selectMargin - selectWidth + 'px'
      )
      .on('change', (event) => {
        onMediaChange(event.target.value);
      });
    topSelect
      .selectAll('.selectOptions')
      .data(mediaList)
      .join('option')
      .classed('selectOptions', true)
      .attr('value', (d) => d)
      .text((d) => d);
    topSelect
      .select("option[value='" + media + "']")
      .property('selected', true);
  };

  const DEFAULT_QUESTION = 'C3';
  const DEFAULT_DUAL_MEDIAS = ["Facebook", "Instagram"];
  const DEFAULT_MEDIA = "Facebook";

  const viz = (
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
      retrieveData(setState);
    }

    if (mode && mode === 'SELECT') {
      d3$1.select(container).selectAll("*").remove();
      d3$1.select(container).call(selectPage, { 
        width: window.innerWidth - 10, 
        height: window.innerHeight - 10,
      	onClick: function(e, d) {
          let currData;
          switch (d) {
            case "SUMMARY":
              currData = data.radarData;
              break;
            case "MULTI":
              if(memory.MULTI !== undefined) {
              	currData = getDivergingScaleData(data.totalData, memory.MULTI.questionTag);
              } else {
              	currData = getDivergingScaleData(data.totalData, DEFAULT_QUESTION);
              }
              break;
            case "DUAL":
              if(memory.DUAL !== undefined) {
              	currData = getDualDivergingScaleData(data.totalData, memory.DUAL.questionTag, memory.DUAL.medias);
              } else {
              	currData = getDualDivergingScaleData(data.totalData, DEFAULT_QUESTION, DEFAULT_DUAL_MEDIAS);
              }
              break;
            case "SINGLE":
              if(memory.SINGLE !== undefined) {
              	currData = getBarChartData(data.totalData, memory.SINGLE.questionTag, memory.SINGLE.media);
              } else {
              	currData = getBarChartData(data.totalData, DEFAULT_QUESTION, DEFAULT_MEDIA);
              }
              break;
          }
          d3$1.select(container).selectAll("*").remove();
          setState((state) => ({
            ...state,
            mode: d,
            data: { ...data,
                   currentData: currData },
          }));
        }
    	});
    } else if (mode && data && data !== 'LOADING') {
      switch (mode) {
        case "SUMMARY":
          createRadarChart(container, data.radarData, setState);
          break;
        case "MULTI":
          createDivergingScale(container, data, setState);
          break;
        case "DUAL":
          createDualDivergingScale(container, data, setState);
          break;
        case "SINGLE":
          createBarChart(container, data, setState);
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
      let totalData = parseData(csvString);
      let radarData = getRadarData(csvString);
      let titles = getQuestionTitles(totalData);
      let mediaList = getMediaList(totalData);
      //let currentData = getDualDivergingScaleData(totalData, DEFAULT_QUESTION, DEFAULT_DUAL_MEDIAS)
      let currentData = getBarChartData(totalData, DEFAULT_QUESTION, DEFAULT_MEDIA);
      //let currentData = getDivergingScaleData(totalData, DEFAULT_QUESTION)
      let data = { currentData, totalData, titles, mediaList, radarData };
      setState((state) => ({
        ...state,
        data,
      }));
    });
  }

  function parseData(csvString){
    let data = d3$1.csvParse(csvString);

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
    let options = {};
    Object.keys(byQuestion).forEach( (key) => {
      options[key] = ({ questionTag: key, title: byQuestion[key][0].title });
    });
    return options
  }

  function getMediaList(byQuestion) {
    let firstKey = Object.keys(byQuestion)[0];
    return byQuestion[firstKey].map((obj) => { return obj.mediaText })
  }

  const container = d3$1.select('#app').node();
  let state = {};

  const render = () => {
    viz(container, {
      state,
      setState,
    });
  };

  const setState = (next) => {
    state = next(state);
    render();
  };

  render();

}(d3));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbInNjcmlwdHMvc2VsZWN0LmpzIiwic2NyaXB0cy9yYWRhckNoYXJ0L3JhZGFyQXhlcy5qcyIsInNjcmlwdHMvbWVkaWFDb2xvcnMuanMiLCJzY3JpcHRzL3JhZGFyQ2hhcnQvcmFkYXJIb3Zlci5qcyIsInNjcmlwdHMvcmFkYXJDaGFydC9yYWRhckxlZ2VuZC5qcyIsInNjcmlwdHMvcmFkYXJDaGFydC9yYWRhckNoYXJ0LmpzIiwic2NyaXB0cy9iYWNrQnV0dG9uLmpzIiwic2NyaXB0cy9yYWRhckNoYXJ0L2NyZWF0ZVJhZGFyQ2hhcnQuanMiLCJzY3JpcHRzL3JhZGFyQ2hhcnQvZ2V0UmFkYXJEYXRhLmpzIiwic2NyaXB0cy9zY2FsZURlZnMuanMiLCJzY3JpcHRzL2RpdmVyZ2luZ1NjYWxlL2dldERpdmVyZ2luZ1NjYWxlRGF0YS5qcyIsInNjcmlwdHMvc2VsZWN0YWJsZVRpdGxlLmpzIiwic2NyaXB0cy9kaXZlcmdpbmdTY2FsZS9kaXZlcmdpbmdTY2FsZS5qcyIsInNjcmlwdHMvZGl2ZXJnaW5nU2NhbGUvY3JlYXRlRGl2ZXJnaW5nU2NhbGUuanMiLCJzY3JpcHRzL2R1YWxEaXZlcmdpbmdTY2FsZS9nZXREdWFsRGl2ZXJnaW5nU2NhbGVEYXRhLmpzIiwic2NyaXB0cy9kdWFsRGl2ZXJnaW5nU2NhbGUvZHVhbERpdmVyZ2luZ1NjYWxlLmpzIiwic2NyaXB0cy9kdWFsRGl2ZXJnaW5nU2NhbGUvY3JlYXRlRHVhbERpdmVyZ2luZ1NjYWxlLmpzIiwic2NyaXB0cy9iYXJDaGFydC9iYXJDaGFydC5qcyIsInNjcmlwdHMvYmFyQ2hhcnQvZ2V0QmFyQ2hhcnREYXRhLmpzIiwic2NyaXB0cy9iYXJDaGFydC9jcmVhdGVCYXJDaGFydC5qcyIsInZpei5qcyIsImluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNlbGVjdCB9IGZyb20gJ2QzJztcbmNvbnN0IGltZ01hcCA9IHtcbiAgXCJTVU1NQVJZXCI6J2h0dHBzOi8vaS5pbWd1ci5jb20vY2NVSDNsNS5wbmcnLFxuICBcIk1VTFRJXCI6J2h0dHBzOi8vaS5pbWd1ci5jb20vd1o2bGlzcy5wbmcnLFxuICBcIkRVQUxcIjonaHR0cHM6Ly9pLmltZ3VyLmNvbS93UEE5R2xQLnBuZycsXG4gIFwiU0lOR0xFXCI6J2h0dHBzOi8vaS5pbWd1ci5jb20vWUhoMnNkZi5wbmcnXG59XG5jb25zdCBkZXNjcmlwdGlvbk1hcCA9IHtcbiAgXCJTVU1NQVJZXCI6W1xuICAgICdTdW1tYXJ5IFZpZXcnLCBcbiAgICAnJyxcbiAgICAnU3VydmV5IGhvdyBzb2NpYWwgbWVkaWEgY29tcGFyZSBvbiBvdXIgc3ludGhlc2l6ZWQnLFxuICAgICdzY2FsZXMgb2YgQ29tbXVuaXR5LCBTZWxmLUV4cHJlc3Npb24sIERpc2NvdmVyeSwgYW5kIEFnZW5jeS4nLFxuICAgICdpLmUuJyxcbiAgICAnVmlldyBhbGwgMTIgc29jaWFsIG1lZGlhIGluIGEgUGFyYWxsZWwgQ29vcmRpbmF0ZXMgQ2hhcnQuJyxcbiAgXSxcbiAgXCJNVUxUSVwiOltcbiAgICAnQWxsIFNvY2lhbCBNZWRpYSBWaWV3JyxcbiAgICAnJyxcbiAgICAnU3VydmV5IHRoZSBnZW5lcmFsIHBvc2l0aXZlIGFuZCBuZWdhdGl2ZSBsZWFuaW5ncyBvZiBhbGwgcGxhdGZvcm1zLicsXG4gIFx0J2kuZS4nLFxuICAgICdWaWV3IGFsbCAxMiBzb2NpYWwgbWVkaWEgb24gb3VyIDI2IHF1ZXN0aW9ucycsXG4gICAgJ2luIGEgc29ydGVkIERpdmVyZ2luZyBMaWtlcnQgU2NhbGUgQ2hhcnQuJ1xuICBdLFxuICBcIkRVQUxcIjpbXG4gICAgJ0R1YWwgU29jaWFsIE1lZGlhIFZpZXcnLFxuICAgICcnLFxuICAgICdJbnZlc3RpZ2F0ZSB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiB0d28gc29jaWFsIG1lZGlhIGluIHBhcnRpY3VsYXInLFxuICAgICdpLmUuJyxcbiAgICAnVmlldyAyIHNvY2lhbCBtZWRpYSBvZiB5b3VyIGNob2ljZSBvbiBvdXIgMjYgcXVlc3Rpb25zJyxcbiAgICAnaW4gYSBEaXZlcmdpbmcgTGlrZXJ0IFNjYWxlIENoYXJ0LidcbiAgXSxcbiAgXCJTSU5HTEVcIjpbXG4gICAgJ1NpbmdsZSBTb2NpYWwgTWVkaWEgVmlldycsXG4gICAgJycsXG4gICAgJ0ludmVzdGlnYXRlIHF1ZXN0aW9ucyBvbiBhIHNpbmdsZSBzb2NpYWwgbWVkaWEnLFxuICAgICdpLmUuJyxcbiAgICAnVmlldyAxIHNvY2lhbCBtZWRpYSBvZiB5b3VyIGNob2ljZSBvbiBvdXIgMjYgcXVlc3Rpb24gaW4gYSBCYXIgQ2hhcnQnXG4gIF1cbn1cbmV4cG9ydCBjb25zdCBzZWxlY3RQYWdlID0gKFxuICBjb250YWluZXIsXG4gIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgb25DbGljayxcbiAgICBsYWJlbHMgPSBbXCJTVU1NQVJZXCIsIFwiTVVMVElcIiwgXCJEVUFMXCIsIFwiU0lOR0xFXCJdXG4gIH1cbikgPT4ge1xuICBjb25zdCBzZWxlY3Rpb24gPSBjb250YWluZXJcbiAgICAuc2VsZWN0QWxsKCdzdmcnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuICBcbiAgbGV0IHRpdGxlQm90dG9tID0gNTA7XG4gIGxldCBzdWJ0aXRsZUJvdHRvbSA9IHRpdGxlQm90dG9tICsgMzU7XG4gIHNlbGVjdGlvblxuICBcdC5zZWxlY3RBbGwoJy5zZWxlY3QtdGl0bGUnKVxuICBcdC5kYXRhKFtudWxsXSlcbiAgXHQuam9pbigndGV4dCcpXG4gIFx0LmNsYXNzZWQoJ3NlbGVjdC10aXRsZScsIHRydWUpXG4gIFx0LnRleHQoXCJTb2NpYWxTaWdodDogTVFQIERhdGEgb24gU29jaWFsIE1lZGlhXCIpXG4gIFx0LmF0dHIoJ3gnLCB3aWR0aC8yKVxuICBcdC5hdHRyKCd5JywgdGl0bGVCb3R0b20pXG4gIHNlbGVjdGlvblxuICBcdC5zZWxlY3RBbGwoJy5zZWxlY3Qtc3VidGl0bGUnKVxuICBcdC5kYXRhKFtudWxsXSlcbiAgXHQuam9pbigndGV4dCcpXG4gIFx0LmNsYXNzZWQoJ3NlbGVjdC1zdWJ0aXRsZScsIHRydWUpXG4gIFx0LnRleHQoXCJieSBLaWFyYSBNdW56XCIpXG4gIFx0LmF0dHIoJ3gnLCB3aWR0aC8yKVxuICBcdC5hdHRyKCd5Jywgc3VidGl0bGVCb3R0b20pXG4gIFxuICBsZXQgYm94U2l6ZSA9IDIwMFxuICBsZXQgaW5iZXR3ZWVuTWFyZ2luID0gMzBcbiAgbGV0IHRvcE1hcmdpbiA9IHN1YnRpdGxlQm90dG9tICsgaW5iZXR3ZWVuTWFyZ2luXG4gIGxldCBmcm9udE1hcmdpbiA9ICh3aWR0aCAtIChib3hTaXplKjQgKyBpbmJldHdlZW5NYXJnaW4qMykpLzJcbiAgbGV0IHhQbGFjZW1lbnQgPSAoZCwgaSkgPT4ge3JldHVybiBmcm9udE1hcmdpbiArIGkgKiAoYm94U2l6ZSArIGluYmV0d2Vlbk1hcmdpbil9XG4gIGxldCB5UGxhY2VtZW50ID0gKGQsIGkpID0+IHtyZXR1cm4gdG9wTWFyZ2luIH1cbiAgbGV0IHRleHRNYXJnaW4gPSAyNTtcblxuICBsZXQgcmVjdHMgPSBzZWxlY3Rpb25cbiAgXHQuc2VsZWN0QWxsKCcuc2VsZWN0LXJlY3QnKVxuICBcdC5kYXRhKGxhYmVscylcbiAgXHQuam9pbigncmVjdCcpXG4gIFx0LmNsYXNzZWQoJ3NlbGVjdC1yZWN0JywgdHJ1ZSlcbiAgXHQuYXR0cignd2lkdGgnLCBib3hTaXplKVxuICBcdC5hdHRyKCdoZWlnaHQnLCBib3hTaXplKVxuICBcdC5hdHRyKCd4JywgeFBsYWNlbWVudClcbiAgXHQuYXR0cigneScsIHlQbGFjZW1lbnQpXG4gIFx0LnN0eWxlKCdvdXRsaW5lJywgJ2JsYWNrIHNvbGlkJylcbiAgXHQuc3R5bGUoJ2ZpbGwnLCAnd2hpdGUnKVxuICBcdC5zdHlsZSgnY3Vyc29yJywgJ3BvaW50ZXInKVxuICBcbiAgc2VsZWN0aW9uXG4gIFx0LnNlbGVjdEFsbCgnLnNlbGVjdC1pbWFnZScpXG4gIFx0LmRhdGEobGFiZWxzKVxuICBcdC5qb2luKCdpbWFnZScpXG4gIFx0LmNsYXNzZWQoJ3NlbGVjdC1pbWFnZScsIHRydWUpXG4gIFx0LmF0dHIoJ2hyZWYnLCBkID0+IGltZ01hcFtkXSlcbiAgXHQuYXR0cignd2lkdGgnLCBib3hTaXplKVxuICBcdC5hdHRyKCdoZWlnaHQnLCBib3hTaXplIC0gdGV4dE1hcmdpbilcbiAgXHQuYXR0cigneCcsIHhQbGFjZW1lbnQpXG4gIFx0LmF0dHIoJ3knLCB5UGxhY2VtZW50KVxuICAgIC5hdHRyKCdwcmVzZXJ2ZUFzcGVjdFJhdGlvJywgJ3hNaWRZTWlkIHNsaWNlJylcbiAgXG4gIHNlbGVjdGlvblxuICBcdC5zZWxlY3RBbGwoJy5zZWxlY3QtdGV4dCcpXG4gIFx0LmRhdGEobGFiZWxzKVxuICBcdC5qb2luKCd0ZXh0JylcbiAgXHQuY2xhc3NlZCgnc2VsZWN0LXRleHQnLCB0cnVlKVxuICBcdC50ZXh0KGQgPT4gZClcbiAgXHQuYXR0cignd2lkdGgnLCBib3hTaXplKVxuICBcdC5hdHRyKCdoZWlnaHQnLCBib3hTaXplKVxuICBcdC5hdHRyKCd4JywgKGQsaSkgPT4geFBsYWNlbWVudChkLGkpKyhib3hTaXplLzIpKVxuICBcdC5hdHRyKCd5JywgKGQsaSkgPT4geVBsYWNlbWVudChkLGkpK2JveFNpemUtKHRleHRNYXJnaW4vMikpXG4gIFxuICBsZXQgdGV4dFRvcCA9IHRvcE1hcmdpbiArIGJveFNpemUgKyBpbmJldHdlZW5NYXJnaW5cbiAgbGV0IGRlc2NyaXBNYXJnaW4gPSAyMjtcbiAgc2VsZWN0aW9uXG4gIFx0LnNlbGVjdEFsbCgnLnNlbGVjdC1kZXNjcmlwdGlvbicpXG4gIFx0LmRhdGEobGFiZWxzKVxuICBcdC5qb2luKCdnJylcbiAgXHQuY2xhc3NlZCgnc2VsZWN0LWRlc2NyaXB0aW9uJywgdHJ1ZSlcbiAgICAuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgke3dpZHRoLzJ9LCAke3RleHRUb3B9KWApXG4gIFx0LmF0dHIoJ2RhdGEtbW9kZScsIChkKSA9PiBkKVxuICBcdC5zdHlsZSgnZGlzcGxheScsICdub25lJylcbiAgXHQuZWFjaChmdW5jdGlvbiAoZCxpKSB7XG4gICAgXHRzZWxlY3QodGhpcylcbiAgICBcdFx0LnNlbGVjdEFsbCgnLnNlbGVjdC1kZXNjcmlwdGlvbi1pdGVtJylcbiAgICBcdFx0LmRhdGEoZGVzY3JpcHRpb25NYXBbZF0pXG4gICAgXHRcdC5qb2luKCd0ZXh0JylcbiAgICBcdFx0LmNsYXNzZWQoJ3NlbGVjdC1kZXNjcmlwdGlvbi1pdGVtJywgdHJ1ZSlcbiAgICBcdFx0LnRleHQoZGQgPT4ge3JldHVybiBkZDt9KVxuICAgIFx0XHQuYXR0cigneScsIChkLCBpKSA9PiBpKmRlc2NyaXBNYXJnaW4pXG4gIFx0fSlcbiAgcmVjdHNcbiAgXHQub24oJ21vdXNlb3ZlcicsIGZ1bmN0aW9uKGUsIGQpIHtcbiAgICBcdHNlbGVjdGlvblxuICAgICAgXHQuc2VsZWN0KGAuc2VsZWN0LWRlc2NyaXB0aW9uW2RhdGEtbW9kZT1cIiR7ZH1cIl1gKVxuICBcdFx0XHQuc3R5bGUoJ2Rpc3BsYXknLCAnaW5saW5lJylcbiAgXHR9KVxuICBcdC5vbignbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICBcdHNlbGVjdGlvblxuICAgICAgXHQuc2VsZWN0QWxsKGAuc2VsZWN0LWRlc2NyaXB0aW9uYClcbiAgXHRcdFx0LnN0eWxlKCdkaXNwbGF5JywgJ25vbmUnKVxuICBcdH0pXG4gIFx0Lm9uKCdjbGljaycsIG9uQ2xpY2spXG59IiwiaW1wb3J0IHsgYXhpc0xlZnQsIGF4aXNCb3R0b20sIHNlbGVjdCB9IGZyb20gJ2QzJztcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVSYWRhckNoYXJ0QXhlc0FuZExhYmVscyAoXG4gIHNlbGVjdGlvbixcbiAge1xuICAgIGxhYmVscyA9IHsgXCJDXCI6IFwiQ29tbXVuaXR5XCIsXG4gICAgICAgICAgICAgIFwiU1wiOiBcIlNlbGYtZXhwcmVzc2lvblwiLFxuICAgICAgICAgICAgICBcIkRcIjogXCJEaXNjb3ZlcnlcIixcbiAgICAgICAgICAgICAgXCJBXCI6IFwiQWdlbmN5XCIgfSxcbiAgXHRhdHRyaWJ1dGVzLFxuICBcdHhTY2FsZSxcbiAgXHR5U2NhbGUsXG4gICAgYXhpc0xhYmVsT2Zmc2V0ID0geVNjYWxlLnJhbmdlKClbMF0gKyAyNSxcbiAgfVxuKSB7XG5cbiAgbGV0IGF4ZXMgPSBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKFwiLnJhZGFyLWF4ZXNcIilcbiAgICAuZGF0YShbbnVsbF0pXG4gIFx0LmpvaW4oJ2cnKVxuICBcdC5jbGFzc2VkKFwicmFkYXItYXhlc1wiLCB0cnVlKVxuICBsZXQgbGFiZWxPYmplY3RzID0gc2VsZWN0aW9uXG4gICAgLnNlbGVjdEFsbChcIi5yYWRhci1sYWJlbHNcIilcbiAgICAuZGF0YShbbnVsbF0pXG4gIFx0LmpvaW4oJ2cnKVxuICBcdC5jbGFzc2VkKFwicmFkYXItbGFiZWxzXCIsIHRydWUpXG4gIGF4ZXNcbiAgXHQuc2VsZWN0QWxsKCcucmFkYXItYXhpcycpXG4gIFx0LmRhdGEoYXR0cmlidXRlcylcbiAgXHQuam9pbignZycpXG4gIFx0LmNsYXNzZWQoJ3JhZGFyLWF4aXMnLCB0cnVlKVxuICBcdC5hdHRyKCBcbiAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgKGQpID0+ICd0cmFuc2xhdGUoJyArICh4U2NhbGUoZCkpICsgJywwKSdcbiAgICApXG4gIFx0LmVhY2goZnVuY3Rpb24oZCwgaSkge1xuICAgIFx0c2VsZWN0KHRoaXMpXG4gICAgXHRcdC5jYWxsKGF4aXNMZWZ0KHlTY2FsZSkudGlja3MoMykpXG4gIFx0fSlcbiAgbGFiZWxPYmplY3RzXG4gIFx0LnNlbGVjdEFsbCgnLnJhZGFyLWxhYmVsJylcbiAgXHQuZGF0YShhdHRyaWJ1dGVzKVxuICBcdC5qb2luKCd0ZXh0JylcbiAgXHQuY2xhc3NlZCgncmFkYXItbGFiZWwnLCB0cnVlKVxuICBcdC50ZXh0KGQgPT4gbGFiZWxzW2RdKVxuICBcdC5hdHRyKCd0cmFuc2Zvcm0nLCBkID0+IGB0cmFuc2xhdGUoJHt4U2NhbGUoZCl9LCR7YXhpc0xhYmVsT2Zmc2V0fSlgKVxufVxuIiwiZXhwb3J0IGNvbnN0IG1lZGlhQ29sb3JzID0ge1xuICBcIlR3aXRjaFwiOiBcIiM2NTNkYTdcIixcbiAgXCJJbnN0YWdyYW1cIjogXCIjQzEzNTg0XCIsXG4gIFwiWW91VHViZVwiOiBcIiNjZDIwMWZcIixcbiAgXCJSZWRkaXRcIjogXCIjZmY0NTAwXCIsXG4gIFwiU25hcGNoYXRcIjogXCIjRTFENzFBXCIsXG4gIFwiNENoYW5cIjogXCIjNDI5MjJjXCIsXG4gIFwiVGlrVG9rXCI6IFwiIzAwRDFDQVwiLFxuICBcIlR3aXR0ZXJcIjogXCIjM2FiMGZmXCIsXG4gIFwiRmFjZWJvb2tcIjogXCIjMTk3N2YzXCIsXG4gIFwiTGlua2VkSW5cIjogXCIjMDI3NGIzXCIsXG4gIFwiVHVtYmxyXCI6IFwiIzAwNDA1ZFwiLFxuICBcIkJlUmVhbFwiOiBcIiMwMDAwMDBcIlxufTsiLCJleHBvcnQgY29uc3QgY3JlYXRlSG92ZXJzID0gKHNlbGVjdGlvbiwgeyBncm91cHMgfSkgPT4ge1xuXHRsZXQgbGVnZW5kSXRlbXMgPSBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiLmxlZ2VuZC1pdGVtXCIpXG4gIGdyb3Vwc1xuICBcdC5vbignbW91c2VvdmVyJywgZnVuY3Rpb24oZSwgZCkge1xuICAgICAgLy8gcmVtb3ZlIHRoZSBob3ZlciBjbGFzcyBmcm9tIGFsbCBlbGVtZW50c1xuICAgICAgcmVtb3ZlQWxsSG92ZXJzKGdyb3VwcywgbGVnZW5kSXRlbXMpXG5cbiAgICAgIC8vIGFkZCB0aGUgaG92ZXIgY2xhc3MgdG8gdGhlIGN1cnJlbnQgZWxlbWVudFxuICAgIFx0Ly8gcmFkYXIgc2hhcGVzXG4gICAgICBsZXQgY2hhcnQgPSBkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcImhvdmVyXCIsIHRydWUpLnJhaXNlKCk7XG4gICAgXHRsZXQgc2libGluZ3MgPSBzZWxlY3Rpb25cbiAgICAgIFx0LnNlbGVjdEFsbCgnLnJhZGFyLXNoYXBlOm5vdCguaG92ZXIpJylcbiAgICAgIFx0LmNsYXNzZWQoJ25vdC1ob3ZlcicsIHRydWUpXG4gICAgICBcbiAgICAgIC8vIGxlZ2VuZCBpdGVtc1xuICAgICAgbGV0IG1lZGlhTmFtZSA9IGQubWVkaWFcbiAgICAgIGxldCBpdGVtID0gbGVnZW5kSXRlbXMuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgXG4gICAgICAgIFx0ZDMuc2VsZWN0KHRoaXMpLmNsYXNzZWQoXCJub3QtaG92ZXJcIix0cnVlKVxuICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cignZGF0YS1tZWRpYScpID09PSBtZWRpYU5hbWVcbiAgICAgIH0pXG4gICAgICAuY2xhc3NlZChcImhvdmVyXCIsIHRydWUpXG4gICAgICAuY2xhc3NlZChcIm5vdC1ob3ZlclwiLCBmYWxzZSlcbiAgICB9KVxuICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbigpIHtcbiAgICBcdHJlbW92ZUFsbEhvdmVycyhncm91cHMsIGxlZ2VuZEl0ZW1zKVxuICAgIFx0bGV0IGNoYXJ0ID0gZDMuc2VsZWN0KHRoaXMpLmxvd2VyKClcbiAgXHR9KTtcbiAgXG4gIGxlZ2VuZEl0ZW1zXG4gICAgLm9uKCdtb3VzZW92ZXInLCBmdW5jdGlvbihlLCBkKSB7XG4gICAgICAvLyByZW1vdmUgdGhlIGhvdmVyIGNsYXNzIGZyb20gYWxsIGVsZW1lbnRzXG4gICAgICByZW1vdmVBbGxIb3ZlcnMoZ3JvdXBzLCBsZWdlbmRJdGVtcylcblx0XHRcdFxuICAgICAgaWYoIWQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwidW5jaGVja2VkXCIpKXtcbiAgICAgICAgLy8gYWRkIHRoZSBob3ZlciBjbGFzcyB0byB0aGUgY3VycmVudCBlbGVtZW50XG4gICAgXHRcdC8vIGxlZ2VuZCBpdGVtc1xuICAgICAgICBsZXQgaXRlbSA9IGQzLnNlbGVjdCh0aGlzKS5jbGFzc2VkKFwiaG92ZXJcIiwgdHJ1ZSk7XG4gICAgICAgIGxldCBzaWJsaW5ncyA9IHNlbGVjdGlvblxuICAgICAgICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQtaXRlbTpub3QoLmhvdmVyKScpXG4gICAgICAgICAgLmNsYXNzZWQoJ25vdC1ob3ZlcicsIHRydWUpXG5cbiAgICAgICAgLy8gcmFkYXIgc2hhcGVzXG4gICAgICAgIGxldCBtZWRpYU5hbWUgPSBkLm1lZGlhXG4gICAgICAgIGxldCBjaGFydCA9IGdyb3Vwc1xuICAgICAgICAgIC5jbGFzc2VkKFwibm90LWhvdmVyXCIsdHJ1ZSlcbiAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGQpIHsgXG4gICAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2RhdGEtbWVkaWEnKSA9PT0gbWVkaWFOYW1lXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuY2xhc3NlZChcImhvdmVyXCIsIHRydWUpXG4gICAgICAgICAgLmNsYXNzZWQoXCJub3QtaG92ZXJcIiwgZmFsc2UpXG4gICAgICAgICAgLnJhaXNlKClcbiAgICAgIH1cbiAgICB9KVxuICAgIC5vbignbW91c2VvdXQnLCBmdW5jdGlvbihlLCBkKSB7XG4gICAgXHRyZW1vdmVBbGxIb3ZlcnMoZ3JvdXBzLCBsZWdlbmRJdGVtcylcbiAgICBcdGlmKCFkMy5zZWxlY3QodGhpcykuY2xhc3NlZChcInVuY2hlY2tlZFwiKSl7XG4gICAgICAgIGxldCBtZWRpYU5hbWUgPSBkLm1lZGlhXG4gICAgICAgIGxldCBjaGFydCA9IGdyb3Vwcy5maWx0ZXIoZnVuY3Rpb24oZCkgeyBcbiAgICAgICAgICAgIHJldHVybiBkMy5zZWxlY3QodGhpcykuYXR0cignZGF0YS1tZWRpYScpID09PSBtZWRpYU5hbWVcbiAgICAgICAgfSlcbiAgICAgICAgLmxvd2VyKClcbiAgICAgIH1cbiAgXHR9KTtcbn1cblxuZXhwb3J0IGNvbnN0IHJlbW92ZUFsbEhvdmVycyA9IGZ1bmN0aW9uKGdyb3VwcywgbGVnZW5kSXRlbXMpIHtcbiAgLy8gcmVtb3ZlIHRoZSBob3ZlciBjbGFzcyBmcm9tIGFsbCBlbGVtZW50c1xuICBncm91cHMuY2xhc3NlZChcImhvdmVyXCIsIGZhbHNlKTtcbiAgbGVnZW5kSXRlbXMuY2xhc3NlZChcImhvdmVyXCIsIGZhbHNlKTtcbiAgZ3JvdXBzLmNsYXNzZWQoXCJub3QtaG92ZXJcIiwgZmFsc2UpO1xuICBsZWdlbmRJdGVtcy5jbGFzc2VkKFwibm90LWhvdmVyXCIsIGZhbHNlKTtcbn0iLCJpbXBvcnQgeyByZW1vdmVBbGxIb3ZlcnMgfSBmcm9tICcuL3JhZGFySG92ZXInXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTGVnZW5kKFxuICBzZWxlY3Rpb24sXG4gIHtcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgbWFyZ2luLFxuICAgIGRhdGEsXG4gICAgY29sb3IsXG4gICAgbGVnZW5kWE9mZnNldCA9IHdpZHRoIC0gMTMwLFxuICAgIGxlZ2VuZFlPZmZzZXQgPSA2MCxcbiAgICBib3hTaXplID0gMTUsXG4gIFx0Ym94U3BhY2luZyA9IDI1LFxuICBcdGxlZ2VuZFRpdGxlID0gJ1RvZ2dsZSBIZXJlIMOiwpjCkcOvwrjCjydcbiAgfVxuKSB7XG4gIC8vIExlZ2VuZFxuICBsZXQgdG9wR3JvdXAgPSBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcubGVnZW5kJylcbiAgICAuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ2cnKVxuICAgIC5jbGFzc2VkKCdsZWdlbmQnLCB0cnVlKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICBgdHJhbnNsYXRlKCR7bGVnZW5kWE9mZnNldH0sICR7XG4gICAgICAgIG1hcmdpbi50b3ArbGVnZW5kWU9mZnNldFxuICAgICAgfSlgXG4gICAgKTtcbiAgdG9wR3JvdXBcbiAgXHQuc2VsZWN0QWxsKCcubGVnZW5kLXRpdGxlJylcbiAgXHQuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ3RleHQnKVxuICAgIC5jbGFzc2VkKCdsZWdlbmQtdGl0bGUnLCB0cnVlKVxuICBcdC50ZXh0KGxlZ2VuZFRpdGxlKVxuICBcdC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICBgdHJhbnNsYXRlKDAsICR7XG4gICAgICAgIC1ib3hTcGFjaW5nICsgYm94U2l6ZVxuICAgICAgfSlgXG4gICAgKTtcbiAgdG9wR3JvdXBcbiAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgIC5kYXRhKGRhdGEpXG4gICAgLmpvaW4oJ2cnKVxuICAgIC5jbGFzc2VkKCdsZWdlbmQtaXRlbScsIHRydWUpXG4gIFx0LmF0dHIoXCJkYXRhLW1lZGlhXCIsIChkKSA9PiBkLm1lZGlhKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAoZCwgaSkgPT4ge1xuICAgICAgICBsZXQganVtcCA9IDBcbiAgICAgICAgLy9pZiAoaSA+IDUpIHsganVtcCA9IDIzMCB9XG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlKDAsICR7Ym94U3BhY2luZyppICsganVtcH0pYFxuICAgICAgfVxuICAgIClcbiAgICAuY2FsbCgoZykgPT5cbiAgICAgIGdcbiAgICAgICAgLmFwcGVuZCgndGV4dCcpXG4gICAgICAgIC50ZXh0KChkKSA9PiBkLm1lZGlhKVxuICAgICAgICAuYXR0cigneScsIDEyKVxuICAgICAgICAuYXR0cigneCcsIDI1KVxuICAgIClcbiAgICAuY2FsbCgoZykgPT5cbiAgICAgIGdcbiAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIGJveFNpemUpXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCBib3hTaXplKVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgPT4gY29sb3JbZC5tZWRpYV0pXG4gICAgICAgIC5hdHRyKCdzdHJva2UnLCAoZCkgPT4gY29sb3JbZC5tZWRpYV0pXG4gICAgKVxuICBcdC5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUsIGQpIHtcbiAgICBcdC8vIGNyZWF0ZSBjaGVjayB1bmNoZWNrIGZ1bmN0aW9uYWxpdHlcbiAgICBcdGxldCBpdGVtID0gZDMuc2VsZWN0KHRoaXMpXG4gICAgICAvLyBsZWdlbmQgaXRlbVxuICAgICAgbGV0IGlzVW5jaGVja2VkID0gIWl0ZW0uY2xhc3NlZChcInVuY2hlY2tlZFwiKVxuICAgIFx0aXRlbS5jbGFzc2VkKFwidW5jaGVja2VkXCIsIGlzVW5jaGVja2VkKVxuICAgIFxuICAgIFx0Ly8gcmFkYXIgc2hhcGVzXG4gICAgXHRsZXQgbWVkaWFWYWx1ZSA9IGQubWVkaWFcbiAgICBcdGxldCByYWRhclNoYXBlcyA9IHNlbGVjdGlvblxuICAgICAgXHQuc2VsZWN0QWxsKFwiLnJhZGFyLXNoYXBlXCIpXG4gICAgICByYWRhclNoYXBlcy5maWx0ZXIoZnVuY3Rpb24oZCkgeyBcbiAgICAgICAgICByZXR1cm4gZDMuc2VsZWN0KHRoaXMpLmF0dHIoJ2RhdGEtbWVkaWEnKSA9PT0gbWVkaWFWYWx1ZVxuICAgICAgICB9KVxuICAgICAgXHQuY2xhc3NlZChcInVuY2hlY2tlZFwiLCBpc1VuY2hlY2tlZClcbiAgICBcbiAgICBcdC8vIGRlYWwgd2l0aCBob3ZlcnNcbiAgICBcdGlmKGlzVW5jaGVja2VkKXtcbiAgICBcdFx0cmVtb3ZlQWxsSG92ZXJzKHJhZGFyU2hhcGVzLCBzZWxlY3Rpb24uc2VsZWN0QWxsKFwiLmxlZ2VuZC1pdGVtXCIpKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXRlbS5ub2RlKCkuZGlzcGF0Y2hFdmVudChuZXcgTW91c2VFdmVudCgnbW91c2VvdmVyJykpXG4gICAgICB9XG4gIFx0fSk7XG59IiwiaW1wb3J0IHsgc2VsZWN0LCBzY2FsZUxpbmVhciwgc2NhbGVQb2ludCwgc2NoZW1lRGFyazIsIGxpbmUsIGF4aXNMZWZ0LCBheGlzQm90dG9tIH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgY3JlYXRlUmFkYXJDaGFydEF4ZXNBbmRMYWJlbHMgfSBmcm9tICcuL3JhZGFyQXhlcyc7XG5pbXBvcnQgeyBtZWRpYUNvbG9ycyB9IGZyb20gJy4uL21lZGlhQ29sb3JzJ1xuaW1wb3J0IHsgY3JlYXRlTGVnZW5kIH0gZnJvbSAnLi9yYWRhckxlZ2VuZCdcbmltcG9ydCB7IGNyZWF0ZUhvdmVycyB9IGZyb20gJy4vcmFkYXJIb3ZlcidcbmV4cG9ydCBjb25zdCByYWRhckNoYXJ0ID0gKFxuICBzZWxlY3Rpb24sXG4gIHtcbiAgICBkYXRhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBtYXJnaW4gPSB7XG4gICAgICB0b3A6IDUwLFxuICAgICAgYm90dG9tOiA0MCxcbiAgICAgIGxlZnQ6IDMwLFxuICAgICAgcmlnaHQ6IDEzMCxcbiAgICB9LFxuICBcdGF0dHJpYnV0ZXMgPSBbXCJEXCIsIFwiQVwiLCBcIkNcIiwgXCJTXCJdLFxuICBcdHRpdGxlT2Zmc2V0ID0gMTAsXG4gIFx0dGl0bGUgPSAnTVFQIERhdGE6IFNvY2lhbCBNZWRpYSBvbiBIdW1hbiBTY2FsZXMnXG4gIH1cbikgPT4ge1xuICAvKlxuICAgICBDIFMgRCBBXG4gICovXG4gIGxldCB4U2NhbGUgPSBzY2FsZVBvaW50KCkuZG9tYWluKGF0dHJpYnV0ZXMpLnJhbmdlKFttYXJnaW4ubGVmdCwgd2lkdGggLSBtYXJnaW4ucmlnaHRdKS5wYWRkaW5nKDAuMylcbiAgbGV0IHlTY2FsZSA9IHNjYWxlTGluZWFyKCkuZG9tYWluKFswLDZdKS5yYW5nZShbaGVpZ2h0IC0gbWFyZ2luLmJvdHRvbSwgbWFyZ2luLnRvcF0pXG4gIGNvbnNvbGUubG9nKGRhdGEpXG4gIGRhdGEuc29ydCgoYSxiKSA9PiBPYmplY3Qua2V5cyhtZWRpYUNvbG9ycykuaW5kZXhPZihhLm1lZGlhKSAtIE9iamVjdC5rZXlzKG1lZGlhQ29sb3JzKS5pbmRleE9mKGIubWVkaWEpKSBcbiAgXG4gIHNlbGVjdGlvbi5jYWxsKGNyZWF0ZVJhZGFyQ2hhcnRBeGVzQW5kTGFiZWxzLCB7XG4gICAgeFNjYWxlLFxuICAgIHlTY2FsZSxcbiAgICBhdHRyaWJ1dGVzXG4gIH0pO1xuICBsZXQgc2hhcGVzID0gc2VsZWN0aW9uXG4gICAgLnNlbGVjdEFsbChcIi5zaGFwZXNcIilcbiAgICAuZGF0YShbbnVsbF0pXG4gIFx0LmpvaW4oJ2cnKVxuICBcdC5jbGFzc2VkKFwic2hhcGVzXCIsIHRydWUpXG4gIFxuICBsZXQgZ3JvdXBzID0gc2hhcGVzXG4gIFx0LnNlbGVjdEFsbChcIi5yYWRhci1zaGFwZVwiKVxuICBcdC5kYXRhKGRhdGEpXG4gIFx0LmpvaW4oXCJwYXRoXCIpXG4gIFx0LmNsYXNzZWQoXCJyYWRhci1zaGFwZVwiLCB0cnVlKVxuICAgIC5hdHRyKFwiZFwiLCAoZCkgPT4gZ2V0UGF0aFN0cmluZyhkLCB7YXR0cmlidXRlcywgeFNjYWxlLCB5U2NhbGV9KSlcbiAgICAuYXR0cihcInN0cm9rZVwiLCAoZCwgaSkgPT4gbWVkaWFDb2xvcnNbZC5tZWRpYV0pXG4gIFx0LmF0dHIoXCJkYXRhLW1lZGlhXCIsIChkKSA9PiBkLm1lZGlhKVxuICBcbiAgc2VsZWN0aW9uLmNhbGwoY3JlYXRlTGVnZW5kLCB7XG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIG1hcmdpbixcbiAgICBkYXRhLFxuICAgIGNvbG9yOiBtZWRpYUNvbG9yc1xuICB9KVxuICBcblx0c2VsZWN0aW9uLmNhbGwoY3JlYXRlSG92ZXJzLCB7IGdyb3VwcyB9KVxuICBcbiAgc2VsZWN0aW9uXG4gIFx0LnNlbGVjdEFsbCgnLnJhZGFyLXRpdGxlJylcbiAgXHQuZGF0YShbbnVsbF0pXG4gIFx0LmpvaW4oJ3RleHQnKVxuICBcdC5jbGFzc2VkKCdyYWRhci10aXRsZScsIHRydWUpXG4gIFx0LnRleHQodGl0bGUpXG4gIFx0LmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHt3aWR0aC8yfSwke3RpdGxlT2Zmc2V0fSlgKVxufVxuXG5jb25zdCBnZXRQYXRoU3RyaW5nID0gKG1lZGlhLCB7IGF0dHJpYnV0ZXMsIHhTY2FsZSwgeVNjYWxlIH0pID0+IHtcbiAgbGV0IGNvb3JkcyA9IFtdXG4gIGF0dHJpYnV0ZXMuZm9yRWFjaCgoZCkgPT4ge1xuICAgIGNvb3Jkcy5wdXNoKFt4U2NhbGUoZCksIHlTY2FsZShtZWRpYVtkXSldKVxuICB9KVxuICByZXR1cm4gbGluZSgpKGNvb3Jkcylcbn1cbiIsImNvbnN0IGNoZXZyb25QYXRoID1cbiAgJ00xMS4zNTQgMS42NDZhLjUuNSAwIDAgMSAwIC43MDhMNS43MDcgOGw1LjY0NyA1LjY0NmEuNS41IDAgMCAxLS43MDguNzA4bC02LTZhLjUuNSAwIDAgMSAwLS43MDhsNi02YS41LjUgMCAwIDEgLjcwOCAweic7XG5leHBvcnQgY29uc3QgYmFja0J1dHRvbiA9IChcbiAgc2VsZWN0aW9uLFxuICB7IGhlaWdodCwgc2V0U3RhdGUgfVxuKSA9PiB7XG4gIGxldCBncm91cCA9IHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy5iYWNrJylcbiAgICAuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ2cnKVxuICAgIC5jbGFzc2VkKCdiYWNrJywgdHJ1ZSlcbiAgICAuYXR0cihcbiAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgYHRyYW5zbGF0ZSgkezEwfSwgJHtoZWlnaHQgLSAyMH0pYFxuICAgIClcbiAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKGUsIGQpIHtcbiAgICAgIHNldFN0YXRlKChzdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoc3RhdGUubW9kZSAhPT0gJ1NVTU1BUlknKSB7XG4gICAgICAgIFx0bGV0IG1lbW9yeSA9IHN0YXRlLm1lbW9yeTtcbiAgICAgICAgICBtZW1vcnlbc3RhdGUubW9kZV0gPSB7XG4gICAgICAgICAgICBxdWVzdGlvblRhZzpcbiAgICAgICAgICAgICAgc3RhdGUuZGF0YS5jdXJyZW50RGF0YS5xdWVzdGlvblRhZ1xuICAgICAgICAgIH07XG4gICAgICAgICAgaWYgKHN0YXRlLm1vZGUgPT09ICdEVUFMJykge1xuICAgICAgICAgICAgbWVtb3J5W3N0YXRlLm1vZGVdLm1lZGlhcyA9XG4gICAgICAgICAgICAgIHN0YXRlLmRhdGEuY3VycmVudERhdGEubWVkaWE7XG4gICAgICAgICAgfSBlbHNlIGlmIChzdGF0ZS5tb2RlID09PSAnU0lOR0xFJykge1xuICAgICAgICAgICAgbWVtb3J5W3N0YXRlLm1vZGVdLm1lZGlhID1cbiAgICAgICAgICAgICAgc3RhdGUuZGF0YS5jdXJyZW50RGF0YS5tZWRpYTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLnN0YXRlLFxuICAgICAgICAgICAgbWVtb3J5OiBtZW1vcnksXG4gICAgICAgICAgICBtb2RlOiAnU0VMRUNUJyxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAuLi5zdGF0ZSxcbiAgICAgICAgICAgIG1vZGU6ICdTRUxFQ1QnLFxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIGdyb3VwXG4gICAgLnNlbGVjdEFsbCgnLmJhY2stcmVjdCcpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdyZWN0JylcbiAgICAuY2xhc3NlZCgnYmFjay1yZWN0JywgdHJ1ZSlcbiAgICAuYXR0cignd2lkdGgnLCAxMjApXG4gICAgLmF0dHIoJ2hlaWdodCcsIDE3KVxuICAgIC5hdHRyKCdyeCcsIDUpXG4gICAgLnN0eWxlKCdmaWxsJywgJ3doaXRlJylcbiAgICAuc3R5bGUoJ3N0cm9rZScsICdibGFjaycpXG4gICAgLnN0eWxlKCdzdHJva2Utd2lkdGgnLCAxKTtcblxuICBncm91cFxuICAgIC5zZWxlY3RBbGwoJy5iYWNrLWNoZXZyb24nKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbigncGF0aCcpXG4gICAgLmNsYXNzZWQoJ2JhY2stY2hldnJvbicsIHRydWUpXG4gICAgLmF0dHIoJ2QnLCBjaGV2cm9uUGF0aClcbiAgICAuYXR0cignZmlsbC1ydWxlJywgJ2V2ZW5vZGQnKTtcblxuICBncm91cFxuICAgIC5zZWxlY3RBbGwoJy5iYWNrLXRleHQnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbigndGV4dCcpXG4gICAgLmNsYXNzZWQoJ2JhY2stdGV4dCcsIHRydWUpXG4gICAgLnRleHQoJ1JldHVybiBIb21lJylcbiAgICAuYXR0cigneCcsIDIwKVxuICAgIC5hdHRyKCd5JywgMik7XG59O1xuIiwiaW1wb3J0IHsgcmFkYXJDaGFydCB9IGZyb20gJy4vcmFkYXJDaGFydCc7XG5pbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMyc7XG5pbXBvcnQgeyBiYWNrQnV0dG9uIH0gZnJvbSAnLi4vYmFja0J1dHRvbidcblxubGV0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodC0xMDtcbmxldCByZWFsV2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtMTA7XG5sZXQgd2lkdGggPSA0KmhlaWdodC8zXG5cbmV4cG9ydCBjb25zdCBjcmVhdGVSYWRhckNoYXJ0ID0gKGNvbnRhaW5lciwgZGF0YSwgc2V0U3RhdGUpID0+IHtcbiAgY29uc3Qgc3ZnID0gc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuc2VsZWN0QWxsKCdzdmcnKVxuICBcdC5kYXRhKFtudWxsXSlcbiAgXHQuam9pbignc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCByZWFsV2lkdGgpXG4gICAgLmF0dHIoJ2hlaWdodCcsIGhlaWdodClcbiAgY29uc3QgZ3JvdXBzID0gc3ZnXG4gIFx0LnNlbGVjdEFsbCgnZycpXG4gIFx0LmRhdGEoW251bGxdKVxuICBcdC5qb2luKCdnJylcbiAgXHQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyhyZWFsV2lkdGggLSB3aWR0aCkvMn0sICR7MH0pYClcbiAgXHQuY2xhc3NlZCgncmFkYXItc3ZnJywgdHJ1ZSk7XG4gIHJhZGFyQ2hhcnQoXG4gICAgZ3JvdXBzLFxuICAgIHsgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQgfVxuICApO1xuICBcbiBcdHN2Z1xuICAgIC5jYWxsKGJhY2tCdXR0b24sIHtcbiAgICBcdGhlaWdodCxcbiAgICAgIHNldFN0YXRlXG4gIFx0fSlcbiAgc3ZnXG4gIFx0LnNlbGVjdEFsbCgnLmRpc2NsYWltZXInKVxuICBcdC5kYXRhKFsnRElTQ0xBSU1FUjonLCBcbiAgICAgICAgICAgJ1RoZXNlIHNjYWxlcycsXG4gICAgICAgICAgICd3ZXJlIE5PVCcsIFxuICAgICAgICAgICAncHV0IHRocm91Z2gnLFxuICAgICAgICAgICAnRmFjdG9yIEFuYWx5c2lzLicsIFxuICAgICAgICAgICAnSSBjYW5ub3QgZW5zdXJlJywgXG4gICAgICAgICAgICdTY2llbnRpZmljJyxcbiAgICAgICAgICAgJ1ZhbGlkaXR5LicsIFxuICAgICAgICAgICAnVGhpcyB2aXogaXMgZm9yJywgXG4gICAgICAgICAgICdpbnNwaXJhdGlvbicsXG4gICAgICAgICAgICdwdXJwb3NlcyBvbmx5LiddKVxuICBcdC5qb2luKCd0ZXh0JylcbiAgXHQuY2xhc3NlZCgnZGlzY2xhaW1lcicsIHRydWUpXG4gIFx0LmF0dHIoJ3gnLCByZWFsV2lkdGgtMTUpXG4gIFx0LmF0dHIoJ3knLCAoZCxpKSA9PiAyODArKGkqMjApKVxuICBcdC50ZXh0KGQgPT4gZClcbiAgXHRcbn0iLCJpbXBvcnQgeyBjc3ZQYXJzZSB9IGZyb20gJ2QzJztcbmV4cG9ydCBjb25zdCBnZXRSYWRhckRhdGEgPSAoY3N2U3RyaW5nKSA9PiB7XG4gIGxldCBkYXRhID0gY3N2UGFyc2UoY3N2U3RyaW5nKTtcbiAgbGV0IGdyb3VwZWRCeU1lZGlhID0gZDMuZ3JvdXAoZGF0YSwgZCA9PiBkLm1lZGlhVGV4dCk7XG4gIGxldCBtZWRpYU9iamVjdCA9IFtdO1xuICBncm91cGVkQnlNZWRpYS5mb3JFYWNoKCAobWVkaWEpID0+IHtcbiAgICAgIGxldCBncm91cGVkQnlIdW1hbiA9IGQzLmdyb3VwKG1lZGlhLCBxID0+IHEuaHVtYW4pXG4gICAgICBsZXQgaHVtYW5NYXBwZWRUb01lYW5zID0ge307XG4gICAgICBncm91cGVkQnlIdW1hbi5mb3JFYWNoKHF1ZXN0aW9uc0Zvckh1bWFuID0+IHtcbiAgICAgICAgICBsZXQgcG9pbnRzID0gZXh0cmFjdFBvaW50c0Zyb21RdWVzdGlvbnMocXVlc3Rpb25zRm9ySHVtYW4pO1xuICAgICAgICAgIGh1bWFuTWFwcGVkVG9NZWFuc1txdWVzdGlvbnNGb3JIdW1hblswXS5odW1hbl09Ni1kMy5tZWFuKHBvaW50cylcbiAgICAgIH0pXG4gICAgICBodW1hbk1hcHBlZFRvTWVhbnNbXCJtZWRpYVwiXT1tZWRpYVswXS5tZWRpYVRleHRcbiAgICBtZWRpYU9iamVjdC5wdXNoKGh1bWFuTWFwcGVkVG9NZWFucylcbiAgfSlcbiAgcmV0dXJuIG1lZGlhT2JqZWN0XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RQb2ludHNGcm9tUXVlc3Rpb25zKHF1ZXN0aW9ucykge1xuICAgIGxldCBwb2ludHMgPSBbXTtcbiAgICBxdWVzdGlvbnMuZm9yRWFjaCgocXVlc3Rpb24pID0+IHtcbiAgICAgICAgc3dpdGNoIChxdWVzdGlvbi5yZXZlcnNlVGFnKSB7XG4gICAgICAgICAgICBjYXNlIFwicmV2ZXJzZVwiOlxuICAgICAgICAgICAgICAgIC8vIEV4LiA2IG5lZWRzIHRvIGJlIDEuIHAtMT01LCBtYXBwaW5nWzVdID0gMVxuICAgICAgICAgICAgICAgIGNvbnN0IG1hcHBpbmcgPSBbNiwgNSwgNCwgMywgMiwgMV07XG4gICAgICAgICAgICAgICAgY29uc3QgcmV2ZXJzZWQgPSBKU09OLnBhcnNlKHF1ZXN0aW9uLnBvaW50cykubWFwKHAgPT4gbWFwcGluZ1twIC0gMV0gfHwgcClcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChyZXZlcnNlZClcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJhZFwiOlxuICAgICAgICAgICAgICAgIC8vIDEgLSBObyBhZCwgMi03IFNUUiBBIC0gU1RSIEQuIE5lZWQgMS02IFNUUiBBIC0gU1RSIERcbiAgICAgICAgICAgICAgICBwb2ludHMucHVzaChKU09OLnBhcnNlKHF1ZXN0aW9uLnBvaW50cykuZmlsdGVyKHAgPT4gcCA+IDEpLm1hcChwID0+IHAgLSAxKSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJpbmZvXCI6XG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhxdWVzdGlvbi5wb2ludHMpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHBvaW50cy5wdXNoKEpTT04ucGFyc2UocXVlc3Rpb24ucG9pbnRzKSlcbiAgICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGQzLm1lcmdlKHBvaW50cylcbn0iLCJleHBvcnQgZnVuY3Rpb24gZ2V0U2NhbGUocXVlc3Rpb24pIHtcbiAgc3dpdGNoIChxdWVzdGlvbikge1xuICAgIGNhc2UgJ0MxJzpcbiAgICBjYXNlICdDMic6XG4gICAgY2FzZSAnQzMnOlxuICAgIGNhc2UgJ0M2JzpcbiAgICBjYXNlICdEMSc6XG4gICAgY2FzZSAnRDUnOlxuICAgIGNhc2UgJ0Q2JzpcbiAgICBjYXNlICdENyc6XG4gICAgY2FzZSAnRDgnOlxuICAgIGNhc2UgJ0EzJzpcbiAgICBjYXNlICdBNCc6XG4gICAgICByZXR1cm4ge1xuICAgICAgICB3YXJuaW5nOiBmYWxzZSxcbiAgICAgICAgbmFtZTogJ2ZyZXF1ZW5jeScsXG4gICAgICAgIHNjYWxlOiBmcmVxdWVuY3lTY2FsZSxcbiAgICAgIH07XG4gICAgY2FzZSAnQTInOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2FybmluZzogdHJ1ZSxcbiAgICAgICAgbmFtZTogJ2FkJyxcbiAgICAgICAgc2NhbGU6IGFkU2NhbGUsXG4gICAgICB9O1xuICAgIGNhc2UgJ0QzJzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHdhcm5pbmc6IHRydWUsXG4gICAgICAgIG5hbWU6ICd0eXBlJyxcbiAgICAgICAgc2NhbGU6IHR5cGVTY2FsZSxcbiAgICAgIH07XG4gICAgY2FzZSAnRDInOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2FybmluZzogdHJ1ZSxcbiAgICAgICAgbmFtZTogJ3RpbWUnLFxuICAgICAgICBzY2FsZTogdGltZVNjYWxlLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgd2FybmluZzogZmFsc2UsXG4gICAgICAgIG5hbWU6ICdhZ3JlZScsXG4gICAgICAgIHNjYWxlOiBhZ3JlZVNjYWxlLFxuICAgICAgfTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgYWdyZWVTY2FsZSA9IFtcbiAgJ1N0cm9uZ2x5IERpc2FncmVlJyxcbiAgJ0Rpc2FncmVlJyxcbiAgJ1NsaWdodGx5IERpc2FncmVlJyxcbiAgJ1NsaWdodGx5IEFncmVlJyxcbiAgJ0FncmVlJyxcbiAgJ1N0cm9uZ2x5IEFncmVlJyxcbl07XG5cbmV4cG9ydCBjb25zdCBmcmVxdWVuY3lTY2FsZSA9IFtcbiAgJ05ldmVyJyxcbiAgJ1ZlcnkgUmFyZWx5JyxcbiAgJ1JhcmVseScsXG4gICdPY2Nhc2lvbmFsbHknLFxuICAnRnJlcXVlbnRseScsXG4gICdWZXJ5IEZyZXF1ZW50bHknLFxuXTtcblxuZXhwb3J0IGNvbnN0IGFkU2NhbGUgPSBbXG4gICdObyBBZHMnLFxuICAnU3Ryb25nbHkgQWdyZWUnLFxuICAnQWdyZWUnLFxuICAnU2xpZ2h0bHkgQWdyZWUnLFxuICAnU2xpZ2h0bHkgRGlzYWdyZWUnLFxuICAnRGlzYWdyZWUnLFxuICAnU3Ryb25nbHkgRGlzYWdyZWUnLFxuXTtcbmV4cG9ydCBjb25zdCB0aW1lU2NhbGUgPSBbXG4gICc8MTAgTWluJyxcbiAgJ34zMCBNaW4nLFxuICAnfjEgSHInLFxuICAnPjEgSHInLFxuXTtcbmV4cG9ydCBjb25zdCB0eXBlU2NhbGUgPSBbXG4gICdWaWRlbycsXG4gICdJbWFnZScsXG4gICdUZXh0JyxcbiAgJ05vIFByaW9yaXR5Jyxcbl07XG4iLCJpbXBvcnQgeyBnZXRTY2FsZSB9IGZyb20gJy4uL3NjYWxlRGVmcy5qcydcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERpdmVyZ2luZ1NjYWxlRGF0YShieVF1ZXN0aW9uLCBxdWVzdGlvblRhZykge1xuICBsZXQge3dhcm5pbmcsIHNjYWxlfSA9IGdldFNjYWxlKHF1ZXN0aW9uVGFnKVxuICBjb25zdCBwb2ludHNNYXAgPSBkMy5yb2xsdXAoXG4gICAgYnlRdWVzdGlvbltxdWVzdGlvblRhZ10sXG4gICAgKHYpID0+IHtcbiAgICAgIGxldCBxID0gdlswXTtcbiAgICAgIGxldCBrZXlzID0gT2JqZWN0LmtleXMocS5jb3VudHMpO1xuICAgICAgbGV0IHBvaW50cyA9IFtdO1xuICAgICAgcG9pbnRzID0gc2NhbGUubWFwKCh0YWcpID0+XG4gICAgICAgIHEuY291bnRzW3RhZ10gPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gMFxuICAgICAgICAgIDogcS5jb3VudHNbdGFnXVxuICAgICAgKTtcbiAgICAgIHJldHVybiBwb2ludHM7XG4gICAgfSxcbiAgICAoZCkgPT4gZC5tZWRpYVRleHRcbiAgKTtcbiAgcmV0dXJuIHtcbiAgICBxdWVzdGlvblRhZzogcXVlc3Rpb25UYWcsXG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIHBvaW50c01hcDogcG9pbnRzTWFwLFxuICAgIHdhcm5pbmc6IHdhcm5pbmdcbiAgfTtcbn0iLCJsZXQgdG9tU2VsZWN0ZWQ7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVGl0bGUoc2VsZWN0aW9uLCB7IHF1ZXN0aW9uVGFnLCB0aXRsZXMsIHdpZHRoLCBtYXJnaW4sIG9uQ2hhbmdlLCB0aXRsZU9mZnNldCA9IDUwIH0pIHtcbiAgbGV0IHNlbGVjdCA9IHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy50aXRsZScpXG4gIGlmKHNlbGVjdC5zaXplKCkgPT09IDApe1xuICAgIGxldCBvcHRpb25zID0gT2JqZWN0LnZhbHVlcyh0aXRsZXMpLm1hcCggKHRpdGxlKSA9PiB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogdGl0bGUucXVlc3Rpb25UYWcsIHRleHQ6IHRpdGxlLnRpdGxlIH1cbiAgICB9KVxuICAgIHNlbGVjdFxuICAgICAgLmRhdGEoW251bGxdKVxuICAgICAgLmpvaW4oJ3NlbGVjdCcpXG4gICAgICAuY2xhc3NlZCgndGl0bGUnLCB0cnVlKVxuICAgICAgLnN0eWxlKFwid2lkdGhcIiwgd2lkdGggLSAxNSArICdweCcpXG4gICAgICAub24oJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpXG4gICAgICB9KVxuXG4gICAgdG9tU2VsZWN0ZWQgPSBuZXcgVG9tU2VsZWN0KFwiLnRpdGxlXCIse1xuICAgICAgb3B0aW9uczogb3B0aW9ucyxcbiAgICAgIGl0ZW1zOiBbcXVlc3Rpb25UYWddXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0XG4gICAgXHQub24oJ2NoYW5nZScsIChldmVudCkgPT4ge1xuICAgICAgICBvbkNoYW5nZShldmVudC50YXJnZXQudmFsdWUpXG4gICAgICB9KVxuICB9XG59IiwiaW1wb3J0IHtcbiAgc2VsZWN0LFxuICBzY2FsZUxpbmVhcixcbiAgc2NhbGVCYW5kLFxuICBheGlzTGVmdCxcbiAgYXhpc0JvdHRvbSxcbiAgc2NoZW1lUHVPciBhcyBjb2xvclNjaGVtZSxcbn0gZnJvbSAnZDMnO1xuXG5jb25zdCBjb2xvciA9IGNvbG9yU2NoZW1lWzZdO1xuXG5leHBvcnQgY29uc3QgZGl2ZXJnaW5nU2NhbGUgPSAoXG4gIHNlbGVjdGlvbixcbiAge1xuICAgIGRhdGEsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIG1hcmdpbixcbiAgICBxdWVzdGlvblRhZyxcbiAgICB0aXRsZXMsXG4gICAgeEF4aXNMYWJlbCxcbiAgICB5QXhpc0xhYmVsLFxuICAgIHNjYWxlLFxuICAgIHdhcm5pbmcsXG4gIH1cbikgPT4ge1xuICAvLyBDYWxjdWxhdGVcbiAgbGV0IGxpbmtlZERhdGEgPSBbXTtcbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgY29uc3QgdG90YWwgPSBkMy5zdW0odmFsdWUpO1xuICAgIGxpbmtlZERhdGEucHVzaCh7XG4gICAgICBtZWRpYToga2V5LFxuICAgICAgcG9pbnRzOiBjYWxjdWxhdGVCb3hlcyh2YWx1ZSwgdG90YWwpLFxuICAgIH0pO1xuICB9KTtcbiAgbGV0IHNvcnRlZExpbmtlZERhdGEgPSBsaW5rZWREYXRhLnNvcnQoXG4gICAgKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDIgKlxuICAgICAgICAgIChhLnBvaW50c1szXS5uICtcbiAgICAgICAgICAgIGEucG9pbnRzWzRdLm4gK1xuICAgICAgICAgICAgYS5wb2ludHNbNV0ubiA+XG4gICAgICAgICAgICBiLnBvaW50c1szXS5uICtcbiAgICAgICAgICAgICAgYi5wb2ludHNbNF0ubiArXG4gICAgICAgICAgICAgIGIucG9pbnRzWzVdLm4pIC1cbiAgICAgICAgMVxuICAgICAgKTsgLy8gdHJ1ZSAtIDEsIGZhbHNlIC0gMC4gMip0cnVlIC0gMSA9IDEsIDIqZmFsc2UgLSAxID0gLTFcbiAgICB9XG4gICk7XG4gIGxldCBzb3J0ZWRCb3hEYXRhID0gc29ydGVkTGlua2VkRGF0YS5tYXAoXG4gICAgKGQpID0+IGQucG9pbnRzXG4gICk7XG4gIGxldCBzb3J0ZWRNZWRpYURhdGEgPSBzb3J0ZWRMaW5rZWREYXRhLm1hcChcbiAgICAoZCkgPT4gZC5tZWRpYVxuICApO1xuICBjb25zdCBkYXRhTGVuZ3RoID0gc29ydGVkTGlua2VkRGF0YS5sZW5ndGg7XG5cbiAgY29uc3QgbWF4UG9zaXRpdmVQZXJjZW50YWdlID1cbiAgICBzb3J0ZWRCb3hEYXRhW2RhdGFMZW5ndGggLSAxXVszXS5uICtcbiAgICBzb3J0ZWRCb3hEYXRhW2RhdGFMZW5ndGggLSAxXVs0XS5uICtcbiAgICBzb3J0ZWRCb3hEYXRhW2RhdGFMZW5ndGggLSAxXVs1XS5uO1xuICBjb25zdCBtYXhOZWdhdGl2ZVBlcmNlbnRhZ2UgPVxuICAgIHNvcnRlZEJveERhdGFbMF1bMF0ubiArXG4gICAgc29ydGVkQm94RGF0YVswXVsxXS5uICtcbiAgICBzb3J0ZWRCb3hEYXRhWzBdWzJdLm47XG4gIFxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLnJhbmdlUm91bmQoW1xuICAgICAgbWFyZ2luLmxlZnQsXG4gICAgICB3aWR0aCAtIG1hcmdpbi5yaWdodCxcbiAgICBdKVxuICAgIC5kb21haW4oW1xuICAgICAgLTEgKiBtYXhOZWdhdGl2ZVBlcmNlbnRhZ2UsXG4gICAgICBtYXhQb3NpdGl2ZVBlcmNlbnRhZ2UsXG4gICAgXSlcbiAgICAubmljZSgpO1xuICBjb25zdCB5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgIC5yYW5nZShbaGVpZ2h0IC0gbWFyZ2luLmJvdHRvbSwgbWFyZ2luLnRvcF0pXG4gICAgLmRvbWFpbihBcnJheS5mcm9tKEFycmF5KGRhdGFMZW5ndGgpLmtleXMoKSkpXG4gICAgLnBhZGRpbmdJbm5lcigwLjMzKTtcblxuICAvLyBSZW5kZXJcbiAgc2VsZWN0aW9uLmNhbGwoY3JlYXRlTGVnZW5kLCB7XG4gICAgd2lkdGgsXG4gICAgbWFyZ2luLFxuICAgIHNjYWxlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeUF4aXNMYWJlbCxcbiAgfSk7XG4gIFxuICBpZiAoIXdhcm5pbmcpIHtcbiAgICBzZWxlY3Rpb24uY2FsbChjcmVhdGVCYXJzLCB7XG4gICAgICBkYXRhOiBzb3J0ZWRCb3hEYXRhLFxuICAgICAgeFNjYWxlLFxuICAgICAgeVNjYWxlLFxuICAgIH0pO1xuICAgIHNlbGVjdGlvbi5jYWxsKGNyZWF0ZUF4ZXMsIHtcbiAgICAgIGRhdGE6IHNvcnRlZE1lZGlhRGF0YSxcbiAgICAgIHhTY2FsZSxcbiAgICAgIHlTY2FsZSxcbiAgICAgIHhBeGlzTGFiZWwsXG4gICAgICB5QXhpc0xhYmVsLFxuICAgIH0pO1xuICAgIHNlbGVjdGlvbi5zZWxlY3RBbGwoJy53YXJuaW5nVGV4dCcpLnJlbW92ZSgpO1xuICB9IGVsc2Uge1xuICAgIHNlbGVjdGlvblxuICAgICAgLnNlbGVjdEFsbCgnLndhcm5pbmdUZXh0JylcbiAgICAgIC5kYXRhKFtcbiAgICAgICAgJ1RoaXMgcXVlc3Rpb24gaGFzIGEgZGlmZmVyZW50IHNjYWxlIHRoYW4gb3RoZXIgcXVlc3Rpb25zLCcsXG4gICAgICAgICdzbyBpdCByZXF1aXJlcyBhIGRpZmZlcmVudCB0eXBlIG9mIHN1bW1hcnkgdml6IScsXG4gICAgICAgICdIb3BlZnVsbHksIGNvbWluZyBzb29uIScsXG4gICAgICAgICdHbyB0byBTaW5nbGUgVmlldyBpZiB5b3UgYXJlIGN1cmlvdXMuJyxcbiAgICAgIF0pXG4gICAgICAuam9pbigndGV4dCcpXG4gICAgICAuY2xhc3NlZCgnd2FybmluZ1RleHQnLCB0cnVlKVxuICAgICAgLnRleHQoKGQpID0+IGQpXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3gnLFxuICAgICAgICBtYXJnaW4ubGVmdCArXG4gICAgICAgICAgKHdpZHRoIC0gbWFyZ2luLmxlZnQgLSBtYXJnaW4ucmlnaHQpIC8gMlxuICAgICAgKVxuICAgICAgLmF0dHIoXG4gICAgICAgICd5JyxcbiAgICAgICAgKGQsIGkpID0+XG4gICAgICAgICAgbWFyZ2luLnRvcCArXG4gICAgICAgICAgKGhlaWdodCAtIG1hcmdpbi50b3AgLSBtYXJnaW4uYm90dG9tKSAvXG4gICAgICAgICAgICAyIC1cbiAgICAgICAgICA0NSArXG4gICAgICAgICAgaSAqIDMwXG4gICAgICApXG4gICAgICAuc3R5bGUoJ3RleHQtYW5jaG9yJywgJ21pZGRsZScpO1xuXG4gICAgc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmJhcnMnKS5yZW1vdmUoKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlQmFycyhcbiAgc2VsZWN0aW9uLFxuICB7IGRhdGEsIHhTY2FsZSwgeVNjYWxlIH1cbikge1xuICBsZXQgdG9wR3JvdXAgPSBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcuYmFycycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgnYmFycycsIHRydWUpO1xuICB0b3BHcm91cFxuICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgIC5kYXRhKGRhdGEpXG4gICAgLmpvaW4oJ2cnKVxuICAgIC5jbGFzc2VkKCdiYXInLCB0cnVlKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwke3lTY2FsZShpKX0pYDtcbiAgICB9KVxuICAgIC5lYWNoKGZ1bmN0aW9uIChib3hlcywgaSkge1xuICAgICAgLy8gUGxhY2VcbiAgICAgIHNlbGVjdCh0aGlzKVxuICAgICAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgICAgLmRhdGEoYm94ZXMpXG4gICAgICAgIC5qb2luKCdyZWN0JylcbiAgICAgICAgLmNsYXNzZWQoJ3N1YmJhcicsIHRydWUpXG4gICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHhTY2FsZShkLnN0YXJ0KSlcbiAgICAgICAgLmF0dHIoXG4gICAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgICAoZCkgPT4geFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KVxuICAgICAgICApXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5U2NhbGUuYmFuZHdpZHRoKVxuICAgICAgICAuYXR0cignZmlsbCcsIChkLCBpKSA9PiBjb2xvcltpXSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF4ZXMoXG4gIHNlbGVjdGlvbixcbiAge1xuICAgIGRhdGEsXG4gICAgeFNjYWxlLFxuICAgIHlTY2FsZSxcbiAgICB4QXhpc0xhYmVsLFxuICAgIHlBeGlzTGFiZWwsXG4gICAgeEF4aXNMYWJlbE9mZnNldCA9IDQ1LFxuICAgIHlBeGlzTGFiZWxPZmZzZXQgPSA2NSxcbiAgfVxuKSB7XG4gIHlTY2FsZSA9IHlTY2FsZS5kb21haW4oZGF0YSk7XG4gIGNvbnN0IHlBeGlzID0gYXhpc0xlZnQoeVNjYWxlKTtcbiAgc2VsZWN0aW9uXG4gICAgLnNlbGVjdEFsbCgnLnktQXhpcycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgneS1BeGlzJywgdHJ1ZSlcbiAgICAuYXR0cihcbiAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlLnJhbmdlKClbMF0gKyAnLDApJ1xuICAgIClcbiAgICAuY2FsbCh5QXhpcyk7XG5cbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSk7XG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy54LUF4aXMnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignZycpXG4gICAgLmNsYXNzZWQoJ3gtQXhpcycsIHRydWUpXG4gICAgLmF0dHIoXG4gICAgICAndHJhbnNmb3JtJyxcbiAgICAgICd0cmFuc2xhdGUoMCwnICsgeVNjYWxlLnJhbmdlKClbMF0gKyAnKSdcbiAgICApXG4gICAgLmNhbGwoeEF4aXMpO1xuXG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy55QXhpc0xhYmVsJylcbiAgICAuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ3RleHQnKVxuICAgIC5jbGFzc2VkKCd5QXhpc0xhYmVsJywgdHJ1ZSlcbiAgICAudGV4dCh5QXhpc0xhYmVsKVxuICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC05MCknKVxuICAgIC5hdHRyKFxuICAgICAgJ3knLFxuICAgICAgeFNjYWxlLnJhbmdlKClbMF0gLSB5QXhpc0xhYmVsT2Zmc2V0XG4gICAgKVxuICAgIC5hdHRyKFxuICAgICAgJ3gnLFxuICAgICAgLSh5U2NhbGUucmFuZ2UoKVswXSArIHlTY2FsZS5yYW5nZSgpWzFdKSAvIDJcbiAgICApO1xuXG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy54QXhpc0xhYmVsJylcbiAgICAuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ3RleHQnKVxuICAgIC5jbGFzc2VkKCd4QXhpc0xhYmVsJywgdHJ1ZSlcbiAgICAudGV4dCh4QXhpc0xhYmVsKVxuICAgIC5hdHRyKCd0ZXh0LWFuY2hvcicsICdtaWRkbGUnKVxuICAgIC5hdHRyKFxuICAgICAgJ3gnLFxuICAgICAgKHhTY2FsZS5yYW5nZSgpWzBdICsgeFNjYWxlLnJhbmdlKClbMV0pIC8gMlxuICAgIClcbiAgICAuYXR0cihcbiAgICAgICd5JyxcbiAgICAgIHlTY2FsZS5yYW5nZSgpWzBdICsgeEF4aXNMYWJlbE9mZnNldFxuICAgICk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxlZ2VuZChcbiAgc2VsZWN0aW9uLFxuICB7XG4gICAgd2lkdGgsXG4gICAgbWFyZ2luLFxuICAgIHNjYWxlLFxuICAgIGxlZ2VuZE9mZnNldCA9IDM1LFxuICAgIHRpdGxlT2Zmc2V0ID0gMTUsXG4gIH1cbikge1xuICAvLyBMZWdlbmRcbiAgbGV0IHRvcEdyb3VwID0gc2VsZWN0aW9uXG4gICAgLnNlbGVjdEFsbCgnLmxlZ2VuZCcpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgnbGVnZW5kJywgdHJ1ZSlcbiAgICAuYXR0cihcbiAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgYHRyYW5zbGF0ZSgkezB9LCAke1xuICAgICAgICBtYXJnaW4udG9wIC0gbGVnZW5kT2Zmc2V0XG4gICAgICB9KWBcbiAgICApO1xuICBsZXQgYmluZGVkID0gdG9wR3JvdXBcbiAgICAuc2VsZWN0QWxsKCcubGVnZW5kLWl0ZW0nKVxuICAgIC5kYXRhKHNjYWxlLCAoZCwgaSkgPT4gZCk7XG4gIGJpbmRlZC5leGl0KCkucmVtb3ZlKCk7XG4gIGJpbmRlZFxuICAgIC5lbnRlcigpXG4gICAgLmFwcGVuZCgnZycpXG4gICAgLmNsYXNzZWQoJ2xlZ2VuZC1pdGVtJywgdHJ1ZSlcbiAgICAuYXR0cignZGF0YS1sYWJlbCcsIChkKSA9PiBkKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCBmdW5jdGlvbiAoZCwgaSkge1xuICAgICAgbGV0IGN1bUxlbmd0aCA9IHNjYWxlXG4gICAgICAgIC5zbGljZSgwLCBpKVxuICAgICAgICAucmVkdWNlKChhY2MsIGVsKSA9PiBhY2MgKyBlbC5sZW5ndGgsIDApO1xuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoJHtcbiAgICAgICAgNDAgKiBpICsgOCAqIGN1bUxlbmd0aFxuICAgICAgfSwgMClgO1xuICAgIH0pXG4gICAgLmNhbGwoKGcpID0+XG4gICAgICBnXG4gICAgICAgIC5hcHBlbmQoJ3RleHQnKVxuICAgICAgICAudGV4dCgoZCkgPT4gZClcbiAgICAgICAgLmF0dHIoJ3knLCAxMilcbiAgICAgICAgLmF0dHIoJ3gnLCAyNSlcbiAgICAgICAgLnN0eWxlKCdmb250LXNpemUnLCAnMC42ZW0nKVxuICAgIClcbiAgICAuY2FsbCgoZykgPT5cbiAgICAgIGdcbiAgICAgICAgLmFwcGVuZCgncmVjdCcpXG4gICAgICAgIC5hdHRyKCd3aWR0aCcsIDE1KVxuICAgICAgICAuYXR0cignaGVpZ2h0JywgMTUpXG4gICAgICAgIC5zdHlsZSgnZmlsbCcsIChkLCBpKSA9PiBjb2xvcltpXSlcbiAgICApO1xuICBsZXQgbGVnZW5kV2lkdGggPSB0b3BHcm91cFxuICAgIC5ub2RlKClcbiAgICAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gIHRvcEdyb3VwLmF0dHIoXG4gICAgJ3RyYW5zZm9ybScsXG4gICAgYHRyYW5zbGF0ZSgkeyh3aWR0aCAtIGxlZ2VuZFdpZHRoKSAvIDJ9LCAke1xuICAgICAgbWFyZ2luLnRvcCAtIGxlZ2VuZE9mZnNldFxuICAgIH0pYFxuICApO1xufVxuXG5mdW5jdGlvbiBjYWxjdWxhdGVCb3hlcyhhcnIsIHRvdGFsKSB7XG4gIGxldCBwZXJjZW50cyA9IHt9O1xuICBhcnIuZm9yRWFjaCgoZCwgaikgPT4ge1xuICAgIHBlcmNlbnRzW2pdID0gKGQgKiAxMDApIC8gdG90YWw7XG4gIH0pO1xuXG4gIGxldCBib3hlcyA9IFtdO1xuICAvLyBzdGFydCB3aWxsIGJlIGRpc2FncmVlczogMCwgMSwgMlxuICB2YXIgc3RhcnQgPVxuICAgIC0xICpcbiAgICAocGVyY2VudHNbMF0gKyBwZXJjZW50c1sxXSArIHBlcmNlbnRzWzJdKTtcbiAgWzAsIDEsIDIsIDMsIDQsIDVdLmZvckVhY2goZnVuY3Rpb24gKHZhbCkge1xuICAgIGJveGVzW3ZhbF0gPSB7XG4gICAgICBpZHg6IHZhbCxcbiAgICAgIHN0YXJ0OiBzdGFydCxcbiAgICAgIGVuZDogKHN0YXJ0ICs9IHBlcmNlbnRzW3ZhbF0pLFxuICAgICAgbjogcGVyY2VudHNbdmFsXSxcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIGJveGVzO1xufVxuIiwiaW1wb3J0IHsgZ2V0RGl2ZXJnaW5nU2NhbGVEYXRhIH0gZnJvbSAnLi9nZXREaXZlcmdpbmdTY2FsZURhdGEnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgY3JlYXRlVGl0bGUgfSBmcm9tICcuLi9zZWxlY3RhYmxlVGl0bGUnO1xuaW1wb3J0IHsgZGl2ZXJnaW5nU2NhbGUgfSBmcm9tICcuL2RpdmVyZ2luZ1NjYWxlJztcbmltcG9ydCB7IGJhY2tCdXR0b24gfSBmcm9tICcuLi9iYWNrQnV0dG9uJ1xuXG5jb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMCAtIDY1O1xuY29uc3Qgd2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAtIDEwO1xuY29uc3QgbWFyZ2luID0ge1xuICAgIHRvcDogNDAsXG4gICAgYm90dG9tOiA1MCxcbiAgICBsZWZ0OiA5NSxcbiAgICByaWdodDogMzAsXG4gIH1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZURpdmVyZ2luZ1NjYWxlKGNvbnRhaW5lciwgZGF0YSwgc2V0U3RhdGUpIHtcbiAgY29uc3Qgc3ZnID0gc2VsZWN0KGNvbnRhaW5lcilcbiAgICAuc2VsZWN0QWxsKCdzdmcnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignc3ZnJylcbiAgICAuYXR0cignd2lkdGgnLCB3aWR0aClcbiAgICAuYXR0cignaGVpZ2h0JywgaGVpZ2h0KTtcbiAgXG5cdHNlbGVjdChjb250YWluZXIpLmNhbGwoY3JlYXRlVGl0bGUsIHsgXG4gICAgcXVlc3Rpb25UYWc6IGRhdGEuY3VycmVudERhdGEucXVlc3Rpb25UYWcsIFxuICAgIHRpdGxlczogZGF0YS50aXRsZXMsIFxuICAgIHdpZHRoLCBcbiAgICBtYXJnaW4sXG4gICAgb25DaGFuZ2U6IChxVGFnKSA9PiB7XG4gICAgICBsZXQgY3VycmVudERhdGEgPSBnZXREaXZlcmdpbmdTY2FsZURhdGEoZGF0YS50b3RhbERhdGEsIHFUYWcpXG4gICAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhOiB7IC4uLmRhdGEsXG4gICAgICAgICAgICAgICBjdXJyZW50RGF0YTogY3VycmVudERhdGEgfSxcbiAgICAgIH0pKTtcbiAgfX0pXG4gIHN2Zy5jYWxsKGRpdmVyZ2luZ1NjYWxlLCB7XG4gICAgZGF0YTogZGF0YS5jdXJyZW50RGF0YS5wb2ludHNNYXAsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIG1hcmdpbixcbiAgICBxdWVzdGlvblRhZzogZGF0YS5jdXJyZW50RGF0YS5xdWVzdGlvblRhZyxcbiAgICB0aXRsZXM6IGRhdGEudGl0bGVzLFxuICAgIHhBeGlzTGFiZWw6ICdQZXJjZW50YWdlIG9mIFJlc3BvbnNlcyAoJSknLFxuICAgIHlBeGlzTGFiZWw6ICdTb2NpYWwgTWVkaWEgTmFtZXMnLFxuICAgIHNjYWxlOiBkYXRhLmN1cnJlbnREYXRhLnNjYWxlLFxuICAgIHdhcm5pbmc6IGRhdGEuY3VycmVudERhdGEud2FybmluZ1xuICB9KVxuICAucmFpc2UoKTtcbiAgXG4gIHN2Z1xuICAgIC5jYWxsKGJhY2tCdXR0b24sIHtcbiAgICBcdGhlaWdodCxcbiAgICAgIHNldFN0YXRlXG4gIFx0fSlcbn0iLCJpbXBvcnQgeyBnZXRTY2FsZSwgYWdyZWVTY2FsZSwgZnJlcXVlbmN5U2NhbGUgfSBmcm9tICcuLi9zY2FsZURlZnMuanMnXG5jb25zdCBEVUFMX01PREUgPSB0cnVlO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVhbERpdmVyZ2luZ1NjYWxlRGF0YShieVF1ZXN0aW9uLCBxdWVzdGlvblRhZywgZHVhbE1vZGVNZWRpYSkge1xuICBsZXQgdGhlc2VRdWVzdGlvbnMgPSB7IC4uLmJ5UXVlc3Rpb24gfTtcbiAgaWYoRFVBTF9NT0RFKSB7XG4gICAgZm9yIChsZXQgcXVlc3Rpb24gaW4gdGhlc2VRdWVzdGlvbnMpe1xuICAgIFx0dGhlc2VRdWVzdGlvbnNbcXVlc3Rpb25dID0gdGhlc2VRdWVzdGlvbnNbcXVlc3Rpb25dLmZpbHRlcigoZCkgPT4ge1xuICAgICAgICByZXR1cm4gZHVhbE1vZGVNZWRpYS5pbmNsdWRlcyhkLm1lZGlhVGV4dClcbiAgICAgIH0pXG4gICAgfVxuICB9XG4gIGxldCB7IHdhcm5pbmcsIHNjYWxlIH0gPSBnZXRTY2FsZShxdWVzdGlvblRhZylcbiAgY29uc3QgcG9pbnRzTWFwID0gZDMucm9sbHVwKFxuICAgIHRoZXNlUXVlc3Rpb25zW3F1ZXN0aW9uVGFnXSxcbiAgICAodikgPT4ge1xuICAgICAgbGV0IHEgPSB2WzBdO1xuICAgICAgbGV0IGtleXMgPSBPYmplY3Qua2V5cyhxLmNvdW50cyk7XG4gICAgICBsZXQgcG9pbnRzID0gW107XG4gICAgICBwb2ludHMgPSBzY2FsZS5tYXAoKHRhZykgPT5cbiAgICAgICAgcS5jb3VudHNbdGFnXSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyAwXG4gICAgICAgICAgOiBxLmNvdW50c1t0YWddXG4gICAgICApO1xuICAgICAgcmV0dXJuIHBvaW50cztcbiAgICB9LFxuICAgIChkKSA9PiBkLm1lZGlhVGV4dFxuICApO1xuICByZXR1cm4ge1xuICAgIHF1ZXN0aW9uVGFnOiBxdWVzdGlvblRhZyxcbiAgICBzY2FsZTogc2NhbGUsXG4gICAgcG9pbnRzTWFwOiBwb2ludHNNYXAsXG4gICAgbWVkaWE6IGR1YWxNb2RlTWVkaWEsXG4gICAgd2FybmluZzogd2FybmluZ1xuICB9O1xufSIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgc2NhbGVMaW5lYXIsXG4gIHNjYWxlQmFuZCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIHNjaGVtZVB1T3IgYXMgY29sb3JTY2hlbWUsXG59IGZyb20gJ2QzJztcbmltcG9ydCB7IGNyZWF0ZVRpdGxlIH0gZnJvbSAnLi4vc2VsZWN0YWJsZVRpdGxlJztcblxuY29uc3QgY29sb3IgPSBjb2xvclNjaGVtZVs2XS5yZXZlcnNlKCk7XG5cbmV4cG9ydCBjb25zdCBkdWFsRGl2ZXJnaW5nU2NhbGUgPSAoXG4gIGNvbnRhaW5lcixcbiAge1xuICAgIGRhdGEsXG4gICAgcXVlc3Rpb25UYWcsXG4gICAgc2NhbGUsXG4gICAgdGl0bGVzLFxuICAgIGN1cnJlbnRNZWRpYSxcbiAgICBtZWRpYUxpc3QsXG4gICAgd2lkdGgsXG4gICAgaGVpZ2h0LFxuICAgIG1hcmdpbixcbiAgICB4QXhpc0xhYmVsLFxuICAgIHlBeGlzTGFiZWwsXG4gICAgdGl0bGVIZWlnaHQsXG4gICAgeUF4aXNXaWR0aCxcbiAgICBvbllBeGlzQ2hhbmdlLFxuICAgIHdhcm5pbmcsXG4gIH1cbikgPT4ge1xuICBjb25zdCBzZWxlY3Rpb24gPSBjb250YWluZXJcbiAgICAuc2VsZWN0QWxsKCdzdmcnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignc3ZnJylcbiAgICAuY2xhc3NlZCgnZ3JhcGgnLCB0cnVlKVxuICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpXG4gICAgLnN0eWxlKCd0b3AnLCB0aXRsZUhlaWdodCArICdweCcpXG4gICAgLnN0eWxlKCdsZWZ0JywgeUF4aXNXaWR0aCArICdweCcpO1xuXG4gIC8vIENhbGN1bGF0ZVxuICBsZXQgbGlua2VkRGF0YSA9IFtdO1xuICBkYXRhLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICBjb25zdCB0b3RhbCA9IGQzLnN1bSh2YWx1ZSk7XG4gICAgbGlua2VkRGF0YS5wdXNoKHtcbiAgICAgIG1lZGlhOiBrZXksXG4gICAgICBwb2ludHM6IGNhbGN1bGF0ZUJveGVzKHZhbHVlLCB0b3RhbCksXG4gICAgfSk7XG4gIH0pO1xuICBsZXQgc29ydGVkTGlua2VkRGF0YSA9IGxpbmtlZERhdGEuc29ydChcbiAgICAoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgY3VycmVudE1lZGlhLmluZGV4T2YoYS5tZWRpYSkgLVxuICAgICAgICBjdXJyZW50TWVkaWEuaW5kZXhPZihiLm1lZGlhKVxuICAgICAgKTtcbiAgICB9XG4gICk7XG4gIGxldCBzb3J0ZWRCb3hEYXRhID0gc29ydGVkTGlua2VkRGF0YS5tYXAoXG4gICAgKGQpID0+IGQucG9pbnRzXG4gICk7XG4gIGxldCBzb3J0ZWRNZWRpYURhdGEgPSBzb3J0ZWRMaW5rZWREYXRhLm1hcChcbiAgICAoZCkgPT4gZC5tZWRpYVxuICApO1xuICBjb25zdCBkYXRhTGVuZ3RoID0gc29ydGVkTGlua2VkRGF0YS5sZW5ndGg7XG5cbiAgLy8gUmVuZGVyXG4gIGNvbnN0IG1heFBvc2l0aXZlUGVyY2VudGFnZSA9IDEwMDtcbiAgY29uc3QgbWF4TmVnYXRpdmVQZXJjZW50YWdlID0gMTAwO1xuICBjb25zdCB4U2NhbGUgPSBzY2FsZUxpbmVhcigpXG4gICAgLnJhbmdlUm91bmQoW1xuICAgICAgbWFyZ2luLmxlZnQsXG4gICAgICB3aWR0aCAtIG1hcmdpbi5yaWdodCxcbiAgICBdKVxuICAgIC5kb21haW4oW1xuICAgICAgLTEgKiBtYXhOZWdhdGl2ZVBlcmNlbnRhZ2UsXG4gICAgICBtYXhQb3NpdGl2ZVBlcmNlbnRhZ2UsXG4gICAgXSlcbiAgICAubmljZSgpO1xuICBjb25zdCB5U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgIC5yYW5nZShbaGVpZ2h0IC0gbWFyZ2luLmJvdHRvbSwgbWFyZ2luLnRvcF0pXG4gICAgLmRvbWFpbihBcnJheS5mcm9tKEFycmF5KGRhdGFMZW5ndGgpLmtleXMoKSkpXG4gICAgLnBhZGRpbmdJbm5lcigwLjIpXG4gICAgLnBhZGRpbmdPdXRlcigwLjE1KTtcbiAgXG4gIHNlbGVjdGlvbi5jYWxsKGNyZWF0ZUxlZ2VuZCwge1xuICAgIHdpZHRoLFxuICAgIG1hcmdpbixcbiAgICBzY2FsZSxcbiAgICB4QXhpc0xhYmVsLFxuICAgIHlBeGlzTGFiZWwsXG4gIH0pO1xuXG4gIGlmICghd2FybmluZykge1xuICAgIHNlbGVjdGlvbi5jYWxsKGNyZWF0ZUJhcnMsIHtcbiAgICAgIGRhdGE6IHNvcnRlZEJveERhdGEsXG4gICAgICB4U2NhbGUsXG4gICAgICB5U2NhbGUsXG4gICAgfSk7XG4gICAgXG4gICAgc2VsZWN0aW9uLnNlbGVjdEFsbCgnLndhcm5pbmdUZXh0JykucmVtb3ZlKCk7XG4gIH0gZWxzZSB7XG4gICAgc2VsZWN0aW9uXG4gICAgICAuc2VsZWN0QWxsKCcud2FybmluZ1RleHQnKVxuICAgICAgLmRhdGEoW1xuICAgICAgICAnVGhpcyBxdWVzdGlvbiBoYXMgYSBkaWZmZXJlbnQgc2NhbGUgdGhhbiBvdGhlciBxdWVzdGlvbnMsJyxcbiAgICAgICAgJ3NvIGl0IHJlcXVpcmVzIGEgZGlmZmVyZW50IHR5cGUgb2Ygc3VtbWFyeSB2aXohJyxcbiAgICAgIFx0J0hvcGVmdWxseSwgY29taW5nIHNvb24hJyxcbiAgICAgICAgJ0dvIHRvIFNpbmdsZSBWaWV3IGlmIHlvdSBhcmUgY3VyaW91cy4nLFxuICAgICAgXSlcbiAgICAgIC5qb2luKCd0ZXh0JylcbiAgICAgIC5jbGFzc2VkKCd3YXJuaW5nVGV4dCcsIHRydWUpXG4gICAgICAudGV4dCgoZCkgPT4gZClcbiAgICAgIC5hdHRyKFxuICAgICAgICAneCcsXG4gICAgICAgIG1hcmdpbi5sZWZ0ICtcbiAgICAgICAgICAod2lkdGggLSBtYXJnaW4ubGVmdCAtIG1hcmdpbi5yaWdodCkgLyAyXG4gICAgICApXG4gICAgICAuYXR0cihcbiAgICAgICAgJ3knLFxuICAgICAgICAoZCwgaSkgPT5cbiAgICAgICAgICBtYXJnaW4udG9wICtcbiAgICAgICAgICAoaGVpZ2h0IC0gbWFyZ2luLnRvcCAtIG1hcmdpbi5ib3R0b20pIC9cbiAgICAgICAgICAgIDIgLVxuICAgICAgICAgIDQ1ICtcbiAgICAgICAgICBpICogMzBcbiAgICAgIClcbiAgICAgIC5zdHlsZSgndGV4dC1hbmNob3InLCAnbWlkZGxlJyk7XG4gICAgXG4gICAgc2VsZWN0aW9uLnNlbGVjdEFsbCgnLmJhcnMnKS5yZW1vdmUoKTtcbiAgfVxuXG4gIGNvbnRhaW5lci5jYWxsKGNyZWF0ZUF4ZXMsIHtcbiAgICBzZWxlY3Rpb24sXG4gICAgZGF0YTogc29ydGVkTWVkaWFEYXRhLFxuICAgIG1lZGlhTGlzdCxcbiAgICB4U2NhbGUsXG4gICAgeVNjYWxlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeUF4aXNMYWJlbCxcbiAgICB5QXhpc1dpZHRoLFxuICAgIHRpdGxlSGVpZ2h0LFxuICAgIG9uWUF4aXNDaGFuZ2UsXG4gIH0pO1xufTtcblxuZnVuY3Rpb24gY3JlYXRlQmFycyhcbiAgc2VsZWN0aW9uLFxuICB7IGRhdGEsIHhTY2FsZSwgeVNjYWxlIH1cbikge1xuICBsZXQgdG9wR3JvdXAgPSBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcuYmFycycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgnYmFycycsIHRydWUpO1xuICB0b3BHcm91cFxuICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgIC5kYXRhKGRhdGEpXG4gICAgLmpvaW4oJ2cnKVxuICAgIC5jbGFzc2VkKCdiYXInLCB0cnVlKVxuICAgIC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4ge1xuICAgICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwke3lTY2FsZShpKX0pYDtcbiAgICB9KVxuICAgIC5lYWNoKGZ1bmN0aW9uIChib3hlcywgaSkge1xuICAgICAgLy8gUGxhY2VcbiAgICAgIHNlbGVjdCh0aGlzKVxuICAgICAgICAuc2VsZWN0QWxsKCdyZWN0JylcbiAgICAgICAgLmRhdGEoYm94ZXMpXG4gICAgICAgIC5qb2luKCdyZWN0JylcbiAgICAgICAgLmNsYXNzZWQoJ3N1YmJhcicsIHRydWUpXG4gICAgICAgIC5hdHRyKCd4JywgKGQpID0+IHhTY2FsZShkLnN0YXJ0KSlcbiAgICAgICAgLmF0dHIoXG4gICAgICAgICAgJ3dpZHRoJyxcbiAgICAgICAgICAoZCkgPT4geFNjYWxlKGQuZW5kKSAtIHhTY2FsZShkLnN0YXJ0KVxuICAgICAgICApXG4gICAgICAgIC5hdHRyKCdoZWlnaHQnLCB5U2NhbGUuYmFuZHdpZHRoKVxuICAgICAgICAuYXR0cignZmlsbCcsIChkLCBpKSA9PiBjb2xvcltpXSk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUF4ZXMoXG4gIGNvbnRhaW5lcixcbiAge1xuICAgIHNlbGVjdGlvbixcbiAgICBkYXRhLCAvLyB0aGUgY3VycmVudCBtZWRpYVxuICAgIG1lZGlhTGlzdCwgLy8gYWxsIHRoZSBtZWRpYVxuICAgIHhTY2FsZSxcbiAgICB5U2NhbGUsXG4gICAgeEF4aXNMYWJlbCxcbiAgICB5QXhpc0xhYmVsLFxuICAgIHhBeGlzTGFiZWxPZmZzZXQgPSA0NSxcbiAgICB5QXhpc0xhYmVsT2Zmc2V0ID0gNSxcbiAgICB5QXhpc1dpZHRoLFxuICAgIHRpdGxlSGVpZ2h0LFxuICAgIG9uWUF4aXNDaGFuZ2UsXG4gIH1cbikge1xuICB5U2NhbGUgPSB5U2NhbGUuZG9tYWluKGRhdGEpO1xuICBjb25zdCB5QXhpcyA9IGF4aXNMZWZ0KHlTY2FsZSk7XG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy55QXhpcycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgneUF4aXMnLCB0cnVlKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAndHJhbnNsYXRlKCcgKyB4U2NhbGUucmFuZ2UoKVswXSArICcsMCknXG4gICAgKVxuICAgIC5jYWxsKHlBeGlzKTtcbiAgc2VsZWN0aW9uXG4gICAgLnNlbGVjdEFsbCgnLnlBeGlzJylcbiAgICAuc2VsZWN0QWxsKCd0ZXh0JylcbiAgICAucmVtb3ZlKCk7XG5cbiAgbGV0IHRvcFNlbGVjdCA9IGNvbnRhaW5lclxuICAgIC5zZWxlY3RBbGwoJy55QXhpc0xhYmVsJylcbiAgICAuZGF0YShkYXRhKVxuICAgIC5qb2luKCdzZWxlY3QnKVxuICAgIC5jbGFzc2VkKCd5QXhpc0xhYmVsJywgdHJ1ZSlcbiAgICAuc3R5bGUoJ3dpZHRoJywgeUF4aXNXaWR0aCAtIDEwICsgJ3B4JylcbiAgICAuc3R5bGUoJ3RvcCcsIChkLCBpKSA9PiB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICB0aXRsZUhlaWdodCArXG4gICAgICAgIHlTY2FsZShkKSArXG4gICAgICAgIHlTY2FsZS5iYW5kd2lkdGgoKSAvIDIgLVxuICAgICAgICAxMCArXG4gICAgICAgICdweCdcbiAgICAgICk7XG4gICAgfSlcbiAgICAuc3R5bGUoJ2xlZnQnLCB5QXhpc0xhYmVsT2Zmc2V0ICsgJ3B4JylcbiAgICAuc3R5bGUoJ3Bvc3Rpb24nLCAnYWJzb2x1dGUnKVxuICAgIC5hdHRyKCdkYXRhLWluZGV4JywgKGQsIGkpID0+IGkpXG4gICAgLm9uKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIG9uWUF4aXNDaGFuZ2UoXG4gICAgICAgIGV2ZW50LnRhcmdldC52YWx1ZSxcbiAgICAgICAgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1pbmRleCcpXG4gICAgICApO1xuICAgIH0pO1xuICB0b3BTZWxlY3QuZWFjaChmdW5jdGlvbiAobWVkaWEsIGkpIHtcbiAgICBsZXQgbmV3TWVkaWFMaXN0ID0gbWVkaWFMaXN0LmZpbHRlcigobSkgPT4ge1xuICAgICAgcmV0dXJuIG1lZGlhID09PSBtIHx8ICFkYXRhLmluY2x1ZGVzKG0pO1xuICAgIH0pO1xuICAgIHNlbGVjdCh0aGlzKVxuICAgICAgLnNlbGVjdEFsbCgnLnNlbGVjdE9wdGlvbnMnKVxuICAgICAgLmRhdGEobmV3TWVkaWFMaXN0KVxuICAgICAgLmpvaW4oJ29wdGlvbicpXG4gICAgICAuY2xhc3NlZCgnc2VsZWN0T3B0aW9ucycsIHRydWUpXG4gICAgICAuYXR0cigndmFsdWUnLCAoZCkgPT4gZClcbiAgICAgIC50ZXh0KChkKSA9PiBkKTtcbiAgfSk7XG4gIHRvcFNlbGVjdC5lYWNoKGZ1bmN0aW9uIChtZWRpYSwgaSkge1xuICAgIHNlbGVjdCh0aGlzKVxuICAgICAgLnNlbGVjdChcIm9wdGlvblt2YWx1ZT0nXCIgKyBtZWRpYSArIFwiJ11cIilcbiAgICAgIC5wcm9wZXJ0eSgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgfSk7XG5cbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSk7XG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy54QXhpcycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgneEF4aXMnLCB0cnVlKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAndHJhbnNsYXRlKDAsJyArIHlTY2FsZS5yYW5nZSgpWzBdICsgJyknXG4gICAgKVxuICAgIC5jYWxsKHhBeGlzKTtcblxuICBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcueEF4aXNMYWJlbCcpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCd0ZXh0JylcbiAgICAuY2xhc3NlZCgneEF4aXNMYWJlbCcsIHRydWUpXG4gICAgLnRleHQoeEF4aXNMYWJlbClcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAuYXR0cihcbiAgICAgICd4JyxcbiAgICAgICh4U2NhbGUucmFuZ2UoKVswXSArIHhTY2FsZS5yYW5nZSgpWzFdKSAvIDJcbiAgICApXG4gICAgLmF0dHIoXG4gICAgICAneScsXG4gICAgICB5U2NhbGUucmFuZ2UoKVswXSArIHhBeGlzTGFiZWxPZmZzZXRcbiAgICApO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMZWdlbmQoXG4gIHNlbGVjdGlvbixcbiAge1xuICAgIHdpZHRoLFxuICAgIG1hcmdpbixcbiAgICBzY2FsZSxcbiAgICBsZWdlbmRPZmZzZXQgPSAzNSxcbiAgICB0aXRsZU9mZnNldCA9IDE1LFxuICB9XG4pIHtcbiAgLy8gTGVnZW5kXG4gIGxldCB0b3BHcm91cCA9IHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy5sZWdlbmQnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignZycpXG4gICAgLmNsYXNzZWQoJ2xlZ2VuZCcsIHRydWUpXG4gICAgLmF0dHIoXG4gICAgICAndHJhbnNmb3JtJyxcbiAgICAgIGB0cmFuc2xhdGUoJHswfSwgJHtcbiAgICAgICAgbWFyZ2luLnRvcCAtIGxlZ2VuZE9mZnNldFxuICAgICAgfSlgXG4gICAgKTtcbiAgbGV0IGJpbmRlZCA9IHRvcEdyb3VwXG4gICAgLnNlbGVjdEFsbCgnLmxlZ2VuZC1pdGVtJylcbiAgICAuZGF0YShzY2FsZSwgKGQsIGkpID0+IGQpO1xuICBiaW5kZWQuZXhpdCgpLnJlbW92ZSgpO1xuICBiaW5kZWRcbiAgICAuZW50ZXIoKVxuICAgIC5hcHBlbmQoJ2cnKVxuICAgIC5jbGFzc2VkKCdsZWdlbmQtaXRlbScsIHRydWUpXG4gICAgLmF0dHIoJ2RhdGEtbGFiZWwnLCAoZCkgPT4gZClcbiAgICAuYXR0cigndHJhbnNmb3JtJywgZnVuY3Rpb24gKGQsIGkpIHtcbiAgICAgIGxldCBjdW1MZW5ndGggPSBzY2FsZVxuICAgICAgICAuc2xpY2UoMCwgaSlcbiAgICAgICAgLnJlZHVjZSgoYWNjLCBlbCkgPT4gYWNjICsgZWwubGVuZ3RoLCAwKTtcbiAgICAgIHJldHVybiBgdHJhbnNsYXRlKCR7XG4gICAgICAgIDQwICogaSArIDggKiBjdW1MZW5ndGhcbiAgICAgIH0sIDApYDtcbiAgICB9KVxuICAgIC5jYWxsKChnKSA9PlxuICAgICAgZ1xuICAgICAgICAuYXBwZW5kKCd0ZXh0JylcbiAgICAgICAgLnRleHQoKGQpID0+IGQpXG4gICAgICAgIC5hdHRyKCd5JywgMTIpXG4gICAgICAgIC5hdHRyKCd4JywgMjUpXG4gICAgICAgIC5zdHlsZSgnZm9udC1zaXplJywgJzAuNmVtJylcbiAgICApXG4gICAgLmNhbGwoKGcpID0+XG4gICAgICBnXG4gICAgICAgIC5hcHBlbmQoJ3JlY3QnKVxuICAgICAgICAuYXR0cignd2lkdGgnLCAxNSlcbiAgICAgICAgLmF0dHIoJ2hlaWdodCcsIDE1KVxuICAgICAgICAuc3R5bGUoJ2ZpbGwnLCAoZCwgaSkgPT4gY29sb3JbaV0pXG4gICAgKTtcbiAgbGV0IGxlZ2VuZFdpZHRoID0gdG9wR3JvdXBcbiAgICAubm9kZSgpXG4gICAgLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICB0b3BHcm91cC5hdHRyKFxuICAgICd0cmFuc2Zvcm0nLFxuICAgIGB0cmFuc2xhdGUoJHsod2lkdGggLSBsZWdlbmRXaWR0aCkgLyAyfSwgJHtcbiAgICAgIG1hcmdpbi50b3AgLSBsZWdlbmRPZmZzZXRcbiAgICB9KWBcbiAgKTtcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlQm94ZXMoYXJyLCB0b3RhbCkge1xuICBsZXQgcGVyY2VudHMgPSB7fTtcbiAgYXJyLmZvckVhY2goKGQsIGopID0+IHtcbiAgICBwZXJjZW50c1tqXSA9IChkICogMTAwKSAvIHRvdGFsO1xuICB9KTtcblxuICBsZXQgYm94ZXMgPSBbXTtcbiAgLy8gc3RhcnQgd2lsbCBiZSBkaXNhZ3JlZXM6IDAsIDEsIDJcbiAgdmFyIHN0YXJ0ID1cbiAgICAtMSAqXG4gICAgKHBlcmNlbnRzWzBdICsgcGVyY2VudHNbMV0gKyBwZXJjZW50c1syXSk7XG4gIFswLCAxLCAyLCAzLCA0LCA1XS5mb3JFYWNoKGZ1bmN0aW9uICh2YWwpIHtcbiAgICBib3hlc1t2YWxdID0ge1xuICAgICAgaWR4OiB2YWwsXG4gICAgICBzdGFydDogc3RhcnQsXG4gICAgICBlbmQ6IChzdGFydCArPSBwZXJjZW50c1t2YWxdKSxcbiAgICAgIG46IHBlcmNlbnRzW3ZhbF0sXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBib3hlcztcbn1cbiIsImltcG9ydCB7IGdldER1YWxEaXZlcmdpbmdTY2FsZURhdGEgfSBmcm9tICcuL2dldER1YWxEaXZlcmdpbmdTY2FsZURhdGEnO1xuaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgY3JlYXRlVGl0bGUgfSBmcm9tICcuLi9zZWxlY3RhYmxlVGl0bGUnO1xuaW1wb3J0IHsgZHVhbERpdmVyZ2luZ1NjYWxlIH0gZnJvbSAnLi9kdWFsRGl2ZXJnaW5nU2NhbGUnO1xuaW1wb3J0IHsgYmFja0J1dHRvbiB9IGZyb20gJy4uL2JhY2tCdXR0b24nXG5cbmNvbnN0IG1hcmdpbiA9IHtcbiAgICB0b3A6IDQwLFxuICAgIGJvdHRvbTogNTAsXG4gICAgbGVmdDogMTEwLFxuICAgIHJpZ2h0OiAzMCxcbiAgfVxuY29uc3QgdGl0bGVIZWlnaHQgPSA1MDtcbmNvbnN0IHlBeGlzV2lkdGggPSAwO1xuY29uc3QgaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0IC0gMTAgLSB0aXRsZUhlaWdodDtcbmNvbnN0IHdpZHRoID0gd2luZG93LmlubmVyV2lkdGggLSAxMCAtIHlBeGlzV2lkdGg7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRHVhbERpdmVyZ2luZ1NjYWxlKGNvbnRhaW5lciwgZGF0YSwgc2V0U3RhdGUpIHtcblx0c2VsZWN0KGNvbnRhaW5lcikuY2FsbChkdWFsRGl2ZXJnaW5nU2NhbGUsIHtcbiAgICBkYXRhOiBkYXRhLmN1cnJlbnREYXRhLnBvaW50c01hcCxcbiAgICBxdWVzdGlvblRhZzogZGF0YS5jdXJyZW50RGF0YS5xdWVzdGlvblRhZyxcbiAgICBzY2FsZTogZGF0YS5jdXJyZW50RGF0YS5zY2FsZSxcbiAgICB0aXRsZXM6IGRhdGEudGl0bGVzLFxuICAgIG1lZGlhTGlzdDogZGF0YS5tZWRpYUxpc3QsXG4gICAgY3VycmVudE1lZGlhOiBkYXRhLmN1cnJlbnREYXRhLm1lZGlhLFxuICAgIHdpZHRoLFxuICAgIGhlaWdodCxcbiAgICBtYXJnaW4sXG4gICAgeEF4aXNMYWJlbDogJ1BlcmNlbnRhZ2Ugb2YgUmVzcG9uc2VzICglKScsXG4gICAgeUF4aXNMYWJlbDogJ1NvY2lhbCBNZWRpYSBOYW1lcycsXG4gICAgdGl0bGVIZWlnaHQsXG4gICAgeUF4aXNXaWR0aCxcbiAgICB3YXJuaW5nOiBkYXRhLmN1cnJlbnREYXRhLndhcm5pbmcsXG4gICAgb25ZQXhpc0NoYW5nZTogKG1lZGlhLCBpbmRleCkgPT4ge1xuICAgICAgbGV0IG5ld01lZGlhID0gWy4uLmRhdGEuY3VycmVudERhdGEubWVkaWFdXG4gICAgICBuZXdNZWRpYVtpbmRleF0gPSBtZWRpYVxuICAgICAgY29uc29sZS5sb2coZGF0YS5jdXJyZW50RGF0YS5tZWRpYSwgbmV3TWVkaWEpXG4gICAgICBsZXQgY3VycmVudERhdGEgPSBnZXREdWFsRGl2ZXJnaW5nU2NhbGVEYXRhKGRhdGEudG90YWxEYXRhLCBkYXRhLmN1cnJlbnREYXRhLnF1ZXN0aW9uVGFnLCBuZXdNZWRpYSlcbiAgICAgIHNldFN0YXRlKChzdGF0ZSkgPT4gKHtcbiAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgIGRhdGE6IHsgLi4uZGF0YSxcbiAgICAgICAgICAgICAgIGN1cnJlbnREYXRhOiBjdXJyZW50RGF0YSB9LFxuICAgICAgfSkpO1xuICAgIH1cbiAgfSlcbiAgXG4gIHNlbGVjdChjb250YWluZXIpLmNhbGwoY3JlYXRlVGl0bGUsIHsgXG4gICAgcXVlc3Rpb25UYWc6IGRhdGEuY3VycmVudERhdGEucXVlc3Rpb25UYWcsIFxuICAgIHRpdGxlczogZGF0YS50aXRsZXMsIFxuICAgIHdpZHRoOiB3aWR0aCArIHlBeGlzV2lkdGgsIFxuICAgIG1hcmdpbixcbiAgICBvbkNoYW5nZTogKHFUYWcpID0+IHtcbiAgICAgIGxldCBjdXJyZW50RGF0YSA9IGdldER1YWxEaXZlcmdpbmdTY2FsZURhdGEoZGF0YS50b3RhbERhdGEsIHFUYWcsIGRhdGEuY3VycmVudERhdGEubWVkaWEpXG4gICAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhOiB7IC4uLmRhdGEsXG4gICAgICAgICAgICAgICBjdXJyZW50RGF0YTogY3VycmVudERhdGEgfSxcbiAgICAgIH0pKTtcbiAgICB9XG4gIH0pXG4gIFxuICBzZWxlY3QoY29udGFpbmVyKVxuICBcdC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgLmNhbGwoYmFja0J1dHRvbiwge1xuICAgIFx0aGVpZ2h0LFxuICAgICAgc2V0U3RhdGVcbiAgXHR9KVxufSIsImltcG9ydCB7XG4gIHNlbGVjdCxcbiAgc2NhbGVMaW5lYXIsXG4gIHNjYWxlQmFuZCxcbiAgYXhpc0xlZnQsXG4gIGF4aXNCb3R0b20sXG4gIHNjaGVtZVB1T3IgYXMgY29sb3JTY2hlbWUsXG59IGZyb20gJ2QzJztcbmltcG9ydCB7IG1lZGlhQ29sb3JzIH0gZnJvbSAnLi4vbWVkaWFDb2xvcnMnXG5cbmV4cG9ydCBjb25zdCBiYXJDaGFydCA9IChcbiAgc2VsZWN0aW9uLFxuICB7XG4gICAgZGF0YSxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHQsXG4gICAgbWFyZ2luLFxuICAgIHF1ZXN0aW9uVGFnLFxuICAgIHRpdGxlcyxcbiAgICB4QXhpc0xhYmVsLFxuICAgIHlBeGlzTGFiZWwsXG4gICAgc2NhbGUsXG4gICAgbWF4LFxuICB9XG4pID0+IHsgIFxuICBjb25zdCB4U2NhbGUgPSBzY2FsZUJhbmQoKVxuICAgIC5yYW5nZShbXG4gICAgICBtYXJnaW4ubGVmdCxcbiAgICAgIHdpZHRoIC0gbWFyZ2luLnJpZ2h0LFxuICAgIF0pXG4gICAgLmRvbWFpbihzY2FsZSlcbiAgXHQucGFkZGluZ091dGVyKDAuMilcbiAgICAucGFkZGluZ0lubmVyKDAuMik7XG4gIGNvbnN0IHlTY2FsZSA9IHNjYWxlTGluZWFyKClcbiAgICAucmFuZ2UoW2hlaWdodCAtIG1hcmdpbi5ib3R0b20sIG1hcmdpbi50b3BdKVxuICAgIC5kb21haW4oWzAsIG1heF0pO1xuICBcbiAgLy8gQ2FsY3VsYXRlXG4gIHNlbGVjdGlvbi5jYWxsKGNyZWF0ZUJhcnMsIHtcbiAgICBkYXRhLFxuICAgIHhTY2FsZSxcbiAgICB5U2NhbGUsXG4gIH0pO1xuICBzZWxlY3Rpb24uY2FsbChjcmVhdGVBeGVzLCB7XG4gICAgZGF0YSxcbiAgICB4U2NhbGUsXG4gICAgeVNjYWxlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeUF4aXNMYWJlbCxcbiAgfSk7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVCYXJzKFxuICBzZWxlY3Rpb24sXG4gIHsgZGF0YSwgeFNjYWxlLCB5U2NhbGUgfVxuKSB7XG4gIGxldCB0b3BHcm91cCA9IHNlbGVjdGlvblxuICBcdC5zZWxlY3RBbGwoJy5iYXJzJylcbiAgICAuZGF0YShbbnVsbF0pXG4gICAgLmpvaW4oJ2cnKVxuICBcdC5jbGFzc2VkKFwiYmFyc1wiLCB0cnVlKVxuICB0b3BHcm91cFxuICAgIC5zZWxlY3RBbGwoJy5iYXInKVxuICAgIC5kYXRhKE9iamVjdC5rZXlzKGRhdGEuY291bnRzKSlcbiAgICAuam9pbigncmVjdCcpXG4gICAgLmNsYXNzZWQoJ2JhcicsIHRydWUpXG4gICAgLmF0dHIoJ3gnLCAoZCkgPT4geFNjYWxlKGQpKVxuICAgIC5hdHRyKCd5JywgKGQpID0+IHlTY2FsZShkYXRhLmNvdW50c1tkXSkpXG4gICAgLmF0dHIoJ3dpZHRoJywgKGQpID0+IHhTY2FsZS5iYW5kd2lkdGgoKSlcbiAgICAuYXR0cignaGVpZ2h0JywgKGQpID0+IHlTY2FsZSgwKSAtIHlTY2FsZShkYXRhLmNvdW50c1tkXSkpXG4gICAgLnN0eWxlKCdmaWxsJywgKGQsIGkpID0+IG1lZGlhQ29sb3JzW2RhdGEubWVkaWFUZXh0XSlcbn1cblxuZnVuY3Rpb24gY3JlYXRlQXhlcyhcbiAgc2VsZWN0aW9uLFxuICB7XG4gICAgZGF0YSxcbiAgICB4U2NhbGUsXG4gICAgeVNjYWxlLFxuICAgIHhBeGlzTGFiZWwsXG4gICAgeUF4aXNMYWJlbCxcbiAgICB4QXhpc0xhYmVsT2Zmc2V0ID0gNTAsXG4gICAgeUF4aXNMYWJlbE9mZnNldCA9IDQwLFxuICB9XG4pIHtcbiAgY29uc3QgeUF4aXMgPSBheGlzTGVmdCh5U2NhbGUpO1xuICBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcueUF4aXMnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignZycpXG4gICAgLmNsYXNzZWQoJ3lBeGlzJywgdHJ1ZSlcbiAgICAuYXR0cihcbiAgICAgICd0cmFuc2Zvcm0nLFxuICAgICAgJ3RyYW5zbGF0ZSgnICsgeFNjYWxlLnJhbmdlKClbMF0gKyAnLDApJ1xuICAgIClcbiAgICAuY2FsbCh5QXhpcyk7XG5cbiAgY29uc3QgeEF4aXMgPSBheGlzQm90dG9tKHhTY2FsZSk7XG4gIHNlbGVjdGlvblxuICAgIC5zZWxlY3RBbGwoJy54QXhpcycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdnJylcbiAgICAuY2xhc3NlZCgneEF4aXMnLCB0cnVlKVxuICAgIC5hdHRyKFxuICAgICAgJ3RyYW5zZm9ybScsXG4gICAgICAndHJhbnNsYXRlKDAsJyArIHlTY2FsZS5yYW5nZSgpWzBdICsgJyknXG4gICAgKVxuICAgIC5jYWxsKHhBeGlzKTtcblxuICBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcueUF4aXNMYWJlbCcpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCd0ZXh0JylcbiAgICAuY2xhc3NlZCgneUF4aXNMYWJlbCcsIHRydWUpXG4gICAgLnRleHQoeUF4aXNMYWJlbClcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtOTApJylcbiAgICAuYXR0cihcbiAgICAgICd5JyxcbiAgICAgIHhTY2FsZS5yYW5nZSgpWzBdIC0geUF4aXNMYWJlbE9mZnNldFxuICAgIClcbiAgICAuYXR0cihcbiAgICAgICd4JyxcbiAgICAgIC0oeVNjYWxlLnJhbmdlKClbMF0gKyB5U2NhbGUucmFuZ2UoKVsxXSkgLyAyXG4gICAgKTtcblxuICBzZWxlY3Rpb25cbiAgICAuc2VsZWN0QWxsKCcueEF4aXNMYWJlbCcpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCd0ZXh0JylcbiAgICAuY2xhc3NlZCgneEF4aXNMYWJlbCcsIHRydWUpXG4gICAgLnRleHQoeEF4aXNMYWJlbClcbiAgICAuYXR0cigndGV4dC1hbmNob3InLCAnbWlkZGxlJylcbiAgICAuYXR0cihcbiAgICAgICd4JyxcbiAgICAgICh4U2NhbGUucmFuZ2UoKVswXSArIHhTY2FsZS5yYW5nZSgpWzFdKSAvIDJcbiAgICApXG4gICAgLmF0dHIoXG4gICAgICAneScsXG4gICAgICB5U2NhbGUucmFuZ2UoKVswXSArIHhBeGlzTGFiZWxPZmZzZXRcbiAgICApO1xufSIsImltcG9ydCB7IGdldFNjYWxlIH0gZnJvbSAnLi4vc2NhbGVEZWZzLmpzJ1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QmFyQ2hhcnREYXRhKGJ5UXVlc3Rpb24sIHF1ZXN0aW9uVGFnLCBtZWRpYSkge1xuICBsZXQgdGhlc2VRdWVzdGlvbnMgPSB7IC4uLmJ5UXVlc3Rpb24gfVxuICBmb3IgKGxldCBxdWVzdGlvbiBpbiB0aGVzZVF1ZXN0aW9ucyl7XG4gICAgdGhlc2VRdWVzdGlvbnNbcXVlc3Rpb25dID0gdGhlc2VRdWVzdGlvbnNbcXVlc3Rpb25dLmZpbHRlcigoZCkgPT4ge1xuICAgICAgcmV0dXJuIGQubWVkaWFUZXh0ID09PSBtZWRpYVxuICAgIH0pWzBdXG4gIH1cbiAgbGV0IHsgc2NhbGUgfSA9IGdldFNjYWxlKHF1ZXN0aW9uVGFnKVxuICBjb25zdCBkYXRhID0gdGhlc2VRdWVzdGlvbnNbcXVlc3Rpb25UYWddXG4gIC8vIEdldCBtYXggZm9yIHlTY2FsZVxuICBsZXQgbWF4ID0gMDtcbiAgT2JqZWN0LmtleXModGhlc2VRdWVzdGlvbnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGxldCBjb3VudFZhbHVlcyA9IE9iamVjdC52YWx1ZXModGhlc2VRdWVzdGlvbnNba2V5XS5jb3VudHMpXG4gICAgbGV0IHF1ZXN0aW9uTWF4ID0gTWF0aC5tYXgoLi4uY291bnRWYWx1ZXMpXG4gICAgbWF4ID0gKHF1ZXN0aW9uTWF4ID4gbWF4ICYmIGtleSAhPT0gJ0QzJyAmJiBrZXkgIT09ICdEMicpID8gcXVlc3Rpb25NYXggOiBtYXhcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgc2NhbGU6IHNjYWxlLFxuICAgIGRhdGE6IGRhdGEsXG4gICAgbWVkaWE6IG1lZGlhLFxuICAgIHF1ZXN0aW9uVGFnOiBxdWVzdGlvblRhZyxcbiAgICBtYXg6IG1heFxuICB9O1xufVxuIiwiaW1wb3J0IHsgc2VsZWN0IH0gZnJvbSAnZDMnO1xuaW1wb3J0IHsgY3JlYXRlVGl0bGUgfSBmcm9tICcuLi9zZWxlY3RhYmxlVGl0bGUnO1xuaW1wb3J0IHsgYmFyQ2hhcnQgfSBmcm9tICcuL2JhckNoYXJ0JztcbmltcG9ydCB7IGJhY2tCdXR0b24gfSBmcm9tICcuLi9iYWNrQnV0dG9uJztcbmltcG9ydCB7IGdldEJhckNoYXJ0RGF0YSB9IGZyb20gJy4vZ2V0QmFyQ2hhcnREYXRhJztcblxuY29uc3QgdGl0bGVUcmFuc2xhdGUgPSA2NTtcbmNvbnN0IGhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIDEwIC0gdGl0bGVUcmFuc2xhdGU7XG5jb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoIC0gMTA7XG5jb25zdCBtYXJnaW4gPSB7XG4gIHRvcDogMTUsXG4gIGJvdHRvbTogNTAsXG4gIGxlZnQ6IDgwLFxuICByaWdodDogMzAsXG59O1xuXG5leHBvcnQgY29uc3QgY3JlYXRlQmFyQ2hhcnQgPSAoXG4gIGNvbnRhaW5lcixcbiAgZGF0YSxcbiAgc2V0U3RhdGVcbikgPT4ge1xuICBjb25zdCBzdmcgPSBzZWxlY3QoY29udGFpbmVyKVxuICAgIC5zZWxlY3RBbGwoJ3N2ZycpXG4gICAgLmRhdGEoW251bGxdKVxuICAgIC5qb2luKCdzdmcnKVxuICAgIC5hdHRyKCd3aWR0aCcsIHdpZHRoKVxuICAgIC5hdHRyKCdoZWlnaHQnLCBoZWlnaHQpO1xuXG4gIHNlbGVjdChjb250YWluZXIpLmNhbGwoY3JlYXRlVGl0bGUsIHtcbiAgICBxdWVzdGlvblRhZzogZGF0YS5jdXJyZW50RGF0YS5xdWVzdGlvblRhZyxcbiAgICB0aXRsZXM6IGRhdGEudGl0bGVzLFxuICAgIHdpZHRoLFxuICAgIG1hcmdpbixcbiAgICBvbkNoYW5nZTogKHFUYWcpID0+IHtcbiAgICAgIGxldCBjdXJyZW50RGF0YSA9IGdldEJhckNoYXJ0RGF0YShcbiAgICAgICAgZGF0YS50b3RhbERhdGEsXG4gICAgICAgIHFUYWcsXG4gICAgICAgIGRhdGEuY3VycmVudERhdGEubWVkaWFcbiAgICAgICk7XG4gICAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBjdXJyZW50RGF0YTogY3VycmVudERhdGEsXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfSxcbiAgfSk7XG4gIHN2Z1xuICAgIC5jYWxsKGJhckNoYXJ0LCB7XG4gICAgICBkYXRhOiBkYXRhLmN1cnJlbnREYXRhLmRhdGEsXG4gICAgICBxdWVzdGlvblRhZzpcbiAgICAgICAgZGF0YS5jdXJyZW50RGF0YS5kYXRhLnF1ZXN0aW9uVGFnLFxuICAgICAgc2NhbGU6IGRhdGEuY3VycmVudERhdGEuc2NhbGUsXG4gICAgICB0aXRsZXM6IGRhdGEudGl0bGVzLFxuICAgICAgbWF4OiBkYXRhLmN1cnJlbnREYXRhLm1heCxcbiAgICAgIHdpZHRoLFxuICAgICAgaGVpZ2h0LFxuICAgICAgbWFyZ2luLFxuICAgICAgeEF4aXNMYWJlbDogJ0xpa2VydCBTY2FsZScsXG4gICAgICB5QXhpc0xhYmVsOiAnIyBvZiBSZXNwb25zZXMnLFxuICAgIH0pXG4gICAgLnJhaXNlKCk7XG5cbiAgc3ZnLmNhbGwoYmFja0J1dHRvbiwge1xuICAgIGhlaWdodCxcbiAgICBzZXRTdGF0ZSxcbiAgfSk7XG4gIHNlbGVjdChjb250YWluZXIpLmNhbGwoY3JlYXRlTWVkaWFTZWxlY3QsIHtcbiAgICBtZWRpYTogZGF0YS5jdXJyZW50RGF0YS5kYXRhLm1lZGlhVGV4dCxcbiAgICBtZWRpYUxpc3Q6IGRhdGEubWVkaWFMaXN0LFxuICAgIHdpZHRoLFxuICAgIG9uTWVkaWFDaGFuZ2U6IChtZWRpYSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnREYXRhID0gZ2V0QmFyQ2hhcnREYXRhKFxuICAgICAgICBkYXRhLnRvdGFsRGF0YSxcbiAgICAgICAgZGF0YS5jdXJyZW50RGF0YS5xdWVzdGlvblRhZyxcbiAgICAgICAgbWVkaWFcbiAgICAgICk7XG4gICAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAgIC4uLnN0YXRlLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgICBjdXJyZW50RGF0YTogY3VycmVudERhdGEsXG4gICAgICAgIH0sXG4gICAgICB9KSk7XG4gICAgfSxcbiAgfSk7XG59O1xuXG5jb25zdCBjcmVhdGVNZWRpYVNlbGVjdCA9IChcbiAgY29udGFpbmVyLFxuICB7XG4gICAgbWVkaWEsXG4gICAgbWVkaWFMaXN0LFxuICAgIG9uTWVkaWFDaGFuZ2UsXG4gICAgd2lkdGgsXG4gICAgc2VsZWN0VG9wID0gNTUsXG4gICAgc2VsZWN0V2lkdGggPSAxNTAsXG4gICAgc2VsZWN0SGVpZ2h0ID0gMzAsXG4gICAgc2VsZWN0TWFyZ2luID0gNSxcbiAgfVxuKSA9PiB7XG4gIGxldCB0b3BTZWxlY3QgPSBjb250YWluZXJcbiAgICAuc2VsZWN0QWxsKCcubWVkaWFTZWxlY3QnKVxuICAgIC5kYXRhKFtudWxsXSlcbiAgICAuam9pbignc2VsZWN0JylcbiAgICAuY2xhc3NlZCgnbWVkaWFTZWxlY3QnLCB0cnVlKVxuICAgIC5zdHlsZSgnd2lkdGgnLCBzZWxlY3RXaWR0aCArICdweCcpXG4gICAgLnN0eWxlKCdoZWlnaHQnLCBzZWxlY3RIZWlnaHQgKyAncHgnKVxuICAgIC5zdHlsZSgncG9zaXRpb24nLCAnYWJzb2x1dGUnKVxuICAgIC5zdHlsZShcbiAgICAgICd0b3AnLFxuICAgICBcdHNlbGVjdFRvcCArICdweCdcbiAgICApXG4gICAgLnN0eWxlKFxuICAgICAgJ2xlZnQnLFxuICAgICAgd2lkdGggLSBzZWxlY3RNYXJnaW4gLSBzZWxlY3RXaWR0aCArICdweCdcbiAgICApXG4gICAgLm9uKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgIG9uTWVkaWFDaGFuZ2UoZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgICB9KTtcbiAgdG9wU2VsZWN0XG4gICAgLnNlbGVjdEFsbCgnLnNlbGVjdE9wdGlvbnMnKVxuICAgIC5kYXRhKG1lZGlhTGlzdClcbiAgICAuam9pbignb3B0aW9uJylcbiAgICAuY2xhc3NlZCgnc2VsZWN0T3B0aW9ucycsIHRydWUpXG4gICAgLmF0dHIoJ3ZhbHVlJywgKGQpID0+IGQpXG4gICAgLnRleHQoKGQpID0+IGQpO1xuICB0b3BTZWxlY3RcbiAgICAuc2VsZWN0KFwib3B0aW9uW3ZhbHVlPSdcIiArIG1lZGlhICsgXCInXVwiKVxuICAgIC5wcm9wZXJ0eSgnc2VsZWN0ZWQnLCB0cnVlKTtcbn07XG4iLCJpbXBvcnQgeyBjc3ZQYXJzZSwgc2VsZWN0IH0gZnJvbSAnZDMnO1xuXG5pbXBvcnQgeyBzZWxlY3RQYWdlIH0gZnJvbSAnLi9zY3JpcHRzL3NlbGVjdCc7XG5cbmltcG9ydCB7IGNyZWF0ZVJhZGFyQ2hhcnQgfSBmcm9tICcuL3NjcmlwdHMvcmFkYXJDaGFydC9jcmVhdGVSYWRhckNoYXJ0JztcbmltcG9ydCB7IGdldFJhZGFyRGF0YSB9IGZyb20gJy4vc2NyaXB0cy9yYWRhckNoYXJ0L2dldFJhZGFyRGF0YSc7XG5cbmltcG9ydCB7IGNyZWF0ZURpdmVyZ2luZ1NjYWxlIH0gZnJvbSAnLi9zY3JpcHRzL2RpdmVyZ2luZ1NjYWxlL2NyZWF0ZURpdmVyZ2luZ1NjYWxlJztcbmltcG9ydCB7IGdldERpdmVyZ2luZ1NjYWxlRGF0YSB9IGZyb20gJy4vc2NyaXB0cy9kaXZlcmdpbmdTY2FsZS9nZXREaXZlcmdpbmdTY2FsZURhdGEnO1xuXG5pbXBvcnQgeyBjcmVhdGVEdWFsRGl2ZXJnaW5nU2NhbGUgfSBmcm9tICcuL3NjcmlwdHMvZHVhbERpdmVyZ2luZ1NjYWxlL2NyZWF0ZUR1YWxEaXZlcmdpbmdTY2FsZSc7XG5pbXBvcnQgeyBnZXREdWFsRGl2ZXJnaW5nU2NhbGVEYXRhIH0gZnJvbSAnLi9zY3JpcHRzL2R1YWxEaXZlcmdpbmdTY2FsZS9nZXREdWFsRGl2ZXJnaW5nU2NhbGVEYXRhJztcbmltcG9ydCB7IGR1YWxEaXZlcmdpbmdTY2FsZSB9IGZyb20gJy4vc2NyaXB0cy9kdWFsRGl2ZXJnaW5nU2NhbGUvZHVhbERpdmVyZ2luZ1NjYWxlJ1xuXG5pbXBvcnQgeyBjcmVhdGVCYXJDaGFydCB9IGZyb20gJy4vc2NyaXB0cy9iYXJDaGFydC9jcmVhdGVCYXJDaGFydCc7XG5pbXBvcnQgeyBnZXRCYXJDaGFydERhdGEgfSBmcm9tICcuL3NjcmlwdHMvYmFyQ2hhcnQvZ2V0QmFyQ2hhcnREYXRhJztcblxubGV0IERFRkFVTFRfTU9ERSA9ICdTRUxFQ1QnO1xuLy8gV0FSTklORyBJRiBUSEUgU0NBTEVTIEFSRSBOT1QgU0laRSA2IFRIRVJFIElTIEVSUk9SXG5jb25zdCBEVUFMX01PREUgPSB0cnVlO1xuY29uc3QgREVGQVVMVF9RVUVTVElPTiA9ICdDMyc7XG5jb25zdCBERUZBVUxUX0RVQUxfTUVESUFTID0gW1wiRmFjZWJvb2tcIiwgXCJJbnN0YWdyYW1cIl1cbmNvbnN0IERFRkFVTFRfTUVESUEgPSBcIkZhY2Vib29rXCJcblxuZXhwb3J0IGNvbnN0IHZpeiA9IChcbiAgY29udGFpbmVyLFxuICB7IHN0YXRlLCBzZXRTdGF0ZSB9XG4pID0+IHtcbiAgLy8gc3RhdGUuZGF0YSBjb3VsZCBiZTpcbiAgLy8gKiB1bmRlZmluZWRcbiAgLy8gKiAnTE9BRElORydcbiAgLy8gKiB7IHRvdGFsRGF0YTogYnlRdWVzdGlvbiwgXG4gIC8vICBcdCBjdXJyZW50RGF0YTogey4uLn0sXG4gIC8vXHQgXHQgdGl0bGVzOiBbXSxcbiAgLy8gXHRcdCBtZWRpYUxpc3Q6IFtdLFxuXHQvLyBcdFx0IHJhZGFyRGF0YTogey4uLn1cbiAgLy9cdFx0IG1lbW9yeTogeyBNVUxUSTogdW5kZWZpbmVkL3txdWVzdGlvblRhZzogcXVlc3Rpb25UYWd9LFxuICAvL1x0XHRcdFx0RFVBTDogdW5kZWZpbmVkL3sgbWVkaWFzOiBbZmlyc3QsIHNlY29uZF0sIHF1ZXN0aW9uVGFnOiBxdWVzdGlvblRhZ30sXG4gIC8vXHRcdFx0XHRTSU5HTEU6IHVuZGVmaW5lZC97IG1lZGlhOiBtZWRpYSwgcXVlc3Rpb25UYWc6IHF1ZXN0aW9uVGFnfSB9XG5cdC8vXHR9XG4gIC8vIFxuICAvLyBzdGF0ZS5tb2RlIGNvdWxkIGJlOlxuICAvLyAqIHVuZGVmaW5lZC4gU1VNTUFSWSwgTVVMVEksIERVQUwsIFNJTkdMRSwgU0VMRUNUXG4gIGNvbnN0IHsgZGF0YSwgbW9kZSwgbWVtb3J5IH0gPSBzdGF0ZTtcbiAgXG4gIGlmIChtb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIG1vZGU6ICdTRUxFQ1QnLFxuICAgIH0pKTtcbiAgfVxuICBcbiAgaWYgKG1lbW9yeSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc2V0U3RhdGUoKHN0YXRlKSA9PiAoe1xuICAgICAgLi4uc3RhdGUsXG4gICAgICBtZW1vcnk6IHt9LFxuICAgIH0pKTtcbiAgfVxuXG4gIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGRhdGE6ICdMT0FESU5HJyxcbiAgICB9KSk7XG4gICAgcmV0cmlldmVEYXRhKHNldFN0YXRlKVxuICB9XG5cbiAgaWYgKG1vZGUgJiYgbW9kZSA9PT0gJ1NFTEVDVCcpIHtcbiAgICBzZWxlY3QoY29udGFpbmVyKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpXG4gICAgc2VsZWN0KGNvbnRhaW5lcikuY2FsbChzZWxlY3RQYWdlLCB7IFxuICAgICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoIC0gMTAsIFxuICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgLSAxMCxcbiAgICBcdG9uQ2xpY2s6IGZ1bmN0aW9uKGUsIGQpIHtcbiAgICAgICAgbGV0IGN1cnJEYXRhXG4gICAgICAgIHN3aXRjaCAoZCkge1xuICAgICAgICAgIGNhc2UgXCJTVU1NQVJZXCI6XG4gICAgICAgICAgICBjdXJyRGF0YSA9IGRhdGEucmFkYXJEYXRhXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwiTVVMVElcIjpcbiAgICAgICAgICAgIGlmKG1lbW9yeS5NVUxUSSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBcdGN1cnJEYXRhID0gZ2V0RGl2ZXJnaW5nU2NhbGVEYXRhKGRhdGEudG90YWxEYXRhLCBtZW1vcnkuTVVMVEkucXVlc3Rpb25UYWcpXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgXHRjdXJyRGF0YSA9IGdldERpdmVyZ2luZ1NjYWxlRGF0YShkYXRhLnRvdGFsRGF0YSwgREVGQVVMVF9RVUVTVElPTilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJEVUFMXCI6XG4gICAgICAgICAgICBpZihtZW1vcnkuRFVBTCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBcdGN1cnJEYXRhID0gZ2V0RHVhbERpdmVyZ2luZ1NjYWxlRGF0YShkYXRhLnRvdGFsRGF0YSwgbWVtb3J5LkRVQUwucXVlc3Rpb25UYWcsIG1lbW9yeS5EVUFMLm1lZGlhcylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBcdGN1cnJEYXRhID0gZ2V0RHVhbERpdmVyZ2luZ1NjYWxlRGF0YShkYXRhLnRvdGFsRGF0YSwgREVGQVVMVF9RVUVTVElPTiwgREVGQVVMVF9EVUFMX01FRElBUylcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJTSU5HTEVcIjpcbiAgICAgICAgICAgIGlmKG1lbW9yeS5TSU5HTEUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgXHRjdXJyRGF0YSA9IGdldEJhckNoYXJ0RGF0YShkYXRhLnRvdGFsRGF0YSwgbWVtb3J5LlNJTkdMRS5xdWVzdGlvblRhZywgbWVtb3J5LlNJTkdMRS5tZWRpYSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBcdGN1cnJEYXRhID0gZ2V0QmFyQ2hhcnREYXRhKGRhdGEudG90YWxEYXRhLCBERUZBVUxUX1FVRVNUSU9OLCBERUZBVUxUX01FRElBKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc2VsZWN0KGNvbnRhaW5lcikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKVxuICAgICAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAgICAgLi4uc3RhdGUsXG4gICAgICAgICAgbW9kZTogZCxcbiAgICAgICAgICBkYXRhOiB7IC4uLmRhdGEsXG4gICAgICAgICAgICAgICAgIGN1cnJlbnREYXRhOiBjdXJyRGF0YSB9LFxuICAgICAgICB9KSk7XG4gICAgICB9XG4gIFx0fSlcbiAgfSBlbHNlIGlmIChtb2RlICYmIGRhdGEgJiYgZGF0YSAhPT0gJ0xPQURJTkcnKSB7XG4gICAgc3dpdGNoIChtb2RlKSB7XG4gICAgICBjYXNlIFwiU1VNTUFSWVwiOlxuICAgICAgICBjcmVhdGVSYWRhckNoYXJ0KGNvbnRhaW5lciwgZGF0YS5yYWRhckRhdGEsIHNldFN0YXRlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJNVUxUSVwiOlxuICAgICAgICBjcmVhdGVEaXZlcmdpbmdTY2FsZShjb250YWluZXIsIGRhdGEsIHNldFN0YXRlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJEVUFMXCI6XG4gICAgICAgIGNyZWF0ZUR1YWxEaXZlcmdpbmdTY2FsZShjb250YWluZXIsIGRhdGEsIHNldFN0YXRlKVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJTSU5HTEVcIjpcbiAgICAgICAgY3JlYXRlQmFyQ2hhcnQoY29udGFpbmVyLCBkYXRhLCBzZXRTdGF0ZSlcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIFxuICBcbn07XG5cbmZ1bmN0aW9uIHJldHJpZXZlRGF0YShzZXRTdGF0ZSkge1xuICBmZXRjaChcbiAgICAnaHR0cHM6Ly9naXN0LmdpdGh1YnVzZXJjb250ZW50LmNvbS8xOWttdW56LzA1ZTNiN2ZjMDU5ZGEyNGNiMzhjMWE4YmM2NjQzM2M4L3Jhdy83ODQ2OTBiMDQ4YjBmZGJjZDNkMTk3ZTg0Mjk1YjQxMjAzOTk0NjgxL01vbmdvRGJEYXRhV2l0aFJldmVyc2VUYWcuY3N2J1xuICApXG4gIC50aGVuKChyZXNwb25zZSkgPT4gcmVzcG9uc2UudGV4dCgpKVxuICAudGhlbigoY3N2U3RyaW5nKSA9PiB7XG4gICAgbGV0IHRvdGFsRGF0YSA9IHBhcnNlRGF0YShjc3ZTdHJpbmcpXG4gICAgbGV0IHJhZGFyRGF0YSA9IGdldFJhZGFyRGF0YShjc3ZTdHJpbmcpXG4gICAgbGV0IHRpdGxlcyA9IGdldFF1ZXN0aW9uVGl0bGVzKHRvdGFsRGF0YSlcbiAgICBsZXQgbWVkaWFMaXN0ID0gZ2V0TWVkaWFMaXN0KHRvdGFsRGF0YSlcbiAgICAvL2xldCBjdXJyZW50RGF0YSA9IGdldER1YWxEaXZlcmdpbmdTY2FsZURhdGEodG90YWxEYXRhLCBERUZBVUxUX1FVRVNUSU9OLCBERUZBVUxUX0RVQUxfTUVESUFTKVxuICAgIGxldCBjdXJyZW50RGF0YSA9IGdldEJhckNoYXJ0RGF0YSh0b3RhbERhdGEsIERFRkFVTFRfUVVFU1RJT04sIERFRkFVTFRfTUVESUEpXG4gICAgLy9sZXQgY3VycmVudERhdGEgPSBnZXREaXZlcmdpbmdTY2FsZURhdGEodG90YWxEYXRhLCBERUZBVUxUX1FVRVNUSU9OKVxuICAgIGxldCBkYXRhID0geyBjdXJyZW50RGF0YSwgdG90YWxEYXRhLCB0aXRsZXMsIG1lZGlhTGlzdCwgcmFkYXJEYXRhIH1cbiAgICBzZXRTdGF0ZSgoc3RhdGUpID0+ICh7XG4gICAgICAuLi5zdGF0ZSxcbiAgICAgIGRhdGEsXG4gICAgfSkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VEYXRhKGNzdlN0cmluZyl7XG4gIGxldCBkYXRhID0gY3N2UGFyc2UoY3N2U3RyaW5nKTtcblxuICBsZXQgY291bnREYXRhID0gZGF0YS5tYXAoKGQpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgX2lkOiBkLl9pZCxcbiAgICAgIHFUYWc6IGQucVRhZyxcbiAgICAgIG1lZGlhVGV4dDogZC5tZWRpYVRleHQsXG4gICAgICB0aXRsZTogZC50aXRsZSxcbiAgICAgIGNvdW50czogSlNPTi5wYXJzZShkLnBvaW50cykucmVkdWNlKFxuICAgICAgICAoY291bnRzLCBudW0pID0+IHtcbiAgICAgICAgICBsZXQgc2NhbGVOdW0gPSBKU09OLnBhcnNlKFxuICAgICAgICAgICAgZC5zY2FsZVxuICAgICAgICAgIClbbnVtIC0gMV07XG4gICAgICAgICAgY291bnRzW3NjYWxlTnVtXSA9XG4gICAgICAgICAgICAoY291bnRzW3NjYWxlTnVtXSB8fCAwKSArMTtcbiAgICAgICAgICByZXR1cm4gY291bnRzOyBcbiAgICAgICAgfSxcbiAgICAgICAge31cbiAgICAgICksXG4gICAgfTtcbiAgfSk7XG4gIC8vY29uc3QgYnlNZWRpYSA9IGQzLmdyb3VwKGNvdW50RGF0YSwgZCA9PiBkLm1lZGlhVGV4dClcbiAgY29uc3QgYnlRdWVzdGlvbiA9IE9iamVjdC5mcm9tRW50cmllcyhcbiAgICBkMy5ncm91cChjb3VudERhdGEsIChkKSA9PiBkLnFUYWcpXG4gICk7XG4gIHJldHVybiBieVF1ZXN0aW9uXG59XG5cbmZ1bmN0aW9uIGdldFF1ZXN0aW9uVGl0bGVzKGJ5UXVlc3Rpb24pIHtcbiAgbGV0IG9wdGlvbnMgPSB7fVxuICBPYmplY3Qua2V5cyhieVF1ZXN0aW9uKS5mb3JFYWNoKCAoa2V5KSA9PiB7XG4gICAgb3B0aW9uc1trZXldID0gKHsgcXVlc3Rpb25UYWc6IGtleSwgdGl0bGU6IGJ5UXVlc3Rpb25ba2V5XVswXS50aXRsZSB9KVxuICB9KTtcbiAgcmV0dXJuIG9wdGlvbnNcbn1cblxuZnVuY3Rpb24gZ2V0TWVkaWFMaXN0KGJ5UXVlc3Rpb24pIHtcbiAgbGV0IGZpcnN0S2V5ID0gT2JqZWN0LmtleXMoYnlRdWVzdGlvbilbMF1cbiAgcmV0dXJuIGJ5UXVlc3Rpb25bZmlyc3RLZXldLm1hcCgob2JqKSA9PiB7IHJldHVybiBvYmoubWVkaWFUZXh0IH0pXG59XG5cblxuXG4iLCJpbXBvcnQgeyBzZWxlY3QgfSBmcm9tICdkMyc7XG5pbXBvcnQgeyB2aXogfSBmcm9tICcuL3Zpeic7XG5jb25zdCBjb250YWluZXIgPSBzZWxlY3QoJyNhcHAnKS5ub2RlKCk7XG5sZXQgc3RhdGUgPSB7fTtcblxuY29uc3QgcmVuZGVyID0gKCkgPT4ge1xuICB2aXooY29udGFpbmVyLCB7XG4gICAgc3RhdGUsXG4gICAgc2V0U3RhdGUsXG4gIH0pO1xufTtcblxuY29uc3Qgc2V0U3RhdGUgPSAobmV4dCkgPT4ge1xuICBzdGF0ZSA9IG5leHQoc3RhdGUpO1xuICByZW5kZXIoKTtcbn07XG5cbnJlbmRlcigpO1xuIl0sIm5hbWVzIjpbInNlbGVjdCIsImF4aXNMZWZ0Iiwic2NhbGVQb2ludCIsInNjYWxlTGluZWFyIiwibGluZSIsImNzdlBhcnNlIiwiY29sb3JTY2hlbWUiLCJzY2FsZUJhbmQiLCJjcmVhdGVMZWdlbmQiLCJheGlzQm90dG9tIiwiaGVpZ2h0Iiwid2lkdGgiLCJjb2xvciIsImNhbGN1bGF0ZUJveGVzIiwiY3JlYXRlQmFycyIsImNyZWF0ZUF4ZXMiLCJtYXJnaW4i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