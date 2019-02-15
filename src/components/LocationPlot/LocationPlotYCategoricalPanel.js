import React, { PureComponent } from 'react';
import YCategoricalPanel from "../YCategoricalPanel";
import "./LocationPlotYCategoricalPanel.css";
const CATEGORY_WIDTH = 30;
const CATEGORY = [ {start:0,end:1,
                    bgStyle:{fillStyle:"#656565"}
                    }];
const SUBCATEOGRY = [{start:0,end:1,name:"Location",
                      bgStyle:{fillStyle:"#fedda7"},
                      textStyle:{fillStyle:"black",font:"bold 16px Sans",textAlign:"left",textBaseline:"middle"},
                      textPosition:3}]

class LocationPlotYCategoricalPanel extends PureComponent{
  render () {
    let {width,height,...rest} = this.props;
    return (
      <div {...rest}>
        <div style={{position:"absolute",width:CATEGORY_WIDTH,height:height}}>
          <YCategoricalPanel  className="LocationPlotYCategoricalPanel-contained"
                              category={CATEGORY}
                              width={CATEGORY_WIDTH} height={height} rowHeight={height}
                              />
        </div>
        <div style={{position:"absolute",width:width-CATEGORY_WIDTH,height:height,left:CATEGORY_WIDTH}}>
          <YCategoricalPanel  className="LocationPlotYCategoricalPanel-contained"
                              category={SUBCATEOGRY}
                              width={width-CATEGORY_WIDTH} height={height} rowHeight={height}
                              />
        </div>
      </div>
    );
  }
}

export default LocationPlotYCategoricalPanel;
