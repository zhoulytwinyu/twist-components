import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
        
class ProcedurePlotClickSelectionAddon extends PureComponent {
  render() {
    return null;
  }

  componentDidMount(){
    this.select();
  }
  
  componentDidUpdate(){
    this.select();
  }
  
  select() {
    let {clickDomX, clickDomY,
        data,
        minX,maxX,width,height} = this.props;
    if ( clickDomX === null ||
         clickDomX === undefined ||
         clickDomY === null ||
         clickDomY === undefined ) {
      this.updateSelection({selection:null});
      return;
    }
    let {LABEL_DOMY} = this;
    // Fill in acronym, textStyle, lineStyle
    let DataWithId = this.fillId(data);
    let preprocessedData = this.fillProcedureInfo(DataWithId,this.INFO_LUT); 
    preprocessedData = preprocessedData.filter( ({time})=> (time>minX && time<maxX) );
    preprocessedData = preprocessedData.map(({time,...rest})=>({domX: this.toDomXCoord(time),
                                                                ...rest
                                                                })
                                              );
    
    let pickingCanvases = this.createPickingCanvas(minX,maxX,width,height,preprocessedData);
    console.log(pickingCanvases);
    document.body.append(pickingCanvases.map(({canvas})=>canvas));
  }
  
  fillId = memoize_one( (data)=>{
    return data.map((row,i) => ({ ...row,
                                  _id:i
                                  })
                    );
  });
  
  fillProcedureInfo = memoize_one( (data,info_lut)=>{
    let ret = data.map( ({name,time})=>({ time,
                                          name,
                                          ...(info_lut[name] || {textStyle:{font:"bold 12px Sans"}})
                                          })
                        );
    return ret;
  });
  
  createPickingCanvases = memoize_one((minX,maxX,width,height,processedData)=>{
    let pickingCanvases = processedData.map( ({id,...rest}) => { 
      let canvas = document.createElement("canvas",{alpha:false});
      canvas.width = width;
      canvas.height = height;
      this.draw(canvas,rest);
      return {canvas,id};
      });
    return pickingCanvases;
  });
  
  draw(canvas,record){
    let {domX, name, acronym, textStyle} = record;
    let ctx = canvas.getContext("2d");
    ctx.textAlign = "right";
    domX = domX+this.LABEL_DOMX_OFFSET;
    applyCanvasStyle(ctx,textStyle);
    ctx.translate(domX,this.LABEL_DOMY);
    ctx.rotate(-Math.PI/2);
    let textMetrics = ctx.measureText(name);
    console.log(textMetrics);
    ctx.fillRect(textMetrics.actualBoundingBoxLeft,
                 textMetrics.actualBoundingBoxAscent,
                 textMetrics.width,
                 textMetrics.fontBoundingBoxAscent-textMetrics.fontBoundingBoxDescent
                 );
    ctx.rotate(Math.PI/2);
    ctx.translate(-domX,-this.LABEL_DOMY);
  }
  
  updateSelection({selection}){
    if (!this.memo) {
      this.memo = {};
    }
    if (this.memo.selection !== selection) {
      let {selectHandler} = this.props;
      selectHandler({selection});
    }
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

ProcedurePlotClickSelectionAddon.prototype.INFO_LUT = {};
ProcedurePlotClickSelectionAddon.prototype.LABEL_DOMY = 5;
ProcedurePlotClickSelectionAddon.prototype.LABEL_DOMX_OFFSET = -5;

export default ProcedurePlotClickSelectionAddon;
