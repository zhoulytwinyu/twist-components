import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {bisect_left,
        bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";
import "./LocationPlotHoverLabel.css";

class LocationPlotHoverLabel extends PureComponent {
  render() {
    let { data, /* [{name,start,end},...] sorted asc */
          minX,maxX,width,
          hoverX,
          ...rest} = this.props;
    if (hoverX === null || hoverX === undefined) {
      return null;
    }
    let {starts,ends} = this.extractStartsAndEnds(data);
    let selectionLeftIndex = bisect_left(starts,hoverX);
    let selectionRightIndex = bisect_right(ends,hoverX);
    if (selectionLeftIndex > selectionRightIndex ||
        selectionLeftIndex===-1 ||
        selectionRightIndex===data.length ) {
      return null;
    }
    let {start,end,name} = data[selectionRightIndex];
    let labelDomX = this.toDomXCoord( (Math.max(start,minX)+Math.min(end,maxX))/2 );
    return (
      <div {...rest}>
        <div className="LocationPlotLabel-floatDiv" style={{left:labelDomX}}>
          {name}
        </div>
      </div>
    );
  }

  extractStartsAndEnds = memoize_one( (data) => {
    let starts = data.map( ({start}) => start);
    let ends = data.map( ({end}) => end);
    return {starts,ends};
  });
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default LocationPlotHoverLabel;
