import React, { PureComponent } from 'react';

class HorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { data, /*[{start,end,color}]*/
          height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={1} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount() {
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    let {data,height} = this.props;
    ctx.clearRect(0,0,1,height);
    let starts = data.map(({start})=>Math.round(start));
    let ends = data.map(({end})=>Math.round(end));
    let colors = data.map(({color})=>color);
    for (let i=0; i<data.length; i++){
      let color = colors[i];
      let start = Math.max(0,starts[i]);
      let end = Math.min(height,ends[i]);
      ctx.fillStyle = color;
      ctx.fillRect(0,start,1,end-start);
    }
  }
}

export default HorizontalSlabGrid;

