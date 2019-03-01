import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
        
class VerticalCrosshair extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { hoverX,
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
    let {hoverX,width} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    if (hoverX===undefined || hoverX===null) {
      return;
    }
    let hoverDomX = this.toDomXCoord(hoverX);
    ctx.beginPath();
    ctx.moveTo(hoverDomX-0.5,0);
    ctx.lineTo(hoverDomX-0.5,1);
    ctx.stroke();
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default VerticalCrosshair;
