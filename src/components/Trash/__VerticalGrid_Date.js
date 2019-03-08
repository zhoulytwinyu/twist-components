import React, { PureComponent } from "react";
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
    return (
      <VerticalGrid_Line  width={width} minX={minX} maxX={maxX}
                          Xs={memo.gridPos} colors={memo.colors}
                          {...rest}
                          />
    );
  }
}

export default VerticalGrid_Date;
