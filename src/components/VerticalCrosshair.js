import React, { Component } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
        
class VerticalCrosshair extends Component {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { hoverDataX,
          minX,maxX,width,
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
    let {hoverDataX,width} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    let hoverDomX = this.toDomXCoord(hoverDataX);
    ctx.fillRect(hoverDomX-0.5,0,1,1);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default VerticalCrosshair;
