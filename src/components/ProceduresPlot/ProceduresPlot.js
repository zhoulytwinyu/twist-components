import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";
// Import constants
import {DISPLAY_SHORT_NAME_LUT,DISPLAY_STYLE_LUT} from "./ProceduresPlotContants";

class ProceduresPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.data = null;
  }

  render() {
    let { data, /*[{name,start,end}]*/
          minX,maxX,height,width,
          ...rest} = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} {...rest}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { data,
          minX,maxX,width,height} = this.props;
    // Column index data and fill bitmaps etc.
    let {memo} = this;
    if (memo.data !== data ) {
      memo.data = data;
      memo.names = data.map(({name})=>name);
      memo.starts = data.map(({start})=>start);
      memo.ends = data.map(({end})=>end);
      memo.styles = memo.names.map((name)=>DISPLAY_STYLE_LUT[name]);
      memo.displays = memo.names.map((name)=>DISPLAY_SHORT_NAME_LUT[name]);
      memo.bitmaps = this.createTextBitmaps(memo.displays,memo.styles);
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minX));
    let endIndex = Math.min(data.length-1,bisect_left(memo.ends,maxX));
    // Coordicate conversion
    let startDomXs = memo.starts.slice(startIndex,endIndex+1).map( (start)=> toDomXCoord_Linear(width,minX,maxX,start) );
    let endDomXs =  memo.ends.slice(startIndex,endIndex+1).map( (end)=> toDomXCoord_Linear(width,minX,maxX,end) );
    let bitmaps = memo.bitmaps.slice(startIndex,endIndex+1);
    let styles = memo.styles.slice(startIndex,endIndex+1);
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,width,height);
    // Plot
    ctx.globalAlpha = 0.3;
    this.plotProcedures(ctx,width,height,startDomXs,endDomXs,bitmaps,styles);
  }
  
  plotProcedures(ctx,width,height,startDomXs,endDomXs,bitmaps,styles) {
    for (let i=0; i<startDomXs.length; i++){
      let startDomX = startDomXs[i];
      let endDomX = endDomXs[i];
      let bitmap = bitmaps[i];
      let style = styles[i];
      // Draw label
      ctx.drawImage(bitmap,startDomX-bitmap.width-5,5);
      // Draw line
      this.drawProcedureLine(ctx,width,height,startDomX,endDomX,style);
    }
  }
  
  drawProcedureLine(ctx,width,height,startDomX,endDomX,style) {
    switch (style) {
      case 0:
      default:
        this.plotLine_style0(ctx,width,height,startDomX,endDomX);
        break;
      case 1:
        this.plotLine_style1(ctx,width,height,startDomX,endDomX);
        break;
      case 2:
        this.plotLine_style2(ctx,width,height,startDomX,endDomX);
        break;
    }
  }
  
  createTextBitmaps(texts,styles){
    let bitmaps = [];
    for (let i=0; i<texts.length; i++) {
      let text = texts[i];
      let style = styles[i];
      let bitmap;
      switch (style) {
        case 0:
        default:
          bitmap = this.createTextBitmap_style0(text);
          break;
        case 1:
          bitmap = this.createTextBitmap_style1(text);
          break;
        case 2:
          bitmap = this.createTextBitmap_style2(text);
          break;
      }
      bitmaps.push(bitmap);
    }
    return bitmaps;
  }
  
  createTextBitmap_style0(text) {
    let font = "bold 10px Sans"
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "red";
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,width/2);
    return canvas;
  }
  
  createTextBitmap_style1(text) {
    let font = "10px Sans";
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "orange";
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,width/2);
    return canvas;
  }
  
  createTextBitmap_style2(text) {
    let font = "10px Sans";
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = font;
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = font;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "black";
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,width/2);
    return canvas;
  }
  
  plotLine_style0(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    ctx.lineWidth = Math.max(endDomX-startDomX,1);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
  
  plotLine_style1(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    ctx.lineWidth = Math.max(endDomX-startDomX,1);
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
  
  plotLine_style2(ctx,width,height,startDomX,endDomX) {
    startDomX = Math.round(startDomX);
    endDomX = Math.round(endDomX);
    ctx.lineWidth = Math.max(endDomX-startDomX,1);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
}

export default ProceduresPlot;

