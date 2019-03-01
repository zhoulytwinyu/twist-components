import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
import VerticalSlabGrid from "./Basics/VerticalSlabGrid";

const COLOR = "rgba(100,100,100,0.3)";

class InPlotXRangeSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.clean = true;
  }

  render() {
    let { minX,maxX,width,
          startX,endX,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { minX, maxX, width,
          startX,endX,
          ...rest} = this.props;
    let {memo} = this;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    if (!memo.clean) {
      ctx.clearRect(0,0,width,1);
      memo.clean=true;
    }
    
    if (startX === undefined || startX === null ||
        endX === undefined || endX === null ) {
      return;
    }
    // Coord
    let startDomX= Math.max(0,toDomXCoord_Linear(width,minX,maxX,startX));
    let endDomX = Math.min(width,toDomXCoord_Linear(width,minX,maxX,endX));
    // Draw
    ctx.globalAlpha=0.2;
    ctx.fillRect(startDomX,0,endDomX-startDomX,1);
    memo.clean=false;
  }
}

export default InPlotXRangeSelection;
