import React, { PureComponent } from 'react';
import YAxisTwoLevelPanel from "./YAxisTwoLevelPanel";

class XAxisDatePlotYAxisTwoLevelPanel extends PureComponent{
  constructor(props){
    super(props);
    this.memo = {};
    this.memo.primaryStarts = [0];
    this.memo.primaryEnds = [1];
    this.memo.primaryColors = ["#646665"];
    this.memo.primaryBitmaps = [YAxisTwoLevelPanel.createPrimaryCategoryBitmap("")];
    this.memo.secondaryStarts = [0];
    this.memo.secondaryEnds = [1];
    this.memo.secondaryColors = ["#fedda7"];
    this.memo.secondaryBitmaps = [YAxisTwoLevelPanel.createSecondaryCategoryBitmap("Time")];
  }
  
  render () {
    let {width,height,minX,maxX...rest} = this.props;
    let {memo} = this;
    let primaryEnds = memo.primaryEnds.map((x)=>x*height);
    let secondaryEnds = memo.secondaryEnds.map((x)=>x*height);
    
    return (
      <YAxisTwoLevelPanel primaryStarts={memo.primaryStarts} primaryEnds={primaryEnds}
                          primaryColors={memo.primaryColors} primaryBitmaps={memo.primaryBitmaps}
                          secondaryStarts={memo.secondaryStarts} secondaryEnds={secondaryEnds}
                          secondaryColors={memo.secondaryColors} secondaryBitmaps={memo.secondaryBitmaps}
                          width={width} height={height} {...rest}/>
    );
  }
}

export default LocationPlotYAxisTwoLevelPanel;
