import React, { PureComponent } from 'react';
import {vLinePlot} from "plot-utils";

class VerticalGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { data, /*[{x,color}]*/
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
    let Xs = data.map( ({x})=>Math.ceil(x)-0.5 );
    let colors = data.map( ({color})=>color );
    for (let i=0; i<data.length; i++){
      let x = Xs[i];
      let color = colors[i];
      ctx.fillStyle=color;
      ctx.beginPath();
      ctx.moveTo(x,0);
      ctx.lineTo(x,1);
      ctx.stroke();
    }
  }
}

export default VerticalGrid;
