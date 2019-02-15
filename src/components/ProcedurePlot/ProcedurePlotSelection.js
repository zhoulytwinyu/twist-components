import React, { PureComponent } from 'react';
import {memoize_one} from "memoize";
import {toDomXCoord_Linear,
        applyCanvasStyle} from "plot-utils";
import {LABEL_DOMY,LABEL_DOMX_OFFSET,PROCEDURE_STYLE_LUT} from "./ProcedurePlotConstants";
        
class ProcedurePlotSelection extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { selection, /*{name,time}*/
          hoverX,
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
    let { selection,
          minX,maxX,width,height} = this.props;
    let canvas = this.ref.current;
    // clear plots
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,width,height);

    // plot selection
    ctx.textAlign = "right";
    if (selection===null || selection===undefined) {
      return;
    }
    let {time,name} = selection;
    let domX = this.toDomXCoord(time);
    let info = PROCEDURE_STYLE_LUT[name] || {lineStyle:{strokeStyle:"red"},textStyle:{font:"bold 12px Sans",fillStyle:"red"}};
    let textStyle = { ...info.textStyle, fillStyle:"white", strokeStyle:info.textStyle.fillStyle};
    domX = domX+LABEL_DOMX_OFFSET;
    applyCanvasStyle(ctx,textStyle);
    ctx.translate(domX,LABEL_DOMY);
    ctx.rotate(-Math.PI/2);
    ctx.lineWidth=2;
    ctx.strokeText(name,0,0);
    ctx.fillText(name,0,0);
    ctx.rotate(Math.PI/2);
    ctx.translate(-domX,-LABEL_DOMY);
  }
  
  toDomXCoord(dataX) {
    let {minX,maxX,width} = this.props;
    return toDomXCoord_Linear(width,minX,maxX,dataX);
  }
}

export default ProcedurePlotSelection;

