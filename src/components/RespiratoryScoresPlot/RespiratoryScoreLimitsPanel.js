import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";
// Component
import YAxisTwoLevelPanel from "../YAxisTwoLevelPanel";

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
  render() {
    let { height, minY, maxY,
          width,
          ...rest} = this.props;
    this.render_memo = this.render_memo || {};
    let memo = this.render_memo;
    if (memo.primaryCategories!==PRIMARY_CATEGORIES ||
        memo.secondaryCategories!==SECONDARY_CATEGORIES) {
      memo.primaryNames = PRIMARY_CATEGORIES.map(({name})=>name);
      memo.primaryStarts = PRIMARY_CATEGORIES.map(({start})=>start);
      memo.primaryEnds = PRIMARY_CATEGORIES.map(({end})=>end);
      memo.primaryColors = PRIMARY_CATEGORIES.map(({color})=>color);
      memo.primaryBitmaps = PRIMARY_CATEGORIES.map(({name})=>YAxisTwoLevelPanel.createPrimaryCategoryBitmap(""));
      memo.secondaryNames = SECONDARY_CATEGORIES.map(({name})=>name);
      memo.secondaryStarts = SECONDARY_CATEGORIES.map(({start})=>start);
      memo.secondaryEnds = SECONDARY_CATEGORIES.map(({end})=>end);
      memo.secondaryColors = SECONDARY_CATEGORIES.map((x,i)=>COLOR_CYCLE[i%COLOR_CYCLE.length]);
      memo.secondaryBitmaps = SECONDARY_CATEGORIES.map(({name})=>YAxisTwoLevelPanel.createSecondaryCategoryBitmap(name));
    }
    
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


