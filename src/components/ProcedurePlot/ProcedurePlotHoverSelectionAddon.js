import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";

class ProcedurePlotHoverSelectionAddon extends PureComponent {
  constructor(props) {
    super(props);
    this.lastHoverTimeStamp = null;
  }
  
  render() {
    return null;
  }

  componentDidUpdate(){
    let {hoverTimeStamp} = this.props;
    
    if (this.lastHoverTimeStamp===hoverTimeStamp) {
      return;
    }
    else {
      this.lastHoverTimeStamp=hoverTimeStamp;
      this.select();
    }
  }
  
  select() {
    let { hoverX,data} = this.props;
    if ( hoverX === null ||
         hoverX === undefined) {
      this.updateSelection(null);
      return;
    }

    let dataXArray = this.getDataXArray(data);
    let index = bisect_left(dataXArray,hoverX);
    if (index === -1) {
      this.updateSelection(null);
    }
    else {
      this.updateSelection(data[index]);
    }
  }
  
  getDataXArray = memoize_one( (data)=>{
    return data.map( ({time}) => time );
  });
  
  updateSelection(selection){
    if (!this.memo) {
      this.memo = {};
    }
    if (this.memo.selection !== selection) {
      let {selectHandler} = this.props;
      selectHandler(selection);
    }
  }
}

export default ProcedurePlotHoverSelectionAddon;
