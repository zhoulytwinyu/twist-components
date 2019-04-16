import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomYCoord_Linear} from "plot-utils";
// Component
import {createPrimaryCategoryBitmap,createSecondaryCategoryBitmap,
        drawPrimaryCategories,drawSecondaryCategories} from "../Modules/YAxisTwoLevelPanelPlotters";

const SECONDARY_CATEGORIES = [
                  {name:"",start:0,end:1}, //RA
                  {name:"",start:1,end:6}, //NC/MASK/BB
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

class RespiratoryScoresPlotLimitsPanel extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }
  
  render() {
    let { height,
          width } = this.props;
    return (
      <canvas ref={this.ref} width={width} height={height} style={{display:"block",width:width,height:height}}></canvas>
    );
  }
  
  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw(){
    let { height, minY, maxY,
          width,secondaryCategories,primaryCategories
          } = this.props;
    this.render_memo = this.render_memo || {};
    let memo = this.render_memo;
    if (memo.primaryCategories!==primaryCategories ||
        memo.secondaryCategories!==secondaryCategories) {
      memo.primaryCategories = primaryCategories;
      memo.secondaryCategories = secondaryCategories;
      // Sort
      let sortedPrimaryCategories = primaryCategories.slice().sort(this.categoryCompareFn);
      let sortedSecondaryCategories = secondaryCategories.slice().sort(this.categoryCompareFn);
      // Derive
      memo.primaryStarts = sortedPrimaryCategories.map(({start})=>start);
      memo.primaryEnds = sortedPrimaryCategories.map(({end})=>end);
      memo.primaryColors = sortedPrimaryCategories.map(({color})=>color);
      memo.primaryBitmaps = sortedPrimaryCategories.map(({name})=>createPrimaryCategoryBitmap(""));
      memo.secondaryStarts = sortedSecondaryCategories.map(({start})=>start);
      memo.secondaryEnds = sortedSecondaryCategories.map(({end})=>end);
      memo.secondaryColors = sortedSecondaryCategories.map((x,i)=>COLOR_CYCLE[i%COLOR_CYCLE.length]);
      memo.secondaryBitmaps = sortedSecondaryCategories.map(({name})=>createSecondaryCategoryBitmap(name));
    }
    // Filter
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
    // Plot
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    drawPrimaryCategories(ctx,width,height,primaryBitmaps,primaryColors,primaryStarts,primaryEnds);
    drawSecondaryCategories(ctx,width,height,secondaryBitmaps,secondaryColors,secondaryStarts,secondaryEnds);
  }
  
  categoryCompareFn(a,b) {
    if (a.start===b.start)
      return a.start-b.start;
    else
      return a.end-b.end;
  }
}

RespiratoryScoresPlotLimitsPanel.defaultProps = {
  secondaryCategories:SECONDARY_CATEGORIES,
  primaryCategories:PRIMARY_CATEGORIES
}
export default RespiratoryScoresPlotLimitsPanel;
