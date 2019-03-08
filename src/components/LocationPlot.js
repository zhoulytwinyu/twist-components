import React, { PureComponent } from 'react';
import VerticalGridSlab from "./VerticalGridSlab";

const COLOR_LUT={"other":"#5084de",
                 "8S":"#de5f50",
                 "8E":"#deb150",
                 "home":"#7eca8a"
                 };

class LocationPlot extends PureComponent {
  constructor(props) {
    super(props);
    this.memo = {};
    this.memo.starts = null;
    this.memo.ends = null;
    this.memo.colors = null;
  }
  
  render() {
    let { data, /*[{start,end,name},...]*/
          minX,maxX,width,
          ...rest} = this.props;
    let {memo} = this;
    if (memo.data !== data) {
      this.memo.data = data;
      this.memo.starts = data.map(({start})=>start);
      this.memo.ends = data.map(({end})=>end);
      this.memo.colors = data.map(({name})=>COLOR_LUT[name]);
    }
    return (
      <VerticalGridSlab  starts={this.memo.starts} ends={this.memo.ends} colors={this.memo.colors}
                          minX={minX} maxX={maxX} width={width}
                          {...rest} />
    );
  }
}

export default LocationPlot;
