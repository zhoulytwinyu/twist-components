import React, { PureComponent } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";

class VerticalGrid_Line extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
    // Buffer
    this.buffer = {};
    this.buffer.domXs = [];
    this.buffer.colors = [];
  }
  
  render() {
    let { width,minX,maxX,
          Xs, colors,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,Xs,colors} = this.props;
    let {buffer} = this;
    // Filter
    let startIndex = Math.max(0,bisect_right(Xs,minX));
    let endIndex = Math.min(Xs.length-1,bisect_left(Xs,maxX));
    buffer.domXs.length = endIndex-startIndex+1; 
    buffer.colors.length = endIndex-startIndex+1;
    // Coord convert
    for (let i=startIndex,j=0; i<=endIndex; i++,j++) {
      buffer.domXs[j] = toDomXCoord_Linear(width,minX,maxX,Xs[i]);
      buffer.colors[j] = colors[i];
    }
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    this.verticalLinePlot(ctx,width,1,buffer.domXs,buffer.colors);
  }
  
  verticalLinePlot(ctx,width,height,domXs,colors){
    let x = null;
    let c = null;
    for (let i=0; i<domXs.length; i++) {
      x = Math.round(domXs[i]);
      c = colors[i];
      ctx.beginPath();
      ctx.fillStyle = c;
      ctx.moveTo(x,0);
      ctx.lineTo(x,height);
      ctx.stroke();
    }
  }
}

export default VerticalGrid_Line;
