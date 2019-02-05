import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {fromDomXCoord_Linear,
        scatterPlot} from "plot-utils";
import {bisect_left} from "bisect";

class HoverSelectionAddOn extends PureComponent{
  constructor(props){
    super(props);
  }
  
  render() {
    return null;
  }
  
  componentDidMount() {
    this.selectPoint();
  }
  
  componentDidUpdate() {
    this.selectPoint();
  }
  
  selectPoint() {
    let { data, // Format: [{x,...}]
          hoverX} = this.props;
    let selection = this.getClosestObject(data,hoverX);
    this.handleUpdateSelection(selection);
  }
  
  getClosestObject(data,hoverX) {
    if (data.length === 0 || hoverX === null || hoverX === undefined) {
      return null;
    }
    let x = data.map( ({x})=>x );
    let leftIndex = bisect_left(x,hoverX);
    if (leftIndex === -1) {
      return data[0];
    }
    if (leftIndex === data.length-1) {
      return data[leftIndex];
    }
    if (hoverX-x[leftIndex] <= x[leftIndex+1]-hoverX) {
      return data[leftIndex];
    }
    else {
      return data[leftIndex+1];
    }
  }
  
  handleUpdateSelection(obj){
    if (!this.memo) {
      this.memo = {};
    }
    let hoverSelection_JSON = JSON.stringify(obj);
    if (this.memo.hoverSelection_JSON != hoverSelection_JSON) {
      let {updateSelectionHandler} = this.props;
      updateSelectionHandler({hoverSelection:obj});
    }
  }
}

export default HoverSelectionAddOn;
