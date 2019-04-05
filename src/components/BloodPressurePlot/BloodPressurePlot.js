import React, { PureComponent } from "react";
import {toDomXCoord_Linear,
        toDomYCoord_Linear} from "plot-utils";

class BloodPressurePlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { DBP,MBP,SBP,
          minX,maxX,width,
          minY,maxY,height,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  
  draw() {
    let { DBP,MBP,SBP,
          minX,maxX,width,
          minY,maxY,height
          } = this.props;
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    ctx.clearRect(0,0,width,height);
    // Draw plot
    // DBP
    ctx.beginPath()
    for (let firstPoint=true, i=0; i<DBP.length; i++) {
      let {time,value} = DBP[i]
      let domX = toDomXCoord_Linear(width,minX,maxX,time)
      let domY = toDomYCoord_Linear(height,minY,maxY,value)
      if (firstPoint) {
        ctx.moveTo(domX,domY)
        firstPoint = false
      }
      else {
        ctx.lineTo(domX,domY)
      }
    }
    ctx.stroke()

    // MBP
    ctx.beginPath()
    for (let firstPoint=true, i=0; i<MBP.length; i++) {
      let {time,value} = MBP[i]
      let domX = toDomXCoord_Linear(width,minX,maxX,time)
      let domY = toDomYCoord_Linear(height,minY,maxY,value)
      if (firstPoint) {
        ctx.moveTo(domX,domY)
        firstPoint = false
      }
      else {
        ctx.lineTo(domX,domY)
      }
    }
    ctx.stroke()
    
    // SBP
    ctx.beginPath()
    for (let firstPoint=true, i=0; i<SBP.length; i++) {
      let {time,value} = SBP[i]
      let domX = toDomXCoord_Linear(width,minX,maxX,time)
      let domY = toDomYCoord_Linear(height,minY,maxY,value)
      if (firstPoint) {
        ctx.moveTo(domX,domY)
        firstPoint = false
      }
      else {
        ctx.lineTo(domX,domY)
      }
    }
    ctx.stroke()

    // Shade between DBP and SBP
    ctx.beginPath()
    for (let firstPoint=true, i=0; i<DBP.length; i++) {
      let {time,value} = DBP[i]
      let domX = toDomXCoord_Linear(width,minX,maxX,time)
      let domY = toDomYCoord_Linear(height,minY,maxY,value)
      if (firstPoint) {
        ctx.moveTo(domX,domY)
        firstPoint = false
      }
      else {
        ctx.lineTo(domX,domY)
      }
    }
    for (let i=SBP.length-1; i>=0; i--) {
      let {time,value} = SBP[i]
      let domX = toDomXCoord_Linear(width,minX,maxX,time)
      let domY = toDomYCoord_Linear(height,minY,maxY,value)
      ctx.lineTo(domX,domY)
    }
    ctx.closePath()
    ctx.fillStyle = "rgba(0,0,255,0.2)"
    ctx.fill()
  }
}

export default BloodPressurePlot;
