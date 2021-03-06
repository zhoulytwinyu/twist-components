import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";

class InPlotXRangeSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { width,height} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} style={{height:height,display:"block",width:width}}></canvas>
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
          startX,endX} = this.props;
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    if (startX === undefined || startX === null ||
        endX === undefined || endX === null ) {
      return;
    }
    // Coord
    let startDomX= Math.round(Math.max(0,toDomXCoord_Linear(width,minX,maxX,startX)));
    let endDomX = Math.round(Math.min(width,toDomXCoord_Linear(width,minX,maxX,endX)));
    // Draw
    ctx.globalAlpha=0.3;
    ctx.fillRect(startDomX,0,endDomX-startDomX,1);
  }
}

export default InPlotXRangeSelection;
