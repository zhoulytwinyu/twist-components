import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left} from "bisect";
import {fromDomXCoord_Linear} from "plot-utils";
import HoverInteractionBoxWithReference from "./HoverInteractionBoxWithReference";

class HoverSelectionXInteractionBoxWithReference extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.getXArray = memoize_one(this.getXArray);
  }
  
  render(){
    let { children,
          data, /*[{x,...rest}], sorted by x asc*/
          hoveringHandler, mouseOutHandler, selectHandler,
          ...rest} = this.props;
    return (
      <HoverInteractionBoxWithReference  {...rest}
                                          hoveringHandler={this.hoveringHandler}
                                          mouseOutHandler={this.mouseOutHandler}
                                          >
        {children}
      </HoverInteractionBoxWithReference>
    );
  }
  
  getXArray(data) {
    return data.map( ({x})=>x );
  }
  
  hoveringHandler = ({dataX,dataY}) => {
    let {x,data} = this.props;
    let {hoveringHandler, selectHandler} = this.props;
    hoveringHandler({dataX,dataY});
    let selection = this.getClosestObject(this.getXArray(data),data,dataX);
    this.updateSelection(selection);
  }
  
  mouseOutHandler = ({dataX,dataY}) => {
    let {mouseOutHandler, selectHandler} = this.props;
    mouseOutHandler({dataX,dataY});
    this.updateSelection(null);
  }
  
  updateSelection(obj){
    if (!this.memo) {
      this.memo = {};
    }
    let hoverSelection_JSON = JSON.stringify(obj);
    if (this.memo.hoverSelection_JSON != hoverSelection_JSON) {
      let {selectHandler} = this.props;
      selectHandler({selection:obj});
    }
  }
  
  getClosestObject(x,data,hoverX) {
    if (x.length === 0 || hoverX === null || hoverX === undefined) {
      return null;
    }
    let leftIndex = bisect_left(x,hoverX);
    if (leftIndex === -1) {
      return data[0];
    }
    if (leftIndex === x.length-1) {
      return data[leftIndex];
    }
    if (hoverX-x[leftIndex] <= x[leftIndex+1]-hoverX) {
      return data[leftIndex];
    }
    else {
      return data[leftIndex+1];
    }
  }
}

export default HoverSelectionXInteractionBoxWithReference;
