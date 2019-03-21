import { Component } from 'react';
import {bisect_left,
        bisect_right} from "bisect";
import {fromDomXCoord_Linear} from "plot-utils";

class LocationsPlotHoverSelector extends Component {
  render(){
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    if (nextProps.hoveringPosition!==this.props.hoveringPosition) {
      return true;
    }
    return false
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
          hoveringPosition,
          selectHandler} = this.props;
    if (hoveringPosition===undefined) {
      return;
    }
    if (hoveringPosition===null) {
      selectHandler(null);
      return;
    }
    this.select_memo = this.select_memo || {};
    let memo = this.select_memo;
    if (memo.data !== data) {
      memo.data = data;
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
    }
    let hoverDomX = hoveringPosition.domX;
    let hoverX = fromDomXCoord_Linear(width,minX,maxX,hoverDomX);
    let startIndex = bisect_left(memo.starts,hoverX);
    let endIndex = bisect_right(memo.ends,hoverX);
    if (startIndex > endIndex) {
      selectHandler(null);
    }
    else {
      let selection = data[endIndex];
      selectHandler(selection);
    }
  }
}

export default LocationsPlotHoverSelector;
