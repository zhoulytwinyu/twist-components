import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear,
        bisectFilterDataRange_columnsIndexed} from "plot-utils";
import {LABEL_DOMY,LABEL_DOMX_OFFSET,LABEL_WIDTH,LABEL_FONT} from "./ProcedurePlott/ProcedurePlotConstants";

const DISPLAY_SHORT_NAME_LUT = {"HLHS STAGE I, CARDIAC":"S1P",
                                "CHEST CLOSURE, CARDIAC OFF UNIT":"VAC ∆",
                                "GASTROSTOMY, LAPAROSCOPIC, GENSURG":"Hip osteoplasty",
                                "VESICOSTOMY CREATION/CLOSURE, GU":"GI",
                                "BIDIRECTIONAL GLEN SHUNT, CARDIAC":"GI"
                                };

const DISPLAY_STYLE_LUT = {"HLHS STAGE I, CARDIAC":0,
                            "CHEST CLOSURE, CARDIAC OFF UNIT":2,
                            "GASTROSTOMY, LAPAROSCOPIC, GENSURG":0,
                            "VESICOSTOMY CREATION/CLOSURE, GU":2,
                            "BIDIRECTIONAL GLEN SHUNT, CARDIAC":1
                            };

class ProcedurePlot extends PureComponent {
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
    this.plotProcedureTexts(ctx,width,height,bitmaps,startDomXs);
    ctx.globalAlpha = 0.3;
    this.plotProcedureLines(ctx,width,height,startDomXs,endDomXs,styles);
  }
  
  plotProcedureTexts(ctx,width,height,bitmaps,startDomXs) {
    for (let i=0; i<bitmaps.length; i++){
      let bitmap = bitmaps[i];
      let domStartX = startDomXs[i];
      ctx.drawImage(bitmap,domStartX-bitmap.width-5,5);
    }
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
  
  createTextBitmaps(texts,styles){
    let bitmaps = [];
    let bitmapCreator = { 0:this.createTextBitmap_style0,
                          1:this.createTextBitmap_style1,
                          2:this.createTextBitmap_style2
                          };
    for (let i=0; i<texts.length; i++) {
      let text = texts[i];
      let style = styles[i];
      bitmaps.push(bitmapCreator[style](text));
    }
    return bitmaps;
  }
  
  createTextBitmap_style0(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "bold 10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "bold 10px Sans";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "red";
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,width/2);
    return canvas;
  }
  
  createTextBitmap_style1(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "10px Sans";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "orange";
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,width/2);
    return canvas;
  }
  
  createTextBitmap_style2(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
    let width = 12;
    let height = ctx.measureText(text).width;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "10px Sans";
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

export default ProcedurePlot;

