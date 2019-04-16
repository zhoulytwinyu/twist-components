import React, { PureComponent } from "react";
import {generateAxisDateGrid} from "plot-utils";
import XAxis from "./XAxis";

class XAxis_Date extends PureComponent {
  constructor(props) {
    super(props);
    // Buffer
    this.memo = {};
    this.memo.rangeMinX = 0;
    this.memo.rangeMaxX = -1;
    this.memo.gridPos = null;
    this.memo.gridLabels = null;
  }
  
  render() {
    let {width,minX,maxX,...rest} = this.props;
    let {memo} = this;
    if (memo.rangeMinX>minX ||
        maxX>memo.rangeMaxX){
      memo.rangeMinX = minX-(maxX-minX)*10;
      memo.rangeMaxX = maxX+(maxX-minX)*10;
      let {gridPos,gridLabels} = generateAxisDateGrid(minX,maxX,memo.rangeMinX,memo.rangeMaxX);
      memo.gridPos = gridPos;
      memo.gridLabels = gridLabels;
    }
    return (
      <XAxis  width={width} minX={minX} maxX={maxX}
              Xs={memo.gridPos} labels={memo.gridLabels}
              {...rest}
              />
    );
  }
}

export default XAxis_Date;
