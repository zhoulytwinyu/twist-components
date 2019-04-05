import React, { PureComponent } from 'react';
import {toDomXCoord_Linear} from "plot-utils";
// Import constants
import ProcedureObject, {compareProcedureObjects} from "./ProcedureObject";

class ProceduresPlot extends PureComponent {
  constructor(props){
    super(props);
    this.ref = React.createRef();
  }

  render() {
    let { height,width } = this.props;
    return (
      <canvas ref={this.ref} height={height} width={width} style={{display:"block",width:width,height:height}}></canvas>
    );
  }

  componentDidMount(){
    this.draw();
  }
  
  componentDidUpdate(){
    this.draw();
  }
  
  draw() {
    let { data,selection,
          minX,maxX,width,height} = this.props;
    // Column index data and fill bitmaps etc.
    this.render_memo = this.render_memo || {};
    let memo = this.render_memo;
    if (memo.data !== data ) {
      memo.data = data;
      memo.ProcedureObjectCollection = data.map( (obj)=>new ProcedureObject(obj) )
                                            .sort(compareProcedureObjects);
    }
    // Clear plots
    let canvas = this.ref.current;
    let ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1;
    ctx.clearRect(0,0,width,height);
    // Plot
    for (let obj of memo.ProcedureObjectCollection) {
      if (obj.start > maxX || obj.end < minX) {
        continue;
      }
      let startDomX = toDomXCoord_Linear(width,minX,maxX,obj.start);
      let endDomX = toDomXCoord_Linear(width,minX,maxX,obj.end);
      if (obj.id === selection) {
        obj.drawSelected(ctx,width,height,startDomX,endDomX);
      }
      else {
        obj.draw(ctx,width,height,startDomX,endDomX);
      }
    }
  }
}

export default ProceduresPlot;

