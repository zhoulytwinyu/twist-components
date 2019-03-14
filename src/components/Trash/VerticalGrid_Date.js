import React, { PureComponent } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";
import {generateAxisDateGrid} from "plot-utils";
import VerticalGrid_Line from "./VerticalGrid_Line";

class VerticalGrid_Date extends PureComponent {
  constructor(props) {
    super(props);
    // Buffer
    this.memo = {};
    this.memo.rangeMinX = 0;
    this.memo.rangeMaxX = -1;
    this.memo.gridPos = null;
    this.memo.colors = null;
  }
  
  render() {
    let {width,minX,maxX,...rest} = this.props;
    let {memo} = this;
    if (memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX){
      memo.rangeMinX = minX-(maxX-minX)*10;
      memo.rangeMaxX = maxX+(maxX-minX)*10;
      let {gridPos} = generateAxisDateGrid(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.gridPos = gridPos;
      memo.colors = new Array(gridPos.length).fill("black");
    }
    let startIndex = Math.max(0,bisect_right(memo.gridPos,minX));
    let endIndex = Math.min(memo.gridPos.length-1,bisect_left(memo.gridPos,maxX));
    let gridPos = memo.gridPos.slice(startIndex,endIndex+1)
                              .map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let colors = memo.colors.slice(startIndex,endIndex+1);
    return (
      <VerticalGrid_Line  width={width}
                          Xs={gridPos} colors={colors}
                          {...rest}
                          />
    );
  }
}

export default VerticalGrid_Date;
