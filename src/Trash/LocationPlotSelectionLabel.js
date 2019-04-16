import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
import "./LocationPlotSelectionLabel.css";

class LocationPlotSelectionLabel extends PureComponent {
  render() {
    let { selection, /* {name,start,end} */
          minX,maxX,width,
          ...rest} = this.props;
    if (!selection) {
      return null;
    }
    let domStart = toDomXCoord_Linear(width,minX,maxX,selection.start);
    let domEnd = toDomXCoord_Linear(width,minX,maxX,selection.end);
    let label = selection.name;
    let labelDomX = (Math.max(0,domStart)+Math.min(width,domEnd))/2;
    return (
      <div {...rest}>
        <div className="LocationPlotSelectionLabel-floatDiv" style={{left:labelDomX}}>
          {label}
        </div>
      </div>
    );
  }
}

export default LocationPlotSelectionLabel;
