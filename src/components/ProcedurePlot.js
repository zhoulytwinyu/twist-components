import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
        
class ProcedurePlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { data, /*[{name,x}]*/
          selection,
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
    let {data,
          minX,maxX,width,height} = this.props;
    let {LABEL_DOMY} = this;
    // Fill in acronym, textStyle, lineStyle
    let preprocessedData = this.fillProcedureInfo(data,this.INFO_LUT); 
    preprocessedData = preprocessedData.filter( ({time})=> (time>minX && time<maxX) );
    preprocessedData = preprocessedData.map(({time,...rest})=>({domX: this.toDomXCoord(time),
                                                                ...rest
                                                                })
                                              );
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
    for (let {domX,acronym,name,textStyle} of preprocessedData) {
      domX = domX+this.LABEL_DOMX_OFFSET;
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
                                          ...(info_lut[name] || {acronym:"!",lineStyle:{strokeStyle:"red"},textStyle:{font:"bold 12px Sans",fillStyle:"red"}})
                                          })
                        );
    return ret;
  });
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

ProcedurePlot.prototype.INFO_LUT = {};
ProcedurePlot.prototype.LABEL_DOMY = 5;
ProcedurePlot.prototype.LABEL_DOMX_OFFSET = -5;

export default ProcedurePlot;

