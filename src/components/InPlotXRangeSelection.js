import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
        
class InPlotXRangeSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { startDataX,endDataX,
          minX, maxX, width,...rest} = this.props;
    return (
      <canvas ref={this.ref} height={1} width={width} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let {startDataX,endDataX,width} = this.props;
    // Clear canvas
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    // Don't draw if range data missing
    if (startDataX === undefined || startDataX === null ||
        endDataX === undefined || endDataX === null ) {
      return;
    }
    // Don't draw if range = 0
    let startDomX = Math.max(0,this.toDomXCoord(startDataX));
    let endDomX = Math.min(width,this.toDomXCoord(endDataX));
    if (startDomX === endDomX) {
      return;
    }
    // Draw
    ctx.fillStyle = "rgba(100,100,100,0.3)";
    ctx.fillRect(startDomX,0,endDomX-startDomX,1);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default InPlotXRangeSelection;
