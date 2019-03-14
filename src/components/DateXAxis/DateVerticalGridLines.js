import React, { PureComponent } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear,generateDateGrids} from "plot-utils";

class DateVerticalGridLines extends PureComponent {
  constructor(props) {
    super(props);
    this.ref= React.createRef();
  }
  
  render() {
    let { width,minX,maxX,
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
    let {minX,maxX,width} = this.props;
    let diffX = maxX-minX;
    // Generate grid if needed
    this.draw_memo = this.draw_memo || {validFromDiffX:0, validToDiffX: -1, rangeMinX:0, rangeMaxX: -1};
    let memo = this.draw_memo;
    if (memo.validFromDiffX>diffX ||
        diffX>memo.validToDiffX ||
        memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX
        ) {
      memo.rangeMinX = minX-10*diffX;
      memo.rangeMaxX = maxX+10*diffX;
      let {grids, validFromDiffX, validToDiffX} = generateDateGrids(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.validFromDiffX = validFromDiffX;
      memo.validToDiffX = validToDiffX;
      memo.grids = grids;
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.grids,minX));
    let endIndex = Math.min(memo.grids.length-1,bisect_left(memo.grids,maxX));
    let domXs = memo.grids.slice(startIndex,endIndex+1).map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    // Draw
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,1);
    ctx.globalAlpha = 0.1;
    this.verticalLinePlot(ctx,width,1,domXs);
  }
  
  verticalLinePlot(ctx,width,height,domXs){
    let x = null;
    let c = null;
    ctx.beginPath();
    for (let i=0; i<domXs.length; i++) {
      x = Math.round(domXs[i]);
      ctx.moveTo(x,0);
      ctx.lineTo(x,height);
    }
    ctx.stroke();
  }
}

export default DateVerticalGridLines;
