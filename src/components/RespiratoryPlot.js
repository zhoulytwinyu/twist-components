import React, { PureComponent } from "react";
import {bisect_left, bisect_right} from "bisect";
import {toDomXCoord_Linear,
        toDomYCoord_Linear,
        getRotatedAxisCoordinate,
        stepLinePlot,
        stepFillPlot} from "plot-utils";

class RespPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
    this.memo = {};
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
    if (memo.respiratoryScores !== respiratoryScores){
      memo.respiratoryScores = respiratoryScores;
      memo.respiratoryScores_times = respiratoryScores.map(({time})=>time);
      memo.respiratoryScores_RespiratorySupportScores = respiratoryScores.map(({RespiratorySupportScore})=>RespiratorySupportScore);
      memo.respiratoryScores_ECMOScores = respiratoryScores.map(({ECMOScore})=>ECMOScore);
    }
    if (memo.iNO !== iNO){
      memo.iNO = iNO;
      memo.iNO_starts = iNO.map(({start})=>start);
      memo.iNO_ends = iNO.map(({end})=>end);
    }
    if (memo.anesthetics !== anesthetics){
      memo.anesthetics = anesthetics;
      memo.anesthetics_starts = anesthetics.map(({start})=>start);
      memo.anesthetics_ends = anesthetics.map(({end})=>end);
    }
    // Filter data
    let respiratoryScores_startIndex = Math.max(0,bisect_left(memo.respiratoryScores_times,minX));
    let respiratoryScores_endIndex = Math.min(respiratoryScores.length-1,bisect_right(memo.respiratoryScores_times,maxX));
    let iNO_startIndex = Math.max(0,bisect_right(memo.iNO_ends,minX));
    let iNO_endIndex = Math.min(iNO.length-1,bisect_left(memo.iNO_starts,maxX));
    let anesthetics_startIndex = Math.max(0,bisect_right(memo.anesthetics_ends,minX));
    let anesthetics_endIndex = Math.min(anesthetics.length-1,bisect_left(memo.anesthetics_starts,maxX));
    // Coordinate transform (use memo to reuse objects and arrays)
    let respiratoryScores_domXs = memo.respiratoryScores_times.slice(respiratoryScores_startIndex,respiratoryScores_endIndex+1).map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let respiratoryScores_RespiratorySupportScoreDomYs = memo.respiratoryScores_RespiratorySupportScores.slice(respiratoryScores_startIndex,respiratoryScores_endIndex+1).map((x)=>toDomYCoord_Linear(height,minY,maxY,x));
    let respiratoryScores_ECMOScoreDomYs = memo.respiratoryScores_ECMOScores.slice(respiratoryScores_startIndex,respiratoryScores_endIndex+1).map((x)=>toDomYCoord_Linear(height,minY,maxY,x));
    let iNO_startDomXs = memo.iNO_starts.slice(iNO_startIndex,iNO_endIndex+1).map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let iNO_endDomXs = memo.iNO_ends.slice(iNO_startIndex,iNO_endIndex+1).map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let anesthetics_startDomXs = memo.anesthetics_starts.slice(anesthetics_startIndex,anesthetics_endIndex+1).map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    let anesthetics_endDomXs = memo.anesthetics_ends.slice(anesthetics_startIndex,anesthetics_endIndex+1).map((x)=>toDomXCoord_Linear(width,minX,maxX,x));
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    // Draw plot
    ctx.fillStyle="rgba(0,0,230,0.2)";
    stepFillPlot( ctx,
                  respiratoryScores_domXs,
                  respiratoryScores_RespiratorySupportScoreDomYs,
                  toDomYCoord_Linear(height,minY,maxY,0),
                  0,respiratoryScores_domXs.length-1);
    this.shadeINO(ctx,width,height,
                  iNO_startDomXs,
                  iNO_endDomXs
                  );
    this.shadeAnesthetics(ctx,width,height,
                          anesthetics_startDomXs,
                          anesthetics_endDomXs
                          );
    ctx.strokeStyle="rgb(0,0,230)";
    stepLinePlot( ctx,
                  respiratoryScores_domXs,
                  respiratoryScores_RespiratorySupportScoreDomYs
                  );
    ctx.strokeStyle="rgb(230,0,0)";
    stepLinePlot( ctx,
                  respiratoryScores_domXs,
                  respiratoryScores_ECMOScoreDomYs
                  );
  }
  
  createPatternTextBitmap(text){
    let {memo} = this;
    memo._textBitmaps = memo.textBitmaps || {};
    if (!(text in memo._textBitmaps)) {
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
      memo._textBitmaps[text] = canvas;
    }
    return memo._textBitmaps[text];
  }
  
  createTextPatternBitmap(text,width,height){
    let rotation = -Math.atan2(height,width);
    let canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext("2d");
    let patch = this.createPatternTextBitmap(text);
    ctx.rotate(rotation);
    let {x:centerX_upper,y:centerY_upper} = getRotatedAxisCoordinate(width/2,0,rotation);
    ctx.drawImage(patch,centerX_upper-patch.width/2,centerY_upper-patch.height/2);
    let {x:centerX_left,y:centerY_left} = getRotatedAxisCoordinate(0,height/2,rotation);
    ctx.drawImage(patch,centerX_left-patch.width/2,centerY_left-patch.height/2);
    let {x:centerX_right,y:centerY_right} = getRotatedAxisCoordinate(width,height/2,rotation);
    ctx.drawImage(patch,centerX_right-patch.width/2,centerY_right-patch.height/2);
    let {x:centerX_lower,y:centerY_lower} = getRotatedAxisCoordinate(width/2,height,rotation);
    ctx.drawImage(patch,centerX_lower-patch.width/2,centerY_lower-patch.height/2);
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
    let {memo} = this;
    memo._iNOBackdrop = memo._iNOBackdrop || document.createElement("canvas");
    if (memo._iNOWidth !== width || memo._iNOHeight !== height) {
      memo._iNOWidth = width;
      memo._iNOHeight = height;
      memo._iNOBackdrop = this.createTextPatternBackdropBitmap("iNO",30,60,width,height);
    }
    return memo._iNOBackdrop;
  }
  
  createAnestheticsBackdropBitmap(width,height){
    let {memo} = this;
    memo._anestheticsBackdrop = memo._anestheticsBackdrop || document.createElement("canvas");
    if (memo._anestheticsWidth !== width || memo._anestheticsHeight !== height) {
      memo._anestheticsWidth = width;
      memo._anestheticsHeight = height;
      memo._anestheticsBackdrop = this.createTextPatternBackdropBitmap("Anesthetics",60,180,width,height);
    }
    return memo._anestheticsBackdrop;
  }
  
  // Special plotters
  shadeINO (ctx, width, height, iNOStartDomXs, iNOEndDomXs) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle="red";
    //~ let backdropBitmap = this.createINOBackdropBitmap(width,height);
    for (let i=0; i<iNOStartDomXs.length; i++) {
      let startDomX = Math.round(Math.max(0,iNOStartDomXs[i]));
      let endDomX = Math.round(Math.min(width,iNOEndDomXs[i]));
      let drawWidth = endDomX-startDomX;
      if (drawWidth===0) {
        continue;
      }
      ctx.fillRect(startDomX,0,drawWidth,height);
      //~ ctx.drawImage(backdropBitmap,
                    //~ startDomX,0,drawWidth,height,
                    //~ startDomX,0,drawWidth,height);
    }
    ctx.restore();
  }
  
  shadeAnesthetics (ctx, width, height, anestheticsStartDomXs, anestheticsEndDomXs) {
    ctx.save();
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle="#00aa00";
    //~ let backdropBitmap = this.createAnestheticsBackdropBitmap(width,height);
    for (let i=0; i<=anestheticsStartDomXs.length; i++) {
      let startDomX = Math.round(Math.max(0,anestheticsStartDomXs[i]));
      let endDomX = Math.round(Math.min(width,anestheticsEndDomXs[i]));
      let drawWidth = endDomX-startDomX;
      if (drawWidth===0) {
        continue;
      }
      ctx.fillRect(startDomX,0,drawWidth,height);
      //~ ctx.drawImage(backdropBitmap,
                    //~ startDomX,0,drawWidth,height,
                    //~ startDomX,0,drawWidth,height);
    }
    ctx.restore();
  }
}

export default RespPlot;
