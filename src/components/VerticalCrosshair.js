import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
        
class VerticalCrosshair extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { X,
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
    let {X,
          minX,maxX,width,} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    if (X===undefined || X===null) {
      return;
    }
    let hoverDomX = toDomXCoord_Linear(width,minX,maxX,X);
    ctx.beginPath();
    ctx.moveTo(hoverDomX-0.5,0);
    ctx.lineTo(hoverDomX-0.5,1);
    ctx.stroke();
  }
}

export default VerticalCrosshair;
