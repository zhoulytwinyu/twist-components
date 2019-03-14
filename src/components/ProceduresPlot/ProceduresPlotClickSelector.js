import React, { Component } from "react";
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";
// Import constants
import {DISPLAY_SHORT_NAME_LUT,DISPLAY_STYLE_LUT} from "./ProceduresPlotContants";

class ProcedurePlotClickSelector extends Component {
  render() {
    return null;
  }

  shouldComponentUpdate(nextProps,nextState){
    if (nextProps.clickEvent===this.props.clickEvent) {
      return false;
    }
    return true;
  }
  
  componentDidUpdate(){
    this.select();
  }
  
  select() {
    let { data,
          minX,maxX,width,height,
          clickEvent} = this.props;
    console.log(clickEvent);
    this.select_memo = this.select_memo || {};
    let memo = this.select_memo;
    if (!memo.canvas) {
      memo.canvas = document.createElement("canvas");
      memo.canvas.width = 1;
      memo.canvas.height = 1;
    }
    // Column index data and fill bitmaps etc.
    if (memo.data !== data ) {
      memo.data = data;
      memo.names = data.map(({name})=>name);
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
      memo.displays = memo.names.map((name)=>DISPLAY_SHORT_NAME_LUT[name]);
      memo.displaySizes = this.getDisplaySizes(memo.displays,memo.styles);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minX));
    let endIndex = Math.min(data.length-1,bisect_left(memo.ends,maxX));
    // Coordicate conversion
    let startDomXs = memo.starts.slice(startIndex,endIndex+1).map( (start)=> toDomXCoord_Linear(width,minX,maxX,start) );
    let endDomXs =  memo.ends.slice(startIndex,endIndex+1).map( (end)=> toDomXCoord_Linear(width,minX,maxX,end) );
    let displaySizes = memo.displaySizes.slice(startIndex,endIndex+1);
    //~ // Clear plots
    //~ let canvas = memo.canvas;
    //~ let ctx = canvas.getContext("2d");
    //~ ctx.clearRect(0,0,1,1);
    //~ ctx.translate();
    //~ for (let i=startDomXs.length-1; i>=0; i--) {
      //~ this.plotProcedureForPicking(ctx,width,height,startDomXs,endDomXs,displaySizes);
    //~ }
  }
  
  plotProcedureForPicking(ctx,width,height,startDomX,endDomX,displaySize) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    let lineWidth = Math.max(1,endDomX-startDomX);
    let labelStartDomX = startDomX-5-displaySize.width;
    let labelStartDomY = 5;
    ctx.fillRect(startDomX,0,lineWidth,height);
    ctx.fillRect(labelStartDomX,labelStartDomY,lineWidth,displaySize.height);
  }
  
  plotProcedureLines(ctx,width,height,startDomXs,endDomXs,styles) {
    let linePlotter = { 0:this.plotLine_style0,
                        1:this.plotLine_style1,
                        2:this.plotLine_style2
                        };
    for (let i=0; i<startDomXs.length; i++){
      let startDomX = startDomXs[i];
      let endDomX = endDomXs[i];
      let style = styles[i];
      linePlotter[style](ctx,width,height,startDomX,endDomX);
    }
  }
  
  getDisplaySizes(texts,styles){
    let sizes = [];
    for (let i=0; i<texts.length; i++) {
      let text = texts[i];
      let style = styles[i];
      let size;
      switch (style) {
        case 0:
        default:
          size = this.getDisplaySize_style0(text);
          break;
        case 1:
          size = this.getDisplaySizes_style1(text);
          break;
        case 2:
          size = this.getDisplaySizes_style2(text);
          break;
      }
      sizes.push(size);
    }
    return sizes;
  }
  
  getDisplaySize_style0(text) {
    this.getDisplaySize_memo = this.getDisplaySize_memo || {};
    let memo = this.getDisplaySize_memo;
    memo.canvas = memo.canvas || document.createElement("canvas");
    let ctx = memo.canvas.getContext("2d");
    ctx.font = "bold 10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    return {width,height};
  }
  
  getDisplaySize_style1(text) {
    this.getDisplaySize_memo = this.getDisplaySize_memo || {};
    let memo = this.getDisplaySize_memo;
    memo.canvas = memo.canvas || document.createElement("canvas");
    let ctx = memo.canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    return {width,height};
  }
  
  getDisplaySize_style2(text) {
    this.getDisplaySize_memo = this.getDisplaySize_memo || {};
    let memo = this.getDisplaySize_memo;
    memo.canvas = memo.canvas || document.createElement("canvas");
    let ctx = memo.canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    return {width,height};
  }
}

export default ProcedurePlotClickSelector;
