import React, { PureComponent } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";

class VerticalGridSlab extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
    // memo
    this.memo = {};
    this.memo.startDomXs = [];
    this.memo.endDomXs = [];
  }
  
  render() {
    let { width,minX,maxX,
          starts,ends,colors,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} width={width} height={1} {...rest}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate() {
    this.draw();
  }
  
  draw() {
    let {minX,maxX,width,starts,ends,colors} = this.props;
    let {memo} = this;
    memo.startDomXs.length = starts.length;
    memo.endDomXs.length = ends.length;
    // Filter
    let startIndex = Math.max(0,bisect_right(ends,minX));
    let endIndex = Math.min(starts.length-1,bisect_left(starts,maxX));
    // Coord convert
    for (let i=startIndex; i<=endIndex; i++) {
      memo.startDomXs[i] = toDomXCoord_Linear(width,minX,maxX,starts[i]);
      memo.endDomXs[i] = toDomXCoord_Linear(width,minX,maxX,ends[i]);
    }
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    this.verticalSlabPlot(ctx,width,1,memo.startDomXs,memo.endDomXs,colors,startIndex,endIndex);
  }
  
  verticalSlabPlot(ctx,width,height,startDomXs,endDomXs,colors,startIndex,endIndex){
    let s = null;
    let e = null;
    let c = null;
    for (let i=startIndex; i<=endIndex; i++) {
      s = Math.max(0,Math.round(startDomXs[i]));
      e = Math.min(width,Math.round(endDomXs[i]));
      c = colors[i];
      ctx.fillStyle = c;
      ctx.fillRect(s,0,e-s,height);
    }
  }
}

export default VerticalGridSlab;
