import React, {PureComponent} from "react";
import {toDomXCoord_Linear,toDomYCoord_Linear} from "plot-utils";

class RespiratoryScoresSelectionPoint extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render(){
    let { width,
          height}= this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{display:"block",width:width,height:height}}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw(){
    let { selection,
          width,minX,maxX,
          height,minY,maxY,
          } = this.props;
    if (!selection){
      let canvas = this.ref.current;
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0,0,width,height);
      return;
    }
    let {time, RespiratorySupportScore,ECMOScore} = selection;
    let domX = toDomXCoord_Linear(width,minX,maxX,time);
    let RSDomY = toDomYCoord_Linear(height,minY,maxY, RespiratorySupportScore);
    let ESDomY = toDomYCoord_Linear(height,minY,maxY,ECMOScore);
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    ctx.arc(domX, RSDomY, 4, 0, 2*Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(domX, ESDomY, 4, 0, 2*Math.PI);
    ctx.fill();
  }
}

export default RespiratoryScoresSelectionPoint;
