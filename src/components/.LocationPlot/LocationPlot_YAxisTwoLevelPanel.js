import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import YAxisTwoLevelPanel from "../Basics/YAxisTwoLevelPanel";

class LocationPlot_YAxisTwoLevelPanel extends PureComponent{
  render () {
    let {width,height,...rest} = this.props;
    let primaryCategories = this.preparePrimaryCategories(height);
    let secondaryCategories = this.prepareSecondaryCategories(height);
    
    return (
      <YAxisTwoLevelPanel primaryCategories={primaryCategories}
                          secondaryCategories={secondaryCategories}
                          width={width} height={height} {...rest}/>
    );
  }
  
  preparePrimaryCategories = memoize_one((height)=>{
    let bitmap = YAxisTwoLevelPanel.createPrimaryCategoryBitmap("");
    return [{start:0,end:height,bitmap:bitmap,color:"#646665"}];
  });
  
  prepareSecondaryCategories = memoize_one((height)=>{
    let bitmap = YAxisTwoLevelPanel.createSecondaryCategoryBitmap("Location");
    return [{start:0,end:height,bitmap:bitmap,color:"#fedda7"}];
  });
}

export default LocationPlot_YAxisTwoLevelPanel;
