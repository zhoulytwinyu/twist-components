import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left,
        bisect_right} from "bisect";

class HoverSelectionAddon extends PureComponent {
  constructor(props){
    super(props);
    this.lastHoverTimeStamp = null;
  }
  
  render() {
    return null;
  }
  
  componentDidUpdate(){
    let {hoverTimeStamp} = this.props;
    if (this.lastHoverTimeStamp === hoverTimeStamp) {
      return;
    }
    else {
      this.lastHoverTimeStamp=hoverTimeStamp
      this.select();
    }
  }
  
  select() {
    let {mode} = this.props;
    switch (mode) {
      case "left":
        this.selectLeft();
        break;
      case "right":
        this.selectRight();
        break;
      case "closest":
      default:
        this.selectClosest();
        break;
    }
  }
  
  selectLeft() {
    let {data,hoverX} = this.props;
    let dataX = this.getDataX(data);
    if (dataX.length === 0 || hoverX === null || hoverX === undefined) {
      this.updateSelection({selection:null});
      return;
    }
    let index = bisect_left(dataX,hoverX);
    if (index === -1) {
      this.updateSelection({selection:null});
      return;
    }
    else {
      this.updateSelection({selection:data[index]});
      return;
    }
  }
  
  selectRight() {
    let {data,hoverX} = this.props;
    let dataX = this.getDataX(data);
    if (dataX.length === 0 || hoverX === null || hoverX === undefined) {
      this.updateSelection({selection:null});
      return;
    }
    let index = bisect_right(dataX,hoverX);
    if (index === dataX.length) {
      this.updateSelection({selection:null});
      return;
    }
    else {
      this.updateSelection({selection:data[index]});
      return;
    }
  }
  
  selectClosest() {
    let {data,hoverX} = this.props;
    let dataX = this.getDataX(data);
    if (dataX.length === 0 || hoverX === null || hoverX === undefined) {
      this.updateSelection({selection:null});
      return;
    }
    let leftIndex = bisect_left(dataX,hoverX);
    if (leftIndex === -1) {
      this.updateSelection({selection:data[0]});
      return;
    }
    if (leftIndex === dataX.length-1) {
      this.updateSelection({selection:data[leftIndex]});
      return;
    }
    if (hoverX-dataX[leftIndex] <= dataX[leftIndex+1]-hoverX) {
      this.updateSelection({selection:data[leftIndex]});
      return;
    }
    else {
      this.updateSelection({selection:data[leftIndex+1]});
      return;
    }
  }
  
  updateSelection({selection}){
    if (!this.memo) {
      this.memo = {};
    }
    if (this.memo.selection !== selection) {
      let {selectHandler} = this.props;
      selectHandler({selection});
    }
  }
  
  getDataX = memoize_one((data) => {
    return data.map( ({x})=>x );
  });
}

export default HoverSelectionAddon;

