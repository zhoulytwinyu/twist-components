import React, { Component } from 'react';
import {toDomXCoord_Linear,
        toDomYCoord_Linear} from "plot-utils";
        
class SelectionPoint extends Component {
  constructor(props){
    super(props);
    this.ref=React.createRef();
  }
  
  render() {
    let {width, height, left, top} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{position:"absolute", left:left,top:top}}> </canvas>
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
    let {hoverSelection} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    if (!hoverSelection){
      return;
    }
    let {x,y} = hoverSelection;
    let domX = this.toDomXCoord(x);
    let domY = this.toDomYCoord(y);
    ctx.beginPath();
    ctx.arc(domX, domY, 5, 0, 2*Math.PI);
    ctx.fill();
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
