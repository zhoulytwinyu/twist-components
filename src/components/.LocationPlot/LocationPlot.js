import React, { PureComponent } from 'react';
import {bisect_left, bisect_right} from "bisect";
import {memoize_one} from "memoize";
import {toDomXCoord_Linear} from "plot-utils";
import VerticalSlabGrid from "../Basics/VerticalSlabGrid";

const COLOR_LUT={"other":"#5084de", "8S":"#de5f50", "8E":"#deb150", "home":"#7eca8a"}

class LocationPlot extends PureComponent {
  render() {
    let { data, /*[{start,end},...]*/
          minX,maxX,width,
          ...rest} = this.props;
    let data_withColor = this.assignColor(data,COLOR_LUT); // cached
    let starts = this.getStarts(data); // cached
    let ends = this.getEnds(data); // cached
    let startIndex = bisect_right(ends,minX);
    let endIndex = bisect_left(starts,maxX);
    let data_toPlot = data_withColor.slice(startIndex,endIndex+1);
    let data_toPlot_domCoord = data_toPlot.map(({start,end,...rest})=>({start:toDomXCoord_Linear(width,minX,maxX,start),
                                                                        end:toDomXCoord_Linear(width,minX,maxX,end),
                                                                        ...rest
                                                                        })
                                                );
    return (
      <VerticalSlabGrid data={data_toPlot_domCoord} width={width} {...rest} />
    );
  }
  
  assignColor = memoize_one( (data,color_lut)=>{
    return data.map(({name,...rest})=>({color:color_lut[name],
                                        ...rest})
                    );
  });
  
  getStarts = memoize_one((data)=> {
    return data.map(({start})=>start);
  });
  
  getEnds = memoize_one((data)=> {
    return data.map(({end})=>end);
  });
}

export default LocationPlot;
