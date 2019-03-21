import React, { PureComponent } from 'react';
import {toDomXCoord_Linear,
        toDomYCoord_Linear} from "plot-utils";

class SelectionPoint extends PureComponent {
  constructor(props){
    super(props);
    this.ref=React.createRef();
  }
  
  render() {
    let { selection,
          minX,maxX,width,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} {...rest}></canvas>
    );
  }
  
  componentDidMount() {
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {width, height} = this.props;
    let {selection} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    if (!selection){
      return;
    }
    let {x,ys} = selection;
    for (let y of ys) {
      let domX = this.toDomXCoord(x);
      let domY = this.toDomYCoord(y);
      ctx.beginPath();
      ctx.arc(domX, domY, 5, 0, 2*Math.PI);
      ctx.fill();
    }
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
  
  toDomYCoord(dataY) {
    let {minY,maxY,height} = this.props;
    return toDomYCoord_Linear(height,minY,maxY,dataY);
  }
}

export default SelectionPoint;
