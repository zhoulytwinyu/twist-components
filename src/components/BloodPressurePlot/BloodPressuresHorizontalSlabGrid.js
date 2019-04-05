import React, { PureComponent } from 'react';
import {toDomYCoord_Linear} from "plot-utils";

class BloodPressuresHorizontalSlabGrid extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { height,width} = this.props;
    return (
      <canvas ref={this.ref} width={1} height={height} style={{display:"block",width,height}}></canvas>
    );
  }
  
  componentDidMount() {
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    let {height,minY,maxY} = this.props;
    ctx.fillStyle = "#fffef9";
    ctx.fillRect(0,0,1,height);
    ctx.fillStyle = "#fff7e4";
    for (let i=0; i<=200; i+=40) {
      let startDomY = Math.round(toDomYCoord_Linear(height,minY,maxY,i));
      let endDomY = Math.round(toDomYCoord_Linear(height,minY,maxY,i+20));
      let domH = endDomY-startDomY;
      ctx.fillRect(0,startDomY,1,domH);
    }
  }
}

export default BloodPressuresHorizontalSlabGrid;
