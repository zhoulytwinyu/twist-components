import React, { PureComponent } from 'react';

class VerticalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { data, /*[{start,end,color}]*/
          width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
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
    let {data,width} = this.props;
    ctx.clearRect(0,0,width,1);
    let starts = data.map(({start})=>Math.ceil(start)-0.5);
    let ends = data.map(({end})=>Math.ceil(end)-0.5);
    let colors = data.map(({color})=>color);
    for (let i=0; i<data.length; i++){
      let color = colors[i];
      let start = Math.max(0,starts[i]);
      let end = Math.min(width,ends[i]);
      ctx.fillStyle = color;
      ctx.fillRect(start,0,end-start,1);
    }
  }
}

export default VerticalSlabGrid;

