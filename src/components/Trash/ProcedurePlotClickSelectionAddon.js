import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
        
class ProcedurePlotClickSelectionAddon extends PureComponent {
  constructor(props) {
    super(props);
    this.lastClickTimeStamp = null;
  }
  
  render() {
    return null;
  }

  componentDidUpdate(){
    let {clickTimeStamp} = this.props;
    if (this.lastClickTimeStamp === clickTimeStamp) {
      return;
    }
    else {
      this.lastClickTimeStamp=clickTimeStamp
      this.select();
    }
  }
  
  select() {
    let {clickDomX, clickDomY,
        data,
        minX,maxX,width,height} = this.props;
    if ( clickDomX === null ||
         clickDomX === undefined ||
         clickDomY === null ||
         clickDomY === undefined) {
      this.updateSelection({selection:null});
      return;
    }
    let {LABEL_DOMY} = this;
    // Filling in textStyle, etc
    let preprocessedData = this.fillIndex(data);
    preprocessedData = this.fillProcedureInfo(preprocessedData,this.INFO_LUT);
    preprocessedData = this.filterByRange(preprocessedData,minX,maxX);
    preprocessedData = this.convertToDomXCoord(preprocessedData,minX,maxX,width);
    let pickingCanvases = this.createPickingCanvases(minX,maxX,width,height,preprocessedData);
    let selection = null;
    for (let {canvas,_index} of pickingCanvases.reverse()) {
      let ctx = canvas.getContext("2d");
      let rgba = ctx.getImageData(clickDomX,clickDomY,1,1)["data"];
      if (rgba[0]===1) {
        selection = data[_index];
      }
    }
    this.updateSelection(selection);
  }
  
  fillIndex = memoize_one( (data)=>{
    return data.map((row,i) => ({ ...row,
                                  _index:i
                                  })
                    );
  });
  
  fillProcedureInfo = memoize_one( (data,info_lut)=>{
    return data.map( ({name,...rest})=>({ ...rest,
                                          name,
                                          ...(info_lut[name] || {textStyle:{font:"bold 12px Sans"}})
                                          })
                      );
  });
  
  filterByRange = memoize_one( (data,minX,maxX)=>{
    return data.filter( ({time})=>(time>minX && time<=maxX)
                        );
  });
  
  convertToDomXCoord = memoize_one( (data,minX,maxX,width)=>{
    return data.map(({time,...rest})=> ({ ...rest,
                                          domX: toDomXCoord_Linear(width,minX,maxX,time)
                                          })
                    );
  });
  
  createPickingCanvases = memoize_one((minX,maxX,width,height,data)=>{
    let pickingCanvases = data.map( ({_index,...record}) => { 
      let canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      let ctx = canvas.getContext("2d");
      ctx.fillStyle="rgb(1,1,1)";
      this.draw(canvas,record);
      return {canvas,_index};
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
    ctx.fillRect(0,
                 -10,
                 -textMetrics.width,
                 20
                 );
    ctx.rotate(Math.PI/2);
    ctx.translate(-domX,-this.LABEL_DOMY);
  }
  
  updateSelection(selection){
    if (!this.memo) {
      this.memo = {};
    }
    if (this.memo.selection !== selection) {
      let {selectHandler} = this.props;
      selectHandler({selection});
    }
  }
}

ProcedurePlotClickSelectionAddon.prototype.INFO_LUT = {};
ProcedurePlotClickSelectionAddon.prototype.LABEL_DOMY = 5;
ProcedurePlotClickSelectionAddon.prototype.LABEL_DOMX_OFFSET = -5;

export default ProcedurePlotClickSelectionAddon;
