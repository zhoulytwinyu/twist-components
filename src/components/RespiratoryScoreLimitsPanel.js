import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {rowIndexedToColumnIndexed,
        columnIndexedToRowIndexed,
        bisectFilterDataRange_columnsIndexed,
        toDomYCoord_Linear} from "plot-utils";
import YAxisTwoLevelPanel from "./Basics/YAxisTwoLevelPanel";

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
    // Index by column
    let priCat_columnIndexed = this.columnIndexPrimaryCategories(PRIMARY_CATEGORIES);
    let secCat_columnIndexed = this.columnIndexSecondaryCategories(SECONDARY_CATEGORIES);
    // Fill bitmaps and colors
    let priCat_filled = { ...priCat_columnIndexed,
                          bitmap: this.createPrimaryCategoriesBitmaps(priCat_columnIndexed["name"])};
    let secCat_filled = { ...secCat_columnIndexed,
                          color: this.assignSecondaryCategoryColors(secCat_columnIndexed["name"]),
                          bitmap: this.createSecondaryCategoriesBitmaps(secCat_columnIndexed["name"])};
                          
                          console.log(priCat_filled,secCat_filled);
    // Filter
    let priCat_filtered = bisectFilterDataRange_columnsIndexed(priCat_filled,"start","end",minY,maxY);
    let secCat_filtered = bisectFilterDataRange_columnsIndexed(secCat_filled,"start","end",minY,maxY);
    // Coordinate
    let domStarts = null;
    let domEnds = null;
    domStarts = priCat_filtered["end"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    domEnds = priCat_filtered["start"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let priCat_filtered_domCoord = {...priCat_filtered, start:domStarts, end:domEnds};
    domStarts = secCat_filtered["end"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    domEnds = secCat_filtered["start"].map( (y)=>toDomYCoord_Linear(height,minY,maxY,y));
    let secCat_filtered_domCoord = {...secCat_filtered, start:domStarts, end:domEnds};
    // To row indexed
    let priCat = columnIndexedToRowIndexed(priCat_filtered_domCoord,["start","end","bitmap","color"]);
    let secCat = columnIndexedToRowIndexed(secCat_filtered_domCoord,["start","end","bitmap","color"]);
    return (
      <YAxisTwoLevelPanel primaryCategories={priCat} secondaryCategories={secCat}
                          height={height} width={width}
                          {...rest}
                          />
    );
  }
  
  columnIndexPrimaryCategories = memoize_one( (primaryCategories)=>{
    return rowIndexedToColumnIndexed(primaryCategories,["name","start","end","color"]);
  });
  
  createPrimaryCategoriesBitmaps = memoize_one( (texts)=>{
    return texts.map(YAxisTwoLevelPanel.createPrimaryCategoryBitmap);
  });
  
  columnIndexSecondaryCategories = memoize_one( (secondaryCategories)=>{
    return rowIndexedToColumnIndexed(secondaryCategories,["name","start","end"]);
  });
  
  createSecondaryCategoriesBitmaps = memoize_one( (texts)=>{
    return texts.map(YAxisTwoLevelPanel.createSecondaryCategoryBitmap);
  });
  
  assignSecondaryCategoryColors = memoize_one( (texts)=>{
    return texts.map( (x,i)=> COLOR_CYCLE[i%COLOR_CYCLE.length] );
  });
  
}

export default RespiratoryScoreLimitsPanel;


