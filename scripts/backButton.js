const chevronPath =
  'M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z';
export const backButton = (
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
