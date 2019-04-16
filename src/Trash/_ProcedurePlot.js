import React, { PureComponent } from 'react';
import {bisect_left,bisect_right} from "bisect";
import {toDomXCoord_Linear} from "plot-utils";
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

class ProcedurePlotMain extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.prevData = null;
    this.memo.names = [];
    this.memo.starts = [];
    this.memo.ends = [];
    this.memo.styles = [];
    this.memo.bitmaps = [];
    this.memo.startDomXs = [];
    this.memo.endDomXs = [];
  }

  render() {
    let { data, /*[{name,start,end,style}]*/
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
          selection,
          minX,maxX,width,height} = this.props;
    let {memo} = this;
    // Get columns and fill bitmaps
    if (memo.prevData !== data ){
      memo.names.length = data.length;
      memo.starts.length = data.length;
      memo.ends.length = data.length;
      memo.styles.length = data.length;
      memo.bitmaps.length = data.length;
      memo.startDomXs.length = data.length;
      memo.endDomXs.length = data.length;
      for (let i=0; i<data.length; i++) {
        memo.names[i] = data[i]["name"];
        memo.starts[i] = data[i]["start"];
        memo.ends[i] = data[i]["end"];
        memo.bitmaps[i] = this.createTextBitmap_style0(data[i]["name"]);
        memo.styles[i] = DISPLAY_STYLE_LUT[data[i]["name"]];
      }
    }
    // Filter
    let startIndex = Math.max(0,bisect_right(memo.ends,minX));
    let endIndex = Math.min(data.length-1,bisect_left(memo.starts,maxX));
    // Coordicate conversion
    for (let i=startIndex; i<=endIndex; i++) {
      memo.startDomXs[i] = toDomXCoord_Linear(width,minX,maxX,memo.starts[i]);
      memo.endDomXs[i] =  toDomXCoord_Linear(width,minX,maxX,memo.ends[i]);
    }
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,width,height);
    // Plot
    this.plotProcedureTexts(ctx,width,height,memo.bitmaps,memo.startDomXs,startIndex,endIndex);
    ctx.globalAlpha = 0.3;
    this.plotProcedureLines(ctx,width,height,memo.startDomXs,memo.endDomXs,memo.styles,startIndex,endIndex);
  }
  
  plotProcedureTexts(ctx,width,height,bitmaps,startDomXs,startIndex,endIndex) {
    for (let i=startIndex; i<=endIndex; i++){
      let bitmap = bitmaps[i];
      let domStartX = startDomXs[i];
      ctx.drawImage(bitmap,domStartX-bitmap.width-5,5);
    }
  }
  
  plotProcedureLines(ctx,width,height,startDomXs,endDomXs,styles,startIndex,endIndex) {
    let linePlotter = { 0:this.plotLine_style0,
                        1:this.plotLine_style1,
                        2:this.plotLine_style2
                        };
    for (let i=startIndex; i<=endIndex; i++){
      let startDomX = startDomXs[i];
      let endDomX = endDomXs[i];
      let style = styles[i];
      linePlotter[style](ctx,width,height,startDomX,endDomX);
    }
  }
  
  createTextBitmap_style0(text) {
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "10px Sans";
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
    ctx.lineWidth = Math.max(endDomX-startDomX,0.5);
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
  
  plotLine_style1(ctx,width,height,startDomX,endDomX) {
    ctx.lineWidth = Math.max(endDomX-startDomX,0.5);
    ctx.strokeStyle = "orange";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
  
  plotLine_style2(ctx,width,height,startDomX,endDomX) {
    ctx.lineWidth = Math.max(endDomX-startDomX,0.5);
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo((endDomX+startDomX)/2,0);
    ctx.lineTo((endDomX+startDomX)/2,height);
    ctx.stroke();
  }
}

export default ProcedurePlotMain;

