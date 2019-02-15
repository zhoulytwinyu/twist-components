import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
import {LABEL_DOMY,LABEL_DOMX_OFFSET,PROCEDURE_STYLE_LUT} from "./ProcedurePlotConstants";

class ProcedurePlotMain extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { data, /*[{name,time}]*/
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
    // Fill in acronym, textStyle, lineStyle
    let preprocessedData = this.fillProcedureInfo(data,this.INFO_LUT); 
    preprocessedData = this.filterByRange(preprocessedData,minX,maxX);
    preprocessedData = this.convertToDomXCoord(preprocessedData,minX,maxX,width);
    
    let canvas = this.ref.current;
    // Clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);
    
    // Plot
    for (let {domX,lineStyle} of preprocessedData) {
      applyCanvasStyle(ctx,lineStyle);
      ctx.beginPath();
      ctx.moveTo(domX,0);
      ctx.lineTo(domX,height);
      ctx.stroke();
    }
    ctx.textAlign = "right";
    for (let {domX,name,textStyle} of preprocessedData) {
      domX = domX+LABEL_DOMX_OFFSET;
      applyCanvasStyle(ctx,textStyle);
      ctx.translate(domX,LABEL_DOMY);
      ctx.rotate(-Math.PI/2);
      ctx.fillText(name,0,0);
      ctx.rotate(Math.PI/2);
      ctx.translate(-domX,-LABEL_DOMY);
    }
  }
  
  fillProcedureInfo = memoize_one( (data,info_lut)=>{
    let ret = data.map( ({name,time})=>({ time,
                                          name,
                                          ...(PROCEDURE_STYLE_LUT[name] || {lineStyle:{strokeStyle:"red"},textStyle:{font:"bold 12px Sans",fillStyle:"red"}})
                                          })
                        );
    return ret;
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
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default ProcedurePlotMain;

