let tomSelected;
export function createTitle(selection, { questionTag, titles, width, margin, onChange, titleOffset = 50 }) {
  let select = selection
    .selectAll('.title')
  if(select.size() === 0){
    let options = Object.values(titles).map( (title) => {
      return { value: title.questionTag, text: title.title }
    })
    select
      .data([null])
      .join('select')
      .classed('title', true)
      .style("width", width - 15 + 'px')
      .on('change', (event) => {
        onChange(event.target.value)
      })

    tomSelected = new TomSelect(".title",{
      options: options,
      items: [questionTag]
    });
  } else {
    select
    	.on('change', (event) => {
        onChange(event.target.value)
      })
  }
}