import React, { PureComponent } from "react";
import {bisect_left, bisect_right} from "bisect";
import {rowIndexedToColumnIndexed,
        toDomXCoord_Linear,
        toDomYCoord_Linear,
        getRotatedAxisCoordinate,
        stepLinePlot,
        stepFillPlot} from "plot-utils";

class RespPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
    this.memo.prevRespiratoryScores = null;
    this.memo.respiratoryScores_times = [];
    this.memo.respiratoryScores_RespiratorySupportScores = [];
    this.memo.respiratoryScores_ECMOScores = [];
    this.memo.prevINO = null;
    this.memo.iNO_starts = [];
    this.memo.iNO_ends = [];
    this.memo.prevAnesthetics = null;
    this.memo.anesthetics_starts = [];
    this.memo.anesthetics_ends = [];
    this.memo.respiratoryScores_domXs = [];
    this.memo.respiratoryScores_RespiratorySupportScoreDomYs = [];
    this.memo.respiratoryScores_ECMOScoreDomYs = [];
    this.memo.iNO_startDomXs = [];
    this.memo.iNO_endDomXs = [];
    this.memo.anesthetics_startDomXs = [];
    this.memo.anesthetics_endDomXs = [];
  }

  render() {
    let { respiratoryScores, /*[{time,RespiratorySupportScore,ECMOScore}]*/
          iNO, /*[{start,end}]*/
          anesthetics, /*[{start,end}]*/
          minX,maxX,width,
          minY,maxY,height,
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
    let { respiratoryScores,
          iNO,
          anesthetics,
          minX,maxX,width,
          minY,maxY,height
          } = this.props;
    let {memo} = this;
    // Memoize columns
    if (memo.prevRespiratoryScores !== respiratoryScores){
      memo.prevRespiratoryScores = respiratoryScores;
      memo.respiratoryScores_times.length = respiratoryScores.length;
      memo.respiratoryScores_RespiratorySupportScores.length = respiratoryScores.length;
      memo.respiratoryScores_ECMOScores.length = respiratoryScores.length;
      for (let i=0; i<respiratoryScores.length; i++){
        memo.respiratoryScores_times[i] = respiratoryScores[i]["time"];
        memo.respiratoryScores_RespiratorySupportScores[i] = respiratoryScores[i]["RespiratorySupportScore"];
        memo.respiratoryScores_ECMOScores[i] = respiratoryScores[i]["ECMOScore"];
      }
    }
    if (memo.prevINO !== iNO){
      memo.prevINO = iNO;
      for (let i=0; i<iNO.length; i++){
        memo.iNO_starts[i] = iNO[i]["start"];
        memo.iNO_ends[i] = iNO[i]["end"];
      }
    }
    if (memo.prevAnesthetics !== anesthetics){
      memo.prevAnesthetics = anesthetics;
      for (let i=0; i<anesthetics.length; i++){
        memo.anesthetics_starts[i] = anesthetics[i]["start"];
        memo.anesthetics_ends[i] = anesthetics[i]["end"];
      }
    }
    // Filter data
    let respiratoryScores_startIndex = Math.max(0,bisect_left(memo.respiratoryScores_times,minX));
    let respiratoryScores_endIndex = Math.min(respiratoryScores.length-1,bisect_right(memo.respiratoryScores_times,maxX));
    let iNO_startIndex = Math.max(0,bisect_right(memo.iNO_ends,minX));
    let iNO_endIndex = Math.min(iNO.length-1,bisect_left(memo.iNO_starts,maxX));
    let anesthetics_startIndex = Math.max(0,bisect_right(memo.anesthetics_ends,minX));
    let anesthetics_endIndex = Math.min(anesthetics.length-1,bisect_left(memo.anesthetics_starts,maxX));
    // Coordinate transform (use memo to reuse objects and arrays)
    for (let i=respiratoryScores_startIndex; i<=respiratoryScores_endIndex; i++){
      memo.respiratoryScores_domXs[i] = toDomXCoord_Linear(width,minX,maxX,memo.respiratoryScores_times[i]);
      memo.respiratoryScores_RespiratorySupportScoreDomYs[i] = toDomYCoord_Linear(height,minY,maxY,memo.respiratoryScores_RespiratorySupportScores[i]);
      memo.respiratoryScores_ECMOScoreDomYs[i] = toDomYCoord_Linear(height,minY,maxY,memo.respiratoryScores_ECMOScores[i]);
    }
    for (let i=respiratoryScores_startIndex; i<=respiratoryScores_endIndex; i++){
      memo.respiratoryScores_domXs[i] = toDomXCoord_Linear(width,minX,maxX,memo.respiratoryScores_times[i]);
      memo.respiratoryScores_RespiratorySupportScoreDomYs[i] = toDomYCoord_Linear(height,minY,maxY,memo.respiratoryScores_RespiratorySupportScores[i]);
      memo.respiratoryScores_ECMOScoreDomYs[i] = toDomYCoord_Linear(height,minY,maxY,memo.respiratoryScores_ECMOScores[i]);
    }
    for (let i=iNO_startIndex; i<=iNO_endIndex; i++){
      memo.iNO_startDomXs[i] = toDomXCoord_Linear(width,minX,maxX,memo.iNO_starts[i]);
      memo.iNO_endDomXs[i] = toDomXCoord_Linear(height,minY,maxY,memo.iNO_ends[i]);
    }
    for (let i=anesthetics_startIndex; i<=anesthetics_endIndex; i++){
      memo.anesthetics_startDomXs[i] = toDomXCoord_Linear(width,minX,maxX,memo.anesthetics_starts[i]);
      memo.anesthetics_endDomXs[i] = toDomXCoord_Linear(height,minY,maxY,memo.anesthetics_ends[i]);
    }
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw plot
    ctx.fillStyle="rgba(0,0,230,0.2)";
    stepFillPlot( ctx,
                  memo.respiratoryScores_domXs,
                  memo.respiratoryScores_RespiratorySupportScoreDomYs,
                  toDomYCoord_Linear(height,minY,maxY,0),
                  respiratoryScores_startIndex,respiratoryScores_endIndex);
    this.shadeINO(ctx,width,height,
                  memo.iNO_startDomXs,
                  memo.iNO_endDomXs,
                  iNO_startIndex,
                  iNO_endIndex,
                  );
    this.shadeAnesthetics(ctx,width,height,
                          memo.anesthetics_startDomXs,
                          memo.anesthetics_endDomXs,
                          anesthetics_startIndex,
                          anesthetics_endIndex
                          );
    ctx.strokeStyle="rgb(0,0,230)";
    stepLinePlot( ctx,
                  memo.respiratoryScores_domXs,
                  memo.respiratoryScores_RespiratorySupportScoreDomYs,
                  respiratoryScores_startIndex,respiratoryScores_endIndex);
    ctx.strokeStyle="rgb(230,0,0)";
    stepLinePlot( ctx,
                  memo.respiratoryScores_domXs,
                  memo.respiratoryScores_ECMOScoreDomYs,
                  respiratoryScores_startIndex,respiratoryScores_endIndex);
  }
  
  createPatternTextBitmap(text){
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "bold 10px Sans";
    let width = ctx.measureText(text).width;
    let height = 12;
    canvas.width = width;
    canvas.height = height;
    ctx.font = "bold 10px Sans";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text,width/2,height/2);
    return canvas;
  }
  
  createTextPatternBitmap(text,width,height){
    let rotation = -Math.atan2(height,width);
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    let iNOPatch = this.createPatternTextBitmap(text);
    ctx.rotate(rotation);
    let {x:centerX_upper,y:centerY_upper} = getRotatedAxisCoordinate(width/2,0,rotation);
    ctx.drawImage(iNOPatch,centerX_upper-iNOPatch.width/2,centerY_upper-iNOPatch.height/2);
    let {x:centerX_left,y:centerY_left} = getRotatedAxisCoordinate(0,height/2,rotation);
    ctx.drawImage(iNOPatch,centerX_left-iNOPatch.width/2,centerY_left-iNOPatch.height/2);
    let {x:centerX_right,y:centerY_right} = getRotatedAxisCoordinate(width,height/2,rotation);
    ctx.drawImage(iNOPatch,centerX_right-iNOPatch.width/2,centerY_right-iNOPatch.height/2);
    let {x:centerX_lower,y:centerY_lower} = getRotatedAxisCoordinate(width/2,height,rotation);
    ctx.drawImage(iNOPatch,centerX_lower-iNOPatch.width/2,centerY_lower-iNOPatch.height/2);
    return canvas;
  }
  
  createTextPatternBackdropBitmap(text,unitWidth,unitHeight,width,height){
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    let patternBitmap = this.createTextPatternBitmap(text,unitWidth,unitHeight);
    let pattern = ctx.createPattern(patternBitmap,"repeat");
    ctx.fillStyle = pattern;
    ctx.fillRect(0,0,width,width);
    return canvas;
  }
  
  createINOBackdropBitmap(width,height){
    if (this.memo.prevWidth !== width || this.memo.prevHeight !== height) {
      this.memo.iNO_backgropBitmap = this.createTextPatternBackdropBitmap("iNO",30,60,width,height);
    }
    return this.memo.iNO_backgropBitmap;
  }
  
  createAnestheticsBackdropBitmap(width,height){
    if (this.memo.prevWidth !== width || this.memo.prevHeight !== height) {
      this.memo.anesthetics_backgropBitmap = this.createTextPatternBackdropBitmap("ANE",30,60,width,height);
    }
    return this.memo.anesthetics_backgropBitmap;
  }
  
  // Special plotters
  shadeINO (ctx, width, height, iNOStartDomXs, iNOEndDomXs, startIndex, endIndex) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle="red";
    let backdropBitmap = this.createINOBackdropBitmap(width,height);
    for (let i=startIndex; i<=endIndex; i++) {
      let startDomX = Math.round(Math.max(0,iNOStartDomXs[i]));
      let endDomX = Math.round(Math.min(width,iNOEndDomXs[i]));
      let drawWidth = endDomX-startDomX;
      if (drawWidth===0) {
        continue;
      }
      ctx.fillRect(startDomX,0,drawWidth,height);
      ctx.drawImage(backdropBitmap,
                    startDomX,0,drawWidth,height,
                    startDomX,0,drawWidth,height);
    }
    ctx.restore();
  }
  
  shadeAnesthetics (ctx, width, height, anestheticsStartDomXs, anestheticsEndDomXs, startIndex, endIndex) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle="#00aa00";
    let backdropBitmap = this.createAnestheticsBackdropBitmap(width,height);
    for (let i=startIndex; i<=endIndex; i++) {
      let startDomX = Math.round(Math.max(0,anestheticsStartDomXs[i]));
      let endDomX = Math.round(Math.min(width,anestheticsEndDomXs[i]));
      let drawWidth = endDomX-startDomX;
      if (drawWidth===0) {
        continue;
      }
      ctx.fillRect(startDomX,0,drawWidth,height);
      ctx.drawImage(backdropBitmap,
                    startDomX,0,drawWidth,height,
                    startDomX,0,drawWidth,height);
    }
    ctx.restore();
  }
}

export default RespPlot;
