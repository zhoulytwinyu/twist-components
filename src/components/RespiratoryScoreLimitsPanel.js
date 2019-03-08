import React, { PureComponent } from 'react';
import {bisect_left, bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";
import YAxisTwoLevelPanel from "./YAxisTwoLevelPanel";

const SECONDARY_CATEGORIES = [
                  {name:"RA",start:0,end:1},
                  {name:"NC/MASK/BB",start:1,end:6},
                  {name:"HFNC/CPAP",start:6,end:16},
                  {name:"BIPAP",start:16,end:26},
                  {name:"PSV",start:26,end:36},
                  {name:"PCV/VCV",start:36,end:70},
                  {name:"HFOV/HFJV",start:70,end:81},
                  {name:"ECMO",start:81,end:100}  
                  ];
const PRIMARY_CATEGORIES = [{name:"",start:0,end:26,color:"#a8ebe4"},
                            {name:"",start:26,end:81,color:"#ff891f"},
                            {name:"",start:81,end:100,color:"#ef1110"},
                            ];
const COLOR_CYCLE = ["#feefce","#fffbe7"];

class RespiratoryScoreLimitsPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.memo = {};
    this.memo.primaryNames = PRIMARY_CATEGORIES.map(({name})=>name);
    this.memo.primaryStarts = PRIMARY_CATEGORIES.map(({start})=>start);
    this.memo.primaryEnds = PRIMARY_CATEGORIES.map(({end})=>end);
    this.memo.primaryColors = PRIMARY_CATEGORIES.map(({color})=>color);
    this.memo.primaryBitmaps = PRIMARY_CATEGORIES.map(({name})=>YAxisTwoLevelPanel.createPrimaryCategoryBitmap(""));
    this.memo.secondaryNames = SECONDARY_CATEGORIES.map(({name})=>name);
    this.memo.secondaryStarts = SECONDARY_CATEGORIES.map(({start})=>start);
    this.memo.secondaryEnds = SECONDARY_CATEGORIES.map(({end})=>end);
    this.memo.secondaryColors = SECONDARY_CATEGORIES.map((x,i)=>COLOR_CYCLE[i%COLOR_CYCLE.length]);
    this.memo.secondaryBitmaps = SECONDARY_CATEGORIES.map(({name})=>YAxisTwoLevelPanel.createSecondaryCategoryBitmap(name));
  }
  
  render() {
    let { height, minY, maxY,
          width,
          ...rest} = this.props;
    let {memo} = this;
    let primaryStartIndex = Math.max(0,bisect_right(memo.primaryEnds,minY));
    let primaryEndIndex = Math.min(memo.primaryStarts.length-1,bisect_left(memo.primaryStarts,maxY));
    let secondaryStartIndex = Math.min(0,bisect_right(memo.secondaryEnds,minY));
    let secondaryEndIndex = Math.min(memo.secondaryStarts.length-1,bisect_left(memo.secondaryStarts,maxY));
    // Coordinate
    let primaryStarts = memo.primaryEnds.slice(primaryStartIndex,primaryEndIndex+1)
                                .map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let primaryEnds = memo.primaryStarts.slice(primaryStartIndex,primaryEndIndex+1)
                              .map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let primaryBitmaps = memo.primaryBitmaps.slice(primaryStartIndex,primaryEndIndex+1);
    let primaryColors = memo.primaryColors.slice(primaryStartIndex,primaryEndIndex+1);
    let secondaryStarts = memo.secondaryEnds.slice(secondaryStartIndex,secondaryEndIndex+1)
                                              .map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let secondaryEnds = memo.secondaryStarts.slice(secondaryStartIndex,secondaryEndIndex+1)
                                              .map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let secondaryBitmaps = memo.secondaryBitmaps.slice(secondaryStartIndex,secondaryEndIndex+1);
    let secondaryColors = memo.secondaryColors.slice(secondaryStartIndex,secondaryEndIndex+1);
    return (
      <YAxisTwoLevelPanel primaryStarts={primaryStarts} primaryEnds={primaryEnds}
      primaryColors={primaryColors} primaryBitmaps={primaryBitmaps}
                          secondaryStarts={secondaryStarts} secondaryEnds={secondaryEnds}
                          secondaryColors={secondaryColors} secondaryBitmaps={secondaryBitmaps}
                          height={height} width={width}
                          {...rest}
                          />
    );
  }
}

export default RespiratoryScoreLimitsPanel;


