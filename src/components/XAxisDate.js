import React, { PureComponent } from "react";
import {bisect_left, bisect_right} from "bisect";
import {toDomXCoord_Linear,generateAxisDateGrid} from "plot-utils";
import XAxis from "./XAxis";

class XAxisDate extends PureComponent {
  constructor(props) {
    super(props);
    // Buffer
    this.memo = {};
    this.memo.rangeMinX = 0;
    this.memo.rangeMaxX = -1;
    this.memo.gridPos = null;
    this.memo.gridLabels = null;
    this.memo.gridBitmaps = null;
  }
  
  render() {
    let {width,minX,maxX,height,...rest} = this.props;
    let {memo} = this;
    if (memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX){
      memo.rangeMinX = minX-(maxX-minX)*100;
      memo.rangeMaxX = maxX+(maxX-minX)*100;
      let {gridPos,gridLabels} = generateAxisDateGrid(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.gridPos = gridPos;
      memo.gridBitmaps = gridLabels.map(this.createTextBitmaps);
    }

    let startIndex = Math.max(0,bisect_right(memo.gridPos,minX));
    let endIndex = Math.min(memo.gridPos.length-1,bisect_left(memo.gridPos,maxX));
    
    let domXs = memo.gridPos.slice(startIndex,endIndex+1).map( (x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let gridBitmaps = memo.gridBitmaps.slice(startIndex,endIndex+1);
    let positions = new Array(endIndex-startIndex+1).fill(1);
    
    return (
      <XAxis  width={width} height={height}
              Xs={domXs} bitmaps={gridBitmaps} positions={positions}
              {...rest}
              />
    );
  }

  createTextBitmaps(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = ctx.measureText(text).width;
    let height = 10;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "10px Sans";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }
}

export default XAxisDate;
