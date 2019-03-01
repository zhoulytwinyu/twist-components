import React, { PureComponent } from 'react';
import VerticalGrid_Slab from "./VerticalGrid_Slab";

const COLOR_LUT={"other":"#5084de", "8S":"#de5f50", "8E":"#deb150", "home":"#7eca8a"}

class LocationPlot extends PureComponent {
  constructor(props) {
    super(props);
    this.memo_prevData = null;
    this.memo_starts = [];
    this.memo_ends = [];
    this.memo_colors = [];
  }
  
  render() {
    let { data, /*[{start,end,name},...]*/
          minX,maxX,width,
          ...rest} = this.props;
    if (this.memo_prevData !== data) {
      this.memo_prevData = data;
      this.memo_starts = data.map(({start})=>start);
      this.memo_ends = data.map(({end})=>end);
      this.memo_colors = data.map(({name})=>COLOR_LUT[name]);
    }
    return (
      <VerticalGrid_Slab  starts={this.memo_starts} ends={this.memo_ends} colors={this.memo_colors}
                          minX={minX} maxX={maxX} width={width}
                          {...rest} />
    );
  }
}

export default LocationPlot;
