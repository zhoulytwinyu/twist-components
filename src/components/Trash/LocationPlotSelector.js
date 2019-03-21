import React, { PureComponent } from 'react';
import {bisect_left,
        bisect_right} from "bisect";

class LocationPlotHoverSelector extends PureComponent {
  constructor(props) {
    super(props);
    this.memo = {};
    this.memo.data = null;
    this.memo.starts = null;
    this.memo.ends = null;
  }
  
  render(){
    return null;
  }
  
  componentDidMount(){
    this.select();
  }

  componentDidUpdate(){
    this.select();
  }

  select() {
    let { data, /* [{start,end},...] sorted asc*/
          minX,maxX,width,
          hoverX,
          selectHandler,
          ...rest} = this.props;
    let {memo} = this;
    if (hoverX === null || hoverX === undefined) {
      return null;
    }
    if (memo.data !== data) {
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
    }
    let leftIndex = Math.max(0,bisect_left(memo.starts,hoverX));
    let rightIndex = Math.min(memo.ends.length-1,bisect_right(memo.ends,hoverX));
    if (leftIndex > rightIndex) {
      return null;
    }
    else {
      let selection = data[rightIndex];
      selectHandler(selection);
    }
  }
}

export default LocationPlotHoverSelector;
